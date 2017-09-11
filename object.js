class GameObject {
  constructor(name, sprite, x, y, xOffset, yOffset) {
    this.name = name;
    this.sprite = sprite;
    this.pos = new Vector();
    this.x = x;
    this.y = y;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.isClicked = false;
    this.isDraggable = false;
    this.setSquareHitbox([0, 1], [0, 1]);
  }
  
  get x() {
    return this.pos.x;
  }
  
  get y() {
    return this.pos.y;
  }
  
  set x(val) {
    this.pos.x = val;
  }
  
  set y(val) {
    this.pos.y = val;
  }
  
  setSquareHitbox(xRange, yRange) {
    this.hitbox = {type: 'square', xRange: xRange, yRange: yRange, center: [(xRange[1]+xRange[0])/2, (yRange[1]+yRange[0])/2], halfWidth: (xRange[1]-xRange[0])/2, halfHeight: (yRange[1]-yRange[0])/2};
  }
  
  setCircleHitbox(center, radius) {
    this.hitbox = {type: 'circle', radius: radius, center: center};
  }
  
  get width() {return sprite.width}
  get height() {return sprite.height}
  get src() {return sprite.src}
  
  mouseDown(game, event) {
    this.isClicked = true;
  }
  
  mouseUp(game, event) {
    this.isClicked = false;
  }
  
  update(game) {
    if (isDraggable && isClicked) {
      this.x = game.mouseX;
      this.y = game.mouseY;
    }
  }
  
  draw(context) {
    if (this.sprite) {
      this.sprite.draw(game, this.x - xOffset, this.y - yOffset);
      return true;
    }
    return false;
  }
  
  pointCollide(x, y) {
    var pos = new Vector(x, y);
    if (this.hitbox == 'square') {
      var minX = x - xOffset + this.hitbox.xRange[0] * this.width;
      var maxX = x - xOffset + this.hitbox.xRange[1] * this.width;
      var minY = y - xOffset + this.hitbox.yRange[0] * this.height;
      var maxY = y - xOffset + this.hitbox.yRange[1] * this.height;
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    } else if (this.hitbox == 'circle') {
      return pos.subtract(this.hitbox.center).magnitude() < this.hitbox.radius;
    } 
    return false;
  }
  
  checkForObjectCollide(other) {
    if (this.hitbox == 'square') {
      var minX = x - xOffset + this.hitbox.xRange[0] * this.width;
      var maxX = x - xOffset + this.hitbox.xRange[1] * this.width;
      var minY = y - yOffset + this.hitbox.yRange[0] * this.height;
      var maxY = y - yOffset + this.hitbox.yRange[1] * this.height;
      if (other.hitbox == 'square') {
        var otherMinX = x - xOffset + other.hitbox.xRange[0] * other.width;
        var otherMaxX = x - xOffset + other.hitbox.xRange[1] * other.width;
        var otherMinY = y - xOffset + other.hitbox.yRange[0] * other.height;
        var otherMaxY = y - xOffset + other.hitbox.yRange[1] * other.height;
        return minX < otherMaxX && maxX > otherMinX && minY < otherMaxY && maxY > otherMinY
      } else if (other.hitbox == 'circle') {
        var centerX = x - xOffset + this.hitbox.center[0] * this.width;
        var centerY = y - yOffset + this.hitbox.center[1] * this.height;
        var diffCentX = Math.abs(other.center.x - centerX);
        var diffCentY = Math.abs(other.center.y - centerY);
        if (diffCentX >= this.hitbox.halfWidth + other.hitbox.radius || diffCentY >= this.hitbox.halfHeight + other.hitbox.radius) {
          return false;
        }
        if (diffCentX < this.hitbox.halfWidth || diffCentY < this.hitbox.halfHeight) {
          return true;
        }
        return Math.hypot(diffCentX - this.hitbox.halfWidth, diffCentY - this.hitbox.halfHeight) < other.hitbox.radius;
      }
    } else if (this.hitbox == 'circle') {
      if (other.hitbox == 'square') {
        return other.objectCollide(this);
      } else if (other.hitbox == 'circle') {
        return other.hitbox.center.subtract(this.hitbox.center).magnitude() < this.hitbox.radius + other.hitbox.radius
      }
    }
    return false;
  }
  
  canCollideWith(other) {
    return false;
  }
  
  collideWith(other) {
    
  }
  
  tryCollide(other) {
    if (checkForObjectCollide(other) && canCollideWith(other)) {
      return collideWith(other);
    }
    return false;
  }
}
