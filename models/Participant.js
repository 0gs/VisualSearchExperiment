// models/Participant.js
import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  task:       String,
  rt:         Number,
  stimulus:   String,
  response:   mongoose.Schema.Types.Mixed,
  trial_type: String,
  trial_index: Number,
  plugin_version: String,
  time_elapsed: Number,
  lang:        String,
  correct:     Boolean
}, { _id: false });

const SearchSchema = new mongoose.Schema({
  task:       String,
  set_size:   Number,
  difficulty: String,
  rt:         Number,
  stimulus:   String,
  response:   mongoose.Schema.Types.Mixed,
  trial_type: String,
  trial_index: Number,
  plugin_version: String,
  time_elapsed: Number,
  lang:        String,
  correct:     Boolean
}, { _id: false });

const SummarySchema = new mongoose.Schema({
  difficulty: String,
  set_size:   Number,
  avg_rt:     Number,
  accuracy:   Number
}, { _id: false });

const ParticipantSchema = new mongoose.Schema({
  sessionID:       { type: String, required: true, unique: true },
  lang:            { type: String, required: true },
  demographics:    { gender: String, age: Number, hobbies: String },
  reaction_trials: [ReactionSchema],
  search_trials:   [SearchSchema],
  summaries:       [SummarySchema],
  createdAt:       { type: Date, default: Date.now }
});

export default mongoose.model('Participant', ParticipantSchema);
