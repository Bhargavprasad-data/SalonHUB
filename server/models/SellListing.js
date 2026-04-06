import mongoose from 'mongoose';

const SellListingSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('SellListing', SellListingSchema);
