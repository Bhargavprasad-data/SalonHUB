import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Admin Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: 'Admin'
    });
    await user.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, role: 'Admin' });
    if (!user) return res.status(400).json({ error: 'Admin not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

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

// Get all non-admin users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Ensure Admin cannot delete another Admin via this route
        if (user.role === 'Admin') return res.status(403).json({ error: 'Cannot delete admin accounts via this route.'});

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
