const { clampPercent } = require('./googleMaps');
const { computePricing } = require('../services/pricingEngine');

const SQFT_PER_SQ_YRD = 9;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const DEFAULT_STATUS = 'AVAILABLE';
const PLOT_STATUSES = ['AVAILABLE', 'BOOKED', 'PENDING', 'SOLD'];
const CRM_LOCKED_STATUSES = ['BOOKED', 'PENDING'];

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function cleanText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function sanitizeSellableArea(sqYrd, label) {
  const text = cleanText(label);
  if (/^50\.0+$/.test(text) || text === '50') return 500;
  const n = toNumber(sqYrd);
  if (n === 50) return 500;
  if (n >= 900 && n <= 3999 && Math.round(n) % 10 === 5) {
    const scaled = Number((n / 10).toFixed(2));
    if (scaled >= 80 && scaled <= 400) return scaled;
  }
  return n;
}

function parseAreaLabel(raw) {
  const text = cleanText(raw).toLowerCase().replace(/,/g, '');
  if (/^50\.0+$/.test(text) || text === '50') {
    return { sellableSqYrd: 500, sizeSqft: 4500 };
  }
  const yard = text.match(/(\d+(?:\.\d+)?)\s*(?:sq\.?\s*(?:yd|yrd|yard)s?|syd)/i);
  if (yard) {
    const sellableSqYrd = sanitizeSellableArea(Number(yard[1]), raw);
    return { sellableSqYrd, sizeSqft: Number((sellableSqYrd * SQFT_PER_SQ_YRD).toFixed(2)) };
  }
  const feet = text.match(/(\d+(?:\.\d+)?)\s*(?:sq\.?\s*(?:ft|feet)|sft)/i);
  if (feet) {
    const sizeSqft = Number(feet[1]);
    return { sizeSqft, sellableSqYrd: Number((sizeSqft / SQFT_PER_SQ_YRD).toFixed(2)) };
  }
  return { sellableSqYrd: 0, sizeSqft: 0 };
}

function parseOcrStatus(raw = {}) {
  const blob = [
    raw.status,
    raw.plotStatus,
    raw.label,
    raw.areaText,
    raw.plotNo
  ].map(cleanText).join(' ').toUpperCase();
  if (/\bSOLD\b/.test(blob) || blob.includes('SOLD OUT')) return 'SOLD';
  if (/\bBOOKED\b/.test(blob) || blob.includes('RESERVED')) return 'BOOKED';
  if (/\bPENDING\b/.test(blob)) return 'PENDING';
  const explicit = cleanText(raw.status || raw.plotStatus).toUpperCase();
  if (PLOT_STATUSES.includes(explicit)) return explicit;
  return DEFAULT_STATUS;
}

function resolveApproveStatus(existing, ocrStatus) {
  if (existing && CRM_LOCKED_STATUSES.includes(existing.status)) {
    return existing.status;
  }
  if (ocrStatus === 'SOLD') return 'SOLD';
  if (existing && existing.status === 'SOLD' && (existing.ownerName || existing.paidAmount > 0)) {
    return 'SOLD';
  }
  if (PLOT_STATUSES.includes(ocrStatus) && ocrStatus !== 'UNKNOWN') return ocrStatus;
  return DEFAULT_STATUS;
}

function looksLikeAreaCode(plotNo, sellableSqYrd, sizeSqft) {
  const n = Number(plotNo);
  if (!Number.isFinite(n) || /[A-Za-z]/.test(String(plotNo))) return false;
  if (sellableSqYrd && Math.abs(n - sellableSqYrd) < 1) return true;
  if (sizeSqft && Math.abs(n - sizeSqft) < 1) return true;
  return n >= 50 && n <= 5000;
}

function isGarbagePlotNo(rawNo) {
  const text = cleanText(rawNo);
  if (!text) return true;
  if (/sq\.?\s*(yd|yrd|ft)|syd|sft/i.test(text)) return true;
  if (/^[^a-z0-9]+$/i.test(text)) return true;
  return false;
}

function plotArea(plot) {
  return toNumber(plot.sellableSqYrd) || (toNumber(plot.sizeSqft) / SQFT_PER_SQ_YRD);
}

function inferMissingArea(plot) {
  if (plotArea(plot) > 0) return plot;
  const x = Number(plot.marker?.xPercent);
  const y = Number(plot.marker?.yPercent);
  if (x >= 22 && x <= 28 && y >= 40 && y <= 64) {
    return {
      ...plot,
      sellableSqYrd: 500,
      sizeSqft: 4500,
      superBuiltUpSqft: toNumber(plot.superBuiltUpSqft) || 4500
    };
  }
  return plot;
}

