function Node(x, y){
	var self = this;
	
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
	
	self.isOpen = function(){
		return self.walkable && (self.value == null);
	}
	
	self.isClosed = function(){
		return !self.walkable;
	}
	
	self.constructor(x,y);
}

function Grid(length, width){
	var self = this;
	
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
	
	self.moveNodeValue = function(x1, y1, x2, y2){
		var node1 = self.getNode(x1,y1);
		var node2 = self.getNode(x2,y2);
		node2.value = node1.value;
		node1.value = null;
	}
	
	self.changeNodeValue = function(x, y, value){
		self.grid[y][x].value = value;
	}
	
	self.getNodeValue = function(x, y){
		return self.grid[y][x].value;
	}
	
	self.changeNodeWalkable = function(x, y, walkable){
		self.grid[y][x].walkable = walkable;
	}
	
	self.getNode = function(x, y){
		return self.grid[y][x];
	}
	
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
	
	self.getWalkableNeighbors = function(x, y){
    return self.getNeighbors(self.getNode(x, y)).filter(function(n){return n.isOpen();});
	}
	
	self.ManhattanDistance = function(object1, object2){
		var d1 = Math.abs(object2.x - object1.x);
		var d2 = Math.abs(object2.y - object1.y);
		return d1 + d2;
	}
	
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
		/*
		while(openList.length > 0){
			var current = openList[0];
      var currentIndex = 0;
			for(var i = 0; i < openList.length; i++){
				if(openList[i].f < current.f){
					current = openList[i];
          currentIndex = 0;
				}
			}
      
			if(current === end){
        console.log("found end")
				path = closedList[closedList.push(current) - 1];
				do{ result.push([path.x, path.y]); }
				while(path = path.nodeParent);
				//return start to finish
				return result.reverse();
			}
			else
      {
				openList.splice(currentIndex,1); //remove current from openList
				//find nearby nodes
				var neighbors = self.getNeighbors(current);
				for(i = 0; i < neighbors.length; i++){
					var neighbor = neighbors[i];
					if(neighbor.isClosed()){
						continue;
					}
					
					var gScore = current.g + 1;
          var hScore = self.ManhattanDistance(neighbor, end);
          var fScore = gScore + hScore;
          
          if (neighbor.f < fScore && (closedList.includes(neighbor) || openList.includes(neighbor))) {
            continue;
          }
          
          neighbor.nodeParent = current;
          neighbor.h = hScore;
          neighbor.g = gScore;
          neighbor.f = fScore;
          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
				}
        closedList.push(current);
			}
    }
    return result;
    */
	}
		
}
