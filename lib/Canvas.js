AsciiGameEngine.Canvas = function($canvas, width, height){
  /** setup canvas **/
  // width and height specified in number of characters
  $canvas.css('width', width+'ch');
  $canvas.css('height', 'auto');

  // setup word break
  $canvas.css('white-space', 'pre');

  $canvas.attr('tabindex', 0);
  $canvas.css('outline', 'none');

  this.$canvas = $canvas;
  this.width = width;
  this.height = height;
  this.content = [];

  this.clearedContent = [];
  for(var i = 0; i < this.width * this.height; i++){
    this.clearedContent.push('&nbsp;');
  }
  this.clear();
}

AsciiGameEngine.Canvas.prototype.display = function(){
  var displayingContent = this.content.slice(0);
  for(var i = 0; i < this.height; i++){
    var indexToInsertNL = ((i+1) * this.width) + i;
    displayingContent.splice(indexToInsertNL, 0, '\n');
  }
  this.$canvas.html(displayingContent.join(''));
}

AsciiGameEngine.Canvas.prototype.draw = function(what, position){
  // top-left corner has position = [0, 0] (as a list)
  // ' ' will be skipped, use '&nbsp;' to print white spaces
  var mod = function(x, y){
    return ((x % y) + y) % y;
  };

  var groupWord = function(arr, word){
    // groupWord(['1', 'a', 'b', 'c'], 'abc') => ['1', 'abc']
    var newArr = [];
    for(var i = 0; i < arr.length; i++){
      if(arr.join('').substr(i, word.length) == word){
        newArr.push(word);
        i += word.length - 1;
      }else{
        newArr.push(arr[i]);
      }
    }
    return newArr;
  };

  what = what || '';
  position = position || [0, 0];
  var lines = what.split(/\n|\r|\r\n|\n\r/);

  lines.forEach((line, lineNumber) => {
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      // we skip ' ' and preserve previously draw stuff
      if(line[i] == ' ') continue;

      /* calculating index */
      var x = mod(position[0] + i, this.width);
      var y = mod((position[1] + lineNumber), this.height);
      var index = y * this.width + x;

      this.content[index] = line[i];
    }
  });

  this.display();
};

AsciiGameEngine.Canvas.prototype.write = function(what, position){
  // same as Canvas.draw, but will not skip ' '
  what = what.replace(/ /g, '&nbsp;');
  this.draw(what, position);
};

AsciiGameEngine.Canvas.prototype.clear = function(){
  this.content = this.clearedContent.slice(0);
}

AsciiGameEngine.Canvas.prototype.keyup = function(fn){
  this.$canvas.keyup(fn); 
}

AsciiGameEngine.Canvas.prototype.keydown = function(fn){
  this.$canvas.keydown(fn); 
}
