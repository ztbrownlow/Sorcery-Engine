document.write('<script type="text/javascript" src="vector.js"></script>');
document.write('<script type="text/javascript" src="Sprites.js"></script>');
document.write('<script type="text/javascript" src="object.js"></script>');
document.write('<script type="text/javascript" src="SceneGraph.js"></script>');
document.write('<script type="text/javascript" src="key.js"></script>');
document.write('<script type="text/javascript" src="gameManager.js"></script>');
document.write('<script type="text/javascript" src="Grid.js"></script>');

/**
 * Flattens a array of arrays (of arrays...) into a single array
 */
function flatten(arrays) {
  return arrays.reduce(function(a, b){ if(a){return a.concat(b)} else {return b} });
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
    *
	*/
  self.findRandomUnoccupiedPoint = function(objectTree, step) {
    var x;
    var y;
    var temp;
    do {
      x = Math.floor(Math.random() * (self.canvas.width-1) / step) * step;
      y = Math.floor(Math.random() * (self.canvas.height-1) / step) * step;
      temp = self.objects.pointCollide(x, y, false);
    } while (!temp || flatten(temp).filter(function(e) {return e;}).length != 0);
    self.x = x;
    self.y = y;
    return [x, y];
  }
  
  /**
    *
	*/
  self.outOfBounds = function(x, y) {
    return x >= self.canvas.width || x < 0 || y >= self.canvas.height || y < 0;
  }
  
  /**
    *
	*/
  self.getObjectsUnderMouse = function() {
    var temp = self.objects.pointCollide(self.mouseX, self.mouseY, true);
    if (temp) {
      var f = flatten(temp);
      if (f)
        return f.filter(function(e) {return e;});
    }
    return [];
  }
  
  /**
    *
	*/
  self.mouseDown = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseDown(self, e);
    }
  }
  
  /**
    *
	*/
  self.mouseUp = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseUp(self, e);
    }
  }
  
  /**
    *
	*/
  self.mouseOut = function(e) {
    self.mouseUp(e);
  }
  
  /**
    *
	*/
  self.mouseMove = function(e) {
    self.mouseX = e.offsetX;
    self.mouseY = e.offsetY;
  }
  
  /**
    *
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
    *
	*/
  self.draw = function() {
    self.objects.draw(self.context);
  }
  
  /**
    *
	*/
  self.customPreDraw = function(){}
  
  /**
    *
	*/
  self.preDraw = function() {
    if (self.customPreDraw) {
      self.customPreDraw();
    }
  }
  
  /**
    *
	*/
  self.customPostDraw = function(){}
  
  /**
    *
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
    *
	*/
  self.loop = function() {
    self.canvas.width = self.canvas.width;
    self.update();
    self.preDraw();
    self.draw();
    self.postDraw();
  }
  
  /**
    *
	*/
  self.start = function(milliseconds) {
    self.timer = setInterval(self.loop, milliseconds);
  }
  
  /**
    *
	*/
  self.stop = function() {
    clearInterval(self.timer);
  }
  
  /**
    *
	*/
  self.constructor(canvas, name);
}
