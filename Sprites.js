function Sprite(name, width, height, src) {
  this.image = new Image();
  this.image.src = src;
  this.image.width = width;
  this.image.height = height;
  this.name = name;
  var self = this;
  this.draw = function(game, x, y) {
    game.context.drawImage(self.image, x, y, self.image.width, self.image.height);
  };
}

function FilledRectSprite(name, width, height, fillStyle) { //can use in place of sprite. fillStyle can be color, gradient, pattern
  var self = this;
  self.width = width;
  self.height = height;
  self.name = name;
  self.fillStyle = fillStyle;

  this.draw = function(game, x, y) {
    var saveContext = false;
    if (game.context.fillStyle == self.fillStyle) {
      saveContext = true;
      game.context.save();
    }
    game.context.fillStyle = self.fillStyle;
    game.context.fillRect(x, y, self.width, self.height);
    if (saveContext) {
      game.context.restore();
    }
  }
}

//checks collision with coordinate. taken from code we used in class
//returns true if (x, y) is contained in sprite (assumes rectangular bounding box)
function checkSpriteRect(sprite, sprX, sprY, checkX, checkY) {
  var minX = sprX;
  var maxX = sprX + sprite.image.width;
  var minY = sprY;
  var maxY = sprY + sprite.image.height;
  console.log(minX + ", " + maxX + ", " + minY + ", " + maxY)
  console.log("x: " + checkX + ", y: " + checkY)
  if (checkX >= minX && checkX <= maxX && checkY >= minY && checkY <= maxY) {
    return true;
  }
  return false;
}