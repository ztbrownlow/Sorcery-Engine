/** A node for use in the Grid class.
  * @class Node
  * @param {Number} x the x position of the node in the grid
  * @param {Number} y the y position of the node in the grid
  * @property {Number} x x coordinate on grid of node
  * @property {Number} y y coordinate on grid of node
  * @property {Number} f used for A*
  * @property {Number} g used for A*
  * @property {Number} h used for A*
  * @property {Number} nodeParent used for pathfinding
  */
function Node(x, y){
	var self = this;
	
	/**
	 * Creates the node
	 * @function Node#constructor
	 * @param {Number} x the x position of the node in the grid
	 * @param {Number} y the y position of the node in the grid
	 */
	self.constructor = function(x, y){
		self.value = null;
		self.walkable = false;
		self.x = x;
		self.y = y;
		//f is the cost from the start
		self.f = null;
		//g is the cost from the end
		self.g = null;
		self.h = null;
		self.nodeParent = null;
	}
	
	/**
	 * Checks if a node is open for traversing
	 * @function Node#isOpen
	 * @returns true if node has null value and is walkable
	 */
	self.isOpen = function(){
		return self.walkable && (self.value == null);
	}
	
	/**
	  * Checks if a node isn't walkable
	  * @function Node#isClosed
	  * @returns true if node is not walkable
	  */
	self.isClosed = function(){
		return !self.walkable;
	}
	
	self.constructor(x,y);
}

/**
  * Grid class used for maintaining states on a grid and traversing it
  * @class Grid
  * @param {Number} length the number of rows in the grid
  * @param {Number} width the number of columns in the grid
  * @property {Node[][]} grid
  * @property {Number} gridLength width of grid
  * @property {Number} gridWidth width of grid
  */
