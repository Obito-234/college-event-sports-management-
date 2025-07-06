const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Sport = require('./models/Sport');

async function testAuth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test 1: Check if main admin exists
    const mainAdmin = await User.findOne({ role: 'main_admin' });
    console.log('Main admin exists:', !!mainAdmin);
    if (mainAdmin) {
      console.log('Main admin username:', mainAdmin.username);
      console.log('Main admin role:', mainAdmin.role);
    }

    // Test 2: Check if sport admin exists
    const sportAdmin = await User.findOne({ role: 'sport_admin' });
    console.log('Sport admin exists:', !!sportAdmin);
    if (sportAdmin) {
      console.log('Sport admin username:', sportAdmin.username);
      console.log('Sport admin role:', sportAdmin.role);
      console.log('Sport admin assigned sports:', sportAdmin.assignedSports);
      console.log('Sport admin sport names:', sportAdmin.sportNames);
    }

    // Test 3: Check sports
    const sports = await Sport.find();
    console.log('Total sports:', sports.length);
    if (sports.length > 0) {
      const firstSport = sports[0];
      console.log('First sport ID:', firstSport._id);
      console.log('First sport name:', firstSport.name);
      
      // Test canManageSport method
      if (mainAdmin) {
        const canManage = mainAdmin.canManageSport(firstSport._id, firstSport.name);
        console.log('Main admin can manage first sport:', canManage);
      }
      
      if (sportAdmin) {
        const canManage = sportAdmin.canManageSport(firstSport._id, firstSport.name);
        console.log('Sport admin can manage first sport:', canManage);
      }
    }

    // Test 4: Test login
    if (mainAdmin) {
      const isPasswordValid = await mainAdmin.comparePassword('admin123');
      console.log('Main admin password is valid:', isPasswordValid);
    }

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAuth(); 