var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 200;
var mediumAstroidSize = 100;
var smallAstroidSize = 50;
var rocketSize = 50;

var astroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png"));
var rocketfire = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocketwfire.png"));

var obj_astroids = game.objects.push(new SceneGraph("astroids",true,true,false));
var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var rocket;

game.setup = function(){
	rocket = obj_rocket.push(new Rocket());
}

function Astroid(sprite){
	
}

function Rocket(){
	var self = this;
	var directionX = 0;
	var directionY = 0;
	var rocketSpeed = 7;
	self.constructor = function(){
		GameObject.call(self,"rocket",rocket,250,200);
		Key.bind(Key.W, Key.KEY_DOWN, function(event){moveY(-rocketSpeed)});
		Key.bind(Key.A, Key.KEY_DOWN, function(event){moveX(-rocketSpeed)});
		Key.bind(Key.S, Key.KEY_DOWN, function(event){moveY(rocketSpeed)});
		Key.bind(Key.D, Key.KEY_DOWN, function(event){moveX(rocketSpeed)});
	}
	self.constructor();
	function moveX(x){
		var temp = directionX + x;
		directionX += x;
	}
	function moveY(y){
		directionY += y;
	}
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		if(directionX > 0){ directionX -= 1 }
		else if (directionX < 0){directionX += 1}
		if(directionY > 0){ directionY -= 1 }
		else if (directionY < 0){directionY += 1}
		self.direcQueue.push([directionX, directionY])
	}
}



game.setup();
game.start(100);