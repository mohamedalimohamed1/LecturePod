//js/engine.js
import { state } from './state.js';

/**
 * JSON dosyasından veriyi çeken fonksiyon
 */
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

/**
 * Seçilen moda ve aralığa göre soruları hazırlayan fonksiyon.
 * YENİ: Soru tiplerine göre otomatik filtreleme yapar.
 */
export function prepareActiveQuestions() {
    if (!state.selectedLectureData || !state.selectedLectureData.questions) return false;

    let baseQuestions = state.selectedLectureData.questions;

    // KRİTİK GÜNCELLEME: Modlara göre soru tipi filtrelemesi
    // 1. Test (quiz) ve Pratik (practice) modlarında SADECE multiple-choice soruları gösterilir.
    if (state.currentMode === 'quiz' || state.currentMode === 'practice') {
        baseQuestions = baseQuestions.filter(q => q.type === 'multiple-choice');
    }
    // 2. Ezber (learn) ve Okuma (read) modlarında HEM multiple-choice HEM short-answer gösterilir.
    // (Zaten short-answer kurallar gereği sadece bu iki modda olabilir, 
    // multiple-choice ise her yerde olabilir demiştik.)
    else if (state.currentMode === 'learn') {
        // İsteğe bağlı: Ezber modunda sadece short-answer isterseniz burayı güncelleyebilirsiniz.
        // Şimdiki kural: Multiple-choice her modda, Short-answer sadece learn/read'de.
        baseQuestions = baseQuestions.filter(q => q.type === 'multiple-choice' || q.type === 'short-answer');
    }

    let selected = [];

    // Kullanıcının seçtiği aralığa göre listeyi daralt (all, random, range)
    if (state.rangeType === 'all') {
        selected = [...baseQuestions];
    } else if (state.rangeType === 'random') {
        const countInput = document.getElementById('setup-count');
        const count = countInput ? parseInt(countInput.value) : 10;
        selected = [...baseQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    } else if (state.rangeType === 'range') {
        const start = parseInt(document.getElementById('range-start').value) - 1;
        const end = parseInt(document.getElementById('range-end').value);
        selected = baseQuestions.slice(Math.max(0, start), Math.min(baseQuestions.length, end));
    }

    state.activeQuestions = selected;
    state.userAnswers = new Array(selected.length).fill(null);
    state.currentQuestionIndex = 0;
    
    return selected.length > 0;
}