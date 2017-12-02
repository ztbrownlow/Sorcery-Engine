var socket = io('http://localhost:2000');
socket.on('connect', function (socket) {
  console.log('Connected!');
});
function JsonifyKeyEvent(e) {
  return {simulated:true,keyCode: e.keyCode, altKey: e.altKey, code: e.code, ctrlKey: e.ctrlKey, key: e.key, repeat: e.repeat, shiftKey: e.shiftKey, type: e.type, which: e.which} //there are other fields but they don't matter
}
window.onload = function () { socket.emit('load', null) }
Key.bind(Key.ANY, Key.KEY_DOWN, function(e) {
  e = JsonifyKeyEvent(e);
  if (player == 1) {
    if (e.keyCode == Key.UP) {
      e.keyCode = Key.W
    }
    if (e.keyCode == Key.LEFT) {
      e.keyCode = Key.A
    }
    if (e.keyCode == Key.RIGHT) {
      e.keyCode = Key.D
    }
    if (e.keyCode == Key.DOWN) {
      e.keyCode = Key.S
    }
  } else {
    if (e.keyCode == Key.W) {
      e.keyCode = Key.UP
    }
    if (e.keyCode == Key.A) {
      e.keyCode = Key.LEFT
    }
    if (e.keyCode == Key.D) {
      e.keyCode = Key.RIGHT
    }
    if (e.keyCode == Key.S) {
      e.keyCode = Key.DOWN
    }
  }
  socket.emit('keyDown', e);
});
Key.bind(Key.ANY, Key.KEY_UP, function(e) {
  socket.emit('keyUp', JsonifyKeyEvent(e));
});
socket.on('keyDown', function(data) {
  Key.onKeydown(data, false); //eventually we should separate movement from the Key class and call that separately from here
});
socket.on('keyUp', function(data) {
  Key.onKeyup(data, false);
});
socket.on('setup', function(data) {
  game.setup();
  socket.emit("pause", false);
  hasBeenSetup = true;
});
socket.on('waiting', function(data) {
  obj_wait.draw(game.context);
  game.context.fillStyle = '#000099';
  game.context.font = '20px Arial';
  game.context.fillText('This game needs exactly 2 players to run, but there '+ (data==1?'is':'are'), 10, 20);
  game.context.fillText('currently '+(data==1?'only ':'')+data+' player' + (data==1?'':'s') + '. Waiting on ' + (data == 1?'1 more player...':data-2+' player'+(data==3?'':'s')+' to leave...'), 10, 50);
});
socket.on('tick', function(data) {
  game.loop();
});
socket.on('food', function(data) {
  game.gameManager.addPostUpdateEvent(function() {
    obj_food_tree.push(new Food(data[0], data[1]));
  });
});
socket.on('highscore', function(data){
  highscore.highScores = data;
  for (var i = 0; i < highscore.highScoreMax; i++) {
	var text = highscore.getNameAt(i) + " " + highscore.getHighScoreAt(i);
    hs_elems[i].innerHTML = text;
  }
});

var hasBeenSetup = false;

var player;

socket.on('player', function(data) {
  player=data;
  console.log('Player '+data);
});

var game = new Game(document.getElementById("canvas"), "multisnake");
var snakeSize = 20;

//SPRITES
var spr_waiting = game.sprites.push(new FilledRect("waiting", game.canvas.width, game.canvas.height, '#00FF00'));
var obj_wait = new GameObject("waiting", spr_waiting, 0, 0);

var spr_win = game.sprites.push(new FilledRect("waiting", game.canvas.width, game.canvas.height, 'RGBA(128,128,128,0)'));
var obj_win = new GameObject("waiting", spr_win, 0, 0);

