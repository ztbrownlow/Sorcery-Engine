function GameObject(name, sprite, x, y) {
  //TODO xOffset/yOffset?
  var self = this;
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.name = name;
}
GameObject.prototype.update = function() {};
GameObject.prototype.draw = function(game) {
  if (this.sprite != undefined) {
    this.sprite.draw(game, this.x, this.y);
  }
};