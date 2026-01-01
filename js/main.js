//js/main.js
import { state } from './state.js';
import { performLogin, performLogout } from './auth.js';
import { switchView, updateUIText, renderLectureList, renderReadList, renderQuestionUI, renderLearnUI, renderResultsUI } from './ui.js';
import { fetchLectureData, prepareActiveQuestions } from './engine.js';
import { showNotification } from './utils/ui-helpers.js';

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
                
                if (mode === 'quiz') {
                    state.rangeType = 'all';
                    renderSetupArea();
                    switchView('sessionSetup');
                } else {
                    state.rangeType = 'all';
                    startSession();
                }
            };
        }
    });

    function renderSetupArea() {
        const area = document.getElementById('setup-config-area');
        if(!area || !state.selectedLectureData) return;
        const total = state.selectedLectureData.questions.length;
        
        if (state.rangeType === 'random') {
            area.innerHTML = `<label style="display:block; margin-bottom:8px; font-size:0.9rem; font-weight:700;">${state.language === 'tr' ? 'Soru Sayısı Seçin:' : 'Select Question Count:'}</label>
                              <input type="number" id="setup-count" value="10" min="1" max="${total}">`;
        } else if (state.rangeType === 'range') {
            area.innerHTML = `<div style="display:flex; gap:10px;">
                                <div><label style="font-size:0.85rem;">${state.language === 'tr' ? 'Başlangıç:' : 'Start:'}</label><input type="number" id="range-start" value="1"></div>
                                <div><label style="font-size:0.85rem;">${state.language === 'tr' ? 'Bitiş:' : 'End:'}</label><input type="number" id="range-end" value="${total}"></div>
                              </div>`;
        } else {
            area.innerHTML = `<p style="text-align:center; font-size:0.9rem; font-weight:700; color:var(--primary-color);">${total} ${state.language === 'tr' ? 'sorunun tamamı yüklenecek.' : 'questions will be loaded.'}</p>`;
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
        }
    }

    function handleAnswer(choice) {
        state.userAnswers[state.currentQuestionIndex] = choice;
        renderQuestionUI(handleAnswer);
        
        if (state.currentMode === 'practice' && state.currentQuestionIndex < state.activeQuestions.length - 1) {
            setTimeout(() => {
                state.currentQuestionIndex++;
                renderQuestionUI(handleAnswer);
            }, 800);
        }
    }

    // --- 4. NAVİGASYON VE DİĞERLERİ ---
    document.getElementById('next-question-btn').onclick = () => {
        state.currentQuestionIndex++;
        renderQuestionUI(handleAnswer);
    };

    document.getElementById('prev-question-btn').onclick = () => {
        state.currentQuestionIndex--;
        renderQuestionUI(handleAnswer);
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
            const msg = state.language === 'tr' ? "Oturumu bitirip sonuçları görmek istiyor musunuz?" : "Do you want to finish and see results?";
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

    // DİL DEĞİŞTİRME BUTONU (DÜZELTİLDİ)
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.onclick = () => {
            state.language = state.language === 'tr' ? 'en' : 'tr';
            langBtn.textContent = state.language.toUpperCase();
            updateUIText();
            
            // Eğer ders seçim ekranındaysak listeyi de yeniden çevirerek çiz
            if (state.currentView === 'lectureSelection') {
                renderLectureList(initDashboard);
            }
            // Eğer ayar ekranındaysak ayarları yeniden çevir
            if (state.currentView === 'sessionSetup') {
                renderSetupArea();
            }
        };
    }

    const showAnsBtn = document.getElementById('show-answer-btn');
    if (showAnsBtn) {
        showAnsBtn.onclick = () => {
            const ans = document.getElementById('learn-answer');
            const feedback = document.getElementById('learn-feedback-btns');
            if(ans) ans.classList.remove('hidden');
            if(showAnsBtn) showAnsBtn.classList.add('hidden');
            if(feedback) feedback.classList.remove('hidden');
        };
    }

    const learnKnew = document.getElementById('learn-knew');
    const learnDidnt = document.getElementById('learn-didnt-know');

    if (learnKnew) learnKnew.onclick = () => handleLearnNext('knew');
    if (learnDidnt) learnDidnt.onclick = () => handleLearnNext('didnt-know');

    function handleLearnNext(status) {
        state.userAnswers[state.currentQuestionIndex] = status;
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