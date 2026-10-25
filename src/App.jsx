import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner, Div } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Persik, Home, Your_future, Vacancy_choose, RoadMap, TestPage} from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { LoaderSVG } from './components/LoaderSVG';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner state="custom" mode="shadow" customIcon={<LoaderSVG />} />);

useEffect(() => {
    let isMounted = true;

    // Таймаут-предохранитель: если ВК не ответит за 1 сек, убираем спиннер
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setPopout(null);
    }, 1000);

    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        if (isMounted) setUser(user);
      } catch (e) {
        console.warn('VK Bridge недоступен локально:', e);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimeout); // Отменяем таймаут, так как ВК ответил
          setPopout(null);
        }
      }
    }
    
    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" fetchedUser={fetchedUser} />
          <Persik id="persik" />
          <Your_future id="your_future" />
          <Vacancy_choose id="vacancy_choose" />
          <RoadMap id="roadmap" />
          <TestPage id="testpage" />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
