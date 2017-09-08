function Game(canvas) {
  this.mouseX = 0;
  this.mouseY = 0;
  this.clickState = "UP"; //States: UP, BEGIN_DOWN, DOWN, BEGIN_UP
  this.hasMouseMoved = false;
  var self = this;
  
  this.selected;
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.gameTree = new Array();
  this.guiTree = new Array;
  this.timer = undefined;
  
  this.sprites = new SceneGraph("sprites");
  this.objects = new SceneGraph("objects");
  
  
  setUpMouseListeners(this.canvas);
  
}

Game.prototype.mouseMove = function() {
}

Game.prototype.draw = function() {
  this.objects.draw();
}

Game.prototype.preDraw = function() {
  
}

Game.prototype.postDraw = function() {
  
}

Game.prototype.update = function () {
  handleMouseActions();
  objects.update();
}

Game.prototype.loop = function() {
  this.canvas.width = this.canvas.width;
  this.update();
  this.preDraw();
  this.draw();
  this.postDraw();
}
    
Game.prototype.start = function(milliseconds) {
  self.timer = setInterval(self.loop, milliseconds);
  canvas.addEventListener("mousedown", function(e) {
	  this.mouseX = mouseX;
	  this.mouseY = mouseY;
  }
}
Game.prototype.stop = function() {
  if (self.timer != undefined) {
    clearInterval(self.timer);
  }
}

function parseFile(fileUrl, lineTransformer) {
  //lineTransformer is a function that takes a line as an input and then does something with it
  return $.get( fileUrl, function( data ) {
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; ++i) {
      lines[i] = lineTransformer(lines[i]);
    }
    return lines;
  });
  //TODO verify this works
}

Game.prototype.addMouseListeners = function(canvas) {
  canvas.addEventListener("mousemove", function(e) {
    if(this.mouseX != e.offsetX || this.mouseY != e.offsetY){
      this.hasMouseMoved = true;
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
    }
  }
  canvas.addEventListener("mousedown", function(e) {
    this.mouseState = "BEGIN_DOWN";  
  }
  
  canvas.addEventListener("mouseup", function(e) {
    this.mouseState = "BEGIN_UP";
  }
  console.log("Mouse Listeners Initialized!");
}

Game.prototype.handleMouseActions = function() {
  if(this.mouseState == "UP"){              //UP
    //do nothing?
  }
  else if(this.mouseState == "BEGIN_DOWN"){ //BEGIN_DOWN
    this.selected = findObjectAt(this.mouseX, this.mouseY);
    //Finished. Transition into DOWN state
    this.mouseState = "DOWN";
  }
  else if(this.mouseState == "DOWN"){       //DOWN
    if(selected != undefined && this.hasMouseMoved){
      //TODO do something about it
      this.selected.moveTo(this.mouseX, this.mouseY);
    }
  }
  else if(this.mouseState == "BEGIN_UP"){   //BEGIN_UP
    var overlapping = findOverlapingObjects(selected);
    //TODO do something with the overlapping objects
    
    //Finished. Transition into UP state
    this.mouseState = "UP";
  }
  //Movement has been resolved, set hasMouseMoved to false
  this.hasMouseMoved = false;
}

//These next two functions may need to be moved inside of the Object class
Game.prototype.findObjectAt(x, y) = function() {
  //TODO return the top GameObject at x, y
}

Game.prototype.findOverlapingObjects(dropped) = function{
  //TODO return objects underneath GameObject dropped
}