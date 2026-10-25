import { useState } from 'react';
import { Panel, PanelHeader, Box, Text, Title, Progress, Button } from '@vkontakte/vkui';
import { useRouteNavigator,  } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Quiz } from '../components/Quiz/Quiz';
import { colors } from '../theme/colors';
import { QUIZ_QUESTIONS } from '../components/data/quizQuestions.jsx';
import '../styles/TestPage.css';

export function TestPage({ id }) {
  const routeNavigator = useRouteNavigator();
  const [progress, setProgress] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(1); 
  const [result, setResult] = useState(null);

  
  const handleProgress = (percent, index) => {
    setProgress(percent);
    setCurrentNumber(index + 1);
  };

  const handleFinish = (quizResult) => {
    setResult(quizResult);
    setProgress(100);
  };

  const handleRestart = () => {
    setResult(null);
    setProgress(0);
    setCurrentNumber(1);
  };

  return (
    <Panel id={id} className="test-page">
      <Box padding="m">
        
       
        {!result && (
          <div className="test-page__header">
            <button 
              className="test-page__back-btn" 
              onClick={() => routeNavigator.back()}
              type="button"
              aria-label="Назад"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="test-page__progress-wrapper">
              <div className="test-page__progress-track">
                <div 
                  className="test-page__progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Text className="test-page__progress-text">
                
                {currentNumber}/{QUIZ_QUESTIONS.length}
              </Text>
            </div>
          </div>
        )}

        
        {result ? (
          <div className="test-page__result">
            <Title level="2" style={{ textAlign: 'center', color: 'black' }} >
              Результат
            </Title>
            <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 8 }} className='text'>
              Правильных ответов: {result.correct} из {result.total}
            </Text>
            <div className="test-page__actions">
              <Button size="l" stretched mode="secondary" onClick={handleRestart}>
                Пройти заново
              </Button>
              <Button size="l" stretched onClick={() => routeNavigator.back()}>
                Назад
              </Button>
            </div>
          </div>
        ) : (
          <Quiz onProgress={handleProgress} onFinish={handleFinish} />
        )}
      </Box>
    </Panel>
  );
}

TestPage.propTypes = {
  id: PropTypes.string.isRequired,
};