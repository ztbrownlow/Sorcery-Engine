function Vector(x, y, z=0) { 
  var self = this;
  self.constructor = function(x, y, z) {
    self.x = x;
    self.y = y;
    self.z = z ? z : 0;
  }
  
  self.constructor(x, y, z);
  
  self.add = function(other) {
    return new Vector(self.x + other.x, self.y + other.y, self.z + other.z);
  }
  
  self.subtract = function(other) {
    return new Vector(self.x - other.x, self.y - other.y, self.z - other.z);
  }
  
  self.dot = function(other) {
    return self.x * other.x + self.y * other.y + self.z * other.z;
  }
  
  self.multiply = function(scalar) {
    return new Vector(self.x * scalar, self.y * scalar, self.z * scalar);
  }
  
  self.divide = function(scalar) {
    return self.multiply(1/scalar);
  }
  
  self.normalize = function() {
    return self.divide(self.magnitude)
  }
  
  self.magnitude = function() {
    return Math.hypot(self.x, self.y, self.z);
  }
}
