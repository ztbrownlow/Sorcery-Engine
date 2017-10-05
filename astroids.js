var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 100;
var mediumAstroidSize = 50;
var smallAstroidSize = 30;
var astroidSpeed = 2;
var rocketSize = 40;
var bulletSize = 5;

var bigAstroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var mediumAstroid = game.sprites.push(new Sprite("astroid", mediumAstroidSize, mediumAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var smallAstroid = game.sprites.push(new Sprite("astroid", smallAstroidSize, smallAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var spr_rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png", 90));
var rocketfire = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocketwfire.png"));
var bullet = game.sprites.push(new FilledRect("bullet", bulletSize, bulletSize, "#6FDC6F"));

var obj_astroids = game.objects.push(new SceneGraph("astroids",true,true,false));
var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var obj_bullet = game.objects.push(new SceneGraph("bullet",true,true,false));
var rocket;

game.objects.push(new AsteroidSpawner());

game.postDraw = function(){
  game.context.fillStyle = "white";
  game.context.font = "bold 12px Palatino Linotype";
  game.context.fillText("Score: " + score.score, 0, 10);
}

game.lose = function() {
	console.log("Game lost");
	if(score.isHighScore(score.score)){
		tempName = prompt("New high score: " + score.score + "!\nEnter your name.","");
		score.addHighScore(tempName,score.score);
		score.saveHighScores("asteroids");
	}
  game.setup();
}

var rocket;
var score = new Score(3);
var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
var localHighScore = score.getHighScores("asteroids");
if(!localHighScore){
  score.addHighScore("ztbrownl",30);
  score.addHighScore("alrichma",20);
  score.addHighScore("rnpettit",10);  
}
else
{
  score.highScores = localHighScore;
}

game.setup = function(){
	score.score = 0;
	for (var i = 0; i < score.highScoreMax; i++) {
	  var text = score.getNameAt(i) + " " + score.getHighScoreAt(i);
      hs_elems[i].innerHTML = text;
	}
  console.log(rocket);
	obj_astroids.removeAll();
	obj_bullet.removeAll();
	obj_rocket.removeAll();
	rocket = obj_rocket.push(new Rocket());
	for(i = 0; i < 4; i++){ spawnAsteroids(rocket.x, rocket.y); }
  Key.reset();
}

function spawnAsteroids(rocketx, rockety) {
	var x = rocket.x;
	var y = rocket.y;
	//choose a number that will not be around the rocket
	while(x > (rocket.x - 100) && x < (rocket.x + 100)){
		x = Math.random() * (game.canvas.width)
	}
	while(y > (rocket.y - 100) && y < (rocket.y - 100)){
		y = Math.random() * (game.canvas.height)
	}
	var angle = Math.random() * (360);
	obj_astroids.push(new Astroid(x,y,angle, astroidSpeed, 3, bigAstroid));
}

function Rocket(){
	var self = this;
	var maxSpeed = 15;
	var rocketSpeed = 2;
	var bulletLimit = 0;
	var angleChange = 15;
	var moving = false;
	
	self.constructor = function(){
		GameObject.call(self,"rocket",spr_rocket,250,200);
		self.directionX = 0;
		self.directionY = 0;
		Key.bind(Key.W, Key.KEY_HELD, function(){move()});
		Key.bind(Key.A, Key.KEY_HELD, function(){changeAngle(-angleChange)});
		Key.bind(Key.D, Key.KEY_HELD, function(){changeAngle(angleChange)});
    Key.bind(Key.UP, Key.KEY_HELD, function(){move()});
		Key.bind(Key.LEFT, Key.KEY_HELD, function(){changeAngle(-angleChange)});
		Key.bind(Key.RIGHT, Key.KEY_HELD, function(){changeAngle(angleChange)});
		Key.bind(Key.SPACE, Key.KEY_DOWN, function(){rocket.shootBullet();});
	}
	self.constructor();
	function move(){
		var tempx = self.directionX + rocketSpeed*Math.cos(self.angle * (Math.PI/180))
		var tempy = self.directionY + rocketSpeed*Math.sin(self.angle * (Math.PI/180));
		if(tempx > 0 && tempx > maxSpeed){ tempx = maxSpeed;}
		else if(tempx < 0 && tempx < -maxSpeed){ tempx = -maxSpeed;}
		if(tempy > 0 && tempy > maxSpeed){ tempy = maxSpeed;}
		else if(tempy < 0 && tempy < -maxSpeed){ tempy = -maxSpeed;}
		self.directionX = tempx;
		self.directionY = tempy;
		moving = true;
	}
	function changeAngle(angle){
		self.angle += angle;
	}
	self.shootBullet = function(){
		if(bulletLimit <= 0){
			obj_bullet.push(new Bullet(self.angle, self.x + (rocketSize/2), self.y + (rocketSize/2) ))
			bulletLimit = 10;
		}
	}
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		self.direction[0] = self.directionX;
		self.direction[1] = self.directionY;
		//if the rocket is out of bounds move it to the other side
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		//slow down the movement of the rocket
		if(self.directionX > 0){ self.directionX -= 1 }
		else if (self.directionX < 0){self.directionX += 1}
		if(self.directionY > 0){ self.directionY -= 1 }
		else if (self.directionY < 0){self.directionY += 1}
		//if you don't have W down, then check if direction is less than one so it can fully stop.
		if(!moving){
			if(Math.abs(self.directionX) < 1){ self.directionX = 0 }
			if(Math.abs(self.directionY) < 1) {self.directionY = 0 }
		}
		bulletLimit--;
		moving = false;
		//console.log(self.x + " " + self.y)
		//console.log(directionX + " " + directionY)
	}
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		
	}
	
}

function Bullet(angle, positionX, positionY){
	var self = this;
	var bulletSpeed = 25;
	var bulletLife = 13;
	self.constructor = function(){
		GameObject.call(self,"bullet",bullet,positionX,positionY);
		self.direction[0] = bulletSpeed*Math.cos(angle * (Math.PI/180));
		self.direction[1] = bulletSpeed*Math.sin(angle * (Math.PI/180));
	}
	self.constructor();
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		bulletLife--;
		if(bulletLife < 0){
			obj_bullet.remove(self);  
		}
	}
}

function AsteroidSpawner() {
  var self = this;
  self.constructor = function() {
    GameObject.call(self, "asteroidSpawner", null, 0, 0);
    self.isCollidable=false;
  }
  self.constructor();
  
  self.update = function(game) {
    if (obj_astroids.isEmpty()) {
      spawnAsteroids(rocket.x, rocket.y);
    }
  }
}

function Astroid(x, y, angle, speed, size, sprite){
	var self = this;
	var size = size;
	self.constructor = function(x, y, angle, speed, size, sprite){
		self.size = size;
		GameObject.call(self,"astroid",sprite,x,y);
		self.direction[0] = speed*Math.cos(angle * (Math.PI/180));
		self.direction[1] = speed*Math.sin(angle * (Math.PI/180));
    self.setCircleHitbox();
	}
	self.constructor(x,y, angle, speed, size, sprite);
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
	}
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		if(other instanceof Bullet){
			//small astroid
			if(self.size == 1){
				score.addScore(50);
				obj_astroids.remove(self);
			}
			else{
				//default assume big astroid
				var tempSprite = mediumAstroid;
				var tempSize = 2;
				//medium astroid
				if(self.size == 2){
					tempSprite = smallAstroid;
					tempSize = 1;
					score.addScore(30);
				}
				else{
					//destroyed big astroid
					score.addScore(10);
					//spawn big astroid
					spawnAsteroids(rocket.x, rocket.y);
				}
				//create two astroids in two different directions
				obj_astroids.push(new Astroid(self.x,self.y,angle+90, astroidSpeed*3, tempSize, tempSprite));
				obj_astroids.push(new Astroid(self.x,self.y,angle-90, astroidSpeed*3, tempSize, tempSprite));
				//remove astroid that got hit
				obj_astroids.remove(self);
			}
			//remove bullet that hit
			obj_bullet.remove(self);
		}
		else if(other instanceof Rocket){
			game.lose()
		}
	}
}

game.setup();
game.start(50);