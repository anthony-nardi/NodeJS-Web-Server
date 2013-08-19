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