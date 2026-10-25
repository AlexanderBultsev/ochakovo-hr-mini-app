import React, { useState, useEffect, useRef } from 'react';
import { Div, Group, Title, Text } from '@vkontakte/vkui';
import { colors } from '../theme/colors';

const SHAPES = ['square', 'circle', 'diamond'];
const COLOR_KEYS = ['red', 'green', 'light_green'];

export const Eng_game_1 = () => {
  const [score, setScore] = useState(0);
  const [connections, setConnections] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const dragRef = useRef({ isDragging: false, startItem: null, currentPos: null, trail: [] });
  const reqRef = useRef(null);

  useEffect(() => {
    const maxPairs = Math.min(SHAPES.length, COLOR_KEYS.length);
    const items = [];

    for (let i = 0; i < maxPairs; i++) {
      const shape = SHAPES[i];
      const color = colors[COLOR_KEYS[i]];
      const pairId = `pair-${i}`;
      
      items.push({ pairId, color, shape, id: `${pairId}-a` });
      items.push({ pairId, color, shape, id: `${pairId}-b` });
    }
    
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    
    setGridItems(items);
  }, []);

  const getItemCenter = (index) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const cols = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const cellWidth = container.clientWidth / cols;
    const cellHeight = container.clientHeight / 2;

    return {
      x: col * cellWidth + cellWidth / 2,
      y: row * cellHeight + cellHeight / 2,
    };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    
    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;

    connections.forEach(conn => {
      const startIdx = gridItems.findIndex(i => i.id === conn.from);
      const endIdx = gridItems.findIndex(i => i.id === conn.to);
      if (startIdx === -1 || endIdx === -1) return;

      const start = getItemCenter(startIdx);
      const end = getItemCenter(endIdx);

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = conn.color;
      ctx.stroke();
    });

    if (dragRef.current.isDragging && dragRef.current.startItem) {
      const startIdx = gridItems.findIndex(i => i.id === dragRef.current.startItem.id);
      const start = getItemCenter(startIdx);
      const trail = dragRef.current.trail;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      trail.forEach(point => ctx.lineTo(point.x, point.y));
      
      ctx.strokeStyle = dragRef.current.startItem.color;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  useEffect(() => {
    const loop = () => {
      draw();
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    
    return () => cancelAnimationFrame(reqRef.current);
  }, [connections, gridItems]);

  const handlePointerDown = (e, item) => {
    if (connections.some(c => c.from === item.id || c.to === item.id)) return;
    
    e.target.setPointerCapture(e.pointerId);
    const rect = containerRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    dragRef.current = { 
      isDragging: true, 
      startItem: item, 
      currentPos: pos, 
      trail: [pos] 
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    dragRef.current.currentPos = pos;
    dragRef.current.trail.push(pos);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const targetEl = document.elementFromPoint(e.clientX, e.clientY);
    const shapeEl = targetEl?.closest('[data-item-id]');
    const hoveredItemId = shapeEl?.getAttribute('data-item-id');

    if (hoveredItemId) {
      const hoveredItem = gridItems.find(i => i.id === hoveredItemId);
      const startItem = dragRef.current.startItem;

      if (hoveredItem && hoveredItem.pairId === startItem.pairId && hoveredItem.id !== startItem.id) {
        setConnections(prev => [
          ...prev, 
          { from: startItem.id, to: hoveredItem.id, color: startItem.color }
        ]);
        setScore(prev => {
          const newScore = prev + 1;
          return newScore;
        });
      }
    }

    dragRef.current = { isDragging: false, startItem: null, currentPos: null, trail: [] };
  };

  const renderShape = (shape, color) => {
    const baseStyle = { width: 40, height: 40, backgroundColor: color };
    if (shape === 'circle') return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
    if (shape === 'diamond') return <div style={{ ...baseStyle, transform: 'rotate(45deg)' }} />;
    return <div style={{ ...baseStyle }} />;
  };

  return (
    <Group>
      <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level="2">Восстанови питание</Title>
        <Text weight="1">Счет: {score}</Text>
      </Div>
      
      <Div style={{ padding: '20px' }}>
        <div 
          ref={containerRef}
          style={{ 
            position: 'relative', width: '100%', height: '400px',
            border: '2px solid #ccc', borderRadius: '12px',
            overflow: 'hidden', touchAction: 'none', backgroundColor: '#fff'
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            width: '100%', height: '100%', position: 'relative', zIndex: 2,
            padding: '20px', boxSizing: 'border-box'
          }}>
            {gridItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  id={`shape-${item.id}`}
                  data-item-id={item.id}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    opacity: connections.some(c => c.from === item.id || c.to === item.id) ? 0.3 : 1,
                    transition: 'opacity 0.2s', cursor: 'pointer', padding: '20px', userSelect: 'none'
                  }}
                >
                  {renderShape(item.shape, item.color)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Div>
    </Group>
  );
};