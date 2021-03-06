/**
  * A SceneGraph holds all of the objects in the game
  * @class SceneGraph
  * @param {String} name the name of the SceneGraph
  * @param {Boolean} [doUpdate=true] whether or not the scene graph should perform updates
  * @param {Boolean} [doDraw=true] whether or not the scene graph should do draw calls
  * @param {Boolean} [clickable=true] whether or not the objects in this scene graph are clickable
  * @param {String} [updateDirection="forwards"] which direction to parse tree in when updating. "forwards" or "backwards"
  * @param {String} [drawDirection="backwards"] which direction to parse tree in when drawing. "forwards" or "backwards"
  * @property {String} name - the name of the SceneGraph
  * @property {Boolean} doUpdate - the value of if this SceneGraph should update.
  * @property {Boolean} doDraw - the value of if objects in this SceneGraph should be drawn.
  * @property {Boolean} isClickable - the value of if the objects in the SceneGraph should be clickable.
  * @property {Array} children - the array that holds all the objects 
  * @property {String} updateDirection - the direction that the tree will be navigated to update objects. This value can only be either "forwards" or "backwards".
  * @property {String} drawDirection - the direction that the tree will be navigated to draw objects. This value can only be either "forwards" or "backwards"
  * @property {Boolean} isSceneGraph=true - true to indicate the object is a SceneGraph
  * @property {Boolean} _isAggregate=true - true to indicate the object represents an aggregate of other objects
  */
