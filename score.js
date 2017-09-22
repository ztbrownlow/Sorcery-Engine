function Score(max){
	var self = this;
	self.constructor = function(max){
		self.score = 0;
		self.highScoreMax = max;
		self.highScores = new Array();
		for(var i = 0; i < self.highScoreMax; i++){
		 self.highScores.push(["empty",0]);	
		}
	}
	
	self.constructor(max);
	self.addScore = function(score){ self.score += score;}
	self.subtractScore = function(score){ self.score -= score;}
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
				self.highScores.splice(i, 0 ,[user,highscore]);
				self.highScores.pop();
				break;
			}
		}
	}
	self.saveHighScores = function(){
		localStorage.setItem("highScores", JSON.stringify(self.highScores));
	}
	self.getHighScores = function(){
		var json = JSON.parse(localStorage.getItem("highScores"));
		return json;
	}
	
}