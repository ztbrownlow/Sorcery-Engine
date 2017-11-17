var express = require('express');
var app = express();
var server = require('http').Server(app);
app.get('/', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/index.html');
});

var port = 2000

server.listen(port /* port */, function () {
  console.log('listening on port '+port);
});

var io = require('socket.io')(server,{});
/*
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
});*/

var Sock_List = {};

io.sockets.on('connection', function (socket) {
  socket.id = Math.random();
  console.log('socket connection: ' + socket.id);
  Sock_List[socket.id] = socket;
  socket.emit('news', {hello:'world'});
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function() {
    console.log('socket disconnect: ' + socket.id);
    Sock_List[socket.id] = undefined;
  });
});

