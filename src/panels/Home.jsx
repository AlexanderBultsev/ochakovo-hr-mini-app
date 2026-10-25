import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Card, Box, Text, Title, ButtonGroup } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { colors } from '../theme/colors';
import '../styles/Main.css';
import '../styles/typography.css';


export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      
      {fetchedUser && (
        <Group header={<Header size="s">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      
        <Card Component="div">

          <Box paddingInline="4xl" paddingBlock="3rem"className='main-top'>
            
            <img src='.\src\assets\logo.png'></img>
            <Box paddingInline="1xl" paddingBlock="5rem"  inlineSize="340px"><Title style={{ color: 'black' }} className='title'>Вливайся в <Title style={{ color: colors.red  }} className='title'>ОЧАКОВО</Title></Title></Box>

          </Box>
        </Card>

            <Group separator="hide" className='background-main'>
              <Box padding="system" paddingInline="4xl" paddingBlock="7rem" >

                <ButtonGroup stretched mode="vertical" gap="m">
                  <Button stretched size="l" appearance='accent' mode='primary'  onClick={() => routeNavigator.push('/your_future')}>
                    НАЧАТЬ
                  </Button>
                  <Button stretched size="l" appearance='accent' mode='outline'  onClick={() => routeNavigator.push('/persik')}>
                    ВЫЙТИ
                  </Button>
                </ButtonGroup>
              </Box>
                
            </Group>
  
          



        
      

          
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
