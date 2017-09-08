function Sprite(name, width, height, src) {
  this.image = new Image();
  this.image.src = src;
  this.image.width = width;
  this.image.height = height;
  this.name = name;
}

Sprite.prototype.draw = function(game, x, y) {
  game.context.drawImage(self.image, x, y, self.image.width, self.image.height);
};

function FilledRectSprite(name, width, height, fillStyle) { //can use in place of sprite. fillStyle can be color, gradient, pattern
  this.width = width;
  this.height = height;
  this.name = name;
  this.fillStyle = fillStyle;
}

FilledRectSprite.prototype.draw = function(game, x, y) {
  var saveContext = false;
  if (game.context.fillStyle == this.fillStyle) {
    saveContext = true;
    game.context.save();
  }
  game.context.fillStyle = this.fillStyle;
  game.context.fillRect(x, y, this.width, this.height);
  if (saveContext) {
    game.context.restore();
  }
};

//checks collision with coordinate. taken from code we used in class
//returns true if (x, y) is contained in sprite (assumes rectangular bounding box)
function checkSpriteRect(sprite, x, y) {
  var minX = x;
  var maxX = x + sprite.image.width;
  var minY = y;
  var maxY = y + sprite.image.height;
  if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
    return true;
  }
  return false;
}