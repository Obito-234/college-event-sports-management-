const express = require("express");
const router = express.Router();
const Gallery = require('../models/Gallery');

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single gallery image by id
router.get("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a new gallery image
router.post("/", async (req, res) => {
  try {
    const { url, caption } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const newImage = new Gallery({
      url,
      caption: caption || ""
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a gallery image
router.put("/:id", async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a gallery image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;