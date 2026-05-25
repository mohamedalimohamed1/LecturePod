import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';
import { formatAnswerText } from '../../utils/formatAnswer.js';

function ResultsView() {
  const language = useAppStore((state) => state.language);
  const activeQuestions = useAppStore((state) => state.activeQuestions);
  const userAnswers = useAppStore((state) => state.userAnswers);
  const backToModes = useAppStore((state) => state.backToModes);
  const backToLectureSelection = useAppStore((state) => state.backToLectureSelection);
  const t = translations[language];

  const score = activeQuestions.reduce((total, question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect =
      question.type === 'short-answer'
        ? userAnswer === 'knew'
        : userAnswer === question.correctAnswer;
    return total + (isCorrect ? 1 : 0);
  }, 0);

  const percentage = activeQuestions.length
    ? Math.round((score / activeQuestions.length) * 100)
    : 0;

  return (
    <div className="view" id="results-view">
      <h2 className="view-title">{t.sessionComplete}</h2>
      <div className="score-container">
        <p id="result-score">
          {score} / {activeQuestions.length}
        </p>
        <p id="result-percentage">
          %{percentage} {t.successRate}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <button type="button" className="btn btn-primary btn-full" onClick={backToModes}>
          <span className="material-symbols-outlined">home</span>
          <span>{t.backToModes}</span>
        </button>
        <button type="button" className="btn btn-prev-ratio btn-full" onClick={backToLectureSelection}>
          <span className="material-symbols-outlined">library_books</span>
          <span>{t.backToLectures}</span>
        </button>
      </div>
      <div className="scrollable-list">
        {activeQuestions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect =
            question.type === 'short-answer'
              ? userAnswer === 'knew'
              : userAnswer === question.correctAnswer;

          let displayUserAnswer = userAnswer;
          if (question.type === 'short-answer') {
            displayUserAnswer =
              userAnswer === 'knew' ? t.knewItLabel : t.didntKnowLabel;
          } else if (!userAnswer) {
            displayUserAnswer = t.notAnsweredLabel;
          }

          return (
            <div
              key={`${question.question}-${index}`}
              className={`result-card ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <span className="box-question">
                {index + 1}. {question.question}
              </span>
              <div
                className="box-answer"
                style={{
                  background: isCorrect
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'rgba(239, 68, 68, 0.05)',
                  color: isCorrect ? 'var(--green-color)' : 'var(--red-color)',
                  borderColor: isCorrect
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                }}
              >
                <strong>{t.yourAnswerLabel}:</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: formatAnswerText(displayUserAnswer) }} />
              </div>
              {!isCorrect ? (
                <div className="box-answer" style={{ marginTop: '0.5rem' }}>
                  <strong>{t.correctAnswerLabel}:</strong>{' '}
                  <span
                    dangerouslySetInnerHTML={{ __html: formatAnswerText(question.correctAnswer) }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsView;
