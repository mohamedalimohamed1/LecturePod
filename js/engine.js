// FIXED: BUG-3 BUG-4
import { state } from './state.js';

export async function fetchLectureData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        return null;
    }
}

export function prepareActiveQuestions(options = {}) {
    if (!state.selectedLectureData || !state.selectedLectureData.questions) {
        return false;
    }

    let baseQuestions = state.selectedLectureData.questions;

    if (state.currentMode === 'quiz' || state.currentMode === 'practice') {
        baseQuestions = baseQuestions.filter((question) => question.type === 'multiple-choice');
    } else if (state.currentMode === 'learn') {
        baseQuestions = baseQuestions.filter(
            (question) => question.type === 'multiple-choice' || question.type === 'short-answer'
        );
    } else if (state.currentMode === 'read') {
        baseQuestions = [...baseQuestions];
    }

    let selected = [];

    if (state.rangeType === 'all') {
        selected = [...baseQuestions];
    } else if (state.rangeType === 'random') {
        const count = options.randomCount ?? 10;
        selected = [...baseQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    } else if (state.rangeType === 'range') {
        const start = (options.rangeStart ?? 1) - 1;
        const end = options.rangeEnd ?? baseQuestions.length;
        selected = baseQuestions.slice(Math.max(0, start), Math.min(baseQuestions.length, end));
    }

    state.activeQuestions = selected;
    state.userAnswers = new Array(selected.length).fill(null);
    state.currentQuestionIndex = 0;

    return selected.length > 0;
}
