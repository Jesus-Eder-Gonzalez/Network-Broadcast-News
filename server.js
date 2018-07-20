'use strict';

const net = require('net');
const readline = require('readline');

let users = [];
let screen = process.stdout;
let keyboardInput = readline.createInterface(process.stdin, process.stdout);

const newsBroadcaster = net.createServer();

newsBroadcaster.on('connection', (socket) => {
  let sAddress = socket.address();
  socket.setEncoding('UTF8');
  if(!socket.id){
    socket.id = Math.floor(Math.random() * 60000);
  }

  socket.userName = `${socket.id}[${sAddress.address}:${sAddress.port}]`;

  screen.write(`CONNECTED: USER: ${socket.userName}\n`);
  socket.write(`CONNECTED TO: ${sAddress.address}:${sAddress.port}\n`);

  users.push(socket);
  socket.on('data', function (data) {
    if(data.toString().includes('ID:')){
      socket.customId = data.split(' ')[1];
      socket.customId = `${socket.customId === 'ADMIN' || socket.customId === 'admin'? `${socket.id}`:`${socket.customId}`}`
      
      socket.userName = `${socket.customId} [${sAddress.address}:${sAddress.port}]`;
    } else {
      screen.write(`SERVER BCSAST FROM ${socket.userName}: ${data}\n`);
      users.forEach(user => user.write(`${socket.userName}: "${data}"\n`));
    }
  });

  socket.on('close', () => {
    let index = users.indexOf(socket);
    users.splice(index, 1);
    screen.write(`CLOSED: ${socket.userName}\n`);
  });
});

keyboardInput.on('line', (line) => {
  screen.write(`[ADMIN]: "${line}"\n`);
  users.forEach(user => user.write(`[ADMIN]: "${line}"\n`));
});


process.on('SIGINT', () => {
  users.forEach(user => {
    user.end(`SERVER DISCONNECTED\n`)
    user.destroy();
  });
  newsBroadcaster.close();
  process.exit(0);
});

newsBroadcaster.listen(6969, '0.0.0.0', () => {
  screen.write('Server listening on 0.0.0.0:6969\r');
});