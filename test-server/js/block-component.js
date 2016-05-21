function Block(startingPosition){
  this.representations = [' o\nooo', 'o\noo\no', 'ooo\n o', ' o\noo\n o'];
  this.state = 0;
  this.position = startingPosition || [0, 0];
  this.z_index = 0;
}
Block.prototype.tick = function(currentTick){
  if(currentTick % 60 == 0) {
    this.position[1] += 1;
  }
}
Block.prototype.toString = function(){
  return this.representations[this.state];
}
Block.prototype.keydown = function(key){
  switch(key.name){
    case 'up':
      this.state = (this.state + 1) % 4
      break;
    case 'down':
      this.position[1] += 1;
      break;
    case 'space':
      this.position[1] = 48;
      break;
    case 'left':
      this.position[0] -= 1;
      break;
    case 'right':
      this.position[0] += 1;
      break;
  }
}
