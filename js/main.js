// FIXED: BUG-3
import { state } from './state.js';
import { performLogin, performLogout } from './auth.js';
import {
    switchView,
    updateUIText,
    renderLectureList,
    renderReadList,
    renderQuestionUI,
    renderLearnUI,
    renderResultsUI
} from './ui.js';
import { fetchLectureData, prepareActiveQuestions } from './engine.js';
import { showNotification } from './utils/ui-helpers.js';
import { POSITIVE_STREAK_MESSAGES, NEGATIVE_STREAK_MESSAGES } from './messages.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (performLogin(username, password)) {
                showNotification(state.language === 'tr' ? 'Hoş Geldiniz!' : 'Welcome!', 'success');
                initDashboard();
            } else {
                showNotification(state.language === 'tr' ? 'Giriş Başarısız!' : 'Login Failed!', 'error');
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
                showNotification(state.language === 'tr' ? 'Veri formatı hatalı!' : 'Data format error!', 'error');
            }
        });
    }

    ['read', 'quiz', 'practice', 'learn'].forEach((mode) => {
        const button = document.getElementById(`start-${mode}-mode`);
        if (!button) {
            return;
        }

        button.onclick = () => {
            state.currentMode = mode;
            state.rangeType = 'all';

            if (mode === 'quiz' || mode === 'practice' || mode === 'learn') {
                renderSetupArea();
                switchView('sessionSetup');
            } else {
                startSession();
            }
        };
    });

    function renderSetupArea() {
        const area = document.getElementById('setup-config-area');
        if (!area || !state.selectedLectureData) {
            return;
        }

        let total = 0;
        const questionList = state.selectedLectureData.questions;

        if (state.currentMode === 'quiz' || state.currentMode === 'practice') {
            total = questionList.filter((question) => question.type === 'multiple-choice').length;
        } else if (state.currentMode === 'learn') {
            total = questionList.filter(
                (question) => question.type === 'short-answer' || question.type === 'multiple-choice'
            ).length;
        } else {
            total = questionList.length;
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

    document.querySelectorAll('.setup-opt-btn').forEach((button) => {
        button.onclick = () => {
            document.querySelectorAll('.setup-opt-btn').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            state.rangeType = button.dataset.value;
            renderSetupArea();
        };
    });

    const finalStartButton = document.getElementById('final-start-btn');
    if (finalStartButton) {
        finalStartButton.onclick = () => startSession();
    }

    function startSession() {
        const options = {};

        if (state.rangeType === 'random') {
            options.randomCount = parseInt(document.getElementById('setup-count')?.value ?? 10, 10);
        } else if (state.rangeType === 'range') {
            options.rangeStart = parseInt(document.getElementById('range-start')?.value ?? 1, 10);
            options.rangeEnd = parseInt(document.getElementById('range-end')?.value ?? 999, 10);
        }

        if (prepareActiveQuestions(options)) {
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
            showNotification(
                state.language === 'tr' ? 'Bu mod için uygun soru bulunamadı!' : 'No eligible questions found for this mode!',
                'error'
            );
        }
    }

    function handleAnswer(choice) {
        if (state.userAnswers[state.currentQuestionIndex] !== null) {
            return;
        }

        state.userAnswers[state.currentQuestionIndex] = choice;
        const currentQuestion = state.activeQuestions[state.currentQuestionIndex];
        const isCorrect = choice === currentQuestion.correctAnswer;

        renderQuestionUI(handleAnswer);
        handleStreak(isCorrect);

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
                const randomMessage = POSITIVE_STREAK_MESSAGES[
                    Math.floor(Math.random() * POSITIVE_STREAK_MESSAGES.length)
                ];
                triggerStreakPopup('🔥', `${state.successStreak} Seri: ${randomMessage}`);
            }
        } else {
            state.failureStreak = (state.failureStreak || 0) + 1;
            state.successStreak = 0;

            if (state.failureStreak >= 2) {
                const randomMessage = NEGATIVE_STREAK_MESSAGES[
                    Math.floor(Math.random() * NEGATIVE_STREAK_MESSAGES.length)
                ];
                triggerStreakPopup('🧊', randomMessage, true);
            }
        }
    }

    function triggerStreakPopup(emoji, message, isFailure = false) {
        const popup = document.getElementById('streak-popup');
        const emojiElement = document.getElementById('streak-emoji');
        const messageElement = document.getElementById('streak-message');

        if (!popup || !emojiElement || !messageElement) {
            return;
        }

        emojiElement.textContent = emoji;
        messageElement.textContent = message;
        popup.classList.toggle('failure', isFailure);
        popup.classList.add('active');
        setTimeout(() => popup.classList.remove('active'), 2500);
    }

    const nextQuestionButton = document.getElementById('next-question-btn');
    if (nextQuestionButton) {
        nextQuestionButton.onclick = () => {
            if (state.currentQuestionIndex < state.activeQuestions.length - 1) {
                state.currentQuestionIndex++;
                renderQuestionUI(handleAnswer);
            }
        };
    }

    const prevQuestionButton = document.getElementById('prev-question-btn');
    if (prevQuestionButton) {
        prevQuestionButton.onclick = () => {
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
                renderQuestionUI(handleAnswer);
            }
        };
    }

    const finishButton = document.getElementById('finish-btn');
    if (finishButton) {
        finishButton.onclick = () => {
            renderResultsUI();
            switchView('results');
        };
    }

    document.querySelectorAll('.finish-early-trigger').forEach((button) => {
        button.onclick = () => {
            const message = state.language === 'tr'
                ? 'Oturumu bitirip sonuçları görmek istiyor musunuz?'
                : 'Finish and see results?';

            if (confirm(message)) {
                renderResultsUI();
                switchView('results');
            }
        };
    });

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.onclick = performLogout;
    }

    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (themeToggleButton) {
        themeToggleButton.onclick = () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            document.getElementById('theme-icon').textContent = state.theme === 'dark' ? 'light_mode' : 'dark_mode';
        };
    }

    const langButton = document.getElementById('lang-toggle-btn');
    if (langButton) {
        langButton.onclick = () => {
            state.language = state.language === 'tr' ? 'en' : 'tr';
            langButton.textContent = state.language.toUpperCase();
            updateUIText();

            if (state.currentView === 'lectureSelection') {
                renderLectureList(async (lecture) => {
                    const data = await fetchLectureData(lecture.file);
                    if (data && data.questions) {
                        state.selectedLectureData = data;
                        document.getElementById('selected-course-title').textContent = data.courseTitle;
                        switchView('modeSelection');
                    } else {
                        showNotification(state.language === 'tr' ? 'Veri formatı hatalı!' : 'Data format error!', 'error');
                    }
                });
            }

            if (state.currentView === 'sessionSetup') {
                renderSetupArea();
            }
        };
    }

    const showAnswerButton = document.getElementById('show-answer-btn');
    if (showAnswerButton) {
        showAnswerButton.onclick = () => {
            const answerBox = document.querySelector('.learn-box-answer');
            const feedback = document.getElementById('learn-feedback-btns');

            if (answerBox) {
                answerBox.classList.remove('hidden');
            }

            showAnswerButton.classList.add('hidden');

            if (feedback) {
                feedback.classList.remove('hidden');
            }
        };
    }

    const learnKnewButton = document.getElementById('learn-knew');
    const learnDidntKnowButton = document.getElementById('learn-didnt-know');

    if (learnKnewButton) {
        learnKnewButton.onclick = () => handleLearnNext(true);
    }

    if (learnDidntKnowButton) {
        learnDidntKnowButton.onclick = () => handleLearnNext(false);
    }

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

    document.querySelectorAll('.back-to-lectures').forEach((button) => {
        button.onclick = () => switchView('lectureSelection');
    });

    document.querySelectorAll('.back-to-modes').forEach((button) => {
        button.onclick = () => switchView('modeSelection');
    });

    updateUIText();
    switchView('login');
});
