var game = new Game(document.getElementById("canvas"));
game.start(30);
var imageSize = 64;

function Element(game, src, size, name, unlocked) {
  Object.apply(this, game, name, Sprite(name, size, size, src), mouseX, mouseY);
  
  this.unlocked = unlocked;
  this.interactions = {};
  this.link = function(element2, element3) {
    obj.interactions[element2.name] = element3;
    element2.interactions[obj.name] = element3;
  }
  this.combine = function(element2) {
    return obj.interactions[element2.name];
  }
}

var gui = game.objects.push(new SceneGraph("gui"));
var elements = game.objects.push(new SceneGraph("elements"));

parseFile("http://www4.ncsu.edu/~ztbrownl/alchemy_data.txt", function(line) {
  if (line.length > 0) {
    if (line.startsWith("D:")) {
      line = line.substring(0, 2);
      line = line.split('|');
      elements.push(new Element(line[0], line[1], imageSize, line[2] == "true" ? true : false));
    } else if (line.startsWith("F:")) {
      line = line.substring(0, 2);
      line = line.split('=');
      line[0] = line[0].split("+");
      elements.FirstByName(line[0][0]).link(elements.FirstByName(line[0][1]), elements.FirstByName(line[1]));
    }
  }
});

