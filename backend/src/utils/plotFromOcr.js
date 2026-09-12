const { clampPercent } = require('./googleMaps');
const { computePricing } = require('../services/pricingEngine');

const SQFT_PER_SQ_YRD = 9;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const DEFAULT_STATUS = 'AVAILABLE';

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function cleanText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
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
  const plotNo = cleanText(raw.plotNo);
  if (!plotNo) return null;

  const parsed = parseDimensions(raw.dimensions);
  const sizeSqft = toNumber(raw.sizeSqft) || parsed.sizeSqft || 0;
  const sellableSqYrd = toNumber(raw.sellableSqYrd) || (sizeSqft ? Number((sizeSqft / SQFT_PER_SQ_YRD).toFixed(2)) : 0);
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
    status: DEFAULT_STATUS,
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
    status: DEFAULT_STATUS
  };
}

function parseGeminiPayload(parsed) {
  if (Array.isArray(parsed)) {
    return { plots: parsed, projectMeta: {} };
  }
  if (parsed && typeof parsed === 'object') {
    const plots = Array.isArray(parsed.plots) ? parsed.plots : [];
    return { plots, projectMeta: parsed.projectMeta || {} };
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
  markerFromExtracted
};
