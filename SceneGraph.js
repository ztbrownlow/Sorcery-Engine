function flatten(arrays) {
  return arrays.reduce(function(a, b){ return a.concat(b); });
}

class SceneGraph {
  constructor(name, doUpdate=true, doDraw=true, clickable=true, updateDirection="forwards", drawDirection="backwards") {
    this.name = name;
    this.doUpdate = doUpdate;
    this.doDraw = doDraw;
    this.isClickable = clickable;
    this.children = new Array();
    this.updateDirection = updateDirection;
    this.drawDirection = drawDirection;
  }
  
  pointCollide(x, y, limitToClickable) {
    return forEachReturn(function(e){return (!limitToClickable || e.isClickable) && e.pointCollide(x, y)});
  }
  
  mouseDown(game, event, returnOnFirstSuccess = true) {
    if (isClickable) {
      if (returnOnFirstSuccess) {
        return this.forEachUntilFirstSuccess(function(e) {e.mouseDown(game, event);});
      } else {
        return this.forEach(function(e) {e.mouseDown(game, event);});
      }
    }
  }
  
  mouseUp(game, event, returnOnFirstSuccess = true) {
    if (isClickable) {
      if (returnOnFirstSuccess) {
        return this.forEachUntilFirstSuccess(function(e) {e.mouseUp(game, event);});
      } else {
        return this.forEach(function(e) {e.mouseUp(game, event);});
      }
    }
  }
  
  update(game) {
    if (doUpdate) {
      if (this.updateDirection == "backwards") {
        this.forEachReverse(function(e) {e.update(game);});
      } else {
        this.forEach(function(e) {e.update(game);});
      }
    }
  }
  draw(context) {
    if (doDraw) {
      if (this.drawDirection == "backwards") {
        this.forEachReverse(function(e) {e.draw(context);});
      } else {
        this.forEach(function(e) {e.draw(context);});
      }
    }
  }
  push(obj) {
    this.children.push(obj);
    return obj;
  }
  unshift(obj) {
    this.children.unshift(obj);
    return obj;
  }
  get length() {return this.children.length;}
  byName(name) {
    return this.children.filter(function(e) { return e.name == name; });
  }
  firstByName(name) {
    var temp = this.children.filter(function(e) { return e.name == name; });
    if (temp.length == 0) { //doesn't exist
      return null;
    } else {
      return temp[0]; //return first element with name
    }
  }
  lastByName(name) {
    var temp = this.filter(function(e) { return e.name == name; });
    if (temp.length == 0) { //doesn't exist
      return null;
    } else {
      return temp[temp.length - 1]; //return first element with name
    }
  }
  removeIndex(index) {
    var temp = this.children[index];
    this.children.splice(index, 1);
    return temp;
  }
  remove(e) {
    return this.removeIndex(this.indexOf(e));
  }
  indexOf(e) {
    return this.children.indexOf(e);
  }
  forEach(func) {
    this.children.forEach(func);
  }
  forEachUntilFirstSuccess(func) {
    for (var i = 0; i < this.length; ++i) {
      if (func(this.children[i], i, this.children)) {
        return this.children[i];
      }
    }
  }
  forEachReturn(func) {
    var output = new Array();
    for (var i = 0; i < this.length; ++i) {
      output.add(func(this.children[i], i, this.children));
    }
    return output;
  }
  forEachReverse(func) {
    for (var i = this.length - 1; i >= 0; --i) {
      func(this.children[i], i, this.children);
    }
  }
  forEachReverseUntilFirstSuccess(func) {
    for (var i = this.length - 1; i >= 0; --i) {
      if (func(this.children[i], i, this.children)) {
        return this.children[i];
      }
    }
  }
  forEachReverseReturn(func) {
    var output = new Array();
    for (var i = this.length - 1; i >= 0; --i) {
      output.add(func(this.children[i], i, this.children));
    }
    return output;
  }
  filter(func) {
    return this.children.filter(func);
  }
  moveToFront(index) {
    var temp = this.children[index];
    for (var i = index; i > 0; --i) {
      this.children[i] = this.children[i-1];
    }
    this.children[0] = temp;
  }
  moveToBack(index) {
    var temp = this.children[index];
    for (var i = index; i < this.length - 1; ++i) {
      this.children[i] = this.children[i+1];
    }
    this.children[length - 1] = temp;
  }
} 