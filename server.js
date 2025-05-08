// server.js
import express from 'express';
import cors    from 'cors';
import mongoose from 'mongoose';
import path    from 'path';
import { fileURLToPath } from 'url';
import dotenv  from 'dotenv';
import Participant from './models/Participant.js';  // your Mongoose model

dotenv.config();
const app = express();

// ES module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve your frontend
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected to', mongoose.connection.name))
.catch(err => { console.error(err); process.exit(1); });

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Data endpoint
app.post('/api/participants', async (req, res) => {
  const payload = req.body;    // ← Extract the body
  try {
    const doc = await Participant.findOneAndUpdate(
      { sessionID: payload.sessionID },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ status: 'success', id: doc._id });
  } catch (err) {
    console.error('Error saving participant:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Fallback to index.html for any other route
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Listening on http://localhost:${PORT}`));
