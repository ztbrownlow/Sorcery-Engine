class Vector { 
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z ? z : 0;
  }
  
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  
  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  
  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  
  divide(scalar) {
    return this.multiply(1/scalar);
  }
  
  normalize() {
    return this.divide(this.magnitude)
  }
  
  magnitude() {
    return Math.hypot(this.x, this.y, this.z);
  }
}
