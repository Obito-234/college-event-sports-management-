const express = require("express");
const router = express.Router();
const Event = require('../models/Event');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single event by id
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a new event 
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, date, venue, description, imageUrl, registrationLink, category } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const newEvent = new Event({
      title,
      date,
      venue: venue || "TBD",
      description: description || "",
      imageUrl: imageUrl || "https://picsum.photos/600/400",
      registrationLink: registrationLink || "#",
      category: category || "Cultural"
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update an event 
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete an event 
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;