import { useEffect } from 'react';
import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';
import { POSITIVE_STREAK_MESSAGES, NEGATIVE_STREAK_MESSAGES } from '../../data/messages.js';

function QuestionView() {
  const language = useAppStore((state) => state.language);
  const activeQuestions = useAppStore((state) => state.activeQuestions);
  const currentQuestionIndex = useAppStore((state) => state.currentQuestionIndex);
  const userAnswers = useAppStore((state) => state.userAnswers);
  const currentMode = useAppStore((state) => state.currentMode);
  const answerQuestion = useAppStore((state) => state.answerQuestion);
  const nextQuestion = useAppStore((state) => state.nextQuestion);
  const prevQuestion = useAppStore((state) => state.prevQuestion);
  const finishSession = useAppStore((state) => state.finishSession);
  const incrementSuccessStreak = useAppStore((state) => state.incrementSuccessStreak);
  const incrementFailureStreak = useAppStore((state) => state.incrementFailureStreak);
  const successStreak = useAppStore((state) => state.successStreak);
  const failureStreak = useAppStore((state) => state.failureStreak);
  const showStreakPopup = useAppStore((state) => state.showStreakPopup);
  const t = translations[language];

  const question = activeQuestions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const answered = userAnswer !== null;
  const isLast = currentQuestionIndex === activeQuestions.length - 1;

  const handleChoice = (choice) => {
    if (answered) {
      return;
    }

    answerQuestion(currentQuestionIndex, choice);
    const isCorrect = choice === question.correctAnswer;

    if (isCorrect) {
      incrementSuccessStreak();
    } else {
      incrementFailureStreak();
    }
  };

  useEffect(() => {
    if (successStreak >= 3) {
      const randomMessage =
        POSITIVE_STREAK_MESSAGES[Math.floor(Math.random() * POSITIVE_STREAK_MESSAGES.length)];
      showStreakPopup({
        emoji: '🔥',
        message: `${successStreak} Seri: ${randomMessage}`,
        isFailure: false,
      });
    }
  }, [showStreakPopup, successStreak]);

  useEffect(() => {
    if (failureStreak >= 2) {
      const randomMessage =
        NEGATIVE_STREAK_MESSAGES[Math.floor(Math.random() * NEGATIVE_STREAK_MESSAGES.length)];
      showStreakPopup({
        emoji: '🧊',
        message: randomMessage,
        isFailure: true,
      });
    }
  }, [failureStreak, showStreakPopup]);

  useEffect(() => {
    if (
      currentMode === 'practice' &&
      answered &&
      currentQuestionIndex < activeQuestions.length - 1
    ) {
      const timeoutId = window.setTimeout(() => {
        nextQuestion();
      }, 1000);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [activeQuestions.length, answered, currentMode, currentQuestionIndex, nextQuestion]);

  if (!question) {
    return null;
  }

  return (
    <div className="view" id="question-view">
      <div className="question-header-stack">
        <button className="btn-early-finish" type="button" onClick={finishSession}>
          <span className="material-symbols-outlined">stop_circle</span>
          <span>{t.finishEarly}</span>
        </button>
        <span className="counter-badge-flat">
          {currentQuestionIndex + 1} / {activeQuestions.length}
        </span>
      </div>

      <div className="question-body">
        <p id="question-text">{question.question}</p>
        <div className="options-list">
          {question.options?.map((option) => {
            const classNames = ['option-label'];

            if (answered) {
              classNames.push('answered');
              if (option === question.correctAnswer) {
                classNames.push('correct-highlight');
              }
              if (option === userAnswer && option !== question.correctAnswer) {
                classNames.push('wrong-highlight');
              }
            }

            return (
              <button
                key={option}
                type="button"
                className={classNames.join(' ')}
                onClick={() => handleChoice(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="navigation-controls-flex">
        <button
          type="button"
          className={`btn btn-prev-ratio ${currentQuestionIndex === 0 ? 'hidden' : ''}`}
          onClick={prevQuestion}
        >
          <span className="material-symbols-outlined">chevron_left</span>
          <span>{t.back}</span>
        </button>
        <div className="nav-spacer" />
        {!isLast ? (
          <button
            type="button"
            className={`btn btn-primary btn-next-ratio ${!answered ? 'hidden' : ''}`}
            onClick={nextQuestion}
          >
            <span>{t.next}</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-primary btn-next-ratio ${!answered ? 'hidden' : ''}`}
            onClick={finishSession}
          >
            <span>{t.finishEarly}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default QuestionView;
