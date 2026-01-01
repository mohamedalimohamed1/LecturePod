//js/engine.js
import { state } from './state.js';

// JSON dosyasından veriyi çeken fonksiyon
export async function fetchLectureData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        return null;
    }
}

// Seçilen moda ve aralığa göre soruları hazırlayan fonksiyon
export function prepareActiveQuestions() {
    const allQuestions = state.selectedLectureData.questions;
    let selected = [];

    if (state.rangeType === 'all') {
        selected = [...allQuestions];
    } else if (state.rangeType === 'random') {
        const countInput = document.getElementById('setup-count');
        const count = countInput ? parseInt(countInput.value) : 10;
        selected = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    } else if (state.rangeType === 'range') {
        const start = parseInt(document.getElementById('range-start').value) - 1;
        const end = parseInt(document.getElementById('range-end').value);
        selected = allQuestions.slice(Math.max(0, start), Math.min(allQuestions.length, end));
    }

    state.activeQuestions = selected;
    state.userAnswers = new Array(selected.length).fill(null);
    state.currentQuestionIndex = 0;
    return selected.length > 0;
}