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
  res.sendFile('/engine/engine.js', {root:'.'});
});
app.get('/vector.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/vector.js', {root:'.'});
});
app.get('/Sprites.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/Sprites.js', {root:'.'});
});
app.get('/object.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/object.js', {root:'.'});
});
app.get('/SceneGraph.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/SceneGraph.js', {root:'.'});
});
app.get('/key.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/key.js', {root:'.'});
});
app.get('/gameManager.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/gameManager.js', {root:'.'});
});
app.get('/objectPool.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/objectPool.js', {root:'.'});
});
app.get('/Grid.js', function(req /* request */, res /* resource */) { //sets function that is called on page load
  res.sendFile('/engine/Grid.js', {root:'.'});
});

//app.get("/highscores.json', function(req /* request */, res /* resource */) {
//  res.sendFile(__dirname + '/highscores.json');
//});


var port = 2000

server.listen(port /* port */, function () {
  console.log('listening on port '+port);
});

var io = require('socket.io')(server,{});
var highscoresJSON = require('./highscores.json'); // ^ may need to do the app.get thing up top
var highScores = highscoresJSON.highscores
var Sock_List = {};
var connected = 0;
var running = false;

var foodPlacement = null;

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
    forwardToAllSockets(socket, 'highscore', function(data){
      highScores=data;
      //optionally add code here to save json file
      var highScoresJSON = JSON.stringify({highscores:highScores})
      var fs = require('fs');
      fs.writeFile("highscores.json", highScoresJSON, function(err) {
        if(err) {
          return console.log(err);
        }
      });
    });
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