function GameObject(name, sprite, x, y) {
  //TODO xOffset/yOffset?
  var self = this;
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.name = name;
  this.update = function() {
    
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