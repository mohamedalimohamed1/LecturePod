export function filterQuestions(questions, mode) {
  if (!Array.isArray(questions)) {
    return [];
  }

  if (mode === 'quiz' || mode === 'practice') {
    return questions.filter((question) => question.type === 'multiple-choice');
  }

  if (mode === 'learn') {
    return questions.filter(
      (question) =>
        question.type === 'multiple-choice' || question.type === 'short-answer'
    );
  }

  if (mode === 'read') {
    return [...questions];
  }

  return [...questions];
}

export function selectByRange(questions, rangeType, options = {}) {
  if (rangeType === 'all') {
    return [...questions];
  }

  if (rangeType === 'random') {
    const count = Math.max(1, Number(options.randomCount ?? 10));
    return [...questions]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(count, questions.length));
  }

  if (rangeType === 'range') {
    const start = Math.max(0, Number(options.rangeStart ?? 1) - 1);
    const end = Math.min(questions.length, Number(options.rangeEnd ?? questions.length));
    return questions.slice(start, Math.max(start, end));
  }

  return [...questions];
}

export function prepareActiveQuestions({
  lectureData,
  mode,
  rangeType,
  options = {},
}) {
  if (!lectureData?.questions) {
    return [];
  }

  const filteredQuestions = filterQuestions(lectureData.questions, mode);
  return selectByRange(filteredQuestions, rangeType, options);
}
