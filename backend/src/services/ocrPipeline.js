const path = require('path');
const sharp = require('sharp');
const PlotMap = require('../models/PlotMap');
const { uploadToS3 } = require('./s3Service');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  normalizeExtractedPlot,
  normalizeProjectMeta,
  parseGeminiPayload,
  finalizeExtractedPlots
} = require('../utils/plotFromOcr');

const PLOT_TILE_PROMPT = `You are an expert real-estate site-plan extractor.

This is a ZOOMED slice of a township naksha. Extract EVERY individual saleable plot rectangle in this tile.

Primary fields per plot:
1. area (100 sq.yd, 400 Sq.Yd., 215 sq.yd, etc.)
2. status: SOLD or AVAILABLE
3. block (A or B if visible)
4. center of the plot box

IMPORTANT RULES:
- Inspect the whole tile. Do NOT skip small plots. Do NOT merge adjacent plots.
- Treat every visually separated pale/yellow/green box as one plot.
- Read text inside each plot carefully.
- If "SOLD" or "SOLD OUT" is written inside or across a plot, status = "SOLD".
- If the plot has no SOLD stamp, status = "AVAILABLE".
- Never guess a plot number or area. If unreadable, leave plotNo empty and put whatever area text you can read in label.
- Leave plotNo empty unless a real plot number (not an area) is printed.
- Ignore roads, Site Office, Other Site, parks, logos, marketing text.
- Do not count SITE OFFICE or OTHER SITE as plots.

Return STRICT JSON only. No markdown.
{
  "plots": [
    {
      "label": "400 Sq.Yd.",
      "plotNo": "",
      "block": "B",
      "sellableSqYrd": 400,
      "status": "AVAILABLE",
      "markerXPercent": 12.4,
      "markerYPercent": 48.1
    }
  ]
}

Rules:
1. One object per saleable rectangle. Typical tiles have 6-20 plots.
2. markerXPercent / markerYPercent = center of that box as a percent of THIS TILE (0-100).
3. status must be "SOLD" or "AVAILABLE".
4. Valid JSON only.`;

const SOLD_STAMP_PROMPT = `You are reading a township naksha for SOLD stamps only.

Find every saleable plot box that has the word SOLD or SOLD OUT printed on it.
Ignore roads, Site Office, Other Site, and plots with no SOLD text.

Return STRICT JSON only:
{
  "plots": [
    {
      "label": "400 Sq.Yd.",
      "sellableSqYrd": 400,
      "status": "SOLD",
      "markerXPercent": 18.2,
      "markerYPercent": 51.4
    }
  ]
}

markerXPercent / markerYPercent = center of the SOLD plot as a percent of THIS image (0-100).
If no plot is sold, return {"plots":[]}. Never invent SOLD.`;

const META_PROMPT = `Read only the marketing text on this township sheet. Return STRICT JSON:
{
  "projectMeta": {
    "location": "",
    "surveyNumber": "",
    "village": "",
    "highlights": [],
    "locationAdvantages": [{"distance":"","landmark":""}],
    "amenities": []
  }
}
Use only printed text. No plots.`;

function buildFullCoverageTiles() {
  const columns = [
    { id: 'L', x0: 0.00, x1: 0.42 },
    { id: 'M', x0: 0.29, x1: 0.71 },
    { id: 'R', x0: 0.58, x1: 1.00 }
  ];
  const rows = [
    { id: 'T', y0: 0.00, y1: 0.42 },
    { id: 'M', y0: 0.29, y1: 0.71 },
    { id: 'B', y0: 0.58, y1: 1.00 }
  ];
  return rows.flatMap((row) => columns.map((column) => ({
    id: `${row.id}${column.id}`,
    x0: column.x0,
    x1: column.x1,
    y0: row.y0,
    y1: row.y1
  })));
}
const TILE_ATTEMPTS = 3;
const MAX_OUTPUT_TOKENS = 16384;

function mimeFromFileName(fileName, fallback = 'image/jpeg') {
  const ext = path.extname(fileName || '').toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.pdf') return 'application/pdf';
  return fallback;
}

function extractCompleteJsonObjects(text, fromIndex) {
  const objects = [];
  let cursor = fromIndex;
  while (cursor < text.length) {
    const start = text.indexOf('{', cursor);
    if (start === -1) break;
    let depth = 0;
    let end = -1;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (char === '{') depth += 1;
      if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          end = index;
          break;
        }
      }
    }
    if (end === -1) break;
    try {
      objects.push(JSON.parse(text.slice(start, end + 1)));
    } catch (_error) {
      // skip malformed fragment
    }
    cursor = end + 1;
  }
  return objects;
}

function repairTruncatedPlotsJson(responseText) {
  const text = String(responseText || '');
  const plotsKey = text.indexOf('"plots"');
  if (plotsKey === -1) return null;
  const arrayStart = text.indexOf('[', plotsKey);
  if (arrayStart === -1) return null;
  const plots = extractCompleteJsonObjects(text, arrayStart);
  if (!plots.length) return null;
  return { plots };
}

