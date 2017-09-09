var game = new Game(document.getElementById("canvas"));
var imageSize = 64;
var numRows = 3;
//width of the gui
var guiWidth = canvas.width;
var sepWidth = 3;
//height of the gui
var guiHeight = numRows * imageSize + ((numRows - 1) * sepWidth);
var spr_gui = game.sprites.push(new SceneGraph("guiRects"));
var spr_elements = game.sprites.push(new SceneGraph("elements"));
var obj_gui = game.objects.push(new SceneGraph("guiRects", false, true));
obj_gui.push(new GameObject("main", spr_gui.push(new FilledRectSprite("main", guiWidth, guiHeight, "#AAAAAA")), 0, game.canvas.height - guiHeight));
var spr_guiSep = spr_gui.push(new FilledRectSprite("separator", guiWidth, sepWidth, "#BBBBBB"));
for(var i = 1; i <= numRows - 1; i++){
  obj_gui.push(new GameObject("sep_"+i, spr_guiSep, 0, game.canvas.height - guiHeight + (i * imageSize) + ((i-1) * sepWidth)));
}
var obj_elements = game.objects.push(new SceneGraph("elements"));
var obj_onScreen = game.objects.unshift(new SceneGraph("onScreen"));


function Element(game, src, size, name, unlocked, x, y) {
  GameObject.call(this, name, spr_elements.push(new Sprite(name, size, size, src)), x, y);
  this.priorDraw = this.draw;
  this.unlocked = unlocked;
  this.interactions = {};
  var self = this;
  this.link = function(element2, element3) {
    self.interactions[element2.name] = element3;
    element2.interactions[self.name] = element3;
  }
  this.combine = function(element2) {
    return self.interactions[element2.name];
  }
  this.draw = function(game) {
    self.priorDraw(game);
    if (!self.unlocked) {
      game.context.fillStyle = "black";
      game.context.globalAlpha=0.5;
      game.context.fillRect(self.x, self.y, imageSize, imageSize);
      game.context.globalAlpha=1;
    }
  }
}

/*parseFile("alchemy/alchemy_data.txt", function(line) {
  console.log(line);
  if (line.length > 0) {
    if (line.startsWith("D:")) {
      line = line.substring(0, 2);
      line = line.split('|');
      var i = obj_elements.length;
      var xpos = imageSize*(i%Math.floor(guiWidth/imageSize));
      var ypos = game.canvas.height - guiHeight + (imageSize+sepWidth)*Math.floor(i/Math.floor(guiWidth/imageSize));
      obj_elements.push(new Element(line[0], line[1], imageSize, line[2] == "true" ? true : false, xPos, yPos));
    } else if (line.startsWith("F:")) {
      line = line.substring(0, 2);
      line = line.split('=');
      line[0] = line[0].split("+");
      obj_elements.FirstByName(line[0][0]).link(obj_elements.FirstByName(line[0][1]), obj_elements.FirstByName(line[1]));
    }
  }
});*/

game.preDraw = function() {
  game.context.fillStyle = "black";
  game.context.font = "bold 12px Arial";
  game.context.fillText("Place items here", 0, 10);
}

var i = 0;
function addElement(name, img, unlocked) {
  var xpos = imageSize*(i%Math.floor(guiWidth/imageSize));
  var ypos = game.canvas.height - guiHeight + (imageSize+sepWidth)*Math.floor(i++/Math.floor(guiWidth/imageSize));
  obj_elements.push(new Element(game, img, imageSize, name, unlocked, xpos, ypos));
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
obj_elements.FirstByName("scales").link(obj_elements.FirstByName("fur"), obj_elements.FirstByName("hair"))
obj_elements.FirstByName("wings").link(obj_elements.FirstByName("wings"), obj_elements.FirstByName("bird"))
obj_elements.FirstByName("scales").link(obj_elements.FirstByName("scales"), obj_elements.FirstByName("snake"))
obj_elements.FirstByName("wings").link(obj_elements.FirstByName("scales"), obj_elements.FirstByName("dragon"))
obj_elements.FirstByName("snake").link(obj_elements.FirstByName("wings"), obj_elements.FirstByName("dragon"))
obj_elements.FirstByName("skin").link(obj_elements.FirstByName("hair"), obj_elements.FirstByName("human"))
obj_elements.FirstByName("water").link(obj_elements.FirstByName("scales"), obj_elements.FirstByName("fish"))
obj_elements.FirstByName("fur").link(obj_elements.FirstByName("hair"), obj_elements.FirstByName("horse"))
obj_elements.FirstByName("fur").link(obj_elements.FirstByName("fur"), obj_elements.FirstByName("lion"))
obj_elements.FirstByName("fur").link(obj_elements.FirstByName("horn"), obj_elements.FirstByName("bull"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("fur"), obj_elements.FirstByName("werewolf"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("hair"), obj_elements.FirstByName("werewolf"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("wings"), obj_elements.FirstByName("angel"))
obj_elements.FirstByName("horse").link(obj_elements.FirstByName("wings"), obj_elements.FirstByName("pegasus"))
obj_elements.FirstByName("horn").link(obj_elements.FirstByName("horse"), obj_elements.FirstByName("unicorn"))
obj_elements.FirstByName("bird").link(obj_elements.FirstByName("lion"), obj_elements.FirstByName("griffin"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("lion"), obj_elements.FirstByName("sphinx"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("fish"), obj_elements.FirstByName("mermaid"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("water"), obj_elements.FirstByName("mermaid"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("bull"), obj_elements.FirstByName("minotaur"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("horse"), obj_elements.FirstByName("centaur"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("snake"), obj_elements.FirstByName("medusa"))
obj_elements.FirstByName("human").link(obj_elements.FirstByName("bird"), obj_elements.FirstByName("harpy"))
obj_elements.FirstByName("sphinx").link(obj_elements.FirstByName("dragon"), obj_elements.FirstByName("manticore"))

game.start(30);