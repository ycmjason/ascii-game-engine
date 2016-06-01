function Block(coordinate, z_index){
  /* required properties that the engine cares */
  this.coordinate = coordinate || [0, 0];
  this.z_index = z_index || 0;
  this.overflowStrategy = 'loopback';

  /* internal properties */
  this.representations = [' o\nooo', 'o\noo\no', 'ooo\n o', ' o\noo\n o'];
  this.state = 0;
}
/* methods that the engine cares */
Block.prototype.tick = function(currentTick){
  if(currentTick % 60 == 0) {
    this.coordinate[1] += 1;
  }
}
Block.prototype.toString = function(){
  return this.representations[this.state];
}
Block.prototype.onCollide = function(components){
   
}
Block.prototype.keydown = function(key){
  switch(key.name){
    case 'up':
      this.state = (this.state + 1) % 4
      break;
    case 'down':
      this.coordinate[1] += 1;
      break;
    case 'space':
      this.coordinate[1] = 48;
      break;
    case 'left':
      this.coordinate[0] -= 1;
      break;
    case 'right':
      this.coordinate[0] += 1;
      break;
  }
}
