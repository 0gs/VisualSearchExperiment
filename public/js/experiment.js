// ──────────────────────────────────────────────
// experiment.js
// ──────────────────────────────────────────────

// ─── 1) Mobile‐check overlay first (ENG & LV) ────────────────────
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  .test(navigator.userAgent);

if (isMobile) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    zIndex: 9999,
    padding: '1rem',
    fontSize: '1.25rem'
  });
  overlay.innerHTML = `
    <div>
      <h2>Please switch to a desktop or laptop!</h2>
      <h2 style="margin-top:0.5em;">Lūdzu pārejiet uz datoru vai portatīvo datoru!</h2>
      <p>This experiment works best on a computer with keyboard and mouse.</p>
      <p style="margin-top:0.5em;">Šis eksperiments vislabāk darbojas datorā ar klavietūru un peli.</p>
      <button id="continueAnyway" style="
        margin-top:1.5em;
        padding:0.75rem 1.5rem;
        font-size:1rem;
        border:none;
        border-radius:6px;
        background:#4a90e2;
        color:#fff;
        cursor:pointer;
      ">
        Continue anyway / Turpināt
      </button>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('continueAnyway')
    .addEventListener('click', () => overlay.remove());
}


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

const introduction = {
  type: htmlButtonResponse,
  stimulus: () => i18n[lang].instructions,
  choices: [ i18n[lang].continue ],
  button_html: '<button class="jspsych-btn">%choice%</button>',
  data: { trial_type: 'instructions' }
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

// ──────────────────────────────────────────────
// 1) Your unchanged intro & countdown
// ──────────────────────────────────────────────
const reactionIntro = {
  type: htmlKeyboardResponse,
  stimulus: () => `<p>${i18n[lang].reactionInstr}</p><p>${i18n[lang].begin}</p>`,
  choices: 'ALL_KEYS'
};
const reactionCountdown = [3,2,1].map(n => ({
  type: htmlKeyboardResponse,
  stimulus: `<p>${n}</p>`,
  choices: [],            // no key accepted here
  trial_duration: 1000
}));

// ──────────────────────────────────────────────
// 2) Fixation that RECORDS premature presses
// ──────────────────────────────────────────────
const fixationCheck = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px;">+</div>',
  choices: 'ALL_KEYS',            // listen for any key
  trial_duration: () => 1000 + Math.random()*10000,
  response_ends_trial: true,      // end on key or timeout
  data: { phase: 'fixation' },
  on_finish: d => { d.premature = d.response !== null; }
};

// ──────────────────────────────────────────────
// 3) Warning if they pressed too soon
// ──────────────────────────────────────────────
const tooSoon = {
  type: htmlKeyboardResponse,
  stimulus: `
    <p>Too soon! Please wait for the green “X” before responding.</p>
    <p>Press any key to retry this reaction.</p>`,
  choices: 'ALL_KEYS'
};

// ──────────────────────────────────────────────
// 4) The actual reaction trial
// ──────────────────────────────────────────────
const reactionTrial = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px; color:green;">X</div>',
  choices: 'ALL_KEYS',      // accept any key
  response_ends_trial: true,
  data: { task: 'reaction' }
};

// ──────────────────────────────────────────────
// 5) Progress screen after each success
// ──────────────────────────────────────────────
const reactionProgress = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const done = jsPsych.data.get().filter({ task:'reaction' }).count();
    return `<p>Reaction test ${done} / 5 completed.</p>
            <p>Press any key when you’re ready for the next one.</p>`;
  },
  choices: 'ALL_KEYS'
};

// ──────────────────────────────────────────────
// 6) One “unit” that loops on premature
// ──────────────────────────────────────────────
const oneReaction = {
  timeline: [
    fixationCheck,
    {
      timeline: [ tooSoon ],
      conditional_function: () => {
        const lastFix = jsPsych.data.get()
          .filter({ phase: 'fixation' })
          .last(1)
          .values()[0];
        return lastFix.premature;
      }
    },
    {
      timeline: [ reactionTrial, reactionProgress ],
      conditional_function: () => {
        const lastFix = jsPsych.data.get()
          .filter({ phase: 'fixation' })
          .last(1)
          .values()[0];
        return !lastFix.premature;
      }
    }
  ],
  loop_function: () => {
    const lastFix = jsPsych.data.get()
      .filter({ phase: 'fixation' })
      .last(1)
      .values()[0];
    return lastFix.premature;  // repeat if they pressed early
  }
};

// ──────────────────────────────────────────────
// 7) Build 5 of these units in sequence
// ──────────────────────────────────────────────
const reactionBlock = {
  timeline: [
    reactionIntro,
    ...reactionCountdown,
    // repeat oneReaction 5 times:
    ...Array.from({length:0}, () => [ oneReaction ]).flat()
  ]
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
  
// ──────────────────────────────────────────────
// PRACTICE: generate 3 random practice trials
// ──────────────────────────────────────────────

// 1) Build a list of all possible (colors, set_size, difficulty) combos
const allSearchConds = [];
[['black'], ['black','red'], ['red','blue','green']].forEach((colors, idx) => {
  const diff = ['easy','medium','hard'][idx];
  [2,4,8].forEach(size => {
    allSearchConds.push({ colors, size, diff });
  });
});

// 2) Sample 3 of them without replacement
const practiceConds = jsPsych.randomization.sampleWithoutReplacement(allSearchConds, 0);

// 3) A “practice” version of makeSearchSegment
function makePracticeSegment(colors, size, difficultyLabel) {
  // pick a random target
  const total     = size * size;
  const targetIdx = Math.floor(Math.random()*total);

  // build the grid
  const choices = Array.from({length: total}, (_, i) => {
    const isT   = i===targetIdx;
    const symbol= isT ? 'T' : 'L';
    const rot   = isT ? 0 : pick([0,90,180,270]);
    const col   = pick(colors);
    return `<span style="
      display:block;
      transform:rotate(${rot}deg);
      color:${col};
      font-size:20px;
      font-weight:bold;
    ">${symbol}</span>`;
  });

  return [
    // ready screen
    {
      type: htmlKeyboardResponse,
      stimulus: `<p>${i18n[lang].findT}</p><p>${i18n[lang].ready}</p>`,
      choices: 'ALL_KEYS'
    },
    // countdown
    ...[3,2,1,'Go!'].map(x => ({
      type: htmlKeyboardResponse,
      stimulus: `<p>${x}</p>`,
      choices: [],
      trial_duration: 500
    })),
    // the grid button response
    {
      type: htmlButtonResponse,
      stimulus: '',
      choices,
      button_layout: 'grid',
      grid_columns: size,
      data: { task: 'practice', set_size: size, difficulty: difficultyLabel },
      on_finish: data => {
        data.correct = (data.response === targetIdx);
      }
    },
    // immediate feedback
    {
      type: htmlKeyboardResponse,
      stimulus: () => {
        const last = jsPsych.data.get().last(1).values()[0];
        if (last.correct) {
          return `<p>✅ Correct!</p><p>Press any key to continue.</p>`;
        } else {
          return `<p>❌ Incorrect, please click the letter T.</p><p>Press any key to retry.</p>`;
        }
      },
      choices: 'ALL_KEYS'
    }
  ];
}

