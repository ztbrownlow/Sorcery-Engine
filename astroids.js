var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 200;
var mediumAstroidSize = 100;
var smallAstroidSize = 50;
var rocketSize = 50;
var bulletSize = 5;

var astroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png"));
var rocketfire = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocketwfire.png"));
var bullet = game.sprites.push(new FilledRect("bullet", bulletSize, bulletSize, "#eaeaab"));

var obj_astroids = game.objects.push(new SceneGraph("astroids",true,true,false));
var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var obj_bullet = game.objects.push(new SceneGraph("bullet",true,true,false));
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
	var maxSpeed =20;
	var rocketSpeed = 2;
	self.constructor = function(){
		GameObject.call(self,"rocket",rocket,250,200);
		Key.bind(Key.W, Key.KEY_DOWN, function(event){moveY(-rocketSpeed)});
		Key.bind(Key.A, Key.KEY_DOWN, function(event){moveX(-rocketSpeed)});
		Key.bind(Key.S, Key.KEY_DOWN, function(event){moveY(rocketSpeed)});
		Key.bind(Key.D, Key.KEY_DOWN, function(event){moveX(rocketSpeed)});
		Key.bind(Key.SPACE, Key.KEY_DOWN, function(event){shootBullet()});
	}
	self.constructor();
	function moveX(x){
		var temp = directionX + x;
		if(temp > maxSpeed && temp > 0){
			temp = maxSpeed;
		}
		else if(temp < -maxSpeed && temp < 0){
			temp = -maxSpeed;
		}
		directionX = temp;
	}
	function moveY(y){
		var temp = directionY + y;
		if(temp > maxSpeed && temp > 0){
			temp = maxSpeed;
		}
		else if(temp < -maxSpeed && temp < 0){
			temp = -maxSpeed;
		}
		directionY = temp;
	}
	function shootBullet(){
		obj_bullet.push(new Bullet(directionX, directionY, self.x + (rocketSize/2), self.y))
	}
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		self.direction[0] = directionX;
		self.direction[1] = directionY;
		if(directionX > 0){ directionX -= 1 }
		else if (directionX < 0){directionX += 1}
		if(directionY > 0){ directionY -= 1 }
		else if (directionY < 0){directionY += 1}
		console.log(directionX + " " + directionY)
	}
}

function Bullet(directionX, directionY, positionX, positionY){
	var self = this;
	var bulletSpeed = 5;
	self.constructor = function(){
		GameObject.call(self,"bullet",bullet,positionX,positionY);
		if(directionX > 0){
			directionX = bulletSpeed;
		}
		else if(directionX < 0){
			directionX = -bulletSpeed;
		}
		if(directionY > 0){
			directionY = bulletSpeed;
		}
		else if(directionY <= 0){
			directionY = -bulletSpeed;
		}
		self.direction[0] = directionX;
		self.direction[1] = directionY;
	}
	self.constructor();
}


game.setup();
game.start(100);