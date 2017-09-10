function GameObject(name, sprite, x, y) {
  //TODO xOffset/yOffset?
  var self = this;
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.name = name;
  this.isClicked = false;
  this.isDraggable = false;
  this.isSpawner = false;
  this.spawnerFunc = function() {
    
  }
  this.mouseDown = function(game) {
    
  }
  this.mouseUp = function(game) {
    
  }
  this.update = function(game) {
    if (self.isDraggable && self.isClicked) {
      self.x = game.mouseX - self.sprite.image.width / 2;
      self.y = game.mouseY - self.sprite.image.height / 2;
    }
  }
  this.draw = function(game) {
    if (self.sprite != undefined) {
      self.sprite.draw(game, self.x, self.y);
    }
  }

  this.isPointWithinSprite = function(sprite, x, y){
    var minX = sprite.x;
    var maxX = sprite.x + sprite.element.image.width;
    var minY = sprite.y;
    var maxY = sprite.y + sprite.element.image.height;
    var mx = x;
    var my = y;
    //console.log(minX + " " + maxX);
    if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
      return true;
    }
    return false;
  }


}