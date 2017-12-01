const POOL_BEHAVIOR_ON_OVERFLOW = { RETURN_NULL:0, RETURN_NEW_AND_NOT_POOL:1, EXPAND_POOL:2 }
const POOL_SELECTION = { FIRST:0, RANDOM:1 }

var ObjectPool = function(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection, doUpdate=true, doDraw=true, clickable=false) {
  var self = this;
  
  self.constructor = function(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection, doUpdate=true, doDraw=true, clickable=false) {
    SceneGraph.call(self, name, doUpdate, doDraw, clickable);
    self.objectConstructor = generator;
    self.resetFunc = resetFunc;
    self.destroyFunc = destroyFunc;
    self.maxStore = maxStore;
    self.pooled = [];
    self.select = poolSelection;
    self.bof = behaviorOnOverflow;
  }
  
  self.newInstance = function() {
    var tmp = { object:self.objectConstructor(), isBeingUsed:true, cRef:self.children };
    tmp.object.pooledInstance = tmp;
    self.resetFunc(tmp.object);
    return tmp;
  }
  
  self.getObjectAndAddToPool = function() {
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
  
  self.recycle = function(pooledObject) {
    self.remove(pooledObject.object);
    if (self.destroyFunc) {
      self.destroyFunc(pooledObject.object);
    }
    pooledObject.isBeingUsed = false;
  }
  
  self.spawnSeveral = function(n) {
    var out = [];
    for (var i = 0; i < n; ++i) {
      out.push(self.getObjectAndAddToPool());
    }
    return out;
  }

  self.recycleAll = function() {
    self.pooled.forEach(function(e) {e.isBeingUsed = false;});
    if (self.destroyFunc) {self.children.forEach(function(e) {self.destroyFunc(e)})};
    self.removeAll();
  }
  
  self.constructor(name, generator, resetFunc, destroyFunc, maxStore, behaviorOnOverflow, poolSelection, doUpdate, doDraw, clickable);
}