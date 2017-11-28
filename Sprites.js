/**
  * An interface for a drawable object
  * @class Drawable
  */
function Drawable(name) {
  var self = this;
  
  /**
   * Creates a Drawable
   * @memberof Drawable
   * @constructs Drawable
   */
  self.constructor = function(name) {
    self.name = name
  }
  /**
   * Draw function
   * @memberof Drawable
   * @param context the context to draw on
   * @param x the x coordinate to draw at
   * @param y the y coordinate to draw at
   */
  self.draw = function(context, x, y) { }  
}

/** A sprite is the image of an object
  * @class 
  * @namespace Sprite
  * @param name image name
  * @param width image width
  * @param height image height
  * @param src image source
  * @param isSpriteSheet if image is sprite sheet
  * @param defAngle default image angle
  */
function Sprite(name, width, height, src, isSpriteSheet=false, defAngle=0) {
  var self = this;
  
  /** Creates the Sprite
    * @constructs Sprite
    * @param name image name
    * @param width image width
    * @param height image height
    * @param src image source
    * @param isSpriteSheet if image is sprite sheet
    * @param defAngle default image angle
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
    self.doDraw = true;
  }
  /** Creates Sprite */
  self.constructor(name, width, height, src, defAngle);
  
  Object.defineProperties(self, {
    /**
      * image source
      * @memberof Sprite
      */
    'src': { get: function() { return self.image.src }, set: function(v) { self.image.src = v } },
    /**
      * image width
      * @memberof Sprite
      */
    'width': { get: function() { return self.image.width }, set: function(v) { self.image.width = v } },
    /**
      * image height
      * @memberof Sprite
      */
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
    if(self.doDraw){
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
}

/**
 * A filled rectangle that can be used like a sprite
 * @namespace FilledRect
 * @param name the name of the rectangle sprite
 * @param width the width of the rectangle
 * @param height the height of the rectangle
 * @param fillStyle the fill style of the rectangle
 */
function FilledRect(name, width, height, fillStyle) {
  var self = this;
  /**
   * Constructor
   * @constructs FilledRect
   * @param name the name of the rectangle sprite
   * @param width the width of the rectangle
   * @param height the height of the rectangle
   * @param fillStyle the fill style of the rectangle
   */
  self.constructor = function(name, width, height, fillStyle) {
    Drawable.call(self, name);
    self.width = width;
    self.height = height;
    self.name = name;
    self.fillStyle = fillStyle;
  }
  self.constructor(name, width, height, fillStyle);
  /** Draws the sprite based on the angle and sprite sheet chosen. Do not override this function.
    * @memberof Sprite
    * @param {context} context - the context
    * @param {int} x - the x position on the canvas
    * @param {int} y - the y position on the canvas
    */
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
