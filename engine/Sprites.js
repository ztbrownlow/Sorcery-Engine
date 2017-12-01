/**
  * An interface for a drawable object
  * @interface Drawable
  * @param {String} name the name of the drawable
  * @property {String} name the name of the drawable
  */
function Drawable(name) {
  var self = this;
  
  /**
   * Creates a Drawable
   * @memberof Drawable
   * @function Drawable#constructor
   * @param {String} name name
   */
  self.constructor = function(name) {
    self.name = name
  }
  /**
   * Draw function
   * @function Drawable#draw
   * @param {RenderingContext} context the context to draw on
   * @param {Number} x the x coordinate to draw at
   * @param {Number} y the y coordinate to draw at
   */
  self.draw = function(context, x, y) { }  
}

/** A sprite is the image of an object
  * @class Sprite
  * @implements Drawable
  * @param {String} name image name
  * @param {Number} width image width
  * @param {Number} height image height
  * @param {String} src image source
  * @param {Boolean} [isSpriteSheet=false] if image is sprite sheet
  * @param {Number} [defAngle=0] default image angle
  * @property {String} src image source
  * @property {Number} width image width
  * @property {Number} height image height
  * @property {Image} image the image
  * @property {Boolean} isSpriteSheet if image is sprite sheet
  * @property {Number} currentSprite=0 the index into the spritesheet
  * @property {Boolean} doDraw=true whether the sprite should be drawn or not
  */
function Sprite(name, width, height, src, isSpriteSheet=false, defAngle=0) {
  var self = this;
  
  /** Creates the Sprite
    * @function Sprite.constructor
    * @param {String} name image name
    * @param {Number} width image width
    * @param {Number} height image height
    * @param {String} src image source
    * @param {Boolean} [isSpriteSheet=false] if image is sprite sheet
    * @param {Number} [defAngle=0] default image angle
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
    'src': { get: function() { return self.image.src }, set: function(v) { self.image.src = v } },
    'width': { get: function() { return self.image.width }, set: function(v) { self.image.width = v } },
    'height': { get: function() { return self.image.height }, set: function(v) { self.image.height = v } }
  });
  
  /** Draws the sprite based on the angle and sprite sheet chosen. Do not override this function.
  * @function Sprite#draw
  * @param {RenderingContext} context - the context
  * @param {Number} x - the x position on the canvas
  * @param {Number} y - the y position on the canvas
  * @param {Number} angle - the angle of the sprite
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
 * @implements Drawable
 * @class FilledRect
 * @param {String} name the name of the rectangle sprite
 * @param {Number} width the width of the rectangle
 * @param {Number} height the height of the rectangle
 * @param {String} fillStyle the fill style of the rectangle
 */
function FilledRect(name, width, height, fillStyle) {
  var self = this;
  /**
   * Constructor method
   * @memberof FilledRect
   * @function FilledRect#constructor
   * @param {String} name the name of the rectangle sprite
   * @param {Number} width the width of the rectangle
   * @param {Number} height the height of the rectangle
   * @param {String} fillStyle the fill style of the rectangle
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
    * @function FilledRect#draw
    * @param {RenderingContext} context - the context
    * @param {Number} x - the x position on the canvas
    * @param {Number} y - the y position on the canvas
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