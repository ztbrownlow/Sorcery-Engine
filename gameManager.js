/** A game manager that will run any updates that you need to keep track of. Also it keeps track of levels.
 * @class GameManager
 * @property {Boolean} isCollidable=false - value if the object can be collided with. Defaults false.
 * @property {Number} level=0 - the current level of the game. Defaults zero. 
 * @property {Array} events - the array of events to be carried out by the game manager.
 */
function GameManager(){
	var self = this;
	/** Creates the game manager object
	 * @memberof GameManager
	 * @function GameManager#constructor
	 */
	self.constructor = function() {
		GameObject.call(self, "GameManager", null, 0, 0);
		self.isCollidable=false;
		self.level = 0;
		self.events = [];
	}
	/** Creates GameManager */
	self.constructor();
	/** Override this function to put in your custom Updates for your game. Called at start of update.
	  * @memberof GameManager
	  * @function GameManager#customUpdate
	  * @param {Game} game - The game object
	  */
	self.customUpdate = function(game){}
	/** The update function of the object. Do not override this function. Handles all events
	  * @memberof GameManager
	  * @function GameManager#update
	  * @param {Game} game - The game object
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
	/**
	 * Calls the events that run at the end of the update
	 * @memberof GameManager
	 * @function GameMember#postUpdate
	 */
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
	  * @function GameManager#addTimedEvent
	  * @param {Number} steps - how often to run the event
	  * @param {function} func - the function to call when the event occurs
	  * @param {Boolean} repeat - whether or not to repeat the event after it occurs
	  */
	self.addTimedEvent = function(steps, func, repeat) {
		self.events.push({type: "timed", random: false, steps: steps, func: func, repeat: repeat, orig: steps});
	}
	/** 
	 * Adds a randomly timed event to the game manager. Can trigger just once or repeatedly.
	 * @memberof GameManager
	 * @function GameManager#addRandomTimedEvent
	 * @param {Number} randomStart - how often to run the event at minimum
	 * @param {Number} randomEnd - how often to run the event at maximum
	 * @param {function} func - the function to call when the event occurs
	 * @param {Boolean} repeat - whether or not to repeat the event after it occurs
	 */
	self.addRandomTimedEvent = function(randomStart, randomEnd, func, repeat) {
		var s = function() {return randomStart + Math.random()*(randomEnd-randomStart)};
		self.events.push({type: "timed", random: true, steps: s(), func: func, repeat: repeat, orig: s});
	}
	/** 
	  * Adds a condition-based event to the game manager. Can trigger just once or repeatedly.
	  * @memberof GameManager
		* @function GameManager#addConditionEvent
	  * @param {function} cond - the condition to check
	  * @param {function} func - the function to run when the event is triggered
	  * @param {Boolean} repeat - whether or not to repeat the event after it occurs
	  * @param {Number} cooldown - if repeating event, cooldown can be optionally used to signify how long to wait until the event can be trigerred again
	  * @param {Boolean} [runFuncAtEndOfCooldown=false] - Whether or not to run the function at the end of the cooldown when an event is triggered instead of the beginning
	  */
	self.addConditionEvent = function(cond, func, repeat, cooldown = 0, runFuncAtEndOfCooldown = false) {
		self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldown: cooldown, random: false, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
	}
	/** 
	  * Adds a condition-based event to the game manager with a random cooldown. Can trigger just once or repeatedly, and can have cooldown between checking if triggered
	  * @memberof GameManager
		* @function GameManager#addRandomCooldownConditionEvent
	  * @param {function} cond - the condition to check
	  * @param {function} func - the function to run when the event is triggered
	  * @param {Boolean} repeat - whether or not to repeat the event after it occurs
	  * @param {Number} cooldownStart - minimum value to use for cooldown
	  * @param {Number} cooldownEnd - maximum value to use for cooldown
	  * @param {Boolean} [runFuncAtEndOfCooldown=false] - Whether or not to run the function at the end of the cooldown when an event is triggered instead of the beginning
	  */
	self.addRandomCooldownConditionEvent = function(cond, func, repeat, cooldownStart, cooldownEnd, runFuncAtEndOfCooldown = false) {
		self.events.push({type: "condition", cond: cond, func: func, repeat: repeat, cooldownStart: cooldownStart, cooldownEnd: cooldownEnd, random: true, coolingDown: false, runFuncAtEndOfCooldown: runFuncAtEndOfCooldown});
	}
	
	/**
	 * @memberof GameManager
	 * events that are ran after game updates (instead of before, like the others)
	 */
	self.postEvents = [];
	
	/**
	 * Adds a event that triggers at the end of the update, before any objects are updated. Does not have any timer or condition
	 * @memberof GameManager
	 * @function GameManager#addPostUpdateEvent
	 * @param {function} func - the function to run when the event is triggered
	 * @param {Boolean} repeat - whether or not to repeat the event
	 */
	self.addPostUpdateEvent = function(func, repeat) {
		self.postEvents.push({func: func, repeat: repeat});
	}
}

