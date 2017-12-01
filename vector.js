/** A vector holds three integer values, x, y and z. By default if you want to use only x and y, z will be zero.
  * @class Vector
  * @property {Number} x x
  * @property {Number} y y
  * @property {Number} z z
  */
function Vector(x, y, z = 0) {
  var self = this;
  
  /** Creates the Vector object
    * @function Vector#constructor
    */
  self.constructor = function(x, y, z) {
    self.x = x;
    self.y = y;
    self.z = z ? z : 0;
  }
  
  /** Creates Vector */
  self.constructor(x, y, z);
  
  /** Adds two Vectors together
    * @function Vector#add
    * @param {Vector} other - the vector you want to add
    * @return {Vector} A new vector with the two vectors added
    */
  self.add = function(other) {
    return new Vector(self.x + other.x, self.y + other.y, self.z + other.z);
  }
  
  /** Subtracts two Vectors
    * @function Vector#subtract
    * @param {Vector} other - the vector you want to subtract
    * @return {Vector} A new vector with the two vectors subtracted 
    */
  self.subtract = function(other) {
    return new Vector(self.x - other.x, self.y - other.y, self.z - other.z);
  }
  
  /** Calculates the dot product between the two vectors
    * @function Vector.dot
    * @param {Vector} other - the vector to perform the dot product with 
    * @return {Number} the dot product between the two vectors
    */
  self.dot = function(other) {
    return self.x * other.x + self.y * other.y + self.z * other.z;
  }
  
  /** Multiplies a vector by a scalar
    * @function Vector.multiply
    * @param {Number} scalar - the value you want to multiply to the vector
    * @return {Vector} A new vector with the vector scaled by multiplication based on the number given
    */
  self.multiply = function(scalar) {
    return new Vector(self.x * scalar, self.y * scalar, self.z * scalar);
  }
  
  /** Divides a vector by a scalar
    * @function Vector.divide
    * @param {Number} scalar - the value you want to divide the vector by
    * @return {Vector} A new vector with the vector scaled by division based on the number given
    */
  self.divide = function(scalar) {
    return self.multiply(1/scalar);
  }
  
  /** Normalizes the vector by dividing it by it's own magnitude.
    * @function Vector.normalize
    * @return {Vector} A new vector of normalized vector
    */
  self.normalize = function() {
    return self.divide(self.magnitude())
  }
  
  /** Returns the magnitude of the vector
    * @function Vector.magnitude
    * @return {Number} The magnitude of the vector
    */
  self.magnitude = function() {
    return Math.hypot(self.x, self.y, self.z);
  }
}
