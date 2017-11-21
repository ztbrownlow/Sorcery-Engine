/**
  *
  */
function Drawable(name) {
  var self = this;
  
  self.constructor = function(name) {
    self.name = name
  }
  self.draw = function(context, x, y) { }  
}

/** A sprite is the image of an object
  * @class 
  * @namespace Sprite
  */
function Sprite(name, width, height, src, isSpriteSheet=false, defAngle=0) {
  var self = this;
  
  /** Creates the Sprite
	* @constructs Sprite
	*/
  self.constructor = function(name, width, height, src, isSpriteSheet=false, defAngle=0) {
    Drawable.call(self, name);
    self.image = new Image();
    self.image.width = width;
    self.image.height = height;
    self.image.src = src;
    self.image.angle = defAngle;
	self.isSpriteSheet = isSpriteSheet;
	self.currentSprite = 0;
  }
  /** Creates Sprite */
  self.constructor(name, width, height, src, defAngle);
  
  Object.defineProperties(self, {
    'src': { get: function() { return self.image.src }, set: function(v) { self.image.src = v } },
    'width': { get: function() { return self.image.width }, set: function(v) { self.image.width = v } },
    'height': { get: function() { return self.image.height }, set: function(v) { self.image.height = v } }
  });
  
  /** Draws the sprite based on the angle and sprite sheet chosen. Do not override this function.
	* @memberof Sprite
	* @param {context} context - the context
	* @param {int} x - the x position on the canvas
	* @param {int} y - the y position on the canvas
	* @param {int} angle - the angle of the sprite
	*/
  self.draw = function(context, x, y, angle) {
    if(angle + self.image.angle != 0){
      var RADIANS = Math.PI/180; 
      context.save()
      context.translate(x + (self.image.width / 2), y + (self.image.height / 2));
      context.rotate((angle + self.image.angle) * RADIANS);
	  if(isSpriteSheet){
		context.drawImage(self.image, 0 + (self.image.width * self.currentSprite), 0, self.image.width, self.image.height, -(self.image.width/2), -(self.image.height/2), self.image.width, self.image.height);
	  }
	  else{
		context.drawImage(self.image, -(self.image.width/2), -(self.image.height/2), self.image.width, self.image.height); 
	  }
      context.restore();
    }
    else{
		if(isSpriteSheet){
			context.drawImage(self.image,0 + (self.image.width * self.currentSprite),0,self.image.width, self.image.height,x, y, self.image.width, self.image.height);
		}
		else{
			context.drawImage(self.image, x, y, self.image.width, self.image.height);

		}
    }
  }
}

function FilledRect(name, width, height, fillStyle) {
  var self = this;
  self.constructor = function(name, width, height, fillStyle) {
    Drawable.call(self, name);
    self.width = width;
    self.height = height;
    self.name = name;
    self.fillStyle = fillStyle;
  }
  self.constructor(name, width, height, fillStyle);
  self.draw = function(context, x, y) {
    var saveContext = false;
    if (context.fillStyle == self.fillStyle) {
      saveContext = true;
      context.save();
    }
    context.fillStyle = self.fillStyle;
    context.fillRect(x, y, self.width, self.height);
    if (saveContext) {
      context.restore();
    }
  }
}
