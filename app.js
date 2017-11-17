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

var Sock_List = {};
var connected = 0;
var running = false;

io.sockets.on('connection', function (socket) {
  running = (++connected == 2);
  socket.paused = false;
  socket.id = Math.random();
  if (running) {
    socket.emit('setup', null);
    socket.emit('setPlayer', 2);
    for (var key in Sock_List) {
      if (Sock_List[key].id != socket.id) {
        Sock_List[key].emit('player', 1);
      }
    }
  }
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
  socket.on('setup', function (data) {
    for (var key in Sock_List) {
      Sock_List[key].emit('setup', data);
    }
  });
  socket.on('disconnect', function() {
    console.log('socket disconnect: ' + socket.id);
    delete Sock_List[socket.id];
    running = (--connected == 2);
    if (running) {
      socket.emit('setup', null);
      Object.keys(Sock_List).forEach(function(k,i) { Sock_List[k].emit('player', i+1); });
    }
  });
  socket.on('pause', function(data) {
    socket.paused = data;
    running = !data;
    if (!data) {
      for (var key in Sock_List) {
        var sock = Sock_List[key];
        if (sock.paused) {
          running = false;
          break;
        }
      }
    }
  });
  //Object.keys(Sock_List);
});

setInterval(function(){
  if (running) {
    for (var key in Sock_List) {
      Sock_List[key].emit('tick', null);
    }
  }
}, 100);