function mergeExtractedPlots(plots) {
  const unique = [];
  plots.forEach((plot) => {
    const x = Number(plot.marker?.xPercent);
    const y = Number(plot.marker?.yPercent);
    const size = plotArea(plot);
    const duplicateIndex = unique.findIndex((existing) => {
      const dx = Math.abs(Number(existing.marker?.xPercent) - x);
      const dy = Math.abs(Number(existing.marker?.yPercent) - y);
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return false;
      if (dx < 2 && dy < 1.05) return true;
      const existingSize = plotArea(existing);
      const sizeClose = size > 0 && existingSize > 0 && (
        Math.abs(size - existingSize) < 8
        || Math.abs(size - existingSize) / Math.max(size, existingSize) < 0.18
      );
      if (sizeClose && size < 300 && dx < 4 && dy < 1.05) return true;
      if (sizeClose && size >= 300 && dx < 8 && dy < 2) return true;
      return false;
    });
    if (duplicateIndex === -1) {
      unique.push(plot);
      return;
    }
    const current = unique[duplicateIndex];
    const richer = size > plotArea(current) ? plot : current;
    if (current.status === 'SOLD' || plot.status === 'SOLD') {
      unique[duplicateIndex] = { ...richer, status: 'SOLD' };
      return;
    }
    unique[duplicateIndex] = richer;
  });
  return unique.sort((a, b) => {
    const ax = Number(a.marker?.xPercent) || 0;
    const bx = Number(b.marker?.xPercent) || 0;
    const col = Math.round(ax / 4) - Math.round(bx / 4);
    if (col !== 0) return col;
    return (Number(a.marker?.yPercent) || 0) - (Number(b.marker?.yPercent) || 0);
  });
}

function inferBlock(plot) {
  const x = Number(plot.marker?.xPercent);
  if (Number.isFinite(x)) return x < 21 ? 'B' : 'A';
  return plot.block || 'A';
}

function assignStablePlotNumbers(plots) {
  const counters = {};
  return plots.map((plot) => {
    const block = inferBlock(plot);
    counters[block] = (counters[block] || 0) + 1;
    return {
      ...plot,
      block,
      plotNo: `${block}-${String(counters[block]).padStart(2, '0')}`
    };
  });
}

function finalizeExtractedPlots(plots) {
  const prepared = (plots || []).map((plot) => {
    const sellableSqYrd = sanitizeSellableArea(plot.sellableSqYrd, plot.label || plot.plotNo);
    const sizeSqft = sellableSqYrd
      ? Number((sellableSqYrd * SQFT_PER_SQ_YRD).toFixed(2))
      : toNumber(plot.sizeSqft);
    return inferMissingArea({
      ...plot,
      sellableSqYrd,
      sizeSqft,
      status: parseOcrStatus(plot),
      superBuiltUpSqft: toNumber(plot.superBuiltUpSqft) || sizeSqft
    });
  });
  const merged = mergeExtractedPlots(prepared).filter((plot) => plotArea(plot) > 0);
  return assignStablePlotNumbers(merged);
}

