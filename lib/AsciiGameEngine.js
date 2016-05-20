function AsciiGameEngine(canvas){
  this.canvas = canvas;
  this.components = [];
  this.mainLoop = 0;
  this.currentTick = 0;
  this.fps = 60;

  // track key interactions
  this.downedKeys = [];
  this.canvas.keydown(e => {
    if(this.downedKeys.filter(key => key.keyCode == e.keyCode).length <= 0){
      this.downedKeys.push({keyCode: e.keyCode});
    }
  });
  this.canvas.keyup(e => {
    this.downedKeys = this.downedKeys.filter(key => key.keyCode != e.keyCode);
  });
  // lists of registered keyboard events
  this.keyEvents = [];
}

AsciiGameEngine.prototype.start = function(){
  // start the main loop of the game
  var drawComponents = () => {
    this.components.forEach((component) => {
      this.canvas.draw(component.toString(), component.position);
    });
  };

  var main = () => {
    this.currentTick += 1;
    this.components.forEach(component => component.tick(this.currentTick));
    this.canvas.clear();
    drawComponents();
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
  for(i = 0; i < this.components.length; i++){
    if(this.components[i].z_index > component.z_index) break;
  }
  this.components.splice(i, 0, component);
};

AsciiGameEngine.prototype.removeComponent = function(component){
  this.components = this.components.filter(c => c != component);
};

AsciiGameEngine.prototype.on = function(event, callback){
  
};

AsciiGameEngine.init = function(selector, width, height){
  var canvas = new Canvas($(selector), width, height);
  return new AsciiGameEngine(canvas);
}
