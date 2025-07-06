const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    trim: true
  },
  match: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  teams: {
    home: String,
    away: String,
    white: String,
    black: String
  },
  scores: {
    home: Number,
    away: Number
  },
  quarters: [{
    home: Number,
    away: Number
  }],
  sets: [{
    home: Number,
    away: Number
  }],
  result: String,
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Ongoing', 'Upcoming'],
    default: 'Upcoming'
  },
  moves: Number,
  players: [String],
  details: {
    homePlayers: [{
      name: String,
      goals: Number,
      runs: Number,
      wickets: Number,
      points: Number
    }],
    awayPlayers: [{
      name: String,
      goals: Number,
      runs: Number,
      wickets: Number,
      points: Number
    }]
  }
}, {
  timestamps: true
});

// Compound index to ensure unique matches per sport
matchSchema.index({ sport: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema); 