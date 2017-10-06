var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 100;
var mediumAstroidSize = 50;
var smallAstroidSize = 30;
var rocketSize = 40;
var bulletSize = 5;
var level = 0;
var rocket_start_x = 250;
var rocket_start_y = 200;


var bigAstroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var mediumAstroid = game.sprites.push(new Sprite("astroid", mediumAstroidSize, mediumAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var smallAstroid = game.sprites.push(new Sprite("astroid", smallAstroidSize, smallAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var spr_rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png", 90));
var spr_life_rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png"));
var rocketfire = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocketwfire.png"));
var bullet = game.sprites.push(new FilledRect("bullet", bulletSize, bulletSize, "#6FDC6F"));

var obj_astroids = game.objects.push(new SceneGraph("astroids",true,true,false));
var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var obj_bullet = game.objects.push(new SceneGraph("bullet",true,true,false));
var rocket;

game.objects.push(new AsteroidSpawner());
var lives = new Lives(3, spr_life_rocket);

game.postDraw = function(){
  game.context.fillStyle = "white";
  game.context.font = "bold 12px Palatino Linotype";
  game.context.fillText("Score: " + score.score, 0, 50);
}

game.lose = function() {
	if(score.isHighScore(score.score)){
		tempName = prompt("New high score: " + score.score + "!\nEnter your name.","");
		score.addHighScore(tempName,score.score);
		score.saveHighScores("asteroids");
	}
    game.setup();
	lives.restart();
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
	obj_astroids.removeAll();
	obj_bullet.removeAll();
	obj_rocket.removeAll();
	rocket = obj_rocket.push(new Rocket());
	for(i = 0; i < 4; i++){ spawnAsteroid(rocket.x, rocket.y); }
    Key.reset();
}

function Lives(numberOfLives, sprite){
	var self = this;
	self.constructor = function(numberOfLives, sprite){
		GameObject.call(self,"lives",null,0,0);
		var startX = 0;
		self.livesArray = new Array();
		for(var i = 0; i < numberOfLives; i++){
			life = game.objects.push(new Life(sprite, startX, 0));
			self.livesArray.push(life);
			startX += sprite.width;
		}
	}
	self.constructor(numberOfLives, sprite);
	self.update = function(game) {
    
	}
	self.loseLife = function(){
		var poppedLife = self.livesArray.pop();
		game.objects.remove(poppedLife);
	}
	self.amountLivesLeft = function(){
		return self.livesArray.length;
	}
	self.restart = function(){
		var startX = 0;
		for(var i = 0; i < numberOfLives; i++){
			life = game.objects.push(new Life(sprite, startX, 0));
			self.livesArray.push(life);
			startX += sprite.width;
		}
	}
}

function Life(sprite, x, y){
	var self = this;
	self.constructor = function(sprite, x, y){
		GameObject.call(self,"life",sprite, x, y);
	}
	self.constructor(sprite, x, y);
}

function spawnAsteroid(rocketx, rockety) {
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
	//default values for a big astroid, speed of 2 and size of 3
	obj_astroids.push(new Astroid(x,y,angle, 2, 3, bigAstroid));
}

function Rocket(){
	var self = this;
	var maxSpeed = 15;
	var rocketSpeed = 2;
	var angleChange = 15;
	
	self.constructor = function(){
		GameObject.call(self,"rocket",spr_rocket,rocket_start_x,rocket_start_y);
		self.velocity = new Vector(0,0);
		self.bulletLimit = 0;
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
		var tempVel = self.velocity;
		tempVel = tempVel.add(new Vector(rocketSpeed*Math.cos(self.angle * (Math.PI/180)), rocketSpeed*Math.sin(self.angle * (Math.PI/180))));
		if(tempVel.x > 0 && tempVel.x > maxSpeed){ tempVel.x = maxSpeed;}
		else if(tempVel.x < 0 && tempVel.x < -maxSpeed){ tempVel.x = -maxSpeed;}
		if(tempVel.y > 0 && tempVel.y > maxSpeed){ tempVel.y = maxSpeed;}
		else if(tempVel.y < 0 && tempVel.y < -maxSpeed){ tempVel.y = -maxSpeed;}
		self.velocity = tempVel;
	}
	function changeAngle(angle){
		self.angle += angle;
	}
	self.shootBullet = function(){
		if(self.bulletLimit <= 0){
			obj_bullet.push(new Bullet(self.angle, self.x + (rocketSize/2), self.y + (rocketSize/2) ))
			self.bulletCount++;
			self.bulletLimit = 2;
		}
	}
	self.oldupdate = self.update;
	self.update = function(game){
		self.oldupdate(game);
		self.direction[0] = self.velocity.x;
		self.direction[1] = self.velocity.y;
		//if the rocket is out of bounds move it to the other side
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		//slow down the movement of the rocket
		var currentVelVector = self.velocity;
		var velMagnitudeCurrent = currentVelVector.magnitude();
		if(velMagnitudeCurrent != 0){
			var velMagnitudeNext = velMagnitudeCurrent - 0.5;
			if(velMagnitudeNext < 0 )
				velMagnitudeNext = 0;
			var velUnitVector = currentVelVector.normalize();
			var nextVelVector = velUnitVector.multiply(velMagnitudeNext);
			self.velocity = nextVelVector;
		}
		self.bulletLimit--;
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
		level++;
	    var amtSpawn = 4 + Math.floor(level/2)
		for(i = 0; i < amtSpawn; i++){ spawnAsteroids(rocket.x, rocket.y); }
    }
  }
}

function Astroid(x, y, angle, speed, size, sprite){
	var self = this;
	var size = size;
	self.constructor = function(x, y, angle, speed, size, sprite){
		self.size = size;
		self.astroidSpeed = speed;
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
				score.addScore(100);
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
					score.addScore(50);
				}
				else{
					//destroyed big astroid
					score.addScore(40);
				}
				//create two astroids in two different directions
				obj_astroids.push(new Astroid(self.x,self.y,angle+90, self.astroidSpeed*2, tempSize, tempSprite));
				obj_astroids.push(new Astroid(self.x,self.y,angle-90, self.astroidSpeed*2, tempSize, tempSprite));
				//remove astroid that got hit
				obj_astroids.remove(self);
			}
			//remove bullet that hit
			obj_bullet.remove(self);
		}
		else if(other instanceof Rocket){
			lives.loseLife();
			if(lives.amountLivesLeft() == 0){
				game.lose()
			}
			else{
				rocket.x = rocket_start_x;
				rocket.y = rocket_start_y;
			}
		}
	}
}

game.setup();
game.start(50);