// ──────────────────────────────────────────────
// experiment.js
// ──────────────────────────────────────────────

// Imports
import { initJsPsych } from 'https://esm.sh/jspsych@8.2.1';
import htmlKeyboardResponse from 'https://esm.sh/@jspsych/plugin-html-keyboard-response@2.1.0';
import surveyHtmlForm from 'https://esm.sh/@jspsych/plugin-survey-html-form@2.1.0';
import htmlButtonResponse from 'https://esm.sh/@jspsych/plugin-html-button-response@2.1.0';
import callFunction from 'https://esm.sh/@jspsych/plugin-call-function@2.1.0';
import { escapeHtml, pick, postData } from './utils.js';

// ─── Prevent find/context menu ──────────────────
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') e.preventDefault();
});
document.addEventListener('contextmenu', e => e.preventDefault());

// ─── Session & i18n setup ──────────────────────
const sessionID = Date.now().toString() + '-' + Math.floor(Math.random() * 1e6);
let lang = 'en';
const API  = '/api/participants'; // ← your Express endpoint

const i18n = {
  en: {
    languagePrompt: "Choose your language:",
    welcome: "Welcome to the Visual Search Experiment",
    begin: "Press any key to begin.",
    reactionInstr: "You'll see a '+' then a green 'X'. Press SPACE when you see 'X'.",
    findT: "Find the letter <strong>T</strong>",
    ready: "Press any key when ready.",
    avgRT: l => `Your avg. reaction time: <strong>${l} ms</strong>`,
    avgSearch: (rt, acc) => `
      <h3>Search Summary</h3>
      <p>Avg RT: <strong>${rt} ms</strong></p>
      <p>Accuracy: <strong>${acc}%</strong></p>
      <p>Press any key to continue.</p>
    `,
    exampleIntro: "Here's a 4×4 example (black letters)",
    break: "Take a quick break! Press any key to continue.",
    correct: "✅ Correct!",
    incorrect: "❌ Incorrect",
    thanks: "Thank you! Press Exit to finish.",
    endMessage: "Thank you for completing the experiment. You may now close this page."
  },
  lv: {
    languagePrompt: "Izvēlieties valodu:",
    welcome: "Laipni lūdzam vizuālajā meklēšanas testā",
    begin: "Nospiediet jebkuru taustiņu, lai sāktu.",
    reactionInstr: "Jūs redzēsiet '+' un pēc tam zaļu 'X'. Nospiediet ATSTARPI, kad redzat 'X'.",
    findT: "Atrodiet burtu <strong>T</strong>",
    ready: "Nospiediet jebkuru taustiņu, kad esat gatavs.",
    avgRT: l => `Vid. reakcijas laiks: <strong>${l} ms</strong>`,
    avgSearch: (rt, acc) => `
      <h3>Meklēšanas kopsavilkums</h3>
      <p>Vid. RT: <strong>${rt} ms</strong></p>
      <p>Precizitāte: <strong>${acc}%</strong></p>
      <p>Nospiediet jebkuru taustiņu, lai turpinātu.</p>
    `,
    exampleIntro: "4×4 piemērs (melni burti).",
    break: "Īsa pauze! Nospiediet jebkuru taustiņu.",
    correct: "✅ Pareizi!",
    incorrect: "❌ Nepareizi",
    thanks: "Paldies! Nospiediet Exit, lai pabeigtu eksperimentu.",
    endMessage: "Paldies, ka piedalījāties! Jūs varat aizvērt šo lapu."
  }
};

// ─── Initialize jsPsych ─────────────────────────
const jsPsych = initJsPsych({
  data: { sessionID },
  show_progress_bar: true,
  auto_update_progress_bar: true,
  on_start: () => {
    document.getElementById('bgm')?.play().catch(() => {});
    feather.replace();
  },
  plugins: { htmlKeyboardResponse, surveyHtmlForm, htmlButtonResponse, callFunction }
});

