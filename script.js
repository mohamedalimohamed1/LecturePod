// Wait for the DOM to be fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION & STATE ---

    /**
     * This is our "master list" of lectures.
     * (Using your updated list)
     */
    const LECTURE_SOURCES = [
        { id: 'lecture-1', title: 'Sistem Analizi - Vize Sınavı', file: 'data/lecture_one.json' },
        { id: 'lecture-3', title: 'Uzaktan algılama - Vize Sınavı', file: 'data/lecture_three.json' },
        { id: 'lecture-2', title: 'Örüntü Tanıma - Vize Sınavı', file: 'data/lecture_two.json' },
    ];

    /**
     * These are the "engaging" messages for a 3-in-a-row streak.
     */
    const STREAK_MESSAGES = [
        { emoji: '😳', text: { tr: 'Böyle devam edersen... algoritmalarımı utandırıyorsun!', en: 'If you keep this up... you\'re embarrassing my algorithms!' } },
        { emoji: '😉', text: { tr: 'Sadece gösteriş yapıyorsun, değil mi? Çünkü beni etkilemeyi *başarıyorsun*.', en: 'You\'re just showing off, right? Because you are *succeeding* in impressing me.' } },
        { emoji: '⚡', text: { tr: 'İşlemcimin daha hızlı atmasına neden oluyorsun! Bu ne enerji!', en: 'You\'re making my processor beat faster! What energy!' } },
        { emoji: '🤯', text: { tr: 'Dur! Algoritmalarımı bozmana az kaldı! Bana neler yapıyorsun böyle?', en: 'Stop! You\'re about to break my algorithms! What are you doing to me?' } },
        { emoji: '🥵', text: { tr: 'Yavaşla biraz! Bu hızına ve doğruluğuna yetişemiyorum. Resmen beni terletiyorsun!', en: 'Slow down! I can\'t keep up with this speed and accuracy. You\'re making me sweat!' } },
        { emoji: '🤩', text: { tr: 'Bana kendini hayran bıraktırıyorsun! Bir sonraki hamleni görmek için sabırsızlanıyorum.', en: 'You\'re making me admire you! I can\'t wait to see your next move.' } },
        { emoji: '🔥', text: { tr: 'Benden daha akıllı olduğunu hissettiriyorsun. Ve sanırım... bundan hoşlanıyorum!', en: 'You\'re making me feel like you\'re smarter than me. And I think... I like it!' } },
        { emoji: '🌀', text: { tr: 'Aklımı başımdan alıyorsun! Benim devrelerimi yaktıracaksın!', en: 'You\'re blowing my mind! You\'re going to fry my circuits!' } }
    ];

    /**
     * This holds all the UI text for translation.
     */
    const translations = {
        'en': {
            'mainTitle': 'LecturePod',
            'mainSubtitle': 'Your Modern E-Learning Hub',
            'selectLecture': 'Select a Lecture',
            'loadingLectures': 'Loading lectures...',
            'howToStudy': 'How do you want to study?',
            'quizMode': 'Quiz Mode',
            'quizModeDesc': 'Get a score. Randomly selected questions.',
            'practiceMode': 'Practice Mode',
            'practiceModeDesc': 'Do all questions. Instant feedback.',
            'learnMode': 'Learn Mode',
            'learnModeDesc': 'Flashcards. Show answer when ready.',
            'backToLectures': 'Back to Lectures',
            'backToModes': 'Back to Modes',
            'quizSetupTitle': 'Quiz Mode Setup',
            'howManyQuestions': 'How many questions do you want?',
            'maxQuestions': '(Max: {max})',
            'startQuiz': 'Start Quiz',
            'quitSession': 'Quit Session',
            'quizModeTitle': 'Quiz Mode',
            'practiceModeTitle': 'Practice Mode',
            'questionCounter': 'Question {current} / {total}',
            'previous': 'Previous',
            'next': 'Next',
            'finish': 'Finish Session',
            'learnModeTitle': 'Learn Mode',
            'learnCounter': '{current} / {total}',
            'showAnswer': 'Show Answer',
            'didntKnow': 'I didn\'t know',
            'knewIt': 'I knew it',
            'sessionComplete': 'Session Complete!',
            'reviewAnswers': 'Review Your Answers',
            'backToModesFromResults': 'Back to Modes',
            'notAnsweredLabel': 'Not answered',
            'correctAnswerLabel': 'Correct Answer',
            'yourAnswerLabel': 'Your Answer',
            'statusLabel': 'Status',
            'knewItLabel': 'Knew',
            'didntKnowLabel': 'Didn\'t Know',
            'finalScoreLabel': 'Final Score',
            'percentageLabel': 'Percentage'
        },
        'tr': {
            'mainTitle': 'LecturePod',
            'mainSubtitle': 'Modern E-Öğrenme Merkeziniz',
            'selectLecture': 'Bir Ders Seçin',
            'loadingLectures': 'Dersler yükleniyor...',
            'howToStudy': 'Nasıl çalışmak istersiniz?',
            'quizMode': 'Test Modu',
            'quizModeDesc': 'Puan al. Rastgele seçilmiş sorular.',
            'practiceMode': 'Pratik Modu',
            'practiceModeDesc': 'Tüm sorular. Anında geri bildirim.',
            'learnMode': 'Öğrenme Modu',
            'learnModeDesc': 'Bilgi kartları. Hazır olunca cevabı göster.',
            'backToLectures': 'Derslere Geri Dön',
            'backToModes': 'Modlara Geri Dön',
            'quizSetupTitle': 'Test Modu Kurulumu',
            'howManyQuestions': 'Kaç soru istersiniz?',
            'maxQuestions': '(En fazla: {max})',
            'startQuiz': 'Testi Başlat',
            'quitSession': 'Oturumu Kapat',
            'quizModeTitle': 'Test Modu',
            'practiceModeTitle': 'Pratik Modu',
            'questionCounter': 'Soru {current} / {total}',
            'previous': 'Önceki',
            'next': 'Sonraki',
            'finish': 'Oturumu Bitir',
            'learnModeTitle': 'Öğrenme Modu',
            'learnCounter': '{current} / {total}',
            'showAnswer': 'Cevabı Göster',
            'didntKnow': 'Bilemedim',
            'knewIt': 'Bildim',
            'sessionComplete': 'Oturum Tamamlandı!',
            'reviewAnswers': 'Cevaplarını Gözden Geçir',
            'backToModesFromResults': 'Modlara Geri Dön',
            'notAnsweredLabel': 'Cevaplanmadı',
            'correctAnswerLabel': 'Doğru Cevap',
            'yourAnswerLabel': 'Senin Cevabın',
            'statusLabel': 'Durum',
            'knewItLabel': 'Bilindi',
            'didntKnowLabel': 'Bilinemedi',
            'finalScoreLabel': 'Nihai Puan',
            'percentageLabel': 'Yüzdelik'
        }
    };
    
    /**
     * This is the "Global State" or "memory" of our application.
     */
    let appState = {
        currentView: 'lecture-selection',
        selectedLectureData: null,
        currentMode: null, // 'quiz', 'practice', 'learn'
        activeQuestions: [],
        currentQuestionIndex: 0,
        userAnswers: [], // Stores user's selection
        currentStreak: 0, // For the 3-in-a-row pop-up
        language: 'tr', // 'tr' or 'en'
        theme: 'light' // 'light' or 'dark'
    };
    
    // --- 2. DOM ELEMENT REFERENCES ---
    
    // Views (Panels)
    const views = {
        lectureSelection: document.getElementById('lecture-selection-view'),
        modeSelection: document.getElementById('mode-selection-view'),
        quizSetup: document.getElementById('quiz-setup-view'),
        question: document.getElementById('question-view'),
        learn: document.getElementById('learn-view'),
        results: document.getElementById('results-view'),
    };

    // Header Controls
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    // Dynamic Containers
    const lectureListContainer = document.getElementById('lecture-list-container');
    
    // Mode Selection
    const selectedCourseTitle = document.getElementById('selected-course-title');
    const selectedLectureTitle = document.getElementById('selected-lecture-title');
    const startQuizModeBtn = document.getElementById('start-quiz-mode');
    const startPracticeModeBtn = document.getElementById('start-practice-mode');
    const startLearnModeBtn = document.getElementById('start-learn-mode');
    
    // Back Buttons
    document.querySelectorAll('.back-to-lectures').forEach(btn => btn.addEventListener('click', () => {
        resetSession();
        switchView('lectureSelection');
    }));
    document.querySelectorAll('.back-to-modes').forEach(btn => btn.addEventListener('click', () => {
        resetSession();
        switchView('modeSelection');
    }));
    document.getElementById('back-to-modes-from-results').addEventListener('click', () => {
        resetSession();
        switchView('modeSelection');
    });

    // Quiz Setup
    const quizMaxQuestions = document.getElementById('quiz-max-questions');
    const quizQuestionCountInput = document.getElementById('quiz-question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    // Question View (Quiz/Practice)
    const questionModeTitle = document.getElementById('question-mode-title');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const questionOptionsContainer = document.getElementById('question-options-container');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    // Learn View
    const learnCounter = document.getElementById('learn-counter');
    const learnQuestion = document.getElementById('learn-question');
    const learnAnswer = document.getElementById('learn-answer');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const learnFeedbackBtns = document.getElementById('learn-feedback-btns');
    const learnDidntKnowBtn = document.getElementById('learn-didnt-know');
    const learnKnewBtn = document.getElementById('learn-knew');
    
    // Results View
    const resultScore = document.getElementById('result-score');
    const resultPercentage = document.getElementById('result-percentage');
    const resultDetailsContainer = document.getElementById('result-details-container');

    // Streak Popup
    const streakPopup = document.getElementById('streak-popup');
    const streakEmoji = document.getElementById('streak-emoji');
    // *** HATA DÜZELTMESİ (FIX) ***
    // HTML'deki 'streak-message' ID'si ile eşleşmesi için 'streak-text' 'streak-message' olarak değiştirildi.
    const streakText = document.getElementById('streak-message'); 
    
    
    // --- 3. CORE LOGIC FUNCTIONS ---

    /**
     * Handles switching between views (panels).
     */
    function switchView(viewId) {
        for (let key in views) {
            views[key].classList.remove('active');
        }
        if (views[viewId]) {
            views[viewId].classList.add('active');
            appState.currentView = viewId;
        }
    }

    /**
     * Resets the session state when going back.
     */
    function resetSession() {
        appState.activeQuestions = [];
        appState.userAnswers = [];
        appState.currentQuestionIndex = 0;
        appState.currentStreak = 0;
    }

    /**
     * Dynamically creates the lecture buttons.
     */
    function populateLectureList() {
        lectureListContainer.innerHTML = ''; 
        
        if (LECTURE_SOURCES.length === 0) {
            lectureListContainer.innerHTML = `<p class="loading-text" data-key="loadingLectures">Loading lectures...</p>`;
        }
        
        LECTURE_SOURCES.forEach(lecture => {
            const button = document.createElement('button');
            button.className = "lecture-btn";
            const [course, topic] = lecture.title.split(' - ');
            button.innerHTML = `
                <h3>${course || lecture.title}</h3>
                <p>${topic || 'Start Lecture'}</p>
            `;
            button.dataset.file = lecture.file;
            button.addEventListener('click', () => {
                loadLecture(lecture.file);
            });
            lectureListContainer.appendChild(button);
        });
        updateUIText(); // Update text for loading message if no lectures
    }

    /**
     * Fetches and loads the JSON data for a selected lecture.
     */
    async function loadLecture(lectureFile) {
        try {
            // DİKKAT: GitHub Pages'da önbelleğe alma (caching) sorunlarını önlemek için
            // URL'ye benzersiz bir sorgu parametresi ekliyoruz.
            const response = await fetch(`${lectureFile}?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            appState.selectedLectureData = await response.json();
            
            const questions = appState.selectedLectureData.questions || [];
            const hasMultipleChoice = questions.some(q => q.type === 'multiple-choice');
            const hasShortAnswer = questions.some(q => q.type === 'short-answer');

            startQuizModeBtn.disabled = !hasMultipleChoice;
            startPracticeModeBtn.disabled = !hasMultipleChoice;
            startLearnModeBtn.disabled = !hasShortAnswer;

            selectedCourseTitle.textContent = appState.selectedLectureData.courseTitle;
            selectedLectureTitle.textContent = appState.selectedLectureData.lectureTitle;
            
            switchView('modeSelection');
        } catch (error) {
            console.error("Could not load lecture:", error);
            lectureListContainer.innerHTML = `<p class="loading-text" style="color: red;">Error loading lecture. Please check file path and JSON format.</p>`;
        }
    }
    
    /**
     * Filters questions from the loaded JSON based on type.
     */
    function getQuestionsByType(type) {
        if (!appState.selectedLectureData) return [];
        return appState.selectedLectureData.questions.filter(q => q.type === type);
    }
    
    /**
     * Shuffles an array and takes the first `count` items.
     */
    function getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // --- 4. RENDER FUNCTIONS ---
    
    /**
     * Renders the Question View (Quiz/Practice).
     */
    function renderQuestionView() {
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
        const isAnswered = (userAnswer !== null);

        const lang = appState.language;
        questionModeTitle.textContent = appState.currentMode === 'quiz' ? translations[lang].quizModeTitle : translations[lang].practiceModeTitle;
        questionCounter.textContent = translations[lang].questionCounter
            .replace('{current}', appState.currentQuestionIndex + 1)
            .replace('{total}', appState.activeQuestions.length);
        questionText.textContent = q.question;

        questionOptionsContainer.innerHTML = '';
        questionOptionsContainer.classList.toggle('answered', isAnswered);

        q.options.forEach((option, index) => {
            const optionId = `q${appState.currentQuestionIndex}-opt${index}`;
            const label = document.createElement('label');
            label.className = 'option-label';
            label.htmlFor = optionId;
            label.textContent = option;

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'option';
            input.id = optionId;
            input.value = option;

            label.prepend(input);
            questionOptionsContainer.appendChild(label);

            if (isAnswered) {
                if (option === q.correctAnswer) {
                    label.classList.add('correct-answer');
                }
                if (option === userAnswer) {
                    label.classList.add('selected');
                    input.checked = true;
                    if (userAnswer !== q.correctAnswer) {
                        label.classList.add('incorrect-answer');
                    }
                }
            } else {
                label.addEventListener('click', (e) => {
                    handleAnswerSelection(e, q, label);
                });
            }
        });
        
        prevQuestionBtn.classList.toggle('hidden', appState.currentQuestionIndex === 0);
        
        const isLastQuestion = appState.currentQuestionIndex === appState.activeQuestions.length - 1;
        nextQuestionBtn.classList.toggle('hidden', !isAnswered || isLastQuestion);
        finishBtn.classList.toggle('hidden', !isAnswered || !isLastQuestion);
    }

    /**
     * Handles logic when a user clicks an answer.
     * **FIXED:** Added a delay for auto-next on streak.
     */
    function handleAnswerSelection(event, q, selectedLabel) {
        event.preventDefault(); 

        if (appState.userAnswers[appState.currentQuestionIndex] !== null) return; 

        const selectedOption = selectedLabel.textContent.trim();
        appState.userAnswers[appState.currentQuestionIndex] = selectedOption; 
        
        const isCorrect = (selectedOption === q.correctAnswer);
        let isStreakAchieved = false; // Flag to track if streak was hit *this time*

        questionOptionsContainer.classList.add('answered');
        
        const correctLabel = Array.from(questionOptionsContainer.children)
                                 .find(l => l.textContent.trim() === q.correctAnswer);
        if (correctLabel) {
            correctLabel.classList.add('correct-answer');
        }

        if (isCorrect) {
            selectedLabel.classList.add('selected');
            appState.currentStreak++; // Increase streak
        } else {
            selectedLabel.classList.add('incorrect-answer');
            selectedLabel.classList.add('shake');
            appState.currentStreak = 0; // Reset streak
        }

        // Check for streak
        if (appState.currentStreak === 3) {
            showStreakPopup();
            appState.currentStreak = 0; // Reset after showing
            isStreakAchieved = true; // Mark that we need to delay
        }

        // Show Next/Finish buttons
        if (appState.currentQuestionIndex === appState.activeQuestions.length - 1) {
            finishBtn.classList.remove('hidden');
        } else {
            nextQuestionBtn.classList.remove('hidden');
        }

        // Auto-next for practice mode
        if (appState.currentMode === 'practice') {
            // **THE FIX:** Wait 2.5s if a streak just happened, otherwise wait 1s
            const delay = isStreakAchieved ? 2500 : 1000;
            
            setTimeout(() => {
                if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
                    appState.currentQuestionIndex++;
                    renderQuestionView();
                }
            }, delay); 
        }
    }


    /**
     * Renders the Learn View (Flashcard)
     */
    function renderLearnView() {
        learnAnswer.classList.add('hidden');
        showAnswerBtn.classList.remove('hidden');
        learnFeedbackBtns.classList.add('hidden');

        const q = appState.activeQuestions[appState.currentQuestionIndex];
        const lang = appState.language;

        learnQuestion.textContent = q.question;
        
        // Use innerHTML to render formatted HTML from JSON
        learnAnswer.innerHTML = q.correctAnswer; 
        
        learnCounter.textContent = translations[lang].learnCounter
            .replace('{current}', appState.currentQuestionIndex + 1)
            .replace('{total}', appState.activeQuestions.length);
    }
    
    /**
     * Calculates the final score and builds the results page.
     * (Now supports all 3 modes)
     */
    function calculateAndRenderResults() {
        let score = 0;
        resultDetailsContainer.innerHTML = '';
        const lang = appState.language;
        const total = appState.activeQuestions.length;

        // Update titles
        document.querySelector('#results-view h2').setAttribute('data-key', 'sessionComplete');
        document.querySelector('#results-view h3').setAttribute('data-key', 'reviewAnswers');
        
        appState.activeQuestions.forEach((q, index) => {
            const userAnswer = appState.userAnswers[index];
            
            // Handle Quiz/Practice results
            if (appState.currentMode === 'quiz' || appState.currentMode === 'practice') {
                const isCorrect = (userAnswer === q.correctAnswer);
                if (isCorrect) {
                    score++;
                }

                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;
                
                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                cardHTML += `<p class="user-answer ${isCorrect ? '' : 'incorrect'}">
                                <strong>${translations[lang].yourAnswerLabel}:</strong> ${userAnswer || translations[lang].notAnsweredLabel}
                             </p>`;
                if (!isCorrect) {
                    cardHTML += `<p class="correct-answer">
                                    <strong>${translations[lang].correctAnswerLabel}:</strong> ${q.correctAnswer}
                                 </p>`;
                }
                
                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);

            // Handle Learn mode results
            } else if (appState.currentMode === 'learn') {
                const didKnow = (userAnswer === 'knew');
                if (didKnow) {
                    score++;
                }

                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${didKnow ? 'correct' : 'incorrect'}`;
                const statusText = didKnow ? translations[lang].knewItLabel : translations[lang].didntKnowLabel;
                
                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                
                // Use innerHTML for the answer here as well
                cardHTML += `<div class="correct-answer-review">
                                <strong>${translations[lang].correctAnswerLabel}:</strong>
                                <div class="answer-content">${q.correctAnswer}</div>
                             </div>`;
                             
                cardHTML += `<p class="user-answer ${didKnow ? '' : 'incorrect'}">
                                <strong>${translations[lang].statusLabel}:</strong> ${statusText}
                             </p>`;

                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);
            }
        });

        // Update score display
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        resultScore.textContent = `${score} / ${total}`;
        resultPercentage.textContent = `${percentage}%`;
        
        updateUIText(); // Update new titles
        switchView('results');
    }

    /**
     * Shows the streak pop-up with a random message.
     */
    function showStreakPopup() {
        // Prevent popup from showing if another one is already active
        if (streakPopup.classList.contains('active')) {
            return;
        }

        const randomMsg = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
        
        // ** NULL KONTROLÜ (Güvenlik için eklendi) **
        if (streakEmoji && streakText) {
            streakEmoji.textContent = randomMsg.emoji;
            streakText.textContent = randomMsg.text[appState.language];
            streakPopup.classList.add('active');
        } else {
            console.error("Streak popup elements not found!");
            return; // Elemanlar bulunamazsa fonksiyonu durdur
        }
        
        // Hide after 20 seconds (as requested)
        setTimeout(() => {
            streakPopup.classList.remove('active');
        }, 20000); 
    }


    // --- 5. THEME & LANGUAGE FUNCTIONS ---

    /**
     * Sets the theme (light/dark)
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lecturePodTheme', theme);
        appState.theme = theme;
        if(themeIcon) { // Null kontrolü
            themeIcon.textContent = (theme === 'dark') ? 'light_mode' : 'dark_mode';
        }
    }

    /**
     * Sets the language (tr/en)
     */
    function setLanguage(lang) {
        if (translations[lang]) {
            appState.language = lang;
            localStorage.setItem('lecturePodLang', lang);
            if(langToggleBtn) { // Null kontrolü
                langToggleBtn.textContent = (lang === 'tr') ? 'EN' : 'TR';
            }
            document.documentElement.lang = lang; // HTML lang özelliğini güncelle
            updateUIText();
        }
    }

    /**
     * Updates all UI text based on the current language.
     */
    function updateUIText() {
        const lang = appState.language;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                // Handle complex strings with variables
                if (key === 'maxQuestions') {
                    // Yalnızca selectedLectureData varsa max'ı almayı deneyin
                    const max = appState.selectedLectureData ? getQuestionsByType('multiple-choice').length : 0;
                    el.textContent = translations[lang][key].replace('{max}', max);
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
    }

    /**
     * Initializes theme and language from localStorage or browser settings.
     */
    function initializeSettings() {
        // Theme
        const savedTheme = localStorage.getItem('lecturePodTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme('dark');
        } else {
            setTheme('light');
        }

        // Language
        const savedLang = localStorage.getItem('lecturePodLang');
        const browserLang = navigator.language.split('-')[0];
        if (savedLang) {
            setLanguage(savedLang);
        } else if (browserLang === 'tr') {
            setLanguage('tr');
        } else {
            setLanguage('en');
        }
    }

    // --- 6. EVENT HANDLERS ---
    
    // Theme & Language Toggles
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTheme(appState.theme === 'light' ? 'dark' : 'light');
        });
    }
    
    if(langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            setLanguage(appState.language === 'tr' ? 'en' : 'tr');
        });
    }

    // Mode Selection Button Handlers
    startQuizModeBtn.addEventListener('click', () => {
        appState.currentMode = 'quiz';
        const allMCQuestions = getQuestionsByType('multiple-choice');
        const max = allMCQuestions.length;
        
        quizMaxQuestions.textContent = translations[appState.language].maxQuestions.replace('{max}', max);
        quizQuestionCountInput.max = max;
        quizQuestionCountInput.value = Math.min(10, max);
        
        switchView('quizSetup');
    });
    
    startPracticeModeBtn.addEventListener('click', () => {
        appState.currentMode = 'practice';
        appState.activeQuestions = getQuestionsByType('multiple-choice');
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
        appState.currentQuestionIndex = 0;
        
        renderQuestionView();
        switchView('question');
    });

    startLearnModeBtn.addEventListener('click', () => {
        appState.currentMode = 'learn';
        appState.activeQuestions = getQuestionsByType('short-answer');
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null); // Use 'null' for not answered
        appState.currentQuestionIndex = 0;
        
        renderLearnView();
        switchView('learn');
    });
    
    // Quiz Setup Handler
    startQuizBtn.addEventListener('click', () => {
        const allMCQuestions = getQuestionsByType('multiple-choice');
        const count = parseInt(quizQuestionCountInput.value, 10);
        
        if (count > 0 && count <= allMCQuestions.length) {
            appState.activeQuestions = getRandomQuestions(allMCQuestions, count);
            appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
            appState.currentQuestionIndex = 0;
            
            renderQuestionView();
            switchView('question');
        } else {
            quizMaxQuestions.textContent = `Please enter a number between 1 and ${allMCQuestions.length}.`; // This can stay simple
            quizMaxQuestions.style.color = 'red';
        }
    });

    // Question View Navigation
    nextQuestionBtn.addEventListener('click', () => {
        if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
            appState.currentQuestionIndex++;
            renderQuestionView();
        }
    });

    prevQuestionBtn.addEventListener('click', () => {
        if (appState.currentQuestionIndex > 0) {
            appState.currentQuestionIndex--;
            renderQuestionView();
        }
    });

    finishBtn.addEventListener('click', () => {
        calculateAndRenderResults();
    });

    // Learn View Handlers
    showAnswerBtn.addEventListener('click', () => {
        learnAnswer.classList.remove('hidden');
        showAnswerBtn.classList.add('hidden');
        learnFeedbackBtns.classList.remove('hidden');
        learnFeedbackBtns.style.display = 'grid';
    });

    /**
     * Handles Learn Mode feedback
     * **FIXED:** Added a delay for advancing on streak.
     */
    function handleLearnFeedback(knewIt) {
        appState.userAnswers[appState.currentQuestionIndex] = knewIt ? 'knew' : 'didnt-know';
        
        let isStreakAchieved = false;
        if (knewIt) {
            appState.currentStreak++;
        } else {
            appState.currentStreak = 0; // "Bilemedim" seçilirse seri sıfırlanır
        }

        if (appState.currentStreak === 3) {
            showStreakPopup();
            appState.currentStreak = 0; // Gösterdikten sonra sıfırla
            isStreakAchieved = true;
        }

        // Function to move to next card or finish
        const advance = () => {
            if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
                appState.currentQuestionIndex++;
                renderLearnView();
            } else {
                // End of learn mode, go to results
                calculateAndRenderResults();
            }
        };

        // **THE FIX:** Wait 2.5s if a streak just happened, otherwise wait 0.3s
        const delay = isStreakAchieved ? 2500 : 300;
        setTimeout(advance, delay);
    }
    learnKnewBtn.addEventListener('click', () => handleLearnFeedback(true));
    learnDidntKnowBtn.addEventListener('click', () => handleLearnFeedback(false));
    

    // --- 7. INITIALIZE THE APP ---
    
    initializeSettings();
    populateLectureList();
    switchView('lectureSelection');
});