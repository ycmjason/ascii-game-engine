AsciiGameEngine.Key = function(event){
  var keyCode = event.keyCode;
  var shifted = event.shiftKey;

  /* find meaningful names of the keycode */
  if(65 <= keyCode && keyCode <= 90){ // character
    if(shifted){
      // capital letter
      this.name = String.fromCharCode(keyCode);
    }else{
      this.name = String.fromCharCode(keyCode + 32);
    }
  }else if(48 <= keyCode && keyCode <= 57){
    this.name = keyCode - 48 + '';
  }else{
    var keynameLookup = {
      13: 'enter',
      16: 'shift',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    this.name = keynameLookup[keyCode];
  }

  this.event = event;
}
