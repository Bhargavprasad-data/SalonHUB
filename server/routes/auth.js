import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Register
router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, email, password, role, number } = req.body;
    
    if (!role || !['Buy', 'Help', 'Sell', 'Hateres', 'Admin'].includes(role)) {
       return res.status(400).json({ error: 'Invalid or missing role' });
    }

    // Role-based validation
    if (['Buy', 'Help'].includes(role) && !number) {
        return res.status(400).json({ error: 'Number is required' });
    }
    if (role === 'Sell' && (!number || !req.files?.photo)) {
        return res.status(400).json({ error: 'Number and photo of the shop are required for Sell role' });
    }
    if (role === 'Hateres' && (!number || !req.files?.photo || !req.files?.cv)) {
        return res.status(400).json({ error: 'Number, photo, and CV are required for Hateres role' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // File paths
    const photoPath = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : null;
    const cvPath = req.files?.cv ? `/uploads/${req.files.cv[0].filename}` : null;

    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role,
      number,
      photo: photoPath,
      cv: cvPath
    });
    await user.save();

    // Generate token for auto login
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
