function GameObject(name, sprite, x, y, xOffset=0, yOffset=0) {
  var self = this;
  self.constructor = function(name, sprite, x, y, xOffset, yOffset) {
    self.name = name;
    self.sprite = sprite;
    self.pos = new Vector(x, y);
    self.nextX = x;
    self.nextY = y;
    self.lastX = x;
    self.lastY = y;
    self.xOffset = xOffset;
    self.yOffset = yOffset;
    self.isClicked = false;
    self.isDraggable = false;
    self.isClickable = true;
    self.isCollidable = true;
    self.isLooping = false;
    self.setSquareHitbox([0, 1], [0, 1]);
    self.direction = new Vector(0,0);
    self.velocity = new Vector(0,0);
    self.angle = 0;
  }
  Object.defineProperties(self, {
    'x': { 
      get: function() {
        return self.pos.x;
      },
      set: function(val) {
        self.nextX = val;
      }
    },
    'y': { 
      get: function() {
        return self.pos.y;
      },
      set: function(val) {
        self.nextY = val;
      }
    },
    
    'width': { get: function() {if(sprite == null){return null} else{return sprite.width}}},
    'height': { get: function() {if(sprite == null){ return null} else{return sprite.height}}},
    'src': { get: function() {if(sprite == null){ return null} else{return sprite.src}}}
  });  
  
  self.setSquareHitbox = function(xRange=[0,1], yRange=[0,1]) {
    self.hitbox = {type: 'square', xRange: xRange, yRange: yRange, center: [(xRange[1]+xRange[0])/2, (yRange[1]+yRange[0])/2], halfWidth: (xRange[1]-xRange[0])/2, halfHeight: (yRange[1]-yRange[0])/2};
  }
  
  self.setCircleHitbox = function(center=new Vector(self.width/2, self.height/2), radius=Math.max(self.width, self.height)/2) {
    self.hitbox = {type: 'circle', radius: radius, center: center};
  }
  
  self.mouseDown = function(game, event) {
    self.isClicked = true;
  }
  
  self.mouseUp = function(game, event) {
    self.isClicked = false;
  }
  self.customUpdate = function(game){ }
  self.customPreDraw = null;
  
  self.update = function(game) {
    self.customUpdate(game);
    if(self.isLooping && game.outOfBounds(self.nextX, self.nextY)){
      if(self.nextX > game.canvas.width){self.nextX = 0}
      else if(self.nextX < 0){self.nextX = game.canvas.width}
        
      if(self.nextY > game.canvas.height){self.nextY = 0}
      else if(self.nextY < 0){self.nextY = game.canvas.height}
    }
    if (self.direction.x != 0 || self.direction.y != 0) {
      self.nextX += self.direction.x;
      self.nextY += self.direction.y;
    }
    if (self.isDraggable && self.isClicked) {
      self.nextX = game.mouseX;
      self.nextY = game.mouseY;
    }
    self.postUpdate(game);
  }
  
  self.postUpdate = function() {}
  
  self.updatePosition = function() {
    self.lastX = self.x;
    self.lastY = self.y;
    self.pos.x = self.nextX;
    self.pos.y = self.nextY;
  }
  
  self.calculateAngleFromDirection = function(dirX, dirY) {
    self.angle = Math.atan2(dirY, dirX) / (Math.PI/180);
  }
  
  self.draw = function(context) {
    if (self.customPreDraw)
      self.customPreDraw(context);
    if (self.sprite) {
      self.sprite.draw(context, self.x - self.xOffset, self.y - self.yOffset, self.angle);
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
      var minX = self.nextX - self.xOffset + self.hitbox.xRange[0] * self.width;
      var maxX = self.nextX - self.xOffset + self.hitbox.xRange[1] * self.width;
      var minY = self.nextY - self.yOffset + self.hitbox.yRange[0] * self.height;
      var maxY = self.nextY - self.yOffset + self.hitbox.yRange[1] * self.height;
      if (other.hitbox.type == 'square') {
        //TODO account for angle
        var otherMinX = other.x - other.xOffset + other.hitbox.xRange[0] * other.width;
        var otherMaxX = other.x - other.xOffset + other.hitbox.xRange[1] * other.width;
        var otherMinY = other.y - other.yOffset + other.hitbox.yRange[0] * other.height;
        var otherMaxY = other.y - other.yOffset + other.hitbox.yRange[1] * other.height;
        return minX < otherMaxX && maxX > otherMinX && minY < otherMaxY && maxY > otherMinY
      } else if (other.hitbox.type == 'circle') {
        //TODO account for angle
        var centerX = self.nextX - self.xOffset + self.hitbox.center[0] * self.width;
        var centerY = self.nextY - self.yOffset + self.hitbox.center[1] * self.height;
        var diffCentX = Math.abs(other.hitbox.center.x + other.x - other.xOffset - centerX);
        var diffCentY = Math.abs(other.hitbox.center.y + other.y - other.yOffset - centerY);
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
        return other.checkForObjectCollide(self);
      } else if (other.hitbox.type == 'circle') {
        return other.hitbox.center.add(new Vector(other.x - other.xOffset, other.y-other.yOffset)).subtract(self.hitbox.center.add(new Vector(self.nextX - self.xOffset, self.nextY-self.yOffset))).magnitude() < self.hitbox.radius + other.hitbox.radius
      }
    }
    return false;
  }
  
  self.changeSpriteSheetNumber = function(number) {
	  self.sprite.currentSprite = number;
  }
  
  //calculates velocity based on the angle
  self.calculateVelocity = function(speed, angle){
	return tempVel = new Vector(speed*Math.sin(angle * (Math.PI/180)), -speed*Math.cos(angle * (Math.PI/180)))
   }
   
   //slows velocity by some amount
   self.slowVelocity = function(velocity, decelerationAmt){
	var currentVelVector = velocity;
	var velMagnitudeCurrent = currentVelVector.magnitude();
	if(velMagnitudeCurrent != 0){
		var velMagnitudeNext = velMagnitudeCurrent - decelerationAmt;
		if(velMagnitudeNext < 0 )
			velMagnitudeNext = 0;
		var velUnitVector = currentVelVector.normalize();
		var nextVelVector = velUnitVector.multiply(velMagnitudeNext);
		return nextVelVector;
	}
	return velocity;
}
   
   //adds angle param to the current angle
   self.changeAngle = function(angle){
		self.angle += angle;
	}
  
  self.canCollideWith = function(other) {
    return false;
  }
  
  self.collideWith = function(other) {
    return false;
  }
  
  self.tryCollide = function(other) {
    if (self !== other && other.isCollidable && self.checkForObjectCollide(other) && self.canCollideWith(other)) {
      return self.collideWith(other);
    }
    return false;
  }
  self.constructor(name, sprite, x, y, xOffset, yOffset);
};

