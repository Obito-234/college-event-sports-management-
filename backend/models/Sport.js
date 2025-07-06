const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['join_sport', 'normal_sport', 'event'],
    default: 'normal_sport',
    required: true
  },
  category: {
    type: String,
    enum: ['Indoor', 'Outdoor'],
    default: 'Outdoor'
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    trim: true
  },
  registerLink: {
    type: String,
    trim: true
  },
  moreDetailsLink: {
    type: String,
    trim: true
  },
  minPlayers: {
    type: Number,
    default: 1
  },
  maxPlayers: {
    type: Number,
    default: null
  },
  arrivalTime: {
    type: String,
    trim: true
  },
  fixture: {
    type: String,
    trim: true
  },
  gameTiming: {
    type: String,
    trim: true
  },
  // Fields specific to join sports
  registrationDeadline: {
    type: String,
    trim: true
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  // Fields specific to events
  eventType: {
    type: String,
    enum: ['tournament', 'exhibition', 'workshop', 'competition', 'other'],
    default: 'other'
  },
  organizer: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    trim: true
  },
  // Status for all types
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sport', sportSchema); 