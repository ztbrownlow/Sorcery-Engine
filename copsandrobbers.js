var game = new Game(document.getElementById("canvas"), "Cops and Robbers");
/** Variable for the size of the paths */
var gridSize = 60;
/** Variable for the size of the characters */
var characterSize = 50;
/** The length of the grid. This can be changed */
var gridLength = 10; 
/** The width of the grid. This can be changed */
var gridWidth = 10;
/** The maximum number of cops to spawn. This can be changed */
var maxCops = 2;
/** The maximum number of robbers to spawn. This can be changed */
var maxRobbers = 2;
/** Variable that says what type of character the human wants to play as. This variable is changed by the buttons on the html page */
var humanPlayer = "robber";
/** The number of the current turn. 0 - (the max cops + max robbers) */
var currentTurn = 0;
/** Which turn coorelates with the humans turn */
var humanTurn = 0;
/** the total number of turns there have been in the game so far */
var totalTurns = 0;
/** The maximum number of turns till the robbers automatically win */
var maxTurns = 50;
/** Variable used to test if a button is pressed or not */
var buttonPressed = null;
document.getElementById("maxturns").innerHTML = maxTurns;

var spr_goodpath = game.sprites.push(new Sprite("good_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/goodpath.png"));

var spr_badpath = game.sprites.push(new Sprite("bad_path", gridSize, gridSize, "http://www4.ncsu.edu/~alrichma/images/badpath.png"));

var obj_players_tree = game.objects.push(new SceneGraph("players", true, true, false));
var obj_path_tree = game.objects.push(new SceneGraph("path", true, true, false));

var grid;

var numRobbers = 0;

var skipTurns = [];

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

stay = function() {
  buttonPressed = "stay";
}

goLeft = function(){
	buttonPressed = "left";
}

goRight = function(){
	buttonPressed = "right";
}

goDown = function(){
	buttonPressed = "down";
}

goUp = function(){
	buttonPressed = "up";
}

game.gameManager.addConditionEvent((function(){return totalTurns < maxTurns && numRobbers != 0}),
	function(){
		var currentPlayer = obj_players_tree.children[currentTurn];
		currentPlayer.turn();
		if(currentPlayer.isHuman){
			document.getElementById("current").innerHTML = "It's YOUR turn! Press the arrow keys below for the direction you want to go in";
		}
		else{
			document.getElementById("current").innerHTML = "It is " + currentPlayer.type + " "  + currentPlayer.turnNumber + " turn!";
		}
		
		document.getElementById("status").innerHTML ="";
	}, true);
	
game.gameManager.addConditionEvent((function(){return totalTurns == maxTurns}),
	function(){
		document.getElementById("current").innerHTML = "GAME OVER! Robbers Win!";
		document.getElementById("currentturn").innerHTML = "GAME OVER!";
	}, true);	
  
game.gameManager.addConditionEvent((function(){return numRobbers == 0;}),
	function(){
		document.getElementById("current").innerHTML = "GAME OVER! Cops Win!";
		document.getElementById("currentturn").innerHTML = "GAME OVER!";
	}, true);	  
  
setupPath = function(grid, pathLevel){
	for(var i = 0; i < pathLevel.length; i++){
		for(var j = 0; j < pathLevel[i].length; j++){
			var walkable = pathLevel[i][j];
			var path = new Path(walkable, j * gridSize, i * gridSize);
			obj_path_tree.push(path);
			grid.changeNodeWalkable(j, i, walkable);
		}
	}
}