/** Represents Score
 * @class Score
 * @param {Game} game - the game to associate with the score
 * @property {Boolean} isCollidable=false - value if the object can be collided with. Defaults false. 
 * @property {Number} score - the value that holds the score number
 * @property {Boolean} displayScore=true - value if the score should be shown or not. Defaults to true.
 * @property {String} scoreColor="black" - value of the color that score wil be draw in. Can be word colors or hex values. Defaults to "black"
 * @property {String} scoreFont="bold 12px Palatino Linotype" - value of the font that score will draw in. Defaults to "bold 12px Palatino Linotype"
 * @property {Number} scoreX=0 - the x coordinate of the score. Defaults to zero.
 * @property {Number} scoreY=0 - the y coordinate of the score. Defaults to 10.
 */
function Score(game){
	var self = this;
	/** Creates a Score object 
	 * @memberof Score
	 * @function Score#constructor
	 * @param {Game} game - the game to associate with the score
	 */
	self.constructor = function(game){
		GameObject.call(self, "score", null, 0, 0);
		self.isCollidable=false;
		self.score = 0;
		self.game = game;
		self.displayScore = true;
		self.scoreColor = "black";
		self.scoreFont = "bold 12px Palatino Linotype"
		self.scoreX = 0;
		self.scoreY = 10;
		self.game.score.push(self);
	}
	
	/** Creates the Score object */
	self.constructor(game);
	
	/** Sets if the score is showing on the canvas 
	 * @memberof Score
	 * @function Score#setDisplay
	 * @param {Boolean} display - true if you want score to show, false if you want it to disappear
	 */
	self.setDisplay = function(display){
		self.displayScore = display;
	}
	
	/** Sets the color of the Score
	 * @memberof Score
	 * @function Score#setColor
	 * @param {String} color - the color you want the score to be
	 */
	self.setColor = function(color){
		self.scoreColor = color;
	}
	
	/** Sets the font of the Score
	 *  @memberof Score
	 *  @function Score#setFont
	 *  @param {String} font - the font of the color
	 */
	self.setFont = function(font){
		self.scoreFont = font;
	}
	
	/** Sets the x coordinate of the Score
	 *  @memberof Score
	 *  @function Score#setX
	 *  @param {Number} x - the x coordinate of the Score
	 */
	self.setX = function(x){
		self.scoreX = x;
	}
	
	/** Sets the y coordinate of the Score
	 *  @memberof Score
	 *  @function Score#setY
	 *  @param {Number} y - the y coordinate of the Score
	 */
	self.setY = function(y){
		self.scoreY = y;
	}
	
	/** Adds a number to the score
	 *  @memberof Score
	 *  @function Score#addScore
	 *  @param {Number} score - number to add to the current score
	 */
	self.addScore = function(score){ 
		self.score += score;
	}
	
	/** Subtracts a number from the score
	 *  @memberof Score
	 *  @function Score#substractScore
	 *  @param {Number} score - number to subtract from the current score
	 */
	self.subtractScore = function(score){
		self.score -= score;
	}

	/** Gets the score
	 *  @memberof Score
	 *  @function Score#getScore
	 *  @returns the score
	 */
	self.getScore = function() {
		return self.score;
	}
	
	/** Resets the score to 0
	 *  @memberof Score
	 *  @function Score#restart
	 */
	self.restart = function() {
		self.score = 0;
	}
}

