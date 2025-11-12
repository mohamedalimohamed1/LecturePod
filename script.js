document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LECTURE SOURCES ---
    const LECTURE_SOURCES = [
        { id: 'lecture-1', title: 'Sistem Analizi - Vize Sınavı', file: 'data/lecture_one.json' },
        { id: 'lecture-2', title: 'Dijital Okuryazarlık - Vize Sınavı', file: 'data/lecture_six.json' },
        { id: 'lecture-2', title: 'Görüntü İşleme - Vize Sınavı', file: 'data/lecture_four.json' },
        { id: 'lecture-2', title: 'Kriptoloji ve Bilgi Güvenliği - Vize Sınavı', file: 'data/lecture_seven.json' },
        { id: 'lecture-3', title: 'Uzaktan algılama - Vize Sınavı', file: 'data/lecture_three.json' },
        { id: 'lecture-2', title: 'İşletim Sistemleri - Vize Sınavı', file: 'data/lecture_five.json' },
        { id: 'lecture-2', title: 'Örüntü Tanıma - Vize Sınavı', file: 'data/lecture_two.json' },
    ];

    // --- 2. STREAK MESSAGES ---
    const SUCCESS_MESSAGES = [
        { emoji: '🤩', text: { tr: 'İnanılmaz! Bu seri karşısında hayran kalmamak elde değil. Bravo!', en: 'Incredible! Impossible not to be amazed. Bravo!' } },
        { emoji: '🤖', text: { tr: 'Bir saniye... Kodumda bir hata mı var, yoksa sen fazla mı iyisin?', en: 'Wait... Is there a bug in my code, or are you just too good?' } },
        { emoji: '🎉', text: { tr: 'Üçte üç! Bir konfeti patlamasını hak ettin. Harikasın!', en: 'Three in a row! You earned a confetti explosion. Awesome!' } },
        { emoji: '🧐', text: { tr: 'Bu işte bir sır olmalı... Bu kadar hatasız olmak normal değil!', en: 'There must be a secret... Being this flawless isn\'t normal!' } },
        { emoji: '✨', text: { tr: 'Resmen sihir yapıyorsun! Bu parlak performans gözlerimi kamaştırdı.', en: 'You\'re doing magic! This brilliant performance dazzled me.' } },
        { emoji: '💯', text: { tr: 'Mükemmel bir seri! Skor tablosu olsaydı, şu an zirvedeydin.', en: 'Perfect streak! If there was a leaderboard, you\'d be at the top.' } },
        { emoji: '🚀', text: { tr: 'Tam gaz! Bu hızla devam edersen, yakında öğretecek bir şeyim kalmayacak.', en: 'Full speed! Keep this up and I\'ll run out of things to teach.' } },
        { emoji: '🔥', text: { tr: 'Ateş ediyorsun! Bu seri o kadar sıcaktı ki, fanlarımı çalıştırmam gerekti.', en: 'You\'re on fire! This streak was so hot I had to turn on my fans.' } },
        { emoji: '🕵️', text: { tr: 'İtiraf et, cevap anahtarını falan mı buldun? Bu normal değil!', en: 'Confess, did you find the answer key? This isn\'t normal!' } },
        { emoji: '😳', text: { tr: 'Beni utandırıyorsun! Bu kadar iyi olman benim bile beklemediğim bir şeydi.', en: 'You\'re making me blush! Being this good was unexpected even for me.' } }
    ];

    const FAILURE_MESSAGES = [
        { emoji: '🫠', text: { tr: 'Cevabı bilmek için beynimi mi vereyim? (Endişelenme, ben yapay zekayım!)', en: 'Need my brain for the answer? (Don\'t worry, I\'m AI!)' } },
        { emoji: '🤔', text: { tr: 'Sanırım bugün gününde değilsin? Odaklan, başarabilirsin!', en: 'Not your day today? Focus, you can do this!' } },
        { emoji: '🛑', text: { tr: 'Hey, biraz yavaşla! Soruyu dikkatlice okuduğuna emin misin?', en: 'Hey, slow down a bit! Are you sure you read the question carefully?' } },
        { emoji: '☕', text: { tr: 'Belki bir kahve molası verme zamanı gelmiştir? Toparlanıp dön!', en: 'Maybe it\'s time for a coffee break? Regroup and come back!' } },
        { emoji: '😵‍💫', text: { tr: 'Üst üste hatalar... Algoritmalarım senin için endişelenmeye başladı.', en: 'Errors in a row... My algorithms are starting to worry about you.' } }
    ];

    let availableSuccessMsgs = [...SUCCESS_MESSAGES];
    let availableFailureMsgs = [...FAILURE_MESSAGES];

    // --- 3. TRANSLATIONS ---
    const translations = {
        'en': {
            'mainTitle': 'LecturePod', 'mainSubtitle': 'Your Modern E-Learning Hub', 'selectLecture': 'Select a Lecture',
            'loadingLectures': 'Loading lectures...', 'howToStudy': 'How do you want to study?',
            'readMode': 'Read Mode', 'readModeDesc': 'Browse questions and answers sequentially.',
            'quizMode': 'Quiz Mode', 'quizModeDesc': 'Get a score. Randomly selected questions.',
            'practiceMode': 'Practice Mode', 'practiceModeDesc': 'Do all questions. Instant feedback.',
            'learnMode': 'Learn Mode', 'learnModeDesc': 'Flashcards. Show answer when ready.',
            'backToLectures': 'Back to Lectures', 'backToModes': 'Back to Modes',
            'quizSetupTitle': 'Quiz Mode Setup', 'howManyQuestions': 'How many questions do you want?', 'maxQuestions': '(Max: {max})',
            'startQuiz': 'Start Quiz', 'quitSession': 'Quit Session', 'readModeTitle': 'Read Mode',
            'quizModeTitle': 'Quiz Mode', 'practiceModeTitle': 'Practice Mode', 'learnModeTitle': 'Learn Mode',
            'questionCounter': 'Question {current} / {total}', 'learnCounter': '{current} / {total}',
            'previous': 'Previous', 'next': 'Next', 'finish': 'Finish Session',
            'showAnswer': 'Show Answer', 'didntKnow': 'I didn\'t know', 'knewIt': 'I knew it',
            'sessionComplete': 'Session Complete!', 'reviewAnswers': 'Review Your Answers',
            'notAnsweredLabel': 'Not answered', 'correctAnswerLabel': 'Correct Answer', 'yourAnswerLabel': 'Your Answer',
            'statusLabel': 'Status', 'knewItLabel': 'Knew', 'didntKnowLabel': 'Didn\'t Know',
            'finalScoreLabel': 'Final Score', 'percentageLabel': 'Percentage'
        },
        'tr': {
            'mainTitle': 'LecturePod', 'mainSubtitle': 'Modern E-Öğrenme Merkeziniz', 'selectLecture': 'Bir Ders Seçin',
            'loadingLectures': 'Dersler yükleniyor...', 'howToStudy': 'Nasıl çalışmak istersiniz?',
            'readMode': 'Okuma Modu', 'readModeDesc': 'Soruları ve cevapları sırayla incele.',
            'quizMode': 'Test Modu', 'quizModeDesc': 'Puan al. Rastgele seçilmiş sorular.',
            'practiceMode': 'Pratik Modu', 'practiceModeDesc': 'Tüm sorular. Anında geri bildirim.',
            'learnMode': 'Öğrenme Modu', 'learnModeDesc': 'Bilgi kartları. Hazır olunca cevabı göster.',
            'backToLectures': 'Derslere Geri Dön', 'backToModes': 'Modlara Geri Dön',
            'quizSetupTitle': 'Test Modu Kurulumu', 'howManyQuestions': 'Kaç soru istersiniz?', 'maxQuestions': '(En fazla: {max})',
            'startQuiz': 'Testi Başlat', 'quitSession': 'Oturumu Kapat', 'readModeTitle': 'Okuma Modu',
            'quizModeTitle': 'Test Modu', 'practiceModeTitle': 'Pratik Modu', 'learnModeTitle': 'Öğrenme Modu',
            'questionCounter': 'Soru {current} / {total}', 'learnCounter': '{current} / {total}',
            'previous': 'Önceki', 'next': 'Sonraki', 'finish': 'Oturumu Bitir',
            'showAnswer': 'Cevabı Göster', 'didntKnow': 'Bilemedim', 'knewIt': 'Bildim',
            'sessionComplete': 'Oturum Tamamlandı!', 'reviewAnswers': 'Cevaplarını Gözden Geçir',
            'notAnsweredLabel': 'Cevaplanmadı', 'correctAnswerLabel': 'Doğru Cevap', 'yourAnswerLabel': 'Senin Cevabın',
            'statusLabel': 'Durum', 'knewItLabel': 'Bilindi', 'didntKnowLabel': 'Bilinemedi',
            'finalScoreLabel': 'Nihai Puan', 'percentageLabel': 'Yüzdelik'
        }
    };
    
    // --- 4. GLOBAL STATE ---
    let appState = {
        currentView: 'lecture-selection',
        selectedLectureData: null,
        currentMode: null,
        activeQuestions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        currentSuccessStreak: 0,
        currentFailureStreak: 0,
        language: 'tr',
        theme: 'light'
    };
    
    // --- 5. DOM REFERENCES ---
    const views = {
        lectureSelection: document.getElementById('lecture-selection-view'),
        modeSelection: document.getElementById('mode-selection-view'),
        readMode: document.getElementById('read-mode-view'), // YENİ
        quizSetup: document.getElementById('quiz-setup-view'),
        question: document.getElementById('question-view'),
        learn: document.getElementById('learn-view'),
        results: document.getElementById('results-view'),
    };

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const lectureListContainer = document.getElementById('lecture-list-container');
    const selectedCourseTitle = document.getElementById('selected-course-title');
    const selectedLectureTitle = document.getElementById('selected-lecture-title');
    
    const startReadModeBtn = document.getElementById('start-read-mode');
    const startQuizModeBtn = document.getElementById('start-quiz-mode');
    const startPracticeModeBtn = document.getElementById('start-practice-mode');
    const startLearnModeBtn = document.getElementById('start-learn-mode');
    
    const readModeList = document.getElementById('read-mode-list'); // YENİ

    const questionModeTitle = document.getElementById('question-mode-title');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const questionOptionsContainer = document.getElementById('question-options-container');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishBtn = document.getElementById('finish-btn');

    const quizMaxQuestions = document.getElementById('quiz-max-questions');
    const quizQuestionCountInput = document.getElementById('quiz-question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    const learnCounter = document.getElementById('learn-counter');
    const learnQuestion = document.getElementById('learn-question');
    const learnAnswer = document.getElementById('learn-answer');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const learnFeedbackBtns = document.getElementById('learn-feedback-btns');
    const learnKnewBtn = document.getElementById('learn-knew');
    const learnDidntKnowBtn = document.getElementById('learn-didnt-know');

    const resultDetailsContainer = document.getElementById('result-details-container');
    const resultScore = document.getElementById('result-score');
    const resultPercentage = document.getElementById('result-percentage');

    const streakPopup = document.getElementById('streak-popup');
    const streakEmoji = document.getElementById('streak-emoji');
    const streakText = document.getElementById('streak-message');
    const streakCloseBtn = document.getElementById('streak-close-btn');
    const streakTimerProgress = document.getElementById('streak-timer-progress');
    let streakTimer = null;

    document.querySelectorAll('.back-to-lectures').forEach(btn => btn.addEventListener('click', () => { resetSession(); switchView('lectureSelection'); }));
    document.querySelectorAll('.back-to-modes').forEach(btn => btn.addEventListener('click', () => { resetSession(); switchView('modeSelection'); }));

    // --- 6. CORE LOGIC ---

    function switchView(viewId) {
        for (let key in views) views[key].classList.remove('active');
        if (views[viewId]) {
            views[viewId].classList.add('active');
            appState.currentView = viewId;
        }
    }

    function resetSession() {
        appState.activeQuestions = [];
        appState.userAnswers = [];
        appState.currentQuestionIndex = 0;
        appState.currentSuccessStreak = 0;
        appState.currentFailureStreak = 0;
        hideStreakPopup();
    }

    async function loadLecture(lectureFile) {
        try {
            const response = await fetch(lectureFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            appState.selectedLectureData = await response.json();
            
            const questions = appState.selectedLectureData.questions || [];
            const hasMC = questions.some(q => q.type === 'multiple-choice');
            const hasSA = questions.some(q => q.type === 'short-answer');
            const hasAny = questions.length > 0;

            startReadModeBtn.disabled = !hasAny;
            startQuizModeBtn.disabled = !hasMC;
            startPracticeModeBtn.disabled = !hasMC;
            startLearnModeBtn.disabled = !hasSA;

            selectedCourseTitle.textContent = appState.selectedLectureData.courseTitle;
            selectedLectureTitle.textContent = appState.selectedLectureData.lectureTitle;
            switchView('modeSelection');
        } catch (error) {
            console.error("Could not load lecture:", error);
            alert("Error loading lecture file.");
        }
    }

    function populateLectureList() {
        lectureListContainer.innerHTML = ''; 
        if (LECTURE_SOURCES.length === 0) lectureListContainer.innerHTML = `<p class="loading-text" data-key="loadingLectures">Loading lectures...</p>`;
        LECTURE_SOURCES.forEach(lecture => {
            const button = document.createElement('button');
            button.className = "lecture-btn";
            const [course, topic] = lecture.title.split(' - ');
            button.innerHTML = `<h3>${course || lecture.title}</h3><p>${topic || 'Start Lecture'}</p>`;
            button.addEventListener('click', () => loadLecture(lecture.file));
            lectureListContainer.appendChild(button);
        });
        updateUIText();
    }

    // --- 7. RENDER FUNCTIONS ---

    // YENİ: Okuma Modu için toplu görünüm
    function renderReadModeView() {
        readModeList.innerHTML = '';
        const lang = appState.language;
        const questions = appState.selectedLectureData.questions;

        questions.forEach((q, index) => {
            const card = document.createElement('div');
            // 'read-mode-card' ile nötr bir stil veriyoruz (yeşil/kırmızı değil)
            card.className = 'result-card read-mode-card';
            
            let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
            // Sadece doğru cevabı göster
            cardHTML += `<div class="correct-answer-review">
                            <strong>${translations[lang].correctAnswerLabel}:</strong>
                            <div class="answer-content">${q.correctAnswer}</div>
                         </div>`;
            
            card.innerHTML = cardHTML;
            readModeList.appendChild(card);
        });
    }

    function renderQuestionView() {
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        const lang = appState.language;
        const isQuiz = appState.currentMode === 'quiz';
        const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
        const isAnswered = (userAnswer !== null);

        questionModeTitle.setAttribute('data-key', isQuiz ? 'quizModeTitle' : 'practiceModeTitle');
        questionModeTitle.textContent = translations[lang][isQuiz ? 'quizModeTitle' : 'practiceModeTitle'];
        questionCounter.textContent = translations[lang].questionCounter.replace('{current}', appState.currentQuestionIndex + 1).replace('{total}', appState.activeQuestions.length);
        questionText.textContent = q.question;

        questionOptionsContainer.innerHTML = '';
        questionOptionsContainer.classList.toggle('answered', isAnswered);

        q.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.textContent = option;
            const input = document.createElement('input');
            input.type = 'radio'; input.name = 'option'; input.value = option;
            label.prepend(input);
            questionOptionsContainer.appendChild(label);

            if (isAnswered) {
                if (option === q.correctAnswer) label.classList.add('correct-answer');
                if (option === userAnswer) {
                    label.classList.add('selected');
                    input.checked = true;
                    if (userAnswer !== q.correctAnswer) label.classList.add('incorrect-answer');
                }
            } else {
                label.addEventListener('click', (e) => handleAnswerSelection(e, q, label));
            }
        });
        prevQuestionBtn.classList.toggle('hidden', appState.currentQuestionIndex === 0);
        const isLast = appState.currentQuestionIndex === appState.activeQuestions.length - 1;
        nextQuestionBtn.classList.toggle('hidden', !isAnswered || isLast);
        finishBtn.classList.toggle('hidden', !isAnswered || !isLast);
    }

    function handleAnswerSelection(e, q, label) {
        e.preventDefault();
        if (appState.userAnswers[appState.currentQuestionIndex] !== null) return;

        const selected = label.textContent.trim();
        appState.userAnswers[appState.currentQuestionIndex] = selected;
        const isCorrect = (selected === q.correctAnswer);
        let streakTriggered = false;

        questionOptionsContainer.classList.add('answered');
        Array.from(questionOptionsContainer.children).find(l => l.textContent.trim() === q.correctAnswer)?.classList.add('correct-answer');

        if (isCorrect) {
            label.classList.add('selected');
            appState.currentFailureStreak = 0;
            appState.currentSuccessStreak++;
            if (appState.currentSuccessStreak >= 3) {
                 showStreakPopup('success');
                 appState.currentSuccessStreak = 0;
                 streakTriggered = true;
            }
        } else {
            label.classList.add('incorrect-answer', 'shake');
            appState.currentSuccessStreak = 0;
            appState.currentFailureStreak++;
            if (appState.currentFailureStreak >= 2) {
                showStreakPopup('failure');
                appState.currentFailureStreak = 0;
                streakTriggered = true;
            }
        }

        if (appState.currentQuestionIndex === appState.activeQuestions.length - 1) {
            finishBtn.classList.remove('hidden');
        } else {
            nextQuestionBtn.classList.remove('hidden');
        }

        if (appState.currentMode === 'practice') {
            const delay = streakTriggered ? 2500 : 1000;
            setTimeout(() => {
                if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
                    appState.currentQuestionIndex++;
                    renderQuestionView();
                }
            }, delay);
        }
    }

    function renderLearnView() {
        learnAnswer.classList.add('hidden');
        showAnswerBtn.classList.remove('hidden');
        learnFeedbackBtns.classList.add('hidden');
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        learnQuestion.textContent = q.question;
        learnAnswer.innerHTML = q.correctAnswer;
        learnCounter.textContent = translations[appState.language].learnCounter.replace('{current}', appState.currentQuestionIndex + 1).replace('{total}', appState.activeQuestions.length);
    }

    function handleLearnFeedback(knewIt) {
        appState.userAnswers[appState.currentQuestionIndex] = knewIt ? 'knew' : 'didnt-know';
        let streakTriggered = false;

        if (knewIt) {
            appState.currentFailureStreak = 0;
            appState.currentSuccessStreak++;
            if (appState.currentSuccessStreak >= 3) {
                showStreakPopup('success');
                appState.currentSuccessStreak = 0;
                streakTriggered = true;
            }
        } else {
            appState.currentSuccessStreak = 0;
            appState.currentFailureStreak++;
            if (appState.currentFailureStreak >= 2) {
                showStreakPopup('failure');
                appState.currentFailureStreak = 0;
                streakTriggered = true;
            }
        }

        const delay = streakTriggered ? 2500 : 300;
        setTimeout(() => {
            if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
                appState.currentQuestionIndex++;
                renderLearnView();
            } else {
                calculateAndRenderResults();
            }
        }, delay);
    }

    function calculateAndRenderResults() {
        let score = 0;
        resultDetailsContainer.innerHTML = '';
        const lang = appState.language;
        const total = appState.activeQuestions.length;

        appState.activeQuestions.forEach((q, index) => {
            const userAnswer = appState.userAnswers[index];
            let isCorrect = false;
            
            if (appState.currentMode === 'learn') {
                isCorrect = (userAnswer === 'knew');
                if (isCorrect) score++;
                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;
                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                cardHTML += `<div class="correct-answer-review"><strong>${translations[lang].correctAnswerLabel}:</strong> <div class="answer-content">${q.correctAnswer}</div></div>`;
                cardHTML += `<p class="user-answer ${isCorrect ? '' : 'incorrect'}"><strong>${translations[lang].statusLabel}:</strong> ${isCorrect ? translations[lang].knewItLabel : translations[lang].didntKnowLabel}</p>`;
                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);
            } else {
                isCorrect = (userAnswer === q.correctAnswer);
                if (isCorrect) score++;
                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;
                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                cardHTML += `<p class="user-answer ${isCorrect ? '' : 'incorrect'}"><strong>${translations[lang].yourAnswerLabel}:</strong> ${userAnswer || translations[lang].notAnsweredLabel}</p>`;
                if (!isCorrect) cardHTML += `<p class="correct-answer"><strong>${translations[lang].correctAnswerLabel}:</strong> ${q.correctAnswer}</p>`;
                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);
            }
        });

        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        resultScore.textContent = `${score} / ${total}`;
        resultPercentage.textContent = `${percentage}%`;
        switchView('results');
    }

    // --- 8. STREAK POPUP ---
    function getNextMessage(type) {
        let sourceArray = (type === 'success') ? availableSuccessMsgs : availableFailureMsgs;
        let originalArray = (type === 'success') ? SUCCESS_MESSAGES : FAILURE_MESSAGES;
        if (sourceArray.length === 0) {
            sourceArray = [...originalArray];
            if (type === 'success') availableSuccessMsgs = sourceArray; else availableFailureMsgs = sourceArray;
        }
        const randomIndex = Math.floor(Math.random() * sourceArray.length);
        const message = sourceArray[randomIndex];
        sourceArray.splice(randomIndex, 1);
        return message;
    }

    function showStreakPopup(type) {
        hideStreakPopup();
        const msg = getNextMessage(type);
        streakEmoji.textContent = msg.emoji;
        streakText.textContent = msg.text[appState.language];
        streakPopup.className = 'streak-popup';
        if (type === 'failure') streakPopup.classList.add('failure');
        
        void streakPopup.offsetWidth; 
        streakPopup.classList.add('active');
        streakTimerProgress.style.transition = 'none';
        streakTimerProgress.style.width = '100%';
        setTimeout(() => {
             streakTimerProgress.style.transition = 'width 20s linear';
             streakTimerProgress.style.width = '0%';
        }, 10);
        streakTimer = setTimeout(hideStreakPopup, 20000);
    }
    function hideStreakPopup() {
        streakPopup.classList.remove('active');
        if (streakTimer) clearTimeout(streakTimer);
    }
    streakCloseBtn.addEventListener('click', hideStreakPopup);

    // --- 9. EVENT HANDLERS ---
    startReadModeBtn.addEventListener('click', () => {
        appState.currentMode = 'read';
        renderReadModeView();
        switchView('readMode');
    });

    startQuizModeBtn.addEventListener('click', () => {
         appState.currentMode = 'quiz';
         const allMC = appState.selectedLectureData.questions.filter(q => q.type === 'multiple-choice');
         quizMaxQuestions.textContent = translations[appState.language].maxQuestions.replace('{max}', allMC.length);
         quizQuestionCountInput.max = allMC.length;
         quizQuestionCountInput.value = Math.min(10, allMC.length);
         switchView('quizSetup');
    });

    startPracticeModeBtn.addEventListener('click', () => {
        appState.currentMode = 'practice';
        appState.activeQuestions = appState.selectedLectureData.questions.filter(q => q.type === 'multiple-choice');
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
        appState.currentQuestionIndex = 0;
        renderQuestionView();
        switchView('question');
    });

    startLearnModeBtn.addEventListener('click', () => {
         appState.currentMode = 'learn';
         appState.activeQuestions = appState.selectedLectureData.questions.filter(q => q.type === 'short-answer');
         appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
         appState.currentQuestionIndex = 0;
         renderLearnView();
         switchView('learn');
    });

    startQuizBtn.addEventListener('click', () => {
        const allMC = appState.selectedLectureData.questions.filter(q => q.type === 'multiple-choice');
        const count = parseInt(quizQuestionCountInput.value, 10);
        if (count > 0 && count <= allMC.length) {
            appState.activeQuestions = [...allMC].sort(() => 0.5 - Math.random()).slice(0, count);
            appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
            appState.currentQuestionIndex = 0;
            renderQuestionView();
            switchView('question');
        }
    });

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
    finishBtn.addEventListener('click', calculateAndRenderResults);
    showAnswerBtn.addEventListener('click', () => {
        learnAnswer.classList.remove('hidden'); showAnswerBtn.classList.add('hidden');
        learnFeedbackBtns.classList.remove('hidden'); learnFeedbackBtns.style.display = 'grid';
    });
    learnKnewBtn.addEventListener('click', () => handleLearnFeedback(true));
    learnDidntKnowBtn.addEventListener('click', () => handleLearnFeedback(false));
    
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = appState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lecturePodTheme', newTheme);
        appState.theme = newTheme;
        themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    });
    langToggleBtn.addEventListener('click', () => {
        appState.language = appState.language === 'tr' ? 'en' : 'tr';
        localStorage.setItem('lecturePodLang', appState.language);
        langToggleBtn.textContent = appState.language === 'tr' ? 'EN' : 'TR';
        updateUIText();
    });

    function updateUIText() {
        const lang = appState.language;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                 if (key === 'maxQuestions' && appState.selectedLectureData) {
                      // Dynamic update handled in mode selection, just placeholder here if needed
                 } else {
                     el.textContent = translations[lang][key];
                 }
            }
        });
    }

    const savedTheme = localStorage.getItem('lecturePodTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    appState.theme = savedTheme;
    themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    const savedLang = localStorage.getItem('lecturePodLang') || 'tr';
    appState.language = savedLang;
    langToggleBtn.textContent = savedLang === 'tr' ? 'EN' : 'TR';
    updateUIText();
    populateLectureList();
});