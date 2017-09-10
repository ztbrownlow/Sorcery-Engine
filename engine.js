function Game(canvas) {
  this.mouseX = 0;
  this.mouseY = 0;
  this.clickState = "UP"; //States: UP, BEGIN_DOWN, DOWN, BEGIN_UP
  this.hasMouseMoved = false;
  var self = this;

  this.selected = null;

  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.timer = undefined;

  this.sprites = new SceneGraph("sprites");
  this.objects = new SceneGraph("objects");

  this.draw = function() {
    self.objects.draw(self);
  }

  this.preDraw = function() {

  }

  this.postDraw = function() {

  }

  this.update  = function() {
    self.handleMouseActions();
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

  this.setUpMouseListeners = function(canvas) {
    canvas.addEventListener("mousemove", function(e) {
    canvas.addEventListener("mousedown", function(e) {
      self.clickState = "BEGIN_DOWN";
    })

    canvas.addEventListener("mouseup", function(e) {
      self.clickState = "BEGIN_UP";
    })
    console.log("Mouse Listeners Initialized!");
  }

  this.handleMouseActions = function() {
    if(self.clickState === "UP"){              //UP
      //do nothing?
    }
    else if(self.clickState === "BEGIN_DOWN"){ //BEGIN_DOWN
      //note what object is selected, if any.
      self.selected = self.findObjectAt(this.mouseX, this.mouseY);
      //Transition into DOWN state
      self.clickState = "DOWN";
    }
    else if(self.clickState === "DOWN"){       //DOWN
      //The mouse continues to be held down. If the mouse moves, move the selected object.
      if(self.selected !== undefined && self.hasMouseMoved){
        self.selected.attemptMove(self.mouseX, self.mouseY); //call GameObject.attemptMove()
      }
    }
    else if(self.clickState === "BEGIN_UP"){   //BEGIN_UP
      //Drop the selected object, if any.
      if(self.selected !== undefined){
        //Find what objects are underneath
        var overlapping = self.findOverlappingObjects(selected);
        //TODO do something with the overlapping objects
        for(var i = 0; i < overlapping.length; i++){
          var e = overlapping[i];
          //Tell game class that the objects are overlapping
        }
        //remove the previously selected object from the selected field.
        self.selected = undefined;
      }
      //Finished. Transition into UP state
      self.clickState = "UP";
    }
    //Movement has been resolved, set hasMouseMoved to false
    self.hasMouseMoved = false;
  }

    //These next two functions may need to be moved inside of the Object class
    this.findObjectAt = function(x, y) {
      //TODO return the top GameObject at x, y
      var topGameObject = null;
      var topGUIObject = null;
      for(var i = 0; i < this.objects.children.length; i < 0) {
        var object = this.objects.children[i];
        if(object !== null && object instanceof object ){
          if(object.isPointWithinSprite(object.sprite, x, y)){
            topGameObject = object;
            break;
          }
        }
      }
      for(var j = 0; j < this.sprites.children.length; j < 0) {
        var sprite = this.sprites.children[j];
        if(sprite !== null && sprite instanceof sprite ){
          if(sprite.isPointWithinSprite(sprite.sprite, x, y)){
            topGUIObject = sprite;
            break;
          }
        }
      }

      if(topGUIObject !== null){
        return topGUIObject;
      }
      return topGameObject;

    }

  this.findOverlappingObjects = function(dropped) {
    //TODO return objects underneath GameObject dropped
  }

  this.setUpMouseListeners(this.canvas);
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
