function Canvas($canvas, width, height){
  /** setup canvas **/
  // width and height specified in number of characters
  $canvas.css('width', width+'ch');
  $canvas.css('height', height+'ch');

  // setup word break
  $canvas.css('white-space', 'pre-wrap');
  $canvas.css('word-wrap', 'break-word');

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
    var index = (position[1] + lineNumber) * this.width + position[0];
    line = groupWord(line.split(''), '&nbsp;');
    for(var i = 0; i < line.length; i++){
      if(line[i] == ' ') continue;

      this.content[index + i] = line[i];
    }
  });

  this.$canvas.html(this.content.join(''));
};
Canvas.prototype.write = function(what, position){
  // same as Canvas.draw, but will not skip ' '
  what = what.replace(/ /g, '&nbsp;');
  this.draw(what, position);
};
Canvas.prototype.clear = function(){
  this.content = this.clearedContent.slice(0);
}
