var express = require('express');
var app = express();
var server = require('http').Server(app);
app.get('/', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/msIndex.html');
});
app.get('/networksnake.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/networksnake.js');
});
app.get('/engine.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/engine.js');
});
app.get('/vector.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/vector.js');
});
app.get('/Sprites.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/Sprites.js');
});
app.get('/object.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/object.js');
});
app.get('/SceneGraph.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/SceneGraph.js');
});
app.get('/key.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/key.js');
});
app.get('/gameManager.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile(__dirname + '/gameManager.js');
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

var Sock_List = [];
var connected = 0;

io.sockets.on('connection', function (socket) {
  ++connected;
  socket.id = Math.random();
  console.log('socket connection: ' + socket.id);
  Sock_List[socket.id] = socket;
  socket.on('keyDown', function (data) {
    for (var key in Sock_List) {
      Sock_List[key].emit('keyDown', data);
    }
  });
  socket.on('keyUp', function (data) {
    for (var key in Sock_List) {
      Sock_List[key].emit('keyUp', data);
    }
  });
  socket.on('disconnect', function() {
    console.log('socket disconnect: ' + socket.id);
    --connected;
    delete Sock_List[socket.id];
  });
  //Object.keys(Sock_List);
});
