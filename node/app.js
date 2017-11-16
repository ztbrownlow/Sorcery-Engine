var express = require('express');
var app = express();
var server = require('http').Server(app);
app.get('/', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendfile(__dirname + '/index.html');
});

server.listen(2000 /* port */);

var io = require('socket.io')(server,{});
var Sock_List = {};
io.sockets.on('connection', function(socket) {
  console.log('socket connection');
  socket.id = Math.random();
  Sock_List[socket.id] = socket;
  socket.on('gameloop', function(data){
    console.log(data);
  });
  socket.on('keyPress', function(data){ //socket.emit
    console.log(data)
  });
});