function Drawable(name) {
  var self = this;
  
  self.constructor = function(name) {
    self.name = name
  }
  self.draw = function(context, x, y) { }  
}

function Sprite(name, width, height, src) {
  var self = this;
  self.constructor = function(name, width, height, src) {
    Drawable.call(self, name);
    self.image = new Image();
    self.image.width = width;
    self.image.height = height;
    self.image.src = src;
  }
  self.constructor(name, width, height, src);
  
  Object.defineProperties(self, {
    'src': { get: function() { return self.image.src }, set: function(v) { self.image.src = v } },
    'width': { get: function() { return self.image.width }, set: function(v) { self.image.width = v } },
    'height': { get: function() { return self.image.height }, set: function(v) { self.image.height = v } }
  });
  
  self.draw = function(context, x, y) {
    context.drawImage(self.image, x, y, self.image.width, self.image.height);
  }
}

function FilledRect(name, width, height, fillStyle) {
  var self = this;
  self.constructor = function(name, width, height, fillStyle) {
    Drawable.call(self, name);
    self.width = width;
    self.height = height;
    self.name = name;
    self.fillStyle = fillStyle;
  }
  self.constructor(name, width, height, fillStyle);
  self.draw = function(context, x, y) {
    var saveContext = false;
    if (context.fillStyle == self.fillStyle) {
      saveContext = true;
      context.save();
    }
    context.fillStyle = self.fillStyle;
    context.fillRect(x, y, self.width, self.height);
    if (saveContext) {
      context.restore();
    }
  }
}
