//js/ui.js
import { state } from './state.js';
import { translations } from './translations.js';

const views = {
    login: document.getElementById('login-view'),
    lectureSelection: document.getElementById('lecture-selection-view'),
    modeSelection: document.getElementById('mode-selection-view'),
    sessionSetup: document.getElementById('session-setup-view'),
    question: document.getElementById('question-view'),
    learn: document.getElementById('learn-view'),
    readMode: document.getElementById('read-mode-view'),
    results: document.getElementById('results-view')
};

/**
 * Belirtilen görünümü aktif eder, diğerlerini gizler.
 */
export function switchView(id) {
    console.log(`[View Switch] Hedef: ${id}`);
    Object.values(views).forEach(v => v?.classList.remove('active'));
    if (views[id]) {
        views[id].classList.add('active');
        state.currentView = id;
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.classList.toggle('hidden', id === 'login');
}

/**
 * Sayfadaki data-key değerine sahip tüm metinleri dile göre günceller.
 */
export function updateUIText() {
    const lang = state.language;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
}

/**
 * Ders seçim ekranındaki buton listesini oluşturur.
 */
export function renderLectureList(onSelectCallback) {
    const container = document.getElementById('lecture-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    state.lectures.forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'lecture-btn';
        btn.innerHTML = `
            <h3>${l.title}</h3>
            <p>${state.language === 'tr' ? 'Çalışmaya başlamak için dokunun' : 'Tap to start studying'}</p>
        `;
        btn.onclick = () => onSelectCallback(l);
        container.appendChild(btn);
    });
}

/**
 * Test ve Pratik modları için soru ve şıkları ekrana basar.
 */
export function renderQuestionUI(onChoiceCallback) {
    const q = state.activeQuestions[state.currentQuestionIndex];
    if (!q) return;

    document.getElementById('question-counter').textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;
    document.getElementById('question-text').textContent = q.question;

    const container = document.getElementById('question-options-container');
    container.innerHTML = '';
    const userAns = state.userAnswers[state.currentQuestionIndex];
    const answered = userAns !== null;

    q.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = `option-label ${answered ? 'answered' : ''}`;
        div.textContent = opt;

        if (answered) {
            if (opt === q.correctAnswer) div.classList.add('correct-highlight');
            if (opt === userAns && opt !== q.correctAnswer) div.classList.add('wrong-highlight');
        } else {
            div.onclick = () => onChoiceCallback(opt);
        }
        container.appendChild(div);
    });

    document.getElementById('prev-question-btn')?.classList.toggle('hidden', state.currentQuestionIndex === 0);
    const isLast = state.currentQuestionIndex === state.activeQuestions.length - 1;
    document.getElementById('next-question-btn')?.classList.toggle('hidden', !answered || isLast);
    document.getElementById('finish-btn')?.classList.toggle('hidden', !answered || !isLast);
}

/**
 * Ezber modu (Flashcard) içeriğini günceller.
 */
export function renderLearnUI() {
    const q = state.activeQuestions[state.currentQuestionIndex];
    if (!q) return;

    document.getElementById('learn-counter').textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;
    document.getElementById('learn-question').textContent = q.question;
    
    const ansEl = document.getElementById('learn-answer');
    ansEl.innerHTML = q.correctAnswer;
    ansEl.classList.add('hidden');
    
    document.getElementById('show-answer-btn')?.classList.remove('hidden');
    document.getElementById('learn-feedback-btns')?.classList.add('hidden');
}

/**
 * Okuma Modu: Soruları ve cevapları kutulu bir liste halinde sunar.
 */
export function renderReadList() {
    const container = document.getElementById('read-mode-list');
    if (!container) return;

    container.innerHTML = '';
    state.activeQuestions.forEach((q, i) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.borderLeft = "4px solid var(--primary-color)";
        
        card.innerHTML = `
            <span class="box-question">${i + 1}. ${q.question}</span>
            <div class="box-answer">
                ${q.correctAnswer}
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Sonuç Ekranı: Kullanıcı cevaplarını, doğruları ve puanı kutulu tasarımda gösterir.
 */
export function renderResultsUI() {
    let score = 0;
    const listContainer = document.getElementById('result-details-container');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    state.activeQuestions.forEach((q, i) => {
        const userAns = state.userAnswers[i];
        const isCorrect = (state.currentMode === 'learn') ? userAns === 'knew' : userAns === q.correctAnswer;
        
        if (isCorrect) score++;

        const card = document.createElement('div');
        card.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Kullanıcı cevabı metni (Ezber modu vs Test modu)
        let displayUserAns = userAns;
        if (state.currentMode === 'learn') {
            displayUserAns = (userAns === 'knew') ? translations[state.language].knewItLabel : translations[state.language].didntKnowLabel;
        } else if (!userAns) {
            displayUserAns = translations[state.language].notAnsweredLabel;
        }

        card.innerHTML = `
            <span class="box-question">${i + 1}. ${q.question}</span>
            <div class="box-answer" style="background: ${isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'}; color: ${isCorrect ? 'var(--green-color)' : 'var(--red-color)'}; border-color: ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}">
                <strong>${translations[state.language].yourAnswerLabel}:</strong> ${displayUserAns}
            </div>
            ${!isCorrect ? `
                <div class="box-answer" style="margin-top: 0.5rem;">
                    <strong>${translations[state.language].correctAnswerLabel}:</strong> ${q.correctAnswer}
                </div>
            ` : ''}
        `;
        listContainer.appendChild(card);
    });

    // Nihai Puan Tablosu
    const scoreEl = document.getElementById('result-score');
    const percentEl = document.getElementById('result-percentage');
    
    if (scoreEl) scoreEl.textContent = `${score} / ${state.activeQuestions.length}`;
    if (percentEl) {
        const percent = Math.round((score / state.activeQuestions.length) * 100);
        percentEl.textContent = `%${percent} ${state.language === 'tr' ? 'Başarı' : 'Success'}`;
    }
}