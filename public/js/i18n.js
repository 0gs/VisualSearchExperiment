export const i18n = {
  en: {
        languagePrompt: "Select your preferred language",
        welcome: "Welcome to the Visual Search Experiment",
        begin: "Press any key to begin.",
        reactionInstr: "You'll see a '+' then a green 'X'. Press ANY KEY on the keyboard when you see 'X'.",
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
            <li>A simple reaction time test (press ANY KEY when you see "X").</li>
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
        practiceTitle: "Practice Exercises (3)",
        practiceInfo:            "No data will be saved for these exercises.",
        practiceBeginPrompt:     "Press any key to start.",
        practiceCompleteMessage: "<strong>Practice complete! The real visual search test will start now.</strong>",
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
        titlePageDuration: "Approximately 10–15 minutes.",
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
        hobbiesPrompt2:           "Select 1 activity",
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
        practiceFeedbackRetry:           "Press any key to continue.",
        reactionProgressText1: `Reaction test`,
        reactionProgressText2: ` / 5 completed.`,
        reactionProgressPrompt: "Press any key when you are ready.",
        feedbackPrompt: "Please tell me how you liked the experiment:",
        feedbackRating1: "1 – Very difficult",
        feedbackRating2: "2 – Difficult",
        feedbackRating3: "3 – Average",
        feedbackRating4: "4 – Easy",
        feedbackRating5: "5 – Very easy",
        feedbackTitle: "Your feedback",
        feedbackDifficultyLabel: "Rate the difficulty of the visual search tasks (1 = very easy, 5 = very difficult)",
        feedbackColorLabel: "Which color combination did you find easiest?",
        feedbackColorLabel2: "Which color combination did you find most difficult?",
        colorOptBlack: "All symbols in black",
        colorOptRedBlack: "Red target object T – among other symbols in black",
        colorOptBlueRedBlack: "Blue target object T – among other symbols in red and green",
        colorOptImpossible: "Each symbol in a different color",
        feedbackCommentsLabel: "Space for additional comments:",
        submitFeedback: "Submit",
        handednessPrompt: "Which hand do you predominantly use: right, left, or both?",
        rightHanded:       "Right hand (right-handed)",
        leftHanded:        "Left hand (left-handed)",
        bothHanded:        "Both hands (ambidextrous)",
        colorVisionPrompt: "Do you have a color-vision disorder?",
        colorVisionYes:    "Yes",
        colorVisionNo:     "No",
        colorVisionUnsure: "I’m not sure",
        colorVisionHelp: `If you're not sure what color-vision disorders are, you can <a href="https://www.colorlitelens.com/ishihara-test.html" target="_blank">take this Ishihara test</a>.`
  },
  lv: {
        languagePrompt: "Izvēlieties valodu:",
        welcome: "Laipni lūdzam vizuālajā meklēšanas testā",
        begin: "Nospiediet jebkuru taustiņu, lai sāktu.",
        reactionInstr: "Jūs redzēsiet '+' un pēc tam simbolu 'X'. Nospiediet jebkuru tastatūras taustiņu, kad redzat 'X'.",
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
        practiceDesc: "Šie netiks ierakstīti.",
        practiceDone: "Prakse pabeigta! Tagad sāksies īstais tests.",
        practiceContinue: "Nospiediet jebkuru taustiņu, lai turpinātu.",
        exit: "Beigt",
        titlePageTitle: "Vizuālās meklēšanas digitālas vides eksperimentāla testēšana",
        titlePageWelcome: "Laipni lūdzam! Jūs esat aicināts piedalīties Latvijas Universitātes Datorzinātnes studiju programmas 4. kursa studenta bakalaura darba pētījumā.",
        titlePageTasksHeading: "Kādi uzdevumi ir paredzēti?",
        titlePageTasksList: [
        "Reakcijas laika tests (nospiediet jebkuru tastatūras taustiņu, kad redzat simbolu “X”).",
        "Vizuālās meklēšanas uzdevumi (atrodiet un noklikšķiniet uz simbola “T”)."
        ],
        titlePageDurationHeading: "Cik daudz laika tas aizņems?",
        titlePageDuration: "Aptuveni 10–15 minūtes.",
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
        hobbiesPrompt2:           "Izvēlieties 1 aktivitāti",
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
        practiceTitle:           "Iesildīšanās mēģinājumi (3)",
        practiceInfo:            "Dati par šiem uzdevumiem netiks saglabāti.",
        practiceBeginPrompt:     "Nospiediet jebkuru taustiņu, lai sāktu.",
        practiceCompleteMessage: "<strong>Iesildīšanās pabeigta! Tagad sākas īstais vizuālās meklēšanas tests.</strong> ",
        practiceContinuePrompt:  "Nospiediet jebkuru taustiņu, lai turpinātu.",
        practiceFeedbackCorrectTitle:    "✅ Pareizi!",
        practiceFeedbackIncorrectTitle:  "❌ Nepareizi, lūdzu noklikšķiniet uz simbola T.",
        practiceFeedbackContinue:        "Nospiediet jebkuru taustiņu, lai turpinātu.",
        practiceFeedbackRetry:           "Nospiediet jebkuru taustiņu, lai turpinātu.",
        reactionProgressText1: `Reakcijas tests`,
        reactionProgressText2: ` / 5 pabeigts.`,
        reactionProgressPrompt: "Nospiediet jebkuru taustiņu, kad esat gatavs.",
        handednessPrompt: "Kuru roku pārsvarā izmantojat: labo, kreiso vai abas?",
        rightHanded:       "Labā roka (labrocis)",
        leftHanded:        "Kreisā roka (kreilis)",
        bothHanded:        "Abas rokas (abrocis)",
        colorVisionPrompt: "Vai Jums ir krāsu redzes traucējumi?",
        colorVisionYes:    "Jā",
        colorVisionNo:     "Nē",
        colorVisionUnsure: "Nezinu",
        colorVisionHelp: `Ja neesat pārliecināts, kas ir krāsu redzes traucējumi, <a href="https://www.colorlitelens.com/ishihara-test.html" target="_blank">veikt šo Ishihara testu</a>.`
    }
};
