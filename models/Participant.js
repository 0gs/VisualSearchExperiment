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
  rt:              { type: Number, required: true },
  response:        { type: mongoose.Schema.Types.Mixed, required: true },
  response_label:  { type: String },
  noT_selected:    { type: Boolean, default: false },
  target_index:    { type: Number, required: true },
  target_row:      { type: Number, required: true },
  target_col:      { type: Number, required: true },
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

// Main participant document
const ParticipantSchema = new mongoose.Schema({
  sessionID:       { type: String, required: true, unique: true },
  lang:            { type: String, required: true },
  demographics:    {
    gender:        { type: String },
    age:           { type: Number },
    hobbies:       { type: String }
  },
  reaction_trials: [ ReactionSchema ],
  search_trials:   [ SearchSchema ],
  summaries:       [ SummarySchema ],
  createdAt:       { type: Date, default: Date.now }
});

export default mongoose.model('Participant', ParticipantSchema);
