import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import road_img1 from '../assets/road_img1.png';

export const Your_future = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Persik
      </PanelHeader>
      <Placeholder>
        <img width={230} src={road_img1} alt="Persik The Cat" />
      </Placeholder>
    </Panel>
  );
};

Your_future.propTypes = {
  id: PropTypes.string.isRequired,
};
