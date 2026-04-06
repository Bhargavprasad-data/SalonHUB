import express from 'express';
import Product from '../models/Product.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all buy products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new buy product with image upload
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    } else if (!productData.image) {
      productData.image = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500'; // Default fallback
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a buy product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a buy product
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