function SceneGraph(name, doUpdate=true, doDraw=true, clickable=true, updateDirection="forwards", drawDirection="backwards") {
  var self = this;
  /** Creates the SceneGraph objects
    * @function SceneGraph#constructor
    * @param {String} name the name of the SceneGraph
    * @param {Boolean} [doUpdate=true] whether or not the scene graph should perform updates
    * @param {Boolean} [doDraw=true] whether or not the scene graph should do draw calls
    * @param {Boolean} [clickable=true] whether or not the objects in this scene graph are clickable
    * @param {String} [updateDirection="forwards"] which direction to parse tree in when updating. "forwards" or "backwards"
    * @param {String} [drawDirection="backwards"] which direction to parse tree in when drawing. "forwards" or "backwards"
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
    * Checks for collisions at a certain point with objects contained in the scene graph. Will search through any SceneGraphs that are a child of this one as well.
    * Please see the example for how output is handled. You may want to run output through {@link flatten}
    * @function SceneGraph#pointCollide
    * @param {Number} x - the x value to check
    * @param {Number} y - the y value to check
    * @param {Boolean} limitToClickable - whether or not to limit the search to clickable objects only
    * @return {Array} n-dimensional list of which objects collide. 
    * @example
    * // sg is an already initalized SceneGraph
    * // sg array representation == [objectA, objectB, [objectC, [objectD, objectE]]] (where inner arrays are other SceneGraphs)
    * // Assume objectA and objectC don't collide at (0, 0), but the others do
    * console.log(sg.pointCollide(0,0,false)); // [undefined, objectB, [undefined, [objectD, objectE]]]
    * console.log(flatten(sg.pointCollide(0,0,false))); // [objectB, objectD, objectE]
    */
  self.pointCollide = function(x, y, limitToClickable) {
    return self.forEachReturn(function(e){if (!limitToClickable || e.isClickable) { var temp = e.pointCollide(x, y); if (temp) return e.isSceneGraph ? temp : e}});
  }
  
  /** Returns true if the SceneGraph is empty and contains no objects
    * @function SceneGraph#isEmpty
    * @returns true if SceneGraph is empty
    */
  self.isEmpty = function() {
    return (self.children.length == 0);
  }
  
  /**
    * handles mouseDown by passing event along to children if clickable
    * @function SceneGraph#mouseDown
    * @param {Game} game instance of the game
    * @param {MouseEvent} event instance of the mouse event
    * @param {Boolean} [returnOnFirstSuccess=true] whether or not to stop once we've found one object that is clicked
    * @returns {object|object[]} output of mouseDown. Will likely be undefined
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
    * handles mouseUp by passing event along to children if clickable
    * @function SceneGraph#mouseUp
    * @param {Game} game instance of the game
    * @param {MouseEvent} event instance of the mouse event
    * @param {Boolean} [returnOnFirstSuccess=true] whether or not to stop once we've found one object that is clicked
    * @returns {object|object[]} output of mouseDown. Will likely be undefined
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
    * Handles updates by updating children
    * @function SceneGraph#update
    * @param {Game} game instance of game
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
    * Handles updates of positions by updating positions of children (new positions are stored and then updated after all other update stuff, e.g. collisions, is handled)
    * @function SceneGraph#updatePosition
    */
  self.updatePosition = function() {
    self.forEach(function(e) {e.updatePosition();});
  }
  
  /**
    * Handles draws by drawing children
    * @function SceneGraph#draw
    * @param {RenderingContext} context context to draw on
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
    * pushes a new object onto the SceneGraph
    * @function SceneGraph#push
    * @param {object} object to add
    * @returns {object} added object
    */
  self.push = function(obj) {
    self.children.push(obj);
    return obj;
  }
  
  /**
    * pops a new object from the SceneGraph
    * @function SceneGraph#pop
    * @returns {object} popped object
    */
  self.pop = function() {
    return self.children.pop();
  }
  
  /**
    * unshifts a new object to the SceneGraph (adds to start)
    * @function SceneGraph#unshift
    * @param {object} object to add
    * @returns {object} added object
    */
  self.unshift = function(obj) {
    self.children.unshift(obj);
    return obj;
  }
  
  /**
    * shifts a new object from the SceneGraph (removes from start)
    * @function SceneGraph#shift
    * @returns {object} unshifted object
    */
  self.shift = function() {
    return self.children.shift();
  }
  
  /**
    * Gets the first object in the SceneGraph
    * @function SceneGraph#first
    * @returns {object} first object
    */
  self.first = function() {
    return self.children[0];
  }
  
  /**
    * Gets the last object in the SceneGraph
    * @function SceneGraph#last
    * @returns {object} last object
    */
  self.last = function() {
    return self.children[self.children.length - 1];
  }
  
  Object.defineProperties(self, {
    /**
      * @memberof SceneGraph
      * @instance
      * @readonly
      * @property {Number} length length of SceneGraph
      */
    'length': { get: function() {return self.children.length;}},
  });

  /**
   * Gets all elements in a SceneGraph with a certain name
   * @function SceneGraph#byName
   * @param {String} name name to search for
   * @returns {Array} all children with name
   */
  self.byName = function(name) {
    return self.children.filter(function(e) { return e.name == name; });
  }
  
  /**
   * Gets first element in a SceneGraph with a certain name
   * @function SceneGraph#firstByName
   * @param {String} name name to search for
   * @returns {object} first child with name
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
   * Gets last element in a SceneGraph with a certain name
   * @function SceneGraph#lastByName
   * @param {String} name name to search for
   * @returns {object} last child with name
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
    * removes the object at a certain index into the scene graph
    * @function SceneGraph#removeIndex
    * @param {Number} index the index to remove
    * @returns {object} the removed object
    */
  self.removeIndex = function(index) {
    var temp = self.children[index];
    self.children.splice(index, 1);
    return temp;
  }
  
  /**
    * removes the given object from the scene graph
    * @function SceneGraph#removeIndex
    * @param {object} e the object to remove
    * @returns {object} the removed object
    */
  self.remove = function(e) {
    return self.removeIndex(self.indexOf(e));
  }
  
  /**
    * removes all objects from the scene graph
    * @function SceneGraph#removeAll
    */
  self.removeAll = function() {
    self.children.splice(0, self.children.length);
  }
  
  /**
    * finds the index of an object in the scene graph
    * @function SceneGraph#indexOf
    * @returns {Number} the index of the object, -1 if not found
    * @param {object} e the object to find
    */
  self.indexOf = function(e) {
    return self.children.indexOf(e);
  }
  
  /**
    * Runs a foreach query on the scene graph. Proxy for SceneGraph.children.forEach(func)
    * @function SceneGraph#forEach
    * @param {function} func the function to run
    */
  self.forEach = function(func) {
    self.children.forEach(func);
  }
  
  /**
    * Runs a foreach query on the scene graph until a child returns true.
    * @function SceneGraph#forEachUntilFirstSuccess
    * @param {function} func the function to run
    * @param {Boolean} [deepCheck=false] if true, will expand all child scene graphs when running query
    * @return {Boolean|object} object which returned true; if no objects return true, returns false
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
    * Runs a foreach query on the scene graph and returns the results.
    * @function SceneGraph#forEachReturn
    * @param {function} func the function to run
    * @returns {object[]} outputs of forEach
    */
  self.forEachReturn = function(func) {
    var output = new Array();
    for (var i = 0; i < self.length; ++i) {
      output.push(func(self.children[i], i, self.children));
    }
    return output;
  }
  
  /**
    * Runs a foreach query on the scene graph in reverse.
    * @function SceneGraph#forEachReverse
    * @see SceneGraph#forEach
    * @param {function} func the function to run
    */
  self.forEachReverse = function(func) {
    for (var i = self.length - 1; i >= 0; --i) {
      func(self.children[i], i, self.children);
    }
  }
  
  /**
    * Runs a foreach query on the scene graph in reverse until a child returns true.
    * @function SceneGraph#forEachReverseUntilFirstSuccess
    * @see SceneGraph#forEachUntilFirstSuccess
    * @param {function} func the function to run
    * @param {Boolean} [deepCheck=false] if true, will expand all child scene graphs when running query
    * @return {Boolean|object} object which returned true
    */
  self.forEachReverseUntilFirstSuccess = function(func) {
    for (var i = self.length - 1; i >= 0; --i) {
      if (func(self.children[i], i, self.children)) {
        return self.children[i];
      }
    }
  }
  
  /**
    * Runs a foreach query on the scene graph in reverse and returns the results.
    * @function SceneGraph#forEachReverseReturn
    * @see SceneGraph#forEachReturn
    * @param {function} func the function to run
    * @returns {object[]} outputs of forEach
    */
  self.forEachReverseReturn = function(func) {
    var output = new Array();
    for (var i = self.length - 1; i >= 0; --i) {
      output.push(func(self.children[i], i, self.children));
    }
    return output;
  }
  
  /**
    * Filters the SceneGraph. Proxy for SceneGraph.children.filter
    * @function SceneGraph#filter
    * @param {function} func filter to use
    * @returns {Array} filtered data
    */
  self.filter = function(func) {
    return self.children.filter(func);
  }
  
  /**
    * Moves an object to the front of the SceneGraph
    * @param {Number} index index to move
    * @function SceneGraph#moveToFront
    */
  self.moveToFront = function(index) {
    var temp = self.children[index];
    for (var i = index; i > 0; --i) {
      self.children[i] = self.children[i-1];
    }
    self.children[0] = temp;
  }
  
  /**
    * Moves an object to the back of the SceneGraph
    * @param {Number} index index to move
    * @function SceneGraph#moveToBack
    */
  self.moveToBack = function(index) {
    var temp = self.children[index];
    for (var i = index; i < self.length - 1; ++i) {
      self.children[i] = self.children[i+1];
    }
    self.children[length - 1] = temp;
  }
} 