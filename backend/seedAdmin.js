const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createMainAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if main admin already exists
    const existingAdmin = await User.findOne({ role: 'main_admin' });
    if (existingAdmin) {
      console.log('Main admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create main admin user
    const mainAdmin = new User({
      username: 'mainadmin',
      email: 'admin@kurukshetra.com',
      password: 'admin123',
      role: 'main_admin',
      isActive: true
    });

    await mainAdmin.save();
    console.log('Main admin created successfully!');
    console.log('Email: admin@kurukshetra.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating main admin:', error);
    process.exit(1);
  }
};

createMainAdmin(); 