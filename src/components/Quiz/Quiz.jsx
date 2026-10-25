import { useState, useEffect } from 'react';
import { Button } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import { QuizQuestion } from '../QuizQuestion/QuizQuestion';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import './Quiz.css';

export function Quiz({ onProgress, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isAnswered, setIsAnswered] = useState(false);

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[currentIndex];
  const selectedAnswer = answers[question.id];

  // 👇 Считаем прогресс по количеству отвеченных вопросов
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    // Передаем процент (answeredCount / total) и текущий индекс (для "1/7")
    onProgress?.((answeredCount / total) * 100, currentIndex);
  }, [answers, currentIndex, total, onProgress]);

  const handleAnswer = (index) => {
    if (isAnswered) return;

    setAnswers((prev) => ({ ...prev, [question.id]: index }));
    setIsAnswered(true); 
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
    } else {
      const correct = QUIZ_QUESTIONS.reduce((acc, q) => {
        return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
      }, 0);
      onFinish?.({ correct, total });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // При возврате назад проверяем, был ли уже дан ответ на тот вопрос
      setIsAnswered(answers[QUIZ_QUESTIONS[currentIndex - 1].id] !== undefined);
    }
  };

  return (
    <div className="quiz">
      <QuizQuestion
        question={question.question}
        options={question.options}
        selectedIndex={selectedAnswer}
        correctIndex={question.correctIndex}
        isAnswered={isAnswered}
        onAnswer={handleAnswer}
      />

      <div className="quiz__actions">
        <Button
          size="l"
          stretched
          mode="secondary"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          Назад
        </Button>
        <Button
          size="l"
          stretched
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
        >
          {currentIndex === total - 1 ? 'Завершить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}

Quiz.propTypes = {
  onProgress: PropTypes.func,
  onFinish: PropTypes.func,
};