getOpenPathLocations = function(currentLevel){
	var openPaths = new Array();
	for(var i = 0; i < currentLevel.length; i++){
		for(var j = 0; j < currentLevel[i].length; j++){
			if(currentLevel[i][j]){
				openPaths.push(new Array(j, i));
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
		var robber = obj_players_tree.push(new Robber(x, y, isHuman, i));
		isHuman = false;
		grid.changeNodeValue(x, y, robber);
	}
}

game.setup = function(){
	obj_players_tree.removeAll();
	obj_path_tree.removeAll();
  numRobbers=0;
	var copHuman = false;
	var robberHuman = false;
  skipTurns = [];
	if(humanPlayer == "cop"){
		copHuman = true;
	}
	if(humanPlayer == "robber"){
		robberHuman = true;
	}
	var currentLevel = level1_path;
  totalTurns = 0;
	grid = new Grid(currentLevel.length, currentLevel[0].length);
	setupPath(grid, currentLevel);
	setupRobber(currentLevel, robberHuman);
	setupCop(currentLevel, copHuman);
}

changeTurn = function(){
  currentTurn++;
  if(currentTurn >= obj_players_tree.length){
    currentTurn = 0;
  }
	totalTurns++;
	document.getElementById("currentturn").innerHTML = obj_players_tree.children[currentTurn].turnNumber; //currentTurn;
	document.getElementById("totalturns").innerHTML = totalTurns;
	buttonPressed = null;
  document.getElementById("stay").disabled = true;
	document.getElementById("left").disabled = true;
	document.getElementById("right").disabled = true;
	document.getElementById("up").disabled = true;
	document.getElementById("down").disabled = true;
}

function Path(isWalkable, x, y){
	var self = this;
	self.constructor = function(isWalkable, x, y){
		self.isWalkable = isWalkable;
		if(isWalkable){
			self.sprite = spr_goodpath;
		}
		else{
			self.sprite = spr_badpath;
		}
		GameObject.call(self, "Path", self.sprite, x, y);
	}
	
	self.constructor(isWalkable, x, y);
}

function Cop(x, y, gridx, gridy, isHuman, turnNumber){
	var self = this;
	
	self.constructor = function(x, y, gridx, gridy, isHuman, turnNumber){
		self.type = "Cop";
		self.gridx = gridx;
		self.gridy = gridy;
		self.turnNumber = turnNumber;
		self.target = null;
		self.sprite = game.sprites.push(new Sprite("cop", characterSize, characterSize,"http://www4.ncsu.edu/~alrichma/images/cop.png",true));
		self.isHuman = isHuman;
		GameObject.call(self, "Cop", self.sprite, x, y);
		if(self.isHuman){
			humanTurn = self.turnNumber;
			self.sprite.currentSprite = 1;
		}
	}
	
	self.constructor(x, y, gridx, gridy, isHuman, turnNumber);
	
	self.turn = function(){
		var walkableNeighbors = grid.getWalkableNeighbors(self.gridx, self.gridy);
    var selfNode = grid.getNode(self.gridx, self.gridy);
    var robberNeighbors = grid.getNeighbors(selfNode).filter(function(n){return n.value && n.value.type == "Robber";});
    var astar = null;
    obj_players_tree.forEach(function(r) {
      if (r.type && r.type == "Robber") {
        var a = grid.astar(selfNode, grid.getNode(r.gridx, r.gridy));
        if (a) {
          if (!astar || astar.length >= a.length) {
            astar = a;
          }
        }
      }
    });
    //var astar = grid.astar(grid.getNode(self.gridx, self.gridy))
		if(self.isHuman){
      walkableNeighbors = walkableNeighbors.concat(robberNeighbors);
			for(var i = 0; i < walkableNeighbors.length; i++){
				var x = walkableNeighbors[i].x;
				var y = walkableNeighbors[i].y;
        document.getElementById("stay").disabled = false;
				if(x == self.gridx && y == (self.gridy + 1)) {
					document.getElementById("down").disabled = false;
				}
				if(x == self.gridx && y == (self.gridy - 1)) {
					document.getElementById("up").disabled = false;
				}
				if(x == (self.gridx + 1) && y == self.gridy) {
					document.getElementById("right").disabled = false;
				}
				if(x == (self.gridx - 1) && y == self.gridy) {
					document.getElementById("left").disabled = false;
				}
			}
			if(buttonPressed != null){
				var newx = self.gridx;
				var newy = self.gridy;
				if(buttonPressed == "left"){
					newx -= 1;
				}
				else if(buttonPressed == "right"){
					newx += 1;
				}
				else if(buttonPressed == "down"){
					newy += 1;
				}
				else if(buttonPressed == "up"){
					newy -= 1;
				}
        if (buttonPressed != "stay") {
          grid.moveNodeValue(self.gridx, self.gridy, newx,newy);
          self.gridx = newx;
          self.gridy = newy;
          self.x = self.gridx * gridSize;
          self.y = self.gridy * gridSize;
          obj_players_tree.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
        }
				changeTurn();	
			}
		} else {
      /*
      if (robberNeighbors.length != 0) {
        walkableNeighbors = robberNeighbors;
      }
			if(walkableNeighbors.length != 0){
				var random = Math.floor(Math.random() * walkableNeighbors.length);
				var selectedNode = walkableNeighbors[random];*/
      var selectedNode = grid.getNode(astar[1][0], astar[1][1])
      if (!selectedNode.value || selectedNode.value.type == "Robber") { 
				grid.moveNodeValue(self.gridx, self.gridy, selectedNode.x, selectedNode.y);
        self.gridx = selectedNode.x;
				self.gridy = selectedNode.y;
				self.x = self.gridx * gridSize;
				self.y = self.gridy * gridSize;
			}
      obj_players_tree.forEachUntilFirstSuccess( function(e) {return self.tryCollide(e); }, true);
			changeTurn();
		}
	}
  self.canCollideWith = function(other) {
    return (other.type && other.type == "Robber");
  }
  self.collideWith = function(robber) {
    --numRobbers;
    skipTurns.push(robber.turnNumber);
    obj_players_tree.remove(robber);
  }
}

function Robber(gridx, gridy, isHuman, turnNumber){
	var self = this;
	
	self.constructor = function(gridx, gridy, isHuman, turnNumber){
    ++numRobbers;
		self.x = gridx * gridSize;
		self.y = gridy * gridSize;
		self.type = "Robber";
		self.gridx = gridx;
		self.gridy = gridy;
		self.turnNumber = turnNumber;
		self.sprite = game.sprites.push(new Sprite("robber", characterSize, characterSize, "http://www4.ncsu.edu/~alrichma/images/robber.png",true));
		self.isHuman = isHuman;
		if(self.isHuman){
			self.sprite.currentSprite = 1;
			humanTurn = self.turnNumber;
		}
		GameObject.call(self, "Robber", self.sprite, self.x, self.y);
	}
	
	self.constructor(gridx, gridy, isHuman, turnNumber);
	
	self.turn = function(){
		var walkableNeighbors = grid.getWalkableNeighbors(self.gridx, self.gridy);
		if(self.isHuman){
			for(var i = 0; i < walkableNeighbors.length; i++){
				var x = walkableNeighbors[i].x;
				var y = walkableNeighbors[i].y;
        document.getElementById("stay").disabled = false;
				if(x == self.gridx && y == (self.gridy +1)){
					document.getElementById("down").disabled = false;
				}
				if(x == self.gridx && y == (self.gridy - 1)){
					document.getElementById("up").disabled = false;
				}
				if(x == (self.gridx + 1) && y == self.gridy){
					document.getElementById("right").disabled = false;
				}
				if(x == (self.gridx - 1) && y == self.gridy){
					document.getElementById("left").disabled = false;
				}
			}
			if(buttonPressed != null){
				var newx = self.gridx;
				var newy = self.gridy;
				if(buttonPressed == "left"){
					newx -= 1;
				}
				else if(buttonPressed == "right"){
					newx += 1;
				}
				else if(buttonPressed == "down"){
					newy += 1;
				}
				else if(buttonPressed == "up"){
					newy -= 1;
				}
        if (buttonPressed != "stay") {
          grid.moveNodeValue(self.gridx, self.gridy, newx,newy);
          self.gridx = newx;
          self.gridy = newy;
          self.x = self.gridx * gridSize;
          self.y = self.gridy * gridSize;
        }
				changeTurn();	
			}
		}
		else{
			if(walkableNeighbors.length != 0){
				var random = Math.floor(Math.random() * walkableNeighbors.length);
				var selectedNode = walkableNeighbors[random];
				grid.moveNodeValue(self.gridx, self.gridy, selectedNode.x, selectedNode.y);
				self.gridx = selectedNode.x;
				self.gridy = selectedNode.y;
				self.x = self.gridx * gridSize;
				self.y = self.gridy * gridSize;
			}
			changeTurn();
		}
		
	}
}

game.setup();
game.start(200);
