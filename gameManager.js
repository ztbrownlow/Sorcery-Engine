/** A game manager that will run any updates that you need to keep track of. Also it keeps track of levels.
  * @class
  * @namespace GameManager
  */
function GameManager(){
	var self = this;
	/** Creates the game manager object
	  * @constructs GameManager
	  */
	self.constructor = function() {
    GameObject.call(self, "GameManager", null, 0, 0);
    self.isCollidable=false;
    self.level = 0;
    self.events = [];
  }
  /** Creates GameManager */
  self.constructor();
  /** Override this function to put in your custom Updates for your game. Called before update.
	  * @memberof GameManager
	  * @param {game} game - The game object
	  */
  self.customUpdate = function(game){}
  /** The update function of the object. Do not override this function.
	  * @memberof GameManager
	  * @param {game} game - The game object
	  */
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
  
  self.postUpdate = function() {
    for (var i = self.postEvents.length - 1; i >= 0; --i) {
      self.postEvents[i].func();
      if (!self.postEvents[i].repeat) {
        self.postEvents.splice(i, 1);
      }
    }
  }
  /** 
    * Adds a timed event to the game manager. Can trigger just once or repeatedly.
	  * @memberof GameManager
	  * @param {int} steps - how often to run the event
    * @param {function} func - the function to call when the event occurs
    * @param {boolean} repeat - whether or not to repeat the event after it occurs
	  */
  self.addTimedEvent = function(steps, func, repeat) {
    self.events.push({type: "timed", random: false, steps: steps, func: func, repeat: repeat, orig: steps});
  }
  /** 
    * Adds a randomly timed event to the game manager. Can trigger just once or repeatedly.
	  * @memberof GameManager
	  * @param {int} randomStart - how often to run the event at minimum
    * @param {int} randomEnd - how often to run the event at maximum
    * @param {function} func - the function to call when the event occurs
    * @param {boolean} repeat - whether or not to repeat the event after it occurs
	  */
  self.addRandomTimedEvent = function(randomStart, randomEnd, func, repeat) {
    var s = function() {return randomStart + Math.random()*(randomEnd-randomStart)};
    self.events.push({type: "timed", random: true, steps: s(), func: func, repeat: repeat, orig: s});
  }
  /** 
    * Adds a condition-based event to the game manager. Can trigger just once or repeatedly.
	  * @memberof GameManager
	  * @param {function} cond - the condition to check
    * @param {function} func - the function to run when the event is triggered
    * @param {boolean} repeat - whether or not to repeat the event after it occurs
    * @param {int} cooldown - if repeating event, cooldown can be optionally used to signify how long to wait until the event can be trigerred again
    * @param {boolean} runFuncAtEndOfCooldown - Whether or not to run the function at the end of the cooldown when an event is triggered instead of the beginning
	  */
  self.addConditionEvent = function(cond, func, repeat, cooldown = 0, runFuncAtEndOfCooldown = false) {
    self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldown: cooldown, random: false, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
  }
  /** 
    * Adds a condition-based event to the game manager with a random cooldown. Can trigger just once or repeatedly, and can have cooldown between checking if triggered
	  * @memberof GameManager
	  * @param {function} cond - the condition to check
    * @param {function} func - the function to run when the event is triggered
    * @param {boolean} repeat - whether or not to repeat the event after it occurs
    * @param {int} cooldownStart - minimum value to use for cooldown
    * @param {int} cooldownEnd - maximum value to use for cooldown
    * @param {boolean} runFuncAtEndOfCooldown - Whether or not to run the function at the end of the cooldown when an event is triggered instead of the beginning
	  */
  self.addRandomCooldownConditionEvent = function(cond, func, repeat, cooldownStart, cooldownEnd, runFuncAtEndOfCooldown = false) {
    self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldownStart: cooldownStart, cooldownEnd: cooldownEnd, random: true, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
  }
  
  self.postEvents = [];
  
  /**
   * Adds a event that triggers at the end of the update, before any objects are updated
   * @memberof GameManager
   * @param {function} func - the function to run when the event is triggered
   */
  self.addPostUpdateEvent = function(func, repeat) {
    self.postEvents.push({func: func, repeat: repeat});
  }
}

/** Represents Score
  * @constructor
  * @namespace Score
  * @param {int} max - the max number of high scores to keep track of.
  * @param {game} game - the game to associate with the score
  */
