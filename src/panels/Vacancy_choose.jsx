import {Panel, PanelHeader, Header, Group, Box, Text, Placeholder, } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import { Vacancy } from '../components/Vacancy.jsx';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import { colors } from '../theme/colors';

export const Vacancy_choose = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  const handleSelect = async (vacancyId, route) => {
    // 1. Сохраняем в VK Storage (с защитой от зависания локально)
    try {
      // Promise.race: либо сохраняем, либо ждем 1 секунду и идем дальше
      await Promise.race([
        bridge.send('VKWebAppStorageSet', {
          key: 'selected_vacancy',
          value: String(vacancyId)
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Bridge timeout')), 1000))
      ]);
      console.log(`[VK Storage] Сохранено значение: ${vacancyId}`);
    } catch (e) {
      console.warn('[VK Storage] Пропущено (локальный тест или ошибка):', e.message);
    }

    // 2. Сохраняем в localStorage (для отладки в браузере)
    try {
      localStorage.setItem('debug_selected_vacancy', vacancyId);
      console.log(`[Local Storage] Сохранено значение: ${vacancyId}`);
    } catch (e) {
      console.error('[Local Storage] Ошибка сохранения:', e);
    }

    // 3. Сразу же читаем из VK Storage (тоже с защитой)
    try {
      const result = await Promise.race([
        bridge.send('VKWebAppStorageGet', { keys: ['selected_vacancy'] }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Bridge timeout')), 1000))
      ]);
      
      if (result.keys && result.keys.length > 0) {
        console.log(`[VK Storage] Проверка чтения. В хранилище лежит: ${result.keys[0].value}`);
      }
    } catch (e) {
      console.warn('[VK Storage] Чтение пропущено (локальный тест):', e.message);
    }

    // 4. Переходим на следующий экран
    routeNavigator.push(route);
  };

  return (
    <Panel id={id}>
        <Box paddingInline="12%" paddingBlock="5rem"  >
            <Group>
                <Vacancy
                title="Инженерные специальности"
                text="Техника, оборудование, инновации"
                backgroundColor={colors.red}
                image={icon1}
                onClick={() => handleSelect(0, '/roadmap')} 
                />

                <Vacancy
                title="Профильные специалисты"
                text="Химия, технологии, лаборатория"
                backgroundColor={colors.green}
                image={icon2}
                onClick={() => handleSelect(1, '/roadmap')} 
                />
            

                <Vacancy
                title="Линейный персонал"
                text="Производство, склады, доставка"
                backgroundColor={colors.light_gray}
                image={icon3}
                onClick={() => handleSelect(2, '/roadmap')} 
                />
            </Group>
        </Box>
    </Panel>
  );
};

Vacancy_choose.propTypes = {
  id: PropTypes.string.isRequired,
};