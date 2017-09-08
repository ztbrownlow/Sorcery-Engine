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
var obj_elements = game.objects.unshift(new SceneGraph("elements"));
var obj_onScreen = game.objects.unshift(new SceneGraph("onScreen"));


function Element(game, src, size, name, unlocked, x, y) {
  GameObject.call(this, game, name, Sprite(name, size, size, src), mouseX, mouseY);
  
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
    GameObject.prototype.draw.call(self, game);
    if (!self.unlocked) {
      game.context.globalAlpha=0.5;
      game.context.fillRect(self.x, self.y, imageSize, imageSize);
      game.context.globalAlpha=1;
    }
  }
}

Element.prototype = Object.create(GameObject.prototype);
Element.prototype.constructor = GameObject;

parseFile("http://www4.ncsu.edu/~ztbrownl/alchemy_data.txt", function(line) {
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
});

game.preDraw = function() {
  game.context.fillStyle = "black";
  game.context.font = "bold 12px Arial";
  game.context.fillText("Place items here", 0, 10);
}

game.start(30);