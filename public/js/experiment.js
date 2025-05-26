// experiment.js

// Pirms eksperimenta - Mobilo telefonu pārbaude (ar tekstu LV & ENG)
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  .test(navigator.userAgent);

if (isMobile) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    background: 'darkred',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
    zIndex: 9999,
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.2
  });
  overlay.innerHTML = `
  <h2 style="font-size: 50px; margin: 0.5em 0;">
    Please, switch to a desktop or laptop!
  </h2>
  <h2 style="font-size: 50px; margin: 0.5em 0;">
    Lūdzu, pāriet uz datoru vai laptopu!
  </h2>
  <p  style="font-size: 50px; margin: 1em 0;">
  </p>
  <p  style="font-size: 50px; margin: 0.5em 0;">
    This experiment was designed for a computer with keyboard and mouse.
  </p>
  <p  style="font-size: 50px; margin: 0.5em 0;">
    Šis eksperiments ir paredzēts datoram ar tastatūru un peli.
  </p>
`;
  document.body.appendChild(overlay);

  document.getElementById('continueAnyway')
    .addEventListener('click', () => overlay.remove());
}

// Visi importi
import { initJsPsych } from 'https://esm.sh/jspsych@8.2.1';
import htmlKeyboardResponse from 'https://esm.sh/@jspsych/plugin-html-keyboard-response@2.1.0';
import surveyHtmlForm from 'https://esm.sh/@jspsych/plugin-survey-html-form@2.1.0';
import htmlButtonResponse from 'https://esm.sh/@jspsych/plugin-html-button-response@2.1.0';
import callFunction from 'https://esm.sh/@jspsych/plugin-call-function@2.1.0';
import { pick, postData } from './utils.js';
import { i18n } from './i18n.js';

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') e.preventDefault();
});
document.addEventListener('contextmenu', e => e.preventDefault());

const sessionID = Date.now().toString() + '-' + Math.floor(Math.random() * 1e6);
let lang = 'en';
const API  = '/api/participants';

// jsPsych sāk darbu
const jsPsych = initJsPsych({
  data: { sessionID },
  on_start: () => {
    feather.replace();
  },
  plugins: { htmlKeyboardResponse, surveyHtmlForm, htmlButtonResponse, callFunction }
});
   
// Pievieno klāt šos datus
jsPsych.data.addProperties({
  userAgent:    navigator.userAgent,
  screenWidth:  window.screen.width,
  screenHeight: window.screen.height,
});

// Valodas izvēles skats (LV & ENG)
const languageScreen = {
  type: surveyHtmlForm,
  data: { task: 'language' },
  preamble: `<h3>${i18n.en.languagePrompt} / ${i18n.lv.languagePrompt}</h3>`,
  html: `
    <p><label><input type="radio" name="lang" value="en" checked> English</label></p>
    <p><label><input type="radio" name="lang" value="lv"> Latviešu</label></p>
  `,
  button_label: `${i18n.en.continue} / ${i18n.lv.continue}`,
  on_finish: data => {
    lang = data.response.lang;
    jsPsych.data.addProperties({ lang });
  }
};

// Fullscreen mode
const goFullScreen = {
  type: callFunction,
  func: () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  }
};

const titlePage = {
  type: htmlButtonResponse,
  stimulus: () => `
    <h1>${i18n[lang].titlePageTitle}</h1>
    <p>${i18n[lang].titlePageWelcome}</p>
    <h3>${i18n[lang].titlePageTasksHeading}</h3>
    <p>
      ${i18n[lang].titlePageTasksList.map(item => `<p>${item}</p>`).join('')}
    </p>
    <h3>${i18n[lang].titlePageDurationHeading}</h3>
    <p>${i18n[lang].titlePageDuration}</p>
    <h3>${i18n[lang].titlePageDeviceHeading}</h3>
    <p>${i18n[lang].titlePageDevice}</p>
    <h3>${i18n[lang].titlePageAnonymityHeading}</h3>
    <p>${i18n[lang].titlePageAnonymity}</p>
    <h3>${i18n[lang].titlePageRightsHeading}</h3>
    <p>${i18n[lang].titlePageRights}</p>
    <p>${i18n[lang].titlePageContact}</p>
  `,
  choices: () => [ i18n[lang].agree ],
  button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,
  data: { trial_type: 'title', consent: 'I agree to participate' }
};

const genderForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-gender' },
  preamble: () => `<h3>${i18n[lang].genderPrompt}</h3>`,
  html: () => `
  <div>      
  <label>
          <input type="radio" name="gender" value="female" required>
          ${i18n[lang].female}
        </label><br>
        <label>
          <input type="radio" name="gender" value="male">
          ${i18n[lang].male}
        </label><br>
        <label>
          <input type="radio" name="gender" value="other">
          ${i18n[lang].other}
        </label>
  </div>
  `,
  button_label: () => i18n[lang].continue
};

const ageForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-age' },
  preamble: () =>  `<h3>${i18n[lang].agePrompt}</h3>`,
  html: () => `
    <p><input name="age" type="number" min="18" max="99" required></p>
  `,
  button_label: () => i18n[lang].continue
};

const hobbiesForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-hobbies' },
  preamble: () => `
    <h3>${i18n[lang].hobbiesPrompt}</h3>
    <p>${i18n[lang].hobbiesPrompt2}</p>
  `,
  html: () => `
    <p>
      <label>
        <input type="radio" name="hobbies" value="videoGaming" required>
        ${i18n[lang].hobbyVideoGaming}
      </label><br>
      <label>
        <input type="radio" name="hobbies" value="programming">
        ${i18n[lang].hobbyProgramming}
      </label><br>
      <label>
        <input type="radio" name="hobbies" value="reading">
        ${i18n[lang].hobbyReading}
      </label><br>
      <label>
        <input type="radio" name="hobbies" value="puzzles">
        ${i18n[lang].hobbyPuzzles}
      </label><br>
      <label>
        <input type="radio" name="hobbies" value="outdoorSports">
        ${i18n[lang].hobbyOutdoor}
      </label><br>
      <label>
        <input type="radio" name="hobbies" value="indoorExercise">
        ${i18n[lang].hobbyIndoor}
      </label><br>
      <label>
        <input type="radio" id="hobby-other-rb" name="hobbies" value="other">
        ${i18n[lang].hobbyOther}
      </label>
      <input id="hobby-other-txt"
             name="hobbiesOther"
             type="text"
             maxlength="50"
             placeholder="${i18n[lang].hobbiesOtherPlaceholder}"
             style="display:none; margin-left:1em; width:70%;">
    </p>
  `,
  on_load: () => {
    const otherRb  = document.getElementById('hobby-other-rb');
    const otherTxt = document.getElementById('hobby-other-txt');
    document.querySelectorAll('input[name="hobbies"]').forEach(rb => {
      rb.addEventListener('change', () => {
        if (otherRb.checked) {
          otherTxt.style.display = 'inline-block';
          otherTxt.focus();
        } else {
          otherTxt.style.display = 'none';
          otherTxt.value = '';
        }
      });
    });
  },
  button_label: () => i18n[lang].continue
};

const computerTimeForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-computerTime' },
  preamble: () => `<h3>${i18n[lang].computerTimePrompt}</h3>`,
  html: () => `
    <p>
      <label>
        <select name="computerTime" required>
          <option value="" disabled selected>Select…</option>
          ${i18n[lang].computerTimeOptions
            .map(opt => `<option value="${opt}">${opt}</option>`)
            .join('')}
        </select>
      </label>
    </p>
  `,
  button_label: () => i18n[lang].continue
};

const residenceForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-residence' },
  preamble: () => `<h3>${i18n[lang].residencePrompt}</h3>`,
  html: () => `
    <p>
      <label>
        <select name="residence" required>
          <option value="" disabled selected>Select…</option>
          <option value="city">${i18n[lang].residenceCity}</option>
          <option value="outside">${i18n[lang].residenceOutside}</option>
        </select>
      </label>
    </p>
  `,
  button_label: () => i18n[lang].continue
};

const handForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-hand' },
  html: () => `
  <p>
    <strong>${i18n[lang].handednessPrompt}</strong><br/>
    <label>
      <input type="radio" name="handedness" value="right" required>
      ${i18n[lang].rightHanded}
    </label><br/>
    <label style="margin-left:1em;">
      <input type="radio" name="handedness" value="left">
      ${i18n[lang].leftHanded}
    </label><br/>
    <label style="margin-left:1em;">
      <input type="radio" name="handedness" value="both">
      ${i18n[lang].bothHanded}
    </label>
  </p>
  `,
  button_label: () => i18n[lang].continue
};

const visionForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-vision' },
  html: () => `
  <p>
    <strong>${i18n[lang].colorVisionPrompt}</strong><br/>
    <label>
      <input type="radio" name="colorVision" value="yes" required>
      ${i18n[lang].colorVisionYes}
    </label><br/>
    <label>
      <input type="radio" name="colorVision" value="no">
      ${i18n[lang].colorVisionNo}
    </label><br/>
    <label>
      <input type="radio" name="colorVision" value="unsure">
      ${i18n[lang].colorVisionUnsure}
    </label>
  </p>
  <p>${i18n[lang].colorVisionHelp}</p>
  `,
  button_label: () => i18n[lang].continue
};

const reactionIntro = {
  type: htmlKeyboardResponse,
  stimulus: () => `<p>${i18n[lang].reactionInstr}</p><p>${i18n[lang].begin}</p>`,
  choices: 'ALL_KEYS'
};
const reactionCountdown = [3,2,1].map(n => ({
  type: htmlKeyboardResponse,
  stimulus: `<p>${n}</p>`,
  choices: [],
  trial_duration: 1500
}));

const fixationCheck = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px;">+</div>',
  choices: 'ALL_KEYS',
  trial_duration: () => 1000 + Math.random()*10000,
  response_ends_trial: true,
  data: { phase: 'fixation' },
  on_finish: d => { d.premature = d.response !== null; }
};

const tooSoon = {
  type: htmlKeyboardResponse,
  stimulus: () => `
    <p>${i18n[lang].tooSoonTitle}</p>
    <p>${i18n[lang].tooSoonPrompt}</p>`,
  choices: 'ALL_KEYS'
};

const reactionTrial = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px; color:black;">X</div>',
  choices: 'ALL_KEYS',
  response_ends_trial: true,
  data: { task: 'reaction' }
};

const reactionProgress = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const done = jsPsych.data.get().filter({ task:'reaction' }).count();
    return `<p>${i18n[lang].reactionProgressText1} ${done} ${i18n[lang].reactionProgressText2}</p>
            <p>${i18n[lang].reactionProgressPrompt}</p>`;
  },
  choices: 'ALL_KEYS'
};

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
    return lastFix.premature;
  }
};

// cik reakcijas testi
const reactionBlock = {
  timeline: [
    reactionIntro,
    ...reactionCountdown,
    ...Array.from({length:5}, () => [ oneReaction ]).flat()
  ]
};

// tikai priekš iesildīšanās
const allSearchConds = [];
[['black'], ['black','red'], ['red','blue','green']].forEach((colors, idx) => {
  const diff = ['easy','medium','hard'][idx];
  [8].forEach(size => {
    allSearchConds.push({ colors, size, diff });
  });
});

// cik iesildīšanās mēģinājumi
const practiceConds = jsPsych.randomization.sampleWithoutReplacement(allSearchConds, 3);

// Lai izveidotu iesildīšanās mēģinājumus
function makePracticeSegment(colors, size, difficultyLabel) {
  const total     = size * size;
  const targetIdx = Math.floor(Math.random()*total);

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
    {
      type: htmlKeyboardResponse,
      stimulus: () => `<p>${i18n[lang].findT}</p><p>${i18n[lang].ready}</p>`,
      choices: 'ALL_KEYS'
    },
    ...[3,2,1].map(x => ({
      type: htmlKeyboardResponse,
      stimulus: `<p>${x}</p>`,
      choices: [],
      trial_duration: 1500
    })),
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
    {
      type: htmlKeyboardResponse,
      stimulus: () => {
        const last = jsPsych.data.get().last(1).values()[0];
        if (last.correct) {
          return `
            <p>${i18n[lang].practiceFeedbackCorrectTitle}</p>
            <p>${i18n[lang].practiceFeedbackContinue}</p>`;
        } else {
          return `
            <p>${i18n[lang].practiceFeedbackIncorrectTitle}</p>
            <p>${i18n[lang].practiceFeedbackRetry}</p>`;
        }
      },
      choices: 'ALL_KEYS'
    }
  ];
}