function parseModelJson(responseText) {
  let cleanJson = String(responseText || '').replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const objectStart = cleanJson.indexOf('{');
  const arrayStart = cleanJson.indexOf('[');
  if (objectStart !== -1 && (arrayStart === -1 || objectStart < arrayStart)) {
    const objectEnd = cleanJson.lastIndexOf('}');
    if (objectEnd !== -1) cleanJson = cleanJson.substring(objectStart, objectEnd + 1);
  } else if (arrayStart !== -1) {
    const arrayEnd = cleanJson.lastIndexOf(']');
    if (arrayEnd !== -1) cleanJson = cleanJson.substring(arrayStart, arrayEnd + 1);
  }
  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    const repaired = repairTruncatedPlotsJson(responseText);
    if (repaired) return repaired;
    throw error;
  }
}

function visionModels() {
  const preferredModel = process.env.GEMINI_VISION_MODEL || 'gemini-3.6-flash';
  return Array.from(new Set([
    preferredModel,
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-3-flash-preview'
  ]));
}

function isModelMissingError(error) {
  const message = String(error?.message || '');
  return message.includes('404') || message.includes('no longer available');
}

function isRateLimitError(error) {
  const message = String(error?.message || '');
  return message.includes('429') || message.includes('Too Many Requests');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateJsonFromImage({ fileBuffer, mimeType, prompt }) {
  let lastError = null;
  for (const modelName of visionModels()) {
    for (let attempt = 1; attempt <= TILE_ATTEMPTS; attempt += 1) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.1, maxOutputTokens: MAX_OUTPUT_TOKENS }
        });
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
        ]);
        return parseModelJson(result.response.text());
      } catch (error) {
        lastError = error;
        console.warn(`[OCR] Gemini (${modelName}) attempt ${attempt}:`, error.message);
        if (isModelMissingError(error)) break;
        if (isRateLimitError(error)) {
          const daily = String(error.message).includes('PerDay') || String(error.message).includes('free_tier_requests');
          if (daily) break;
          const waitMatch = String(error.message).match(/retry in (\d+)/i);
          const waitMs = ((waitMatch ? Number(waitMatch[1]) : 20) + 2) * 1000;
          console.warn(`[OCR] rate limited, waiting ${waitMs}ms`);
          await sleep(waitMs);
        }
      }
    }
  }
  throw lastError || new Error('Gemini vision failed');
}

function toGlobalPercent(localPercent, start, end) {
  const local = Number(localPercent);
  if (!Number.isFinite(local)) return null;
  return (start + (local / 100) * (end - start)) * 100;
}

async function cropTile(fileBuffer, tile, imageWidth, imageHeight) {
  const left = Math.max(0, Math.round(tile.x0 * imageWidth));
  const top = Math.max(0, Math.round(tile.y0 * imageHeight));
  const width = Math.min(imageWidth - left, Math.round((tile.x1 - tile.x0) * imageWidth));
  const height = Math.min(imageHeight - top, Math.round((tile.y1 - tile.y0) * imageHeight));
  const zoomed = await sharp(fileBuffer)
    .extract({ left, top, width, height })
    .resize({ width: Math.min(2000, width * 2), withoutEnlargement: false })
    .jpeg({ quality: 90 })
    .toBuffer();
  return zoomed;
}

async function extractPlotsFromTiles(fileBuffer) {
  const meta = await sharp(fileBuffer).metadata();
  const imageWidth = meta.width || 1;
  const imageHeight = meta.height || 1;
  const allPlots = [];
  const failedTiles = [];
  const warnings = [];
  const tiles = buildFullCoverageTiles();

  for (const tile of tiles) {
    const tileBuffer = await cropTile(fileBuffer, tile, imageWidth, imageHeight);
    try {
      const parsed = await generateJsonFromImage({
        fileBuffer: tileBuffer,
        mimeType: 'image/jpeg',
        prompt: PLOT_TILE_PROMPT
      });
      const payload = parseGeminiPayload(parsed);
      const mapped = payload.plots.map((plot, index) => {
        const localX = plot.markerXPercent ?? plot.marker?.xPercent;
        const localY = plot.markerYPercent ?? plot.marker?.yPercent;
        return normalizeExtractedPlot({
          ...plot,
          markerXPercent: toGlobalPercent(localX, tile.x0, tile.x1),
          markerYPercent: toGlobalPercent(localY, tile.y0, tile.y1)
        }, index);
      }).filter(Boolean);
      console.log(`[OCR] tile ${tile.id} extracted ${mapped.length} plots`);
      allPlots.push(...mapped);
    } catch (error) {
      failedTiles.push(tile.id);
      console.warn(`[OCR] tile ${tile.id} failed:`, error.message);
    }
  }

  if (failedTiles.length >= 3) {
    const error = new Error(`OCR incomplete (${failedTiles.join(', ')} failed). Wait a minute and analyze again so inventory is not overwritten.`);
    error.statusCode = 429;
    throw error;
  }
  if (failedTiles.length) {
    warnings.push(`Some naksha tiles failed (${failedTiles.join(', ')}). Plot count may be incomplete — review before saving.`);
  }

  const merged = finalizeExtractedPlots(allPlots);
  let soldPassFailed = false;
  const stamped = await applySoldStamps(fileBuffer, merged, {
    onError: () => { soldPassFailed = true; }
  });
  if (soldPassFailed) {
    warnings.push('SOLD stamp pass failed. Mark sold plots in the review table or on the admin map.');
  }
  return { plots: stamped, warnings };
}

