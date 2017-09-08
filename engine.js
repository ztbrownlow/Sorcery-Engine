function Game(canvas) {
  this.mouseX = 0;
  this.mouseY = 0;
  this.mouseDown = false;
  var self = this;
  canvas.addEventListener("mousemove", function(e) {
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
    self.mouseMove(e);
  });
  canvas.addEventListener("mousedown", function(e) {
    mouseDown = true;
    self.mouseDown(e);
  });
  canvas.addEventListener("mouseup", function(e) {
    mouseDown = false;
    self.mouseUp(e);
  });
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.gameTree = new Array();
  this.guiTree = new Array;
  this.timer = undefined;
  
  this.sprites = new SceneGraph("sprites");
  this.objects = new SceneGraph("objects");
}

Game.prototype.mouseMove = function(e) {
}

Game.prototype.mouseDown = function(e) {
  
}

Game.prototype.mouseUp = function(e) {
  
}

Game.prototype.draw = function() {
  this.objects.draw(this);
}

Game.prototype.preDraw = function() {
  
}

Game.prototype.postDraw = function() {
  
}

Game.prototype.update = function () {
  this.objects.update();
}

Game.prototype.loop = function() {
  this.canvas.width = this.canvas.width;
  this.update();
  this.preDraw();
  this.draw();
  this.postDraw();
}
    
Game.prototype.start = function(milliseconds) {
  this.timer = setInterval(this.loop, milliseconds);
}
Game.prototype.stop = function() {
  if (this.timer != undefined) {
    clearInterval(this.timer);
  }
}

function parseFile(fileUrl, lineTransformer) {
  console.log(fileUrl);
  //lineTransformer is a function that takes a line as an input and then does something with it
  return $.get( fileUrl, function( data ) {
    console.log("reading file");
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; ++i) {
      lines[i] = lineTransformer(lines[i]);
    }
    return lines;
  });
  //TODO verify this works
}