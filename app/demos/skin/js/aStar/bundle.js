;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('./extend');
var board = require('./board'),
    pathFinder = require('./aStar');

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d');

window.restart = function () {
  var myBoard = board({'ctx' : ctx, 'canvas' : myCanvas}).createGameArray(),
	    numObstacles = (function (min, max) {
        return ~~(Math.random() * (max - min) + min);
      }(8,39)),
      myPathFinder;

  window.myBoard = myBoard;
	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

  for (var i = 0; i < numObstacles; i += 1) {
    myBoard.generateObstacle();
  }

  myBoard.generateEndPoints();

  //initiating the open set with the start point
  myPathFinder = pathFinder({
  	'myBoard' : myBoard
  })
}
window.restart();
}

},{"./extend":2,"./board":3,"./aStar":4}],2:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = (function () {
  
  aStarProto = {
    'updateFrequency' : 100,

  	'current' : undefined,

  	'aStar' : function () {
  		var gameState = this.gameState,
  		    tempCurrent;

      if(!this.openSet.length) {
        console.log("there is no path to from start to end point");
        setTimeout(function () {
          window.restart();
        }, 2000);
        return;
      }
      for (var i = 0; i < this.openSet.length; i += 1) {
        if (!tempCurrent || this.openSet[i].fScore < tempCurrent.fScore) {
        	tempCurrent = this.openSet[i];
        }
      }

      if(tempCurrent.id !== "Start" && tempCurrent.id !== "End") {
        tempCurrent.id = "Closed";
      }
      this.closedSet.push(tempCurrent);
      this.openSet.splice(this.openSet.indexOf(tempCurrent), 1);
      this.current = tempCurrent;
      this.fillOpenSet(gameState);

      if (this.current === this.gameState[this.myBoard.endRow][this.myBoard.endCol]) {
      	console.log('Path found.');
      	this.setPath(this.current.parent);
      	this.myBoard.drawGameBoard();
        setTimeout(function () {
          window.restart();
        }, 2500);
      	return;
      }
      var that = this;
      setTimeout(function () {
        that.myBoard.drawGameBoard();
        that.aStar();
      }, this.updateFrequency);
  	},

  	'fillOpenSet' : function () {
  		var gameState = this.gameState,
          currTile;
      for (var i = this.current.col - 1; i <= this.current.col + 1; i += 1) {
      	for (var k = this.current.row - 1; k <= this.current.row + 1; k += 1) {
          if (gameState[k] && gameState[k][i]) {
            currTile = gameState[k][i];
            if (currTile.id !== 'Blocked' && this.closedSet.indexOf(currTile) === -1) {
              currTile.getFScore(this.current);
              if (this.openSet.indexOf(currTile) === -1) {
                this.openSet.push(currTile);
                if(currTile.id !== "End") {
                  currTile.id = "OpenSet";
                }
              }
            }
          }
      	}
      }
  	},

  	'setPath' : function (tile) {
  		if (tile.id === "Start") return;
  		console.log('setting path');
  		this.gameState[tile.row][tile.col].id = 'Path';
  		this.setPath(tile.parent);
  	}

  }
  
  var init = function (that) {
    that.openSet =  [];
  	that.closedSet = [];

  	that.gameState = that.myBoard.gameState;
    var startTile = that.gameState[that.myBoard.startRow][that.myBoard.startCol];
  	startTile.parent = startTile;
  	startTile.gScore = 0;
    startTile.getFScore(startTile);
	  that.openSet.push(startTile);
	  that.aStar(that.gameState);
  	return that;
  }

  return function (OO) {

  	return init(Object.create(aStarProto).extend(OO));
  }

}());

},{}],3:[function(require,module,exports){
module.exports = (function () {
  var tile = require('./tile');
  var boardProto = {

    'maxObstacleWidth' : .25,

    'maxObstacleHeight' : .25, 

    'createGameArray' : function () {
      var gameState = [];
      for (var i = 0; i < 40; i += 1) {
        gameState.push([])
        for (var k = 0; k < 40; k += 1) {
          gameState[i].push(tile({'row' : i, 'col' : k, 'board' : this }));
        }0
      }
      this.gameState = gameState;
      return this;
    },

    'drawGameBoard' : function () {
      var ctx = this.ctx,
          myCanvas = this.canvas;
      //draw outline

      ctx.lineWidth = 3;
      ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

      //draw circles

      for (var j = 0; j < 40; j += 1) {
        for (var m = 0; m < 40; m += 1) {
          if (this.gameState[j][m].id === 0) {
            ctx.fillStyle = '#DAE8F5';
          } else if (this.gameState[j][m].id === 'Blocked') {
            ctx.fillStyle = '#940413';
          } else if (this.gameState[j][m].id === 'Start') {
            ctx.fillStyle = '#0000FF';
          } else if (this.gameState[j][m].id === 'End') {
            ctx.fillStyle = '#00FF00';
          } else if (this.gameState[j][m].id === 'OpenSet') {
            ctx.fillStyle = '#05A8A0';
          } else if (this.gameState[j][m].id === 'Path') {
            ctx.fillStyle = '#FF4500';
          } else if (this.gameState[j][m].id === 'Closed') {
            ctx.fillStyle = '#A8059D';
          }
          ctx.beginPath();
          ctx.arc((m * 10) + ((m + 1) * 10), ((j * 10) + ((j + 1) * 10)), 10, 0, Math.PI*2, true)
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.stroke(); 
        }
      }
    },
    
    'generateObstacle' : function () {
      var colLength = this.gameState[0].length,
          rowLength = this.gameState.length,
          startX = Math.floor(Math.random()* colLength),
          startY = Math.floor(Math.random()* rowLength),
          width = ~~(this.maxObstacleWidth * Math.random() * colLength),
          height = ~~(this.maxObstacleHeight * Math.random() * rowLength),
          colOverFlow = startX + width - colLength,
          rowOverFlow = startY + height - rowLength;

      if (colOverFlow > 0) {
        startX -= colOverFlow;
      }
      if (rowOverFlow > 0) {
        startY -= rowOverFlow;
      }
      for (var i = startX; i < (width+startX); i += 1) {
        for (var k = startY; k < (height+startY); k += 1) {
          this.gameState[i][k].id = 'Blocked';
        }
      }
    
    },

    'generateEndPoints' : function () {
      var colLength = this.gameState[0].length,
          rowLength = this.gameState.length,
          startCol = Math.floor(Math.random()* colLength),
          startRow = Math.floor(Math.random()* rowLength),
          endCol = Math.floor(Math.random()* colLength),
          endRow = Math.floor(Math.random()* rowLength);

      if (this.gameState[startRow][startCol].id === 'Blocked' || this.gameState[endRow][endCol].id === 'Blocked') {
        return this.generateEndPoints();
      }

      this.startCol = startCol;
      this.startRow = startRow;
      this.endCol = endCol;
      this.endRow = endRow;

      this.gameState[startRow][startCol].id = 'Start';
      this.gameState[endRow][endCol].id = 'End';
      return this;
    }
  }

  return function (OO) {
    return Object.create(boardProto).extend(OO);
  }

}());


},{"./tile":5}],5:[function(require,module,exports){
module.exports = (function () {
	
  var tileProto = {
    
    'id' : 0,
	  
	  'gScore' : undefined,
	  'hScore' : undefined,
	  'fScore' : undefined,
	  
	  'parent' : undefined,
    
    'getGScore' : function (current) {
      if(current === undefined) {
        console.log("current is undefined... tile.js");
      }
      var xDiff = Math.abs(this.col - current.col),
          yDiff = Math.abs(this.row - current.row),
          tempGScore = undefined;

      if (xDiff && yDiff) {
        tempGScore = current.gScore + 14;
      } else {
      	tempGScore = current.gScore + 10;
      }

      if (!this.gScore || tempGScore < this.gScore) {
        this.gScore = tempGScore;
        this.parent = current;
      }

      return this.gScore;
    },

    'getFScore' : function (current) {
    	this.fScore = (this.getHScore() + this.getGScore(current));
      return this.fScore;
    },

    'getHScore' : function () {
      if (!this.hScore) {
      	var xDiff = Math.abs(this.col - this.board.endCol), 
            yDiff = Math.abs(this.row - this.board.endRow);
        this.hScore = (xDiff + yDiff) * 10;
      }
      return this.hScore;
    }

  }

  var init = function (that) {
    return that;
  }

	return function (OO) {
	  return init(Object.create(tileProto).extend(OO));
	}

}())
},{}]},{},[1])
;