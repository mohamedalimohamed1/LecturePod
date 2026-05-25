import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';
import { formatAnswerText } from '../../utils/formatAnswer.js';

function ReadView() {
  const language = useAppStore((state) => state.language);
  const activeQuestions = useAppStore((state) => state.activeQuestions);
  const setView = useAppStore((state) => state.setView);
  const t = translations[language];

  return (
    <div className="view" id="read-mode-view">
      <button className="btn-back" type="button" onClick={() => setView('modeSelection')}>
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{t.backToModes}</span>
      </button>
      <h2 className="view-title">{t.readMode}</h2>
      <div className="scrollable-list">
        {activeQuestions.map((question, index) => (
          <div
            key={`${question.question}-${index}`}
            className="result-card"
            style={{ borderLeft: '4px solid var(--primary-color)' }}
          >
            <span className="box-question">
              {index + 1}. {question.question}
            </span>
            <div
              className="box-answer"
              dangerouslySetInnerHTML={{ __html: formatAnswerText(question.correctAnswer) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadView;
