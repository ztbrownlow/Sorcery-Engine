function GameObject(name, sprite, x, y, xOffset=0, yOffset=0) {
  var self = this;
  self.constructor = function(name, sprite, x, y, xOffset, yOffset) {
    self.name = name;
    self.sprite = sprite;
    self.pos = new Vector();
    self.x = x;
    self.y = y;
    self.xOffset = xOffset;
    self.yOffset = yOffset;
    self.isClicked = false;
    self.isDraggable = false;
    self.isClickable = true;
    self.setSquareHitbox([0, 1], [0, 1]);
  }
  Object.defineProperties(self, {
    'x': { 
      get: function() {
        return self.pos.x;
      },
      set: function(val) {
        self.pos.x = val;
      }},
    
    'y': { 
      get: function() {
        return self.pos.y;
      },
      set: function(val) {
        self.pos.y = val;
      }},
    
    'width': { get: function() {return sprite.width}},
    'height': { get: function() {return sprite.height}},
    'src': { get: function() {return sprite.src}}
  });  
  
  self.setSquareHitbox = function(xRange, yRange) {
    self.hitbox = {type: 'square', xRange: xRange, yRange: yRange, center: [(xRange[1]+xRange[0])/2, (yRange[1]+yRange[0])/2], halfWidth: (xRange[1]-xRange[0])/2, halfHeight: (yRange[1]-yRange[0])/2};
  }
  
  self.setCircleHitbox = function(center, radius) {
    self.hitbox = {type: 'circle', radius: radius, center: center};
  }
  
  self.mouseDown = function(game, event) {
    self.isClicked = true;
  }
  
  self.mouseUp = function(game, event) {
    self.isClicked = false;
  }
  
  self.update = function(game) {
    if (self.isDraggable && self.isClicked) {
      self.x = game.mouseX;
      self.y = game.mouseY;
    }
  }
  
  self.draw = function(context) {
    if (self.sprite) {
      self.sprite.draw(context, self.x - self.xOffset, self.y - self.yOffset);
      return true;
    }
    return false;
  }
  
  self.pointCollide = function(x, y) {
    var pos = new Vector(x, y);
    if (self.hitbox.type == 'square') {
      var minX = self.x - self.xOffset + self.hitbox.xRange[0] * self.width;
      var maxX = self.x - self.xOffset + self.hitbox.xRange[1] * self.width;
      var minY = self.y - self.yOffset + self.hitbox.yRange[0] * self.height;
      var maxY = self.y - self.yOffset + self.hitbox.yRange[1] * self.height;
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    } else if (self.hitbox.type == 'circle') {
      return pos.subtract(self.hitbox.center).magnitude() < self.hitbox.radius;
    } 
    return false;
  }
  
  self.checkForObjectCollide = function(other) {
    if (self.hitbox.type == 'square') {
      var minX = self.x - self.xOffset + self.hitbox.xRange[0] * self.width;
      var maxX = self.x - self.xOffset + self.hitbox.xRange[1] * self.width;
      var minY = self.y - self.yOffset + self.hitbox.yRange[0] * self.height;
      var maxY = self.y - self.yOffset + self.hitbox.yRange[1] * self.height;
      if (other.hitbox.type == 'square') {
        var otherMinX = other.x - other.xOffset + other.hitbox.xRange[0] * other.width;
        var otherMaxX = other.x - other.xOffset + other.hitbox.xRange[1] * other.width;
        var otherMinY = other.y - other.yOffset + other.hitbox.yRange[0] * other.height;
        var otherMaxY = other.y - other.yOffset + other.hitbox.yRange[1] * other.height;
        return minX <= otherMaxX && maxX >= otherMinX && minY <= otherMaxY && maxY >= otherMinY
      } else if (other.hitbox.type == 'circle') {
        var centerX = self.x - self.xOffset + self.hitbox.center[0] * self.width;
        var centerY = self.y - self.yOffset + self.hitbox.center[1] * self.height;
        var diffCentX = Math.abs(other.center.x - centerX);
        var diffCentY = Math.abs(other.center.y - centerY);
        if (diffCentX >= self.hitbox.halfWidth + other.hitbox.radius || diffCentY >= self.hitbox.halfHeight + other.hitbox.radius) {
          return false;
        }
        if (diffCentX < self.hitbox.halfWidth || diffCentY < self.hitbox.halfHeight) {
          return true;
        }
        return Math.hypot(diffCentX - self.hitbox.halfWidth, diffCentY - self.hitbox.halfHeight) < other.hitbox.radius;
      }
    } else if (self.hitbox.type == 'circle') {
      if (other.hitbox.type == 'square') {
        return other.objectCollide(self);
      } else if (other.hitbox.type == 'circle') {
        return other.hitbox.center.subtract(self.hitbox.center).magnitude() < self.hitbox.radius + other.hitbox.radius
      }
    }
    return false;
  }
  
  self.canCollideWith = function(other) {
    return false;
  }
  
  self.collideWith = function(other) {
    return false;
  }
  
  self.tryCollide = function(other) {
    if (self !== other && self.checkForObjectCollide(other) && self.canCollideWith(other)) {
      return self.collideWith(other);
    }
    return false;
  }
  self.constructor(name, sprite, x, y, xOffset, yOffset);
}
