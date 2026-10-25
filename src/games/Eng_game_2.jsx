import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Div, Group, Title, Text, Button } from '@vkontakte/vkui';
import { colors } from '../theme/colors';

const GRID_SIZE = 9; // Сетка 3x3
const ROUNDS_CONFIG = [
  { sequenceLength: 4 },
  { sequenceLength: 6 },
  { sequenceLength: 8 }
];

export const Eng_game_2 = () => {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  
  // Фазы: 'prepare' (Подготовьтесь), 'show' (Запомните), 'input' (Повторите), 'win' (Победа), 'fail' (Ошибка)
  const [phase, setPhase] = useState('prepare');
  
  // Какая ячейка сейчас горит и каким цветом
  const [activeCell, setActiveCell] = useState({ index: null, color: null });
  const [userSequence, setUserSequence] = useState([]); 
  
  const sequenceRef = useRef([]);
  const timeoutsRef = useRef([]);
  const clickTimeoutRef = useRef(null);

  // Очистка всех таймеров при размонтировании
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const addTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Запуск нового раунда
  const startRound = useCallback((currentRound) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    setPhase('prepare');
    setUserSequence([]);
    setActiveCell({ index: null, color: null });

    const config = ROUNDS_CONFIG[currentRound];
    
    // Генерируем УНИКАЛЬНУЮ последовательность (без повторений)
    const allIndices = Array.from({ length: GRID_SIZE }, (_, i) => i);
    // Перемешиваем (Fisher-Yates)
    for (let i = allIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
    }
    // Берем нужное количество
    sequenceRef.current = allIndices.slice(0, config.sequenceLength);

    // Фаза "Подготовьтесь" (2 секунды)
    addTimeout(() => {
      setPhase('show');
      let delay = 0;
      
      // Показываем ячейки КРАСНЫМ цветом
      sequenceRef.current.forEach((cellIndex) => {
        addTimeout(() => setActiveCell({ index: cellIndex, color: colors.red }), delay);
        addTimeout(() => setActiveCell({ index: null, color: null }), delay + 500);
        delay += 700; // Интервал между вспышками
      });

      // Переход в фазу ввода
      addTimeout(() => {
        setPhase('input');
      }, delay + 200);

    }, 2000);
  }, []);

  // Запуск игры при монтировании
  useEffect(() => {
    startRound(0);
  }, [startRound]);

  // Обработка клика по ячейке
  const handleCellClick = (index) => {
    if (phase !== 'input') return;

    // Визуальная вспышка ЗЕЛЕНЫМ при клике
    setActiveCell({ index, color: colors.green });
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setActiveCell({ index: null, color: null }), 200);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Проверяем правильность
    const currentStep = newUserSequence.length - 1;
    if (sequenceRef.current[currentStep] !== index) {
      // Ошибка
      setPhase('fail');
      addTimeout(() => {
        startRound(round);
      }, 1500);
      return;
    }

    // Если дошел до конца успешно
    if (newUserSequence.length === sequenceRef.current.length) {
      setPhase('win');
      setScore(prev => {
        const newScore = prev + 1;
        console.log(`Раунд пройден! Общий счет: ${newScore}`);
        return newScore;
      });
      
      addTimeout(() => {
        if (round < ROUNDS_CONFIG.length - 1) {
          setRound(prev => prev + 1);
          startRound(round + 1);
        } else {
          setPhase('victory');
        }
      }, 1500);
    }
  };

  // Рендер заголовка
  const renderTitle = () => {
    if (phase === 'prepare') return 'Подготовьтесь...';
    if (phase === 'show') return 'Запомните комбинацию!';
    if (phase === 'input') return 'Повторите!';
    if (phase === 'win') return 'Отлично! +1';
    if (phase === 'fail') return 'Ошибка!';
    if (phase === 'victory') return 'Вы победили!';
    return '';
  };

  return (
    <Group>
      <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
        <Title level="2">{renderTitle()}</Title>
        <Text weight="1">Счет: {score} | Раунд: {round + 1}/3</Text>
      </Div>
      
      <Div style={{ padding: '20px' }}>
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '1/1',
            maxHeight: '400px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '15px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '24px',
            border: '2px solid #ccc',
            boxSizing: 'border-box'
          }}
        >
          {Array.from({ length: GRID_SIZE }).map((_, index) => {
            // Проверяем, горит ли эта конкретная ячейка
            const isActive = activeCell.index === index;
            const cellColor = isActive ? activeCell.color : '#fff';

            return (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  backgroundColor: cellColor,
                  border: `4px solid ${isActive ? activeCell.color : '#ccc'}`,
                  borderRadius: '16px',
                  cursor: phase === 'input' ? 'pointer' : 'default',
                  transition: 'background-color 0.1s, border-color 0.1s',
                  boxShadow: isActive ? `0 0 15px ${activeCell.color}` : 'none',
                  opacity: phase === 'prepare' ? 0.8 : 1
                }}
              />
            );
          })}
        </div>
      </Div>
    </Group>
  );
};