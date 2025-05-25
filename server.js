// server.js

import express from 'express';
import cors    from 'cors';
import mongoose from 'mongoose';
import path    from 'path';
import { fileURLToPath } from 'url';
import dotenv  from 'dotenv';
import Participant from './models/Participant.js';  // datubāzes modelis

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// CORS
app.use(cors({
  origin: 'https://sprucs.com',
  methods: ['GET','POST']
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// MongoDB savienojums
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected to', mongoose.connection.name))
.catch(err => { console.error(err); process.exit(1); });

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Galvenais endpoint
app.post('/api/participants', async (req, res) => {
  const payload = req.body; 
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

// Visas nezināmās adreses ved uz index.html
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servera palaišana
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));