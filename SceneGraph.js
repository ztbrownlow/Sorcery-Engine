function SceneGraph(name, doUpdate = true, doDraw = true) {
  var self = this;
  this.name = name;
  this.doUpdate = doUpdate;
  this.doDraw = doDraw;
  this.children = new Array();
  this.update = function(game) {
    if (self.doUpdate) {
      self.children.forEach(function(e) { e.update(game); });
    }
  }

  this.draw = function(game) {
    if (self.doDraw) {
      for (var i = self.children.length - 1; i >= 0; --i) {
        self.children[i].draw(game);
      }
    }
  }

  this.push = function(obj) {
    self.children.push(obj);
    return obj;
  }

  this.unshift = function(obj) {
    self.children.unshift(obj);
    return obj;
  }

  this.ByName = function(name) {
    return self.children.filter(function(e) { return e.name == name; });
  }

  this.FirstByName = function(name) {
    var temp = self.children.filter(function(e) { return e.name == name; });
    if (temp.length == 0) { //doesn't exist
      return null;
    } else {
      return temp[0]; //return first element with name
    }
  }

  this.removeIndex = function(index) {
    var temp = self.children[index];
    self.children.splice(index, 1);
    return temp;
  }
  
  this.remove = function(e) {
    return self.removeIndex(self.indexOf(e));
  }
  
  this.indexOf = function(e) {
    return self.children.indexOf(e);
  }
  
  this.moveToFront = function(index) {
    var temp = self.children[index];
    for (var i = index; i > 0; --i) {
      self.children[i] = self.children[i-1];
    }
    self.children[0] = temp;
  }
}