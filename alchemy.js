var game = new Game(document.getElementById("canvas"));
//graphical options
var imageSize = 64;
var numRows = 3;
var guiWidth = canvas.width;
var sepWidth = 3;
var guiHeight = numRows * imageSize + ((numRows - 1) * sepWidth);

//set up scene graph
var spr_gui = game.sprites.push(new SceneGraph("guiRects"));
var spr_elements = game.sprites.push(new SceneGraph("elements"));
var obj_gui = game.objects.push(new SceneGraph("guiRects", false, true, false));
obj_gui.push(new GameObject("main", spr_gui.push(new FilledRect("main", guiWidth, guiHeight, "#AAAAAA")), 0, game.canvas.height - guiHeight));
var spr_guiSep = spr_gui.push(new FilledRect("separator", guiWidth, sepWidth, "#BBBBBB"));
for(var i = 1; i <= numRows - 1; i++){
  obj_gui.unshift(new GameObject("sep_"+i, spr_guiSep, 0, game.canvas.height - guiHeight + (i * imageSize) + ((i-1) * sepWidth)));
}
var obj_elements = game.objects.unshift(new SceneGraph("elements"));
var obj_onScreen = game.objects.unshift(new SceneGraph("onScreen"));

var selected = null;

//custom object
function Element(spr, name, unlocked, x, y) {
  var self = this;
  self.constructor = function(spr, name, unlocked, x, y) {
    GameObject.call(self, name, spr, x, y);
    self.unlocked = unlocked;
    self.interactions = {};
  }
  self.constructor(spr, name, unlocked, x, y)
  self.link = function(element2,element3) {
    self.interactions[element2.name] = element3;
    element2.interactions[self.name] = element3;
  }
  
  self.combine = function(element2) {
    return self.interactions[element2.name];
  }
  
  self.oldMouseDown = self.mouseDown;
  self.mouseDown = function(game, event) {
    self.oldMouseDown(game, event);
    if (self.unlocked) {
      selected = self;
    }
  }
  self.oldDraw = self.draw
  self.draw = function(context) {
    self.oldDraw(context);
    if (!self.unlocked) {
      context.fillStyle = "black";
      context.globalAlpha=0.5;
      context.fillRect(self.x, self.y, imageSize, imageSize);
      context.globalAlpha=1;
    }
  }
}

var oldUp = game.mouseUp;
game.mouseUp = function(e) {
  oldUp(e);
  selected = null;
}

var oldMove = game.mouseMove;
game.mouseMove = function(e) {
  oldMove(e)
  console.log("MOVE");
  if (selected) {
    console.log(selected);
    obj_onScreen.unshift(new DraggableElement(selected.sprite, selected.name, selected.unlocked, selected.x, selected.y));
    selected = null;
  }
}

//added functionality for collisions
function DraggableElement(spr, name, unlocked, x, y) {
  var self = this;
  self.constructor = function(spr, name, unlocked, x, y) {
    Element.call(self, spr, name, unlocked, x, y);
    self.isDraggable = true;
    self.isClicked = true;
    self.xOffset = imageSize/2;
    self.yOffset = imageSize/2;
    self.draw = self.oldDraw;
  }
  self.constructor(spr, name, unlocked, x, y)
  self.mouseDown = function(game, event) {
    self.oldMouseDown(game, event);
    obj_onScreen.moveToFront(obj_onScreen.indexOf(self));
  }
  self.oldMouseUp = self.mouseUp;
  self.mouseUp = function(game, event) {
    self.oldMouseUp(self, game, event);
    if (game.mouseY >= game.canvas.height - guiHeight) {
      obj_onScreen.remove(self);
    } else {
      obj_onScreen.forEachUntilFirstSuccess(function(e) {return self.tryCollide(e)});
    }
  }
  
  self.canCollideWith = function(other) {
    return obj_elements.firstByName(self.name).combine(other);
  }
  
  self.collideWith = function(other) {
    //console.log([self, other]);
    var combined = self.canCollideWith(other); //find new element
    if (combined) { //if new element exists (valid formula)
      ////console.log(o_self.element.name + "+" + other.element.name + "=" + combined.name); //log formula in console
      self.name = combined.name; //set self Draggable's element to the new element
      self.sprite = combined.sprite;
      if (!combined.unlocked) { //if we haven't unlocked the new element yet, unlock it
        combined.unlocked = true;
      }
      obj_onScreen.remove(other); //remove other element from screen
      return true;
    }
    return false;
  }
}

//text
game.preDraw = function() {
  game.context.fillStyle = "black";
  game.context.font = "bold 12px Arial";
  game.context.fillText("Place items here", 0, 10);
}