function parseDimensions(raw) {
  const text = cleanText(raw).replace(/\s+/g, '').toLowerCase().replace(/ft|feet|'|"/g, '');
  if (!text) return { dimensions: '', width: 0, depth: 0, sizeSqft: 0 };
  const match = text.match(/(\d+(?:\.\d+)?)[x×*](\d+(?:\.\d+)?)/i);
  if (!match) return { dimensions: cleanText(raw), width: 0, depth: 0, sizeSqft: 0 };
  const width = Number(match[1]);
  const depth = Number(match[2]);
  return {
    dimensions: `${width}x${depth}`,
    width,
    depth,
    sizeSqft: width * depth
  };
}

function deriveBlock(plotNo, block) {
  const explicit = cleanText(block);
  if (explicit) return explicit;
  const no = cleanText(plotNo);
  const match = no.match(/^([A-Za-z]+)/);
  if (match) return match[1].toUpperCase();
  return 'A';
}

function derivePlotType(rawType, facing, plc) {
  const type = cleanText(rawType).toUpperCase().replace(/\s+/g, '_');
  if (type && type !== 'SIMPLE') return type;
  const face = cleanText(facing).toUpperCase();
  if (face.includes('GARDEN')) return 'GARDEN_FACING';
  if (face.includes('PARK')) return 'PARK_FACING';
  if (face.includes('CORNER')) return 'CORNER';
  if (face.includes('ROAD')) return 'ROAD_FACING';
  if (toNumber(plc.plcParkFacing) > 0) return 'PARK_FACING';
  if (toNumber(plc.plcCorner) > 0) return 'CORNER';
  if (toNumber(plc.plc12mtr) > 0 || toNumber(plc.plc9mtr) > 0) return 'ROAD_FACING';
  return 'SIMPLE';
}

function deriveFacing(rawFacing, plc) {
  const facing = cleanText(rawFacing);
  if (facing) return facing;
  if (toNumber(plc.plcParkFacing) > 0) return 'Park / Garden Facing';
  if (toNumber(plc.plcCorner) > 0) return 'Corner Plot';
  if (toNumber(plc.plc12mtr) > 0) return '12m Road Facing';
  if (toNumber(plc.plc9mtr) > 0) return '9m Road Facing';
  return '';
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function markerFromExtracted(plot) {
  const directX = clampPercent(plot.markerXPercent ?? plot.marker?.xPercent);
  const directY = clampPercent(plot.markerYPercent ?? plot.marker?.yPercent);
  if (directX !== null && directY !== null) {
    return { xPercent: directX, yPercent: directY };
  }

  const points = plot.polygonPoints || plot.polygon?.points || [];
  if (!Array.isArray(points) || points.length === 0) {
    return { xPercent: null, yPercent: null };
  }

  const percentXs = points.map((pt) => clampPercent(pt.xPercent ?? (Number(pt.x) <= 100 ? pt.x : null))).filter((n) => n !== null);
  const percentYs = points.map((pt) => clampPercent(pt.yPercent ?? (Number(pt.y) <= 100 ? pt.y : null))).filter((n) => n !== null);
  if (percentXs.length >= 3 && percentYs.length >= 3) {
    return { xPercent: average(percentXs), yPercent: average(percentYs) };
  }

  const xs = points.map((pt) => toNumber(pt.x));
  const ys = points.map((pt) => toNumber(pt.y));
  const cx = average(xs);
  const cy = average(ys);
  if (cx === null || cy === null) return { xPercent: null, yPercent: null };
  if (cx <= 100 && cy <= 100) return { xPercent: clampPercent(cx), yPercent: clampPercent(cy) };
  return {
    xPercent: clampPercent((cx / CANVAS_WIDTH) * 100),
    yPercent: clampPercent((cy / CANVAS_HEIGHT) * 100)
  };
}

function bboxFromPoints(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const xs = points.map((pt) => toNumber(pt.x ?? pt.xPercent));
  const ys = points.map((pt) => toNumber(pt.y ?? pt.yPercent));
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    width: (Math.max(...xs) - minX) || 0,
    height: (Math.max(...ys) - minY) || 0
  };
}

function normalizeExtractedPlot(raw = {}, index = 0) {
  const label = cleanText(raw.label || raw.areaText || raw.plotNo);
  const plotNo = cleanText(raw.plotNo) || label || `TMP-${index + 1}`;
  if (!plotNo) return null;

  const parsed = parseDimensions(raw.dimensions);
  const fromLabel = parseAreaLabel(label);
  const sellableSqYrd = sanitizeSellableArea(
    toNumber(raw.sellableSqYrd) || fromLabel.sellableSqYrd,
    label
  ) || (toNumber(raw.sizeSqft) || parsed.sizeSqft ? Number(((toNumber(raw.sizeSqft) || parsed.sizeSqft) / SQFT_PER_SQ_YRD).toFixed(2)) : 0);
  const sizeSqft = sellableSqYrd
    ? Number((sellableSqYrd * SQFT_PER_SQ_YRD).toFixed(2))
    : (toNumber(raw.sizeSqft) || parsed.sizeSqft || fromLabel.sizeSqft || 0);
  const plc = {
    plc12mtr: toNumber(raw.plc12mtr),
    plc9mtr: toNumber(raw.plc9mtr),
    plcCorner: toNumber(raw.plcCorner),
    plcParkFacing: toNumber(raw.plcParkFacing)
  };
  const facing = deriveFacing(raw.facing, plc);
  const plotType = derivePlotType(raw.plotType, facing, plc);
  const marker = markerFromExtracted(raw);
  const points = raw.polygonPoints || raw.polygon?.points || [];

  return {
    plotNo,
    block: deriveBlock(plotNo, raw.block),
    status: parseOcrStatus(raw),
    facing,
    plotType,
    dimensions: parsed.dimensions || cleanText(raw.dimensions),
    sizeSqft,
    superBuiltUpSqft: toNumber(raw.superBuiltUpSqft) || sizeSqft,
    sellableSqYrd,
    carpetSqYrd: toNumber(raw.carpetSqYrd),
    plc12mtr: plc.plc12mtr,
    plc9mtr: plc.plc9mtr,
    plcCorner: plc.plcCorner,
    plcParkFacing: plc.plcParkFacing,
    discountedPlc: toNumber(raw.discountedPlc),
    otmc: toNumber(raw.otmc),
    totalCost: toNumber(raw.totalCost),
    marker,
    polygonPoints: points,
    coordinates: raw.coordinates && raw.coordinates.width ? raw.coordinates : bboxFromPoints(points),
    confidence: toNumber(raw.confidence, 0)
  };
}

function normalizeProjectMeta(raw = {}) {
  const highlights = Array.isArray(raw.highlights) ? raw.highlights.map(cleanText).filter(Boolean) : [];
  const locationAdvantages = Array.isArray(raw.locationAdvantages)
    ? raw.locationAdvantages
      .map((item) => ({
        distance: cleanText(item.distance),
        landmark: cleanText(item.landmark)
      }))
      .filter((item) => item.landmark)
    : [];
  const amenities = Array.isArray(raw.amenities) ? raw.amenities.map(cleanText).filter(Boolean) : [];

  return {
    location: cleanText(raw.location),
    surveyNumber: cleanText(raw.surveyNumber),
    village: cleanText(raw.village),
    highlights,
    locationAdvantages,
    amenities
  };
}

function buildPricedPlot(normalized, basePricePerSqft = 0) {
  const sellableSqYrd = normalized.sellableSqYrd || 0;
  const baseRatePerSqYrd = sellableSqYrd > 0 ? toNumber(basePricePerSqft) * SQFT_PER_SQ_YRD : 0;
  const pricing = computePricing({
    sellableSqYrd,
    plc12mtr: normalized.plc12mtr,
    plc9mtr: normalized.plc9mtr,
    plcCorner: normalized.plcCorner,
    plcParkFacing: normalized.plcParkFacing,
    discountedPlc: normalized.discountedPlc,
    otmc: normalized.otmc,
    baseRatePerSqYrd
  });
  const fallbackCost = sellableSqYrd > 0 ? pricing.totalCost : (normalized.sizeSqft * toNumber(basePricePerSqft));

  return {
    ...normalized,
    totalPlc: pricing.totalPlc,
    discountedPlc: pricing.discountedPlc,
    gstOnOtherCharges: pricing.gstOnOtherCharges,
    baseRatePerSqYrd,
    totalCost: fallbackCost,
    price: fallbackCost,
    status: normalized.status || DEFAULT_STATUS
  };
}

function mapIncomingPlot(plot, blockName) {
  const areaText = plot.area_text || plot.areaText || plot.label;
  const plotNo = plot.plot_number || plot.plotNo || plot.plot_no;
  const bbox = Array.isArray(plot.bbox) ? plot.bbox : null;
  let markerXPercent = plot.markerXPercent ?? plot.marker?.xPercent;
  let markerYPercent = plot.markerYPercent ?? plot.marker?.yPercent;
  if ((markerXPercent == null || markerYPercent == null) && bbox && bbox.length === 4) {
    const nums = bbox.map(Number);
    if (nums.every((n) => Number.isFinite(n)) && Math.max(...nums) <= 100) {
      markerXPercent = (nums[0] + nums[2]) / 2;
      markerYPercent = (nums[1] + nums[3]) / 2;
    }
  }
  return {
    ...plot,
    plotNo,
    label: areaText || plot.label,
    areaText,
    sellableSqYrd: plot.sellableSqYrd ?? plot.area_sq_yd ?? plot.area_sqyd,
    block: plot.block || blockName,
    status: plot.status,
    markerXPercent,
    markerYPercent
  };
}

function parseGeminiPayload(parsed) {
  if (Array.isArray(parsed)) {
    return { plots: parsed.map((plot) => mapIncomingPlot(plot)), projectMeta: {} };
  }
  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.blocks)) {
      const plots = parsed.blocks.flatMap((block) =>
        (block.plots || []).map((plot) => mapIncomingPlot(plot, block.block_name || block.blockName || block.block))
      );
      return { plots, projectMeta: parsed.project || parsed.projectMeta || {} };
    }
    const plots = Array.isArray(parsed.plots)
      ? parsed.plots.map((plot) => mapIncomingPlot(plot))
      : [];
    return { plots, projectMeta: parsed.projectMeta || parsed.project || {} };
  }
  return { plots: [], projectMeta: {} };
}

module.exports = {
  DEFAULT_STATUS,
  SQFT_PER_SQ_YRD,
  normalizeExtractedPlot,
  normalizeProjectMeta,
  buildPricedPlot,
  parseGeminiPayload,
  markerFromExtracted,
  mergeExtractedPlots,
  assignStablePlotNumbers,
  finalizeExtractedPlots,
  parseAreaLabel,
  sanitizeSellableArea,
  parseOcrStatus,
  resolveApproveStatus
};
