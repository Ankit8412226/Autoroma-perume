const Inquiry = require('../models/Inquiry');
const Project = require('../models/Project');
const Plot = require('../models/Plot');
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// 1. Public Project Listing (With Live MongoDB Plot Status Aggregation)
exports.getPublicProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: { $ne: 'DELETED' } })
      .select('name code location totalAreaSqft totalPlots basePricePerSqft bannerImage launchDate status')
      .sort({ createdAt: -1 })
      .lean();

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

    res.json(projectsWithStats);
  } catch (error) {
    next(error);
  }
};

// 1b. Public Project Details by ID (With Live Plot Stats & Plot Inventory)
exports.getPublicProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const plotCounts = await Plot.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statsMap = { AVAILABLE: 0, BOOKED: 0, PENDING: 0, SOLD: 0 };
    plotCounts.forEach(item => {
      if (item._id && statsMap[item._id] !== undefined) {
        statsMap[item._id] = item.count;
      }
    });

    const totalPlotsInDB = Object.values(statsMap).reduce((a, b) => a + b, 0);

    const plots = await Plot.find({ projectId: project._id })
      .select('block plotNo sizeSqft sellableSqYrd carpetSqYrd price totalCost status coordinates polygon')
      .sort({ plotNo: 1 });

    res.json({
      project: {
        ...project,
        totalPlots: Math.max(project.totalPlots || 0, totalPlotsInDB),
        availableCount: statsMap.AVAILABLE,
        bookedCount: statsMap.BOOKED,
        pendingCount: statsMap.PENDING,
        soldCount: statsMap.SOLD
      },
      stats: statsMap,
      plots
    });
  } catch (error) {
    next(error);
  }
};

// 2. Public Plot Discovery Listing (Public-safe available plots)
exports.getPublicPlots = async (req, res, next) => {
  try {
    const { projectId, block, search } = req.query;
    const filter = { status: { $in: ['AVAILABLE', 'BOOKED', 'PENDING'] } };

    if (projectId) filter.projectId = projectId;
    if (block) filter.block = block;
    if (search) {
      filter.$or = [
        { plotNo: { $regex: search, $options: 'i' } },
        { block: { $regex: search, $options: 'i' } }
      ];
    }

    const plots = await Plot.find(filter)
      .select('projectId block plotNo sizeSqft sellableSqYrd carpetSqYrd price totalCost status coordinates polygon')
      .populate('projectId', 'name location code');

    res.json(plots);
  } catch (error) {
    next(error);
  }
};

// 3. Public Contact / Inquiry / Site Visit Submission
exports.createPublicInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, inquiryType, projectId, plotNo, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone number are required' });
    }

    let projectName = '';
    if (projectId) {
      const proj = await Project.findById(projectId);
      if (proj) projectName = proj.name;
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      inquiryType: inquiryType || 'CONTACT_FORM',
      projectId: projectId || null,
      projectName,
      plotNo: plotNo || '',
      message: message || '',
      status: 'NEW',
      source: 'LANDING_PAGE'
    });

    res.status(201).json({
      message: '🎉 Thank you! Your inquiry has been dispatched to our senior advisory desk.',
      inquiryId: inquiry._id
    });
  } catch (error) {
    next(error);
  }
};

// 4. Public Agent Application Submission
exports.createPublicAgentApplication = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, experienceYears, message } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: 'Full name, email, and phone number are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Password123!', salt);

    user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: 'AGENT',
      isActive: false,
      approvalStatus: 'PENDING_APPROVAL'
    });

    const empCount = await Employee.countDocuments();
    const employeeCode = `EMP-${1000 + empCount + 1}`;

    const employee = await Employee.create({
      userId: user._id,
      employeeCode,
      joiningDate: new Date(),
      currentRank: 'Business Executive',
      parentId: null
    });

    const inquiry = await Inquiry.create({
      name: fullName,
      email,
      phone,
      inquiryType: 'AGENT_APPLICATION',
      message: message || 'Submitted public agent application',
      experienceYears: experienceYears || '0-2 Years',
      status: 'NEW',
      source: 'BECOME_AGENT_FORM'
    });

    res.status(201).json({
      message: '🎉 Application received successfully! Your agent credentials are pending Admin approval.',
      employeeCode: employee.employeeCode,
      inquiryId: inquiry._id
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin List Inquiries (Protected)
exports.getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('projectId', 'name code location')
      .populate({
        path: 'assignedAgentId',
        populate: { path: 'userId', select: 'fullName email phone' }
      })
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    next(error);
  }
};

// 6. Admin Update Inquiry Status (Protected)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedAgentId } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry lead not found' });

    if (status) inquiry.status = status;
    if (assignedAgentId !== undefined) inquiry.assignedAgentId = assignedAgentId || null;

    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    next(error);
  }
};