// ─── Task definitions
const languageScreen = {
  type: surveyHtmlForm,
  data: { task: 'language' },          // ← added
  preamble: `<h3>${i18n.en.languagePrompt} / ${i18n.lv.languagePrompt}</h3>`,
  html: `
    <p><label><input type="radio" name="lang" value="en" checked> English</label></p>
    <p><label><input type="radio" name="lang" value="lv"> Latviešu</label></p>
  `,
  on_finish: data => {
    lang = data.response.lang;
    jsPsych.data.addProperties({ lang });
  }
};

const welcome = {
  type: htmlKeyboardResponse,
  stimulus: () => `<h2>${i18n[lang].welcome}</h2><p>${i18n[lang].begin}</p>`,
  choices: "ALL_KEYS"
};

const demographics = {
  type: surveyHtmlForm,
  data: { task: 'demographics' },      // ← added
  preamble: `<h3>Enter your info:</h3>`,
  html: `
    <p>Gender: <select name="gender" required>
      <option value="" disabled selected>Select…</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="other">Other</option>
    </select></p>
    <p>Age: <input name="age" type="number" min="18" max="99" required></p>
    <p>Hobbies: <input name="hobbies" type="text" placeholder="e.g. reading" required></p>
  `
};

// Reaction-time block
const reactionIntro = {
  type: htmlKeyboardResponse,
  stimulus: () => `<p>${i18n[lang].reactionInstr}</p><p>${i18n[lang].begin}</p>`,
  choices: "ALL_KEYS"
};
const reactionCountdown = [3, 2, 1].map(n => ({
  type: htmlKeyboardResponse,
  stimulus: `<p>${n}</p>`,
  choices: [],
  trial_duration: 1000
}));
const reactionFixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px;">+</div>',
  choices: 'NO_KEYS',
  trial_duration: () => 500 + Math.random() * 1000
};
const reactionTrial = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px; color:green;">X</div>',
  choices: 'ALL_KEYS',      // accept any key
  response_ends_trial: true,
  data: { task: 'reaction' }
};
const reactionBlock = {
  timeline: [reactionIntro, ...reactionCountdown, reactionFixation, reactionTrial],
  repetitions: 1
};

const showBaseline = {
    type: htmlKeyboardResponse,
    stimulus: () => {
      console.log('⚙️ All trials so far:', jsPsych.data.get().values());
      console.log('⚙️ reactionTrials:', jsPsych.data.get().filter({task:'reaction'}).values());
      console.log('⚙️ searchingg:', jsPsych.data.get().filter({ task: 'search' }).values());
      const recs = jsPsych.data.get().filter({task:'reaction'}).values();
      const rts  = recs.map(r => r.rt);
      const avg  = rts.length ? (rts.reduce((a,b)=>a+b)/rts.length).toFixed(2) : 'N/A';
      return `<p>${i18n[lang].avgRT(avg)}</p><p>${i18n[lang].begin}</p>`;
    },
    choices: 'ALL_KEYS'
  };
  

// ─── Step 1: Enhanced makeSearchSegment ─────────
function makeSearchSegment(colors, size, difficultyLabel) {
  const total     = size * size;
  const targetIdx = Math.floor(Math.random() * total);

  const choices = Array.from({ length: total }, (_, i) => {
    const isTarget = i === targetIdx;
    const symbol   = isTarget ? 'T' : 'L';
    const rot      = isTarget ? 0 : pick([0,90,180,270]);
    const col      = pick(colors);
    return `<span style="display:block;transform:rotate(${rot}deg);color:${col};font-size:20px;font-weight:bold;">${symbol}</span>`;
  });

  return [
    { type: htmlKeyboardResponse,
      stimulus: `<p>${i18n[lang].findT}</p><p>${i18n[lang].ready}</p>`,
      choices: 'ALL_KEYS'
    },
    ...[3,2,1,'Go!'].map(x => ({ type: htmlKeyboardResponse, stimulus:`<p>${x}</p>`, choices: [], trial_duration: 1000 })),
    { type: htmlButtonResponse,
      stimulus: '',
      choices,
      button_layout: 'grid',
      grid_columns: size,
      data: {
        task: 'search',
        set_size: size,
        difficulty: difficultyLabel
      },
      on_finish: data => { data.correct = (data.response === targetIdx); }
    },
    { type: htmlKeyboardResponse,
      stimulus: () => {
        const last = jsPsych.data.get().last(1).values()[0];
        const anim = last.correct ? 'animate__zoomIn' : 'animate__shakeX';
        const msg  = last.correct ? i18n[lang].correct : i18n[lang].incorrect;
        return `<div class="animate__animated ${anim}">${msg}</div>`;
      },
      choices: 'NO_KEYS',
      trial_duration: 500
    }
  ];
}

