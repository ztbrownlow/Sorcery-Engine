function SceneGraph(name, doUpdate = true, doDraw = true) {
  this.name = name;
  this.doUpdate = doUpdate;
  this.doDraw = doDraw;
  this.children = new Array();
}

SceneGraph.prototype.update = function() {
  if (this.doUpdate) {
    children.forEach(function(e) { e.update(); });
  }
}

SceneGraph.prototype.draw = function() {
  if (this.doDraw) {
    children.forEach(function(e) { e.draw(); });
  }
}

SceneGraph.prototype.push = function(obj) {
  this.children.push(obj);
  return obj;
}

SceneGraph.prototype.unshift = function(obj) {
  this.children.unshift(obj);
  return obj;
}

SceneGraph.prototype.ByName = function(name) {
  return this.children.filter(function(e) { return e.name == name; });
}

SceneGraph.prototype.FirstByName = function(name) {
  var temp = this.children.filter(function(e) { return e.name == name; });
  if (temp.length == 0) { //doesn't exist
    return null;
  } else {
    return temp[0]; //return first element with name
  }
}

SceneGraph.prototype.removeIndex = function(index) {
  var temp = this.children[index];
  this.children.splice(index, 1);
  return temp;
}