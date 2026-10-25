import {Panel, PanelHeader, Header, Group, Box, Text, Placeholder, } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Vacancy } from '../components/Vacancy.jsx';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import { colors } from '../theme/colors';

export const TestPage = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
        <Box paddingInline="12%" paddingBlock="5rem"  >
            <Group>
                <Vacancy
                title="Инженерные специальности"
                text="Техника, оборудование, инновации"
                backgroundColor={colors.red}
                image={icon1}
                onClick={() => routeNavigator.push('/roadmap')} 
                />

                <Vacancy
                title="Профильные специалисты"
                text="Химия, технологии, лаборатория"
                backgroundColor={colors.green}
                image={icon2}
                onClick={() => routeNavigator.push('/roadmap')} 
                />
            

                <Vacancy
                title="Линейный персонал"
                text="Производство, склады, доставка"
                backgroundColor={colors.light_gray}
                image={icon3}
                onClick={() => routeNavigator.push('/roadmap')} 
                />
            </Group>
        </Box>
    </Panel>
  );
};

TestPage.propTypes = {
  id: PropTypes.string.isRequired,
};