<<<<<<< HEAD
var spr_snake_head = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snakehead.png?raw=true"));
var spr_snake_body = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snakebody.png?raw=true"));
var spr_snake_tail = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snaketail.png?raw=true"));
var spr_snake_headP2 = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snakeheadp2.png?raw=true"));
var spr_snake_bodyP2 = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snakebodyp2.png?raw=true"));
var spr_snake_tailP2 = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/snaketail2.png?raw=true"));
var spr_food = game.sprites.push(new Sprite("food", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/fruit.png?raw=true"));
var spr_food_rotten = game.sprites.push(new Sprite("food_rotten", snakeSize, snakeSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/snakeImages/fruitrotten.png?raw=true"));
=======
var spr_snake_head = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snakehead.png"));
var spr_snake_body = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snakebody.png"));
var spr_snake_tail = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snaketail.png"));
var spr_snake_headP2 = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snakeheadp2.png"));
var spr_snake_bodyP2 = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snakebodyp2.png"));
var spr_snake_tailP2 = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/snaketail2.png"));
var spr_food = game.sprites.push(new Sprite("food", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/fruit.png"));
var spr_food_rotten = game.sprites.push(new Sprite("food_rotten", snakeSize, snakeSize, "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/snakeImages/fruitrotten.png"));
>>>>>>> 8e67b4acc91e3d07393e80ece574496293600fad
var spr_wall = game.sprites.push(new FilledRect("wall", snakeSize, snakeSize, "#000000"));

var obj_snake_tree_player1 = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_snake_tree_player2 = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_food_tree = game.objects.push(new SceneGraph("food", true, true, false));
var obj_wall_tree = game.objects.push(new SceneGraph("wall", true, true, false));

game.lose = function() {
  socket.emit("pause", true)
  obj_win.draw(game.context);
  game.context.fillStyle = '#000099';
  game.context.font = '20px Arial';
  if(score1.score > score2.score ){
    game.context.fillText("Player 1 has won with a score of " + score1.score + "! Congrats!", 10, 30);
  }
  else if(score2.score  > score1.score ){
    game.context.fillText("Player 2 has won with a score of " + score2.score + "! Congrats!", 10, 30);
  }
  else{
    game.context.fillText("A tie?! Good job you both win", 10, 30);
  }
  setTimeout(function() {
    if(highscore.isHighScore(score1.score) && player==1){
      tempName = prompt("New high score for Player 1: " + score1.score + "!\nEnter your name.","");
      highscore.addHighScore(tempName,score1.score);
      socket.emit("highscore", highscore.highScores);
      //highscore.saveHighScores();
    }
    if(highscore.isHighScore(score2.score) && player==2){
      tempName = prompt("New high score for Player 2: " + score2.score + "!\nEnter your name.","");
      highscore.addHighScore(tempName,score2.score);
      socket.emit("highscore", highscore.highScores);
      //highscore.saveHighScores("multisnake");
    }
    if(player == 1){
      socket.emit("setup", null);
    }
  }, 1000);
}

var head;
var score1 = new Score(game);
var score2 = new Score(game);
score2.setX(530);
var highscore = new HighScore(3);
var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
var localHighScore = highscore.getHighScores("multisnake");
if(!localHighScore){
  highscore.addHighScore("ztbrownl",23);
  highscore.addHighScore("alrichma",8);
  highscore.addHighScore("rnpettit",3);  
}
else
{
  highscore.highScores = localHighScore;
}

game.gameManager.addConditionEvent((function() {return obj_snake_tree_player1.isEmpty() && obj_snake_tree_player2.isEmpty() && hasBeenSetup}), 
  function() {
    console.log("Game lost");
    game.lose();
  }, true);
  
game.setup = function() {
  score1.restart();
  score2.restart();
  document.getElementById("player").innerHTML = "Player " + player;
  obj_snake_tree_player1.removeAll();
  obj_snake_tree_player2.removeAll();
  obj_food_tree.removeAll();
  if (player == 1) {
    headPlayer1 = obj_snake_tree_player1.push(new Head(spr_snake_head, spr_snake_body, spr_snake_tail, snakeSize, obj_snake_tree_player1, 1, score1));
    headPlayer2 = obj_snake_tree_player2.push(new Head(spr_snake_headP2, spr_snake_bodyP2, spr_snake_tailP2, snakeSize, obj_snake_tree_player2, 2, score2));
    obj_snake_tree_player1.push(new Body(spr_snake_tail, headPlayer1));
    obj_snake_tree_player2.push(new Body(spr_snake_tailP2, headPlayer2));
  } else {
    headPlayer1 = obj_snake_tree_player1.push(new Head(spr_snake_headP2, spr_snake_bodyP2, spr_snake_tailP2, snakeSize, obj_snake_tree_player1, 1, score1));
    headPlayer2 = obj_snake_tree_player2.push(new Head(spr_snake_head, spr_snake_body, spr_snake_tail, snakeSize, obj_snake_tree_player2, 2, score2));
    obj_snake_tree_player1.push(new Body(spr_snake_tailP2, headPlayer1));
    obj_snake_tree_player2.push(new Body(spr_snake_tail, headPlayer2));
  }
  if (player == 1) {
    socket.emit('food', game.findRandomUnoccupiedPoint(game.objects, snakeSize));
  }
}


function Head(sprite, body_sprite, tail_sprite, snakeSize, tree, playerNumber, score) {
  var self = this;
  self.direcQueue = new Array();
  self.constructor = function(sprite, snakeSize, tree, body_sprite, tail_sprite) {
    if(playerNumber == 1){
      GameObject.call(self, "snake_head", sprite, snakeSize, snakeSize);
      self.direction = new Vector(snakeSize,0);	
      Key.bind(Key.W, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(0, -snakeSize))}});
      Key.bind(Key.A, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(-snakeSize, 0))}});
      Key.bind(Key.S, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(0, snakeSize))}});
      Key.bind(Key.D, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(snakeSize, 0))}});
    }
    if(playerNumber == 2){
      GameObject.call(self, "snake_head", sprite, game.canvas.width - snakeSize, snakeSize)
      self.direction = new Vector(-snakeSize,0);
      Key.bind(Key.UP, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(0, -snakeSize))}});
      Key.bind(Key.LEFT, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(-snakeSize, 0))}});
      Key.bind(Key.DOWN, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(0, snakeSize))}});
      Key.bind(Key.RIGHT, Key.KEY_DOWN, function(event){if (event.simulated) {self.direcQueue.push(new Vector(snakeSize, 0))}});		
    }
    self.score = score;
    self.snakeSize = snakeSize;
    self.tree = tree;
    self.last = null;
    self.lastX = self.x - self.direction.x;
    self.lastY = self.y - self.direction.y;
    self.body_sprite = body_sprite;
    self.tail_sprite = tail_sprite;
  }
  self.constructor(sprite, snakeSize, tree, body_sprite, tail_sprite, playerNumber, score);
  
  self.customUpdate = function(game) {
    while (self.direcQueue.length) {
      var temp = self.direcQueue.shift();
      if (temp.x != self.direction.x * -1 || temp.y != self.direction.y * -1) {
        self.direction = temp;
        break;
      }
    }
  }
  self.postUpdate = function() {
    if (game.outOfBounds(self.x, self.y)) {
      self.die();
    } else {
      game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
    }
    self.calculateAngleFromDirection(self.direction.x, self.direction.y)
  }
  self.canCollideWith = function(other) { 
    return true;
  }
  self.collideWith = function(other) {
    if (other instanceof Food) {
      if (other.rotten) {
        obj_food_tree.remove(other);
        score.addScore(-1, playerNumber);
        if (self.tree.length == 1) {
          self.die();
        } else {
          game.gameManager.addPostUpdateEvent(function() {
            self.tree.pop();
            if (self.tree.length != 1)
            {
              self.tree.last().sprite = self.tail_sprite;
            }
          }, false);          
        }
      } else {
        score.addScore(1, playerNumber);
        var last = self.tree.last();
        if (last != self) {
          last.sprite = self.body_sprite;
        }
        game.gameManager.addPostUpdateEvent(function() {
          self.tree.push(new Body(self.tail_sprite, last));
          obj_food_tree.remove(other);
          if (player == 1) {
            socket.emit('food', game.findRandomUnoccupiedPoint(game.objects, snakeSize));
          }
        }, false);
      }
    } else {
      self.die();
    }
  }
  
  self.die = function() {
    game.gameManager.addPostUpdateEvent(self.tree.removeAll, false);
  }
}

