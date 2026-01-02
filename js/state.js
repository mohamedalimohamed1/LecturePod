//js/state.js
export const state = {
    language: 'tr',
    theme: 'dark',
    lectures: [
        { id: 'lecture-1', title: 'Sistem Analizi - Vize Ve Final', file: 'data/lecture_one.json' },
        { id: 'lecture-2', title: 'Dijital Okuryazarlık - Vize Sınavı', file: 'data/lecture_six.json' },
        { id: 'lecture-3', title: 'Görüntü İşleme - Vize Sınavı', file: 'data/lecture_four.json' },
        { id: 'lecture-4', title: 'Kriptoloji ve Bilgi Güvenliği - Vize Sınavı', file: 'data/lecture_seven.json' },
        { id: 'lecture-5', title: 'Uzaktan Algılama - Vize Sınavı', file: 'data/lecture_three.json' },
        { id: 'lecture-6', title: 'İşletim Sistemleri - Vize Sınavı', file: 'data/lecture_five.json' },
        { id: 'lecture-7', title: 'Örüntü Tanıma - Vize Sınavı', file: 'data/lecture_two.json' }
    ],
    successMessages: [
        { emoji: '🔥', text: { tr: 'Harikasın! 3 Doğru Üst Üste!', en: 'Great! 3 in a row!' } },
        { emoji: '🚀', text: { tr: 'Durdurulamaz Gidiyorsun!', en: 'You are unstoppable!' } },
        { emoji: '💎', text: { tr: 'Kusursuz Performans!', en: 'Flawless performance!' } }
    ],
    failureMessages: [
        { emoji: '🧐', text: { tr: 'Dikkat Et! Tekrar Odaklanalım.', en: 'Be careful! Let\'s refocus.' } },
        { emoji: '☕', text: { tr: 'Bir Kahve Molası Lazım mı?', en: 'Need a coffee break?' } }
    ],
    selectedLectureData: null,
    currentMode: null,
    activeQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    lastMistakes: [],
    rangeType: 'all',
    successStreak: 0,
    failureStreak: 0,
    isLoggedIn: false
};