// 4) Build the full practice timeline (3 trials)
const practiceTimeline = [];
practiceTimeline.push({
  type: htmlKeyboardResponse,
  stimulus: `<h3>Practice Trials (3)</h3>
             <p>These won’t be recorded.</p>
             <p>Press any key to begin.</p>`,
  choices: 'ALL_KEYS'
});

practiceConds.forEach(({colors, size, diff}, idx) => {
  practiceTimeline.push(
    ...makePracticeSegment(colors, size, diff)
  );
});

practiceTimeline.push({
  type: htmlKeyboardResponse,
  stimulus: `<p>Practice complete! The real test will start now.</p>
             <p>Press any key to continue.</p>`,
  choices: 'ALL_KEYS'
});



// ──────────────────────────────────────────────
// 1) Your 4 search conditions (unchanged)
// ──────────────────────────────────────────────
const searchConditions = [
  { label: 'baseline',   targetColor: 'black', distractorColors: ['black'] },
  { label: 'easy',       targetColor: 'red',   distractorColors: ['black'] },
  { label: 'difficult',  targetColor: 'blue',  distractorColors: ['red','green'] },
  { label: 'impossible', targetColor: null,    distractorColors: null }
];

// add the “I can't find T” label
i18n.en.noT = "No T";
i18n.lv.noT = "Es nevaru atrast T";

// ──────────────────────────────────────────────
// 2) Palette for impossible (64 unique hues)
// ──────────────────────────────────────────────
const impossiblePalette = Array.from({ length: 64 }, (_, i) =>
  `hsl(${Math.round(i * 360 / 64)},70%,50%)`
);

// ──────────────────────────────────────────────
// 3) Shared intro, countdown & fixation
// ──────────────────────────────────────────────
const searchIntro = {
  type: htmlKeyboardResponse,
  stimulus: () => `<p>${i18n[lang].findT}</p><p>${i18n[lang].ready}</p>`,
  choices: 'ALL_KEYS'
};

const searchCountdown = [3, 2, 1, 'Go!'].map(x => ({
  type: htmlKeyboardResponse,
  stimulus: `<p>${x}</p>`,
  choices: 'NO_KEYS',
  response_ends_trial: false,
  trial_duration: 1000
}));

const searchFixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px;">+</div>',
  choices: 'NO_KEYS',
  response_ends_trial: false,
  trial_duration: () => 500 + Math.random() * 500
};

