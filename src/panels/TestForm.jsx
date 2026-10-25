import { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
  Panel, 
  PanelHeader, 
  Group, 
  FormItem, 
  Input, 
  Textarea, 
  Button, 
  Div, 
  Header, 
  FormStatus,
  Spacing 
} from '@vkontakte/vkui';

export const TestForm = ({ id }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
        formData: { name, message },
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
      <PanelHeader>Тест Yandex Cloud</PanelHeader>
      
      <Group header={<Header>Проверка работы функции</Header>}>
        <FormItem top="Имя">
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Введите имя"
          />
        </FormItem>
        <FormItem top="Сообщение">
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Введите сообщение"
          />
        </FormItem>
        
        <FormItem>
          <Button 
            size="l" 
            mode="primary" 
            onClick={handleSubmit}
            loading={isLoading}
            stretched
          >
            Отправить на сервер
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