//js/main.js
import { state } from './state.js';
import { performLogin, performLogout } from './auth.js';
import { switchView, updateUIText, renderLectureList, renderReadList, renderQuestionUI, renderLearnUI, renderResultsUI } from './ui.js';
import { fetchLectureData, prepareActiveQuestions } from './engine.js';
import { showNotification } from './utils/ui-helpers.js';
import { POSITIVE_STREAK_MESSAGES, NEGATIVE_STREAK_MESSAGES } from './messages.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GİRİŞ ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (performLogin(u, p)) {
                showNotification(state.language === 'tr' ? "Hoş Geldiniz!" : "Welcome!", "success");
                initDashboard();
            } else {
                showNotification(state.language === 'tr' ? "Giriş Başarısız!" : "Login Failed!", "error");
            }
        };
    }

    function initDashboard() {
        switchView('lectureSelection');
        renderLectureList(async (lecture) => {
            const data = await fetchLectureData(lecture.file);
            if (data && data.questions) {
                state.selectedLectureData = data;
                document.getElementById('selected-course-title').textContent = data.courseTitle;
                switchView('modeSelection');
            } else {
                showNotification(state.language === 'tr' ? "Veri formatı hatalı!" : "Data format error!", "error");
            }
        });
    }

    // --- 2. MOD SEÇİMİ ---
    ['read', 'quiz', 'practice', 'learn'].forEach(mode => {
        const btn = document.getElementById(`start-${mode}-mode`);
        if (btn) {
            btn.onclick = () => {
                state.currentMode = mode;
                state.rangeType = 'all';
                
                // Kurulum ekranına gitmeden önce mod bazlı limitleri ayarla
                if (mode === 'quiz' || mode === 'practice') {
                    renderSetupArea();
                    switchView('sessionSetup');
                } else if (mode === 'learn') {
                    renderSetupArea(); // Ezber modu için de aralık seçilebilmeli
                    switchView('sessionSetup');
                } else {
                    startSession();
                }
            };
        }
    });

    function renderSetupArea() {
        const area = document.getElementById('setup-config-area');
        if(!area || !state.selectedLectureData) return;
        
        // Filtrelenmiş toplam soru sayısını hesapla
        let total = 0;
        const qList = state.selectedLectureData.questions;
        if (state.currentMode === 'quiz' || state.currentMode === 'practice') {
            total = qList.filter(q => q.type === 'multiple-choice').length;
        } else if (state.currentMode === 'learn') {
            total = qList.filter(q => q.type === 'short-answer' || q.type === 'multiple-choice').length;
        } else {
            total = qList.length;
        }
        
        if (state.rangeType === 'random') {
            area.innerHTML = `<label style="display:block; margin-bottom:8px; font-size:0.9rem; font-weight:700;">${state.language === 'tr' ? 'Soru Sayısı Seçin:' : 'Select Question Count:'}</label>
                              <input type="number" id="setup-count" value="${Math.min(10, total)}" min="1" max="${total}">`;
        } else if (state.rangeType === 'range') {
            area.innerHTML = `<div style="display:flex; gap:10px; justify-content:center;">
                                <div><label style="font-size:0.85rem;">${state.language === 'tr' ? 'Başlangıç:' : 'Start:'}</label><input type="number" id="range-start" value="1"></div>
                                <div><label style="font-size:0.85rem;">${state.language === 'tr' ? 'Bitiş:' : 'End:'}</label><input type="number" id="range-end" value="${total}"></div>
                              </div>`;
        } else {
            area.innerHTML = `<p style="text-align:center; font-size:0.9rem; font-weight:700; color:var(--primary-color);">${total} ${state.language === 'tr' ? 'uygun soru yüklenecek.' : 'eligible questions will be loaded.'}</p>`;
        }
    }

    document.querySelectorAll('.setup-opt-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.setup-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.rangeType = btn.dataset.value;
            renderSetupArea();
        };
    });

    // --- 3. OTURUM BAŞLATMA ---
    const finalStartBtn = document.getElementById('final-start-btn');
    if (finalStartBtn) finalStartBtn.onclick = () => startSession();

    function startSession() {
        if (prepareActiveQuestions()) {
            if (state.currentMode === 'read') {
                renderReadList();
                switchView('readMode');
            } else if (state.currentMode === 'learn') {
                renderLearnUI();
                switchView('learn');
            } else {
                renderQuestionUI(handleAnswer);
                switchView('question');
            }
        } else {
            showNotification(state.language === 'tr' ? "Bu mod için uygun soru bulunamadı!" : "No eligible questions found for this mode!", "error");
        }
    }

    function handleAnswer(choice) {
        if (state.userAnswers[state.currentQuestionIndex] !== null) return;
        
        state.userAnswers[state.currentQuestionIndex] = choice;
        const currentQ = state.activeQuestions[state.currentQuestionIndex];
        const isCorrect = choice === currentQ.correctAnswer;

        renderQuestionUI(handleAnswer);
        handleStreak(isCorrect);

        // Pratik modunda otomatik geçiş yapalım, Test modunda kullanıcı 'Sonraki'ye basar
        if (state.currentMode === 'practice' && state.currentQuestionIndex < state.activeQuestions.length - 1) {
            setTimeout(() => {
                state.currentQuestionIndex++;
                renderQuestionUI(handleAnswer);
            }, 1000);
        }
    }

    function handleStreak(isCorrect) {
        if (isCorrect) {
            state.successStreak = (state.successStreak || 0) + 1;
            state.failureStreak = 0;
            if (state.successStreak >= 3) {
                const randomMsg = POSITIVE_STREAK_MESSAGES[Math.floor(Math.random() * POSITIVE_STREAK_MESSAGES.length)];
                triggerStreakPopup("🔥", `${state.successStreak} Seri: ${randomMsg}`);
            }
        } else {
            state.failureStreak = (state.failureStreak || 0) + 1;
            state.successStreak = 0;
            if (state.failureStreak >= 2) {
                const randomMsg = NEGATIVE_STREAK_MESSAGES[Math.floor(Math.random() * NEGATIVE_STREAK_MESSAGES.length)];
                triggerStreakPopup("🧊", randomMsg, true);
            }
        }
    }

    function triggerStreakPopup(emoji, message, isFailure = false) {
        const popup = document.getElementById('streak-popup');
        const emojiEl = document.getElementById('streak-emoji');
        const msgEl = document.getElementById('streak-message');
        if (!popup || !emojiEl || !msgEl) return;

        emojiEl.textContent = emoji;
        msgEl.textContent = message;
        popup.classList.toggle('failure', isFailure);
        popup.classList.add('active');
        setTimeout(() => popup.classList.remove('active'), 2500);
    }

    // --- 4. NAVİGASYON ---
    document.getElementById('next-question-btn').onclick = () => {
        if (state.currentQuestionIndex < state.activeQuestions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestionUI(handleAnswer);
        }
    };

    document.getElementById('prev-question-btn').onclick = () => {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestionUI(handleAnswer);
        }
    };

    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) {
        finishBtn.onclick = () => {
            renderResultsUI();
            switchView('results');
        };
    }

    document.querySelectorAll('.finish-early-trigger').forEach(btn => {
        btn.onclick = () => {
            const msg = state.language === 'tr' ? "Oturumu bitirip sonuçları görmek istiyor musunuz?" : "Finish and see results?";
            if(confirm(msg)) {
                renderResultsUI();
                switchView('results');
            }
        };
    });

    document.getElementById('logout-btn').onclick = performLogout;
    
    document.getElementById('theme-toggle-btn').onclick = () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        document.getElementById('theme-icon').textContent = state.theme === 'dark' ? 'light_mode' : 'dark_mode';
    };

    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.onclick = () => {
            state.language = state.language === 'tr' ? 'en' : 'tr';
            langBtn.textContent = state.language.toUpperCase();
            updateUIText();
            if (state.currentView === 'lectureSelection') renderLectureList(initDashboard);
            if (state.currentView === 'sessionSetup') renderSetupArea();
        };
    }

    const showAnsBtn = document.getElementById('show-answer-btn');
    if (showAnsBtn) {
        showAnsBtn.onclick = () => {
            const box = document.querySelector('.learn-box-answer');
            const feedback = document.getElementById('learn-feedback-btns');
            if(box) box.classList.remove('hidden');
            showAnsBtn.classList.add('hidden');
            if(feedback) feedback.classList.remove('hidden');
        };
    }

    const learnKnew = document.getElementById('learn-knew');
    const learnDidnt = document.getElementById('learn-didnt-know');

    if (learnKnew) learnKnew.onclick = () => handleLearnNext(true);
    if (learnDidnt) learnDidnt.onclick = () => handleLearnNext(false);

    function handleLearnNext(knewIt) {
        state.userAnswers[state.currentQuestionIndex] = knewIt ? 'knew' : 'didnt-know';
        handleStreak(knewIt);

        if (state.currentQuestionIndex < state.activeQuestions.length - 1) {
            state.currentQuestionIndex++;
            renderLearnUI();
        } else {
            renderResultsUI();
            switchView('results');
        }
    }

    document.querySelectorAll('.back-to-lectures').forEach(b => b.onclick = () => switchView('lectureSelection'));
    document.querySelectorAll('.back-to-modes').forEach(b => b.onclick = () => switchView('modeSelection'));

    updateUIText();
    switchView('login');
});