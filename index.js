const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const players = []

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  players.push({
    id: socket.id,
    x: 0,
    y: 0
  });

  io.emit('update_players', players);

  socket.on('update_position', ({x,y}) => {
    const index = players.findIndex(x => x.id == socket.id);
    players[index].x = x;
    players[index].y = y;
    io.emit('update_players', players);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const index = players.findIndex(x => x.id == socket.id);
    players.splice(index, 1);
    io.emit('update_players', players);
  });


});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});