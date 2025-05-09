import mongoose from 'mongoose';

// Schema for reaction-time trials
const ReactionSchema = new mongoose.Schema({
  task:            { type: String, required: true },
  rt:              { type: Number, required: true },
  stimulus:        { type: String },
  response:        { type: mongoose.Schema.Types.Mixed },
  trial_type:      { type: String },
  trial_index:     { type: Number },
  plugin_version:  { type: String },
  time_elapsed:    { type: Number },
  lang:            { type: String },
  correct:         { type: Boolean }
}, { _id: false });

// Schema for visual-search trials
const SearchSchema = new mongoose.Schema({
  task:            { type: String, required: true },
  set_size:        { type: Number, required: true },
  difficulty:      { type: String, required: true },
  target_present:  { type: Boolean, required: true },       // ← NEW!
  target_index:    { type: Number },                        // now optional if no T
  target_row:      { type: Number },
  target_col:      { type: Number },

  rt:              { type: Number, required: true },
  response:        { type: mongoose.Schema.Types.Mixed, required: true },
  response_label:  { type: String },
  noT_selected:    { type: Boolean, default: false },

  clicked_index:   { type: Number },
  clicked_row:     { type: Number },
  clicked_col:     { type: Number },

  trial_type:      { type: String },
  trial_index:     { type: Number },
  plugin_version:  { type: String },
  time_elapsed:    { type: Number },
  lang:            { type: String },
  correct:         { type: Boolean, required: true }
}, { _id: false });

// Schema for summarized search performance
const SummarySchema = new mongoose.Schema({
  difficulty:      { type: String, required: true },
  set_size:        { type: Number, required: true },
  avg_rt:          { type: Number, required: true },
  accuracy:        { type: Number, required: true }
}, { _id: false });

// Schema for feedback responses
const FeedbackSchema = new mongoose.Schema({
  difficulty_rating: { type: Number, required: true, min: 1, max: 5 },
  easiest_combo: { type: String, required: true },
  hardest_combo: { type: String, required: true },
  comments:      { type: String }
}, { _id: false });

// Main participant document
const ParticipantSchema = new mongoose.Schema({
  sessionID:       { type: String, required: true, unique: true },
  lang:            { type: String, required: true },
  demographics:    {
    gender:            { type: String },
    age:               { type: Number },
    hobbies:      { type: [String], default: [] },  // array of selections
    hobbiesOther:      { type: String },
    dailyComputerTime: { type: String },
    residence:         { type: String }
  },
  reaction_trials: [ ReactionSchema ],
  search_trials:   [ SearchSchema ],
  summaries:       [ SummarySchema ],
  feedback:        FeedbackSchema,
  createdAt:       { type: Date, default: Date.now }
});

export default mongoose.model('Participant', ParticipantSchema);
