import { useState } from 'react';
import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';
import { filterQuestions } from '../../utils/engine.js';

function SessionSetup() {
  const language = useAppStore((state) => state.language);
  const selectedLectureData = useAppStore((state) => state.selectedLectureData);
  const currentMode = useAppStore((state) => state.currentMode);
  const rangeType = useAppStore((state) => state.rangeType);
  const setRangeType = useAppStore((state) => state.setRangeType);
  const setView = useAppStore((state) => state.setView);
  const startSession = useAppStore((state) => state.startSession);
  const showNotification = useAppStore((state) => state.showNotification);
  const t = translations[language];

  const eligibleQuestions = filterQuestions(selectedLectureData?.questions ?? [], currentMode);
  const total = eligibleQuestions.length;

  const [randomCount, setRandomCount] = useState(Math.min(10, Math.max(1, total || 1)));
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(Math.max(1, total));

  const handleStart = () => {
    const didStart = startSession({
      randomCount,
      rangeStart,
      rangeEnd,
    });

    if (!didStart) {
      showNotification(t.noEligibleQuestions, 'error');
    }
  };

  return (
    <div className="view" id="session-setup-view">
      <button className="btn-back" type="button" onClick={() => setView('modeSelection')}>
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{t.backToModes}</span>
      </button>
      <h2>{t.sessionSetupTitle}</h2>
      <div className="setup-tabs">
        {['all', 'random', 'range'].map((option) => (
          <button
            key={option}
            type="button"
            className={`setup-opt-btn ${rangeType === option ? 'active' : ''}`}
            onClick={() => setRangeType(option)}
          >
            {option === 'all' ? t.optAll : option === 'random' ? t.optRandom : t.optRange}
          </button>
        ))}
      </div>

      <div className="setup-content">
        {rangeType === 'random' ? (
          <>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', fontWeight: 700 }}>
              {t.questionCount}
            </label>
            <input
              type="number"
              value={randomCount}
              min="1"
              max={Math.max(1, total)}
              onChange={(event) => setRandomCount(Number(event.target.value))}
            />
          </>
        ) : null}

        {rangeType === 'range' ? (
          <div className="setup-inline">
            <div>
              <label style={{ fontSize: '0.85rem' }}>{t.startLabel}</label>
              <input
                type="number"
                value={rangeStart}
                min="1"
                max={Math.max(1, total)}
                onChange={(event) => setRangeStart(Number(event.target.value))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem' }}>{t.endLabel}</label>
              <input
                type="number"
                value={rangeEnd}
                min="1"
                max={Math.max(1, total)}
                onChange={(event) => setRangeEnd(Number(event.target.value))}
              />
            </div>
          </div>
        ) : null}

        {rangeType === 'all' ? (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {total} {t.eligibleQuestions}
          </p>
        ) : null}
      </div>

      <button type="button" className="btn btn-primary start-btn-large" onClick={handleStart}>
        <span>{t.startSession}</span>
        <span className="material-symbols-outlined">rocket_launch</span>
      </button>
    </div>
  );
}

export default SessionSetup;
