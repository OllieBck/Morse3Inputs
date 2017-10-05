var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 9111 });

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);

      wss.clients.forEach(function each(client){
        if (client !== ws) client.send(message);
      });
    });

    ws.send('connected');
  });

  console.log("server on 9111");
