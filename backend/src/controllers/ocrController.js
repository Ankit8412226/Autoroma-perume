const { processMapImageOCR } = require('../services/ocrPipeline');
const PlotMap = require('../models/PlotMap');
const Plot = require('../models/Plot');
const Project = require('../models/Project');
const {
  normalizeExtractedPlot,
  normalizeProjectMeta,
  buildPricedPlot,
  finalizeExtractedPlots,
  resolveApproveStatus,
  DEFAULT_STATUS
} = require('../utils/plotFromOcr');

function mergeProjectMeta(existing, meta) {
  const next = {};
  if (meta.location && !existing.location) next.location = meta.location;
  if (meta.surveyNumber) next.surveyNumber = meta.surveyNumber;
  if (meta.village) next.village = meta.village;
  if (meta.highlights.length && !(existing.highlights || []).length) next.highlights = meta.highlights;
  if (meta.amenities.length && !(existing.amenities || []).length) next.amenities = meta.amenities;
  if (meta.locationAdvantages.length && !(existing.locationAdvantages || []).length) {
    next.locationAdvantages = meta.locationAdvantages;
  }
  return next;
}

exports.analyzeMap = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Upload a naksha image to extract plot details' });
    }

    const result = await processMapImageOCR({
      projectId: req.body.projectId || null,
      mapName: req.body.mapName || req.file.originalname,
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype
    });

    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

exports.approveMapOverlay = async (req, res, next) => {
  try {
    const { mapId } = req.params;
    const { updatedVectorOverlayData } = req.body;

    const plotMap = await PlotMap.findById(mapId);
    if (!plotMap) return res.status(404).json({ message: 'Plot Map not found' });
    if (!plotMap.projectId) {
      return res.status(400).json({ message: 'This OCR result is not linked to a project yet' });
    }

    const project = await Project.findById(plotMap.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const rawPlots = Array.isArray(updatedVectorOverlayData) && updatedVectorOverlayData.length
      ? updatedVectorOverlayData
      : plotMap.vectorOverlayData;

    const normalizedPlots = finalizeExtractedPlots(
      rawPlots
        .map((plot, index) => normalizeExtractedPlot(plot, index))
        .filter(Boolean)
    );

    if (normalizedPlots.length === 0) {
      return res.status(422).json({ message: 'No readable plots to approve. Re-upload a clearer naksha.' });
    }

    plotMap.status = 'APPROVED';
    plotMap.vectorOverlayData = normalizedPlots;
    await plotMap.save();

    const projectPatch = {
      mapImageUrl: plotMap.imageUrl,
      totalPlots: normalizedPlots.length
    };
    if (plotMap.imageS3Key) {
      projectPatch.mapImageS3Key = plotMap.imageS3Key;
    }
    Object.assign(projectPatch, mergeProjectMeta(project, normalizeProjectMeta(plotMap.extractedProjectMeta || {})));
    await Project.findByIdAndUpdate(plotMap.projectId, projectPatch);

    const keptPlotNos = [];
    for (const plotData of normalizedPlots) {
      const priced = buildPricedPlot(plotData, project.basePricePerSqft);
      keptPlotNos.push(priced.plotNo);
      const existing = await Plot.findOne({ projectId: plotMap.projectId, plotNo: priced.plotNo });
      const nextStatus = resolveApproveStatus(existing, priced.status || DEFAULT_STATUS);
      await Plot.findOneAndUpdate(
        { projectId: plotMap.projectId, plotNo: priced.plotNo },
        {
          projectId: plotMap.projectId,
          block: priced.block,
          plotNo: priced.plotNo,
          sizeSqft: priced.sizeSqft,
          sellableSqYrd: priced.sellableSqYrd,
          carpetSqYrd: priced.carpetSqYrd,
          plc12mtr: priced.plc12mtr,
          plc9mtr: priced.plc9mtr,
          plcCorner: priced.plcCorner,
          plcParkFacing: priced.plcParkFacing,
          totalPlc: priced.totalPlc,
          discountedPlc: priced.discountedPlc,
          otmc: priced.otmc,
          baseRatePerSqYrd: priced.baseRatePerSqYrd,
          gstOnOtherCharges: priced.gstOnOtherCharges,
          totalCost: priced.totalCost,
          price: priced.price,
          plotType: priced.plotType,
          facing: priced.facing,
          dimensions: priced.dimensions,
          superBuiltUpSqft: priced.superBuiltUpSqft,
          marker: priced.marker,
          coordinates: priced.coordinates,
          polygon: { points: priced.polygonPoints },
          status: nextStatus
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await Plot.deleteMany({
      projectId: plotMap.projectId,
      status: DEFAULT_STATUS,
      plotNo: { $nin: keptPlotNos }
    });

    res.json({
      message: 'Naksha approved. Plot inventory synced from AI extraction.',
      plotCount: keptPlotNos.length,
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
