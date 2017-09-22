window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


var Key = {
  _pressed: {},
  
  keyDownFuncs: [],
  keyUpFuncs: [],

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
  
  onKeydown: function(event) {
    if (this.keyDownFuncs[event.keyCode]) {
      this.keyDownFuncs[event.keyCode](event);
    }
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    if (this.keyUpFuncs[event.keyCode]) {
      this.keyUpFuncs[event.keyCode](event);
    }
    delete this._pressed[event.keyCode];
  }
};

