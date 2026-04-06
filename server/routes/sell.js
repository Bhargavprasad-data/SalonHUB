import express from 'express';
import SellListing from '../models/SellListing.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all sell listings
router.get('/', async (req, res) => {
  try {
    const listings = await SellListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new sell listing with image upload
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const listingData = { ...req.body };
    if (req.file) {
      listingData.image = `/uploads/${req.file.filename}`;
    } else if (!listingData.image) {
      listingData.image = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'; // Default fallback
    }

    const newListing = new SellListing(listingData);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a sell listing
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedListing = await SellListing.findByIdAndDelete(req.params.id);
    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a sell listing
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedListing = await SellListing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
