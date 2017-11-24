var game = new Game(document.getElementById("canvas"), "Cops and Robbers");
var gridSize = 60;
var characterSize = 50;
var gridLength = 10; 
var gridWidth = 10;
var maxCops = 2;
var maxRobbers = 2;
var humanPlayer = "cop";
var currentTurn = 0;
var totalTurns = 0;
var maxTurns = 50;

var spr_goodpath = game.sprites.push(new Sprite("good_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/goodpath.png"));

var spr_badpath = game.sprites.push(new Sprite("bad_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/badpath.png"));

var obj_players_tree = game.objects.push(new SceneGraph("players", true, true, false));
var obj_path_tree = game.objects.push(new SceneGraph("path", true, true, false));
var obj_arrows_tree = game.objects.push(new SceneGraph("arrows", true, true, false));

var grid;

beACop = function(){
	humanPlayer = "cop";
	game.setup();
}

beARobber = function(){
	humanPlayer = "robber";
	game.setup();
}

beNeither = function(){
	humanPlayer = "neither";
	game.setup();
}


setupPath = function(grid, pathLevel){
	for(var i = 0; i < pathLevel.length; i++){
		for(var j = 0; j < pathLevel[i].length; j++){
			var walkable = pathLevel[i][j];
			var path = new Path(walkable, i * gridSize, j * gridSize);
			obj_path_tree.push(path);
			grid.changeNodeWalkable(i, j, walkable);
		}
	}
}

getOpenPathLocations = function(currentLevel){
	var openPaths = new Array();
	for(var i = 0; i < currentLevel.length; i++){
		for(var j = 0; j < currentLevel[i].length; j++){
			if(currentLevel[i][j]){
				openPaths.push(new Array(i, j));
			}
		}
	}
	return openPaths;
}

setupCop = function(currentLevel, isHuman){
	var openPaths = getOpenPathLocations(currentLevel);
	for(var i = 0; i < maxCops; i++){
		var random = Math.floor(Math.random() * openPaths.length);
		var x = openPaths[random][0];
		var y = openPaths[random][1];
		while(grid.getNodeValue(x, y) != null){
			var random = Math.floor(Math.random() * openPaths.length);
			var x = openPaths[random][0];
			var y = openPaths[random][1];
		}
		var cop = obj_players_tree.push(new Cop(x*gridSize, y*gridSize, x, y, isHuman, i + maxRobbers));
		isHuman = false;
		grid.changeNodeValue(x, y, cop);
	}
}

setupRobber = function(currentLevel, isHuman){
	var openPaths = getOpenPathLocations(currentLevel);
	for(var i = 0; i < maxCops; i++){
		var random = Math.floor(Math.random() * openPaths.length);
		var x = openPaths[random][0];
		var y = openPaths[random][1];
		while(grid.getNodeValue(x, y) != null){
			var random = Math.floor(Math.random() * openPaths.length);
			var x = openPaths[random][0];
			var y = openPaths[random][1];
		}
		var robber = obj_players_tree.push(new Robber(x*gridSize, y*gridSize, x, y, isHuman, i));
		isHuman = false;
		grid.changeNodeValue(x, y, robber);
	}
}

game.setup = function(){
	obj_players_tree.removeAll();
	obj_path_tree.removeAll();
	var copHuman = false;
	var robberHuman = false;
	if(humanPlayer == "cop"){
		copHuman = true;
	}
	if(humanPlayer == "robber"){
		robberHuman = true;
	}
	var currentLevel = level1_path;
	grid = new Grid(currentLevel.length, currentLevel[0].length);
	setupPath(grid, currentLevel);
	setupRobber(currentLevel, robberHuman);
	setupCop(currentLevel, copHuman);
}

function Path(isWalkable, x, y){
	var self = this;
	self.constructor = function(isWalkable, x, y){
		self.isWalkable = isWalkable;
		self.x = x;
		self.y = y;
		if(isWalkable){
			self.sprite = spr_goodpath;
		}
		else{
			self.sprite = spr_badpath;
		}
		GameObject.call(self, "Path", self.sprite, self.x, self.y);
	}
	
	self.constructor(isWalkable, x, y);
}

function Cop(x, y, gridx, gridy, isHuman, turnNumber){
	var self = this;
	
	self.constructor = function(x, y, gridx, gridy, isHuman, turnNumber){
		self.x = x;
		self.y = y;
		self.gridx = gridx;
		self.gridy = gridy;
		self.turnNumber = turnNumber;
		self.target = null;
		self.sprite = game.sprites.push(new Sprite("cop", characterSize, characterSize,"http://www4.ncsu.edu/~alrichma/images/cop.png",true));
		self.isHuman = isHuman;
		GameObject.call(self, "Cop", self.sprite, self.x, self.y);
		if(self.isHuman){
			self.sprite.currentSprite = 1;
		}
	}
	
	self.constructor(x, y, gridx, gridy, isHuman, turnNumber);
	
	self.turn = function(){
		if(self.isHuman){
			
		}
		else{
			
		}
	}
}

function Robber(x, y, gridx, gridy, isHuman, turnNumber){
	var self = this;
	
	self.constructor = function(x, y, gridx, gridy, isHuman, turnNumber){
		self.x = x;
		self.y = y;
		self.gridx = gridx;
		self.gridy = gridy;
		self.turnNumber = turnNumber;
		self.sprite = game.sprites.push(new Sprite("robber", characterSize, characterSize, "http://www4.ncsu.edu/~alrichma/images/robber.png",true));
		self.isHuman = isHuman;
		if(self.isHuman){
			self.sprite.currentSprite = 1;
		}
		GameObject.call(self, "Robber", self.sprite, self.x, self.y);
	}
	
	self.constructor(x, y, gridx, gridy, isHuman, turnNumber);
	
	self.turn = function(){
		if(self.isHuman){
			
		}
		else{
			//var walkableNeighbors = grid.getWalkableNeighbors(gridx, gridy);
			//console.log(walkableNeighbors);
		}
	}
}

game.setup();
game.start(50);
