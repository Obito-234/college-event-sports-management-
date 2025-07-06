const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['main_admin', 'sport_admin'],
    default: 'sport_admin'
  },
  // For sport admins, specify which sports they can manage
  assignedSports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport'
  }],
  // For sport admins, specify sport names they can manage
  sportNames: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can manage a specific sport
userSchema.methods.canManageSport = function(sportId, sportName) {
  if (this.role === 'main_admin') return true;
  
  if (this.role === 'sport_admin') {
    // Check by sport ID
    if (this.assignedSports && this.assignedSports.includes(sportId)) {
      return true;
    }
    // Check by sport name
    if (this.sportNames && this.sportNames.includes(sportName)) {
      return true;
    }
  }
  
  return false;
};

module.exports = mongoose.model('User', userSchema); 