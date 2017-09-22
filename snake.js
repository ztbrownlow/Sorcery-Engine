var game = new Game(document.getElementById("canvas"));
var snakeSize = 20;

var spr_snake_head = game.sprites.push(new Sprite("snake_head", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snakehead.png"));
var spr_snake_body = game.sprites.push(new Sprite("snake_body", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snakebody.png"));
var spr_snake_tail = game.sprites.push(new Sprite("snake_tail", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/snaketail.png"));
var spr_food = game.sprites.push(new Sprite("food", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/fruit.png"));
var spr_food_rotten = game.sprites.push(new Sprite("food_rotten", snakeSize, snakeSize, "http://www4.ncsu.edu/~alrichma/images/fruitrotten.png"));
var spr_wall = game.sprites.push(new FilledRect("wall", snakeSize, snakeSize, "#000000"));

var obj_snake_tree = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_food_tree = game.objects.push(new SceneGraph("food", true, true, false));
var obj_wall_tree = game.objects.push(new SceneGraph("wall", true, true, false));

game.postDraw = function(){
  game.context.fillStyle = "black";
  game.context.font = "bold 12px Consolas";
  game.context.fillText("Score: " + score.score, 0, 10);
}

game.lose = function() {
  console.log("Game lost");
  if(score.isHighScore(score.score)){
	tempName = prompt("New high score: " + score.score + "!\nEnter your name.","");
	score.addHighScore(tempName,score.score);
	score.saveHighScores();
  }
  game.setup();
}

var head;
var score;

game.setup = function() {
  score = new Score(3);
  var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
  var localHighScore = score.getHighScores();
  if(localHighScore.length == 0){
	score.addHighScore("ztbrownl",23);
	score.addHighScore("alrichma",8);
	score.addHighScore("rnpettit",3);  
  }
  else{
	score.highScores = localHighScore;
  }
  for (var i = 0; i < score.highScoreMax; i++) {
	  var text = score.getNameAt(i) + " " + score.getHighScoreAt(i);
      hs_elems[i].innerHTML = text;
  }
  obj_snake_tree.removeAll();
  obj_food_tree.removeAll();
  head = obj_snake_tree.push(new Head(spr_snake_head, spr_snake_body, spr_snake_tail, snakeSize, obj_snake_tree));
  obj_snake_tree.push(new Body(spr_snake_tail, head));
  obj_food_tree.push(new Food());
  //other stuff probably
}

function Head(sprite, body_sprite, tail_sprite, snakeSize, tree) {
  var self = this;
  self.constructor = function(sprite, snakeSize, tree, body_sprite, tail_sprite) {
    GameObject.call(self, "snake_head", sprite, snakeSize, snakeSize)
    self.snakeSize = snakeSize;
    self.lastX = 0;
    self.lastY = snakeSize;
    self.tree = tree;
	self.direction = [snakeSize,0];
    self.body_sprite = body_sprite;
    self.tail_sprite = tail_sprite;
  }
  self.constructor(sprite, snakeSize, tree, body_sprite, tail_sprite);
  
  self.oldupdate = self.update;
  self.update = function(game) {
	self.oldupdate(game);
    if (game.outOfBounds(self.x, self.y)) {
      game.lose();
    } else {
      game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
    }
	if(Key.isDown(Key.W)){
		self.direcQueue.push([0, -snakeSize]);
	}
	if(Key.isDown(Key.A)){
		self.direcQueue.push([-snakeSize, 0]);
	}
	if(Key.isDown(Key.S)){
		self.direcQueue.push([0, snakeSize]);
	}
	if(Key.isDown(Key.D)){
		self.direcQueue.push([snakeSize, 0]);
	}
  }
  self.canCollideWith = function(other) { 
    return true;
  }
  self.collideWith = function(other) {
    if (other instanceof Food) {
      if (other.rotten) {
        obj_food_tree.remove(other);
        score.addScore(-1);
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
        score.addScore(1);
        var last = self.tree.last();
        if (last != self) {
          last.sprite = self.body_sprite;
        }
        self.tree.push(new Body(self.tail_sprite, last));
        other.placeInGame(); //place food again
      }
    } else {
      game.lose();
    }
  }
}

function Body(sprite, follow) {
  var self = this;
  self.constructor = function(sprite, follow) {
    GameObject.call(self, "body", sprite, follow.x, follow.y); //I would expect this to use lastX/lastY but it doesn't so yeah
    self.follow = follow;
    self.lastX = self.x;
    self.lastY = self.y;
  }
  self.constructor(sprite, follow);
  self.oldupdate = self.update;
  self.update = function(game) {
	self.direcQueue.push([self.follow.lastX - self.x,self.follow.lastY - self.y]);
	self.oldupdate();
	var dirX = self.follow.x - self.x;
    var dirY = self.follow.y - self.y;
    if(dirX > 0&& dirY == 0){
      self.angle = 0;
    }
    else if(dirX < 0 && dirY == 0){
      self.angle = 180;
    }
    else if(dirX == 0 && dirY > 0){
      self.angle = 90;
    }
    else{
      self.angle = 270;
    }
  }
}

function Food() {
  var self = this;
  self.placeInGame = function() {
    var x;
    var y;
    var temp;
    do {
      x = Math.floor(Math.random() * (game.canvas.width-1) / snakeSize) * snakeSize;
      y = Math.floor(Math.random() * (game.canvas.height-1) / snakeSize) * snakeSize;
      temp = game.objects.pointCollide(x, y, false);
    } while (!temp || flatten(temp).filter(function(e) {return e;}).length != 0);
    self.x = x;
    self.y = y;
    self.steps = 0;
    self.rotten = false;
    self.sprite = self.mainSprite;
  }
  self.constructor = function() {
    self.placeInGame();
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