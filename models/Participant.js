import mongoose from 'mongoose';

// Reakcijas laika mēģinājumi
const ReactionSchema = new mongoose.Schema({
  task:            { type: String, required: true },
  rt:              { type: Number, required: true },  // Reakcijas laiks milisekundēs
  stimulus:        { type: String },
  response:        { type: mongoose.Schema.Types.Mixed },
  trial_type:      { type: String },
  trial_index:     { type: Number },
  plugin_version:  { type: String },
  time_elapsed:    { type: Number },
  lang:            { type: String },
  correct:         { type: Boolean }
}, { _id: false });

// Vizuālās meklēšanas mēģinājumi
const SearchSchema = new mongoose.Schema({
  task:            { type: String, required: true },
  set_size:        { type: Number, required: true },
  difficulty:      { type: String, required: true },  
  target_present:  { type: Boolean, required: true }, 
  target_index:    { type: Number },                  
  target_row:      { type: Number },                 
  target_col:      { type: Number },                 
  target_color:    { type: String },                
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
  correct:         { type: Boolean, required: true }  // Vai atbilde bija pareiza
}, { _id: false });

// Rezultātu kopsavilkums
const SummarySchema = new mongoose.Schema({
  difficulty:     { type: String,  required: true },  // Sarežģītības līmenis
  set_size:       { type: Number,  default: null },
  target_present: { type: Boolean, required: true },  // Nosaka, vai T ir iekļauts
  avg_rt:         { type: Number,  required: true },  // Vidējais reakcijas laiks
  accuracy:       { type: Number,  required: true }   // Precizitāte procentos
}, { _id: false });

// Novērtējuma aptauja
const FeedbackSchema = new mongoose.Schema({
  difficulty_rating: { type: Number, required: true, min: 1, max: 5 },
  easiest_combo: { type: String, required: true },
  hardest_combo: { type: String, required: true },
  comments:      { type: String }
}, { _id: false });

// Demogrāfiskie un citi data par dalībnieku
const ParticipantSchema = new mongoose.Schema({
  sessionID:       { type: String, required: true, unique: true }, 
  lang:            { type: String, required: true },       
  
  demographics:    {
    gender:            { type: String },            
    age:               { type: Number },             
    hobbies:           { type: [String], default: [] }, 
    hobbiesOther:      { type: String },           
    dailyComputerTime: { type: String },      
    residence:         { type: String },           
    hand:              { type: String, enum: ['right','left', 'both'] },
    colorVision:       { type: String, enum: ['yes','no','unsure'] }
  },
  
  reaction_trials: [ ReactionSchema ],            
  search_trials:   [ SearchSchema ],                
  summaries:       [ SummarySchema ],               
  feedback:        FeedbackSchema,                  
  
  userAgent:       { type: String },               
  screenWidth:     { type: Number },                 
  screenHeight:    { type: Number },               
  finishedAt:      { type: Date },                  
  createdAt:       { type: Date, default: Date.now }  
});

export default mongoose.model('Participant', ParticipantSchema);