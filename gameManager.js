function GameManager(){
	var self = this;
	self.constructor = function() {
    GameObject.call(self, "GameManager", null, 0, 0);
    self.isCollidable=false;
    self.level = 0;
  }
  self.constructor();
  self.customUpdate = function(game){}
  self.update = function(game) {
	self.customUpdate(game);
  }
  
}


function Score(max){
	var self = this;
	self.constructor = function(max){
		self.score = 0;
		self.highScoreMax = max;
		game.displayScore = true;
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		  self.highScores.push(["empty",0]);	
		}
	}
	
	self.constructor(max);
	self.setDisplay = function(display){
		game.displayScore = display;
	}
	self.setColor = function(color){
		game.scoreColor = color;
	}
	self.setFont = function(font){
		game.scoreFont = font;
	}
	self.setX = function(x){
		game.scoreX = x;
	}
	self.setY = function(y){
		game.scoreY = y;
	}
	self.addScore = function(score){ 
		self.score += score;
	}
	self.subtractScore = function(score){
		self.score -= score;
	}
	self.getHighScoreAt = function(index){
		return self.highScores[index][1];
	}
	self.getNameAt = function(index){
		return self.highScores[index][0];
	}
	self.isHighScore = function(score){
		for(var i = 0; i < self.highScoreMax; i++){
			if(self.getHighScoreAt(i) < score){
				return true;
			}
		}
		return false;
	}
	self.addHighScore = function(user, highscore){
		for(var i = 0; i < self.highScoreMax; i++){
			if(self.getHighScoreAt(i) < highscore){
				self.highScores.splice(i, 0, [user,highscore]);
				self.highScores.pop();
				break;
			}
		}
	}
	self.saveHighScores = function(name=""){
		localStorage.setItem("highScores_"+name, JSON.stringify(self.highScores));
	}
	self.getHighScores = function(name=""){
		var json = localStorage.getItem("highScores_"+name);
    if (json)
      return JSON.parse(json);
    return null;
	}
}

function Life(sprite, x, y){
	var self = this;
	self.constructor = function(sprite, x, y){
		GameObject.call(self,"life",sprite, x, y);
	}
	self.constructor(sprite, x, y);
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
    self.isCollidable = false;
	}
	self.constructor(numberOfLives, sprite);
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