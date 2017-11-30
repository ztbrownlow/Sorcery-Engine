document.write('<script type="text/javascript" src="vector.js"></script>');
document.write('<script type="text/javascript" src="Sprites.js"></script>');
document.write('<script type="text/javascript" src="object.js"></script>');
document.write('<script type="text/javascript" src="SceneGraph.js"></script>');
document.write('<script type="text/javascript" src="key.js"></script>');
document.write('<script type="text/javascript" src="gameManager.js"></script>');
document.write('<script type="text/javascript" src="Grid.js"></script>');

/**
 * Flattens an n-dimensional array
 * @param {Array} arrays array to flatten
 * @param {Boolean} [removeNullsAndUndefineds=true] whether or not to remove null and undefined values when flattening the array. Defaults to true.
 * @return flattened array
 */
function flatten(arrays, removeNullsAndUndefineds=true) {
  return arrays.reduce(
    function(a,b) {
      if (removeNullsAndUndefineds && (b == null || b == undefined)) {
        return a;
      }
      return a.concat(Array.isArray(b) ? flatten(b, removeNullsAndUndefineds) : b);
    }, []);
}

/**
 * The main game class
 * @class
 * @namespace Game
 * @param canvas the canvas to draw on
 * @param name the name of the game
 */
function Game(canvas, name) {
  var self = this
  
  /**
   * Constructor
   * @constructs Game
   * @param canvas the canvas to draw on
   * @param name the name of the game
   */
  self.constructor = function(canvas, name) {
    self.canvas = canvas;
    self.mouseX = 0;
    self.mouseY = 0;
    self.name = name;
    self.context = canvas.getContext('2d');
    self.timer = null;
    self.sprites = new SceneGraph("sprites");
    self.objects = new SceneGraph("objects");
    self.score = new SceneGraph("score");
    self.gameManager = new GameManager();
    canvas.addEventListener("mousemove", function(e) {self.mouseMove(e)});
    canvas.addEventListener("mousedown", function(e) {self.mouseDown(e)});
    canvas.addEventListener("mouseup", function(e) {self.mouseUp(e)});
    canvas.addEventListener("mouseout", function(e) {self.mouseOut(e)});
  }
  
  /**
    * Finds a random point that is not occupied by any part of any object
    * @memberof Game
    * @function Game#findRandomUnoccupiedPoint
    * @param {SceneGraph} [objectTree=Game.objects] the objectTree to check against. If none, defaults to Game.objects.
    * @param {Number} [step=1] how large of an increment to use when selecting a random point. If none, defaults to 1 pixel. Useful for grid-based games
    * @return {Array} a random point that does not hit any objects in the format [x, y]
    */
  self.findRandomUnoccupiedPoint = function(objectTree, step) {
    var x;
    var y;
    var temp;
    if (!objectTree) {
      objectTree = self.objects;
    }
    if (!step) {
      step = 1;
    }
    do {
      x = Math.floor(Math.random() * (self.canvas.width-1) / step) * step;
      y = Math.floor(Math.random() * (self.canvas.height-1) / step) * step;
      temp = objectTree.pointCollide(x, y, false);
    } while (!temp || flatten(temp).filter(function(e) {return e;}).length != 0);
    self.x = x;
    self.y = y;
    return [x, y];
  }
  
  /**
    * Checks if a coordinate is out of the bounds of the canvas
    * @memberof Game
    * @instance
    * @function Game#outOfBounds
    * @param {Number} x x coordinate to check
    * @param {Number} y y coordinate to check
    * @return {Boolean} true if coordinate is out of bounds
    */
  self.outOfBounds = function(x, y) {
    return x >= self.canvas.width || x < 0 || y >= self.canvas.height || y < 0;
  }
  
  /**
    * Gets a list of all objects that are under the mouse
    * @memberof Game
    * @instance
    * @function Game#getObjectsUnderMouse
    * @param {SceneGraph} [objectTree=Game.objects] what objectTree to check through. Defaults to Game.objects
    * @param {Boolean} [limitToClickable=true] whether or not to only check against clickable objects. Defaults to true.
    * @return {Array} a list of objects under the mouse
    */
  self.getObjectsUnderMouse = function(objectTree=null, limitToClickable=true) {
    if (!objectTree) {
      objectTree = self.objects;
    }
    var temp = objectTree.pointCollide(self.mouseX, self.mouseY, limitToClickable);
    if (temp) {
      var f = flatten(temp);
      if (f)
        return f.filter(function(e) {return e;});
    }
    return [];
  }
  
  /**
    * Mousedown function. Calls mouseDown on all of the clickable objects in the game
    * @memberof Game
    * @instance
    * @function Game#mouseDown
    */
  self.mouseDown = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseDown(self, e);
    }
  }
  
  /**
    * Mouseup function. Calls mouseUp on all of the clickable objects in the game
    * @memberof Game
    * @instance
    * @function Game#mouseUp
    */
  self.mouseUp = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseUp(self, e);
    }
  }
  
  /**
    * Mouseout function, called when the mouse leaves the canvas. By default, delgates to Game.MouseDown
    * @memberof Game
    * @instance
    * @function Game#mouseOut
    */
  self.mouseOut = function(e) {
    self.mouseUp(e);
  }
  
  /**
    * Mousemove function. Updates Game.mouseX and Game.mouseY
    * @memberof Game
    * @instance
    * @function Game#mouseMove
    */
  self.mouseMove = function(e) {
    self.mouseX = e.offsetX;
    self.mouseY = e.offsetY;
  }
  
  /**
    * Update function. In order, Gets key presses, runs all events from the game manager, updates all objects, updates all object states to reflect their new positions, and finally runs post-update events from the game manager.
    * @memberof Game
    * @instance
    * @function Game#update
    */
  self.update = function() {
    //self.handleMouseActions();
    Key.update();
    self.gameManager.update();
    self.objects.update(self);
    self.objects.updatePosition();
    self.gameManager.postUpdate();
  }
  
  /**
    * Draws the game by drawing all of the drawable objects
    * @memberof Game
    * @instance
    * @function Game#draw
    */
  self.draw = function() {
    self.objects.draw(self.context);
  }
  
  /**
    * User-defined custom pre draw function. By default, doesn't do anything. Override to use.
    * @memberof Game
    * @instance
    * @function Game#customPreDraw
    */
  self.customPreDraw = function(){}
  
  /**
    * Runs before draw call. Calls Game.customPreDraw
    * @memberof Game
    * @instance
    * @function Game#preDraw
    */
  self.preDraw = function() {
    if (self.customPreDraw) {
      self.customPreDraw();
    }
  }
  
  /**
    * User-defined custom post draw function. By default, doesn't do anything. Override to use.
    * @memberof Game
    * @instance
    * @function Game#customPostDraw
    */
  self.customPostDraw = function(){}
  
  /**
    * Runs after draw call. Calls Game.customPostDraw and then draws the score if applicable
    * @memberof Game
    * @instance
    * @function Game#postDraw
    */
  self.postDraw = function() {
    if (self.customPostDraw) {
      self.customPostDraw();
    }
    for(var i = 0; i < self.score.length; i++){
      var currentScore = self.score.children[i];
      if(currentScore.displayScore){
        game.context.fillStyle = currentScore.scoreColor;
        game.context.font = currentScore.scoreFont;
        game.context.fillText("Score: " + currentScore.score, currentScore.scoreX, currentScore.scoreY);
      }
    }
  }
  
  /**
    * Game loop. Runs through update and draw process
    * @memberof Game
    * @instance
    * @function Game#loop
    */
  self.loop = function() {
    self.update();
    self.canvas.width = self.canvas.width;
    self.preDraw();
    self.draw();
    self.postDraw();
  }
  
  /**
    * Starts running the game
    * @memberof Game
    * @instance
    * @function Game#start
    * @param {Number} milliseconds the amount of time that should be set to pass between game loop calls
    */
  self.start = function(milliseconds) {
    if (!self.timer) {
      self.timer = setInterval(self.loop, milliseconds);
    }
  }
  
  /**
    * Stops running the game
    * @memberof Game
    * @instance
    * @function Game#stop
    */
  self.stop = function() {
    clearInterval(self.timer);
    self.timer = null;
  }
    
  self.constructor(canvas, name);
}
