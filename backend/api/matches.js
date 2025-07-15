const express = require("express");
const router = express.Router();
const Match = require('../models/Match');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all matches (for admin panel)
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a specific match by ID 
router.get("/id/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a new match 
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const matchData = req.body;
    
    console.log('Received match data:', JSON.stringify(matchData, null, 2));
    
    if (!matchData.sport) {
      console.log('Validation error: Sport is missing');
      return res.status(400).json({ message: "Sport is required" });
    }
    if (!matchData.match) {
      console.log('Validation error: Match name is missing');
      return res.status(400).json({ message: "Match name is required" });
    }
    if (!matchData.date) {
      console.log('Validation error: Date is missing');
      return res.status(400).json({ message: "Date is required" });
    }
    
    if (!matchData.slug) {
      matchData.slug = matchData.match.toLowerCase().replace(/\s+/g, '-');
      console.log('Generated slug:', matchData.slug);
    }
    
    // Ensure teams object exists
    if (!matchData.teams) {
      matchData.teams = { home: '', away: '' };
    }
    
    // Ensure scores object exists
    if (!matchData.scores) {
      matchData.scores = { home: 0, away: 0 };
    }
    
    // Set default status if not provided
    if (!matchData.status) {
      matchData.status = 'Upcoming';
    }
    
    console.log('Creating match with processed data:', JSON.stringify(matchData, null, 2));
    
    const newMatch = new Match(matchData);
    
    // Validate the match before saving
    const validationError = newMatch.validateSync();
    if (validationError) {
      console.log('Mongoose validation error:', validationError);
      const validationErrors = Object.values(validationError.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors: validationErrors });
    }
    
    const savedMatch = await newMatch.save();
    
    console.log('Match created successfully:', savedMatch._id);
    res.status(201).json(savedMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Match with this slug already exists" });
    } else if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      res.status(400).json({ message: "Validation error", errors: validationErrors });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

// Update a match by ID
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a match by ID
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all matches for a sport
router.get("/:sport", async (req, res) => {
  try {
    const { sport } = req.params;
    const sportMatches = await Match.find({ sport }).sort({ date: -1 });
    res.json(sportMatches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a specific match by slug
router.get("/:sport/:slug", async (req, res) => {
  try {
    const { sport, slug } = req.params;
    const match = await Match.findOne({ sport, slug });
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a new match
router.post("/:sport", async (req, res) => {
  try {
    const { sport } = req.params;
    const matchData = { ...req.body, sport };
    
    const newMatch = new Match(matchData);
    const savedMatch = await newMatch.save();
    
    res.status(201).json(savedMatch);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Match with this slug already exists for this sport" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

// Update a match
router.put("/:sport/:slug", async (req, res) => {
  try {
    const { sport, slug } = req.params;
    const match = await Match.findOneAndUpdate(
      { sport, slug }, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a match
router.delete("/:sport/:slug", async (req, res) => {
  try {
    const { sport, slug } = req.params;
    const match = await Match.findOneAndDelete({ sport, slug });
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router; 