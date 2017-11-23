var game = new Game(document.getElementById("canvas"), "Cops and Robbers");
var gridSize = 60;
var characterSize = 60;
var gridLength = 10; 
var gridWidth = 10;
var maxCops = 2;
var maxRobbers = 2;

var spr_goodpath = game.sprites.push(new Sprite("good_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/goodpath.png"));

var spr_badpath = game.sprites.push(new Sprite("bad_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/badpath.png"));
var spr_cop = game.sprites.push(new Sprite("cop", characterSize, characterSize, "http://www4.ncsu.edu/~alrichma/images/cop.png"));
var spr_robber = game.sprites.push(new Sprite("robber", characterSize, characterSize, "http://www4.ncsu.edu/~alrichma/images/robber.png"));

var obj_cop_tree = game.objects.push(new SceneGraph("cop", true, true, false));
var obj_robber_tree = game.objects.push(new SceneGraph("robber", true, true, false));
var obj_path_tree = game.objects.push(new SceneGraph("path", true, true, false));

var grid;

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

setupCop = function(currentLevel){
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
		var cop = obj_cop_tree.push(new Cop(x*gridSize, y*gridSize, x, y));
		grid.changeNodeValue(x, y, cop);
	}
}

setupRobber = function(currentLevel){
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
		var robber = obj_robber_tree.push(new Robber(x*gridSize, y*gridSize, x, y));
		grid.changeNodeValue(x, y, robber);
	}
}

game.setup = function(){
	obj_cop_tree.removeAll();
	obj_robber_tree.removeAll();
	obj_path_tree.removeAll();
	var currentLevel = level1_path;
	grid = new Grid(currentLevel.length, currentLevel[0].length);
	setupPath(grid, currentLevel);
	setupCop(currentLevel);
	setupRobber(currentLevel);
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

function Cop(x, y, gridx, gridy){
	var self = this;
	
	self.constructor = function(x, y){
		self.x = x;
		self.y = y;
		self.gridx = gridx;
		self.gridy = gridy;
		self.sprite = spr_cop;
		GameObject.call(self, "Cop", self.sprite, self.x, self.y);
	}
	
	self.constructor(x, y);
}

function Robber(x, y, gridx, gridy){
	var self = this;
	
	self.constructor = function(x, y){
		self.x = x;
		self.y = y;
		self.gridx = gridx;
		self.gridy = gridy;
		self.sprite = spr_robber;
		GameObject.call(self, "Robber", self.sprite, self.x, self.y);
	}
	
	self.constructor(x, y);
}

game.setup();
game.start(50);
