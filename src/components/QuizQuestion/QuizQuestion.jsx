import { Button, Text, Title } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import { colors } from '../../theme/colors';
import './QuizQuestion.css';

export function QuizQuestion({ 
  question, 
  options, 
  selectedIndex, 
  correctIndex, 
  isAnswered, 
  onAnswer 
}) {
  return (
    <div className="quiz-question">
      <Title level="2" className="quiz-question__title">
        {question}
      </Title>

      <div className="quiz-question__options">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === correctIndex;

          
          let optionClass = 'quiz-question__option';
          
          if (isAnswered) {
            if (isCorrect) {
              optionClass += ' quiz-question__option--correct';
            } else if (isSelected && !isCorrect) {
              optionClass += ' quiz-question__option--wrong';
            }
          } else if (isSelected) {
            optionClass += ' quiz-question__option--selected';
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => onAnswer(index)}
              disabled={isAnswered} 
              className={optionClass}
            >
              <Text className="quiz-question__option-text">{option}</Text>
            </button>
          );
        })}
      </div>
    </div>
  );
}

QuizQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIndex: PropTypes.number,
  correctIndex: PropTypes.number.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  onAnswer: PropTypes.func.isRequired,
};