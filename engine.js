function Game(canvas) {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouseX = 0;
    this.mouseY = 0;
    this.context = canvas.getContext('2d');
    this.timer = null;
    this.sprites = new SceneGraph("sprites");
    this.objects = new SceneGraph("objects");
    
    canvas.addEventListener("mousemove", this.mouseMove)
    canvas.addEventListener("mousedown", this.mouseDown)
    canvas.addEventListener("mouseup", this.mouseUp)
    canvas.addEventListener("mouseout", this.mouseOut);
  }
  
  getObjectsUnderMouse() {
    return flatten(this.objects.pointCollide(this.mouseX, this.mouseY, true));
  }
  
  mouseDown(e) {
    this.getObjectsUnderMouse()[0].mouseDown();
  }
  
  mouseUp(e) {
    this.getObjectsUnderMouse()[0].mouseUp();
  }
  
  mouseOut(e) {
    this.mouseUp(e);
  }
  
  mouseMove(e) {
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
  }
  
  update() {
    //this.handleMouseActions();
    this.objects.update(this);
  }
  
  draw() {
    this.objects.draw(this.context);
  }
  
  preDraw() {
    
  }
  postDraw() {
    
  }
  loop() {
    this.canvas.width = this.canvas.width;
    this.update();
    this.preDraw();
    this.draw();
    this.postDraw();
  }
  start(milliseconds) {
    this.timer = setInterval(this.loop, milliseconds);
  }
  stop() {
    clearInterval(this.timer);
  }
}
