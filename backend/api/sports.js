const express = require("express");
const router = express.Router();
const Sport = require('../models/Sport');
const { authenticateToken, requireAdmin, canManageSport } = require('../middleware/auth');

// Get all sports (Public)
router.get("/", async (req, res) => {
  try {
    const { type, category } = req.query;
    let filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (category) {
      filter.category = category;
    }
    
    const sports = await Sport.find(filter).sort({ createdAt: -1 });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get sports by type (Public)
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const sports = await Sport.find({ type }).sort({ createdAt: -1 });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get upcoming sports (future dates) (Public)
router.get("/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const upcomingSports = await Sport.find({
      date: { $gte: now.toISOString().split('T')[0] }
    }).sort({ date: 1 });
    res.json(upcomingSports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a specific sport by slug (Public) - This must come before /:id
router.get("/slug/:slug", async (req, res) => {
  console.log("Slug route hit:", req.params.slug);
  try {
    const sport = await Sport.findOne({ slug: req.params.slug });
    if (!sport) {
      return res.status(404).json({ message: "Sport not found" });
    }
    res.json(sport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single sport by id (Public)
router.get("/:id", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a new sport (Protected - Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      name, 
      title, 
      slug, 
      type,
      category, 
      description, 
      image, 
      date, 
      venue, 
      registerLink, 
      moreDetailsLink, 
      minPlayers,
      maxPlayers,
      arrivalTime, 
      fixture, 
      gameTiming,
      registrationDeadline,
      registrationFee,
      eventType,
      organizer,
      contactInfo,
      status
    } = req.body;
    
    if (!name) return res.status(400).json({ message: "Name is required" });
    
    const newSport = new Sport({
      name,
      title: title || name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      type: type || 'normal_sport',
      category: category || "Outdoor",
      description: description || "",
      image: image || `https://picsum.photos/seed/${name.toLowerCase()}/600/300`,
      date: date || new Date().toISOString().split('T')[0],
      venue: venue || "TBD",
      registerLink: registerLink || "#",
      moreDetailsLink: moreDetailsLink || "#",
      minPlayers: minPlayers || 1,
      maxPlayers: maxPlayers || null,
      arrivalTime: arrivalTime || "9:00 AM",
      fixture: fixture || "TBD",
      gameTiming: gameTiming || "TBD",
      registrationDeadline: registrationDeadline || null,
      registrationFee: registrationFee || 0,
      eventType: eventType || 'other',
      organizer: organizer || null,
      contactInfo: contactInfo || null,
      status: status || 'upcoming'
    });
    
    const savedSport = await newSport.save();
    res.status(201).json(savedSport);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Sport with this slug already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

// Update a sport (Protected - Admin with sport access)
router.put("/:id", authenticateToken, canManageSport, async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a sport (Protected - Admin with sport access)
router.delete("/:id", authenticateToken, canManageSport, async (req, res) => {
  try {
    const sport = await Sport.findByIdAndDelete(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json({ message: "Sport deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
