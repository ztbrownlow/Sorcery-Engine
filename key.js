window.addEventListener('keyup', function(event) { if (!event.repeat) { Key.onKeyup(event); } }, false);
window.addEventListener('keydown', function(event) { if (!event.repeat) { Key.onKeydown(event); } }, false);


var Key = {
  _pressed: {},
  
  keyDownFuncs: [],
  keyUpFuncs: [],
  keyHeldFuncs: [],

  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  reset: function() {
    this._pressed = {};
  },
  
  KEY_UP: 0,
  KEY_DOWN: 1,
  KEY_HELD: 2,
  
  bind: function(key, keyDir, func) {
    if (keyDir == this.KEY_UP) {
      if (!this.keyUpFuncs[key]) {
        this.keyUpFuncs[key] = [func];
      } else {
        this.keyUpFuncs[key].push(func);
      }
    } else if (keyDir == this.KEY_DOWN) {
      if (!this.keyDownFuncs[key]) {
        this.keyDownFuncs[key] = [func];
      } else {
        this.keyDownFuncs[key].push(func);
      }
    } else if (keyDir == this.KEY_HELD) {
      var temp = this.keyHeldFuncs.filter(function(k) {return k.key == key});
      if (temp.length == 0) {
        this.keyHeldFuncs.push({key: key, funcs: [func]});
      } else {
        temp[0].funcs.push(func);
      }
    }
  },
  
  update: function() {
    for (var i = 0; i < this.keyHeldFuncs.length; ++i) {
      if (this.isDown(this.keyHeldFuncs[i].key)) {
        this.keyHeldFuncs[i].funcs.forEach(function(f) {f();})
      }
    }
  },
  
  onKeydown: function(event) {
    if (this.keyDownFuncs[event.keyCode]) {
      this.keyDownFuncs[event.keyCode].forEach(function(f) {f(event);});
    }
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    if (this.keyUpFuncs[event.keyCode]) {
      this.keyUpFuncs[event.keyCode].forEach(function(f) {f(event);});
    }
    delete this._pressed[event.keyCode];
  }
};

