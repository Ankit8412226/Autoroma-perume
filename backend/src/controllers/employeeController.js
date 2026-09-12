const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { calculateEmployeeSalesMetrics, evaluateAndUpgradeRank, getDownlineEmployeeIds } = require('../services/mlmEngine');

exports.getEmployees = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user && !['ADMIN', 'DIRECTOR'].includes(req.user.role)) {
      const loggedInEmp = await Employee.findOne({ userId: req.user._id });
      if (!loggedInEmp) {
        return res.json([]);
      }
      const downlines = await getDownlineEmployeeIds(loggedInEmp._id);
      const allowedIds = [loggedInEmp._id, ...downlines];
      filter = { _id: { $in: allowedIds } };
    }

    const employees = await Employee.find(filter)
      .populate('userId', 'fullName email phone role avatar approvalStatus isActive')
      .populate({
        path: 'parentId',
        populate: { path: 'userId', select: 'fullName' }
      })
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role, parentId, position, joiningDate } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const isAdmin = req.user && ['ADMIN', 'DIRECTOR'].includes(req.user.role);
    const loggedInEmployee = req.user ? await Employee.findOne({ userId: req.user._id }) : null;

    // SECURITY: only an admin may assign a privileged role. Agents can only ever
    // create AGENT accounts, and only attach them directly under themselves.
    const safeRole = isAdmin ? (role || 'AGENT') : 'AGENT';

    let sponsorParentId;
    if (isAdmin) {
      sponsorParentId = parentId || (loggedInEmployee ? loggedInEmployee._id : null);
    } else {
      if (!loggedInEmployee) {
        return res.status(403).json({ message: 'No employee profile found for your account' });
      }
      sponsorParentId = loggedInEmployee._id;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Password123!', salt);

    // Note: Direct onboarding by an existing agent or admin creates an immediately APPROVED & ACTIVE agent!
    user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: safeRole,
      isActive: true,
      approvalStatus: 'APPROVED'
    });

    const empCount = await Employee.countDocuments();
    const employeeCode = `H&S-${1000 + empCount + 1}`;

    const employee = await Employee.create({
      userId: user._id,
      employeeCode,
      joiningDate: joiningDate || new Date(),
      currentRank: 'Business Executive',
      parentId: sponsorParentId,
      position: position || 'LEFT'
    });

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('userId', 'fullName email phone role avatar approvalStatus isActive')
      .populate({
        path: 'parentId',
        populate: { path: 'userId', select: 'fullName' }
      });

    res.status(201).json({
      message: 'Direct agent onboarding successful!',
      employee: populatedEmployee,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { fullName, phone, currentRank, parentId, position } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (fullName || phone) {
      await User.findByIdAndUpdate(employee.userId, {
        ...(fullName && { fullName }),
        ...(phone && { phone })
      });
    }

    if (currentRank) employee.currentRank = currentRank;
    if (parentId !== undefined) employee.parentId = parentId || null;
    if (position) employee.position = position;

    await employee.save();

    const updated = await Employee.findById(employee._id)
      .populate('userId', 'fullName email phone role avatar approvalStatus isActive')
      .populate({
        path: 'parentId',
        populate: { path: 'userId', select: 'fullName' }
      });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.findByIdAndDelete(employee.userId);
    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId', 'fullName email phone role avatar approvalStatus isActive')
      .populate('parentId');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.user && !['ADMIN', 'DIRECTOR'].includes(req.user.role)) {
      const loggedInEmp = await Employee.findOne({ userId: req.user._id });
      if (!loggedInEmp) {
        return res.status(403).json({ message: 'Access denied: No employee profile found' });
      }
      const downlines = await getDownlineEmployeeIds(loggedInEmp._id);
      const allowedIds = [loggedInEmp._id.toString(), ...downlines.map(d => d.toString())];
      if (!allowedIds.includes(employee._id.toString())) {
        return res.status(403).json({ message: 'Access denied: You can only view details of yourself or employees under your hierarchy' });
      }
    }

    const metrics = await calculateEmployeeSalesMetrics(employee._id);

    res.json({
      employee,
      metrics
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployeeRank = async (req, res, next) => {
  try {
    const result = await evaluateAndUpgradeRank(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Approval Actions for Public Agent Applications
exports.approveAgent = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Agent record not found' });

    const user = await User.findById(employee.userId);
    if (!user) return res.status(404).json({ message: 'User record not found' });

    user.approvalStatus = 'APPROVED';
    user.isActive = true;
    await user.save();

    res.json({
      message: `🎉 Agent ${user.fullName} (${employee.employeeCode}) has been APPROVED & Activated!`,
      employee,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectAgent = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Agent record not found' });

    const user = await User.findById(employee.userId);
    if (!user) return res.status(404).json({ message: 'User record not found' });

    user.approvalStatus = 'REJECTED';
    user.isActive = false;
    await user.save();

    res.json({
      message: `Agent application for ${user.fullName} has been rejected.`,
      employee,
      user
    });
  } catch (error) {
    next(error);
  }
};
