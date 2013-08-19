module.exports = (function () {

	var generateMap = function (width, height) {
    var returnArray = [];
    for (var i = 0; i < width; i += 1) {
  	  returnArray[i] = [];
      for(var k = 0; k < height; k += 1) {
    	  returnArray[i].push([]);
	    }
	  }
	  return returnArray;
	}

	var tileMapProto = {
		'init' : function () {
      //Generate 2d array for tile map
	    this.tiles = generateMap(this.width, this.height);
      this.scaleTile().render();
	    return this;
	  },
	  'scaleTile' : function () {
      this.tileWidth = this.canvas.width / this.width;
      this.tileHeight = this.canvas.height / this.height;
      return this;
	  },
	  'render' : function () {
      var ctx = this.canvas.ctx;
    
      ctx.fillStyle = this.tileColor;
      ctx.strokeStyle = this.tileBorder;
      //cover the entire canvas
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
      //draw tile borders
      for (var i = 0; i < this.width; i += 1) {
      	ctx.beginPath();
	    	ctx.moveTo(i * this.tileWidth, 0);
	    	ctx.lineTo(i * this.tileWidth, this.canvas.height);
	    	ctx.closePath();
	    	ctx.stroke();
      }
      for (var i = 0; i < this.height; i += 1) {
        ctx.beginPath();
	    	ctx.moveTo(0, i * this.tileHeight);
	    	ctx.lineTo(this.canvas.width, i * this.tileHeight);
	    	ctx.closePath();
	    	ctx.stroke();       
      }
	  }
	} 
  return function (OO) {
  	return Object.create(tileMapProto).extend(OO).init();
  }
}())