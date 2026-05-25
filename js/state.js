// FIXED: BUG-5
export const state = {
    language: 'tr',
    theme: 'dark',
    lectures: [
        { id: 'lecture-1', title: 'Sistem Analizi - Vize Ve Final', file: 'data/lecture_one.json' },
        { id: 'lecture-2', title: 'Dijital Okuryazarlık - Vize Ve Final', file: 'data/lecture_six.json' },
        { id: 'lecture-3', title: 'Görüntü İşleme - Vize Ve Final', file: 'data/lecture_four.json' },
        { id: 'lecture-4', title: 'Kriptoloji ve Bilgi Güvenliği - Vize Sınavı', file: 'data/lecture_seven.json' },
        { id: 'lecture-5', title: 'Uzaktan Algılama - Vize Sınavı', file: 'data/lecture_three.json' },
        { id: 'lecture-6', title: 'İşletim Sistemleri - Vize Sınavı', file: 'data/lecture_five.json' },
        { id: 'lecture-7', title: 'Örüntü Tanıma - Vize Ve Final', file: 'data/lecture_two.json' }
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
