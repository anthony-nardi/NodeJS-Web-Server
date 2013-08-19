;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
module.exports = (function () {
  
  require('./extend');
   var canvas = require('./canvas'),
      backgroundFactory = require('./background'),
      tileMapFactory = require('./tileMap'),
      input = require('./input'),
      clockFactory = require('./clock'),
      clock = clockFactory(),
      playerFactory = require('./player');

  var drawBackground = backgroundFactory({ 
  	'ctx' : canvas.ctx,
  	'width' : canvas.width,
  	'height' : canvas.height,
  	'color' : '#000000'
  }).draw();

  var tileMap = tileMapFactory({
  	'canvas' : canvas,
  	'width' : 190,
  	'height' : 100,
  	'tileColor' : '#000000',
  	'tileBorder' : '#000066'
  })

  var playerOne = playerFactory({
  	'x' : ~~(tileMap.width / 3),
  	'y' : ~~(tileMap.height / 3),
  	'tileMap' : tileMap,
  	'color' : '#FF66FF',
  	'clock' : clock,
  	'input' : input
  });

  var playerTwo = playerFactory({
  	'x' : ~~(tileMap.width / 2),
  	'y' : ~~(tileMap.height / 2),
  	'tileMap' : tileMap,
  	'color' : '#1975FF',
  	'up' : 'UP',
  	'down' : 'DOWN',
  	'right' : 'RIGHT',
  	'left' : 'LEFT',
  	'clock' : clock,
  	'input' : input,
  	'horizontal' : 0,
  	'vertical' : -1
  });

  var playerThree = playerFactory({
  	'x' : ~~(tileMap.width) - 4,
  	'y' : ~~(tileMap.height) - 4,
  	'tileMap' : tileMap,
  	'color' : '#FFFF66',
  	'up' : 'i',
  	'down' : 'k',
  	'right' : 'l',
  	'left' : 'j',
  	'clock' : clock,
  	'input' : input,
  });

  clock.start();

  window.tileMap = tileMap;

}())
},{"./extend":2,"./canvas":3,"./background":4,"./tileMap":5,"./input":6,"./clock":7,"./player":8}],2:[function(require,module,exports){
// All credit to Anthony Nardi
// git@github.com:anthony-nardi/Extends.git
if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {
        
        this[key].extend(object[key]);

      } else {
        this[key] = object[key];
      }
    }
    return this;
  };
};

},{}],3:[function(require,module,exports){
module.exports = (function () {
  var canvas = document.createElement('canvas');

  canvas.width = 1900;
  canvas.height = 1000;
  canvas.ctx = canvas.getContext('2d');;
  console.log(canvas.ctx)
  //setfull screen styles
  document.body.appendChild(canvas);
  document.body.style.margin = '0px';
  document.body.style.overflow = 'hidden';
  console.log(canvas.ctx)

  return canvas;

}());

},{}],4:[function(require,module,exports){
module.exports = (function () {
	var backgroundProto = {
		"draw" : function () {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return this;
		}
	}
  return function (OO) {
    return Object.create(backgroundProto).extend(OO);
  }
}())
},{}],5:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
module.exports = (function () {
  
  var keys = require('./keys'),
      inputState = [];
      
  window.addEventListener('keydown', function (event) {
    inputState[event.which] = true;
  });
  
  window.addEventListener('keyup', function (event) {
  	inputState[event.which] = false;
  })

  return function (key) {
    return (true === inputState[keys.indexOf(key)]);
  }

}());
},{"./keys":9}],7:[function(require,module,exports){
module.exports = (function () {
  
  var tickList = require('./tickList'),

      clockProto = {
        'now' : 0,
        'dt' : 0,
        'dtBuffer' : 0,
        'last' : 0,
        'looping' : false,
        'SIM_RES' : 10,

        'loop' : function () {
          var that = this;   
          this.now = Date.now();
          this.dt = (this.now - this.last);
          this.dtBuffer += this.dt;
          this.input.update();
          while (this.dtBuffer >= this.SIM_RES) {
            this.model.update();
            this.dtBuffer -= this.SIM_RES;
          }
          this.render.update();
          if(this.looping === true) {
            this.last = this.now;
            setTimeout(function () {
              that.loop.call(that);
            }, 1);
          }
          return this;
        },
        'start' : function () {
          if(this.looping === false) {
            this.last = Date.now();
            this.looping = true;
            this.loop();
          }
          return this;
        },
        'stop' : function () {
          this.looping = false;
          return this;
        }

      };
      
  return function (OO) {
    return Object.create(clockProto).extend(OO).extend({
      'input' : tickList(),
      'model' : tickList(),
      'render': tickList()
    })
  }

}());



},{"./tickList":10}],9:[function(require,module,exports){
module.exports = [,,,
'CANCEL',
,
,
'HELP',
,
'BACK SPACE',
'TAB',
,
,
'CLEAR',
'RETURN',
'ENTER',
,
'SHIFT',
'CTRL',
'ALT',
'PAUSE',
'CAPS LOCK',
,
,
,
,
,
,
'ESCAPE' ,
,
,
,
,
'SPACE',
'PAGE UP',
'PAGE DOWN',
'END',
'HOME',
'LEFT',
'UP',
'RIGHT',
'DOWN',
,
,
,
'PRINT SCREEN',
'INSERT',
'DELETE',
,
'0',
'1',
'2',
'3',
'4',
'5',
'6',
'7',
'8',
'9',
,
';',
,
'=',
,
,
,
'a',
'b',
'c',
'd',
'e',
'f',
'g',
'h',
'i',
'j',
'k',
'l',
'm',
'n',
'o',
'p',
'q',
'r',
's',
't',
'u',
'v',
'w',
'x',
'y',
'z',
'META',
,
'CONTEXT MENU',
,
,
'NUMPAD0',
'NUMPAD1',
'NUMPAD2',
'NUMPAD3',
'NUMPAD4',
'NUMPAD5',
'NUMPAD6',
'NUMPAD7',
'NUMPAD8',
'NUMPAD9',
'*',
'+',
'SEPARATOR',
'-',
'DECIMAL',
'DIVIDE',
'F1',
'F2',
'F3',
'F4',
'F5',
'F6',
'F7',
'F8',
'F9',
'F10',
'F11',
'F12',
'F13',
'F14',
'F15',
'F16',
'F17',
'F18',
'F19',
'F20',
'F21',
'F22',
'F23',
'F24',
,
,
,
,
,
,
,
,
'NUM LOCK',
'SCROLL LOCK',
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
';',
'=',
',',
'-',
'.',
'/',
'"',
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
'[',
'\\',
']',
"'",
,
'META'];
},{}],10:[function(require,module,exports){
module.exports = (function () {

  var tickListProto = {
    'update' : function () {
      for (var i = 0; i < this.list.length; i += 1) {
      	this.list[i]();
      }
      return this;
    },
    'add' : function (fn) {
      this.list.push(fn);
      return this;
    }
  };

  return Object.create(tickListProto).extend(tickListProto).extend({
  	'list' : []
  });

});
},{}]},{},[1])
;