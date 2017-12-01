/**
 * Enum for behavior of ObjectPool when the number of currently spawned objects exceeds the pool size
 * @readonly
 * @enum {Number}
 */
const POOL_BEHAVIOR_ON_OVERFLOW = { 
  /** The value for if the pool should just return null and not spawn any new objects */
  RETURN_NULL:0,
  /** The value for if the pool should spawn an object but not pool it */
  RETURN_NEW_AND_NOT_POOL:1,
  /** The value for if a pool should just expand its size to fit the new object being spawned */
  EXPAND_POOL:2 
}
/**
 * Enum for how objects are taken from the pool
 * @readonly
 * @enum {Number}
 */
const POOL_SELECTION = {
  /** Select the first unallocated pool object */
  FIRST:0,
  /** Select a random unallocated pool object */
  RANDOM:1
}

/**
 * Returns a new GameObject
 * @callback generatorCallback
 * @returns GameObject
 */

/**
 * Resets the properties of a GameObject to what they would be if it was a newly created object
 * @callback resetFuncCallback
 * @param {GameObject} obj object to reset
 */
 
/**
 * Destructor for a GameObject
 * @callback destroyFuncCallback
 * @param {GameObject} obj object to destroy
 */
 
/**
 * @typedef {Object} PooledInstance
 * @property {GameObject} object instance of object
 * @property {Boolean} isBeingUsed whether or not the pooled instance is currently allocated
 * @property {Array} cRef pointer to list of spawned objects in ObjectPool
 * @property {ObjectPool} object.pooledInstance pointer to ObjectPool that contains object
 */

/**
 * An object pool that handles pooling automatically. Useful for particle systems
 * @class ObjectPool
 * @extends SceneGraph
 * @param {String} name name of ObjectPool
 * @param {generatorCallback} generator 
 * @param {resetFuncCallback} resetFunc 
 * @param {?destroyFuncCallback} destroyFunc 
 * @param {Number} maxStore the maximum amount of objects that can be stored in the pool
 * @param {POOL_BEHAVIOR_ON_OVERFLOW} behaviorOnOverflow how the pool should react when too many objects are spawned
 * @param {POOL_SELECTION} [poolSelection=POOL_SELECTION.FIRST] how unallocated objects should be selected from the pool
 * @param {Boolean} [doUpdate=true] whether or not to update the objects in the pool
 * @param {Boolean} [doDraw=true] whether or not to draw the items in the pool
 * @param {Boolean} [clickable=false] Whether or not the items in the pool are clickable
 * @property {generatorCallback} objectConstructor the generator for new objects
 * @property {resetFuncCallback} resetFunc the function to apply to all spawned objects
 * @property {?destroyFuncCallback} destroyFunc the function to apply to all objects being destroyed, in case any cleanup is necessary
 * @property {Number} maxStore the maximum pool size
 * @property {Array} pooled the list of pooled objects, both allocated and unallocated
 * @property {Array} children the allocated objects in the pool (i.e. only spawned ones)
 * @property {POOL_SELECTION} select the selection method for allocation
 * @property {POOL_BEHAVIOR_ON_OVERFLOW} bof the pool behavior on overflow
 * @property {Boolean} _isAggregate=true true to indicate the object represents an aggregate of other objects
 */
