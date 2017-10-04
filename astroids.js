var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 200;
var mediumAstroidSize = 100;
var smallAstroidSize = 50;
var rocketSize = 50;
var bulletSize = 5;

var astroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png", 90));
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
	var maxSpeed = 10;
	var rocketSpeed = 2;
	var bulletLimit = 0;
	
	self.constructor = function(){
		GameObject.call(self,"rocket",rocket,250,200);
		Key.bind(Key.W, Key.KEY_HELD, function(){move()});
		Key.bind(Key.A, Key.KEY_HELD, function(){changeAngle(-5)});
		Key.bind(Key.D, Key.KEY_HELD, function(){changeAngle(5)});
		Key.bind(Key.SPACE, Key.KEY_DOWN, shootBullet);
	}
	self.constructor();
	function move(){
		var tempx = directionX + rocketSpeed*Math.cos(self.angle * (Math.PI/180))
		var tempy = directionY + rocketSpeed*Math.sin(self.angle * (Math.PI/180));
		if(tempx > 0 && tempx > maxSpeed){ tempx = maxSpeed;}
		else if(tempx < 0 && tempx < -maxSpeed){ tempx = -maxSpeed;}
		if(tempy > 0 && tempy > maxSpeed){ tempy = maxSpeed;}
		else if(tempy < 0 && tempy < -maxSpeed){ tempy = -maxSpeed;}
		directionX = tempx;
		directionY = tempy;
	}
	function changeAngle(angle){
		self.angle += angle;
	}
	function shootBullet(){
		if(bulletLimit <= 0){
			obj_bullet.push(new Bullet(self.angle, self.x + (rocketSize/2), self.y + (rocketSize/2) ))
			bulletLimit = 10;
		}
	}
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		self.direction[0] = directionX;
		self.direction[1] = directionY;
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		directionX = Math.round(directionX)
		directionY = Math.round(directionY)
		if(directionX > 0){ directionX -= 1 }
		else if (directionX < 0){directionX += 1}
		if(directionY > 0){ directionY -= 1 }
		else if (directionY < 0){directionY += 1}
		bulletLimit--;
		//console.log(directionX + " " + directionY)
		console.log(self.x + " " + self.y)
	}
	
}

function Bullet(angle, positionX, positionY){
	var self = this;
	var bulletSpeed = 15;
	self.constructor = function(){
		GameObject.call(self,"bullet",bullet,positionX,positionY);
		self.direction[0] = bulletSpeed*Math.cos(angle * (Math.PI/180));
		self.direction[1] = bulletSpeed*Math.sin(angle * (Math.PI/180));
	}
	self.constructor();
}


game.setup();
game.start(50);