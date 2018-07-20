'use strict';

const net = require('net');
const readline = require('readline');

let keyboardInput = readline.createInterface(process.stdin, process.stdout);
keyboardInput.question('Create Username: ', clientCreate);

function clientCreate(userName) {
  let newsClient = net.createConnection(6969, '0.0.0.0', () => {
    newsClient.setEncoding('UTF8');
    newsClient.write(`${userName?`ID: ${userName}`:''}`);
  });

  newsClient.on('data', (data) => {
    process.stdout.write(data);
  });

  keyboardInput.on('line', (line) => {
    newsClient.write(line);
  });

  keyboardInput.on('close', () => {
    newsClient.end();
  });

  newsClient.on('end', () => {
    newsClient.destroy();
    process.exit(0);
  });
}


// keyboardInput.on('SIGINT', () => {
//   newsClient.end();
//   process.exit(0);
// });



