const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Employee = require('./models/Employee');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autoroma_perfume_realestate';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123456', salt);

    // Create primary admin@perfume.com
    let admin = await User.findOne({ email: 'admin@perfume.com' });
    if (admin) {
      admin.password = hashedPassword;
      admin.role = 'ADMIN';
      admin.isActive = true;
      admin.approvalStatus = 'APPROVED';
      await admin.save();
      console.log('Updated existing admin@perfume.com');
    } else {
      admin = await User.create({
        fullName: 'Super Admin',
        email: 'admin@perfume.com',
        password: hashedPassword,
        phone: '+91 9999999999',
        role: 'ADMIN',
        isActive: true,
        approvalStatus: 'APPROVED'
      });
      console.log('Created admin@perfume.com');
    }

    // Ensure Employee record exists for this admin
    let emp = await Employee.findOne({ userId: admin._id });
    if (!emp) {
      await Employee.create({
        userId: admin._id,
        employeeCode: 'EMP-0001',
        joiningDate: new Date(),
        currentRank: 'Director Sales',
        selfSalesCount: 0,
        teamSalesCount: 0,
        activeLegsCount: 0
      });
      console.log('Created Employee record for admin@perfume.com');
    }

    console.log('Admin account created/updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
