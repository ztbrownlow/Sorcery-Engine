var game = new Game(document.getElementById("canvas"));
var bigAstroidSize = 100;
var mediumAstroidSize = 50;
var smallAstroidSize = 30;
var rocketSize = 45;
var bulletSize = 5;
var alienSize = 40;
var rocket_start_x = canvas.width/2;
var rocket_start_y = canvas.height/2;


var bigAstroid = game.sprites.push(new Sprite("astroid", bigAstroidSize, bigAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var mediumAstroid = game.sprites.push(new Sprite("astroid", mediumAstroidSize, mediumAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var smallAstroid = game.sprites.push(new Sprite("astroid", smallAstroidSize, smallAstroidSize, "http://www4.ncsu.edu/~alrichma/images/astroid.png"));
var spr_rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png", true));
var spr_liferocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "http://www4.ncsu.edu/~alrichma/images/rocket.png",true));
var bullet = game.sprites.push(new FilledRect("bullet", bulletSize, bulletSize, "#6FDC6F"));
var spr_alien = game.sprites.push(new Sprite("smallAlien", alienSize, alienSize, "http://www4.ncsu.edu/~alrichma/images/alien.png"));


var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var obj_bullet = game.objects.push(new SceneGraph("bullet",true,true,false));
var obj_alien = game.objects.push(new SceneGraph("alien",true,true,false));
var obj_astroids = game.objects.push(new SceneGraph("astroids",true,true,false));
var rocket;

var lives = new Lives(3, spr_liferocket);
var rocket;
var score = new Score(3);
score.setColor("white")
score.setY(50);

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
var countdownUntilRespawn = null;
var alienRate = 300;
var alienTimer = Math.random() *alienRate;

game.gameManager.customUpdate = function(game){
	if (obj_astroids.isEmpty()) {
      self.level++;
	  var amtSpawn = 4 + Math.floor(self.level/2)
	  var speed = 2 * self.level;
      for(i = 0; i < amtSpawn; i++){ spawnAsteroid(rocket.x, rocket.y, speed); }
    }
    if (obj_rocket.isEmpty()) {
      if (countdownUntilRespawn == null) {
        countdownUntilRespawn = 20;
      }
      if (countdownUntilRespawn-- == 0) {
        countdownUntilRespawn = null;
        rocket = obj_rocket.push(new Rocket());
        rocket.immunitySteps = 20;
      }
    }
	 if(alienTimer < 0){
		var randomx = 1;
		var rando = Math.random()
		if(rando > 0.5){
			randomx = game.canvas.width - alienSize;
		}
		obj_alien.push(new Alien(randomx, Math.random() * game.canvas.height))
		alienTimer = Math.random() * alienRate;
	}
	if(obj_alien.length == 0){
		alienTimer--;
	}
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

game.setup = function(){
	score.score = 0;
  obj_rocket.doDraw = true;
	for (var i = 0; i < score.highScoreMax; i++) {
	  var text = score.getNameAt(i) + " " + score.getHighScoreAt(i);
      hs_elems[i].innerHTML = text;
	}
	obj_astroids.removeAll();
	obj_bullet.removeAll();
	obj_rocket.removeAll();
	obj_alien.removeAll();
	rocket = obj_rocket.push(new Rocket());
	for(i = 0; i < 4; i++){ spawnAsteroid(rocket.x, rocket.y, 2); }
    Key.reset();
}



function spawnAsteroid(rocketx, rockety, speed) {
	var x = rocket.x;
	var y = rocket.y;
	//choose a number that will not be around the rocket
	while(x > (rocket.x - 200) && x < (rocket.x + 200)){
		x = Math.random() * (game.canvas.width)
	}
	while(y > (rocket.y - 100) && y < (rocket.y - 100)){
		y = Math.random() * (game.canvas.height)
	}
	var angle = Math.random() * (360);
	//default values for a big astroid, speed and size of 3
	obj_astroids.push(new Astroid(x,y,angle, speed, 3, bigAstroid));
}

function Rocket(){
	var self = this;
	var maxSpeed = 15;
	var rocketSpeed = 2;
	var angleChange = 15;
	
	self.constructor = function(){
		GameObject.call(self,"rocket",spr_rocket,rocket_start_x,rocket_start_y);
		self.setCircleHitbox();
		self.bulletLimit = 0;
		self.moving = false;
		Key.bind(Key.W, Key.KEY_HELD, function(){move()});
		Key.bind(Key.A, Key.KEY_HELD, function(){self.changeAngle(-angleChange)});
		Key.bind(Key.D, Key.KEY_HELD, function(){self.changeAngle(angleChange)});
		Key.bind(Key.UP, Key.KEY_HELD, function(){move()});
		Key.bind(Key.LEFT, Key.KEY_HELD, function(){self.changeAngle(-angleChange)});
		Key.bind(Key.RIGHT, Key.KEY_HELD, function(){self.changeAngle(angleChange)});
		Key.bind(Key.SPACE, Key.KEY_DOWN, function(){rocket.shootBullet();});
		self.immunitySteps = 0;
	}
	self.constructor();
	
	function move(){
		var tempVel = self.velocity;
		var speed = self.calculateVelocity(rocketSpeed,self.angle);
		tempVel = tempVel.add(speed);
		if(tempVel.x > 0 && tempVel.x > maxSpeed){ tempVel.x = maxSpeed;}
		else if(tempVel.x < 0 && tempVel.x < -maxSpeed){ tempVel.x = -maxSpeed;}
		if(tempVel.y > 0 && tempVel.y > maxSpeed){ tempVel.y = maxSpeed;}
		else if(tempVel.y < 0 && tempVel.y < -maxSpeed){ tempVel.y = -maxSpeed;}
		self.velocity = tempVel;
		self.moving = true;
	}
	
	self.shootBullet = function(){
		if(self.bulletLimit <= 0){
			obj_bullet.push(new Bullet(self.angle, 25, 16, self.x + (rocketSize/2), self.y + (rocketSize/2), "rocket"))
			self.bulletCount++;
			self.bulletLimit = 2;
		}
	}
	self.customUpdate = function(game){
		self.direction = self.velocity;
		//if the rocket is out of bounds move it to the other side
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		self.velocity = self.slowVelocity(self.velocity, 0.5);
		self.bulletLimit--;
    
		if (self.immunitySteps > 0) {
			self.immunitySteps--;
		}
		if(self.moving){
			self.changeSpriteSheetNumber(1);
		}
		else{
			self.changeSpriteSheetNumber(0);
		}
		self.moving = false;
		game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
	}
	
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		if(other instanceof Alien){
			lives.loseLife();
			if(lives.amountLivesLeft() == 0){
				game.lose()
			}
			else{
				obj_rocket.removeAll();
			}
			obj_bullet.remove(self)
		}
	}
	
}

function Bullet(angle, speed, life, positionX, positionY, owner){
	var self = this;
	self.constructor = function(){
		self.owner = owner;
		self.bulletSpeed = speed;
		self.bulletLife = life;
		GameObject.call(self,"bullet",bullet,positionX,positionY);
		self.setCircleHitbox();
		self.velocity = self.calculateVelocity(self.bulletSpeed, angle);
		self.direction = self.velocity;
	}
	self.constructor();
	self.customUpdate = function(game){
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		self.bulletLife--;
		if(self.bulletLife < 0){
			obj_bullet.remove(self);  
		}
		game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
	}
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		if(other instanceof Alien && self.owner == "rocket"){
			score.addScore(50);
			obj_bullet.remove(self)
			obj_alien.remove(self);	
		}
		if(other instanceof Rocket && self.owner == "alien"){
			lives.loseLife();
			if(lives.amountLivesLeft() == 0){
				game.lose()
			}
			else{
				obj_rocket.removeAll();
			}
			obj_bullet.remove(self)
		}
	}
}

function Alien(x, y){
	var self = this;
	var shootTimeLimit = 50;
	var alienSpeed =  3;
	self.constructor = function(x, y){
		self.shootTime = shootTimeLimit;
		GameObject.call(self,"alien",spr_alien,x,y);
		self.angle = Math.random() * 360;
		self.velocity = self.calculateVelocity(alienSpeed, self.angle);
		self.direction = self.velocity;
    self.setCircleHitbox();
	}
	self.constructor(x, y);
	self.customUpdate = function(game){
		if(game.outOfBounds(self.x, self.y)){
			if(self.x > game.canvas.width){self.x = 0}
			else if(self.x < 0){self.x = game.canvas.width}
			if(self.y > game.canvas.height){self.y = 0}
			else if(self.y < 0){self.y = game.canvas.height}
		}
		if(self.shootTime < 0){
			var angle = Math.random() * 360;
			obj_bullet.push(new Bullet(angle, 10, 30, self.x + (alienSize/2), self.y + (alienSize/2), "alien"));
			self.shootTime = shootTimeLimit;
		}
		self.shootTime--;
	}
}

function Astroid(x, y, angle, speed, size, sprite){
	var self = this;
	var size = size;
	self.constructor = function(x, y, angle, speed, size, sprite){
		self.size = size;
		self.astroidSpeed = speed;
		GameObject.call(self,"astroid",sprite,x,y);
		self.velocity = self.calculateVelocity(speed, angle);
		self.direction = self.velocity;
    self.setCircleHitbox();
	}
	self.constructor(x,y, angle, speed, size, sprite);
	self.customUpdate = function(game){
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
			if(other.owner == "rocket"){
				if(self.size == 1){
					score.addScore(100);
				}
				else if(self.size == 2){
					score.addScore(50);
				}
				else{
					score.addScore(40);
				}
				//splits the asteroids based on size
				self.splitAsteroids(self.size);
			}
			//remove bullet that hit
			obj_bullet.remove(self);
		}
		if(other instanceof Rocket  && (other.immunitySteps >= 0)){
			lives.loseLife();
			//splits the asteroids based on size
			self.splitAsteroids(self.size);
			if(lives.amountLivesLeft() == 0){
				game.lose()
			}
			else{
				obj_rocket.removeAll();
			}
			//remove bullet that hit
			obj_bullet.remove(self);
		}
	}
	
	self.splitAsteroids = function(size){
		var tempSize = 2;
		var tempSprite = mediumAstroid;
		if(size != 1){
			if(size == 2){
				tempSize = 1;
				tempSprite = smallAstroid;
			}
			obj_astroids.push(new Astroid(self.x,self.y,angle+30, self.astroidSpeed*2, tempSize, tempSprite));
			obj_astroids.push(new Astroid(self.x,self.y,angle-30, self.astroidSpeed*2, tempSize, tempSprite));
		}
		obj_astroids.remove(self);
	}
}

game.setup();
game.start(50);