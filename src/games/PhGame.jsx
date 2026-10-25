import React, { useState, useEffect, useRef } from 'react';
import './PhGame.css';
import flask1 from '../assets/bottle1.png';
import flask2 from '../assets/bottle2.png';
import flask3 from '../assets/bottle3.png';

// Заглушки для картинок колб (замените на свои импорты)
const FLASKS = [ flask1, flask2, flask3 ];

export const PhGame = () => {
  const [level, setLevel] = useState(0);
  const [targetPh, setTargetPh] = useState(0);
  const [currentPh, setCurrentPh] = useState(0); // Значение на шкале (от 0 до 14)
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');

  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Инициализация раунда
  const startRound = () => {
    // Генерируем случайный pH от 1 до 13 (с одним знаком после запятой)
    const randomPh = (Math.random() * 12 + 1).toFixed(1);
    setTargetPh(parseFloat(randomPh));
    // Начинаем шкалу всегда с 0
    setCurrentPh(0);
    setMessage('');
    setIsChecking(false);
  };

  useEffect(() => {
    startRound();
  }, []);

  // Обработка перемещения ползунка
  const handlePointerDown = (e) => {
    if (isChecking) return;
    isDraggingRef.current = true;
    updateSliderValue(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || isChecking) return;
    updateSliderValue(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current || isChecking) return;
    isDraggingRef.current = false;
    checkResult();
  };

  const updateSliderValue = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    // Вычисляем процент от 0 до 1
    let percent = (clientX - rect.left) / rect.width;
    // Ограничиваем от 0 до 1
    percent = Math.max(0, Math.min(1, percent));
    // Переводим в pH (от 0 до 14)
    const ph = percent * 14;
    setCurrentPh(ph);
  };

  // Проверка результата
  const checkResult = () => {
    setIsChecking(true);
    const diff = Math.abs(currentPh - targetPh);
    
    // Погрешность 0.5 (можно изменить)
    if (diff <= 0.5) {
      setScore(s => s + 1);
      setMessage('Отлично!');
      
      // Переход на следующий уровень или рестарт
      setTimeout(() => {
        if (level < FLASKS.length - 1) {
          setLevel(prev => prev + 1);
          startRound();
        } else {
          setMessage('Победа! Все уровни пройдены.');
        }
      }, 1500);
    } else {
      setMessage('Промах! Попробуйте еще раз.');
      setTimeout(() => {
        // Возвращаем ползунок в начало для повторной попытки
        setCurrentPh(0);
        setIsChecking(false);
        setMessage('');
      }, 1500);
    }
  };

  return (
    <div className="ph-game-container">
      {/* Заголовок */}
      <div className="ph-header">
        <h2>Определи кислотность (pH) напитка</h2>
      </div>

      {/* Основная сцена с колбой */}
      <div className="ph-scene">
        <img src={FLASKS[level]} alt="Flask" className="flask-image" />
      </div>

      {/* Шкала */}
      <div className="slider-wrapper">
        <div 
          className="slider-track" 
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Цветовой градиент (кислотность) */}
          <div className="slider-gradient" />
          
          {/* Ползунок */}
          <div className="slider-thumb" 
            style={{ left: `${(currentPh / 14) * 100}%` }}
          >
          </div>
        </div>

        {/* Подписи под шкалой */}
        <div className="slider-labels">
          <span>&gt;1,5 к. ед.</span>
          <span>1,5 - 7,0 к. ед.</span>
          <span>&gt;7,0 к. ед.</span>
        </div>
      </div>

      {/* Нижняя панель (HP и текущий pH) */}
      <div className="bottom-panel">
        <div className="target-ph-box">
          <div className="ph-title">pH</div>
          <div className="ph-value">{targetPh}</div>
          <div className="ph-subtext">Нужно попасть</div>
        </div>
        
        <div className="current-ph-box">
          <div className="ph-value" style={{ color: '#000' }}>
            {currentPh.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Сообщение (успех/ошибка) */}
      {message && <div className="message-toast">{message}</div>}
    </div>
  );
};