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
    for (var i = self.events.length - 1; i >= 0; --i) {
      //console.log(self.events[i]);
      if (self.events[i].type == "timed") {
        //console.log(self.events[i].steps);
        if (--self.events[i].steps <= 0) {
          //console.log("success!");
          self.events[i].func();
          if (self.events[i].repeat) {
            if (self.events[i].random) {
              self.events[i].steps = self.events[i].orig();
            } else {
              self.events[i].steps = self.events[i].orig;
            }
            //console.log("schedule")
          } else {
            self.events.splice(i, 1);
            //console.log("deleted event")
          }
        }
      } else if (self.events[i].type == "condition" && !self.events[i].coolingDown) {
        //console.log("condition");
        if (self.events[i].cond()) {
          //console.log("success!");
          if (!(self.events[i].runFuncAtEndOfCooldown && (self.events[i].random || self.events[i].cooldown))) {
            self.events[i].func();
            //console.log("called function");
          }
          if ((self.events[i].repeat || self.events[i].runFuncAtEndOfCooldown) && (self.events[i].random || self.events[i].cooldown)) {
            //console.log("schedule")
            self.events[i].coolingDown = true;
            var event = self.events[i];
            if (!self.events[i].random) {
              self.addTimedEvent(self.events[i].cooldown, function() {if (event.runFuncAtEndOfCooldown) {event.func();} event.coolingDown = false;}, false);
            } else {
              self.addRandomTimedEvent(self.events[i].cooldownStart, self.events[i].cooldownEnd, function() {if (event.runFuncAtEndOfCooldown) {event.func();} event.coolingDown = false;}, false)
            }
          }
          if (!self.events[i].repeat) {
            self.events.splice(i, 1);
            //console.log("deleted event");
          }
        }
      }
    }
  }
  self.events = [];
  self.addTimedEvent = function(steps, func, repeat) {
    self.events.push({type: "timed", random: false, steps: steps, func: func, repeat: repeat, orig: steps});
  }
  self.addRandomTimedEvent = function(randomStart, randomEnd, func, repeat) {
    var s = function() {return randomStart + Math.random()*(randomEnd-randomStart)};
    self.events.push({type: "timed", random: true, steps: s(), func: func, repeat: repeat, orig: s});
  }
  self.addConditionEvent = function(cond, func, repeat, cooldown = 0, runFuncAtEndOfCooldown = false) {
    self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldown: cooldown, random: false, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
  }
  self.addRandomCooldownConditionEvent = function(cond, func, repeat, cooldownStart, cooldownEnd, runFuncAtEndOfCooldown = false) {
    self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldownStart: cooldownStart, cooldownEnd: cooldownEnd, random: true, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
  }
}


function Score(max, game){
	var self = this;
	self.constructor = function(max, game){
		self.score = 0;
		self.highScoreMax = max;
    if (game) {
      self.game = game;
      game.score = self;
      game.displayScore = true;
    }
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		  self.highScores.push(["empty",0]);	
		}
	}
	
	self.constructor(max, game);
	self.setDisplay = function(display){
		self.game.displayScore = display;
	}
	self.setColor = function(color){
		self.game.scoreColor = color;
	}
	self.setFont = function(font){
		self.game.scoreFont = font;
	}
	self.setX = function(x){
		self.game.scoreX = x;
	}
	self.setY = function(y){
		self.game.scoreY = y;
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