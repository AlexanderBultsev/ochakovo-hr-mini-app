import { useState } from 'react';
import { Panel, Box, Text, Title } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { CenterModal } from '../components/CenterModal';
import { GameStart, GameWorkshop, GameLab } from '../games';
import { colors } from '../theme/colors.js';
import red_flag from '../assets/red flag.png';
import green_flag from '../assets/green flag.png';
import star from '../assets/star.png';
import road from '../assets/road.png';

export const POINTS = [
  { id: '1', icon: green_flag, top: '80%', left: '12%', caption: 'Старт',       type: 'modal', Game: GameStart },
  { id: '2', icon: red_flag,   top: '70%', left: '62%', caption: 'Цех №1',      type: 'modal', Game: GameWorkshop },
  { id: '3', icon: red_flag,   top: '35%', left: '68%', caption: 'Лаборатория', type: 'modal', Game: GameLab },
  { id: '4', icon: red_flag,   top: '50%', left: '10%', caption: 'Склад',       type: 'page',  path: '/testpage' },
  { id: '5', icon: star,       top: '0%',  left: '16%', caption: 'Финиш',       type: 'page',  path: '/finish' },
];

export const RoadMap = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const [activeModal, setActiveModal] = useState(null);
  const currentPoint = POINTS.find((p) => p.id === activeModal);

  const handlePointClick = (point) => {
    if (point.type === 'page') {
      routeNavigator.push(point.path);
    } else {
      setActiveModal(point.id);
    }
  };

  return (
    <Panel id={id}>
      <Box paddingInline="12%" paddingBlock="5rem">
        <Title style={{ color: 'black' }}>
          Твой путь в <span style={{ color: colors.red }}>ОЧАКОВО</span>
        </Title>
      </Box>

      <Box padding="s">
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1.65',
            maxWidth: 480,
            margin: '0 auto',
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: colors.backgroundSecondary,
            backgroundImage: `url(${road})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '40% 100%',
          }}
        >
          {POINTS.map((point) => (
            <div
              key={point.id}
              style={{
                position: 'absolute',
                top: point.top,
                left: point.left,
                width: '18%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <button
                type="button"
                aria-label={point.caption}
                onClick={() => handlePointClick(point)}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  padding: 0,
                  border: 'none',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'transparent',

                }}

              >
                <img
                  src={point.icon}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>

              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 12,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {point.caption}
              </Text>
            </div>
          ))}
        </div>
      </Box>

      <CenterModal
        open={!!activeModal}
        title={currentPoint?.caption}
        onClose={() => setActiveModal(null)}
      >
        {currentPoint?.Game && (
          <currentPoint.Game onClose={() => setActiveModal(null)} />
        )}
      </CenterModal>
    </Panel>
  );
};

RoadMap.propTypes = {
  id: PropTypes.string.isRequired,
};