var ObjectPool = function(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection=POOL_SELECTION.FIRST, doUpdate=true, doDraw=true, clickable=false) {
  var self = this;
  
  /**
   * constructor
   * @function ObjectPool#constructor
   * @param {String} name name of ObjectPool
   * @param {generatorCallback} generator 
   * @param {resetFuncCallback} resetFunc 
   * @param {?destroyFuncCallback} destroyFunc 
   * @param {Number} maxStore the maximum amount of objects that can be stored in the pool
   * @param {POOL_BEHAVIOR_ON_OVERFLOW} behaviorOnOverflow how the pool should react when too many objects are spawned
   * @param {POOL_SELECTION} [poolSelection=POOL_SELECTION.FIRST] how unallocated objects should be selected from the pool
   * @param {Boolean} [doUpdate=true] whether or not to update the objects in the pool
   * @param {Boolean} [doDraw=true] whether or not to draw the items in the pool
   * @param {Boolean} [clickable=false] Whether or not the items in the pool are clickable
   */
  self.constructor = function(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection, doUpdate=true, doDraw=true, clickable=false) {
    SceneGraph.call(self, name, doUpdate, doDraw, clickable);
    self.objectConstructor = generator;
    self.resetFunc = resetFunc;
    self.destroyFunc = destroyFunc;
    self.maxStore = maxStore;
    self.pooled = [];
    self.select = poolSelection;
    self.bof = behaviorOnOverflow;
    self._isAggregate = true;
  }

  /**
   * Returns new instance of pooled object
   * @function ObjectPool#newInstance
   * @return {PooledInstance} new instance of allocated object
   */
  self.newInstance = function() {
    var tmp = { object:self.objectConstructor(), isBeingUsed:true, cRef:self.children };
    tmp.object.pooledInstance = tmp;
    self.resetFunc(tmp.object);
    return tmp;
  }
  
  /**
   * Spawns a new object and adds it to the pool
   * @function ObjectPool#spawn
   * @returns {?PooledInstance} null if overflow and rules set to not allow overflow, else spawned object
   */
  self.spawn = function() {
    if (self.pooled.length < maxStore) {
      var obj = self.newInstance();
      self.pooled.push(obj);
      self.children.push(obj.object);
      return obj;
    }
    var available;
    if (self.select = POOL_SELECTION.FIRST) {
      available = self.pooled.find(function(e) {return !e.isBeingUsed;});
    } else {
      var l = self.pooled.filter(function(e) {return !e.isBeingUsed;});
      if (l.length == 0) {
        available = false;
      } else {
        available = l[Math.floor(Math.random() * l.length)];
      }
    }
    if (!available) {
      if (POOL_BEHAVIOR_ON_OVERFLOW.RETURN_NULL) {
        return null;
      } else if (POOL_BEHAVIOR_ON_OVERFLOW.RETURN_NEW_AND_NOT_POOL) {
        var obj = self.newInstance();
        self.children.push(obj.object);
        return obj;
      }
    }
    self.resetFunc(available.object);
    available.isBeingUsed = true;
    self.children.push(available.object);
    return available;
  }
  
  /**
   * Recycles a pooled instance from the pool
   * @param {PooledInstance} pooledObject thing to recycle
   * @function ObjectPool#recycle
   */
  self.recycle = function(pooledObject) {
    self.remove(pooledObject.object);
    if (self.destroyFunc) {
      self.destroyFunc(pooledObject.object);
    }
    pooledObject.isBeingUsed = false;
  }
  
  /**
   * Spawns multiple objects
   * @function ObjectPool#spawnSeveral
   * @param {Number} n how many objects to spawn
   * @returns {PooledInstance[]} list of spawned objects
   */
  self.spawnSeveral = function(n) {
    var out = [];
    for (var i = 0; i < n; ++i) {
      out.push(self.spawn());
    }
    return out;
  }

  self.constructor(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection, doUpdate, doDraw, clickable);
  
  /**
   * Recycles/removes an object
   * @function ObjectPool#remove
   * @param {GameObject} e object to remove
   * @returns {GameObject} removed object
   */
  self.remove = function(e) {
    var f = self.pooled.find(function(p) {p.object === e});
    if (f) {
      f.isBeingUsed = false;
    }
    if (self.destroyFunc) {
      self.destroyFunc(e);
    }
    return self.removeIndex(self.indexOf(e));
  }
  
  /**
   * Recycles all objects in pool
   * @function ObjectPool#removeAll
   */
  self.removeAll = function() {
    self.pooled.forEach(function(e) {e.isBeingUsed = false;});
    if (self.destroyFunc) {self.children.forEach(function(e) {self.destroyFunc(e)})};
    self.children.splice(0, self.children.length);
  }
}