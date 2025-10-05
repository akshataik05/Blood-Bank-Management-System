import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  contact: { type: String, required: true },
  area: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 75 },
  gender: { type: String, enum: ['Male', 'Female'], required: true }
});

export default mongoose.model('Donor', donorSchema);
