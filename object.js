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
}