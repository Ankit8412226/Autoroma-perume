const path = require('path');
const PlotMap = require('../models/PlotMap');
const { uploadToS3 } = require('./s3Service');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  normalizeExtractedPlot,
  normalizeProjectMeta,
  parseGeminiPayload
} = require('../utils/plotFromOcr');

const OCR_PROMPT = `You are a production real-estate naksha / site-plan OCR engine.

Read ONLY what is printed on this image. Never invent plot numbers, sizes, roads, or amenities that are not visible.

Return STRICT JSON only (no markdown) in this shape:
{
  "projectMeta": {
    "location": "address text if printed, else empty",
    "surveyNumber": "",
    "village": "",
    "highlights": ["only bullets printed on the sheet"],
    "locationAdvantages": [{"distance":"45 minutes","landmark":"Airport"}],
    "amenities": ["only facilities printed on the sheet"]
  },
  "plots": [
    {
      "plotNo": "exact label on the plot box",
      "block": "A or B if labeled",
      "dimensions": "30x50 if printed, else empty",
      "sizeSqft": 0,
      "superBuiltUpSqft": 0,
      "sellableSqYrd": 0,
      "facing": "Park / Garden / Corner / Road if readable from labels or PLC notes, else empty",
      "plotType": "SIMPLE or CORNER or PARK_FACING or GARDEN_FACING or ROAD_FACING",
      "plc12mtr": 0,
      "plc9mtr": 0,
      "plcCorner": 0,
      "plcParkFacing": 0,
      "markerXPercent": 12.5,
      "markerYPercent": 44.0,
      "polygonPoints": [{"xPercent":10,"yPercent":40},{"xPercent":15,"yPercent":40},{"xPercent":15,"yPercent":48},{"xPercent":10,"yPercent":48}],
      "confidence": 0.9
    }
  ]
}

Rules:
1. Extract EVERY numbered plot box you can read. Skip site office / other site / roads / parks that are not sale plots.
2. markerXPercent / markerYPercent = center of that plot box as a percent of the FULL image (0-100). This must sit on the real box.
3. polygonPoints must also use xPercent/yPercent of the FULL image, not a fake canvas.
4. If area is printed as sq.yd, fill sellableSqYrd. If sq.ft, fill sizeSqft. If WxD, fill dimensions and compute sizeSqft = W*D.
5. status is not needed. All new inventory is AVAILABLE until a sale is recorded in the CRM.
6. Do not guess missing numbers. Use 0 or empty string.
7. Return valid JSON only.`;

function mimeFromFileName(fileName, fallback = 'image/jpeg') {
  const ext = path.extname(fileName || '').toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.pdf') return 'application/pdf';
  return fallback;
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
  return JSON.parse(cleanJson);
}

async function processMapImageOCR({ projectId, mapName, fileBuffer, fileName, mimeType }) {
  if (!fileBuffer) {
    const error = new Error('Naksha image file is required for OCR');
    error.statusCode = 400;
    throw error;
  }

  const resolvedMime = mimeType || mimeFromFileName(fileName);
  const uploadResult = await uploadToS3(fileBuffer, fileName, resolvedMime, 'naksa_layouts');
  const s3ImageUrl = typeof uploadResult === 'string' ? uploadResult : (uploadResult?.url || '');
  const imageS3Key = typeof uploadResult === 'string' ? '' : (uploadResult?.key || '');

  let extractedPlots = [];
  let projectMeta = {};
  let overallConfidence = 0;
  let usedAI = false;

  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured. OCR cannot invent plot inventory.');
    error.statusCode = 503;
    throw error;
  }

  const preferredModel = process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash';
  const fallbackModels = Array.from(new Set([
    preferredModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ]));

  for (const modelName of fallbackModels) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      const imagePart = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: resolvedMime === 'application/pdf' ? 'application/pdf' : resolvedMime
        }
      };

      const result = await model.generateContent([OCR_PROMPT, imagePart]);
      const parsed = parseModelJson(result.response.text());
      const payload = parseGeminiPayload(parsed);
      const normalized = payload.plots.map((plot, index) => normalizeExtractedPlot(plot, index)).filter(Boolean);

      if (normalized.length > 0) {
        extractedPlots = normalized;
        projectMeta = normalizeProjectMeta(payload.projectMeta);
        overallConfidence = 0.95;
        usedAI = true;
        console.log(`[OCR] Gemini (${modelName}) extracted ${normalized.length} plots`);
        break;
      }
    } catch (aiError) {
      console.warn(`[OCR] Gemini (${modelName}) attempt warning:`, aiError.message);
    }
  }

  if (extractedPlots.length === 0) {
    const error = new Error('AI could not read plot numbers from this naksha. Upload a clearer layout image.');
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
    confidenceScore: overallConfidence,
    status: 'PENDING_REVIEW'
  });

  return {
    mapId: plotMapRecord._id,
    mapName: plotMapRecord.mapName,
    imageUrl: plotMapRecord.imageUrl,
    imageS3Key,
    confidenceScore: overallConfidence,
    requiresHumanReview: true,
    usedAI,
    isSample: false,
    extractedPlots,
    projectMeta
  };
}

module.exports = {
  processMapImageOCR
};
