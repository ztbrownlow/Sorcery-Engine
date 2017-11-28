window.addEventListener('keyup', function(event) { if (!event.repeat) { Key.onKeyup(event); } }, false);
window.addEventListener('keydown', function(event) { if (!event.repeat) { Key.onKeydown(event); } }, false);

var Key = {
  _pressed: {},
  
  keyDownFuncs: [],
  keyUpFuncs: [],
  keyHeldFuncs: [],
  /**
   * Keycode for the spacebar
   * @memberof Key
   * @static
   */
  SPACE: 32,
  /**
   * Keycode for left arrow key
   * @memberof Key
   * @static
   */
  LEFT: 37,
  /**
   * Keycode for up arrow key
   * @memberof Key
   * @static
   */
  UP: 38,
  /**
   * Keycode for right arrow key
   * @memberof Key
   * @static
   */
  RIGHT: 39,
  /**
   * Keycode for down arrow key
   * @memberof Key
   * @static
   */
  DOWN: 40,
  /**
   * Keycode for w
   * @memberof Key
   * @static
   */
  W: 87,
  /**
   * Keycode for a
   * @memberof Key
   * @static
   */
  A: 65,
  /**
   * Keycode for s
   * @memberof Key
   * @static
   */
  S: 83,
  /**
   * Keycode for d
   * @memberof Key
   * @static
   */
  D: 68,
  /**
   * Signifies to bind an event to a key event no matter what key is pressed
   * @memberof Key
   * @static
   */
  ANY: -1,
  
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
      if (this.keyHeldFuncs[i].key == this.ANY || this.isDown(this.keyHeldFuncs[i].key)) {
        this.keyHeldFuncs[i].funcs.forEach(function(f) {f();})
      }
    }
  },
  
  onKeydown: function(event, activateAny=true) {
    if (this.keyDownFuncs[event.keyCode]) {
      this.keyDownFuncs[event.keyCode].forEach(function(f) {f(event);});
    }
    if (activateAny && this.keyDownFuncs[this.ANY]) {
      this.keyDownFuncs[this.ANY].forEach(function(f) {f(event);});
    }
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event, activateAny=true) {
    if (this.keyUpFuncs[event.keyCode]) {
      this.keyUpFuncs[event.keyCode].forEach(function(f) {f(event);});
    }
    if (activateAny && this.keyUpFuncs[this.ANY]) {
      this.keyUpFuncs[this.ANY].forEach(function(f) {f(event);});
    }
    delete this._pressed[event.keyCode];
  }
};

