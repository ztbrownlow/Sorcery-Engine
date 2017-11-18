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
var highscoresJSON = require('./highscores.json');
var Sock_List = {};
var connected = 0;
var running = false;

var foodPlacement = null;

var highScores = [["empty", 0],["empty", 0],["empty", 0]]

function forwardToAllSockets(sock, type, process) {
  sock.on(type, function (data) {
    if (process) {
      process(data);
    }
    for (var key in Sock_List) {
      Sock_List[key].emit(type, data);
    }
  });
}

io.sockets.on('connection', function (socket) {
  socket.on('load', function (data) {
    socket.emit('highscore',highScores)
    socket.id = Math.random();
    Sock_List[socket.id] = socket;
    socket.paused = true;
    running = false;
    if (++connected == 2) {
      var player = 1;
      for (var key in Sock_List) {
        console.log(key);
        Sock_List[key].emit('player', player++);
      }
      for (var key in Sock_List) {
        Sock_List[key].emit('setup', null);
      }
    } else {
      for (var key in Sock_List) {
        Sock_List[key].emit('waiting', connected);
      }
    }
    console.log('socket connection: ' + socket.id);
    forwardToAllSockets(socket, 'keyDown');
    forwardToAllSockets(socket, 'keyUp');
    forwardToAllSockets(socket, 'setup');
    forwardToAllSockets(socket, 'food');
    forwardToAllSockets(socket, 'highscore', function(data){highScores=data;});
    socket.on('disconnect', function() {
      console.log('socket disconnect: ' + socket.id);
      delete Sock_List[socket.id];
      if (--connected == 2) {
        var player = 1;
        for (var key in Sock_List) {
          Sock_List[key].emit('player', player++);
        }
        for (var key in Sock_List) {
          Sock_List[key].emit('setup', null);
        }
        running = true;
      } else {
        running = false;
        for (var key in Sock_List) {
          Sock_List[key].emit('waiting', connected);
        }
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
});

setInterval(function(){
  if (running) {
    for (var key in Sock_List) {
      Sock_List[key].emit('tick', null);
    }
  }
}, 100);