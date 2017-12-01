/**
  * A SceneGraph holds all of the objects in the game
  * @class
  * @namespace SceneGraph
  * @property {string} name - the name of the scenegraph
  * @property {boolean} doUpdate - the value of if this scenegraph should update. Default value is true.
  * @property {boolean} doDraw - the value of if objects in this scenegraph should be drawn. Default value is true.
  * @property {boolean} isClickable - the value of if the objects in the scenegraph should be clickable. Default value is true.
  * @property {array} children - the array that holds all the objects 
  * @property {string} updateDirection - the direction that the objects will update in. Defaults to "forwards". This value can only be either "forwards" or "backwards".
  * @property {string} drawDirection - the direction that the objects will be drawn. Defaults to "backwards". This value can only be either "forwards" or "backwards"
  * @property {boolean} isSceneGraph - returns true if the object is a scenegraph. Default true.
  */
function SceneGraph(name, doUpdate=true, doDraw=true, clickable=true, updateDirection="forwards", drawDirection="backwards") {
  var self = this;
  /** Creates the SceneGraph objects
    * @constructs SceneGraph
	*/
  self.constructor = function(name, doUpdate=true, doDraw=true, clickable=true, updateDirection="forwards", drawDirection="backwards") {
    self.name = name;
    self.doUpdate = doUpdate;
    self.doDraw = doDraw;
    self.isClickable = clickable;
    self.children = new Array();
    self.updateDirection = updateDirection;
    self.drawDirection = drawDirection;
    self.isSceneGraph = true;
    self._isAggregate = true;
  }
  /** Creates SceneGraph **/
  self.constructor(name, doUpdate, doDraw, clickable, updateDirection, drawDirection);
  
  /** 
    * @memberof SceneGraph
	* @param {int} x - the x value
	* @param {int} y - the y value
	*/
  self.pointCollide = function(x, y, limitToClickable) {
    return self.forEachReturn(function(e){if (!limitToClickable || e.isClickable) { var temp = e.pointCollide(x, y); if (temp) return e.isSceneGraph ? temp : e}});
  }
  
  /** Returns true if the SceneGraph is empty and contains no objects
    * @memberof SceneGraph
	*/
  self.isEmpty = function() {
    return (self.children.length == 0);
  }
  
  /**
    *
	*/
  self.mouseDown = function(game, event, returnOnFirstSuccess = true) {
    if (isClickable) {
      if (returnOnFirstSuccess) {
        return self.forEachUntilFirstSuccess(function(e) {e.mouseDown(game, event);});
      } else {
        return self.forEach(function(e) {e.mouseDown(game, event);});
      }
    }
  }
  
  /**
    *
	*/
  self.mouseUp = function(game, event, returnOnFirstSuccess = true) {
    if (isClickable) {
      if (returnOnFirstSuccess) {
        return self.forEachUntilFirstSuccess(function(e) {e.mouseUp(game, event);});
      } else {
        return self.forEach(function(e) {e.mouseUp(game, event);});
      }
    }
  }
  
  /**
    *
	*/
  self.update = function(game) {
    if (doUpdate) {
      if (self.updateDirection == "backwards") {
        self.forEachReverse(function(e) {e.update(game);});
      } else {
        self.forEach(function(e) {e.update(game);});
      }
    }
  }
  
  /**
    *
	*/
  self.updatePosition = function() {
    self.forEach(function(e) {e.updatePosition();});
  }
  
  /**
    *
	*/
  self.draw = function(context) {
    if (self.doDraw) {
      if (self.drawDirection == "backwards") {
        self.forEachReverse(function(e) {e.draw(context);});
      } else {
        self.forEach(function(e) {e.draw(context);});
      }
    }
  }
  
  /**
    *
	*/
  self.push = function(obj) {
    self.children.push(obj);
    return obj;
  }
  
  /**
    *
	*/
  self.pop = function() {
    return self.children.pop();
  }
  
  /**
    *
	*/
  self.unshift = function(obj) {
    self.children.unshift(obj);
    return obj;
  }
  
  /**
    *
	*/
  self.shift = function(obj) {
    return self.children.shift();
  }
  
  /**
    *
	*/
  self.first = function() {
    return self.children[0];
  }
  
  /**
    *
	*/
  self.last = function() {
    return self.children[self.children.length - 1];
  }
  
  /**
    *
	*/
  Object.defineProperties(self, {
    'length': { get: function() {return self.children.length;}},
  });
  
  /**
    *
	*/
  self.byName = function(name) {
    return self.children.filter(function(e) { return e.name == name; });
  }
  
  /**
    *
	*/
  self.firstByName = function(name) {
    var temp = self.children.filter(function(e) { return e.name == name; });
    if (temp.length == 0) { //doesn't exist
      return null;
    } else {
      return temp[0]; //return first element with name
    }
  }
  
  /**
    *
	*/
  self.lastByName = function(name) {
    var temp = self.filter(function(e) { return e.name == name; });
    if (temp.length == 0) { //doesn't exist
      return null;
    } else {
      return temp[temp.length - 1]; //return first element with name
    }
  }
  
  /**
    *
	*/
  self.removeIndex = function(index) {
    var temp = self.children[index];
    self.children.splice(index, 1);
    return temp;
  }
  
  /**
    *
	*/
  self.remove = function(e) {
    return self.removeIndex(self.indexOf(e));
  }
  
  /**
    *
	*/
  self.removeAll = function() {
    self.children.splice(0, self.children.length);
  }
  
  /**
    *
	*/
  self.indexOf = function(e) {
    return self.children.indexOf(e);
  }
  
  /**
    *
	*/
  self.forEach = function(func) {
    self.children.forEach(func);
  }
  
  /**
    *
	*/
  self.forEachUntilFirstSuccess = function(func, deepCheck = false) {
    for (var i = 0; i < self.length; ++i) {
      if (deepCheck && self.children[i]._isAggregate) {
        var temp = self.children[i].forEachUntilFirstSuccess(func, true);
        if (temp) {
          return temp;
        }
      }
      else if (func(self.children[i], i, self.children)) {
        return self.children[i];
      }
    }
    return false;
  }
  
  /**
    *
	*/
  self.forEachReturn = function(func) {
    var output = new Array();
    for (var i = 0; i < self.length; ++i) {
      output.push(func(self.children[i], i, self.children));
    }
    return output;
  }
  
  /**
    *
	*/
  self.forEachReverse = function(func) {
    for (var i = self.length - 1; i >= 0; --i) {
      func(self.children[i], i, self.children);
    }
  }
  
  /**
    *
	*/
  self.forEachReverseUntilFirstSuccess = function(func) {
    for (var i = self.length - 1; i >= 0; --i) {
      if (func(self.children[i], i, self.children)) {
        return self.children[i];
      }
    }
  }
  
  /**
    *
	*/
  self.forEachReverseReturn = function(func) {
    var output = new Array();
    for (var i = self.length - 1; i >= 0; --i) {
      output.push(func(self.children[i], i, self.children));
    }
    return output;
  }
  
  /**
    *
	*/
  self.filter = function(func) {
    return self.children.filter(func);
  }
  
  /**
    *
	*/
  self.moveToFront = function(index) {
    var temp = self.children[index];
    for (var i = index; i > 0; --i) {
      self.children[i] = self.children[i-1];
    }
    self.children[0] = temp;
  }
  
  /**
    *
	*/
  self.moveToBack = function(index) {
    var temp = self.children[index];
    for (var i = index; i < self.length - 1; ++i) {
      self.children[i] = self.children[i+1];
    }
    self.children[length - 1] = temp;
  }
} 