/** Represents HighScore
  * @class HighScore
  * @param {Number} max - the max number of high scores to keep track of.
  * @property {Number} highScoreMax - the maximum number of high scores to keep track of.
  * @property {Array} highScores - the array that holds the high score. Each position in the array holds another array with the value ["name", score].
  */
function HighScore(max){
	var self = this;
	
	 /** Creates a HighScore object 
	 *  @memberof HighScore
	 *  @function HighScore#constructor
	 *  @param {Number} max - the max number of high scores to keep track of.
	 */
	self.constructor = function(max){
		self.highScoreMax = max;
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		 self.highScores.push(["empty",0]);	
		}	
	}
	
	/** Constructs HighScore */
	self.constructor(max);
	
	/** Returns the high score at some index
	 *  @memberof HighScore
	 *  @function HighScore#getHighScoreAt
	 *  @param {Number} index - the index to get the high score at
	 *  @returns {Number} the high score at the specified index
	 */
	self.getHighScoreAt = function(index){
		return self.highScores[index][1];
	}
	
	/** Returns the name of the high score at some index
	 *  @memberof HighScore
	 *  @function HighScore#getNameAt
	 *  @param {Number} index - the index to get the high score name at
	 *  @returns {String} the name of the high score at the specified index
	 */
	self.getNameAt = function(index){
		return self.highScores[index][0];
	}
	
	/** Checks if the score given should be in the high score list
	 *  @memberof HighScore
	 *  @function HighScore#isHighScore
	 *  @param {Number} score - the score to check if it should be in the high score list
	 *  @returns {Boolean} true if it is a high score or false if it is not
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
	 *  @memberof HighScore
	 *  @function HighScore#addHighScore
	 *  @param {string} user - the name of the user that got the high score
	 *  @param {Number} highscore - the high score
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
	
	/** Saves the high scores list to the local browser session
	 *  @memberof HighScore
	 *  @function HighScore#saveHighScores
	 *  @param {String} [name=""] identifier for file name to distinguish it from other games
	 */
	self.saveHighScores = function(name=""){
		localStorage.setItem("highScores_"+name, JSON.stringify(self.highScores));
	}
	
	/** Gets the high scores list from the local browser session
	 *  @memberof HighScore
	 *  @function getHighScores
	 *  @param {String} [name=""] name used when saving high scores list
	 */
	self.getHighScores = function(name=""){
		var json = localStorage.getItem("highScores_"+name);
		if (json)
			return JSON.parse(json);
		return null;
	}
}

/** The life object that places the lives into the game. This is not meant to use directly
  * @class Life
  * @ignore
  * @param {sprite} sprite - the sprite that the lives will look like
  * @param {Number} x - the x position
  * @param {Number} y - the y position
  */
function Life(sprite, x, y){
	var self = this;
	/** constructor
	* @function Life#constructor
	* @memberof Life
	* @param {sprite} sprite - the sprite that the lives will look like
	* @param {Number} x - the x position
	* @param {Number} y - the y position
	*/
	self.constructor = function(sprite, x, y){
		GameObject.call(self,"life",sprite, x, y);
	}
	self.constructor(sprite, x, y);
}

/** Creates lives that can be seen in the top left hand corner 
  * @class Lives
  * @param {Number} numberOfLives - the maximum number of lives
  * @param {sprite} sprite - the sprite that the lives will look like
  * @property {Number} startX - the starting X value to draw the live sprites at 
  * @property {array} livesArray - the array that holds the sprites of each life. 
  */
function Lives(numberOfLives, sprite){
	var self = this;
	
	/** Creates the Lives class
	  * @memberof Lives
	  * @function Lives#constructor
	  * @param {Number} numberOfLives - the maximum number of lives
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
	  * @function Lives#loseLife
	  */
	self.loseLife = function(){
		var poppedLife = self.livesArray.pop();
		game.objects.remove(poppedLife);
	}
	
	/** Returns how many lives currently stored
	  * @memberof Lives
	  * @function Lives#amountLivesLeft
	  * @returns {Number} the number of lives left
	  */
	self.amountLivesLeft = function(){
		return self.livesArray.length;
	}
	
	/** Restarts the amount of lives to the maximum
	  * @memberof Lives
	  * @function Lives#restart
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