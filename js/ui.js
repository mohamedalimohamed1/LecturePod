// FIXED: BUG-6
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

const formatAnswerText = (text) => {
    if (!text) {
        return '';
    }

    if (/<[a-z][\s\S]*>/i.test(text)) {
        return text;
    }

    const lines = text.split('\n');
    let formattedHtml = '';
    let tableRows = [];
    let listItems = [];

    const flushTable = () => {
        if (tableRows.length === 0) {
            return '';
        }

        let html = '<div style="overflow-x:auto; margin: 1rem 0;"><table style="width:100%; border-collapse: collapse; border: 1px solid var(--border-color); font-size: 0.9rem;">';

        tableRows.forEach((row, index) => {
            html += `<tr style="${index === 0 ? 'background: rgba(13, 148, 235, 0.1); font-weight: bold;' : 'border-top: 1px solid var(--border-color);'}">`;
            row.forEach((cell) => {
                let cellContent = cell.replace(/[•\*]/g, '<br>• ').trim();
                if (cellContent.startsWith('<br>')) {
                    cellContent = cellContent.substring(4);
                }
                html += `<td style="padding: 0.6rem; border: 1px solid var(--border-color); vertical-align: top;">${cellContent}</td>`;
            });
            html += '</tr>';
        });

        html += '</table></div>';
        tableRows = [];
        return html;
    };

    const flushList = () => {
        if (listItems.length === 0) {
            return '';
        }

        let html = '<ul style="margin: 0.5rem 0 1rem 1.2rem; list-style-type: disc;">';
        listItems.forEach((item) => {
            html += `<li style="margin-bottom: 0.3rem;">${item}</li>`;
        });
        html += '</ul>';
        listItems = [];
        return html;
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.includes('|')) {
            formattedHtml += flushList();
            const cells = trimmed.split('|').map((cell) => cell.trim()).filter((cell) => cell !== '');
            if (cells.length > 1) {
                tableRows.push(cells);
                return;
            }
        }

        if (/^[•\*\-]\s*/.test(trimmed)) {
            formattedHtml += flushTable();
            listItems.push(trimmed.replace(/^[•\*\-]\s*/, ''));
            return;
        }

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
    Object.values(views).forEach((view) => view?.classList.remove('active'));

    if (views[id]) {
        views[id].classList.add('active');
        state.currentView = id;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.classList.toggle('hidden', id === 'login');
    }
}

