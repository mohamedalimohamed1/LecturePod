import useAppStore from '../../store/useAppStore.js';
import { semesterLectures } from '../../data/lectures.js';
import { translations } from '../../data/translations.js';
import { useLecture } from '../../hooks/useLecture.js';

function LectureList() {
  const language = useAppStore((state) => state.language);
  const currentSemester = useAppStore((state) => state.currentSemester);
  const selectLecture = useAppStore((state) => state.selectLecture);
  const showNotification = useAppStore((state) => state.showNotification);
  const backToSemesterSelection = useAppStore((state) => state.backToSemesterSelection);
  const t = translations[language];
  const { fetchLectureData, isLoading } = useLecture();

  const lectures = semesterLectures[currentSemester] ?? [];

  const handleSelectLecture = async (lecture) => {
    try {
      const data = await fetchLectureData(lecture.file);
      selectLecture(lecture, data);
    } catch {
      showNotification(t.dataFormatError, 'error');
    }
  };

  return (
    <div className="view" id="lecture-selection-view">
      <button className="btn-back" type="button" onClick={backToSemesterSelection}>
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{t.backToSemesters}</span>
      </button>
      <h2 className="view-title">{t.selectLecture}</h2>
      {!lectures.length ? (
        <div className="empty-state">{t.emptyLecture}</div>
      ) : (
        <div>
          {lectures.map((lecture) => (
            <button
              key={lecture.id}
              type="button"
              className="lecture-btn"
              onClick={() => handleSelectLecture(lecture)}
              disabled={isLoading}
            >
              <h3>{lecture.title}</h3>
              <p>{t.tapToStart}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LectureList;
