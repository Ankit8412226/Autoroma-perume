const Project = require('../models/Project');
const ProjectSettings = require('../models/ProjectSettings');
const Plot = require('../models/Plot');

exports.getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;

    let query = Project.find().sort({ createdAt: -1 });

    const total = await Project.countDocuments();

    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const projects = await query.lean();

    const projectsWithStats = await Promise.all(
      projects.map(async (p) => {
        const plotCounts = await Plot.aggregate([
          { $match: { projectId: p._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const statsMap = { AVAILABLE: 0, BOOKED: 0, PENDING: 0, SOLD: 0 };
        plotCounts.forEach(item => {
          if (item._id && statsMap[item._id] !== undefined) {
            statsMap[item._id] = item.count;
          }
        });

        const totalPlotsInDB = Object.values(statsMap).reduce((a, b) => a + b, 0);

        return {
          ...p,
          totalPlots: Math.max(p.totalPlots || 0, totalPlotsInDB),
          availableCount: statsMap.AVAILABLE,
          bookedCount: statsMap.BOOKED,
          pendingCount: statsMap.PENDING,
          soldCount: statsMap.SOLD
        };
      })
    );

    if (page && limit) {
      return res.json({
        data: projectsWithStats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    }

    res.json(projectsWithStats);
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    await ProjectSettings.create({ projectId: project._id });

    // If custom OCR extracted plots were provided during project creation, save them directly!
    const ocrPlots = req.body.ocrPlots;
    if (Array.isArray(ocrPlots) && ocrPlots.length > 0) {
      const plotsToInsert = ocrPlots.map((p, i) => {
        const sizeSqft = p.sizeSqft || (p.sellableSqYrd ? p.sellableSqYrd * 9 : 1800);
        const basePrice = req.body.basePricePerSqft || 4000;
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = p.coordinates?.x ?? (50 + col * 150);
        const y = p.coordinates?.y ?? (50 + row * 110);
        const width = p.coordinates?.width || 130;
        const height = p.coordinates?.height || 90;

        return {
          projectId: project._id,
          block: p.plotNo ? p.plotNo.split('-')[0] : 'A',
          plotNo: p.plotNo || `P-${101 + i}`,
          sizeSqft,
          sellableSqYrd: p.sellableSqYrd || 0,
          carpetSqYrd: p.carpetSqYrd || 0,
          price: p.totalCost || (sizeSqft * basePrice),
          totalCost: p.totalCost || (sizeSqft * basePrice),
          status: p.status || 'AVAILABLE',
          coordinates: { x, y, width, height },
          polygon: {
            points: p.polygonPoints || p.polygon?.points || [
              { x, y },
              { x: x + width, y },
              { x: x + width, y: y + height },
              { x, y: y + height }
            ]
          }
        };
      });

      await Plot.insertMany(plotsToInsert);
    } else {
      // Automatically generate plots for new project if totalPlots provided
      const totalPlots = req.body.totalPlots || 20;
      const basePrice = req.body.basePricePerSqft || 4000;
      const plotsToInsert = [];

      for (let i = 1; i <= totalPlots; i++) {
        const block = i <= Math.ceil(totalPlots / 2) ? 'A' : 'B';
        const sizeSqft = 1200 + (i % 4) * 250;
        const price = sizeSqft * basePrice;
        const col = (i - 1) % 5;
        const row = Math.floor((i - 1) / 5);
        const x = 50 + col * 150;
        const y = 50 + row * 110;

        plotsToInsert.push({
          projectId: project._id,
          block,
          plotNo: `${block}-${100 + i}`,
          sizeSqft,
          price,
          status: 'AVAILABLE',
          coordinates: { x, y, width: 130, height: 90 },
          polygon: {
            points: [
              { x, y },
              { x: x + 130, y },
              { x: x + 130, y: y + 90 },
              { x, y: y + 90 }
            ]
          }
        });
      }

      await Plot.insertMany(plotsToInsert);
    }

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    await Plot.deleteMany({ projectId: id });
    await ProjectSettings.deleteMany({ projectId: id });
    res.json({ message: 'Project and associated plots deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const settings = await ProjectSettings.findOne({ projectId: project._id });
    const plotCounts = await Plot.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      project,
      settings,
      plotStats: plotCounts.reduce((acc, c) => {
        acc[c._id] = c.count;
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProjectSettings = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const settings = await ProjectSettings.findOneAndUpdate(
      { projectId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
