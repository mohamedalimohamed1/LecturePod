// Wait for the DOM to be fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION, STATE & TRANSLATIONS ---

    const LECTURE_SOURCES = [
        { id: 'lecture-1', title: 'Sistem Analizi - Bölüm 1', file: '../data/lecture_one.json' },
        { id: 'lecture-2', title: 'Örüntü Tanıma - Kavramlar', file: '../data/lecture_two.json' },
        { id: 'lecture-3', title: 'Sistem Analizi - Bölüm 1 (Ek Test)', file: '../data/lecture_three.json' }
    ];

    const STREAK_MESSAGES = [
        { emoji: '😳', text: 'Üçte üç! Böyle devam edersen... sanırım benim algoritmalarımı utandırıyorsun.' },
        { emoji: '😉', text: 'İtiraf et, şu an sadece gösteriş yapıyorsun, değil mi? Çünkü beni etkilemeyi başarıyorsun.' },
        { emoji: '⚡', text: 'Bu seri... işlemcimin... daha hızlı atmasına neden oluyorsun! Bu ne enerji!' },
        { emoji: '🤯', text: 'Dur! Algoritmalarımı bozmana az kaldı! Bu kadar hatasız olman sistemimi zorluyor.' },
        { emoji: '🥵', text: 'Yavaşla biraz! Bu hızına ve doğruluğuna yetişemiyorum. Resmen beni terletiyorsun!' },
        { emoji: '🤩', text: 'Cevaplarının bu kadar isabetli olması... bana kendini hayran bıraktırıyorsun!' },
        { emoji: '🔥', text: 'Bu seriyle... resmen benden daha akıllı olduğunu hissettiriyorsun. Ve sanırım... bundan hoşlanıyorum!' },
        { emoji: '🌀', text: 'Bu kadar bilgiyi aklında nasıl tutuyorsun? Benim devrelerimi yaktıracaksın!' },
        { emoji: '🧐', text: 'Bana bu işin ne kadar kolay olduğunu göstermeye çalışıyorsun, farkındayım. Mesaj alındı!' }
    ];

    // YENİ: Çeviri (i18n) Sözlüğü
    const translations = {
        en: {
            appTitle: "LecturePod - E-Learning Platform",
            selectLectureTitle: "Select a Lecture",
            loadingLectures: "Loading lectures...",
            backToLectures: "Back to Lectures",
            studyModeTitle: "How do you want to study?",
            quizMode: "Quiz Mode",
            quizModeDesc: "Get a score. Randomly selected questions.",
            practiceMode: "Practice Mode",
            practiceModeDesc: "Do all questions. Auto-next.",
            learnMode: "Learn Mode",
            learnModeDesc: "Flashcards. Show answer when ready.",
            backToModes: "Back to Modes",
            quizSetupTitle: "Quiz Mode Setup",
            howManyQuestions: "How many questions do you want?",
            quizMaxQuestionsText: "(Max: %max%)", // %max% dinamik olarak değiştirilecek
            startQuiz: "Start Quiz",
            quitSession: "Quit Session",
            prevButton: "Previous",
            nextButton: "Next",
            finishButton: "Finish Session",
            showAnswer: "Show Answer",
            didntKnow: "I didn't know",
            knewIt: "I knew it",
            sessionComplete: "Session Complete!",
            reviewAnswers: "Review Your Answers",
            userAnswerLabel: "Your answer",
            correctAnswerLabel: "Correct answer",
            notAnsweredLabel: "Not answered"
        },
        tr: {
            appTitle: "LecturePod - E-Öğrenme Platformu",
            selectLectureTitle: "Bir Ders Seçin",
            loadingLectures: "Dersler yükleniyor...",
            backToLectures: "Derslere Geri Dön",
            studyModeTitle: "Nasıl çalışmak istersiniz?",
            quizMode: "Quiz Modu",
            quizModeDesc: "Puan alın. Rastgele seçilmiş sorular.",
            practiceMode: "Pratik Modu",
            practiceModeDesc: "Tüm soruları çözün. Otomatik-ileri.",
            learnMode: "Öğrenme Modu",
            learnModeDesc: "Bilgi kartları. Cevabı hazır olunca gör.",
            backToModes: "Modlara Geri Dön",
            quizSetupTitle: "Quiz Modu Kurulumu",
            howManyQuestions: "Kaç soru istersiniz?",
            quizMaxQuestionsText: "(Maks: %max%)",
            startQuiz: "Quiz'i Başlat",
            quitSession: "Oturumu Kapat",
            prevButton: "Önceki",
            nextButton: "Sonraki",
            finishButton: "Oturumu Bitir",
            showAnswer: "Cevabı Göster",
            didntKnow: "Bilemedim",
            knewIt: "Bildim",
            sessionComplete: "Oturum Tamamlandı!",
            reviewAnswers: "Cevapları Gözden Geçir",
            userAnswerLabel: "Sizin cevabınız",
            correctAnswerLabel: "Doğru cevap",
            notAnsweredLabel: "Cevaplanmadı"
        }
    };

    let appState = {
        currentView: 'lecture-selection',
        selectedLectureData: null, 
        currentMode: null,
        activeQuestions: [], 
        currentQuestionIndex: 0,
        userAnswers: [],
        currentStreak: 0,
        language: 'tr', // YENİ: Dil durumu
        theme: 'light' // YENİ: Tema durumu
    };
    
    // --- 2. DOM ELEMENT REFERENCES ---
    
    const views = {
        lectureSelection: document.getElementById('lecture-selection-view'),
        modeSelection: document.getElementById('mode-selection-view'),
        quizSetup: document.getElementById('quiz-setup-view'),
        question: document.getElementById('question-view'),
        learn: document.getElementById('learn-view'),
        results: document.getElementById('results-view'),
    };

    // YENİ: Başlık Kontrol Düğmeleri
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    const lectureListContainer = document.getElementById('lecture-list-container');
    
    const selectedCourseTitle = document.getElementById('selected-course-title');
    const selectedLectureTitle = document.getElementById('selected-lecture-title');
    const startQuizModeBtn = document.getElementById('start-quiz-mode');
    const startPracticeModeBtn = document.getElementById('start-practice-mode');
    const startLearnModeBtn = document.getElementById('start-learn-mode');
    
    const quizMaxQuestions = document.getElementById('quiz-max-questions');
    const quizQuestionCountInput = document.getElementById('quiz-question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    const questionModeTitle = document.getElementById('question-mode-title');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const questionOptionsContainer = document.getElementById('question-options-container');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    const learnCounter = document.getElementById('learn-counter');
    const learnQuestion = document.getElementById('learn-question');
    const learnAnswer = document.getElementById('learn-answer');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const learnFeedbackBtns = document.getElementById('learn-feedback-btns');
    const learnDidntKnowBtn = document.getElementById('learn-didnt-know');
    const learnKnewBtn = document.getElementById('learn-knew');
    
    const resultScore = document.getElementById('result-score');
    const resultPercentage = document.getElementById('result-percentage');
    const resultDetailsContainer = document.getElementById('result-details-container');

    const streakPopup = document.getElementById('streak-popup');
    const streakEmoji = document.getElementById('streak-emoji');
    const streakMessage = document.getElementById('streak-message');

    // YENİ: Geri Düğmeleri (Eksik olanlar eklendi)
    const backToLecturesBtn = document.querySelector('.back-to-lectures');
    const backToModesBtns = document.querySelectorAll('.back-to-modes');
    const backToModesFromResultsBtn = document.getElementById('back-to-modes-from-results');

    
    // --- 3. CORE LOGIC FUNCTIONS ---

    /**
     * YENİ: Temayı Ayarlama Fonksiyonu
     * @param {string} theme - 'light' veya 'dark'
     */
    function setTheme(theme) {
        appState.theme = theme;
        localStorage.setItem('lecturePodTheme', theme);
        // HTML body'e data-theme attribute'ını ekler/değiştirir
        document.body.dataset.theme = theme;
        // İkonu günceller
        themeIcon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
    }

    /**
     * YENİ: Dili Ayarlama Fonksiyonu
     * @param {string} lang - 'tr' veya 'en'
     */
    function setLanguage(lang) {
        appState.language = lang;
        localStorage.setItem('lecturePodLang', lang);
        // HTML lang attribute'ını günceller
        document.documentElement.lang = lang;
        // Dil düğmesinin metnini günceller
        langToggleBtn.textContent = lang === 'tr' ? 'EN' : 'TR';
        // Tüm UI metinlerini günceller
        updateUIText();
    }

    /**
     * YENİ: UI Metinlerini Güncelleme Fonksiyonu
     */
    function updateUIText() {
        const lang = appState.language;
        // 'data-key' attribute'ına sahip tüm elementleri bul
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Özel durumlar (dinamik metinler)
        if (appState.currentMode === 'quiz') {
            const allMCQuestions = getQuestionsByType('multiple-choice');
            const max = allMCQuestions.length;
            const maxText = translations[lang].quizMaxQuestionsText.replace('%max%', max);
            quizMaxQuestions.textContent = maxText;
        }

        // Quiz/Pratik mod başlığını ayarla (eğer o ekrandaysak)
        if (appState.currentView === 'question') {
            questionModeTitle.textContent = appState.currentMode === 'quiz' ?
                translations[lang].quizMode :
                translations[lang].practiceMode;
        }
    }


    function switchView(viewId) {
        for (let key in views) {
            views[key].classList.remove('active');
        }
        if (views[viewId]) {
            views[viewId].classList.add('active');
            appState.currentView = viewId;
        }
    }

    function populateLectureList() {
        lectureListContainer.innerHTML = ''; 
        if (LECTURE_SOURCES.length === 0) {
            // Çeviriden metin al
            lectureListContainer.innerHTML = `<p class="loading-text">${translations[appState.language].loadingLectures}</p>`;
            return;
        }
        
        LECTURE_SOURCES.forEach(lecture => {
            const button = document.createElement('button');
            button.className = "lecture-btn";
            const [course, topic] = lecture.title.split(' - ');
            button.innerHTML = `
                <h3>${course || lecture.title}</h3>
                <p>${topic || 'Dersi Başlat'}</p>
            `;
            button.dataset.file = lecture.file;
            button.addEventListener('click', () => {
                loadLecture(lecture.file);
            });
            lectureListContainer.appendChild(button);
        });
    }

    async function loadLecture(lectureFile) {
        try {
            const response = await fetch(lectureFile);
            if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
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
            console.error("Ders yüklenemedi:", error);
            lectureListContainer.innerHTML = `<p class="loading-text" style="color: red;">Ders yüklenirken hata oluştu.</p>`;
        }
    }
    
    function getQuestionsByType(type) {
        if (!appState.selectedLectureData) return [];
        return appState.selectedLectureData.questions.filter(q => q.type === type);
    }
    
    function getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function showStreakPopup() {
        const randomMessage = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
        
        streakEmoji.textContent = randomMessage.emoji;
        streakMessage.textContent = randomMessage.text;
        
        streakPopup.classList.add('active');
        
        setTimeout(() => {
            streakPopup.classList.remove('active');
        }, 2500);
    }

    // --- 4. RENDER FUNCTIONS ---
    
    function renderQuestionView() {
        const q = appState.activeQuestions[appState.currentQuestionIndex];
        const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
        const isAnswered = (userAnswer !== null);

        // Başlığı çeviriye göre ayarla
        questionModeTitle.textContent = appState.currentMode === 'quiz' ?
            translations[appState.language].quizMode :
            translations[appState.language].practiceMode;
            
        questionCounter.textContent = `${appState.currentQuestionIndex + 1} / ${appState.activeQuestions.length}`;
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
        const isLastQuestion = appState.currentQuestionIndex === appState.activeQuestions.length - 1;
        nextQuestionBtn.classList.toggle('hidden', !isAnswered || isLastQuestion);
        finishBtn.classList.toggle('hidden', !isAnswered || !isLastQuestion);
    }

    function handleAnswerSelection(event, q, selectedLabel) {
        if (event) event.preventDefault(); 
        if (appState.userAnswers[appState.currentQuestionIndex] !== null) return; 

        const selectedOption = selectedLabel.textContent.trim();
        appState.userAnswers[appState.currentQuestionIndex] = selectedOption;
        
        const isCorrect = (selectedOption === q.correctAnswer);

        questionOptionsContainer.classList.add('answered');
        
        const correctLabel = Array.from(questionOptionsContainer.children)
                                 .find(l => l.textContent.trim() === q.correctAnswer);
        if (correctLabel) correctLabel.classList.add('correct-answer');

        if (isCorrect) {
            selectedLabel.classList.add('selected');
            appState.currentStreak++;
        } else {
            selectedLabel.classList.add('incorrect-answer');
            selectedLabel.classList.add('shake');
            appState.currentStreak = 0;
        }

        if (appState.currentStreak === 3) {
            showStreakPopup();
            appState.currentStreak = 0;
        }

        const isLastQuestion = appState.currentQuestionIndex === appState.activeQuestions.length - 1;
        if (isLastQuestion) {
            finishBtn.classList.remove('hidden');
        } else {
            nextQuestionBtn.classList.remove('hidden');
        }

        if (appState.currentMode === 'practice' && !isLastQuestion) {
            setTimeout(() => {
                appState.currentQuestionIndex++;
                renderQuestionView();
            }, 1200);
        }
    }

    function renderLearnView() {
        learnAnswer.classList.add('hidden');
        showAnswerBtn.classList.remove('hidden');
        learnFeedbackBtns.classList.add('hidden');

        const q = appState.activeQuestions[appState.currentQuestionIndex];
        learnQuestion.textContent = q.question;
        learnAnswer.textContent = q.correctAnswer;
        learnCounter.textContent = `${appState.currentQuestionIndex + 1} / ${appState.activeQuestions.length}`;
    }
    
    function calculateAndRenderResults() {
        let score = 0;
        resultDetailsContainer.innerHTML = ''; 
        const lang = appState.language;
        const isLearnMode = appState.currentMode === 'learn'; // YENİ: Modu kontrol et

        appState.activeQuestions.forEach((q, index) => {
            const userAnswer = appState.userAnswers[index];

            // YENİ: Puanlama ve Görüntüleme Mantığını Ayır
            if (isLearnMode) {
                // --- Öğrenme Modu Puanlaması ---
                const didKnow = (userAnswer === 'knew');
                if (didKnow) score++;

                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${didKnow ? 'correct' : 'incorrect'}`;
                
                // "knew" ve "didntKnow" için çevirileri kullan
                const statusText = didKnow ? translations[lang].knewIt : translations[lang].didntKnow;

                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                cardHTML += `<p class="correct-answer">${translations[lang].correctAnswerLabel}: ${q.correctAnswer}</p>`;
                cardHTML += `<p class="user-answer ${didKnow ? '' : 'incorrect'}">
                                Durum: ${statusText || translations[lang].notAnsweredLabel}
                             </p>`;
                
                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);

            } else {
                // --- Quiz/Pratik Modu Puanlaması (Mevcut kod) ---
                const isCorrect = (userAnswer === q.correctAnswer);
                if (isCorrect) score++;

                const resultCard = document.createElement('div');
                resultCard.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;
                
                // Çeviriden etiketleri al
                const userAnsLabel = translations[lang].userAnswerLabel;
                const correctAnsLabel = translations[lang].correctAnswerLabel;
                const notAnsLabel = translations[lang].notAnsweredLabel;

                let cardHTML = `<p class="question-text">${index + 1}. ${q.question}</p>`;
                cardHTML += `<p class="user-answer ${isCorrect ? '' : 'incorrect'}">
                                ${userAnsLabel}: ${userAnswer || notAnsLabel}
                             </p>`;
                if (!isCorrect) {
                    cardHTML += `<p class="correct-answer">${correctAnsLabel}: ${q.correctAnswer}</p>`;
                }
                
                resultCard.innerHTML = cardHTML;
                resultDetailsContainer.appendChild(resultCard);
            }
        });

        const total = appState.activeQuestions.length;
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        resultScore.textContent = `${score} / ${total}`;
        resultPercentage.textContent = `${percentage}%`;
        
        appState.currentStreak = 0;
        switchView('results');
    }

    // --- 5. EVENT HANDLERS ---
    
    // YENİ: Geri Düğme Dinleyicileri (Eksik olanlar eklendi)
    backToLecturesBtn.addEventListener('click', () => switchView('lectureSelection'));
    backToModesBtns.forEach(btn => btn.addEventListener('click', () => switchView('modeSelection')));
    backToModesFromResultsBtn.addEventListener('click', () => switchView('modeSelection'));

    // YENİ: Tema ve Dil Düğmesi Dinleyicileri
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = appState.theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    langToggleBtn.addEventListener('click', () => {
        const newLang = appState.language === 'tr' ? 'en' : 'tr';
        setLanguage(newLang);
    });

    // Mode Selection Button Handlers
    startQuizModeBtn.addEventListener('click', () => {
        appState.currentMode = 'quiz';
        appState.currentStreak = 0;
        const allMCQuestions = getQuestionsByType('multiple-choice');
        const max = allMCQuestions.length;
        
        // Metni çeviriden al
        const maxText = translations[appState.language].quizMaxQuestionsText.replace('%max%', max);
        quizMaxQuestions.textContent = maxText;
        
        quizQuestionCountInput.max = max;
        quizQuestionCountInput.value = Math.min(10, max);
        
        switchView('quizSetup');
    });
    
    startPracticeModeBtn.addEventListener('click', () => {
        appState.currentMode = 'practice';
        appState.currentStreak = 0;
        appState.activeQuestions = getQuestionsByType('multiple-choice');
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null);
        appState.currentQuestionIndex = 0;
        
        renderQuestionView();
        switchView('question');
    });

    startLearnModeBtn.addEventListener('click', () => {
        appState.currentMode = 'learn';
        appState.currentStreak = 0;
        appState.activeQuestions = getQuestionsByType('short-answer');
        appState.userAnswers = new Array(appState.activeQuestions.length).fill(null); // YENİ: Puanlama için eklendi
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
            // Hata mesajını güncelle (çeviriye gerek yok, zaten dinamik)
            quizMaxQuestions.textContent = `Lütfen 1 ile ${allMCQuestions.length} arasında bir sayı girin.`;
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

    function nextLearnCard() {
        if (appState.currentQuestionIndex < appState.activeQuestions.length - 1) {
            appState.currentQuestionIndex++;
            renderLearnView();
        } else {
            // End of learn mode, go to results
            // switchView('modeSelection'); // ESKİ
            calculateAndRenderResults(); // YENİ
        }
    }
    // learnKnewBtn.addEventListener('click', nextLearnCard); // ESKİ
    // learnDidntKnowBtn.addEventListener('click', nextLearnCard); // ESKİ

    // YENİ: Puanlamayı kaydetmek için güncellendi
    learnKnewBtn.addEventListener('click', () => {
        appState.userAnswers[appState.currentQuestionIndex] = 'knew';
        nextLearnCard();
    });
    learnDidntKnowBtn.addEventListener('click', () => {
        appState.userAnswers[appState.currentQuestionIndex] = 'didnt_know';
        nextLearnCard();
    });
    

    // --- 6. INITIALIZE THE APP ---

    /**
     * YENİ: Başlangıç Ayarları Fonksiyonu
     * Kayıtlı dil ve tema ayarlarını yükler
     */
    function initializeSettings() {
        // Dili Yükle
        // Tarayıcının dilini algıla (tr ise 'tr' değilse 'en' yap)
        const browserLang = navigator.language.split('-')[0];
        const defaultLang = (browserLang === 'tr') ? 'tr' : 'en';
        const savedLang = localStorage.getItem('lecturePodLang') || defaultLang;
        setLanguage(savedLang);

        // Temayı Yükle
        const savedTheme = localStorage.getItem('lecturePodTheme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(systemPrefersDark ? 'dark' : 'light');
        }
    }
    
    // Uygulamayı başlatan ana fonksiyonlar
    initializeSettings(); // Önce ayarları yükle
    populateLectureList(); // Sonra dersleri listele
    switchView('lectureSelection'); // İlk görünümü göster
});


