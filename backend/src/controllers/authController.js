const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/jwt');
const { resolveSponsorByInviteCode } = require('../utils/agentInvite');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// 1. Direct Registration (e.g. from Admin/Agent portal or internal creation)
exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, parentEmployeeId, role, currentRank } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: role || 'AGENT',
      isActive: true,
      approvalStatus: 'APPROVED'
    });

    const empCount = await Employee.countDocuments();
    const employeeCode = `H&S-${1000 + empCount + 1}`;

    const employee = await Employee.create({
      userId: user._id,
      employeeCode,
      joiningDate: new Date(),
      currentRank: currentRank || 'Business Executive',
      parentId: parentEmployeeId || null
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus
      },
      employee: {
        id: employee._id,
        employeeCode: employee.employeeCode,
        currentRank: employee.currentRank
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Public Agent Application Registration (Requires Admin / Manager Approval)
exports.registerPublicAgent = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, inviteCode } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ message: 'Full name, email, phone, and password are required' });
    }

    let sponsor = null;
    if (inviteCode) {
      sponsor = await resolveSponsorByInviteCode(inviteCode);
      if (!sponsor) {
        return res.status(400).json({ message: 'This invite link is invalid. Ask your sponsor for a fresh link.' });
      }
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    const employeeCode = `H&S-${1000 + empCount + 1}`;

    const employee = await Employee.create({
      userId: user._id,
      employeeCode,
      joiningDate: new Date(),
      currentRank: 'Business Executive',
      parentId: sponsor ? sponsor._id : null
    });

    res.status(201).json({
      message: '🎉 Agent application submitted successfully! Your account is pending Admin/Manager approval. You will be notified once activated.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. User & Agent Login with Approval Guard
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.approvalStatus === 'PENDING_APPROVAL') {
      return res.status(403).json({
        message: 'Your Agent Application is currently PENDING Admin/Manager approval. Please wait for activation before logging in.'
      });
    }

    if (user.approvalStatus === 'REJECTED' || user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been deactivated or rejected by Admin. Please contact support.'
      });
    }

    const employee = await Employee.findOne({ userId: user._id });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus
      },
      employee: employee ? {
        id: employee._id,
        employeeCode: employee.employeeCode,
        currentRank: employee.currentRank,
        selfSalesCount: employee.selfSalesCount,
        teamSalesCount: employee.teamSalesCount,
        activeLegsCount: employee.activeLegsCount
      } : null
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }
    const resetToken = jwt.sign({ id: user._id, type: 'RESET' }, JWT_SECRET, { expiresIn: '15m' });
    res.json({
      message: 'Password reset token generated successfully. Enter new password to update.',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    if (decoded.type !== 'RESET') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully! Please login with your new password.' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const employee = await Employee.findOne({ userId: user._id }).populate('parentId');

    res.json({
      user,
      employee
    });
  } catch (error) {
    next(error);
  }
};


exports.registerPropertyOwner = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Full name, email, phone, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      role: 'PROPERTY_OWNER',
      isActive: true,
      approvalStatus: 'APPROVED'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now list your property.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
