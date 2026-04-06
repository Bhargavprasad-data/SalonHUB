import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Buy', 'Help', 'Sell', 'Hateres', 'Admin'], required: true },
  number: { type: String },
  photo: { type: String }, // Path to photo
  cv: { type: String }, // Path to cv
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