function Score(max, players, game){
	var self = this;
  /** Creates a Score object 
	 *  @constructs Score
	 *  @param {int} max - the max number of high scores to keep track of.
   *  @param {game} game - the game to associate with the score
	 */
	self.constructor = function(max, players, game){
		GameObject.call(self, "score", null, 0, 0);
		self.isCollidable=false;
		self.score = new Array();
		self.players = players;
		for(var i = 0; i < players; i++){
			self.score.push(0);
		}
		
		if (game) {
			self.game = game;
			game.score = self;
			/** @default true */
			game.displayScore = true;
		}
		
		self.highScoreMax = max;
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		 self.highScores.push(["empty",0]);	
		}
	}
	
	/** Creates the Score object */
	self.constructor(max, players, game);
	
	/** Sets if the score is showing on the canvas 
	 *  @memberof Score
	 *  @function setDisplay
	 *  @param {boolean} display - true if you want score to show, false if you want it to disappear, default true
	 */
	self.setDisplay = function(display){
		self.game.displayScore = display;
	}
	
	/** Sets the color of the Score
	 *  @memberof Score
	 *  @function setColor
	 *  @param {string} color - the name of the color you want the score to be
	 */
	self.setColor = function(color){
		self.game.scoreColor = color;
	}
	
	/** Sets the font of the Score
	 *  @memberof Score
	 *  @function setFont
	 *  @param {string} font - the font of the color
	 */
	self.setFont = function(font){
		self.game.scoreFont = font;
	}
	
	/** Sets the x coordinate of the Score
	 *  @memberof Score
	 *  @function setX
	 *  @param {number} x - the x coordinate of the Score
	 */
	self.setX = function(x){
		self.game.scoreX = x;
	}
	
	/** Sets the y coordinate of the Score
	 *  @memberof Score
	 *  @function setY
	 *  @param {number} y - the y coordinate of the Score
	 */
	self.setY = function(y){
		self.game.scoreY = y;
	}
	
	/** Adds a number to the score
	 *  @memberof Score
	 *  @function addScore
	 *  @param {number} score - adds this number to the current score
	 */
	self.addScore = function(score, player){ 
		self.score[player] += score;
	}
	
	/** Subtracts a number to the score
	 *  @memberof Score
	 *  @function substractScore
	 *  @param {number} score - subtracts this number to the current score
	 */
	self.subtractScore = function(score, player){
		self.score[player] -= score;
	}
	
	self.getScore = function(player){
		return self.score[player];
	}
	
	self.restart = function(){
		for(var i = 0; i < self.players; i++){
			self.score[i] = 0;
		}
	}
	/** Returns the high score at some index
	 *  @memberof Score
	 *  @function getHighScoreAt
	 *  @param {number} index - the index to get the high score at
	 *  @returns the high score at some index
	 */
	self.getHighScoreAt = function(index){
		return self.highScores[index][1];
	}
	
	/** Returns the name of the high score at some index
	 *  @memberof Score
	 *  @function getNameAt
	 *  @param {number} index - the index to get the high score name at
	 *  @returns the name of the high score at some index
	 */
	self.getNameAt = function(index){
		return self.highScores[index][0];
	}
	
	/** Checks if the score given should be in the high score list
	 *  @memberof Score
	 *  @function isHighScore
	 *  @param {number} score - the score to check if it should be in the high score list
	 *  @returns - true if it is a high score or false if it is not
	 */
	self.isHighScore = function(score){
		for(var i = 0; i < self.highScoreMax; i++){
			if(self.getHighScoreAt(i) < score){
				return true;
			}
		}
		return false;
	}
	
	/** Adds the high score to the high score list
	 *  @memberof Score
	 *  @function addHighScore
	 *  @param {string} user - the name of the user that got the high score
	 *  @param {number} highscore - the high score
	 */
	self.addHighScore = function(user, highscore){
		for(var i = 0; i < self.highScoreMax; i++){
			if(self.getHighScoreAt(i) < highscore){
				self.highScores.splice(i, 0, [user,highscore]);
				self.highScores.pop();
				break;
			}
		}
	}
	
	/** Saves the high scores list to the local browser
	 *  @memberof Score
	 *  @function saveHighScores
	 */
	self.saveHighScores = function(name=""){
		localStorage.setItem("highScores_"+name, JSON.stringify(self.highScores));
	}
	
	/** Gets the high scores list from the local browser
	 *  @memberof Score
	 *  @function getHighScores
	 */
	self.getHighScores = function(name=""){
		var json = localStorage.getItem("highScores_"+name);
		if (json)
			return JSON.parse(json);
		return null;
	}
}

/** The life object that places the lives into the game. This is not meant to use directly
  * @mixin
  * @param {sprite} sprite - the sprite that the lives will look like
  * @param {number} x - the x position
  * @param {number} y - the y position
  */
function Life(sprite, x, y){
	var self = this;
	self.constructor = function(sprite, x, y){
		GameObject.call(self,"life",sprite, x, y);
	}
	self.constructor(sprite, x, y);
}

/** Creates lives that can be seen in the top left hand corner 
  * @class
  * @namespace Lives
  * @param {number} numberOfLives - the maximum number of lives
  * @param {sprite} sprite - the sprite that the lives will look like
  */
function Lives(numberOfLives, sprite){
	var self = this;
	
	/** Creates the Lives class
	  * @constructs Lives
	  * @param {number} numberOfLives - the maximum number of lives
	  * @param {sprite} sprite - the sprite that the lives will look like
	  */
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
	
	/** Creates the Lives object */
	self.constructor(numberOfLives, sprite);
	
	/** Removes one life
	  * @memberof Lives
	  * @function loseLife
	  */
	self.loseLife = function(){
		var poppedLife = self.livesArray.pop();
		game.objects.remove(poppedLife);
	}
	
	/** Returns how many lives currently stored
	  * @memberof Lives
	  * @returns the number of lives left
	  */
	self.amountLivesLeft = function(){
		return self.livesArray.length;
	}
	
	/** Restarts the amount of lives to the maximum
	  * @memberof Lives
	  */
	self.restart = function(){
		var startX = 0;
		for(var i = 0; i < numberOfLives; i++){
			life = game.objects.push(new Life(sprite, startX, 0));
			self.livesArray.push(life);
			startX += sprite.width;
		}
	}
}