import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all help requests
router.get('/', async (req, res) => {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new help request with image upload
router.post('/', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const requestData = { ...req.body };
    if (req.file) {
      requestData.photo = `/uploads/${req.file.filename}`;
    } else if (!requestData.photo) {
      requestData.photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'; // Default fallback
    }

    const newRequest = new HelpRequest(requestData);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a help request
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedRequest = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a help request
router.put('/:id', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
