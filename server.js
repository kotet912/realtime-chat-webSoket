const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (socket) => {
  console.log('Новый пользователь подключился.');
  clients.push(socket);

  socket.on('message', (message) => {
    const msgData = JSON.parse(message.toString());
    const time = new Date().toLocaleTimeString();

    const dataToSend = {
      username: msgData.username,
      message: msgData.message,
      time: time
    };

    console.log(`[${time}] ${msgData.username}: ${msgData.message}`);

    // Рассылка сообщения всем подключенным клиентам
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(dataToSend));
      }
    });
  });


  socket.on('error', (error) => {
    console.error('Ошибка сокета:', error);
  });

  socket.onerror = function (error) {
    chat.innerHTML += '<div><em>Произошла ошибка соединения.</em></div>';
  };

  socket.onclose = function (event) {
    chat.innerHTML += '<div><em>Соединение закрыто. Попробуйте перезагрузить страницу.</em></div>';
  };
});

