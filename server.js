const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (socket) => {
  console.log('Новый пользователь подключился.');
  clients.push(socket);

  socket.on('message', (message) => {
    console.log('Получено сырое сообщение:', message.toString());

    let msgData;
    try {
      msgData = JSON.parse(message.toString());
    } catch (error) {
      console.error('Ошибка при парсинге JSON:', error);
      return; // Прерываем обработку, если сообщение не является валидным JSON
    }

    const time = new Date().toLocaleTimeString();
    const dataToSend = {
      username: msgData.username || 'Аноним',
      message: msgData.message || '',
      time: time,
    };

    console.log(`[${time}] ${dataToSend.username}: ${dataToSend.message}`);

    // Рассылка сообщения всем подключенным клиентам
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(dataToSend));
      }
    });
  });

  socket.on('close', () => {
    console.log('Пользователь отключился.');
    clients = clients.filter((client) => client !== socket);
  });

  socket.on('error', (error) => {
    console.error('Ошибка сокета:', error);
  });
});
