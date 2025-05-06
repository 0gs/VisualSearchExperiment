// server.js
import express from 'express';
import cors    from 'cors';
import mongoose from 'mongoose';
import path    from 'path';
import { fileURLToPath } from 'url';
import dotenv  from 'dotenv';
import Participant from './models/Participant.js';

dotenv.config();
const app = express();

// ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Simple Mongoose model
const ParticipantSchema = new mongoose.Schema({}, { strict: false });
const Participant = mongoose.model('Participant', ParticipantSchema);

// Connect to MongoDB (Atlas or local)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected');
    console.log('→ using database:', mongoose.connection.name);
  })
.catch(err=> { console.error(err); process.exit(1); });

// Health check
app.get('/api/health', (_,res) => res.json({ status:'ok' }));

// Data endpoint
app.post('/api/participants', async (req, res) => {
  try {
    const doc = await Participant.findOneAndUpdate(
        { sessionID: payload.sessionID },
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    res.json({ status:'success', id: doc._id });
  } catch(err) {
    console.error(err);
    res.status(500).json({ status:'error', message:err.message });
  }
});

// Fallback: serve index.html
app.get('*', (_,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`🚀 http://localhost:${PORT}`));
