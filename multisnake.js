var game = new Game(document.getElementById("canvas"), "snake");
var snakeSize = 20;

var spr_snake_head = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snakehead.png"));
var spr_snake_body = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snakebody.png"));
var spr_snake_tail = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snaketail.png"));
var spr_food = game.sprites.push(new Sprite("food", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/fruit.png"));
var spr_food_rotten = game.sprites.push(new Sprite("food_rotten", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/fruitrotten.png"));
var spr_wall = game.sprites.push(new FilledRect("wall", snakeSize, snakeSize, "#000000"));

var obj_snake_tree_player1 = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_snake_tree_player2 = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_food_tree = game.objects.push(new SceneGraph("food", true, true, false));
var obj_wall_tree = game.objects.push(new SceneGraph("wall", true, true, false));

game.lose = function() {
  if(score.isHighScore(score.score)){
    tempName = prompt("New high score: " + score.score + "!\nEnter your name.","");
    score.addHighScore(tempName,score.score);
    score.saveHighScores();
  }
  game.setup();
}

var head;
var score;
score = new Score(3, 2, game);
var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
var localHighScore = score.getHighScores();
if(!localHighScore){
  score.addHighScore("ztbrownl",23);
  score.addHighScore("alrichma",8);
  score.addHighScore("rnpettit",3);  
}
else
{
  score.highScores = localHighScore;
}

game.gameManager.addConditionEvent((function() {obj_snake_tree_player1.isEmpty() && obj_snake_tree_player2.isEmpty()}), 
  function() {
    console.log("Game lost");
  }, true);
  
game.setup = function() {
  score.restart();
  for (var i = 0; i < score.highScoreMax; i++) {
	  var text = score.getNameAt(i) + " " + score.getHighScoreAt(i);
      hs_elems[i].innerHTML = text;
  }
  obj_snake_tree_player1.removeAll();
  obj_snake_tree_player2.removeAll();
  obj_food_tree.removeAll();
  headPlayer1 = obj_snake_tree_player1.push(new Head(spr_snake_head, spr_snake_body, spr_snake_tail, snakeSize, obj_snake_tree_player1, 1));
  headPlayer2 = obj_snake_tree_player2.push(new Head(spr_snake_head, spr_snake_body, 			spr_snake_tail, snakeSize, obj_snake_tree_player2, 2));
  obj_snake_tree_player1.push(new Body(spr_snake_tail, headPlayer1));
  obj_snake_tree_player2.push(new Body(spr_snake_tail, headPlayer2));
  obj_food_tree.push(new Food());
}


function Head(sprite, body_sprite, tail_sprite, snakeSize, tree, playerNumber) {
  var self = this;
  self.direcQueue = new Array();
  self.constructor = function(sprite, snakeSize, tree, body_sprite, tail_sprite) {
	if(playerNumber == 1){
		GameObject.call(self, "snake_head", sprite, snakeSize, snakeSize);
		self.direction = new Vector(snakeSize,0);	
		Key.bind(Key.W, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(0, -snakeSize))});
		Key.bind(Key.A, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(-snakeSize, 0))});
		Key.bind(Key.S, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(0, snakeSize))});
		Key.bind(Key.D, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(snakeSize, 0))});
	}
	if(playerNumber == 2){
		GameObject.call(self, "snake_head", sprite, game.canvas.width - snakeSize, snakeSize)
		self.direction = new Vector(-snakeSize,0);
		Key.bind(Key.UP, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(0, -snakeSize))});
		Key.bind(Key.LEFT, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(-snakeSize, 0))});
		Key.bind(Key.DOWN, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(0, snakeSize))});
		Key.bind(Key.RIGHT, Key.KEY_DOWN, function(event){self.direcQueue.push(new Vector(snakeSize, 0))});		
	}
    self.snakeSize = snakeSize;
    self.tree = tree;
	self.last = null;
    self.lastX = self.x - self.direction.x;
    self.lastY = self.y - self.direction.y;
    self.body_sprite = body_sprite;
    self.tail_sprite = tail_sprite;
  }
  self.constructor(sprite, snakeSize, tree, body_sprite, tail_sprite, playerNumber);
  
  self.customUpdate = function(game) {
    while (self.direcQueue.length) {
      var temp = self.direcQueue.shift();
      if (temp.x != self.direction.x * -1 || temp.y != self.direction.y * -1) {
        self.direction = temp;
        break;
      }
    }
    self.lastX = self.x;
    self.lastY = self.y;
    if (game.outOfBounds(self.x, self.y)) {
      self.tree.removeAll();
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
          game.lose();
        } else {
          self.tree.pop();
          if (self.tree.length != 1)
          {
            self.tree.last().sprite = self.tail_sprite;
          }
        }
      } else {
        score.addScore(1, playerNumber);
        var last = self.tree.last();
        if (last != self) {
          last.sprite = self.body_sprite;
        }
        self.tree.push(new Body(self.tail_sprite, last));
        other.reset(); //place food again
      }
    } else {
      game.lose()
    }
  }
}

function Body(sprite, follow) {
  var self = this;
  self.direcQueue = new Array();
  self.constructor = function(sprite, follow) {
    GameObject.call(self, "body", sprite, follow.lastX, follow.lastY);
    self.follow = follow;
    self.lastX = self.x;
    self.lastY = self.y;
  }
  self.constructor(sprite, follow);
  self.customUpdate = function(game) {
    self.direction = new Vector(self.follow.lastX - self.x,self.follow.lastY - self.y);
    self.lastX = self.x;
    self.lastY = self.y;
  }
  self.customPreDraw = function(game) {
    self.calculateAngleFromDirection(self.follow.x - self.x,self.follow.y - self.y)
  }
}

function Food() {
  var self = this;
  self.reset = function() {
    var temp = game.findRandomUnoccupiedPoint(game.objects, snakeSize);
    self.x = temp[0];
    self.y = temp[1];
    self.steps = 0;
    self.rotten = false;
    self.sprite = self.mainSprite;
  }
  self.constructor = function() {
    self.reset();
    GameObject.call(self, "food", spr_food, self.x, self.y);
    self.mainSprite = self.sprite;
    self.stepsUntilRotten = 40;
    self.rottenSprite = spr_food_rotten;
  }
  self.constructor();
  self.update = function(game) {
    self.steps += 1;
    if (self.steps == self.stepsUntilRotten) {
      self.sprite = self.rottenSprite;
      self.rotten = true;
      obj_food_tree.push(new Food());
    }
  }
}
game.setup();
game.start(100);