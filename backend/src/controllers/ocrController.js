const { processMapImageOCR } = require('../services/ocrPipeline');
const PlotMap = require('../models/PlotMap');
const Plot = require('../models/Plot');
const Project = require('../models/Project');
const { computePricing, deriveBaseRatePerSqYrd } = require('../services/pricingEngine');

/** Axis-aligned bounding box for a polygon, used as the canvas rectangle fallback. */
function bboxFromPoints(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }
  const xs = points.map((p) => Number(p.x) || 0);
  const ys = points.map((p) => Number(p.y) || 0);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  if (maxX <= minX || maxY <= minY) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX || 125,
    height: maxY - minY || 90
  };
}

/** Generates clean non-overlapping grid layout for plots if polygon points are absent. */
function generateGridPosition(index) {
  const col = index % 5;
  const row = Math.floor(index / 5);
  const startX = 60;
  const startY = 60;
  const gapX = 160;
  const gapY = 110;
  const width = 135;
  const height = 85;

  const x = startX + col * gapX;
  const y = startY + row * gapY;

  return {
    coordinates: { x, y, width, height },
    points: [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ]
  };
}

exports.analyzeMap = async (req, res, next) => {
  try {
    const { projectId, mapName } = req.body;

    const result = await processMapImageOCR({
      projectId: projectId || '656565656565656565656565',
      mapName: mapName || 'Government Masterplan Layout',
      fileBuffer: req.file ? req.file.buffer : null,
      fileName: req.file ? req.file.originalname : 'naksa_blueprint.pdf'
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.approveMapOverlay = async (req, res, next) => {
  try {
    const { mapId } = req.params;
    const { updatedVectorOverlayData } = req.body;

    const plotMap = await PlotMap.findById(mapId);
    if (!plotMap) return res.status(404).json({ message: 'Plot Map not found' });

    plotMap.status = 'APPROVED';
    if (updatedVectorOverlayData) {
      plotMap.vectorOverlayData = updatedVectorOverlayData;
    }
    await plotMap.save();

    // 1. Update Project blueprint background image URL so PlotMapCanvas renders it!
    if (plotMap.projectId && plotMap.imageUrl) {
      await Project.findByIdAndUpdate(plotMap.projectId, {
        bannerImage: plotMap.imageUrl
      });
    }

    // 2. Sync extracted plots into the Plots table
    let index = 0;
    for (const plotData of plotMap.vectorOverlayData) {
      let points = plotData.polygonPoints || plotData.polygon?.points || [];
      let coordinates = bboxFromPoints(points);

      // If points are invalid or missing, generate a clean grid layout position
      if (!coordinates || points.length < 3) {
        const grid = generateGridPosition(index);
        coordinates = grid.coordinates;
        points = grid.points;
      }

      const priceInputs = {
        sellableSqYrd: plotData.sellableSqYrd || 0,
        plc12mtr: plotData.plc12mtr || 0,
        plc9mtr: plotData.plc9mtr || 0,
        plcCorner: plotData.plcCorner || 0,
        plcParkFacing: plotData.plcParkFacing || 0,
        discountedPlc: plotData.discountedPlc || 0,
        otmc: plotData.otmc || 0,
        totalCost: plotData.totalCost || 0
      };
      const baseRatePerSqYrd = deriveBaseRatePerSqYrd(priceInputs);
      const pricing = computePricing({ ...priceInputs, baseRatePerSqYrd });
      const finalTotalCost = baseRatePerSqYrd > 0 ? pricing.totalCost : (plotData.totalCost || 0);

      await Plot.findOneAndUpdate(
        { projectId: plotMap.projectId, plotNo: plotData.plotNo },
        {
          projectId: plotMap.projectId,
          block: plotData.plotNo.split('-')[0] || 'A1',
          plotNo: plotData.plotNo,
          sizeSqft: plotData.sizeSqft || (plotData.sellableSqYrd ? plotData.sellableSqYrd * 9 : 1800),
          sellableSqYrd: plotData.sellableSqYrd || 0,
          carpetSqYrd: plotData.carpetSqYrd || 0,
          plc12mtr: plotData.plc12mtr || 0,
          plc9mtr: plotData.plc9mtr || 0,
          plcCorner: plotData.plcCorner || 0,
          plcParkFacing: plotData.plcParkFacing || 0,
          totalPlc: pricing.totalPlc,
          discountedPlc: plotData.discountedPlc || 0,
          otmc: plotData.otmc || 0,
          baseRatePerSqYrd,
          gstOnOtherCharges: pricing.gstOnOtherCharges,
          totalCost: finalTotalCost,
          price: finalTotalCost || 0,
          ownerName: plotData.ownerName || '',
          status: plotData.status || 'AVAILABLE',
          coordinates,
          polygon: { points }
        },
        { upsert: true, new: true }
      );
      index++;
    }

    res.json({
      message: 'Plot Map Overlay successfully approved and synchronized with Plot Database',
      plotMap
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectMapOverlay = async (req, res, next) => {
  try {
    const { mapId } = req.params;
    const plotMap = await PlotMap.findById(mapId);
    if (!plotMap) return res.status(404).json({ message: 'Plot Map not found' });

    plotMap.status = 'REJECTED';
    await plotMap.save();

    res.json({ message: 'Map overlay rejected', plotMap });
  } catch (error) {
    next(error);
  }
};