// Iesildīšanās mēģinājumi
const practiceTimeline = [];
practiceTimeline.push({
  type: htmlKeyboardResponse,
  stimulus: () => `
    <h3>${i18n[lang].practiceTitle}</h3>
    <p>${i18n[lang].practiceInfo}</p>
    <p>${i18n[lang].practiceBeginPrompt}</p>`,
  choices: 'ALL_KEYS'
});

practiceConds.forEach(({colors, size, diff}, idx) => {
  practiceTimeline.push(
    ...makePracticeSegment(colors, size, diff)
  );
});

practiceTimeline.push({
  type: htmlKeyboardResponse,
  stimulus: () => `
    <p>${i18n[lang].practiceCompleteMessage}</p>
    <p>${i18n[lang].practiceContinuePrompt}</p>`,
  choices: 'ALL_KEYS'
});

// Visi definētie sarežģītības līmeņi
const searchConditions = [
  { label: 'BlackT-1',   targetColor: 'black', distractorColors: ['black'] },
  { label: 'RedT-2',       targetColor: 'red',   distractorColors: ['black'] },
  { label: 'BlueT-3',  targetColor: 'blue',  distractorColors: ['red','green'] },
  { label: 'UniqueT-64', targetColor: null,    distractorColors: null }
];

// Krāsu palete priekš UniqueT-64
const uniquePalette = Array.from({ length: 64 }, (_, i) =>
  `hsl(${Math.round(i * 360 / 64)},70%,50%)`
);

const searchIntro = {
  type: htmlKeyboardResponse,
  stimulus: () => `<p>${i18n[lang].findT}</p><p>${i18n[lang].ready}</p>`,
  choices: 'ALL_KEYS'
};

const searchCountdown = [3, 2, 1].map(x => ({
  type: htmlKeyboardResponse,
  stimulus: `<p>${x}</p>`,
  choices: 'NO_KEYS',
  response_ends_trial: false,
  trial_duration: 1500
}));

const searchFixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px;">+</div>',
  choices: 'NO_KEYS',
  response_ends_trial: false,
  trial_duration: () => 1000
};

