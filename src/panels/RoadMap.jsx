import { useState } from 'react';
import { Panel, Box, Text, Title } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { VideoInfoModal } from '../components/VideoInfoModal/VideoInfoModal';
import { Eng_game_1 } from '../games/Eng_game_1';
import { CenterModal } from '../components/CenterModal';
import { colors } from '../theme/colors.js';
import red_flag from '../assets/red flag.png';
import green_flag from '../assets/green flag.png';
import star from '../assets/star.png';
import road from '../assets/road.png';

export const POINTS = [
  {
    id: '1',
    icon: green_flag,
    top: '80%',
    left: '12%',
    caption: 'Старт',
    type: 'video',
    quote: 'Работа в компании, которую знает вся страна - это уже повод для гордости!',
    title: 'Компания с историей и характером',
    text: 'Наша история началась в 1978 году, когда нам поручили утолять жажду гостей Олимпиады-80 в Москве. \n\n Мы всегда были первыми: в 1994 году именно мы первыми в мире начали разливать пиво в пластиковые бутылки , а в 1995 — выпустили первое российское пиво в алюминиевых банках. В 1998 году создали тот самый квас «Очаковский», который знают миллионы! \n\n Сегодня «Очаково» — это крупнейшее российское предприятие без иностранного капитала. Заводы в Москве, Краснодаре, Пензе и Тюмени, собственные виноградники на Тамани. Наши напитки пьют в 60 регионах России и более чем в 30 странах мира.',
  },
  {
    id: '2',
    icon: red_flag,
    top: '70%',
    left: '62%',
    caption: 'Изучение специальности',
    type: 'video',
    quote: 'Качество — это не случайность',
    title: 'Инженерные специальности:',
    text: 'Ты попадешь на современное производство. Твои задачи: работа на автоматизированных линиях. (машины этикетки, упаковки, выдува), замена комплектующих, оцифровка производственной линии и оптимизация процессов. Ты управляешь современной техникой.',
  },
  {
    id: '3',
    icon: red_flag,
    top: '50%',
    left: '10%',
    caption: 'Игра',
    type: 'game',
    title: 'Игра',
  },
  { id: '4', icon: red_flag, top: '35%', left: '68%', caption: 'Контрольные вопросы', type: 'page', path: '/testpage' },
  { id: '5', icon: star,     top: '0%',  left: '16%', caption: 'Встреча с HR', type: 'page', path: '/finish' },
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
                  padding: 0,
                  border: 'none',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'transparent',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={point.icon}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>

              <Text
                style={{
                  color: 'black',
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

      <VideoInfoModal
        open={currentPoint?.type === 'video'}
        onClose={() => setActiveModal(null)}
        quote={currentPoint?.quote}
        title={currentPoint?.title}
        text={currentPoint?.text}
      />


      <CenterModal
        open={currentPoint?.type === 'game'}
        onClose={() => setActiveModal(null)}
      >
        {currentPoint?.type === 'game' && (
          <Eng_game_1 onClose={() => setActiveModal(null)} />
        )}
      </CenterModal>
    </Panel>
  );
};

RoadMap.propTypes = {
  id: PropTypes.string.isRequired,
};