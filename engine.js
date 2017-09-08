function Game(canvas) {
  this.mouseX = 0;
  this.mouseY = 0;
  this.mousePressed = false;
  var self = this;
  canvas.addEventListener("mousemove", function(e) {
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
    self.mouseMove();
  });
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.gameTree = new Array();
  this.guiTree = new Array;
  this.timer = undefined;
  
  this.sprites = new SceneGraph("sprites");
  this.objects = new SceneGraph("objects");
}

Game.prototype.mouseMove = function() {
}

Game.prototype.draw() = function() {
  this.objects.draw();
}

Game.prototype.preDraw() = function() {
  
}

Game.prototype.postDraw() = function() {
  
}

Game.prototype.update = function () {
  //override
}

Game.prototype.loop = function() {
  this.canvas.width = this.canvas.width;
  this.update();
  this.preDraw();
  this.draw();
  this.postDraw();
}
    
Game.prototype.start = function(milliseconds) {
  self.timer.setInterval(self.loop, milliseconds);
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