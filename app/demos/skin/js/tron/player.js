module.exports = (function () {
  
  var playerProto = {
  	'isAlive' : true,
  	'up' : 'w',
  	'down' : 's',
  	'right' : 'd',
  	'left' : 'a',
    'vertical' : 0,
    'horizontal' : 0,
    'speed' : 30,
  	'render' : function () {
      var ctx = this.tileMap.canvas.ctx;
      ctx.fillStyle = this.color;
  		ctx.fillRect(
  			~~(this.x) * this.tileMap.tileWidth, 
  			~~(this.y) * this.tileMap.tileHeight, 
  			this.tileMap.tileWidth, 
  			this.tileMap.tileHeight
  		);
      return this;
  	},
  	'move' : function () {
      var traveled = this.speed * this.sim,
          newCol, newRow,
          newTile = '';

      this.x += this.horizontal * traveled;
      this.y += this.vertical * traveled;
      
      newCol = ~~(this.x);
      newRow = ~~(this.y);
      newTile = newCol + ' ' + newRow;
      
      if (this.lastTile !== newTile) {
        this.tileMap.tiles[newCol][newRow].push(this);
      }
      
      this.lastTile = newTile;
      
      return this;
  	},
  	'updateColliding' : function () {
      var col = ~~(this.x), row = ~~(this.y);
  		if (col < 0 || 
		  col > this.tileMap.width || 
		  row < 0 || 
		  row > this.tileMap.height ||
		  this.tileMap.tiles[col][row].length > 1) {
  			this.isAlive = false;
  		}
  		return this;
  	},
  	'inputUpdate' : function () {
      var up = this.input(this.up),
          down = this.input(this.down),
          right = this.input(this.right),
          left = this.input(this.left);
      if (up && !down && !right && !left) {
        this.vertical = -1;
        this.horizontal = 0;
        return this;
      }
      if (!up && down && !right && !left) {
        this.vertical = 1;
        this.horizontal = 0;
        return this;
      }
      if (!up && !down && right && !left) {
        this.horizontal = 1;
        this.vertical = 0;
        return this;
      }
      if (!up && !down && !right && left) {
        this.horizontal = -1;
        this.vertical = 0;
        return this;
      }
      return this;
  	},
    'update' : function () {
      if (this.isAlive) {
        this.move().updateColliding();
      }
      return this;
    }
    
  };

  var init = function (that) {
    that.sim = that.clock.SIM_RES / 1000;
    that.clock.render.add(function () {
      that.render();
    });
    that.clock.input.add(function () {
      that.inputUpdate();
    });
    that.clock.model.add(function () {
      that.update();
    });
    that.lastTile = ~~(this.x) + ' ' + ~~(this.y);
    return that;
  };

  return function (OO) {
  	
  	return init(Object.create(playerProto).extend(OO));
  
  }

}());