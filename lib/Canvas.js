AsciiGameEngine.Canvas = function($canvas, width, height){
  $canvas.css('width', width+'ch');
  // setup word break
  $canvas.css('white-space', 'pre');

  $canvas.attr('tabindex', 0);
  $canvas.css('outline', 'none');

  this.$canvas = $canvas;
  this.width = width;
  this.height = height;
  this.content = [];

  // create an empty content
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

AsciiGameEngine.Canvas.prototype.draw = function(what, position, overflowStrategy){
  // top-left corner has position = [0, 0] (as a list)
  // ' ' will be skipped, use '&nbsp;' to print white spaces
  overflowStrategy = AsciiGameEngine.Canvas.overflowStrategies[overflowStrategy || 'hidden'];

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
  var usedPositions = [];

  lines.forEach((line, lineNumber) => {
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      // we skip ' ' and preserve previously draw stuff
      if(line[i] == ' ') continue;

      /* calculating actual positions depending on overflow strategy */
      var actualpos = overflowStrategy([position[0] + i, position[1] + lineNumber]);
      usedPositions.push(actualpos);

      if(actualpos[0] >= 0 && actualpos[1] >= 0){
        var index = actualpos[1] * this.width + actualpos[0];
        this.content[index] = line[i];
      }
    }
  });

  return usedPositions;
};

AsciiGameEngine.Canvas.prototype.write = function(what, position, overflowStrategy){
  // same as Canvas.draw, but will not skip ' '
  what = what.replace(/ /g, '&nbsp;');
  return this.draw(what, position, overflowStrategy);
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

AsciiGameEngine.Canvas.overflowStrategies = {
  'loopback': (position) => {
    var mod = (x, y) => ((x % y) + y) % y;
    var x = mod(position[0], this.width);
    var y = mod(position[1], this.height);
    return [x, y];
  },
  'hidden': (position) => {
    var x = (position[0] < this.width)? position[0]: -1;
    var y = (position[1] < this.height)? position[1]: -1;
    return [x, y];
  },
  'bounded': (position) => {
    var x = position[0];
    var y = position[1];

    if(x >= this.width) x = this.width - 1;
    if(x < 0) x = 0;

    if(y >= this.height) y = this.height - 1;
    if(y < 0) y = 0;

    return [x, y];
  }
};
