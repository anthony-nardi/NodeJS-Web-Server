 'diagTrip' : function (board) {
      for (var row = 5; row > 2; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          if (board[row][col] && board[row][col] === board[row-1][col-1] && board[row][col] === board[row-2][col-2]) {
            if (board[row+1] && board[row+1][col+1] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row+1,
                         'winDiagCol' : col+1
                       };
              } else {
                return {'blockDiagRow' : row+1,
                         'blockDiagCol' : col+1
                       };
              }
            } else if (board[row-3] && board[row-3][col-3] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-3,
                         'winDiagCol' : col-3
                       };
              } else {
                return {'blockDiagRow' : row-3,
                         'blockDiagCol' : col-3
                       };
              }
            }
          } else if (board[row][col] && board[row][col] === board[row-1][col+1] && board[row][col] === board[row-2][col+2]) {
            if (board[row+1] && board[row+1][col-1] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-1,
                         'winDiagCol' : col+1
                       };
              } else {
                return {'blockDiagRow' : row-1,
                         'blockDiagCol' : col+1
                       };
              }
            } else if (board[row-3][col+3] === 0) {
              if (board[row][col] === 2) {
                return {'winDiagRow' : row-3,
                         'winDiagCol' : col+3
                       };
              } else {
                return {'blockDiagRow' : row-3,
                         'blockDiagCol' : col+3
                       };
              }
            }
          }
        }
      }
      return false;
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
    'r' : function (board) {
      for (var row = 5; row >= 0; row -= 1) {
        var strRow = board[row].join();
        if (strRow.match(/0,2,2,2/) || strRow.match(/2,2,2,0/)) {
          for (var col = 0; col <= 6; col += 1) {
            if (board[row][col] === 0 && board[row][col+1] === 2 && board[row][col+2] === 2 && board[row][col+3] === 2) {
              if (row === 5 || (board[row+1] && board[row+1][col])) {
                return {'winRowRow' : row,
                        'winRowCol' : col 
                       };
              }
            } else if (board[row][col+3] === 0 && board[row][col] === 2 && board[row][col+1] === 2 && board[row][col+2] === 2) {
              if (row === 5 || (board[row+1] && board[row+1][col+3])) {
                return {'winRowRow' : row,
                      'winRowCol' : col+3 
                     };
              }
            }
          }
          
        } else if (strRow.match(/0,1,1,1/) || strRow.match(/1,1,1,0/)) {
          for (var col = 0; col <= 6; col += 1) {
            if (board[row][col] === 0 && board[row][col+1] === 1 && board[row][col+2] === 1 && board[row][col+3] === 1) {
              if (row === 5 || (board[row+1] && board[row+1][col])) {
                return {'blockRowRow' : row,
                      'blockRowCol' : col 
                     };
              }
            } else if (board[row][col+3] === 0 && board[row][col] === 1 && board[row][col+1] === 1 && board[row][col+2] === 1) {
              if (row === 5 || (board[row+1] && board[row+1][col+3])) {
                return {'blockRowRow' : row,
                      'blockRowCol' : col+3 
                     };
              }
            }
          }
        }
      }
      return false;
    },
*/




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