// Build full search segments
const searchSegments = [];
[['black'], ['black','red'], ['red','blue','green']].forEach((colors, idx) => {
  const label = ['easy','medium','hard'][idx];
  [2,4,8].forEach(size => {
    for (let i=0; i<1; i++) {
      searchSegments.push(...makeSearchSegment(colors, size, label));
    }
    searchSegments.push({ type: htmlKeyboardResponse, stimulus:`<p>${i18n[lang].break}</p>`, choices:'ALL_KEYS' });
  });
});

const showSearchSummary = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const recs = jsPsych.data.get().filter({ task:'search' }).values();
    const rts  = recs.map(r => r.rt);
    const cor  = recs.map(r => r.correct ? 1 : 0);
    const avg  = rts.length ? (rts.reduce((a,b)=>a+b)/rts.length).toFixed(2) : 'N/A';
    const acc  = cor.length ? ((cor.reduce((a,b)=>a+b)/cor.length)*100).toFixed(1) : 'N/A';
    return i18n[lang].avgSearch(avg, acc);
  },
  choices: 'ALL_KEYS'
};

const goodbye    = { type: htmlButtonResponse, stimulus:`<h3>${i18n[lang].thanks}</h3>`, choices:['Exit'] };
const finalThanks = { type: htmlKeyboardResponse, stimulus:()=>`<p>${i18n[lang].endMessage}</p>`, choices:'NO_KEYS' };

// ─── Step 2: Build payload inside saveData ─────
const saveData = {
  type: callFunction,
  func: () => {
    // raw trial arrays
    const reactionTrials = jsPsych.data.get().filter({ task:'reaction' }).values();
    const searchTrials   = jsPsych.data.get().filter({ task:'search' }).values();
    // aggregate
    const agg = {};
    searchTrials.forEach(tr => {
        const key = `${tr.difficulty}|${tr.set_size}`;
        agg[key] = agg[key] || { difficulty: tr.difficulty, set_size: tr.set_size, rts: [], corrects: [] };
        agg[key].rts.push(tr.rt);
        agg[key].corrects.push(tr.correct ? 1 : 0);
      });
      const summaries = Object.values(agg).map(g => ({
        difficulty: g.difficulty,
        set_size:   g.set_size,
        avg_rt:     +(g.rts.reduce((a,b)=>a+b,0)/g.rts.length).toFixed(2),
        accuracy:   +((g.corrects.reduce((a,b)=>a+b,0)/g.corrects.length)*100).toFixed(1)
      }));;

      const demoRec = jsPsych.data
      .get()
      .filter({ task: 'demographics' })
      .values()[0] || {};
      
      const demographics = demoRec.response || {}

      const payload = {
        sessionID,
        lang,
        demographics,
        reaction_trials: reactionTrials,
        search_trials:   searchTrials,
        summaries
      };
    // full payload
    // POST to backend
    console.log('📤 Posting payload:', payload);
    postData(API, payload);
  }
};

// ─── Run the timeline ───────────────────────────
jsPsych.run([
  languageScreen,
  welcome,
  demographics,
  reactionBlock,
  showBaseline,
  { type: htmlKeyboardResponse, stimulus: `<p>${i18n[lang].exampleIntro}</p><p>${i18n[lang].begin}</p>`, choices:'ALL_KEYS' },
  ...makeSearchSegment(['black'], 4, 'example'),
  ...searchSegments,
  showSearchSummary,
  saveData,    // ← data‐posting here
  goodbye,
  finalThanks
]);