import { useEffect, useState } from 'react';
import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';
import { POSITIVE_STREAK_MESSAGES, NEGATIVE_STREAK_MESSAGES } from '../../data/messages.js';
import { formatAnswerText } from '../../utils/formatAnswer.js';

function LearnView() {
  const language = useAppStore((state) => state.language);
  const activeQuestions = useAppStore((state) => state.activeQuestions);
  const currentQuestionIndex = useAppStore((state) => state.currentQuestionIndex);
  const answerQuestion = useAppStore((state) => state.answerQuestion);
  const nextQuestion = useAppStore((state) => state.nextQuestion);
  const finishSession = useAppStore((state) => state.finishSession);
  const incrementSuccessStreak = useAppStore((state) => state.incrementSuccessStreak);
  const incrementFailureStreak = useAppStore((state) => state.incrementFailureStreak);
  const successStreak = useAppStore((state) => state.successStreak);
  const failureStreak = useAppStore((state) => state.failureStreak);
  const showStreakPopup = useAppStore((state) => state.showStreakPopup);
  const t = translations[language];
  const [answerVisible, setAnswerVisible] = useState(false);

  const question = activeQuestions[currentQuestionIndex];

  useEffect(() => {
    setAnswerVisible(false);
  }, [currentQuestionIndex]);

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

  if (!question) {
    return null;
  }

  const answerContent = question.correctAnswer;

  const handleFeedback = (knewIt) => {
    answerQuestion(currentQuestionIndex, knewIt ? 'knew' : 'didnt-know');

    if (knewIt) {
      incrementSuccessStreak();
    } else {
      incrementFailureStreak();
    }

    if (currentQuestionIndex < activeQuestions.length - 1) {
      nextQuestion();
      return;
    }

    finishSession();
  };

  return (
    <div className="view" id="learn-view">
      <div className="question-header-stack">
        <button className="btn-early-finish" type="button" onClick={finishSession}>
          <span className="material-symbols-outlined">stop_circle</span>
          <span>{t.finishEarly}</span>
        </button>
        <span className="counter-badge-flat">
          {currentQuestionIndex + 1} / {activeQuestions.length}
        </span>
      </div>

      <div className="scrollable-list">
        <div className="result-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <span className="box-question">
            {currentQuestionIndex + 1}. {question.question}
          </span>
          <div
            className={`box-answer ${answerVisible ? '' : 'hidden'}`}
            dangerouslySetInnerHTML={{ __html: formatAnswerText(answerContent) }}
          />
        </div>
      </div>

      <div className="learn-actions-sticky">
        {!answerVisible ? (
          <button type="button" className="btn btn-primary btn-full" onClick={() => setAnswerVisible(true)}>
            {t.showAnswer}
          </button>
        ) : (
          <div className="feedback-grid">
            <button type="button" className="btn btn-red" onClick={() => handleFeedback(false)}>
              {t.didntKnow}
            </button>
            <button type="button" className="btn btn-green" onClick={() => handleFeedback(true)}>
              {t.knewIt}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnView;
