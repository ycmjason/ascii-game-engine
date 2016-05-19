function Block(){
  this.representations = [' o\nooo', 'o\noo\no', 'ooo\n o', ' o\noo\n o'];
  this.state = 0;
  this.position = [0, 0];
}
Block.prototype.tick = function(currentTick){
  if(currentTick % 60 == 0) {
    this.position[1] += 1;
  }
}
Block.prototype.toString = function(){
  return this.representations[this.state];
}
