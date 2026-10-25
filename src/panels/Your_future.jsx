import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Card, Box, Text, Title, Placeholder } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import road_img1 from '../assets/road_img1.png';
import { colors } from '../theme/colors';
import '../styles/typography.css';

export const Your_future = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <Placeholder>
        <img width={350} src={road_img1} alt="road_img1" />
        <Box paddingInline="1xl" paddingBlock="2rem"  inlineSize="240px"><Title style={{ color: 'black' }} className='title'>Твое будущее </Title></Box>
        <Box inlineSize="240px" ><Text align='start'>Пройди короткий путь и узнай, какая работа в Очаково подходит именно тебе</Text></Box>
        <Box  paddingBlock="2.5rem">
          <Button stretched size="l" appearance='accent' mode='primary' onClick={() => routeNavigator.push('/vacancy_choose')}>
            Далее
          </Button>
        </Box>
      </Placeholder>
    </Panel>
  );
};

Your_future.propTypes = {
  id: PropTypes.string.isRequired,
};
