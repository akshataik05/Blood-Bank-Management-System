import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Donor from './models/Donor.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve index.html and script.js

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/bloodbank')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// Routes


// Fetch all donors (optionally filter by blood group)
app.get('/donors', async (req, res) => {
  const { bloodGroup } = req.query;
  const filter = bloodGroup ? { bloodGroup } : {};
  const donors = await Donor.find(filter);
  res.json(donors);
});

// Add new donor
app.post('/donors', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete donor
app.delete('/donors/:id', async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update donor area
app.patch('/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
