import { useState } from 'react';
import { Card, Title, Text, Box } from '@vkontakte/vkui';
import { colors } from '../theme/colors';

export function Vacancy({
  title,
  text,
  backgroundColor = colors.backgroundSecondary,
  image,
  onClick,
}) {
  const [state, setState] = useState('default'); 

  return (
    <Card
      mode="shadow"
      onClick={onClick}
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('default')}
      onMouseDown={() => setState('active')}
      onMouseUp={() => setState('hover')}
      style={{
        margin: '3rem 0',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
        minHeight: 120,
        backgroundColor,
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '35% 90%',
        cursor: onClick ? 'pointer' : 'default',
        filter:
          state === 'active'
            ? 'brightness(0.85)'
            : state === 'hover'
            ? 'brightness(0.75)'
            : 'none',
        transform: state === 'active' ? 'scale(0.98)' : 'none',
        transition: 'filter 0.15s ease, transform 0.1s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      <Box style={{ position: 'relative', padding: 16, maxWidth: '60%' }}>
        <Title level="3" style={{ color: colors.textPrimary }}>{title}</Title>
        <Text style={{ color: colors.textSecondary, marginTop: 4 }}>{text}</Text>
      </Box>
    </Card>
  );
}