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
    Šis eksperiments ir paredzēts datoram ar klavietūru un peli.
  </p>
`;
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
    languagePrompt: "Select your preferred language",
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
    endMessage: "Thank you very much for taking part! You can now close this page.",
    noT: "I can't find T",
    mobileTitle: "Please switch to a desktop or laptop",
    mobileDesc: "This experiment works best on a computer with a keyboard.",
    mobileContinue: "Continue anyway",
    demoTitle: "Enter your info:",
    genderLabel: "Gender:",
    genderFemale: "Female",
    genderMale: "Male",
    genderOther: "Other",
    selectPlaceholder: "Select…",
    ageLabel: "Age:",
    hobbiesLabel: "Hobbies:",
    hobbiesPlaceholder: "e.g. reading",
    instructions: `
      <h2>Welcome!</h2>
      <p>You are invited to participate in a study for a Bachelor's thesis at [Your University].</p>
      <h3>What will you do?</h3>
      <ul>
        <li>A simple reaction time test (press spacebar when you see "X").</li>
        <li>A visual search task (find and click the letter "T").</li>
      </ul>
      <h3>How long will it take?</h3>
      <p>Approximately 10–15 minutes.</p>
      <h3>What device should you use?</h3>
      <p>Please use a desktop or laptop computer. Mobile devices are not supported.</p>
      <h3>Is your data anonymous?</h3>
      <p>Yes. No personal information is collected. Only your reaction times and click accuracy are stored anonymously.</p>
      <h3>IP Address Policy:</h3>
      <p>(Optional – include only if you store IPs) To ensure participants only complete the experiment once, your IP address may be temporarily stored and deleted after data collection. It will not be connected to your reaction time or accuracy data.</p>
      <h3>Your rights:</h3>
      <p>Participation is voluntary. You can exit at any time by closing the window.</p>
      <p>For questions, contact: [Your email]</p>
    `,
    continue: "Continue",
    tooSoonTitle: "Too soon!",
    tooSoonBody: "Please wait for the green “X” before responding.",
    reactionProgress: "Reaction time test {done} / 5 completed.",
    reactionReady: "Press any key when you’re ready for the next one.",
    practiceTitle: "Practice Exercises (5)",
    practiceInfo:            "No data will be saved for these exercises.",
    practiceBeginPrompt:     "Press any key to start.",
    practiceCompleteMessage: "Practice complete! The real visual search test will start now.",
    practiceContinuePrompt:  "Press any key to continue.",
    practiceDesc: "No data will be saved for these exercises.",
    practiceDone: "Practice complete! The real visual search test will start now.",
    practiceContinue: "Press any key to continue.",
    exit: "Exit",
    titlePageTitle: "Experimental testing of a visual search digital environment",
    titlePageWelcome: "Welcome! You are invited to participate in the research for a bachelor’s thesis by a 4th-year student in the “Computer Science” program at the University of Latvia.",
    titlePageTasksHeading: "What tasks are planned?",
    titlePageTasksList: [
        "Reaction time test (press any key on the keyboard when you see the “X” symbol).",
        "Visual search tasks (find and click on the “T” symbol)."
      ],
    titlePageDurationHeading: "How long will it take?",
    titlePageDuration: "Approximately 10–20 minutes.",
    titlePageDeviceHeading: "Which devices are supported?",
    titlePageDevice: "Please use a desktop or laptop computer. Mobile devices are not supported.",
    titlePageAnonymityHeading: "Are the collected data anonymous?",
    titlePageAnonymity: "Yes. No personal data is recorded during the experiment. Only your survey responses and a summary of the tasks performed are saved anonymously.",
    titlePageIPHeading: "IP Address Policy:",
    titlePageIPDesc: "(Optional – include only if you store IP addresses) To ensure each participant completes the experiment only once, your IP address may be stored temporarily after data collection and then deleted. It will not be linked to your reaction time or accuracy data.",
    titlePageRightsHeading: "Participation is voluntary!",
    titlePageRights: "You may stop the experiment at any time by closing this window.",
    titlePageContact: "For any questions, contact: georgssprucs@gmail.com",
    feedbackPrompt:        "Please tell us how you found the experiment:",
    feedbackRatingLabel:   "Overall, how easy/difficult was it?",
    feedbackRating1:       "1 – Very difficult",
    feedbackRating2:       "2 – Difficult",
    feedbackRating3:       "3 – Okay",
    feedbackRating4:       "4 – Easy",
    feedbackRating5:       "5 – Very easy",
    feedbackCommentsLabel: "Any comments or suggestions?",
    submitFeedback:        "Submit Feedback",
    feedbackTitle:             "Your feedback",
    feedbackDifficultyLabel: "Rate the difficulty of the visual search tasks (1 = very easy, 5 = very difficult)",
    feedbackColorLabel: "Which colour combination did you find the easiest?",
    feedbackColorLabel2: "Which colour combination did you find the most difficult?",
    colourOptBlack: "All symbols in black",
    colourOptRedBlack: "Red target object T - between the other symbols in black",
    colourOptBlueRedBlack: "Blue target object T - between the other symbols in red and green",
    colourOptImpossible: "Each symbol in a different colour",
    feedbackCommentsLabel: "Additional comments:",
    submitFeedback: 'Submit feedback',
    agree:                     "I agree",
    computerTimePrompt: "How much time do you spend at a computer/laptop daily?",
    computerTimeOptions: [
      "Less than 1 hour",
      "1–3 hours",
      "4–6 hours",
      "7–9 hours",
      "10 or more hours"
    ],
    residencePrompt: "Which of the following best describes where you live?",
    residenceCity: "Large city (over 100 000 inhabitants)",
    residenceCity2: "Small city (under 100 000 inhabitants)",
    residenceOutside: "Rural / countryside",
        // Demographics prompts
        genderPrompt:            "Please select your gender:",
        female:                  "Female",
        male:                    "Male",
        other:                   "Other",
    
        agePrompt:               "Please enter your age:",
    
        hobbiesPrompt:           "Which of the following activities do you regularly engage in?",
        hobbiesPrompt2:           "Select 3 activities...",
        hobbiesOtherPlaceholder: "If Other, please specify…",
    
        // Generic
        continue:                "Continue",
        hobbyVideoGaming:        "Video gaming",
        hobbyProgramming:        "Programming / coding",
        hobbyReading:            "Reading (books, e-books)",
        hobbyPuzzles:            "Board games / puzzles",
        hobbyOutdoor:            "Outdoor sports (running, cycling)",
        hobbyIndoor:             "Indoor exercise (yoga, gym workouts)",
        hobbyCreative:           "Creative arts (drawing, music, photography)",
        hobbyWatching:           "Watching movies",
        hobbyOther:              "Other",
        hobbiesOtherPlaceholder: "Please specify…",
        practiceFeedbackCorrectTitle:    "✅ Correct!",
        practiceFeedbackIncorrectTitle:  "❌ Incorrect, please click the letter T.",
        practiceFeedbackContinue:        "Press any key to continue.",
        practiceFeedbackRetry:           "Press any key to retry.",
        reactionProgressText1: `Reaction test`,
reactionProgressText2: ` / 5 completed.`,
  reactionProgressPrompt: "Press any key when you are ready."
  },
  lv: {
    languagePrompt: "Izvēlieties valodu:",
    welcome: "Laipni lūdzam vizuālajā meklēšanas testā",
    begin: "Nospiediet jebkuru taustiņu, lai sāktu.",
    reactionInstr: "Jūs redzēsiet '+' un pēc tam simbolu 'X'. Nospiediet jebkuru klavietūras taustiņu, kad redzat 'X'.",
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
    thanks: "Paldies! Nospiediet 'Beigt', lai pabeigtu eksperimentu.",
    endMessage: "Liels paldies, ka piedalījāties! Jūs tagad varat aizvērt šo lapu.",
    noT: "Es nevaru atrast T",
    mobileTitle: "Lūdzu pārejiet uz datoru vai portatīvo datoru",
    mobileDesc: "Šis eksperiments vislabāk darbojas datorā ar tastatūru.",
    mobileContinue: "Turpināt",
    demoTitle: "Ievadiet savu informāciju:",
    genderLabel: "Dzimums:",
    genderFemale: "Sieviete",
    genderMale: "Vīrietis",
    genderOther: "Cits",
    selectPlaceholder: "Izvēlieties…",
    ageLabel: "Vecums:",
    hobbiesLabel: "Vaļasprieki:",
    hobbiesPlaceholder: "piem., lasīšana",
    instructions: `
      <h2>Laipni lūdzam!</h2>
      <p>Jūs esat uzaicināts piedalīties bakalaura darba pētījumā [Jūsu Universitāte].</p>
      <h3>Kādi uzdevumi ir paredzēti?</h3>
      <ul>
        <li>Vienkāršs reakcijas laika tests (nospiediet atstarpes taustiņu, kad redzat “X”).</li>
        <li>Vizuālās meklēšanas uzdevums (atrodiet un noklikšķiniet uz burtu “T”).</li>
      </ul>
      <h3>Cik ilgi tas prasīs?</h3>
      <p>Aptuveni 10–15 minūtes.</p>
      <h3>Kādu ierīci jums vajadzētu izmantot?</h3>
      <p>Lūdzu, izmantojiet galda vai portatīvo datoru. Mobilās ierīces nav atbalstītas.</p>
      <h3>Vai jūsu dati ir anonīmi?</h3>
      <p>Jā. Netiek vākti personiski dati. Tiek anonīmi saglabāta tikai jūsu reakcijas laiks un klikšķu precizitāte.</p>
      <h3>IP adreses politika:</h3>
      <p>(Nav obligāti – iekļaujiet tikai, ja saglabājat IP adreses) Lai nodrošinātu, ka dalībnieki izpilda eksperimentu tikai vienu reizi, jūsu IP adrese var tikt īslaicīgi saglabāta pēc datu vākšanas un izdzēsta. Tā netiks sasaistīta ar jūsu reakcijas laika vai precizitātes datiem.</p>
      <h3>Jūsu tiesības:</h3>
      <p>Dalība ir brīvprātīga. Jūs varat iziet jebkurā laikā, aizverot logu.</p>
      <p>Jautājumu gadījumā sazinieties: georgssprucs@gmail.com</p>
    `,
    continue: "Turpināt",
    tooSoonTitle: "Pārāk agri!",
    tooSoonBody: "Lūdzu, gaidiet zaļo “X” pirms atbildes.",
    reactionProgress: "Reakcijas laika tests {done} / 5 pabeigts.",
    reactionReady: "Nospiediet jebkuru taustiņu, kad esat gatavs nākamajam.",
    practiceTitle: "Treniņu mēģinājumi (3)",
    practiceDesc: "Šie netiks ierakstīti.",
    practiceDone: "Prakse pabeigta! Tagad sāksies īstais tests.",
    practiceContinue: "Nospiediet jebkuru taustiņu, lai turpinātu.",
    exit: "Beigt",
    titlePageTitle: "Vizuālās meklēšanas digitālas vides eksperimentāla testēšana",
    titlePageWelcome: "Laipni lūdzam! Jūs esat aicināts piedalīties Latvijas Universitātes Datorzinātnes studiju programmas 4. kursa studenta bakalaura darba pētījumā.",
    titlePageTasksHeading: "Kādi uzdevumi ir paredzēti?",
    titlePageTasksList: [
      "Reakcijas laika tests (nospiediet jebkuru klavietūras taustiņu, kad redzat simbolu “X”).",
      "Vizuālās meklēšanas uzdevumi (atrodiet un noklikšķiniet uz simbola “T”)."
    ],
    titlePageDurationHeading: "Cik daudz laika tas aizņems?",
    titlePageDuration: "Aptuveni 10–20 minūtes.",
    titlePageDeviceHeading: "Kādām ierīcēm ir paredzēti šie uzdevumi?",
    titlePageDevice: "Lūdzu, izmantojiet stacionāro datoru vai klēpjdatoru. Mobilās ierīces nav atbalstītas.",
    titlePageAnonymityHeading: "Vai iegūtie dati ir anonīmi?",
    titlePageAnonymity: "Jā. Eksperimenta laikā netiek saglabāti personas dati. Tiek anonīmi saglabātas tikai Jūsu atbildes uz aptaujas jautājumiem un izpildīto uzdevumu pārskats.",
    titlePageIPHeading: "IP adreses politika:",
    titlePageIPDesc: "(Nav obligāti – iekļaujiet tikai, ja saglabājat IP adreses) Lai nodrošinātu, ka dalībnieki izpilda eksperimentu tikai vienu reizi, jūsu IP adrese var tikt īslaicīgi saglabāta pēc datu vākšanas un izdzēsta. Tā netiks sasaistīta ar jūsu reakcijas laika vai precizitātes datiem.",
    titlePageRightsHeading: "Dalība ir brīvprātīga!",
    titlePageRights: "Jūs varat pārtraukt eksperimentu jebkurā laikā, aizverot logu.",
    titlePageContact: "Jautājumu gadījumā sazinieties: georgssprucs@gmail.com",
    feedbackPrompt:        "Lūdzu, pastāstiet, kā jums patika eksperimenta norise:",
    feedbackRating1:       "1 – Ļoti grūti",
    feedbackRating2:       "2 – Grūti",
    feedbackRating3:       "3 – Vidēji",
    feedbackRating4:       "4 – Viegli",
    feedbackRating5:       "5 – Ļoti viegli",
    feedbackTitle:             "Jūsu atsauksmes",
    feedbackDifficultyLabel:   "Novērtējiet vizuālās meklēšanas uzdevumu sarežģītību (1 = ļoti viegli, 5 = ļoti grūti)",
    feedbackColorLabel:        "Kura krāsu kombinācija jums šķita vieglākā?",
    feedbackColorLabel2:        "Kura krāsu kombinācija jums šķita sarežģītākā?",
    colorOptBlack:             "Visi simboli melnā krāsā",
    colorOptRedBlack:          "Sarkans mērķa objekts T – starp pārājiem simboliem melnā krāsā",
    colorOptBlueRedBlack:      "Zils mērķis objekts T – starp pārājiem simboliem sarkanā un zaļā krāsā",
    colorOptImpossible:        "Katrs simbols citā krāsā",
    feedbackCommentsLabel:     "Vieta papildus komentāriem:",
    submitFeedback:            "Iesniegt",
    agree:                     "Es piekrītu",
    computerTimePrompt: "Cik laika dienā jūs pavadāt pie datora/portatīvā datora?",
    computerTimeOptions: [
      "Mazāk par 1 stundu",
      "1–3 stundas",
      "4–6 stundas",
      "7–9 stundas",
      "Vairāk nekā 10 stundas"
    ],
    residencePrompt: "Kurš no šiem aprakstiem vislabāk raksturo jūsu dzīvesvietu?",
    residenceCity: "Liela pilsēta (vairāk nekā 100 000 iedzīvotāju)",
    residenceCity2: "Maza pilsēta (zem 100 000 iedzīvotāju)",
    residenceOutside: "Lauki / ārpus pilsētas",
    genderPrompt:            "Lūdzu, norādiet savu dzimumu:",
    female:                  "Sieviete",
    male:                    "Vīrietis",
    other:                   "Cits",

    agePrompt:               "Lūdzu, ievadiet savu vecumu:",

    hobbiesPrompt:           "Kuras no šīm aktivitātēm Jūs veicat regulāri?",
    hobbiesPrompt2:           "Izvēlieties 3 aktivitātes...",
    hobbiesOtherPlaceholder: "Ja “Cits”, lūdzu ievadiet…",

    hobbyVideoGaming:        "Videospēles",
    hobbyProgramming:        "Programmēšana",
    hobbyReading:            "Lasīšana (grāmatas, e-grāmatas)",
    hobbyPuzzles:            "Galda spēles / puzles",
    hobbyOutdoor:            "Āra sporta veidi (skriešana, riteņbraukšana)",
    hobbyIndoor:             "Iekštelpu nodarbības (joga, treniņš zālē)",
    hobbyCreative:           "Radošās mākslas (zīmēšana, mūzika, fotogrāfija)",
    hobbyWatching:           "Filmu skatīšanās",
    hobbyOther:              "Cits",
    hobbiesOtherPlaceholder: "Lūdzu norādiet…",
    continue:                "Turpināt",
    practiceTitle:           "Iesildīšanās mēģinājumi (5)",
    practiceInfo:            "Dati par šiem uzdevumiem netiks saglabāti.",
    practiceBeginPrompt:     "Nospiediet jebkuru taustiņu, lai sāktu.",
    practiceCompleteMessage: "Iesildīšanās pabeigta! Tagad sākas īstais vizuālās meklēšanas tests.",
    practiceContinuePrompt:  "Nospiediet jebkuru taustiņu, lai turpinātu.",
    practiceFeedbackCorrectTitle:    "✅ Pareizi!",
    practiceFeedbackIncorrectTitle:  "❌ Nepareizi, lūdzu noklikšķiniet uz simbola T.",
    practiceFeedbackContinue:        "Nospiediet jebkuru taustiņu, lai turpinātu.",
    practiceFeedbackRetry:           "Nospiediet jebkuru taustiņu, lai mēģinātu vēlreiz.",
    reactionProgressText1: `Reakcijas tests`,
reactionProgressText2: ` / 5 pabeigts.`,
  reactionProgressPrompt: "Nospiediet jebkuru taustiņu, kad esat gatavs."
  }
};

// ─── Initialize jsPsych ─────────────────────────
const jsPsych = initJsPsych({
  data: { sessionID },
  //show_progress_bar: true,
  //auto_update_progress_bar: true,
  on_start: () => {
    document.getElementById('bgm')?.play().catch(() => {});
    feather.replace();
  },
  plugins: { htmlKeyboardResponse, surveyHtmlForm, htmlButtonResponse, callFunction }
});

const languageScreen = {
  type: surveyHtmlForm,
  data: { task: 'language' },
  preamble: `<h3>${i18n.en.languagePrompt} / ${i18n.lv.languagePrompt}</h3>`,
  html: `
    <p><label><input type="radio" name="lang" value="en" checked> English</label></p>
    <p><label><input type="radio" name="lang" value="lv"> Latviešu</label></p>
  `,
  // force the button to read both English and Latvian
  button_label: `${i18n.en.continue} / ${i18n.lv.continue}`,
  on_finish: data => {
    lang = data.response.lang;
    jsPsych.data.addProperties({ lang });
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



const welcome = {
  type: htmlKeyboardResponse,
  stimulus: () => `<h2>${i18n[lang].welcome}</h2><p>${i18n[lang].begin}</p>`,
  choices: "ALL_KEYS"
};

const introduction = {
  type: htmlButtonResponse,
  stimulus: () => i18n[lang].instructions,
  choices: [ i18n[lang].continue ],
  data: { trial_type: 'instructions' },
  choices: "ALL_KEYS"
};


// ─── 1) Gender screen ─────────────────────────
const genderForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-gender' },
  preamble: () => `<h3>${i18n[lang].genderPrompt}</h3>`,
 // same here – return your html dynamically
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

// ─── 2) Age screen ────────────────────────────
const ageForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-age' },
  preamble: () =>  `<h3>${i18n[lang].agePrompt}</h3>`,
  html: () => `
    <p><input name="age" type="number" min="18" max="99" required></p>
  `,
  button_label: () => i18n[lang].continue
};

// ─── 3) Hobbies screen ────────────────────────
const hobbiesForm = {
  type: surveyHtmlForm,
  data: { task: 'demographics-hobbies' },
  preamble: () => `<h3>${i18n[lang].hobbiesPrompt}</h3> <p>${i18n[lang].hobbiesPrompt2}</p>`,
  html: () => `
    <p>
      <label><input type="checkbox" name="hobbies" value="videoGaming"> ${i18n[lang].hobbyVideoGaming}</label><br>
      <label><input type="checkbox" name="hobbies" value="programming"> ${i18n[lang].hobbyProgramming}</label><br>
      <label><input type="checkbox" name="hobbies" value="reading"> ${i18n[lang].hobbyReading}</label><br>
      <label><input type="checkbox" name="hobbies" value="puzzles"> ${i18n[lang].hobbyPuzzles}</label><br>
      <label><input type="checkbox" name="hobbies" value="outdoorSports"> ${i18n[lang].hobbyOutdoor}</label><br>
      <label><input type="checkbox" name="hobbies" value="indoorExercise"> ${i18n[lang].hobbyIndoor}</label><br>
      <label><input type="checkbox" name="hobbies" value="creativeArts"> ${i18n[lang].hobbyCreative}</label><br>
      <label><input type="checkbox" name="hobbies" value="watching"> ${i18n[lang].hobbyWatching}</label><br>
      <label><input id="hobby-other-cb" type="checkbox" name="hobbies" value="other" maxlength="50"> ${i18n[lang].hobbyOther}</label>
      <input id="hobby-other-txt" name="hobbiesOther"
             type="text"
             placeholder="${i18n[lang].hobbiesOtherPlaceholder}"
             style="display:none; margin-left:1em; width:80%;">
    </p>
  `,
  on_load: () => {
    const boxes   = document.querySelectorAll('input[type="checkbox"][name="hobbies"]');
    const otherCb = document.getElementById('hobby-other-cb');
    const otherTxt= document.getElementById('hobby-other-txt');
    boxes.forEach(cb => {
      cb.addEventListener('change', ()=>{
        const checked = Array.from(boxes).filter(x=>x.checked);
        if (checked.length>3) cb.checked = false;
        boxes.forEach(x=>{
          x.disabled = !x.checked && checked.length>=3;
        });
        otherTxt.style.display = otherCb.checked ? 'inline-block' : 'none';
        if (!otherCb.checked) otherTxt.value = '';
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
          <option value="city">${i18n[lang].residenceCity2}</option>
          <option value="outside">${i18n[lang].residenceOutside}</option>
        </select>
      </label>
    </p>
  `,
  button_label: () => i18n[lang].continue
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
  trial_duration: 1500
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
    <p>Too soon! Please wait for the “X” before responding.</p>
    <p>Press any key to retry this reaction.</p>`,
  choices: 'ALL_KEYS'
};

// ──────────────────────────────────────────────
// 4) The actual reaction trial
// ──────────────────────────────────────────────
const reactionTrial = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:48px; color:black;">X</div>',
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
    return `<p>${i18n[lang].reactionProgressText1} ${done} ${i18n[lang].reactionProgressText2}</p>
            <p>${i18n[lang].reactionProgressPrompt}</p>`;
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
    ...Array.from({length:5}, () => [ oneReaction ]).flat()
  ]
};


const showBaseline = {
    type: htmlKeyboardResponse,
    stimulus: () => {
      //console.log('⚙️ All trials so far:', jsPsych.data.get().values());
      //console.log('⚙️ reactionTrials:', jsPsych.data.get().filter({task:'reaction'}).values());
      //console.log('⚙️ searchingg:', jsPsych.data.get().filter({ task: 'search' }).values());
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
  [8].forEach(size => {
    allSearchConds.push({ colors, size, diff });
  });
});

// 2) Sample 3 of them without replacement
// change amount of practice runs
const practiceConds = jsPsych.randomization.sampleWithoutReplacement(allSearchConds, 5);

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
    ...[3,2,1].map(x => ({
      type: htmlKeyboardResponse,
      stimulus: `<p>${x}</p>`,
      choices: [],
      trial_duration: 1500
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

// 4) Build the full practice timeline (3 trials)
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
i18n.en.noT = "Can't find T";
i18n.lv.noT = "Nevar atrast T";

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
  trial_duration: () => 500 + Math.random() * 500
};

// ──────────────────────────────────────────────
// 4) Build one 8×8 search “block” with extra button
// ──────────────────────────────────────────────
function makeSearchBlock(cond) {
  const size      = 8;
  const total     = size * size;    // 64
  const noTIndex  = total;          // sentinel for “I can’t find T”
  const absentProb  = 0.2;             // 20% of trials have no T
  const targetPresent = Math.random() > absentProb;
    // if present, pick a random cell; if absent, null
    const targetIdx   = targetPresent
    ? Math.floor(Math.random() * total)
    : null;

  // (Optional) unique‐hue logic for “impossible” trials
  let cellColors = null;
  if (cond.label === 'impossible') {
    cellColors = jsPsych.randomization
      .sampleWithoutReplacement(impossiblePalette, total);
  }

  // 1) Build the 64 grid‐cell HTML strings
  const gridChoices = Array.from({ length: total }, (_, i) => {
    const isT    = targetPresent && i === targetIdx;
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
        target_present: targetPresent,
        target_index:   targetIdx
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
              correct:        !trial.data.target_present
            });
          };
        }, 0);
      },
      on_finish: data => {
        // if they clicked a grid cell (response < 64)
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
          // plugin recorded data.rt automatically
          data.correct         = (
            targetPresent && clicked === targetIdx
          );
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
  for (let i = 0; i < 6; i++) {
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

const goodbye    = { type: htmlButtonResponse, stimulus: () =>`<h3>${i18n[lang].thanks}</h3>`, choices: () =>['${i18n[lang].exit}'] };
const finalThanks = { type: htmlKeyboardResponse, stimulus:()=>`<p>${i18n[lang].endMessage}</p>`, choices:'NO_KEYS' };

// ─── Feedback form ────────────────────────────────────
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
          <option value="blackOnly">${i18n[lang].colorOptBlack}</option>
          <option value="redBlack">${i18n[lang].colorOptRedBlack}</option>
          <option value="blueRedBlack">${i18n[lang].colorOptBlueRedBlack}</option>
          <option value="impossible">${i18n[lang].colorOptImpossible}</option>
          <option value="noT">${i18n[lang].noT}</option>
        </select>
      </label>
    </p>

    <!-- 2.2) Hardest color combination -->
    <p>
      <label>${i18n[lang].feedbackColorLabel2}
        <select name="colorHardest" required>
          <option value="" disabled selected>${i18n[lang].selectPlaceholder}</option>
          <option value="blackOnly">${i18n[lang].colorOptBlack}</option>
          <option value="redBlack">${i18n[lang].colorOptRedBlack}</option>
          <option value="blueRedBlack">${i18n[lang].colorOptBlueRedBlack}</option>
          <option value="impossible">${i18n[lang].colorOptImpossible}</option>
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
        //agg[key].corrects.push(tr.correct ? 1 : 0);
          // new: count as correct if either
          //   a) target was present and user clicked it, OR
          //   b) target was absent and user clicked “No T”
        const wasCorrect = tr.target_present
          ? tr.correct
          : tr.noT_selected;
        agg[key].corrects.push(wasCorrect ? 1 : 0);
      });
      const summaries = Object.values(agg).map(g => ({
        difficulty: g.difficulty,
        set_size:   g.set_size,
        avg_rt:     +(g.rts.reduce((a,b)=>a+b,0)/g.rts.length).toFixed(2),
        accuracy:   +((g.corrects.reduce((a,b)=>a+b,0)/g.corrects.length)*100).toFixed(1)
      }));;


      // ─── Gather demographics from each mini‐form ────────────────────────────
      // 1) Gender
      const genderRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-gender' })
      .values()[0] || { response: {} };

      // 2) Age
      const ageRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-age' })
      .values()[0] || { response: {} };

      // 3) Hobbies (checkboxes + optional Other text)
      const hobbyRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-hobbies' })
      .values()[0] || { response: {} };

      // 4) Daily computer time
      const compRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-computerTime' })
      .values()[0] || { response: {} };

      // 5) Residence
      const resRec = jsPsych.data
      .get()
      .filter({ task: 'demographics-residence' })
      .values()[0] || { response: {} };

      // ─── Compose single demographics object ────────────────────────────────
      const demographics = {
      gender:            genderRec.response.gender || null,
      age:               parseInt(ageRec.response.age, 10) || null,
      hobbies:           Array.isArray(hobbyRec.response.hobbies)
                          ? hobbyRec.response.hobbies
                          : [hobbyRec.response.hobbies].filter(Boolean),
      hobbiesOther:      hobbyRec.response.hobbiesOther || "",
      dailyComputerTime: compRec.response.computerTime || null,
      residence:         resRec.response.residence || null
      };


      // 4) feedback
      // 4) grab the feedback response
      const fbRec = jsPsych.data.get()
        .filter({ task: 'feedback' })
        .values()[0] || { response: {} };

        const feedback = {
          difficulty_rating: parseInt(fbRec.response.difficulty, 10),  // 1–5 numeric
          easiest_combo: fbRec.response.colorEasiest,
          hardest_combo: fbRec.response.colorHardest,
          comments:      fbRec.response.comments || ""
        };


      const payload = {
        sessionID,
        lang,
        demographics,
        reaction_trials: reactionTrials,
        search_trials:   searchTrials,
        summaries,
        feedback
      };
    // full payload
    // POST to backend
    //console.log('📤 Posting payload:', payload);
    postData(API, payload);
  }
};

// ─── Run the timeline ───────────────────────────
jsPsych.run([
  languageScreen,
  //welcome,
  titlePage,
  genderForm,
  ageForm,
  hobbiesForm,
  computerTimeForm,   // ← new
  residenceForm,      // ← new
  reactionBlock,
  //showBaseline,
  ...practiceTimeline,
  ...searchSegments,
  //showSearchSummary,
  feedbackForm,
  saveData,    // ← data‐posting here
  goodbye,
  finalThanks
]);