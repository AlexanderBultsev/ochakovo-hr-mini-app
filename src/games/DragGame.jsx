import React, { useState, useEffect, useRef } from 'react';
import './DragGame.css';
import lemonade1 from '../assets/limonad-1.png';
import lemonade2 from '../assets/limonad-2.png';
import kvass1 from '../assets/kvas-1.png';
import kvass2 from '../assets/kvas-2.png';

const LEMONADE_IMAGES = [lemonade1, lemonade2];
const KVASS_IMAGES = [kvass1, kvass2];

export const DragGame = () => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  
  const [dragState, setDragState] = useState({
    isDragging: false,
    isReturning: false,
    item: null,
    startX: 0, startY: 0, currentX: 0, currentY: 0,
    clickOffsetX: 0, clickOffsetY: 0, // Смещение клика внутри карточки
    isOverCorrect: false,
  });

  const containerRefs = { lemonade: useRef(null), kvass: useRef(null) };

  useEffect(() => {
    // Генерируем массив с 30 случайно распределенными товарами
    // 15 лимонадов и 15 квасов
    const generatedItems = Array.from({ length: 30 }).map((_, i) => {
      // Определяем тип (чередуем)
      const isLemonade = i % 2 === 0;
      const type = isLemonade ? 'lemonade' : 'kvass';
      
      // Выбираем случайную картинку из пула нужного типа
      const imagesPool = isLemonade ? LEMONADE_IMAGES : KVASS_IMAGES;
      const randomImg = imagesPool[Math.floor(Math.random() * imagesPool.length)];

      return {
        id: i,
        type,
        img: randomImg,
        isRemoved: false,
      };
    });

    // Перемешиваем Фишером-Йетсом
    for (let i = generatedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedItems[i], generatedItems[j]] = [generatedItems[j], generatedItems[i]];
    }
    
    setItems(generatedItems);
  }, []);

  const activeItem = items.find(item => !item.isRemoved);

  const handlePointerDown = (e) => {
    if (!activeItem || dragState.isReturning) return;
    const target = e.target.closest('.tape-item');
    if (!target || target.getAttribute('data-id') !== String(activeItem.id)) return;

    e.preventDefault();

    // Вычисляем, куда именно внутри карточки пришелся клик
    const rect = target.getBoundingClientRect();
    const clickOffsetX = e.clientX - rect.left;
    const clickOffsetY = e.clientY - rect.top;

    setDragState({
      isDragging: true, 
      isReturning: false, 
      item: activeItem,
      startX: e.clientX, 
      startY: e.clientY, 
      currentX: e.clientX, 
      currentY: e.clientY, 
      clickOffsetX,
      clickOffsetY,
      isOverCorrect: false
    });
  };

  useEffect(() => {
    if (!dragState.isDragging) return;

    const onPointerMove = (e) => {
      const { clientX, clientY } = e;
      const checkHover = (rect) => rect && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      
      const isLemonade = checkHover(containerRefs.lemonade.current?.getBoundingClientRect());
      const isKvass = checkHover(containerRefs.kvass.current?.getBoundingClientRect());
      
      const isCorrect = (isLemonade && activeItem.type === 'lemonade') || (isKvass && activeItem.type === 'kvass');

      setDragState(prev => ({ ...prev, currentX: clientX, currentY: clientY, isOverCorrect: isCorrect }));
    };

    const onPointerUp = () => {
      setDragState(prev => {
        if (prev.isOverCorrect) {
          // УСПЕХ
          setItems(itemsPrev => 
            itemsPrev.map(item => item.id === prev.item.id ? { ...item, isRemoved: true } : item)
          );
          setScore(s => s + 1);
          // ВАЖНО: сбрасываем isOverCorrect
          return { ...prev, isDragging: false, item: null, isOverCorrect: false };
        } else {
          // ОШИБКА
          requestAnimationFrame(() => {
            setDragState({ ...prev, isDragging: false, isReturning: true, currentX: 0, currentY: 0, isOverCorrect: false });
            setTimeout(() => setDragState({ isDragging: false, isReturning: false, item: null, startX: 0, startY: 0, currentX: 0, currentY: 0, clickOffsetX: 0, clickOffsetY: 0, isOverCorrect: false }), 300);
          });
          return { ...prev, isDragging: false, isReturning: true, isOverCorrect: false };
        }
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [dragState.isDragging, activeItem]);

  // Вычисляем позицию левого верхнего угла "призрака"
  // (Текущая позиция мыши минус смещение, которое было при клике)
  const ghostLeft = dragState.isDragging 
    ? dragState.currentX - dragState.clickOffsetX 
    : dragState.startX - dragState.clickOffsetX;
    
  const ghostTop = dragState.isDragging 
    ? dragState.currentY - dragState.clickOffsetY 
    : dragState.startY - dragState.clickOffsetY;

  return (
    <div className="game-container">
      <div className="header">
        <h2>Перетащи товары</h2>
        <span className="score">Счет: {score}</span>
      </div>

      <div className="tape-wrapper" onPointerDown={handlePointerDown}>
        {items.map((item) => {
          const isActive = item.id === activeItem?.id;
          const isDraggingThis = isActive && dragState.isDragging;
          
          return (
            <div
              key={item.id}
              data-id={item.id}
              className="tape-item"
              style={{
                width: item.isRemoved ? 0 : 100,
                marginRight: item.isRemoved ? 0 : 15,
                opacity: item.isRemoved ? 0 : (isActive && (dragState.isDragging || dragState.isReturning) ? 0 : 1),
                border: isActive ? '2px solid #D50032' : 'none',
                pointerEvents: item.isRemoved ? 'none' : 'auto',
                touchAction: isActive ? 'none' : 'auto',
              }}
            >
              <img src={item.img} alt={item.type} draggable={false} />
            </div>
          );
        })}
      </div>

            <div className="containers-wrapper">
        <div 
          ref={containerRefs.lemonade} 
          className={`drop-zone lemonade ${dragState.isOverCorrect && activeItem?.type === 'lemonade' ? 'hover-correct' : ''}`}
        >
          {/* Добавляем слот для картинки */}
          <div className="slot"></div>
          <span>Лимонад</span>
        </div>
        
        <div 
          ref={containerRefs.kvass} 
          className={`drop-zone kvass ${dragState.isOverCorrect && activeItem?.type === 'kvass' ? 'hover-correct' : ''}`}
        >
          {/* Добавляем слот для картинки */}
          <div className="slot"></div>
          <span>Квас</span>
        </div>
      </div>

      {(dragState.isDragging || dragState.isReturning) && dragState.item && (
        <div
          className={`drag-ghost ${dragState.isReturning ? 'returning' : ''}`}
          style={{
            left: ghostLeft,
            top: ghostTop,
          }}
        >
          <img src={dragState.item.img} alt="dragging" draggable={false} />
        </div>
      )}
    </div>
  );
};