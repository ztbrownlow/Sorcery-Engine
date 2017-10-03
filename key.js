window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


var Key = {
  _pressed: {},
  
  keyDownFuncs: [],
  keyUpFuncs: [],

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
  
  KEY_UP: 0,
  KEY_DOWN: 1,
  
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

