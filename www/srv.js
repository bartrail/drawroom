"use strict";

const fs          = require('fs');
const express     = require('express');
const http        = require('http');
const https       = require('https');
const app         = express();
const server      = http.Server(app);
const io          = require('socket.io')(server);
const certOptions = {
  key  : fs.readFileSync("../ca/privkey.pem"),
  cert : fs.readFileSync("../ca/fullchain.pem")
};
const sslServer   = https.Server(certOptions, app);
const sslIO       = require('socket.io')(sslServer);

// app.get('/', function(req, res) {
//   res.send('hello world 123');
//   console.log('new user 123 234234');
//   if (req.param('test')) {
//     console.log(req.param('test'));
//     throw new Error(req.param('test'));
//   }
// });

app.use('/', express.static(__dirname + '/public'));

server.listen(80);
server.listen(3000, function() {
  console.log('listening on *:3000');
});
io.on('connection', function(socket) {
  console.log('a user connected');
  socket.emit('news', {hello : 'world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
});

sslServer.listen(443);
sslServer.listen(3000, function() {
  console.log('listening on *:3000');
});

sslIO.on('connection', function(socket) {
  console.log('a ssl user connected');
  socket.emit('news', {hello : 'ssl world'});
  socket.on('my other event', function(data) {
    console.log(data);
  });
});

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8080/");