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
 * Metin içindeki tablo, liste ve yeni satırları algılayıp zengin HTML formatına çevirir.
 * Hücre içindeki liste elemanlarını alt alta gelecek şekilde düzenler.
 */
const formatAnswerText = (text) => {
    if (!text) return '';

    // Eğer metin zaten karmaşık HTML içeriyorsa dokunma
    if (/<[a-z][\s\S]*>/i.test(text)) return text;

    const lines = text.split('\n');
    let formattedHtml = '';
    let tableRows = [];
    let listItems = [];

    const flushTable = () => {
        if (tableRows.length === 0) return '';
        let html = '<div style="overflow-x:auto; margin: 1rem 0;"><table style="width:100%; border-collapse: collapse; border: 1px solid var(--border-color); font-size: 0.9rem;">';
        tableRows.forEach((row, i) => {
            html += `<tr style="${i === 0 ? 'background: rgba(13, 148, 235, 0.1); font-weight: bold;' : 'border-top: 1px solid var(--border-color);'}">`;
            row.forEach(cell => {
                // Hücre içindeki özel işaretleri (, •, *) bulup alt alta (br) ve mermi işaretli hale getiriyoruz
                let cellContent = cell.replace(/[•\*]/g, '<br>• ').trim();
                // Eğer başta gereksiz br oluştuysa temizle
                if (cellContent.startsWith('<br>')) cellContent = cellContent.substring(4);
                
                html += `<td style="padding: 0.6rem; border: 1px solid var(--border-color); vertical-align: top;">${cellContent}</td>`;
            });
            html += '</tr>';
        });
        html += '</table></div>';
        tableRows = [];
        return html;
    };

    const flushList = () => {
        if (listItems.length === 0) return '';
        let html = '<ul style="margin: 0.5rem 0 1rem 1.2rem; list-style-type: disc;">';
        listItems.forEach(item => { html += `<li style="margin-bottom: 0.3rem;">${item}</li>`; });
        html += '</ul>';
        listItems = [];
        return html;
    };

    lines.forEach(line => {
        const trimmed = line.trim();

        // 1. Tablo Satırı Algılama
        if (trimmed.includes('|')) {
            formattedHtml += flushList();
            const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
            if (cells.length > 1) {
                tableRows.push(cells);
                return;
            }
        }

        // 2. Liste Öğesi Algılama (Dış liste)
        if (/^[•\*\-]\s*/.test(trimmed)) {
            formattedHtml += flushTable();
            listItems.push(trimmed.replace(/^[•\*\-]\s*/, ''));
            return;
        }

        // 3. Normal Satır
        formattedHtml += flushTable();
        formattedHtml += flushList();
        if (trimmed === '') {
            formattedHtml += '<br>';
        } else {
            formattedHtml += `<div>${trimmed.replace(/\t/g, '<span style="display:inline-block; width:20px;"></span>')}</div>`;
        }
    });

    formattedHtml += flushTable();
    formattedHtml += flushList();

    return formattedHtml;
};

export function switchView(id) {
    Object.values(views).forEach(v => v?.classList.remove('active'));
    if (views[id]) {
        views[id].classList.add('active');
        state.currentView = id;
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.classList.toggle('hidden', id === 'login');
}

export function updateUIText() {
    const lang = state.language;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
}

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

export function renderQuestionUI(onChoiceCallback) {
    const q = state.activeQuestions[state.currentQuestionIndex];
    if (!q) return;

    const counter = document.getElementById('question-counter');
    if (counter) counter.textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;
    
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

export function renderLearnUI() {
    const q = state.activeQuestions[state.currentQuestionIndex];
    if (!q) return;

    const container = document.getElementById('learn-boxed-container');
    if (!container) return;

    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;

    container.innerHTML = '';
    
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.borderLeft = "4px solid var(--primary-color)";
    
    card.innerHTML = `
        <span class="box-question">${state.currentQuestionIndex + 1}. ${q.question}</span>
        <div class="box-answer learn-box-answer hidden">
            ${formatAnswerText(q.correctAnswer)}
        </div>
    `;
    
    container.appendChild(card);
    
    document.getElementById('show-answer-btn')?.classList.remove('hidden');
    document.getElementById('learn-feedback-btns')?.classList.add('hidden');
}

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
                ${formatAnswerText(q.correctAnswer)}
            </div>
        `;
        container.appendChild(card);
    });
}

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
        
        let displayUserAns = userAns;
        if (state.currentMode === 'learn') {
            displayUserAns = (userAns === 'knew') ? translations[state.language].knewItLabel : translations[state.language].didntKnowLabel;
        } else if (!userAns) {
            displayUserAns = translations[state.language].notAnsweredLabel;
        }

        card.innerHTML = `
            <span class="box-question">${i + 1}. ${q.question}</span>
            <div class="box-answer" style="background: ${isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'}; color: ${isCorrect ? 'var(--green-color)' : 'var(--red-color)'}; border-color: ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}">
                <strong>${translations[state.language].yourAnswerLabel}:</strong> ${formatAnswerText(displayUserAns)}
            </div>
            ${!isCorrect ? `
                <div class="box-answer" style="margin-top: 0.5rem;">
                    <strong>${translations[state.language].correctAnswerLabel}:</strong> ${formatAnswerText(q.correctAnswer)}
                </div>
            ` : ''}
        `;
        listContainer.appendChild(card);
    });

    const scoreEl = document.getElementById('result-score');
    const percentEl = document.getElementById('result-percentage');
    
    if (scoreEl) scoreEl.textContent = `${score} / ${state.activeQuestions.length}`;
    if (percentEl) {
        const percent = Math.round((score / state.activeQuestions.length) * 100);
        percentEl.textContent = `%${percent} ${state.language === 'tr' ? 'Başarı' : 'Success'}`;
    }
}