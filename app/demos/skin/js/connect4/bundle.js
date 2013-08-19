;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('./extend');
var player = require('./player'),
    board = require('./board'),
    aiConstructor = require('./gameAI');


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d'),
	    myBoard = board(),
	    gameState = myBoard.createGameArray(),
	    myPlayer = player(),
	    myAI = aiConstructor({ 'depth' : 4 });

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

  var winner = function (ctx, myCanvas) {
  	ctx.fillStyle = '#000000';
  	ctx.fillRect((myCanvas.width/2 - 300), (myCanvas.height/2 - 100), 600, 150);
  	ctx.fillStyle = '#FF0000';
  	ctx.font = '100px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Game Over', myCanvas.width/2, myCanvas.height/2);
  	ctx.fillStyle = '#000000';
  	ctx.fillRect((myCanvas.width/2 - 150), 2*(myCanvas.height/3), 300, 50);
  	ctx.fillStyle = '#FF0000';
  	ctx.font = '20px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Refresh To Play Again!', myCanvas.width/2, 2*(myCanvas.height/3) + 30);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      if (myAI.winner(gameState.gameBoard)) {
      	setTimeout(function () { winner(ctx, myCanvas) }, 2000);
      	return;
      }
      gameState.storedAlpha = undefined;
      myAI.botChecker(gameState);
      myAI.moveApiPlayer(gameState);
      update(ctx, myCanvas);
      if (myAI.winner(gameState.gameBoard)) {
      	setTimeout(function () { winner(ctx, myCanvas) }, 2000);
      	return;
      }
		}
	});

  update(ctx, myCanvas);

}
},{"./extend":2,"./player":3,"./board":4,"./gameAI":5}],2:[function(require,module,exports){
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


if (!Array.prototype.arrayExtend) {
    
  Array.prototype.arrayExtend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {

        this[key].arrayExtend(object[key]);      
      
      } else {    
        if (object[key] instanceof Array) {
          this[key] = object[key].slice(0);
        } else {
          this[key] = object[key];      
        }
      }
    }    
    return this;  
  };
};
},{}],3:[function(require,module,exports){
module.exports = (function () {

  var playerProto = {

  	'locateMousePos' : function (e) {
  		var myCanvas = document.getElementById('myCanvas');
      return {
      	'x' : Math.floor(
      		  e.clientX
      		  + document.body.scrollLeft
      		  + document.documentElement.scrollLeft
      		  - myCanvas.offsetLeft
      		  ),
      	'y' : Math.floor(
      		  e.clientY
      		  + document.body.scrollTop
      		  + document.documentElement.scrollTop
      		  - myCanvas.offsetTop
      		  )
      };
  	},

  	'move' : function (e, gameState) {
  		var myCanvas = document.getElementById('myCanvas');
  		var mousePos = this.locateMousePos(e);
      if (mousePos.x > myCanvas.offsetLeft + 25 &&
      	  mousePos.x < (myCanvas.offsetLeft) + (myCanvas.width + 25) &&
      	  mousePos.y > myCanvas.offsetTop + 25 &&
      	  mousePos.y < (myCanvas.offsetTop) + (myCanvas.height - 25) &&
      	  gameState.turn === 1) {
      	var columnIndex = Math.floor((mousePos.x - myCanvas.offsetLeft - 75)/100);
      	for (var i = 5; i >= 0; i -= 1) {
      		if (gameState.gameBoard[i][columnIndex] === 0) {
      			gameState.gameBoard[i][columnIndex] = 1;
      			gameState.turn = 2;
      			return true;
      		}
      	}
      }
  	}
  }

  return function () {
  	return Object.create(playerProto);
  }

}());
},{}],4:[function(require,module,exports){
module.exports = (function () {
  var gameInitProto = {

  	'createGameArray' : function () {
  		var gameBoard = [];
  		for (var i = 0; i < 6; i += 1) {
        gameBoard.push([]);
  			for (var k = 0; k < 7; k += 1) {
          gameBoard[i].push(0);
  			}
  		}
  		this.gameBoard = gameBoard;
  		this.turn = 1;
  		return this;
  	},

  	'drawGameBoard' : function (ctx, myCanvas) {
  		//set fill
  		ctx.fillStyle = '#000000'
  		ctx.lineWidth = 5;
      //draw outline
      ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

      //draw background
      ctx.strokeRect(25,25,myCanvas.width-50, myCanvas.height-50)

      //draw vertical lines
      for (var i = 25; i < myCanvas.width-25; i += 100) {
      	ctx.beginPath();
      	ctx.moveTo(i,25);
      	ctx.lineTo(i,myCanvas.height-25);
      	ctx.closePath();
      	ctx.stroke();
      }

      //draw horizontal lines
      for (var k = 25; k < myCanvas.height-25; k += 100) {
      	ctx.beginPath();
      	ctx.moveTo(25,k);
      	ctx.lineTo(myCanvas.width-25,k);
      	ctx.closePath();
      	ctx.stroke();
      }
      
      //draw slots
      for (var j = 0; j < 6; j += 1) {
      	for (var m = 0; m < 7; m += 1) {
      		if (this.gameBoard[j][m] === 0) {
      			ctx.fillStyle = '#FFFFFF';
      		} else if (this.gameBoard[j][m] === 1) {
      			ctx.fillStyle = '#0000FF';
      		} else {
      			ctx.fillStyle = '#003300'
      		}
      		ctx.beginPath();
      		ctx.arc((25 + (m * 50) + ((m + 1) * 50)), (25 + (j * 50) + ((j + 1) * 50)), 40, 0, Math.PI*2, true)
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#000000';
          ctx.stroke(); 
      	}
      }
  	}
  }

  return function () {
  	return Object.create(gameInitProto);
  }

}());

},{}],5:[function(require,module,exports){
module.exports = (function () {

  var gameAIProto = {

    'depth' : 4,

    'computerIsEven' : true,

    'getPlayerMove' : function (currentDepth) {
      if (this.computerIsEven) {
        return (currentDepth % 2 === 0) ? 2 : 1;
      } else {
        return (currentDepth % 2 === 0) ? 1 : 2;
      }
    },

  	'availableMoves' : function (board) {
      var possibleMoves = {};

      for (var col = 0; col < 7; col += 1) {
      	for (var row = 5; row >= 0; row -= 1) {
      		if (board[row][col] === 0) {
      			possibleMoves[col] = row;
      			break;
      		}
      	}
      }
      return possibleMoves;
  	},

  	'bestMove' : function (gameState, depth) {
      gameState.gameBoard.depth = depth;
      return this.minimax(gameState, depth)
  	},

    'moveApiPlayer' : function (gameState) {
      gameState.gameBoard[gameState.bestMove[0]][gameState.bestMove[1]] = 2;
      gameState.turn = 1;
    },

  	'minimax' : (function () {
      var infin = Math.pow(2,53);

      return function (gameState, depth) {
        
        var branches,
            newGameState,
            depth;

        if (depth === undefined) {
          depth = this.depth;
        } 

        console.log('depth ' + depth);
        
        if (this.winner(gameState.gameBoard)) {
          console.log('in here');
          return infin;
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }
       
        var alpha = infin;
       
        branches = this.availableMoves(gameState.gameBoard);
  
        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].arrayExtend(gameState.gameBoard);
          newGameState = this.move(this.getPlayerMove(depth), newGameState, branches[col], col);
          alpha = Math.min(alpha, -this.minimax({ 'gameBoard' : newGameState }, depth - 1)); 
        }
        console.log('This is the alpha');
        console.log(alpha);
        return alpha;
      }
  	}()),
/*
if (alpha !== gameState.storedAlpha) {
            gameState.storedAlpha = alpha;
            gameState.bestMove = [branches[col], col];
          }
        }
        if (gameState.storedAlpha) {
          gameState.bestMove[1] = parseInt(gameState.bestMove[1]);
          console.log(gameState.bestMove);
          this.moveApiPlayer(gameState);
        } 
*/

    'minimax2' : (function () {
      var infin = Math.pow(2,53);
      return function (gameState, depth) {
        var branches,
              newGameState,
              currAlpha,
              isAI,
              depth,
              currPlayer;

        if (depth === undefined) {
          depth = this.depth;
        }

        currPlayer = this.getPlayerMove(depth);

        isAI  = this.getPlayerMove(depth) === 2 ? 1 : 0;
        
        if (this.winner(gameState.gameBoard)) {
          if (this.winner(gameState.gameBoard) === 2) {
            return infin;
          } else {
            return -(infin);
          }
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }

        if (isAI) {
          alpha = -(infin);
        } else {
          alpha = infin;
        }
       
        branches = this.availableMoves(gameState.gameBoard);

        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].arrayExtend(gameState.gameBoard);
          newGameState = this.move(this.getPlayerMove(depth), newGameState, branches[col], col);
          var o = {}.extend(gameState);
          o.gameBoard = newGameState;
          currAlpha = this.minimax2(o, depth - 1);
          if (isAI) {
            alpha = Math.max(currAlpha, alpha);
            if (depth === this.depth) {
              if (gameState.storedAlpha === undefined) {
                gameState.storedAlpha = alpha;
                gameState.bestMove = [branches[col], col];
              } else if (gameState.storedAlpha < alpha) {
                gameState.storedAlpha = alpha;
                gameState.bestMove = [branches[col], col];
              }
            } 
          } else {
              alpha = Math.min(currAlpha, alpha);
            } 
          }
          return alpha;
        }
      }()),

    'move' : function (player, board, row, col) {
      board[row][col] = player;
      return board;
    },

    'winner' : function (board) {
      if (this.checkWinnerRow(board)) {
        return this.checkWinnerRow(board);
      } else if (this.checkWinnerCol(board)) {
        return this.checkWinnerCol(board);
      } else if (this.checkWinnerDiagonal(board)) {
        return this.checkWinnerDiagonal(board);
      }
    },

  	'score' : function (board) {
      return   (this.scoreTotal(this.scoreRow(board)) + 
               this.scoreTotal(this.scoreCol(board)) + 
               this.scoreTotal(this.scoreDiagonal(board)));       
    },

    'scoreTotal' : function (scoreTable) {
      var total = 0,
          calculator = {
            1 : 1,
            2 : 4,
            3 : 32
          };
      for (var count in scoreTable) {
        if (!scoreTable.hasOwnProperty(count)) continue;
        total += scoreTable[count] * calculator[count];
      }
      return total;
    },

    'scoreCol' : function (board) {
      var colScoreTable = this.scoreTable();
      for (var row = 5; row >= 3; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          var counter = 0;
          if (board[row][col] !== 1 && 
              board[row - 1][col] !== 1 && 
              board[row - 2][col] !== 1 &&
              board[row - 3][col] !== 1) {
            for (var j = row; j >= row - 3; j -= 1) {
              if (board[j][col] === 2) counter += 1;
            }
            if (counter) colScoreTable[counter] += 1;
          }
        }
      }
      return colScoreTable;
    },

    'scoreRow' : function (board) {
      var rowScoreTable = this.scoreTable();
      for(var row = 5; row >= 0; row -= 1) {
        for (var col = 0; col < 4; col += 1) {
          var counter = 0;
          if (board[row][col+3]!== 1 && 
              board[row][col+2]!== 1 && 
              board[row][col+1]!== 1 && 
              board[row][col] !== 1) {
            for (var j = col; j <= col + 3; j += 1) {
              if (board[row][j] === 2) counter += 1;
            }
            if (counter) rowScoreTable[counter] += 1;
          }
        }
      }
      return rowScoreTable;
    },

    'scoreDiagonal' : function (board) {
      var diagScoreBoard = this.scoreTable(),
          counter = 0;
      for (var row = 5; row >= 3; row -= 1){
        for (var col = 0; col < 7; col += 1) {
          if (board[row][col] !== 1 && 
              board[row - 3][col - 3] !== 1 && typeof board[row - 3][col - 3] !== 'undefined' &&
              board[row - 2][col - 2] !== 1 && typeof board[row - 2][col - 2] !== 'undefined' &&
              board[row - 1][col - 1] !== 1 && typeof board[row - 1][col - 1] !== 'undefined') {
            counter = 0;
            if (board[row][col] === 2) counter += 1;
            if (board[row - 1][col - 1] === 2) counter += 1;
            if (board[row - 2][col - 2] === 2) counter += 1;
            if (board[row - 3][col - 3] === 2) counter += 1;
            if (counter) diagScoreBoard[counter] += 1;
          }
          if (board[row][col] !== 1 && 
              board[row - 3][col + 3] !== 1 && typeof board[row - 3][col + 3] !== 'undefined' &&
              board[row - 2][col + 2] !== 1 && typeof board[row - 2][col + 2] !== 'undefined' &&
              board[row - 1][col + 1] !== 1 && typeof board[row - 1][col + 1] !== 'undefined') {
            counter = 0;
            if (board[row][col] === 2) counter += 1;
            if (board[row - 1][col + 1] === 2) counter += 1;
            if (board[row - 2][col + 2] === 2) counter += 1;
            if (board[row - 3][col + 3] === 2) counter += 1;
            if (counter) diagScoreBoard[counter] += 1;
          }
        }
      }
      return diagScoreBoard;
    },

    'scoreTable' : function () {
      return {
        1 : 0,
        2 : 0,
        3 : 0
      }
    },

    'checkWinnerRow' : function (board) {
      for (var row = 5; row >= 0; row -= 1) {
        var strRow = board[row].join();
        if (strRow.match(/1,1,1,1/)) {
          return 1;
        } else if (strRow.match(/2,2,2,2/)) {
          return 2;
        }
      }
      return false;
    },

    'checkWinnerCol' : function (board) {
      for (var col = 0; col < 7; col += 1) {
        var colStrMaker = [];
        for (var row = 5; row >=0; row -= 1) {
          colStrMaker.push(board[row][col]);
        }
        var strCol = colStrMaker.join();
        if (strCol.match(/1,1,1,1/)) {
          return 1;
        } else if (strCol.match(/2,2,2,2/)) {
          return 2;
        }
      }
      return false;
    },

    'checkWinnerDiagonal' : function (board) {
      for (var row = 5; row > 2; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          if(board[row][col] && board[row][col] === board[row-3][col-3]) {
            if (board[row][col] === board[row-1][col-1] && 
                board[row][col] === board[row-2][col-2]) {
              if (board[row][col] === 1) {
                return 1;
              } else {
                return 2;
              };
            }
          } else if (board[row][col] && board[row][col] === board[row-3][col+3]){
            if (board[row][col] === board[row-1][col+1] && 
                board[row][col] === board[row-2][col+2]) {
              if (board[row][col] === 1) {
                return 1;
              } else {
                return 2;
              }
            }
          }
        }
      }
      return false;   
    },

    'rowTrip' : function (board) {
      for (var row = 5; row >= 0; row -= 1) {
        for (var col = 0; col <= 4; col += 1) {
          var counter = 0;
          var strRow = board[row].join();
          if (strRow.match(/0,0,0,0,0,0,0/)) {
            return false;
          }
          for (var i = 0; i < 4; i += 1) {
            counter += this.numReturner(board[row][col+i])
          }
          if (counter === 3) {
           for (var k = 0; k < 4; k += 1) {
             if (board[row][col+k] === 0 && (row === 5 || (board[row+1] && board[row+1][col+k]))) {
               return {'blockRowRow' : row,
                      'blockRowCol' : col+k 
                     }; 
              }
            } 
          } else if (counter === 15) {
            for (var x = 0; x < 4; x += 1) {
             if (board[row][col+x] === 0 && (row === 5 || (board[row+1] && board[row+1][col+x]))) {
               return {'winRowRow' : row,
                      'winRowCol' : col+x 
                     }; 
              }
            }
          }
        }
      }
      return false;
    },

    'diagTrip' : function (board) {
      for (var row = 5; row > 2; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          var counter1 = 0;
          var counter2 = 0;
          for (var i = 0; i < 4; i += 1) {
            counter1 += this.numReturner(board[row-i][col-i]);
            counter2 += this.numReturner(board[row-i][col+i]);
          }
          if (counter1 === 3) {
            for (var k = 0; k < 4; k += 1) {
             if (board[row-k][col-k] === 0 && (row-k === 5 || (board[(row-k)+1] && board[(row-k)+1][col-k]))) {
               return {'blockDiagRow' : row-k,
                      'blockDiagCol' : col-k 
                     }; 
              }
            } 
          } else if (counter1 === 15) {
            for (var x = 0; x < 4; x += 1) {
             if (board[row-x][col-x] === 0 && (row-x === 5 || (board[(row-x)+1] && board[(row-x)+1][col-x]))) {
               return {'winDiagRow' : row-x,
                      'winDiagCol' : col-x 
                     }; 
              }
            }
          } else if (counter2 === 3) {
            for (var y = 0; y < 4; y += 1) {
             if (board[row-y][col+y] === 0 && (row-y === 5 || (board[(row-y)+1] && board[(row-y)+1][col+y]))) {
               return {'blockDiagRow' : row-y,
                      'blockDiagCol' : col+y
                     }; 
              }
            } 
          } else if (counter2 === 15) {
            for (var z = 0; z < 4; z += 1) {
             if (board[row-z][col+z] === 0 && (row-z === 5 || (board[(row-z)+1] && board[(row-z)+1][col+z]))) {
               return {'winDiagRow' : row-z,
                      'winDiagCol' : col+z 
                     }; 
              }
            }
          }
        }
      }
      return false; 
    },

    'numReturner' : function (score) {
      if (score === 0) {
        return 0;
      } else if (score === 1) {
        return 1;
      } else if (score === 2) {
        return 5;
      }
    }, 

    'colTrip' : function (board) {
      for (var col = 0; col < 7; col += 1) {
        var colStrMaker = [];
        for (var row = 5; row >=0; row -= 1) {
          colStrMaker.push(board[row][col]);
        }
        var strCol = colStrMaker.join();
        if (strCol.match(/2,2,2,0/)) {
          for (var r = 5; r >= 0; r -= 1) {
            if (board[r-3] && board[r-3][col] === 0 && 
                board[r][col] === 2 && 
                board[r-2][col] === 2 && 
                board[r-2][col] === 2) {
              return {'winColRow' : r-3,
                      'winColCol' : col 
                     };
            }
          }
        } else if (strCol.match(/1,1,1,0/)) {
          for (var r = 5; r >= 0; r -= 1) {
            if (board[r-3] && board[r-3][col] === 0 && 
                board[r][col] === 1 && 
                board[r-2][col] === 1 && 
                board[r-2][col] === 1) {
              return {'blockColRow' : r-3,
                      'blockColCol' : col 
                     };
            }
          }
        }
      }
      return false;
    },

    'threeScore' : function (board) {
      var row = this.rowTrip(board);
      var col = this.colTrip(board);
      var diag = this.diagTrip(board);
      if (row && row.winRowRow !== undefined) {
          board[row.winRowRow][row.winRowCol] = 2;
          return board;
        } else if (col && col.winColRow !== undefined) {
          board[col.winColRow][col.winColCol] = 2;
          return board;
        } else if (diag && diag.winDiagRow !== undefined) {
          board[diag.winDiagRow][diag.winDiagCol] = 2;
          return board;
        } else if (row && row.blockRowRow !== undefined) {
          board[row.blockRowRow][row.blockRowCol] = 2;
          return board;
        } else if (col && col.blockColRow !== undefined) {
          board[col.blockColRow][col.blockColCol] = 2;
          return board;
        } else if (diag && diag.blockDiagRow !== undefined) {
          board[diag.blockDiagRow][diag.blockDiagCol] = 2;
          return board;
        } else {
          return false;
        }
    },

    'botChecker' : function (gameState) {
      var board = gameState.gameBoard;
      var rowStr = board[5].join();
      if (rowStr.match(/1,1,0,1/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 1 && board[5][i+1] === 1 && board[5][i+2] === 0 && board[5][i+3] === 1) {
            board[5][i+2] = 2;
            return gameState;
          }
        }
      } else if (rowStr.match(/0,1,0,1,0/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 0 && board[5][i+1] === 1 && board[5][i+2] === 0 && board[5][i+3] === 1) {
            board[5][i+2] = 2;
            return gameState;
          }
        }

      } else if (rowStr.match(/0,1,1,0/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 0 && board[5][i+1] === 1 && board[5][i+2] === 1) {
            board[5][i] = 2;
            return gameState;
          }
        }
      } 
      if (this.threeScore(board)) {
        return gameState;
      } else {
        this.minimax2(gameState);
      }
    }   
  }

  var init = function (that) {
    if (that.depth % 2 === 0) {
      that.computerIsEven = true;
    } else {
      that.computerIsEven = false;
    }
    return that;
  }

  return function (OO) {
  	return init(Object.create(gameAIProto).extend(OO));
  }

}());
},{}]},{},[1])
;