function Body(sprite, follow) {
  var self = this;
  self.direcQueue = new Array();
  self.constructor = function(sprite, follow) {
    GameObject.call(self, "body", sprite, follow.lastX, follow.lastY);
    self.follow = follow;
  }
  self.constructor(sprite, follow);
  self.customUpdate = function(game) {
    self.direction = new Vector(self.follow.x - self.x,self.follow.y - self.y);
  }
  self.customPreDraw = function(game) {
    self.calculateAngleFromDirection(self.follow.x - self.x,self.follow.y - self.y)
  }
}

function Food(x, y) {
  var self = this;
  self.reset = function(x, y) {
    if (x == null || x == undefined || y == null || y == undefined) {
      var temp = game.findRandomUnoccupiedPoint(game.objects, snakeSize);
    }
    self.x = (x != undefined && x != null) ? x : temp[0];
    self.y = (y != undefined && y != null) ? y : temp[1];
    self.steps = 0;
    self.rotten = false;
    self.sprite = self.mainSprite;
  }
  self.constructor = function(x, y) {
    self.reset(x, y);
    GameObject.call(self, "food", spr_food, self.x, self.y);
    self.mainSprite = self.sprite;
    self.stepsUntilRotten = 40;
    self.rottenSprite = spr_food_rotten;
  }
  self.constructor(x, y);
  self.update = function(game) {
    self.steps += 1;
    if (self.steps == self.stepsUntilRotten) {
      self.sprite = self.rottenSprite;
      self.rotten = true;
      if (player == 1) {
        socket.emit('food', game.findRandomUnoccupiedPoint(game.objects, snakeSize));
      }
    }
  }
}