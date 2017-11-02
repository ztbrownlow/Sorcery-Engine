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
	}
	
	/** Creates GameManager */
	self.constructor();
	
	/** Override this function to put in your custom Updates for your game
	  * @memberof GameManager
	  * @para {game} game - The game object
	  */
	self.customUpdate = function(game){}
	
	/** The update function of the object. Do not override this function.
	  * @memberof GameManager
	  * @para {game} game - The game object
	  */
	self.update = function(game) {
		self.customUpdate(game);
	}
}

/** Represents Score
  * @constructor
  * @namespace Score
  * @param {int} max - the max number of high scores to keep track of.
  */
function Score(max){
	var self = this;

	/** Creates a Score object 
	 *  @constructs Score
	 *  @param {int} max - the max number of high scores to keep track of.
	 */
	self.constructor = function(max){
		self.score = 0;
		self.highScoreMax = max;
		/** @default true */
		game.displayScore = true;
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		  self.highScores.push(["empty",0]);	
		}
	}
	
	/** Creates the Score object */
	self.constructor(max);
	
	/** Sets if the score is showing on the canvas 
	 *  @memberof Score
	 *  @function setDisplay
	 *  @param {boolean} display - true if you want score to show, false if you want it to disappear, default true
	 */
	self.setDisplay = function(display){
		game.displayScore = display;
	}
	
	/** Sets the color of the Score
	 *  @memberof Score
	 *  @function setColor
	 *  @param {string} color - the name of the color you want the score to be
	 */
	self.setColor = function(color){
		game.scoreColor = color;
	}
	
	/** Sets the font of the Score
	 *  @memberof Score
	 *  @function setFont
	 *  @param {string} font - the font of the color
	 */
	self.setFont = function(font){
		game.scoreFont = font;
	}
	
	/** Sets the x coordinate of the Score
	 *  @memberof Score
	 *  @function setX
	 *  @param {number} x - the x coordinate of the Score
	 */
	self.setX = function(x){
		game.scoreX = x;
	}
	
	/** Sets the y coordinate of the Score
	 *  @memberof Score
	 *  @function setY
	 *  @param {number} y - the y coordinate of the Score
	 */
	self.setY = function(y){
		game.scoreY = y;
	}
	
	/** Adds a number to the score
	 *  @memberof Score
	 *  @function addScore
	 *  @param {number} score - adds this number to the current score
	 */
	self.addScore = function(score){ 
		self.score += score;
	}
	
	/** Subtracts a number to the score
	 *  @memberof Score
	 *  @function substractScore
	 *  @param {number} score - subtracts this number to the current score
	 */
	self.subtractScore = function(score){
		self.score -= score;
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