var game = new Game(document.getElementById("canvas"));
var snakeSize = 20;

var spr_snake_head = game.sprites.push(new FilledRect("snake_head", snakeSize, snakeSize, "#008800"));
var spr_snake_body = game.sprites.push(new FilledRect("snake_body", snakeSize, snakeSize, "#008800"));
var spr_snake_tail = game.sprites.push(new FilledRect("snake_tail", snakeSize, snakeSize, "#008800"));
var spr_food = game.sprites.push(new FilledRect("food", snakeSize, snakeSize, "#FFFF00"));
var spr_food_rotten = game.sprites.push(new FilledRect("food_rotten", snakeSize, snakeSize, "#888800"));
var spr_wall = game.sprites.push(new FilledRect("wall", snakeSize, snakeSize, "#000000"));

var obj_snake_tree = game.objects.push(new SceneGraph("snake", true, true, false));
var obj_food_tree = game.objects.push(new SceneGraph("food", true, true, false));
var obj_wall_tree = game.objects.push(new SceneGraph("wall", true, true, false));

game.postDraw = function(){
  game.context.fillStyle = "black";
  game.context.font = "bold 12px Consolas";
  game.context.fillText("Score: " + game.score, 0, 10);
}

game.lose = function() {
  console.log("Game lost");
  var temp = null;
  var tempName = null;
  for (var i = 0; i < hs.length; ++i) {
    if (temp != null) {
      var temp2 = hs[i];
      hs[i] = temp;
      temp = temp2;
    } else {
      if (game.score > hs[i].score) {
        tempName = prompt("New high score: " + game.score + "!\nEnter your name.","");
        temp = hs[i];
        hs[i] = {score: game.score, name: tempName};
      }
    }
  }
  game.setup();
}

var head;

game.setup = function() {
  for (var i = 0; i < hs.length; ++i) {
    for (var property in hs[i]) {
      hs_elems[i].getElementsByClassName(property)[0].innerHTML = hs[i][property]
    }
  }
  game.score = 0;
  obj_snake_tree.removeAll();
  obj_food_tree.removeAll();
  head = obj_snake_tree.push(new Head(spr_snake_head, spr_snake_body, spr_snake_tail, snakeSize, obj_snake_tree));
  obj_snake_tree.push(new Body(spr_snake_tail, head));
  obj_food_tree.push(new Food());
  //other stuff probably
}

//move to engine for refactoring for next week
game.outOfBounds = function(x, y) {
  return x > game.canvas.width || x < 0 || y > game.canvas.height || y < 0;
}

var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
var hs = [{score: 23, name: "ztlbrown"}, {score: 8, name: "alrichma"}, {score: 3, name: "rnpettit"}];

function Head(sprite, body_sprite, tail_sprite, snakeSize, tree) {
  var self = this;
  self.constructor = function(sprite, snakeSize, tree, body_sprite, tail_sprite) {
    GameObject.call(self, "snake_head", sprite, snakeSize, snakeSize)
    self.sprite = sprite;
    self.snakeSize = snakeSize;
    self.lastX = 0;
    self.lastY = snakeSize;
    self.direction = [1, 0];
    self.tree = tree;
    self.body_sprite = body_sprite;
    self.tail_sprite = tail_sprite;
    self.direcQueue = new Array();
  }
  self.constructor(sprite, snakeSize, tree, body_sprite, tail_sprite);
  self.update = function(game) {
    while (self.direcQueue.length) {
      var temp = self.direcQueue.shift();
      if (temp[0] != self.direction[0] * -1 || temp[1] != self.direction[1] * -1) {
        self.direction = temp;
        break;
      }
    }
    self.lastX = self.x;
    self.lastY = self.y;
    self.x += self.direction[0] * snakeSize;
    self.y += self.direction[1] * snakeSize;
    if (game.outOfBounds(self.x, self.y)) {
      game.lose();
    } else {
      game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
    }
  }
  self.canCollideWith = function(other) { 
    return true;
  }
  self.collideWith = function(other) {
    if (other instanceof Food) {
      if (other.rotten) {
        --game.score;
        if (self.tree.length == 1) {
          game.lose();
        } else {
          self.tree.pop();
          var last = self.tree.last();
          if (last != self) {
            last.sprite = self.tail_sprite;
          }
        }
        obj_food_tree.remove(other);
      } else {
        ++game.score;
        var last = self.tree.last();
        last.sprite = self.body_sprite;
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
  self.update = function(game) {
    self.lastX = self.x;
    self.lastY = self.y;
    self.x = self.follow.lastX;
    self.y = self.follow.lastY;
  }
}

function Food() {
  var self = this;
  self.placeInGame = function() {
    var x;
    var y;
    var temp;
    do {
      x = Math.floor(Math.random() * game.canvas.width / snakeSize) * snakeSize;
      y = Math.floor(Math.random() * game.canvas.height / snakeSize) * snakeSize;
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
    self.stepsUntilRotten = 30;
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

window.addEventListener("keydown", onKeyDown, false); //I want this to be game.canvas.addEventListener but that doesn't seem to work
//probably also want a key up event at some point but don't need it right now
//may want to eventually refactor this to check at the start of an update instead of being asynchronous?
// ^ could handle this using a queue of events and run through them at the start of update function
function onKeyDown(event) {
  if (!head.direcUpdated) {
    var keyCode = event.keyCode;
    switch (keyCode) {
      case 68: //d
        head.direcQueue.push([1, 0])
        break;
      case 83: //s
        head.direcQueue.push([0, 1])
        break;
      case 65: //a
        head.direcQueue.push([-1, 0])
        break;
      case 87: //w
        head.direcQueue.push([0, -1])
        break;
    }
  }
}

game.setup();
game.start(100);