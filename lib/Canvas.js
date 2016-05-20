function Canvas($canvas, width, height){
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

Canvas.prototype.display = function(){
  var displayingContent = this.content.slice(0);
  for(var i = 0; i < this.height; i++){
    var indexToInsertNL = ((i+1) * this.width) + i;
    displayingContent.splice(indexToInsertNL, 0, '\n');
  }
  this.$canvas.html(displayingContent.join(''));
}

Canvas.prototype.draw = function(what, position){
  // top-left corner has position = [0, 0] (as a list)
  // ' ' will be skipped, use '&nbsp;' to print white spaces
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
  }

  what = what || '';
  position = position || [0, 0];
  var lines = what.split(/\n|\r|\r\n|\n\r/);

  lines.forEach((line, lineNumber) => {
    var x = position[0] % this.width;
    var y = (position[1] + lineNumber) % this.height;
    var index = y * this.width + x;
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      if(line[i] == ' ') continue;

      this.content[index + i] = line[i];
    }
  });

  this.display();
};

Canvas.prototype.write = function(what, position){
  // same as Canvas.draw, but will not skip ' '
  what = what.replace(/ /g, '&nbsp;');
  this.draw(what, position);
};

Canvas.prototype.clear = function(){
  this.content = this.clearedContent.slice(0);
}

Canvas.prototype.keyup = function(fn){
  this.$canvas.keyup(fn); 
}

Canvas.prototype.keydown = function(fn){
  this.$canvas.keydown(fn); 
}
