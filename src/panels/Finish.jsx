import { useState } from 'react';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Group, FormItem, Input, Textarea, Checkbox, NativeSelect, Button, Div, Box,Title,Header, Text, FormStatus, Spacing } from '@vkontakte/vkui';
import { colors } from '../theme/colors';
import '../styles/Finish.css';
import '../styles/typography.css';

export const Finish = ({ id }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [prof, setprof] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const routeNavigator = useRouteNavigator();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд на ответ

    try {
      let launchParams = '';
      try {
        // Оборачиваем вызов в Promise.race, чтобы не ждать вечно
        launchParams = await Promise.race([
          bridge.send('VKWebAppGetLaunchParams'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Bridge timeout')), 1000))
        ]);

        if (typeof launchParams !== 'string') {
            launchParams = new URLSearchParams(launchParams).toString();
        }
      } catch (e) {
        console.warn('VK Bridge не ответил (локальный тест):', e.message);
        launchParams = 'vk_user_id=123&sign=test'; 
      }

      const payload = {
        formData: { name, phone, message },
        launchParams: launchParams
      };

      console.log('Отправляем запрос на сервер...', payload);

      const response = await fetch('https://functions.yandexcloud.net/d4eehp3e5kldelpc86kh', {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain' 
        },
        body: JSON.stringify(payload),
        signal: controller.signal 
      });

      clearTimeout(timeoutId); 
      console.log('Получен ответ от сервера, статус:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Ошибка сервера: ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Ошибка при запросе:', err);
      
      if (err.name === 'AbortError') {
        setError('Превышено время ожидания ответа от сервера (10 секунд).');
      } else if (err.message === 'Failed to fetch') {
        setError('Ошибка сети. Возможно, блокировка CORS или сервер Yandex Cloud выключен. Проверьте вкладку Network (Сеть) в браузере.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Panel id={id}>
      
        <button 
            className="test-page__back-btn" 
            onClick={() => routeNavigator.back()}
            type="button"
            aria-label="Назад"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>

      <Box paddingInline="4xl" paddingBlock="1rem"  inlineSize="350px">
        <Title style={{ color: 'black' }} className='title'>Давай познакомимся поближе!</Title>
        <Text className='text'>Напиши свои данные - это поможет нам не потерять связь!</Text>
      </Box>
      <Group>
        <FormItem top="ФИО" >
          <Input className='inp'
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Иван Иванов Иванович"
          />
        </FormItem>

        <FormItem top="Номер телефона" >
          <Input className='inp'
            value={phone} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="+7"
          />
        </FormItem>

        <FormItem top="Email">
          <Textarea className='inp'
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@mail.ru"
          />
        </FormItem>
        
        <FormItem>
            <Text style={{ color: 'black' }}>Интересующая вакансия</Text>
            <NativeSelect className='inp' value={prof} onChange={(_, newProf) => setGender(newProf)}>
                <option value="1">Инженер</option>
                <option value="2">Химик</option>
                <option value="3">Линейный персонал</option>
            </NativeSelect>
        </FormItem>

        <FormItem>
            <Checkbox name="notifications" >Я согласен на обработку персональных данных</Checkbox>
        </FormItem>

        <FormItem>
          <Button 
            size="l" 
            mode="primary" 
            onClick={handleSubmit}
            loading={isLoading}
            stretched
          >
            Отправить
          </Button>
        </FormItem>

        {error && (
          <>
            <Spacing size={16} />
            <Div>
              <FormStatus header="Ошибка отправки" mode="error">
                {error}
                <br/>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>
                  (Локально ошибка 403 Invalid signature — это ожидаемо и правильно)
                </span>
              </FormStatus>
            </Div>
          </>
        )}

        {result && (
          <>
            <Spacing size={16} />
            <Div>
              <FormStatus header="Успех! Данные получены" mode="valid">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </FormStatus>
            </Div>
          </>
        )}
      </Group>
    </Panel>
  );
};