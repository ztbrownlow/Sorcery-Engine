var game = new Game(document.getElementById("canvas"), "asteroids");
var bigAsteroidSize = 100;
var mediumAsteroidSize = 50;
var smallAsteroidSize = 30;
var rocketSize = 45;
var bulletSize = 5;
var alienSize = 40;
var rocket_start_x = canvas.width/2;
var rocket_start_y = canvas.height/2;


var bigAsteroid = game.sprites.push(new Sprite("asteroid", bigAsteroidSize, bigAsteroidSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/astroid.png?raw=true"));
var mediumAsteroid = game.sprites.push(new Sprite("asteroid", mediumAsteroidSize, mediumAsteroidSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/astroid.png?raw=true"));
var smallAsteroid = game.sprites.push(new Sprite("asteroid", smallAsteroidSize, smallAsteroidSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/astroid.png?raw=true"));
var spr_rocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/rocket.png?raw=true", true));
var spr_liferocket = game.sprites.push(new Sprite("rocket", rocketSize, rocketSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/rocket.png?raw=true",true));
var bullet = game.sprites.push(new FilledRect("bullet", bulletSize, bulletSize, "#6FDC6F"));
var spr_alien = game.sprites.push(new Sprite("smallAlien", alienSize, alienSize, "https://github.com/ztbrownlow/Sorcery-Engine/blob/master/Examples/images/astroidsImages/alien.png?raw=true"));


function newAsteroid() {
	//default values for a big asteroid, speed and size of 3
	return new Asteroid(0, 0, 0, 0, 3, bigAsteroid);
}

function resetAsteroid(asteroid) {
	var x, y;
	//choose a number that will not be around the rocket
	do {
		x = Math.random() * (game.canvas.width)
	} while(x > (rocket.x - 200) && x < (rocket.x + 200));
	do {
		y = Math.random() * (game.canvas.height)
	} while(y > (rocket.y - 100) && y < (rocket.y - 100));
	var angle = Math.random() * (360);
	asteroid.setSize(3);
	asteroid.setCircleHitbox();
	asteroid.angle = angle;
	asteroid.asteroidSpeed = game.gameManager.level == 0 ? 2 : 2 * game.gameManager.level;
	asteroid.x = x;
	asteroid.y = y;
	asteroid.direction = asteroid.calculateVelocity(asteroid.asteroidSpeed, asteroid.angle);
}

function newBullet() {
	return new Bullet(0,25,16,0,0,"rocket");
}

function resetBullet(b) {
	b.x=rocket.x+rocketSize/2;
	b.y=rocket.y+rocketSize/2;
	b.direction=b.calculateVelocity(b.bulletSpeed,rocket.angle);
}

var obj_rocket = game.objects.push(new SceneGraph("rocket",true,true,false));
var obj_bullet = game.objects.push(new ObjectPool("bullet", newBullet, resetBullet, null, 20, POOL_BEHAVIOR_ON_OVERFLOW.EXPAND_POOL));//game.objects.push(new SceneGraph("bullet",true,true,false));
var obj_alien = game.objects.push(new SceneGraph("alien",true,true,false));
var asteroidPool = game.objects.push(new ObjectPool("asteroids", newAsteroid, resetAsteroid, null, 10, POOL_BEHAVIOR_ON_OVERFLOW.EXPAND_POOL));

game.gameManager.addConditionEvent(asteroidPool.isEmpty, 
	function() {
		++game.gameManager.level;
		asteroidPool.spawnSeveral(4 + Math.floor(game.gameManager.level/2));
	}, true);
var rocket;

var lives = new Lives(3, spr_liferocket, game);
var score = new Score(game);
var highscore = new HighScore(3);

score.setColor("white")
score.setY(50);

var hs_elems = [document.getElementById("hs1"), document.getElementById("hs2"), document.getElementById("hs3")];
var localHighScore = highscore.getHighScores("asteroids");

if(!localHighScore){
	highscore.addHighScore("ztbrownl",30);
	highscore.addHighScore("alrichma",20);
	highscore.addHighScore("rnpettit",10);
} else {
	highscore.highScores = localHighScore;
}

var alienRate = 300;

game.gameManager.addConditionEvent(obj_rocket.isEmpty, 
	function() {
		rocket = obj_rocket.push(new Rocket());
		rocket.immune = true;
		game.gameManager.addTimedEvent(20, function() {rocket.immune = false}, false);
	}, true, 20, true);
game.gameManager.addRandomCooldownConditionEvent(obj_alien.isEmpty, 
	function(){
		var randomx = 1;
		var rando = Math.random()
		if (rando > 0.5) {
			randomx = game.canvas.width - alienSize;
		}
		obj_alien.push(new Alien(randomx, Math.random() * game.canvas.height))
	}, true, 10, alienRate, true)

game.lose = function() {
	if(highscore.isHighScore(score.score)){
		tempName = prompt("New high score: " + score.score + "!\nEnter your name.","");
		highscore.addHighScore(tempName,score.score);
		highscore.saveHighScores("asteroids");
	}
	game.setup();
	lives.restart();
}

game.setup = function(){
	score.score = 0;
	obj_rocket.doDraw = true;
	for (var i = 0; i < highscore.highScoreMax; i++) {
		var text = highscore.getNameAt(i) + " " + highscore.getHighScoreAt(i);
		hs_elems[i].innerHTML = text;
	}
	obj_bullet.removeAll();
	obj_rocket.removeAll();
	obj_alien.removeAll();
	rocket = obj_rocket.push(new Rocket());
	asteroidPool.removeAll();
	asteroidPool.spawnSeveral(4);
	Key.reset();
}

var angleChange = 15;

Key.bind(Key.W, Key.KEY_HELD, function(){rocket.move()});
Key.bind(Key.A, Key.KEY_HELD, function(){rocket.changeAngle(-angleChange)});
Key.bind(Key.D, Key.KEY_HELD, function(){rocket.changeAngle(angleChange)});
Key.bind(Key.UP, Key.KEY_HELD, function(){rocket.move()});
Key.bind(Key.LEFT, Key.KEY_HELD, function(){rocket.changeAngle(-angleChange)});
Key.bind(Key.RIGHT, Key.KEY_HELD, function(){rocket.changeAngle(angleChange)});
Key.bind(Key.SPACE, Key.KEY_DOWN, function(){rocket.shootBullet();});

function Rocket(){
	var self = this;
	var maxSpeed = 15;
	var rocketSpeed = 2;
	
	self.constructor = function(){
		GameObject.call(self,"rocket",spr_rocket,rocket_start_x,rocket_start_y);
		self.isLooping = true;
		self.setCircleHitbox();
		self.bulletLimit = 0;
		self.moving = false;
		self.immune = false;
	}
	self.constructor();
	
	self.move = function(){
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
			obj_bullet.spawn();
			self.bulletCount++;
			self.bulletLimit = 2;
		}
	}
	self.customUpdate = function(game){
		self.direction = self.velocity;
		self.velocity = self.slowVelocity(self.velocity, 0.5);
		self.bulletLimit--;
		
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
			obj_alien.remove(other)
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
		self.isLooping = true;
		self.velocity = self.calculateVelocity(self.bulletSpeed, angle);
		self.direction = self.velocity;
	}
	self.constructor();
	self.customUpdate = function(game){
		self.bulletLife--;
		if(self.bulletLife < 0) {
			obj_bullet.remove(self);
		}
		game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
	}
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		if(other instanceof Alien && self.owner == "rocket"){
			score.addScore(50);
			obj_bullet.remove(self)
			obj_alien.remove(other);	
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
	var alienSpeed = 3;
	self.constructor = function(x, y){
		self.shootTime = shootTimeLimit;
		GameObject.call(self,"alien",spr_alien,x,y);
		self.isLooping = true;
		self.angle = Math.random() * 360;
		self.velocity = self.calculateVelocity(alienSpeed, self.angle);
		self.direction = self.velocity;
		self.setCircleHitbox();
	}
	self.constructor(x, y);
	self.customUpdate = function(game){
		if(self.shootTime < 0){
			var angle = Math.random() * 360;
			var b = obj_bullet.spawn().object;
			b.x = self.x + (alienSize/2);
			b.y = self.y + (alienSize/2);
			b.direction = b.calculateVelocity(10, Math.random() * 360);
			b.bulletLife = 30;
			b.owner = "alien";
			//obj_bullet.push(new Bullet(angle, 10, 30, self.x + (alienSize/2), self.y + (alienSize/2), "alien"));
			self.shootTime = shootTimeLimit;
		}
		self.shootTime--;
	}
}

function Asteroid(x, y, angle, speed, size, sprite){
	var self = this;
	var size = size;
	self.constructor = function(x, y, angle, speed, size, sprite){
		self.size = size;
		self.angle = angle;
		self.asteroidSpeed = speed;
		GameObject.call(self,"asteroid",sprite,x,y);
		self.velocity = self.calculateVelocity(speed, angle);
		self.direction = self.velocity;
		self.isLooping = true;
		self.setCircleHitbox();
	}
	self.constructor(x,y, angle, speed, size, sprite);
	self.customUpdate = function(game){
		game.objects.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
	}
	self.canCollideWith = function(other) { return true; }
	self.collideWith = function(other){
		if(other instanceof Bullet){
			console.log(other);
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
				self.splitAsteroids();
			}
			//remove bullet that hit
			obj_bullet.remove(other);
		}
		if(other instanceof Rocket && !other.immune){
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
			//obj_bullet.remove(other);
		}
	}
	self.setSize = function(n) {
		self.size = n;
		switch(n) {
			case 3:
				self.sprite = bigAsteroid;
				break;
			case 2:
				self.sprite = mediumAsteroid;
				break;
			case 1:
				self.sprite = smallAsteroid;
				break;
		}
		self.setCircleHitbox();
	}
	self.splitAsteroids = function(){
		if(self.size != 1){
			var other = asteroidPool.spawn().object;
			self.asteroidSpeed *= 2;
			other.x = self.x;
			other.y = self.y;
			other.angle = self.angle - 30;
			other.setSize(self.size - 1);
			other.asteroidSpeed = self.asteroidSpeed;
			other.direction = other.calculateVelocity(self.asteroidSpeed, other.angle);
			
			self.setSize(self.size - 1);
			self.angle += 30;
			self.direction = self.calculateVelocity(self.asteroidSpeed, self.angle);
		} else {
			asteroidPool.recycle(self.pooledInstance);
		}
	}
}

game.setup();
game.start(50);