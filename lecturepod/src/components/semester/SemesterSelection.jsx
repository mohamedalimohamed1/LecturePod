import { useEffect } from 'react';
import useAppStore from '../../store/useAppStore.js';
import { semesters } from '../../data/lectures.js';
import { translations } from '../../data/translations.js';

function SemesterSelection() {
  const language = useAppStore((state) => state.language);
  const setSemester = useAppStore((state) => state.setSemester);
  const setView = useAppStore((state) => state.setView);
  const showInfo = useAppStore((state) => state.showInfo);
  const t = translations[language];

  useEffect(() => {
    showInfo(t.semesterInfo);
  }, [showInfo, t.semesterInfo]);

  const handleSelect = (semester) => {
    if (!semester.active) {
      return;
    }

    setSemester(semester.number);
    setView('lectureSelection');
  };

  return (
    <div className="view" id="semester-selection-view">
      <h2 className="view-title">{t.selectSemester}</h2>
      <div className="semester-grid">
        {semesters.map((semester) => (
          <button
            key={semester.id}
            type="button"
            className={`lecture-btn ${semester.active ? '' : 'locked'}`}
            onClick={() => handleSelect(semester)}
            disabled={!semester.active}
          >
            <h3>
              {t.semesterLabel} {semester.number}
            </h3>
            <p className="semester-meta">
              {!semester.active ? (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  <span>{t.lockedSemester}</span>
                </>
              ) : (
                t.tapToStart
              )}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SemesterSelection;
