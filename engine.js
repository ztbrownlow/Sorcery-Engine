document.write('<script type="text/javascript" src="vector.js"></script>');
document.write('<script type="text/javascript" src="Sprites.js"></script>');
document.write('<script type="text/javascript" src="object.js"></script>');
document.write('<script type="text/javascript" src="SceneGraph.js"></script>');
document.write('<script type="text/javascript" src="key.js"></script>');
document.write('<script type="text/javascript" src="score.js"></script>');

function flatten(arrays) {
  return arrays.reduce(function(a, b){ if(a){return a.concat(b)} else {return b} });
}

function Game(canvas) {
  var self = this
  self.constructor = function(canvas) {
    self.canvas = canvas;
    self.mouseX = 0;
    self.mouseY = 0;
    self.context = canvas.getContext('2d');
    self.timer = null;
    self.sprites = new SceneGraph("sprites");
    self.objects = new SceneGraph("objects"); 
    canvas.addEventListener("mousemove", function(e) {self.mouseMove(e)});
    canvas.addEventListener("mousedown", function(e) {self.mouseDown(e)});
    canvas.addEventListener("mouseup", function(e) {self.mouseUp(e)});
    canvas.addEventListener("mouseout", function(e) {self.mouseOut(e)});
  }
  
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
  
  self.outOfBounds = function(x, y) {
    return x >= self.canvas.width || x < 0 || y >= self.canvas.height || y < 0;
  }
  
  self.getObjectsUnderMouse = function() {
    return flatten(self.objects.pointCollide(self.mouseX, self.mouseY, true)).filter(function(e) {return e;});
  }
  
  self.mouseDown = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseDown(self, e);
    }
  }
  
  self.mouseUp = function(e) {
    var temp = self.getObjectsUnderMouse();
    if (temp.length > 0) {
      temp[0].mouseUp(self, e);
    }
  }
  
  self.mouseOut = function(e) {
    self.mouseUp(e);
  }
  
  self.mouseMove = function(e) {
    self.mouseX = e.offsetX;
    self.mouseY = e.offsetY;
  }
  
  self.update = function() {
    //self.handleMouseActions();
    self.objects.update(self);
  }
  
  self.draw = function() {
    self.objects.draw(self.context);
  }
  
  self.preDraw = function() {
    
  }
  self.postDraw = function() {
    
  }
  self.loop = function() {
    self.canvas.width = self.canvas.width;
    self.update();
    self.preDraw();
    self.draw();
    self.postDraw();
  }
  self.start = function(milliseconds) {
    self.timer = setInterval(self.loop, milliseconds);
  }
  self.stop = function() {
    clearInterval(self.timer);
  }
  self.constructor(canvas);
}
