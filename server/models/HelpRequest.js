import mongoose from 'mongoose';

const HelpRequestSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  problemDescription: { type: String, required: true },
  photo: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
}, { timestamps: true });

export default mongoose.model('HelpRequest', HelpRequestSchema);