//adding elements to game
var i = 0;
function addElement(name, img, unlocked) {
  var xpos = imageSize*(i%Math.floor(guiWidth/imageSize));
  var ypos = game.canvas.height - guiHeight + (imageSize+sepWidth)*Math.floor(i++/Math.floor(guiWidth/imageSize));
  obj_elements.push(new Element(spr_elements.push(new Sprite(name, imageSize, imageSize, img)), name, unlocked, xpos, ypos));
}
addElement("wings", "http://www4.ncsu.edu/~ztbrownl/images/wings.png", true)
addElement("scales", "http://www4.ncsu.edu/~ztbrownl/images/scales.png", true)
addElement("fur", "http://www4.ncsu.edu/~ztbrownl/images/fur.png", true)
addElement("skin", "http://www4.ncsu.edu/~ztbrownl/images/skin.png", true)
addElement("horn", "http://www4.ncsu.edu/~ztbrownl/images/horn.png", true)
addElement("water", "http://www4.ncsu.edu/~ztbrownl/images/water.png", true)
addElement("hair", "http://www4.ncsu.edu/~ztbrownl/images/hair.png", false)
addElement("bird", "http://www4.ncsu.edu/~ztbrownl/images/bird.png", false)
addElement("snake", "http://www4.ncsu.edu/~ztbrownl/images/snake.png", false)
addElement("dragon", "http://www4.ncsu.edu/~ztbrownl/images/dragon.png", false)
addElement("human", "http://www4.ncsu.edu/~ztbrownl/images/human.png", false)
addElement("fish", "http://www4.ncsu.edu/~ztbrownl/images/fish.png", false)
addElement("horse", "http://www4.ncsu.edu/~ztbrownl/images/horse.png", false)
addElement("lion", "http://www4.ncsu.edu/~ztbrownl/images/lion.png", false)
addElement("bull", "http://www4.ncsu.edu/~ztbrownl/images/bull.png", false)
addElement("unicorn", "http://www4.ncsu.edu/~alrichma/images/unicorn.png", false)
addElement("griffin", "http://www4.ncsu.edu/~alrichma/images/griffin.png", false)
addElement("werewolf", "http://www4.ncsu.edu/~alrichma/images/werewolf.png", false)
addElement("angel", "http://www4.ncsu.edu/~alrichma/images/angel.png", false)
addElement("pegasus", "http://www4.ncsu.edu/~ztbrownl/images/pegasus.png", false)
addElement("sphinx", "http://www4.ncsu.edu/~alrichma/images/sphinx.png", false)
addElement("mermaid", "http://www4.ncsu.edu/~alrichma/images/mermaid.png", false)
addElement("minotaur", "http://www4.ncsu.edu/~alrichma/images/minotar.png", false)
addElement("centaur", "http://www4.ncsu.edu/~alrichma/images/centaur.png", false)
addElement("medusa", "http://www4.ncsu.edu/~alrichma/images/medusa.png", false)
addElement("harpy", "http://www4.ncsu.edu/~alrichma/images/harpy.png", false)
addElement("manticore", "http://www4.ncsu.edu/~ztbrownl/images/manticore.png", false)
obj_elements.firstByName("scales").link(obj_elements.firstByName("fur"), obj_elements.firstByName("hair"))
obj_elements.firstByName("wings").link(obj_elements.firstByName("wings"), obj_elements.firstByName("bird"))
obj_elements.firstByName("scales").link(obj_elements.firstByName("scales"), obj_elements.firstByName("snake"))
obj_elements.firstByName("wings").link(obj_elements.firstByName("scales"), obj_elements.firstByName("dragon"))
obj_elements.firstByName("snake").link(obj_elements.firstByName("wings"), obj_elements.firstByName("dragon"))
obj_elements.firstByName("skin").link(obj_elements.firstByName("hair"), obj_elements.firstByName("human"))
obj_elements.firstByName("water").link(obj_elements.firstByName("scales"), obj_elements.firstByName("fish"))
obj_elements.firstByName("fur").link(obj_elements.firstByName("hair"), obj_elements.firstByName("horse"))
obj_elements.firstByName("fur").link(obj_elements.firstByName("fur"), obj_elements.firstByName("lion"))
obj_elements.firstByName("fur").link(obj_elements.firstByName("horn"), obj_elements.firstByName("bull"))
obj_elements.firstByName("human").link(obj_elements.firstByName("fur"), obj_elements.firstByName("werewolf"))
obj_elements.firstByName("human").link(obj_elements.firstByName("hair"), obj_elements.firstByName("werewolf"))
obj_elements.firstByName("human").link(obj_elements.firstByName("wings"), obj_elements.firstByName("angel"))
obj_elements.firstByName("horse").link(obj_elements.firstByName("wings"), obj_elements.firstByName("pegasus"))
obj_elements.firstByName("horn").link(obj_elements.firstByName("horse"), obj_elements.firstByName("unicorn"))
obj_elements.firstByName("bird").link(obj_elements.firstByName("lion"), obj_elements.firstByName("griffin"))
obj_elements.firstByName("human").link(obj_elements.firstByName("lion"), obj_elements.firstByName("sphinx"))
obj_elements.firstByName("human").link(obj_elements.firstByName("fish"), obj_elements.firstByName("mermaid"))
obj_elements.firstByName("human").link(obj_elements.firstByName("water"), obj_elements.firstByName("mermaid"))
obj_elements.firstByName("human").link(obj_elements.firstByName("bull"), obj_elements.firstByName("minotaur"))
obj_elements.firstByName("human").link(obj_elements.firstByName("horse"), obj_elements.firstByName("centaur"))
obj_elements.firstByName("human").link(obj_elements.firstByName("snake"), obj_elements.firstByName("medusa"))
obj_elements.firstByName("human").link(obj_elements.firstByName("bird"), obj_elements.firstByName("harpy"))
obj_elements.firstByName("sphinx").link(obj_elements.firstByName("dragon"), obj_elements.firstByName("manticore"))

game.start(30);