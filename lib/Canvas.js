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

/* what            : the string representation of the thing
 * coordinate      : the coordinate that the upper-left corner of 'what'
 * pos             : the position of 'what' to be translated to the canvas coordinate
 * overflowStrategy: the overflow strategy to be used
 * e.g.
 * pos2coord('o\nooo', [1, 1], [0, 0]) => [1, 1]
 *     this is because [0, 0] of what is at [1, 1] of the canvas. */
AsciiGameEngine.Canvas.prototype.pos2coord = function(what, coordinate, pos, overflowStrategy){
  // top-left corner has coordinate = [0, 0] (as a list)
  // ' ' will be skipped, use '&nbsp;' to print white spaces
  overflowStrategy = this.overflowStrategies(overflowStrategy);

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
  coordinate = coordinate || [0, 0];
  var lines = what.split(/\n|\r|\r\n|\n\r/);

  lines.forEach((line, lineNumber) => {
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      // we skip ' ' and preserve previously draw stuff
      if(line[i] == ' ') continue;

      /* calculating actual coordinates depending on overflow strategy */
      var actualpos = overflowStrategy([coordinate[0] + i, coordinate[1] + lineNumber]);

      if(actualpos[0] >= 0 && actualpos[1] >= 0){
        var index = actualpos[1] * this.width + actualpos[0];
        this.content[index] = line[i];
      }
    }
  });
  
}

AsciiGameEngine.Canvas.prototype.draw = function(what, coordinate, overflowStrategy){
  // top-left corner has coordinate = [0, 0] (as a list)
  // ' ' will be skipped, use '&nbsp;' to print white spaces
  overflowStrategy = this.overflowStrategies(overflowStrategy);

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
  coordinate = coordinate || [0, 0];
  var lines = what.split(/\n|\r|\r\n|\n\r/);

  lines.forEach((line, lineNumber) => {
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      // we skip ' ' and preserve previously draw stuff
      if(line[i] == ' ') continue;

      /* calculating actual coordinates depending on overflow strategy */
      var actualpos = overflowStrategy([coordinate[0] + i, coordinate[1] + lineNumber]);

      if(actualpos[0] >= 0 && actualpos[1] >= 0){
        var index = actualpos[1] * this.width + actualpos[0];
        this.content[index] = line[i];
      }
    }
  });
};

AsciiGameEngine.Canvas.prototype.write = function(what, coordinate, overflowStrategy){
  // same as Canvas.draw, but will not skip ' '
  what = what.replace(/ /g, '&nbsp;');
  return this.draw(what, coordinate, overflowStrategy);
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

AsciiGameEngine.Canvas.prototype.overflowStrategies = function(strategy){
  strategy =  strategy || 'hidden';
  switch(strategy){
    case 'loopback':
      return (coordinate) => {
        var mod = (x, y) => ((x % y) + y) % y;
        var x = mod(coordinate[0], this.width);
        var y = mod(coordinate[1], this.height);
        return [x, y];
      };
    case 'bounded':
      return (coordinate) => {
        var x = coordinate[0];
        var y = coordinate[1];

        if(x >= this.width) x = this.width - 1;
        if(x < 0) x = 0;

        if(y >= this.height) y = this.height - 1;
        if(y < 0) y = 0;

        return [x, y];
      };
    case 'hidden':
    default:
      return (coordinate) => {
        var x = (coordinate[0] < this.width)? coordinate[0]: -1;
        var y = (coordinate[1] < this.height)? coordinate[1]: -1;
        return [x, y];
      };
  }
};