function Grid(length, width){
	var self = this;
	
  /**
   * Creates the grid
   * @function Grid#constructor
   * @param length the number of rows in the grid
   * @param width the number of columns in the grid
   */
	self.constructor = function(length, width){
		self.grid = new Array(length);
		for(var i = 0; i < length; i++){
			self.grid[i] = new Array(width);
			for(var j = 0; j < width; j++){
				self.grid[i][j] = new Node(j, i);
			}
		}
		self.gridLength = length;
		self.gridWidth = width;
	}
	
	self.constructor(length, width);
	
  /**
    * Moves a value from one node to another
    * @function Grid#moveNodeValue
    * @param x1 the x position of the node whose value will be copied over
    * @param y1 the y position of the node whose value will be copied over
    * @param x2 the x position of the node who will receive the new value
    * @param y2 the y position of the node who will receive the new value
    */
	self.moveNodeValue = function(x1, y1, x2, y2){
		var node1 = self.getNode(x1,y1);
		var node2 = self.getNode(x2,y2);
		node2.value = node1.value;
		node1.value = null;
	}
	
  /**
    * Changes the value of a node in the grid
    * @function Grid#changeNodeValue
    * @param {Number} x the x position of the node whose value will be changed
    * @param {Number} y the y position of the node whose value will be changed
    * @param {object} value the new value
    * @memberof Grid
    */
	self.changeNodeValue = function(x, y, value){
		self.grid[y][x].value = value;
	}
	
  /**
    * Gets the value at a node in the grid
    * @param {Number} x the x position of the node whose value will be checked
    * @param {Number} y the y position of the node whose value will be checked
    * @function Grid#getNodeValue
    * @returns {object} the value of the node
    */
	self.getNodeValue = function(x, y){
		return self.grid[y][x].value;
	}
	
  /**
    * Changes the if a node in the grid is walkable
    * @param {Number} x the x position of the node which will be changed
    * @param {Number} y the y position of the node which will be changed
    * @param {Boolean} walkable whether or not the node should be walkable
    * @function Grid#changeNodeWalkable
    */
	self.changeNodeWalkable = function(x, y, walkable){
		self.grid[y][x].walkable = walkable;
	}
	
  /** 
    * Gets the node at a certain position in the grid
    * @param {Number} x the x position to check
    * @param {Number} y the y position to check
    * @returns {Node} the node at the position
    * @function Grid#getNode
    */
	self.getNode = function(x, y){
		return self.grid[y][x];
	}
	
  /**
    * Gets the neighbors of a node
    * @param {Node} node the node to check
    * @returns {Node[]}the node's neighbors
    * @function Grid#getNeighbors
    */
	self.getNeighbors = function(node){
		var x = node.x;
		var y = node.y;
		var neighbors = new Array();
		if(self.grid[y-1] && self.grid[y-1][x]){ 
			neighbors.push(self.grid[y-1][x]);
		}
		if(self.grid[y+1] && self.grid[y+1][x]){ 
			neighbors.push(self.grid[y+1][x]);
		}
		if(self.grid[y][x-1] && self.grid[y][x-1]){ 
			neighbors.push(self.grid[y][x-1]);
		}
		if(self.grid[y][x+1] && self.grid[y][x+1]){ 
			neighbors.push(self.grid[y][x+1]);
		}
		return neighbors;
	}
	
  /**
    * Gets the open neighbors of a node
    * @param {Number} x the x position of the node to checked
    * @param {Number} y the y position of the node to check
    * @returns {Node[]} the node's open neighbors
    * @function Grid#getWalkableNeighbors
    */
	self.getWalkableNeighbors = function(x, y){
    return self.getNeighbors(self.getNode(x, y)).filter(function(n){return n.isOpen();});
	}
	
  /**
    * Gets the manhattan distance between two nodes
    * @param {Node} object1 node to check
    * @param {Node} object2 node to check
    * @returns {Number} the Manhattan distance between object1 and object2
    * @function Grid#ManhattanDistance
    */
	self.ManhattanDistance = function(object1, object2){
		var d1 = Math.abs(object2.x - object1.x);
		var d2 = Math.abs(object2.y - object1.y);
		return d1 + d2;
	}
	
  /**
    * Cleans the grid to prepare for running A*
    * @function Grid#astarGridClean
    */
	self.astarGridClean = function(){
		for(var i = 0; i < self.grid.length; i++){
			for(var j = 0; j < self.grid[i].length; j++){
				var currentNode = self.grid[i][j];
				currentNode.nodeParent = null;
				currentNode.f = Infinity;
				currentNode.g = Infinity;
				currentNode.h = 0;
			}
		}
	}
	
  /**
    * Gets the shortest path between two nodes in the grid
    * @param {Node} start the starting node
    * @param {Node} end the ending node
    * @returns {Array} the shortest path between the two nodes as an array of [x, y] coordinates
    * @function Grid#astar
    */
	self.astar = function(start, end){
		self.astarGridClean();
		var result = new Array();
		var openList = new Array();
		var closedList = new Array();
		var path;
		openList.push(start);
		start.g = 0;
		start.f = self.ManhattanDistance(start,end);
		while (openList.length) {
			current = openList[0];
			ci = 0;
			for (var i = 1; i < openList.length; ++i) {
				if (openList[i].f < current.f) {
					ci = i;
					current = openList[i];
				}
			}
			if (current === end) {
				var path = closedList[closedList.push(current) - 1];
				var result = [];
				do{ result.push([path.x, path.y]); }
				while(path = path.nodeParent);
				//return start to finish
				return result.reverse();
			} else {
				openList.splice(ci,1);
				closedList.push(current);
				var neighbors = self.getNeighbors(current).filter(function(n) {return n.walkable});
				for (var i = 0; i < neighbors.length; ++i) {
					var n = neighbors[i];
					if (closedList.includes(n)) {
						continue;
					}
					if (!openList.includes(n)) {
						openList.push(n);
					}
					var gScore = current.g + 1;
					if (gScore >= n.g) {
						continue;
					}
					n.nodeParent = current;
					n.g = gScore;
					n.f = n.g + self.ManhattanDistance(n,end);
				}
			}
		}
		return null;
	}
}
