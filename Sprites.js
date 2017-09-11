class Drawable {
  super(name) {
    this.name = name
  }
  draw(game, x, y) { }  
}

class Sprite extends Drawable {
  constructor(name, width, height, src) {
    super(name);
    this.image = new Image();
    this.width = width;
    this.height = height;
    this.src = src;
  }
  
  get src() { return this.image.src }
  set src(v) { this.image.src = v }
  get width() { return this.image.width }
  set width(v) { this.image.width = v }
  get height() { return this.image.height }
  set height(v) { this.image.height = v }
  draw(game, x, y) {
    game.context.drawImage(self.image, x, y, self.image.width, self.image.height);
  }
}

class FilledRect extends Drawable {
  constructor(name, width, height, fillStyle) {
    super(name);
    this.width = width;
    this.height = height;
    this.name = name;
    this.fillStyle = fillStyle;
  }
  draw(context, x, y) {
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
