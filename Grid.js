function Node(x, y){
	var self = this;
	
	self.constructor = function(x, y){
		self.value = null;
		self.walkable = false;
		self.x = i;
		self.y = j;
		//f is the cost from the start
		self.f = null;
		//g is the cost from the end
		self.g = null;
		self.h = null;
		self.nodeParent = null;
	}
	
	self.isOpen = function(){
		return self.walkable;
	}
	
	self.isClosed = function(){
		return !self.walkable;
	}
}

function Grid(length, width){
	var self = this;
	
	self.constructor = function(length, width){
		self.grid = new Array(length);
		for(var i = 0; i < length; i++){
			self.grid[i] = new Array(width);
		}
		for(var i = 0; i < width; i++){
			for(var j = 0; j < length; j++){
				self.grid[i][j] = new Node(i, j);
			}
		}
		self.gridLength = length;
		self.gridWidth = width;
	}
	
	self.constructor(length, width);
	
	self.changeNodeValue = function(x, y, value){
		self.grid[x][y].value = value;
	}
	
	self.getNodeValue = function(x, y){
		return self.grid[x][y].value;
	}
	
	self.changeNodeWalkable = function(x, y, walkable){
		self.grid[x][y].walkable = walkable;
	}
	
	self.getNode = function(x, y){
		return self.grid[x][y];
	}
	
	self.getNeighbors = function(node){
		var x = node.x;
		var y = node.y;
		var neighbors = new Array();
		if(self.grid[x-1] && self.grid[x-1][y]){ 
			neighbors.push(self.grid[x-1][y]);
		}
		if(self.grid[x+1] && self.grid[x+1][y]){ 
			neighbors.push(self.grid[x+1][y]);
		}
		if(self.grid[x][y-1] && self.grid[x][y-1]){ 
			neighbors.push(self.grid[x][y-1]);
		}
		if(self.grid[x][y+1] && self.grid[x][y+1]){ 
			neighbors.push(self.grid[x][y+1]);
		}
		return neighbors;
	}
	
	self.ManhattanDistance = function(object1, object2){
		var d1 = Math.abs(object2.x - object1.x);
		var d2 = Math.abs(object2.y - object1.y);
		return d1 + d2;
	}
	
	self.astarGridClean = function(){
		for(var i = 0; i < self.grid.length(); i++){
			for(var j = 0; j < self.grid[i].length(); j++){
				var currentNode = self.grid[i][j];
				currenNode.nodeParent = null;
				currentNode.f = 0;
				currentNode.g = 0;
				currentNode.h = 0;
			}
		}
	}
	
	self.astar = function(start, end){
		self.astarGridClean();
		var result = new Array();
		var openList = new Array();
		var closedList = new Array();
		var path;
		openList.push(start);
		
		while(openList.length > 0){
			var current = openList[0];
			for(var i = 0; i < openList.length; i++){
				if(openList[i].f < current.f){
					current = openList[i];
				}
			}
			if(current === end){
				path = closedList[closedList.push(current) - 1];
				do{ result.push([path.x, path.y]); }
				while(path = path.nodeParent);
				//return start to finish
				result.reverse();
			}
			else{
				openList.remove(current);
				closeList.push(current);
				//find nearby nodes
				var neighbors = self.neighbors(node);
				for(i = 0; i < neighbors.length; i++){
					var neighbor = neighbors[i];
					if(closeList.find(neighbor) || neighbor.isClosed()){
						continue;
					}
					
					var gScore = current.g + 1;
					var bestGScore = false;
					
					if(!openList.find(neighbor)){
							bestGScore = true;
							neighbor.j = self.ManhattanDistance(neighbor, end);
							openList.push(neighbor);
					}
					else if(gScore < neighbor.g){
						bestGScore = true;
					}
					if(bestGScore){
						neighbor.nodeParent = current;
						neighbor.g = gScore;
						neighbor.f = neighbor.g + neighbor.j;
					}
				}
			}
		
			
		}
		return result;
	}
		
}
