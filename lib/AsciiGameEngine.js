function AsciiGameEngine(canvas){
  this.canvas = canvas; // an AsciiGameEngine.Canvas object representing the canvas for the game
  this.components = []; // components that is added to the engine
  this.mainLoop = 0;    // main loop's interval id, used to stop the main loop
  this.currentTick = 0; // current tick of the engine
  this.fps = 60;        // frame per second, i.e. number of main loops to iterate per second

  // track key interactions
  var notifyComponents = event => {
    return e => {
      e.preventDefault();
      var key = new AsciiGameEngine.Key(e);
      this.components.forEach(component => {
        if(component[event]) component[event](key);
      });
    };
  }
  this.canvas.keydown(notifyComponents('keydown'));
  this.canvas.keyup(notifyComponents('keyup'));
}

AsciiGameEngine.prototype.start = function(){
  // draw the components internally
  var drawComponents = () => {
    this.components.forEach((component) => {
      this.canvas.draw(component.toString(), component.coordinate, component.overflowStrategy);
    });
  };

  // check for collision
  var checkCollision = () => {
  };

  var main = () => {
    this.currentTick += 1;
    this.components.forEach(component => component.tick(this.currentTick));
    this.canvas.clear();
    checkCollision();
    drawComponents(); // this will draw the component internally
    this.canvas.display();
  };

  this.mainLoop = setInterval(main, (1/this.fps)*1000);
};

AsciiGameEngine.prototype.stop = function(){
  // stop the main loop of the game
  clearInterval(this.mainLoop);
};

AsciiGameEngine.prototype.addComponent = function(component){
  var i;
  if(this.components.indexOf(component) > -1) console.error('Adding existing component.');
  // insert component in order of z_index
  for(i = 0; i < this.components.length; i++){
    if(this.components[i].z_index > component.z_index) break;
  }
  this.components.splice(i, 0, component);
};

AsciiGameEngine.prototype.removeComponent = function(component){
  this.components = this.components.filter(c => c != component);
};

AsciiGameEngine.init = function(selector, width, height){
  var canvas = new AsciiGameEngine.Canvas($(selector), width, height);
  return new AsciiGameEngine(canvas);
}
