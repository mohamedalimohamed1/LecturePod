import { create } from 'zustand';
import { prepareActiveQuestions } from '../utils/engine.js';

const defaultNotificationDuration = 3000;
const initialState = {
  language: 'tr',
  theme: 'dark',
  isLoggedIn: false,
  currentView: 'login',
  currentSemester: null,
  selectedLectureData: null,
  selectedLectureMeta: null,
  currentMode: null,
  activeQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  rangeType: 'all',
  successStreak: 0,
  failureStreak: 0,
  notification: null,
  infoMessage: null,
  streakPopup: null,
  notificationTimeoutId: null,
  streakPopupTimeoutId: null,
};

const useAppStore = create((set, get) => ({
  ...initialState,

  login: (inputUsername, inputPassword) => {
    const validUser = import.meta.env.VITE_APP_USERNAME;
    const validPass = import.meta.env.VITE_APP_PASSWORD;

    if (inputUsername === validUser && inputPassword === validPass) {
      set({
        isLoggedIn: true,
        currentView: 'semesterSelection',
      });
      get().showInfo(
        get().language === 'tr'
          ? 'Şu an için 7. ve 8. dönem aktiftir.'
          : 'Semesters 7 and 8 are currently available.'
      );
      return true;
    }

    return false;
  },

  logout: () =>
    set({
      ...initialState,
    }),

  setView: (view) => set({ currentView: view }),
  setLanguage: (lang) => set({ language: lang }),
  setTheme: (theme) => set({ theme }),
  setSemester: (semester) => set({ currentSemester: semester }),
  setInfoMessage: (message) => set({ infoMessage: message }),
  showInfo: (message) => set({ infoMessage: message }),
  setNotification: (notification) => set({ notification }),
  showNotification: (message, type = 'info', duration = defaultNotificationDuration) => {
    set({ notification: { message, type } });
    window.clearTimeout(get().notificationTimeoutId);
    const timeoutId = window.setTimeout(() => {
      set({ notification: null, notificationTimeoutId: null });
    }, duration);
    set({ notificationTimeoutId: timeoutId });
  },
  setStreakPopup: (popup) => set({ streakPopup: popup }),
  showStreakPopup: (popup) => {
    set({ streakPopup: popup });
    window.clearTimeout(get().streakPopupTimeoutId);
    const timeoutId = window.setTimeout(() => {
      set({ streakPopup: null, streakPopupTimeoutId: null });
    }, 2500);
    set({ streakPopupTimeoutId: timeoutId });
  },
  selectLecture: (meta, data) =>
    set({
      selectedLectureMeta: meta,
      selectedLectureData: data,
      currentView: 'modeSelection',
    }),
  clearLectureSelection: () =>
    set({
      selectedLectureMeta: null,
      selectedLectureData: null,
      currentMode: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      rangeType: 'all',
      currentView: 'lectureSelection',
    }),
  setMode: (mode) => set({ currentMode: mode }),
  setRangeType: (type) => set({ rangeType: type }),
  setActiveQuestions: (questions) =>
    set({
      activeQuestions: questions,
      userAnswers: new Array(questions.length).fill(null),
      currentQuestionIndex: 0,
    }),
  startSession: (options = {}) => {
    const state = get();
    const questions = prepareActiveQuestions({
      lectureData: state.selectedLectureData,
      mode: state.currentMode,
      rangeType: state.rangeType,
      options,
    });

    if (!questions.length) {
      return false;
    }

    set({
      activeQuestions: questions,
      userAnswers: new Array(questions.length).fill(null),
      currentQuestionIndex: 0,
      currentView:
        state.currentMode === 'read'
          ? 'readMode'
          : state.currentMode === 'learn'
            ? 'learn'
            : 'question',
    });

    return true;
  },
  answerQuestion: (index, answer) =>
    set((state) => {
      const updated = [...state.userAnswers];
      updated[index] = answer;
      return { userAnswers: updated };
    }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        Math.max(0, state.activeQuestions.length - 1)
      ),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),
  incrementSuccessStreak: () =>
    set((state) => ({
      successStreak: state.successStreak + 1,
      failureStreak: 0,
    })),
  incrementFailureStreak: () =>
    set((state) => ({
      failureStreak: state.failureStreak + 1,
      successStreak: 0,
    })),
  resetStreaks: () =>
    set({
      successStreak: 0,
      failureStreak: 0,
    }),
  finishSession: () => set({ currentView: 'results' }),
  backToSemesterSelection: () =>
    set({
      currentView: 'semesterSelection',
      currentSemester: null,
      selectedLectureMeta: null,
      selectedLectureData: null,
      currentMode: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      rangeType: 'all',
      infoMessage: null,
    }),
  backToLectureSelection: () =>
    set({
      currentView: 'lectureSelection',
      selectedLectureMeta: null,
      selectedLectureData: null,
      currentMode: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      rangeType: 'all',
    }),
  backToModes: () =>
    set({
      currentView: 'modeSelection',
      activeQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      rangeType: 'all',
      currentMode: null,
      successStreak: 0,
      failureStreak: 0,
      streakPopup: null,
    }),
}));

export default useAppStore;
