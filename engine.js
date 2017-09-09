function Game(canvas) {
  this.mouseX = 0;
  this.mouseY = 0;
  this.clickState = "UP"; //States: UP, BEGIN_DOWN, DOWN, BEGIN_UP
  this.hasMouseMoved = false;
  var self = this;
  canvas.addEventListener("mousedown", function(e) {
	  this.mouseX = mouseX;
	  this.mouseY = mouseY;
  }
  
  this.selected;
  
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.timer = undefined;
  
  this.sprites = new SceneGraph("sprites");
  this.objects = new SceneGraph("objects");

  setUpMouseListeners(this.canvas);

  this.draw = function() {
    self.objects.draw(self);
  }

  this.preDraw = function() {
    
  }

  this.postDraw = function() {
    
  }  
  
  this.update  = function() {
    self.objects.update();
  }

  this.loop = function() {
    self.canvas.width = self.canvas.width;
    self.update();
    self.preDraw();
    self.draw();
    self.postDraw();
  }
  
  this.start = function(milliseconds) {
    self.timer = setInterval(self.loop, milliseconds);
  }
  this.stop = function(milliseconds) {
    clearInterval(self.timer);
  }
}

/*function parseFile(fileUrl, lineTransformer) {
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
}*/