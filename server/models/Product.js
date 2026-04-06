import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sellerName: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
