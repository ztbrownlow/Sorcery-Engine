var game = new Game(document.getElementById("canvas"), "alchemy");
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
  if (selected) {
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
    var combined = self.canCollideWith(other); //find new element
    if (combined) { //if new element exists (valid formula)
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
game.customPreDraw = function() {
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
addElement("wings", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/wings.png", true)
addElement("scales", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/scales.png", true)
addElement("fur", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/fur.png", true)
addElement("skin", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/skin.png", true)
addElement("horn", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/horn.png", true)
addElement("water", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/water.png", true)
addElement("hair", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/hair.png", false)
addElement("bird", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/bird.png", false)
addElement("snake", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/snake.png", false)
addElement("dragon", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/dragon.png", false)
addElement("human", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/human.png", false)
addElement("fish", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/fish.png", false)
addElement("horse", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/horse.png", false)
addElement("lion", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/lion.png", false)
addElement("bull", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/bull.png", false)
addElement("unicorn", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/unicorn.png", false)
addElement("griffin", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/griffin.png", false)
addElement("werewolf", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/werewolf.png", false)
addElement("angel", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/angel.png", false)
addElement("pegasus", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/pegasus.png", false)
addElement("sphinx", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/sphinx.png", false)
addElement("mermaid", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/mermaid.png", false)
addElement("minotaur", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/minotar.png", false)
addElement("centaur", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/centaur.png", false)
addElement("medusa", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/medusa.png", false)
addElement("harpy", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/harpy.png", false)
addElement("manticore", "https://raw.githubusercontent.com/ztbrownlow/Sorcery-Engine/master/Examples/images/alchemyimages/manticore.png", false)

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