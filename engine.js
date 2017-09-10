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
    self.objects.update(self);
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
      if(self.mouseX !== e.offsetX || self.mouseY !== e.offsetY) {

        self.hasMouseMoved = true;
        self.mouseX = e.offsetX;
        self.mouseY = e.offsetY;

      }
    })
    canvas.addEventListener("mousedown", function(e) {
      self.mouseX = e.offsetX;
      self.mouseY = e.offsetY;
      self.clickState = "BEGIN_DOWN";
    })

    canvas.addEventListener("mouseup", function(e) {
      self.mouseX = e.offsetX;
      self.mouseY = e.offsetY;
      self.clickState = "BEGIN_UP";
    })
    
    canvas.addEventListener("mouseout", function(e) {
      self.mouseX = e.offsetX;
      self.mouseY = e.offsetY;
      self.clickState = "BEGIN_UP";
    });
    console.log("Mouse Listeners Initialized!");
  }
  
  this.handleMouseActions = function() {
    if(self.clickState === "UP"){              //UP
      console.log("UP");
      //do nothing?
    }
    else if(self.clickState === "BEGIN_DOWN"){ //BEGIN_DOWN
      console.log("BEGIN_DOWN");
      //note what object is selected, if any.
      //self.selected = self.findObjectAt(this.mouseX, this.mouseY);
      self.selected = self.findObjectAt(this.mouseX, this.mouseY);
      if (self.selected) {
        self.selected.isClicked = true;
      }
      //Transition into DOWN state
      self.clickState = "DOWN";
      console.log(self.selected);
    }
    else if(self.clickState === "DOWN"){       //DOWN
      console.log("DOWN");
      //The mouse continues to be held down. If the mouse moves, move the selected object.
      if(self.selected && self.hasMouseMoved){
        //self.selected.attemptMove(self.mouseX, self.mouseY); //call GameObject.attemptMove()
        if (self.selected.isSpawner) {
          self.selected.isClicked = false;
          self.selected = self.objects.FirstByName("onScreen").push(self.selected.spawnerFunc());
          self.selected.isClicked = true;
        }
      }
    }
    else if(self.clickState === "BEGIN_UP"){   //BEGIN_UP
      console.log("BEGIN_UP");
      //Drop the selected object, if any.
      if(self.selected){
        self.selected.isClicked = false;
        //Find what objects are underneath
        var overlapping = self.findOverlappingObjects(self.selected);
        //TODO do something with the overlapping objects
        if(overlapping)
          for(var i = 0; i < overlapping.length; i++){
            var e = overlapping[i];
            //Tell game class that the objects are overlapping
          }
        //remove the previously selected object from the selected field.
        self.selected = null;
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
      var onScreen = self.objects.FirstByName("onScreen");
      var buttons = self.objects.FirstByName("elements");

      for(var i = 0; i < buttons.children.length; i++){
        var button = buttons.children[i];
        if( checkSpriteRect(button.sprite, button.x, button.y, x, y)){
          console.log("Clicked: " + button.name);
          topGUIObject = button;
          break;
        }
      }

      // for(var i = 0; i < sprites.length; i++) {
      //   var s = sprites[i];
      //   console.log("Button name " + s.name);
      //   if (object !== null && object instanceof GameObject) {
      //     if (object.isPointWithinSprite(object.sprite, x, y)) {
      //       topGameObject = object;
      //       break;
      //     }
      //   }
      // }

      if(topGUIObject !== null){
        return topGUIObject;
      }
      
      for(var i = 0; i < onScreen.children.length; i++){
        var button = onScreen.children[i];
        console.log("Name: " + button.name);
        if( checkSpriteRect(button.sprite, button.x, button.y, x, y)){
          console.log("Clicked: " + button.name);
          topGameObject = button;
          break;
        }
      }
      
      return topGameObject;
    }

  this.findOverlappingObjects = function(dropped) {
    //TODO return objects underneath GameObject dropped
    var onScreen = self.objects.FirstByName("onScreen");
    for(var i = 1; i < onScreen.children.length; i++){
      var sprite = onScreen.children[i];
      if(sprite.isOverlapping(dropped)){
        console.log("overlap detected")
        break;
      }
    }
    return null;
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