export function updateUIText() {
    const lang = state.language;

    document.querySelectorAll('[data-key]').forEach((element) => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

export function renderLectureList(onSelectCallback) {
    const container = document.getElementById('lecture-list-container');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    state.lectures.forEach((lecture) => {
        const button = document.createElement('button');
        button.className = 'lecture-btn';
        button.innerHTML = `
            <h3>${lecture.title}</h3>
            <p>${state.language === 'tr' ? 'Çalışmaya başlamak için dokunun' : 'Tap to start studying'}</p>
        `;
        button.onclick = () => onSelectCallback(lecture);
        container.appendChild(button);
    });
}

export function renderQuestionUI(onChoiceCallback) {
    const question = state.activeQuestions[state.currentQuestionIndex];
    if (!question) {
        return;
    }

    if (question.type === 'short-answer') {
        console.warn('Short-answer question skipped in Quiz/Practice mode.');
        return;
    }

    const counter = document.getElementById('question-counter');
    if (counter) {
        counter.textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;
    }

    document.getElementById('question-text').textContent = question.question;

    const container = document.getElementById('question-options-container');
    container.innerHTML = '';
    const userAnswer = state.userAnswers[state.currentQuestionIndex];
    const answered = userAnswer !== null;

    question.options.forEach((option) => {
        const optionElement = document.createElement('div');
        optionElement.className = `option-label ${answered ? 'answered' : ''}`;
        optionElement.textContent = option;

        if (answered) {
            if (option === question.correctAnswer) {
                optionElement.classList.add('correct-highlight');
            }
            if (option === userAnswer && option !== question.correctAnswer) {
                optionElement.classList.add('wrong-highlight');
            }
        } else {
            optionElement.onclick = () => onChoiceCallback(option);
        }

        container.appendChild(optionElement);
    });

    document.getElementById('prev-question-btn')?.classList.toggle('hidden', state.currentQuestionIndex === 0);
    const isLastQuestion = state.currentQuestionIndex === state.activeQuestions.length - 1;
    document.getElementById('next-question-btn')?.classList.toggle('hidden', !answered || isLastQuestion);
    document.getElementById('finish-btn')?.classList.toggle('hidden', !answered || !isLastQuestion);
}

export function renderLearnUI() {
    const question = state.activeQuestions[state.currentQuestionIndex];
    if (!question) {
        return;
    }

    const container = document.getElementById('learn-boxed-container');
    if (!container) {
        return;
    }

    const counter = document.getElementById('learn-counter');
    if (counter) {
        counter.textContent = `${state.currentQuestionIndex + 1} / ${state.activeQuestions.length}`;
    }

    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.borderLeft = '4px solid var(--primary-color)';

    const answerContent = question.correctAnswer;

    card.innerHTML = `
        <span class="box-question">${state.currentQuestionIndex + 1}. ${question.question}</span>
        <div class="box-answer learn-box-answer hidden">
            ${formatAnswerText(answerContent)}
        </div>
    `;

    container.appendChild(card);
    document.getElementById('show-answer-btn')?.classList.remove('hidden');
    document.getElementById('learn-feedback-btns')?.classList.add('hidden');
}

export function renderReadList() {
    const container = document.getElementById('read-mode-list');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    state.activeQuestions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.borderLeft = '4px solid var(--primary-color)';
        card.innerHTML = `
            <span class="box-question">${index + 1}. ${question.question}</span>
            <div class="box-answer">
                ${formatAnswerText(question.correctAnswer)}
            </div>
        `;
        container.appendChild(card);
    });
}

export function renderResultsUI() {
    let score = 0;
    const listContainer = document.getElementById('result-details-container');
    if (!listContainer) {
        return;
    }

    listContainer.innerHTML = '';

    state.activeQuestions.forEach((question, index) => {
        const userAnswer = state.userAnswers[index];
        const isCorrect = question.type === 'short-answer'
            ? userAnswer === 'knew'
            : userAnswer === question.correctAnswer;

        if (isCorrect) {
            score++;
        }

        const card = document.createElement('div');
        card.className = `result-card ${isCorrect ? 'correct' : 'incorrect'}`;

        let displayUserAnswer = userAnswer;
        if (question.type === 'short-answer') {
            displayUserAnswer = userAnswer === 'knew'
                ? translations[state.language].knewItLabel
                : translations[state.language].didntKnowLabel;
        } else if (!userAnswer) {
            displayUserAnswer = translations[state.language].notAnsweredLabel;
        }

        card.innerHTML = `
            <span class="box-question">${index + 1}. ${question.question}</span>
            <div class="box-answer" style="background: ${isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'}; color: ${isCorrect ? 'var(--green-color)' : 'var(--red-color)'}; border-color: ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}">
                <strong>${translations[state.language].yourAnswerLabel}:</strong> ${formatAnswerText(displayUserAnswer)}
            </div>
            ${!isCorrect ? `
                <div class="box-answer" style="margin-top: 0.5rem;">
                    <strong>${translations[state.language].correctAnswerLabel}:</strong> ${formatAnswerText(question.correctAnswer)}
                </div>
            ` : ''}
        `;
        listContainer.appendChild(card);
    });

    const scoreElement = document.getElementById('result-score');
    const percentageElement = document.getElementById('result-percentage');

    if (scoreElement) {
        scoreElement.textContent = `${score} / ${state.activeQuestions.length}`;
    }

    if (percentageElement) {
        const percentage = Math.round((score / state.activeQuestions.length) * 100);
        percentageElement.textContent = `%${percentage} ${state.language === 'tr' ? 'Başarı' : 'Success'}`;
    }
}
