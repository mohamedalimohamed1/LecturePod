document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LECTURE SOURCES ---
    const LECTURE_SOURCES = [
        { id: 'lecture-1', title: 'Sistem Analizi - Vize Sınavı', file: 'data/lecture_one.json' },
        { id: 'lecture-2', title: 'Dijital Okuryazarlık - Vize Sınavı', file: 'data/lecture_six.json' },
        { id: 'lecture-3', title: 'Görüntü İşleme - Vize Sınavı', file: 'data/lecture_four.json' },
        { id: 'lecture-4', title: 'Kriptoloji ve Bilgi Güvenliği - Vize Sınavı', file: 'data/lecture_seven.json' },
        { id: 'lecture-5', title: 'Uzaktan Algılama - Vize Sınavı', file: 'data/lecture_three.json' },
        { id: 'lecture-6', title: 'İşletim Sistemleri - Vize Sınavı', file: 'data/lecture_five.json' },
        { id: 'lecture-7', title: 'Örüntü Tanıma - Vize Sınavı', file: 'data/lecture_two.json' },
    ];

    // --- 2. STREAK MESSAGES ---
    const SUCCESS_MESSAGES = [
        { emoji: '🔥', text: { tr: 'Harikasın! 3 Doğru Üst Üste!', en: 'Great! 3 in a row!' } },
        { emoji: '🚀', text: { tr: 'Durdurulamaz Gidiyorsun!', en: 'You are unstoppable!' } },
        { emoji: '💎', text: { tr: 'Kusursuz Performans!', en: 'Flawless performance!' } },
        { emoji: '🌟', text: { tr: 'Böyle devam et, harika bir seri!', en: 'Keep going, amazing streak!' } }
    ];

    const FAILURE_MESSAGES = [
        { emoji: '🧐', text: { tr: 'Dikkat Et! Tekrar Odaklanalım.', en: 'Be careful! Let\'s refocus.' } },
        { emoji: '☕', text: { tr: 'Bir Kahve Molası Lazım mı?', en: 'Need a coffee break?' } },
        { emoji: '💪', text: { tr: 'Pes etme! Bir sonrakinde başaracaksın.', en: 'Don\'t give up! You\'ll get the next one.' } }
    ];

    // --- 3. TRANSLATIONS ---
    const translations = {
        tr: {
            mainTitle: "LecturePod", mainSubtitle: "Modern E-Öğrenme Merkeziniz", selectLecture: "Bir Ders Seçin",
            readMode: "Okuma", quizMode: "Test", practiceMode: "Pratik", learnMode: "Ezber",
            startSession: "Başlat", finishEarly: "Bitir", reviewMistakes: "Hataları Tekrarla",
            correctAnswerLabel: "Doğru", yourAnswerLabel: "Senin", statusLabel: "Durum",
            knewItLabel: "Bildi", didntKnowLabel: "Bilemedi", notAnsweredLabel: "Boş",
            quitConfirm: "Oturumu bitirmek istiyor musunuz?",
            notificationLoaded: "Ders başarıyla yüklendi!",
            notificationRange: "Geçerli bir soru aralığı seçildi.",
            notificationError: "Bir hata oluştu!",
            sessionSetupTitle: "Oturum Ayarları", backToModes: "Modlara Geri Dön", backToLectures: "Derslere Geri Dön",
            optAll: "Tümü", optRandom: "Rastgele", optRange: "Aralık"
        },
        en: {
            mainTitle: "LecturePod", mainSubtitle: "Your Modern E-Learning Hub", selectLecture: "Select a Lecture",
            readMode: "Read", quizMode: "Quiz", practiceMode: "Practice", learnMode: "Learn",
            startSession: "Start", finishEarly: "Finish", reviewMistakes: "Review Mistakes",
            correctAnswerLabel: "Correct", yourAnswerLabel: "Yours", statusLabel: "Status",
            knewItLabel: "Known", didntKnowLabel: "Unknown", notAnsweredLabel: "Empty",
            quitConfirm: "Finish the session?",
            notificationLoaded: "Lecture loaded successfully!",
            notificationRange: "Valid question range selected.",
            notificationError: "An error occurred!",
            sessionSetupTitle: "Session Setup", backToModes: "Back to Modes", backToLectures: "Back to Lectures",
            optAll: "All", optRandom: "Random", optRange: "Range"
        }
    };

    let appState = {
        language: 'tr', theme: 'light', selectedLectureData: null, currentMode: null,
        activeQuestions: [], currentQuestionIndex: 0, userAnswers: [],
        lastMistakes: [], rangeType: 'all', successStreak: 0, failureStreak: 0
    };

    const views = {
        lectureSelection: document.getElementById('lecture-selection-view'),
        modeSelection: document.getElementById('mode-selection-view'),
        sessionSetup: document.getElementById('session-setup-view'),
        readMode: document.getElementById('read-mode-view'),
        question: document.getElementById('question-view'),
        learn: document.getElementById('learn-view'),
        results: document.getElementById('results-view')
    };

    function switchView(viewId) {
        Object.values(views).forEach(v => v ? v.classList.remove('active') : null);
        if (views[viewId]) views[viewId].classList.add('active');
    }

    // --- NOTIFICATION SYSTEM (NEW) ---
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.app-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = `app-notification ${type}`;
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3000);
    }

    // --- STREAK POPUP LOGIC ---
    function showStreak(type) {
        const popup = document.getElementById('streak-popup');
        const emojiEl = document.getElementById('streak-emoji');
        const msgEl = document.getElementById('streak-message');
        const messages = type === 'success' ? SUCCESS_MESSAGES : FAILURE_MESSAGES;
        const msg = messages[Math.floor(Math.random() * messages.length)];

        emojiEl.textContent = msg.emoji;
        msgEl.textContent = msg.text[appState.language];
        popup.className = `streak-popup active ${type === 'failure' ? 'failure' : ''}`;

        // Sadece 3.5 saniye görünür
        setTimeout(() => { popup.classList.remove('active'); }, 3500);
    }

    // --- SETUP LOGIC ---
    function renderSetup() {
        const area = document.getElementById('setup-config-area');
        const total = appState.selectedLectureData.questions.length;
        area.innerHTML = '';

        if (appState.rangeType === 'random') {
            area.innerHTML = `<div class="setup-field">
                                <label class="section-title">Kaç Soru? (Maks: ${total})</label>
                                <input type="number" id="setup-count" min="1" max="${total}" value="${Math.min(10, total)}">
                             </div>`;
        } else if (appState.rangeType === 'range') {
            area.innerHTML = `<div class="range-grid">
                                <div><label>Başlangıç</label><input type="number" id="range-start" value="1"></div>
                                <div><label>Bitiş</label><input type="number" id="range-end" value="${total}"></div>
                             </div>`;
        }
    }

    document.querySelectorAll('.setup-opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.setup-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.rangeType = btn.dataset.value;
            renderSetup();
        };
    });

    document.getElementById('final-start-btn').onclick = () => {
        const questions = appState.selectedLectureData.questions;
        let selected = [];

        if (appState.rangeType === 'all') selected = [...questions];
        else if (appState.rangeType === 'random') {
            const count = parseInt(document.getElementById('setup-count').value);
            selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
        } else {
            const start = parseInt(document.getElementById('range-start').value) - 1;
            const end = parseInt(document.getElementById('range-end').value);
            selected = questions.slice(Math.max(0, start), Math.min(questions.length, end));
        }

        if (selected.length === 0) {
            showNotification(translations[appState.language].notificationError, 'error');
            return;
        }

        appState.activeQuestions = selected;
        appState.userAnswers = new Array(selected.length).fill(null);
        appState.currentQuestionIndex = 0;
        appState.successStreak = 0; appState.failureStreak = 0;

        showNotification(translations[appState.language].notificationRange, 'success');

        if (appState.currentMode === 'read') { renderRead(); switchView('readMode'); }
        else if (appState.currentMode === 'learn') { renderLearn(); switchView('learn'); }
        else { renderQuestion(); switchView('question'); }
    };

    // --- CORE RENDERING ---
    function renderQuestion() {
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
        const isAnswered = userAnswer !== null;

        document.getElementById('question-counter').textContent = `${appState.currentQuestionIndex + 1} / ${appState.activeQuestions.length}`;
        document.getElementById('question-text').textContent = q.question;

        const container = document.getElementById('question-options-container');
        container.innerHTML = '';

        q.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = `option-label ${isAnswered ? 'answered' : ''}`;
            btn.textContent = opt;
            
            if (isAnswered) {
                if (opt === q.correctAnswer) btn.classList.add('correct-highlight');
                if (opt === userAnswer && opt !== q.correctAnswer) btn.classList.add('wrong-highlight');
            } else {
                btn.onclick = () => handleChoice(opt);
            }
            container.appendChild(btn);
        });

        document.getElementById('prev-question-btn').classList.toggle('hidden', appState.currentQuestionIndex === 0);
        const isLast = appState.currentQuestionIndex === appState.activeQuestions.length - 1;
        document.getElementById('next-question-btn').classList.toggle('hidden', !isAnswered || isLast);
        document.getElementById('finish-btn').classList.toggle('hidden', !isAnswered || !isLast);
    }

    function handleChoice(choice) {
        if (appState.userAnswers[appState.currentQuestionIndex] !== null) return;
        
        appState.userAnswers[appState.currentQuestionIndex] = choice;
        const correct = choice === appState.activeQuestions[appState.currentQuestionIndex].correctAnswer;

        if (correct) {
            appState.successStreak++; appState.failureStreak = 0;
            if (appState.successStreak % 3 === 0) { showStreak('success'); }
        } else {
            appState.failureStreak++; appState.successStreak = 0;
            if (appState.failureStreak % 2 === 0) { showStreak('failure'); }
        }

        renderQuestion();
        if (appState.currentMode === 'practice' && appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
            setTimeout(() => { 
                appState.currentQuestionIndex++; 
                renderQuestion(); 
            }, 1000);
        }
    }

    function renderLearn() {
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        document.getElementById('learn-counter').textContent = `${appState.currentQuestionIndex + 1} / ${appState.activeQuestions.length}`;
        document.getElementById('learn-question').textContent = q.question;
        document.getElementById('learn-answer').innerHTML = q.correctAnswer;
        document.getElementById('learn-answer').classList.add('hidden');
        document.getElementById('show-answer-btn').classList.remove('hidden');
        document.getElementById('learn-feedback-btns').classList.add('hidden');
    }

    function renderRead() {
        const container = document.getElementById('read-mode-list');
        container.innerHTML = '';
        appState.activeQuestions.forEach((q, i) => {
            const card = document.createElement('div');
            card.className = 'result-card neutral';
            card.innerHTML = `<p><strong>${i+1}. ${q.question}</strong></p>
                              <div class="read-answer-box">${q.correctAnswer}</div>`;
            container.appendChild(card);
        });
    }

    function calculateResults() {
        let score = 0;
        appState.lastMistakes = [];
        const container = document.getElementById('result-details-container');
        container.innerHTML = '';

        appState.activeQuestions.forEach((q, i) => {
            const ans = appState.userAnswers[i];
            const correct = (appState.currentMode === 'learn' ? ans === 'knew' : ans === q.correctAnswer);
            if (correct) score++; else appState.lastMistakes.push(q);

            const card = document.createElement('div');
            card.className = `result-card ${correct ? 'correct' : 'incorrect'}`;
            card.innerHTML = `<p class="result-q-text"><strong>${i+1}. ${q.question}</strong></p>
                              <p class="result-user-ans">${translations[appState.language].yourAnswerLabel}: <span>${ans || '---'}</span></p>
                              ${!correct ? `<div class="result-correct-ans"><b>${translations[appState.language].correctAnswerLabel}:</b> ${q.correctAnswer}</div>` : ''}`;
            container.appendChild(card);
        });

        document.getElementById('result-score').textContent = `${score} / ${appState.activeQuestions.length}`;
        const percentage = Math.round((score / appState.activeQuestions.length) * 100);
        document.getElementById('result-percentage').textContent = `%${percentage}`;
        
        document.getElementById('mistake-review-area').classList.toggle('hidden', appState.lastMistakes.length === 0);
        switchView('results');
    }

    // --- INITIALIZATION ---
    async function loadLecture(l) {
        try {
            const res = await fetch(l.file);
            appState.selectedLectureData = await res.json();
            document.getElementById('selected-course-title').textContent = appState.selectedLectureData.courseTitle;
            document.getElementById('selected-lecture-title').textContent = appState.selectedLectureData.lectureTitle;
            showNotification(translations[appState.language].notificationLoaded, 'info');
            switchView('modeSelection');
        } catch (e) {
            showNotification(translations[appState.language].notificationError, 'error');
        }
    }

    function init() {
        const container = document.getElementById('lecture-list-container');
        container.innerHTML = '';
        LECTURE_SOURCES.forEach(l => {
            const btn = document.createElement('button');
            btn.className = 'lecture-btn';
            btn.innerHTML = `<h3>${l.title}</h3>`;
            btn.onclick = () => loadLecture(l);
            container.appendChild(btn);
        });
        updateUIText();
    }

    ['read', 'quiz', 'practice', 'learn'].forEach(m => {
        document.getElementById(`start-${m}-mode`).onclick = () => {
            appState.currentMode = m;
            appState.rangeType = 'all';
            document.querySelectorAll('.setup-opt-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.setup-opt-btn[data-value="all"]').classList.add('active');
            renderSetup();
            switchView('sessionSetup');
        };
    });

    document.querySelectorAll('.finish-early-trigger').forEach(b => b.onclick = () => {
        if(confirm(translations[appState.language].quitConfirm)) calculateResults();
    });

    document.getElementById('review-mistakes-btn').onclick = () => {
        appState.activeQuestions = [...appState.lastMistakes];
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
        appState.currentQuestionIndex = 0; appState.currentMode = 'practice';
        renderQuestion(); switchView('question');
    };

    document.getElementById('show-answer-btn').onclick = () => {
        document.getElementById('learn-answer').classList.remove('hidden');
        document.getElementById('show-answer-btn').classList.add('hidden');
        document.getElementById('learn-feedback-btns').classList.remove('hidden');
    };

    document.getElementById('learn-knew').onclick = () => handleLearnFeedback('knew');
    document.getElementById('learn-didnt-know').onclick = () => handleLearnFeedback('didnt-know');

    function handleLearnFeedback(status) {
        appState.userAnswers[appState.currentQuestionIndex] = status;
        if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
            appState.currentQuestionIndex++;
            renderLearn();
        } else {
            calculateResults();
        }
    }

    document.getElementById('next-question-btn').onclick = () => { appState.currentQuestionIndex++; renderQuestion(); };
    document.getElementById('prev-question-btn').onclick = () => { appState.currentQuestionIndex--; renderQuestion(); };
    document.getElementById('finish-btn').onclick = calculateResults;

    document.getElementById('theme-toggle-btn').onclick = () => {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', appState.theme);
        document.getElementById('theme-icon').textContent = appState.theme === 'dark' ? 'light_mode' : 'dark_mode';
    };

    document.getElementById('lang-toggle-btn').onclick = () => {
        appState.language = appState.language === 'tr' ? 'en' : 'tr';
        document.getElementById('lang-toggle-btn').textContent = appState.language.toUpperCase();
        updateUIText();
        if (appState.currentView === 'sessionSetup') renderSetup();
    };

    function updateUIText() {
        const lang = appState.language;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
    }

    document.querySelectorAll('.back-to-lectures').forEach(b => b.onclick = () => switchView('lectureSelection'));
    document.querySelectorAll('.back-to-modes').forEach(b => b.onclick = () => switchView('modeSelection'));

    init();
});