// ──────────────────────────────────────────────
// 4) Build one 8×8 search “block” with extra button
// ──────────────────────────────────────────────
function makeSearchBlock(cond) {
  const size      = 8;
  const total     = size * size;    // 64
  const noTIndex  = total;          // sentinel for “I can’t find T”
  const targetIdx = Math.floor(Math.random() * total);

  // (Optional) unique‐hue logic for “impossible” trials
  let cellColors = null;
  if (cond.label === 'impossible') {
    cellColors = jsPsych.randomization
      .sampleWithoutReplacement(impossiblePalette, total);
  }

  // 1) Build the 64 grid‐cell HTML strings
  const gridChoices = Array.from({ length: total }, (_, i) => {
    const isT    = (i === targetIdx);
    const symbol = isT ? 'T' : 'L';
    const rot    = isT ? 0 : pick([0, 90, 180, 270]);
    const col    = cond.label === 'impossible'
      ? cellColors[i]
      : (isT ? cond.targetColor : pick(cond.distractorColors));
    return `<span style="
      display:block;
      transform:rotate(${rot}deg);
      color:${col};
      font-size:20px;
      font-weight:bold;
      text-align:center;
    ">${symbol}</span>`;
  });

  // 2) Build the No-T button HTML (in the prompt)
  const noTbtnHTML = `<button id="noTbtn" class="jspsych-btn">${i18n[lang].noT}</button>`;

  // 3) Return one trial that shows the grid + prompt
  return [
    searchIntro,
    ...searchCountdown,
    searchFixation,
    {
      type: htmlButtonResponse,
      stimulus: '',              // gridChoices become the buttons
      choices: gridChoices,
      button_layout: 'grid',
      grid_columns: size,
      trial_css_class: 'search-grid',
      prompt: noTbtnHTML,        // renders our single No-T button underneath
      data: {
        task:         'search',
        difficulty:   cond.label,
        set_size:     size,
        target_index: targetIdx
      },
      on_start: trial => {
        // record start time for both grid clicks & No-T
        trial._startTime = performance.now();
        // attach the No-T click handler
        setTimeout(() => {
          const btn = document.getElementById('noTbtn');
          btn.onclick = () => {
            const rt = Math.round(performance.now() - trial._startTime);
            jsPsych.finishTrial({
              // base data
              ...trial.data,
              // sentinel response
              response:      noTIndex,
              rt,
              noT_selected:   true,
              response_label: i18n[lang].noT,
              // target coords
              target_row:     Math.floor(targetIdx / size),
              target_col:     targetIdx % size,
              // clicked (none)
              clicked_index:  null,
              clicked_row:    null,
              clicked_col:    null,
              correct:        false
            });
          };
        }, 0);
      },
      on_finish: data => {
        // if they clicked a grid cell (response < 64)
        if (data.response < total) {
          data.noT_selected   = false;
          data.response_label = `cell ${data.response}`;
          data.target_row     = Math.floor(targetIdx / size);
          data.target_col     = targetIdx % size;
          data.clicked_index  = data.response;
          data.clicked_row    = Math.floor(data.response / size);
          data.clicked_col    = data.response % size;
          // plugin recorded data.rt automatically
          data.correct        = (data.response === targetIdx);
        }
        // else: No-T case was fully handled in finishTrial above
      }
    }
  ];
}






// ──────────────────────────────────────────────
// 5) Create 20 blocks, shuffle them, then flatten
// ──────────────────────────────────────────────
let blocks = [];
searchConditions.forEach(cond => {
  for (let i = 0; i < 1; i++) {
    blocks.push(makeSearchBlock(cond));
  }
});
blocks = jsPsych.randomization.shuffle(blocks);
const searchSegments = blocks.flat();






const showSearchSummary = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    // grab only the true “search” trials
    const recs = jsPsych.data.get().filter({ task: 'search' }).values();

    // extract RTs and correctness arrays
    const rts = recs
      .map(r => r.rt)
      .filter(rt => typeof rt === 'number' && !isNaN(rt));

    const correctFlags = recs.map(r => r.correct ? 1 : 0);

    // compute averages
    const avg = rts.length
      ? rts.reduce((sum, x) => sum + x, 0) / rts.length
      : null;

    const acc = correctFlags.length
      ? (correctFlags.reduce((sum, x) => sum + x, 0) / correctFlags.length) * 100
      : null;

    // format for display
    const avgStr = avg !== null ? avg.toFixed(2) : 'N/A';
    const accStr = acc !== null ? acc.toFixed(1) : 'N/A';

    return i18n[lang].avgSearch(avgStr, accStr);
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
  ...practiceTimeline,
  ...searchSegments,
  showSearchSummary,
  saveData,    // ← data‐posting here
  goodbye,
  finalThanks
]);