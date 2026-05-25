import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';

function ModeSelection() {
  const language = useAppStore((state) => state.language);
  const selectedLectureData = useAppStore((state) => state.selectedLectureData);
  const setMode = useAppStore((state) => state.setMode);
  const setRangeType = useAppStore((state) => state.setRangeType);
  const setView = useAppStore((state) => state.setView);
  const backToLectureSelection = useAppStore((state) => state.backToLectureSelection);
  const startSession = useAppStore((state) => state.startSession);
  const showNotification = useAppStore((state) => state.showNotification);
  const t = translations[language];

  const handleModeSelect = (mode) => {
    setMode(mode);
    setRangeType('all');

    if (mode === 'read') {
      if (!startSession()) {
        showNotification(t.noEligibleQuestions, 'error');
      }
      return;
    }

    setView('sessionSetup');
  };

  return (
    <div className="view" id="mode-selection-view">
      <button className="btn-back" type="button" onClick={backToLectureSelection}>
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{t.backToLectures}</span>
      </button>
      <h2>{selectedLectureData?.courseTitle}</h2>
      <h3 style={{ opacity: 0.75, marginTop: '0.35rem' }}>{selectedLectureData?.lectureTitle}</h3>
      <div className="mode-selection-grid">
        <button
          type="button"
          className="mode-btn read-mode"
          onClick={() => handleModeSelect('read')}
        >
          <span className="mode-title">
            <span className="material-symbols-outlined">menu_book</span>
            <span>{t.readMode}</span>
          </span>
          <span className="mode-description">{t.readDescription}</span>
        </button>
        <button
          type="button"
          className="mode-btn quiz-mode"
          onClick={() => handleModeSelect('quiz')}
        >
          <span className="mode-title">
            <span className="material-symbols-outlined">quiz</span>
            <span>{t.quizMode}</span>
          </span>
          <span className="mode-description">{t.quizDescription}</span>
        </button>
        <button
          type="button"
          className="mode-btn practice-mode"
          onClick={() => handleModeSelect('practice')}
        >
          <span className="mode-title">
            <span className="material-symbols-outlined">psychology</span>
            <span>{t.practiceMode}</span>
          </span>
          <span className="mode-description">{t.practiceDescription}</span>
        </button>
        <button
          type="button"
          className="mode-btn learn-mode"
          onClick={() => handleModeSelect('learn')}
        >
          <span className="mode-title">
            <span className="material-symbols-outlined">style</span>
            <span>{t.learnMode}</span>
          </span>
          <span className="mode-description">{t.learnDescription}</span>
        </button>
      </div>
    </div>
  );
}

export default ModeSelection;