async function applySoldStamps(fileBuffer, plots, options = {}) {
  try {
    const meta = await sharp(fileBuffer).metadata();
    const imageWidth = meta.width || 1;
    const imageHeight = meta.height || 1;
    const zone = { x0: 0, y0: 0, x1: 1, y1: 1 };
    const zoneBuffer = await cropTile(fileBuffer, zone, imageWidth, imageHeight);
    const parsed = await generateJsonFromImage({
      fileBuffer: zoneBuffer,
      mimeType: 'image/jpeg',
      prompt: SOLD_STAMP_PROMPT
    });
    const solds = parseGeminiPayload(parsed).plots
      .map((plot) => normalizeExtractedPlot({
        ...plot,
        status: 'SOLD',
        markerXPercent: toGlobalPercent(plot.markerXPercent ?? plot.marker?.xPercent, zone.x0, zone.x1),
        markerYPercent: toGlobalPercent(plot.markerYPercent ?? plot.marker?.yPercent, zone.y0, zone.y1)
      }))
      .filter((plot) => plot && Number.isFinite(Number(plot.marker?.xPercent)) && Number.isFinite(Number(plot.marker?.yPercent)));

    if (!solds.length) {
      console.log('[OCR] sold-stamp pass found 0 SOLD plots');
      return plots;
    }

    let marked = 0;
    const next = plots.map((plot) => {
      const match = solds.find((sold) => {
        const dx = Math.abs(Number(sold.marker.xPercent) - Number(plot.marker?.xPercent));
        const dy = Math.abs(Number(sold.marker.yPercent) - Number(plot.marker?.yPercent));
        return dx < 3.2 && dy < 2.4;
      });
      if (!match) return plot;
      marked += 1;
      return { ...plot, status: 'SOLD' };
    });
    console.log(`[OCR] sold-stamp pass marked ${marked} plots SOLD`);
    return next;
  } catch (error) {
    console.warn('[OCR] sold-stamp pass failed:', error.message);
    if (typeof options.onError === 'function') options.onError(error);
    return plots;
  }
}

async function processMapImageOCR({ projectId, mapName, fileBuffer, fileName, mimeType }) {
  if (!fileBuffer) {
    const error = new Error('Naksha image file is required for OCR');
    error.statusCode = 400;
    throw error;
  }

  const resolvedMime = mimeType || mimeFromFileName(fileName);
  if (resolvedMime === 'application/pdf') {
    const error = new Error('Upload a JPG or PNG naksha. PDF is not supported for plot OCR.');
    error.statusCode = 400;
    throw error;
  }
  const uploadResult = await uploadToS3(fileBuffer, fileName, resolvedMime, 'naksa_layouts');
  const s3ImageUrl = typeof uploadResult === 'string' ? uploadResult : (uploadResult?.url || '');
  const imageS3Key = typeof uploadResult === 'string' ? '' : (uploadResult?.key || '');

  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured. OCR cannot invent plot inventory.');
    error.statusCode = 503;
    throw error;
  }

  let projectMeta = {};
  try {
    const metaParsed = await generateJsonFromImage({
      fileBuffer,
      mimeType: resolvedMime === 'application/pdf' ? 'application/pdf' : resolvedMime,
      prompt: META_PROMPT
    });
    projectMeta = normalizeProjectMeta(metaParsed.projectMeta || metaParsed);
  } catch (error) {
    console.warn('[OCR] project meta pass failed:', error.message);
  }

  const { plots: extractedPlots, warnings: ocrWarnings } = await extractPlotsFromTiles(fileBuffer);
  if (extractedPlots.length === 0) {
    const error = new Error('AI could not read plot boxes from this naksha. Upload a clearer layout image.');
    error.statusCode = 422;
    throw error;
  }

  const plotMapRecord = await PlotMap.create({
    projectId: projectId || undefined,
    mapName: mapName || fileName || 'Site Layout Plan',
    imageUrl: s3ImageUrl,
    imageS3Key,
    vectorOverlayData: extractedPlots,
    extractedProjectMeta: projectMeta,
    confidenceScore: 0.92,
    status: 'PENDING_REVIEW'
  });

  console.log(`[OCR] merged ${extractedPlots.length} unique plots from tiles`);

  return {
    mapId: plotMapRecord._id,
    mapName: plotMapRecord.mapName,
    imageUrl: plotMapRecord.imageUrl,
    imageS3Key,
    confidenceScore: ocrWarnings.length ? 0.6 : 0.8,
    requiresHumanReview: true,
    usedAI: true,
    isSample: false,
    extractedPlots,
    ocrWarnings,
    projectMeta
  };
}

module.exports = {
  processMapImageOCR,
  applySoldStamps
};