// Lai izveidotu režģi ar pogu
function makeSearchBlock(cond, targetPresent) {
  const size      = 8;
  const total     = size * size;    // 64
  const noTIndex  = total;          // nevaru atrast T

  const targetIdx = targetPresent
    ? Math.floor(Math.random() * total)
    : null;

  let cellColors = null;
  if (cond.label === 'UniqueT-64') {
    cellColors = jsPsych.randomization
      .sampleWithoutReplacement(uniquePalette, total);
  }

 const thisTargetColor = cond.label === 'UniqueT-64'
   ? cellColors[targetIdx]
  : cond.targetColor;

  // Definē režģi
  const gridChoices = Array.from({ length: total }, (_, i) => {
    const isT    = targetPresent && i === targetIdx;
    const symbol = isT ? 'T' : 'L';
    const rot    = isT ? 0 : pick([0, 90, 180, 270]);
    const col    = cond.label === 'UniqueT-64'
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

  // Izveido režģi ar pogu, ka nevar atrast T
  return [
    searchIntro,
    ...searchCountdown,
    searchFixation,
    {
      type: htmlButtonResponse,
      stimulus: '',
      choices: gridChoices,
      button_layout: 'grid',
      grid_columns: size,
      trial_css_class: 'search-grid',

      prompt: () => {
        return `<button id="noTbtn" class="jspsych-btn">${i18n[lang].noT}</button>`;
      },      

      data: {
        task:         'search',
        difficulty:   cond.label,
        set_size:     size,
        target_present: targetPresent,
        target_index:   targetIdx,
        target_color:   thisTargetColor
      },
      on_start: trial => {
        // Ja izvēlas, ka neatrada T
        trial._startTime = performance.now();
        setTimeout(() => {
          const btn = document.getElementById('noTbtn');
          btn.onclick = () => {
            const rt = Math.round(performance.now() - trial._startTime);
            jsPsych.finishTrial({
              ...trial.data,
              response:      noTIndex,
              rt,
              noT_selected:   true,
              response_label: i18n[lang].noT,
              target_row:     Math.floor(targetIdx / size),
              target_col:     targetIdx % size,
              clicked_index:  null,
              clicked_row:    null,
              clicked_col:    null,
              correct:        !trial.data.target_present
            });
          };
        }, 0);
      },
      on_finish: data => {
        // Ja izvēlas simbolu, nevis ka neatrada T
        if (data.response < total) {

          const clicked = data.response;

          data.noT_selected   = false;
          data.response_label = `cell ${clicked}`;
          data.target_row      = targetPresent
                                ? Math.floor(targetIdx / size)
                                : null;
          data.target_col      = targetPresent
                                ? targetIdx % size
                                : null;
          data.clicked_index  = clicked;
          data.clicked_row    = Math.floor(clicked / size);
          data.clicked_col    = clicked % size;
          data.correct         = (
            targetPresent && clicked === targetIdx
          );
        }
      }
    }
  ];
}

// Definē ar T un bez T uzdevumu skaitu
const runsPerCond    = 6;
const noTRunsPerCond = 1;
let blocks = [];

searchConditions.forEach(cond => {
  // izveido 5 ar T un 1 bez T uzdevumus
  const flags = [
    ...Array(noTRunsPerCond).fill(false),
    ...Array(runsPerCond - noTRunsPerCond).fill(true)
  ];
  jsPsych.randomization.shuffle(flags)
    .forEach(present => {
      blocks.push(makeSearchBlock(cond, present));
    });
});

// Randomizē visus uzdevumus
blocks = jsPsych.randomization.shuffle(blocks);
const searchSegments = blocks.flat();

const goodbye = {
  type: htmlButtonResponse,
  stimulus: () => `<h3>${i18n[lang].thanks}</h3>`,
  choices: () => [ i18n[lang].exit ]
};

const finalThanks = { type: htmlKeyboardResponse, stimulus:()=>`<p>${i18n[lang].endMessage}</p>`, choices:'NO_KEYS' };

// Vērtējumu aptauja
const feedbackForm = {
  type: surveyHtmlForm,
  data: { task: 'feedback' },
  preamble: () => `<h3>${i18n[lang].feedbackTitle}</h3>`,
  html: () => `
    <!-- 1) Difficulty rating -->
    <p>
      <label>${i18n[lang].feedbackDifficultyLabel}
        <select name="difficulty" required>
          <option value="" disabled selected>${i18n[lang].selectPlaceholder}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
    </p>

    <!-- 2.1) Easiest color combination -->
    <p>
      <label>${i18n[lang].feedbackColorLabel}
        <select name="colorEasiest" required>
          <option value="" disabled selected>${i18n[lang].selectPlaceholder}</option>
          <option value="BlackT-1">${i18n[lang].colorOptBlack}</option>
          <option value="RedT-2">${i18n[lang].colorOptRedBlack}</option>
          <option value="BlueT-3">${i18n[lang].colorOptBlueRedBlack}</option>
          <option value="UniqueT-64">${i18n[lang].colorOptImpossible}</option>
          <option value="noT">${i18n[lang].noT}</option>
        </select>
      </label>
    </p>

    <!-- 2.2) Hardest color combination -->
    <p>
      <label>${i18n[lang].feedbackColorLabel2}
        <select name="colorHardest" required>
          <option value="" disabled selected>${i18n[lang].selectPlaceholder}</option>
          <option value="BlackT-1">${i18n[lang].colorOptBlack}</option>
          <option value="RedT-2">${i18n[lang].colorOptRedBlack}</option>
          <option value="BlueT-3">${i18n[lang].colorOptBlueRedBlack}</option>
          <option value="UniqueT-64">${i18n[lang].colorOptImpossible}</option>
          <option value="noT">${i18n[lang].noT}</option>
        </select>
      </label>
    </p>

    <!-- 3) Free-text comments -->
    <p>
      <label>${i18n[lang].feedbackCommentsLabel}<br/>
        <textarea name="comments" rows="4" style="width:100%;" maxlength="140"></textarea>
      </label>
    </p>
  `,
  button_label: () => i18n[lang].submitFeedback
};

// Sagatavo datus, lai tos nosūtītu datubāzei
const saveData = {
  type: callFunction,
  func: () => {
    const reactionTrials = jsPsych.data.get().filter({ task:'reaction' }).values();
    const searchTrials   = jsPsych.data.get().filter({ task:'search' }).values();
    const presentAgg = {};
    const noTAgg = { difficulty: 'No T', set_size: null, rts: [], corrects: [] };

    searchTrials.forEach(tr => {
      if (tr.target_present) {
        const key = `${tr.difficulty}|${tr.set_size}`;
        if (!presentAgg[key]) {
          presentAgg[key] = {
            difficulty: tr.difficulty,
            set_size: tr.set_size,
            rts: [],
            corrects: []
          };
        }
        presentAgg[key].rts.push(tr.rt);
        presentAgg[key].corrects.push(tr.correct ? 1 : 0);
      } else {
        noTAgg.rts.push(tr.rt);
        noTAgg.corrects.push(tr.noT_selected ? 1 : 0);
      }
    });

    // All summaries (with T)
    const presentSummaries = Object.values(presentAgg).map(g => ({
      difficulty:     g.difficulty,
      set_size:       g.set_size,
      target_present: true,
      avg_rt:         +(g.rts.reduce((a, b) => a + b, 0) / g.rts.length).toFixed(2),
      accuracy:       +((g.corrects.reduce((a, b) => a + b, 0) / g.corrects.length) * 100).toFixed(1)
    }));

    // No T summary
    const noTSummary = {
      difficulty:     'No T',
      set_size:       null,
      target_present: false,
      avg_rt:         +(noTAgg.rts.reduce((a, b) => a + b, 0) / noTAgg.rts.length).toFixed(2),
      accuracy:       +((noTAgg.corrects.reduce((a, b) => a + b, 0) / noTAgg.corrects.length) * 100).toFixed(1)
    };

    const summaries = [
      ...presentSummaries,
      noTSummary
    ];

      const genderRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-gender' })
      .values()[0] || { response: {} };

      const ageRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-age' })
      .values()[0] || { response: {} };

      const hobbyRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-hobbies' })
      .values()[0] || { response: {} };

      const compRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-computerTime' })
      .values()[0] || { response: {} };

      const resRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-residence' })
      .values()[0] || { response: {} };

      const handRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-hand' })
      .values()[0] || { response: {} };

      const visRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-vision' })
      .values()[0] || { response: {} };

      // Demogrāfijas un pārējo dalībnieka datu objekts
      const demographics = {
      gender:            genderRec.response.gender || null,
      age:               parseInt(ageRec.response.age, 10) || null,
      hobbies:           Array.isArray(hobbyRec.response.hobbies)
                          ? hobbyRec.response.hobbies
                          : [hobbyRec.response.hobbies].filter(Boolean),
      hobbiesOther:      hobbyRec.response.hobbiesOther || "",
      dailyComputerTime: compRec.response.computerTime || null,
      residence:         resRec.response.residence || null,
      hand:              handRec.response.handedness || null,
      colorVision:       visRec.response.colorVision || null
      };

      const fbRec = jsPsych.data.get()
        .filter({ task: 'feedback' })
        .values()[0] || { response: {} };

        const feedback = {
          difficulty_rating: parseInt(fbRec.response.difficulty, 10),  // 1–5 numeric
          easiest_combo: fbRec.response.colorEasiest,
          hardest_combo: fbRec.response.colorHardest,
          comments:      fbRec.response.comments || ""
        };

          const finishedAt = Date.now();
          const userAgent    = navigator.userAgent;
          const screenWidth  = window.screen.width;
          const screenHeight = window.screen.height;
      
      const payload = {
        sessionID,
        lang,
        demographics,
        reaction_trials: reactionTrials,
        search_trials:   searchTrials,
        summaries,
        feedback,
        userAgent,
        screenWidth,
        screenHeight,
        finishedAt
      };
    postData(API, payload);
  }
};

// Eksperimenta gaita (timeline)
jsPsych.run([
  languageScreen,
  goFullScreen,
  titlePage,
  reactionBlock,
   ...practiceTimeline,
  ...searchSegments,
   feedbackForm,
   genderForm,
   ageForm,
   handForm,
   visionForm,
   hobbiesForm,
   computerTimeForm,
   residenceForm,
   saveData,
   goodbye,
   finalThanks
]);