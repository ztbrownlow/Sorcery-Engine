/** A game object creates an object with a sprite at a certain position. Once the object is added to a SceneGraph it will be drawn on the canvas.
  * @class
  * @namespace GameObject
  */
function GameObject(name, sprite, x, y, xOffset=0, yOffset=0) {
  var self = this;
  
  /** Creates the game object
	* @constructs GameObject
	*/
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
  
  /** This defines some getters and setters for the object
    * @memberof GameObject
    */
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
  
  /** Use this function to set the Square Hitbox for the object
    * @memberof GameObject
	* @param {array} xRange - The x range of which you want the hitbox to be. The array should only have a length of 2.
	* @param {array} yRange - The y range of which you want the hitbox to be. The array should only have a length of 2.
	*/
  self.setSquareHitbox = function(xRange=[0,1], yRange=[0,1]) {
    self.hitbox = {type: 'square', xRange: xRange, yRange: yRange, center: [(xRange[1]+xRange[0])/2, (yRange[1]+yRange[0])/2], halfWidth: (xRange[1]-xRange[0])/2, halfHeight: (yRange[1]-yRange[0])/2};
  }
  
  /** Use this function to set the Circle Hitbox for the object
    * @memberof GameObject
	* @param {vector} center - The center of the circle
	* @param {int} radius - The radius of the circle
	*/
  self.setCircleHitbox = function(center=new Vector(self.width/2, self.height/2), radius=Math.max(self.width, self.height)/2) {
    self.hitbox = {type: 'circle', radius: radius, center: center};
  }
  
  /** Returns true if the mouse is currently clicking down on the object
    * @memberof GameObject
	* @param {game} game - the game object
	* @param {event} event - an event or function that will happen when the mouse is down on the object
	* @returns {boolean} True if the mouse is currently clicking down on the object
    */
  self.mouseDown = function(game, event) {
    self.isClicked = true;
  }
  
  /** Returns true if the mouse is currently not clicking the object
    * @memberof GameObject
	* @param {game} game - the game object
	* @param {event} event - an event or function that will happen when the mouse is not clicking the object
	* @returns {boolean} True if the mouse is currently not clicking on the object
    */
  self.mouseUp = function(game, event) {
    self.isClicked = false;
  }
  
  /** Override this function to put in your custom pre-updates for this object. Called before update. 
	* @memberof GameObject
	* @param {game} game - the game object
	*/
  self.customUpdate = function(game){ }
  
  /** Override this function to put in your custom pre-draw for this object. Called before pre-draw. 
	* @memberof GameObject
	* @function
	* @param {game} game - the game object
	*/
  self.customPreDraw = null;
  
  /** The update function of the object. Do not override this function.
	* @memberof GameManager
	* @param {game} game - The game object
	*/
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
  
  /** Override this function to put in your custom post updates for this object. Called after update. 
	* @memberof GameObject
	* @param {game} game - the game object
	*/
  self.postUpdate = function(game) {}
  
  /** Call this function to update the object to the next position.  
	* @memberof GameObject
	*/
  self.updatePosition = function() {
    self.lastX = self.x;
    self.lastY = self.y;
    self.pos.x = self.nextX;
    self.pos.y = self.nextY;
  }
  
  /** Changes the object angle based on the direction given
	* @memberof GameObject
	* @param {int} dirX - the x direction
	* @param {int} dirY - the y direction
	*/
  self.calculateAngleFromDirection = function(dirX, dirY) {
    self.angle = Math.atan2(dirY, dirX) / (Math.PI/180);
  }
  
  /** This function draws the object. Do not override this function. If you wish to add anything to this function, use customePreDraw.
    * @memberof GameObject
	* @param {context} context - the context of the game.
    */
  self.draw = function(context) {
    if (self.customPreDraw)
      self.customPreDraw(context);
    if (self.sprite) {
      self.sprite.draw(context, self.x - self.xOffset, self.y - self.yOffset, self.angle);
      return true;
    }
    return false;
  }
  
  /** Returns true if the object collides at a specific point.
	* @memberof GameObject
	* @param {int} x - x
	* @param {int} y - y
	* @returns {boolean} True if the object is colliding at the specific position
	*/
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
  
  /** Returns true if the object collides with another object
	* @memberof GameObject
	* @param {object} other - the object to check collisions for.
	* @returns {boolean} True if the object is colliding with another object
	*/
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
  
  /** Changes the the sprite sheet to a specific sheet number
	* @memberof GameObject
	* @param {int} number - the number that the sprite sheet will change to
	*/
  self.changeSpriteSheetNumber = function(number) {
	  self.sprite.currentSprite = number;
  }
  
  /** Calculates velocity based on the angle and speed of the object
	* @memberof GameObject
	* @param {int} speed - the current speed of the object
	* @param {int} angle - the current angle of the object
	* @return {Vector} The new velocity based on the given angle and speed
	*/
  self.calculateVelocity = function(speed, angle){
	return tempVel = new Vector(speed*Math.sin(angle * (Math.PI/180)), -speed*Math.cos(angle * (Math.PI/180)))
   }
   
   /** Returns a slowed velocity based on the deceleration amount. 
	 * @memberof GameObject
	 * @param {int} velocity - the velocity of the object
	 * @param {int} decelerationAmt - the amount to slow velocity by
	 * @returns {Vector} The new velocity based on the old velocity and the deceleration amount.
	 */
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
   /** Adds an angle amount to the current angle of the object
	 * @memberof GameObject
	 * @param {int} angle - the amount of angle to add to the current angle
	 */
   self.changeAngle = function(angle){
		self.angle += angle;
	}
   /** Overide this function to return true if you want the object to be able to collide with the other object.
     * @memberof GameObject
	 * @param {object} other - the object that collided
	 * @return {boolean} if the object can collide with other objects
	 */
   self.canCollideWith = function(other) {
		return false;
   }
  
   /** Overide this function with the event you want to take place when the object collides with another
     * @memberof GameObject
	 * @param {object} other - the object that collided
	 * @returns {boolean} False if there is no event to take place when a collision has happened.
	 */ 
   self.collideWith = function(other) {
		return false;
   }
  
  /** Checks if the object has collided with another object 
    * @memberof GameObject
	* @param {object} other - the object that collided
	* @returns {boolean} returns true if the object is colliding with another object
	*/
   self.tryCollide = function(other) {
		if (self !== other && other.isCollidable && self.checkForObjectCollide(other) && self.canCollideWith(other)) {
			return self.collideWith(other);
		}
		return false;
   }
   /** Creates the GameObject */
   self.constructor(name, sprite, x, y, xOffset, yOffset);
};

