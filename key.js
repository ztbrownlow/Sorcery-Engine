/** Sets up keyup listener */
window.addEventListener('keyup', function(event) { if (!event.repeat) { Key.onKeyup(event); } }, false);
/** Sets up keydown listener */
window.addEventListener('keydown', function(event) { if (!event.repeat) { Key.onKeydown(event); } }, false);

/**
 * Static class that handles key events
 * @static
 * @namespace Key
 */
var Key = {
  /**
   * what keys are currently pressed
   * @memberof Key
   * @ignore
   */
  _pressed: {},
  
  /**
   * data structure to hold functions that run on keydown
   * @ignore
   * @memberof Key
   */
  keyDownFuncs: [],
  /**
   * data structure to hold functions that run on keyup
   * @ignore
   * @memberof Key
   */
  keyUpFuncs: [],
  /**
   * data structure to hold functions that run while a key is held
   * @ignore
   * @memberof Key
   */
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
  
  /**
   * Checks if a key is currently pressed
   * @return true if key is pressed
   * @param {Number} keyCode the key to check
   * @static
   */
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  /**
   * Resets what keys are currently pressed
   * @memberof Key
   */
  reset: function() {
    this._pressed = {};
  },
  
  /**
   * Code for binding event to key up
   * @memberof Key
   * @static
   */
  KEY_UP: 0,
  /**
   * Code for binding event to key down
   * @memberof Key
   * @static
   */
  KEY_DOWN: 1,
  /**
   * Code for binding event to key held
   * @memberof Key
   * @static
   */
  KEY_HELD: 2,
  
  /**
   * Binds a function to a key
   * @param {Number} key the key to bind to
   * @param {Number} keyDir Key.KEY_UP, Key.KEY_DOWN, or Key.KEY_HELD
   * @param {function} func the function to bind
   * @memberof Key
   */
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
  
  /**
   * The update function, called from the game update
   * @memberof Key
   */
  update: function() {
    for (var i = 0; i < this.keyHeldFuncs.length; ++i) {
      if (this.keyHeldFuncs[i].key == this.ANY || this.isDown(this.keyHeldFuncs[i].key)) {
        this.keyHeldFuncs[i].funcs.forEach(function(f) {f();})
      }
    }
  },
  
  /**
   * function that is called on keydown event
   * @ignore
   */
  onKeydown: function(event, activateAny=true) {
    if (this.keyDownFuncs[event.keyCode]) {
      this.keyDownFuncs[event.keyCode].forEach(function(f) {f(event);});
    }
    if (activateAny && this.keyDownFuncs[this.ANY]) {
      this.keyDownFuncs[this.ANY].forEach(function(f) {f(event);});
    }
    this._pressed[event.keyCode] = true;
  },
  
  /**
   * function that is called on keyup event
   * @ignore
   */
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

