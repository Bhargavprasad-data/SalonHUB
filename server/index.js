import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRoutes from './routes/auth.js';
import helpRoutes from './routes/help.js';
import sellRoutes from './routes/sell.js';
import buyRoutes from './routes/buy.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/sell', sellRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/salonhub';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Restart trigger
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });
