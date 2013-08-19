;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('./extend');

var map = require('./map'),
    logic = require('./logic');

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {
  
  var canvas = document.getElementById('myCanvas');
  
  myMap = map({  
    'canvas': canvas,
    'ctx': canvas.getContext('2d')
  });

  myLogic = logic({
    'myMap' : myMap,
    'map' : myMap.map
  })

}
},{"./extend":2,"./map":3,"./logic":4}],2:[function(require,module,exports){
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
  var aStar = require('./astar');
  var logicProto = {
    
    'history' : [],
    
    'time' : 0,
    
    'observe' : function () {
      
      var player = this.myMap.player,
          totalSenses = this.myMap.map[player.col][player.row].totalSenses || [],
          adjacentTiles = this.myMap.getAdjacentTiles(player.col, player.row),
          that = this;

        //store the history of what we sensed when we entered a tile

        if (this.time) {
          this.history[this.time] = {
            'senses': totalSenses,
            'monsterAlive' : this.history[this.time - 1].monsterAlive,
            'currentTile' : this.map[this.myMap.player.col][this.myMap.player.row],
            'row' : this.myMap.player.row,
            'col' : this.myMap.player.col,
            'time': this.time,
            'visitedTiles' : this.history[this.time - 1].visitedTiles,
            'safeTiles': this.history[this.time - 1].safeTiles,
            'pits': this.history[this.time - 1].pits,
            'gold': this.history[this.time - 1].gold,
            'possiblePits': this.history[this.time - 1].possiblePits,
            'monsters': this.history[this.time - 1].monsters,
            'possibleMonsters': this.history[this.time - 1].possibleMonsters,
            'possibleGold' : this.history[this.time - 1].possibleGold,
            'killedMonsters': this.history[this.time - 1].killedMonsters,
            'ladder': this.history[this.time - 1].ladder,
            'takenGold' : this.history[this.time - 1].takenGold
          }
        }

        // If there are no senses in the tile the player is in we can say for sure
        // that all of the adjacent tiles are safe.

        if (totalSenses.length === 0 && adjacentTiles.length) {
          for (var i = 0; i < adjacentTiles.length; i += 1) {
            if (this.history[this.time].safeTiles.indexOf(adjacentTiles[i]) === -1) {
              this.history[this.time].safeTiles.push(adjacentTiles[i]);
            }
          }
        }
        
        // There are no senses for the ladder, so if we come accross it we store it.
        if (this.map[player.col][player.row].id === 'Ladder') {
          this.history[this.time].ladder = [this.map[player.col][player.row]];
          // If we have the gold at this point the game is over, because we have reached the ladder with 
          // the gold.
          if (this.history[this.time].takenGold) {
            this.over = true;

          }
        }

        // The first thing we have to do is update potential spaces.  We check to see what
        // senses we have, then look to see if those adjacent cells that could contain the 
        // monster or pit are in our safe tile list or are already in the pit or monster list.

        this.updatePotentials(totalSenses, adjacentTiles);

        // With newly updated potentails we have the chance to start ruling things out.  If we do rule
        // something out then we will check if we can say anything for certain.

        if (this.eliminator(adjacentTiles, totalSenses)) {
          this.checkCertainty(this.myMap.player.col, this.myMap.player.row, adjacentTiles);
        }

        // The queue is formed when we make a path to a tile, we call the move function with one element of the 
        // queue at a time to drain the queue.


        if (player.queue.length) {
          if (player.queue[0][1]) {
            this.move(player.queue[0]);
          }
          player.queue.splice(0, 1);
        } else {
          this.makeDecision(totalSenses);
        }
      

      // Just so we can see the game evolve slowly we use a set timeout here. 
      this.time += 1;
      setTimeout(function () {
        if (!that.over && history.safeTiles.length === 0) {
            this.myMap.gameOver();
            this.over = true;
          
            that.myMap.drawGameBoard(that.history[that.time - 1].safeTiles , that.history[that.time - 1].visitedTiles);
        }
        if (!that.over) {
          that.observe();
          that.myMap.drawMidGameBoard(that.history[that.time - 1]);
          //that.myMap.drawGameBoard(that.history[that.time - 1].safeTiles , that.history[that.time - 1].visitedTiles);
        } else {
          setTimeout(function () {
            window.location = window.location;
          }, 5000)
          that.myMap.drawGameBoard(that.history[that.time - 1].safeTiles , that.history[that.time - 1].visitedTiles);
        }
      }, 200);
     
      return this;
    },

    'move' : function (action) {
      var player = this.myMap.player,
          time = this.history[this.time],
          visitedTiles = time.visitedTiles,
          map = this.myMap.map;
          

    // If we want to just move our player rather than shoot or take the gold,
      if (action[0] === 'Move') {
        if (action[1] instanceof Array) {
          action = [action[0], action[1][0]];
        }
        
        // We want to leave the id 'Ladder' on the ladder tile for the whole game, so make sure we
        // do not change the id of the one we are coming from or going to if it is the ladder.

        if (map[action[1].col][action[1].row].id !== 'Ladder') {
          map[action[1].col][action[1].row].id = 'Player';
        }

        if (map[player.col][player.row].id !== 'Ladder') {
          map[player.col][player.row].id = 0;
        }

        //Move our player on our map, and update our visited tiles in the history if it needs it.

        player.col = action[1].col;
        player.row = action[1].row;

        if (visitedTiles.indexOf(map[action[1].col][action[1].row]) === -1) {
            visitedTiles.push(map[action[1].col][action[1].row]);
        }       
      }

    // Now if we want to take a chance and try to shoot the monster...

      if (action[0] === 'Shoot') {
      // Check the tile to see if the one we are shooting at contains the monster.
        if (action[1].id === 'Monster') {
          player.ammo -= 1;
          // If we did not know about this monster for certain, put it in the certain monsters array and take out all possible
          // monsters because there is only one.
          if (time.monsters.indexOf(action[1]) !== -1) {
            time.monsters.splice(time.monsters.indexOf(action[1]), 1);
            time.possibleMonsters.splice(time.possibleMonsters.indexOf(action[1]), 1);
          }
          if (time.killedMonsters.indexOf(action[1]) === -1) {
            time.killedMonsters.push(action[1]);
          }
          action[1].id = 0;
          time.safeTiles.push(action[1]);
          console.log('MONSTER KILLED!')
          player.queue = [];
          this.myMap.desensify().sensify();
        } else {
      // if the tile doe
          console.log('You shot but the monster was not in that tile');
          player.ammo -= 1;
          time.possibleMonsters.splice(time.possibleMonsters.indexOf(action[1]), 1);
        }
      }

      // Our last possible action is take, which alllows our player to take the gold.

      if (action[0] === 'Take') {  
        player.gold = true;
        time.takenGold = 1;
        
      }
      //
      if (!action) {
        console.log('It is over');
      } 
      
      return this;
    },

    'eliminator' : function (adjacentTiles, totalSenses) {
    	var currentHistory = this.history[this.time],
    	    senses = ['Breeze', 'Smell', 'Shine'],
    	    possibilities = ['possiblePits','possibleMonsters','possibleGold'],
    	    returnValue = false;
    	// Loop through possible pits, monsters and gold
  	  for (var i = 0; i < possibilities.length; i += 1) {
        // Loop through each member of possible pits, monsters or gold
        for (var k = 0; k < currentHistory[possibilities[i]].length; k += 1) {
            // if there is a possible pit, monster or gold saved in our history associated to an adjacent tile 
            // and we dont have that sense in our current tile we can rule out the adjacent possible pit, monster or gold
					if (adjacentTiles.indexOf(currentHistory[possibilities[i]][k]) !== -1 &&
						  totalSenses.indexOf(senses[i]) === -1) {
						currentHistory[possibilities[i]].splice(currentHistory[possibilities[i]].indexOf(currentHistory[possibilities[i]][k]), 1);
					  returnValue = true;
					}
        }
   	  }
      //Will be returned false if nothing was eliminated
   	  return returnValue; 
    },

    'checkCertainty' : function () {
      var checkedTiles = [],
          currentSenses,
          adjacentTiles,
          possibleSenses = {
          	'Breeze': 'possiblePits', 
          	'Smell': 'possibleMonsters',
          	'Shine': 'possibleGold'
          },
          definitiveSenses = {
          	'Breeze': 'pits',
          	'Smell': 'monsters',
          	'Shine': 'gold'
          },
          counter = 0,
          definitiveTile, possibilityList, definitiveList;
      // for every point in time where we recorded a history
      for (var t = this.time; t >= 0; t -= 1) {
      	// if this is the first time we are analyzing it (we want the most recent history for each tile)
        if (checkedTiles.indexOf(this.history[t].currentTile) === -1) {
        	checkedTiles.push(this.history[t].currentTile);
        	//get the senses of the tile at that time in history and get its adjacent tiles
        	currentSenses = this.history[t].senses;
          adjacentTiles = this.myMap.getAdjacentTiles(this.history[t].col, this.history[t].row);
          //for each of that tiles senses
          if (currentSenses.length) {
            for (var i = 0; i < currentSenses.length; i += 1) {
              counter = 0;
              possibilityList = this.history[this.time][possibleSenses[currentSenses[i]]];
              definitiveList = this.history[this.time][definitiveSenses[currentSenses[i]]];
              //Loop through the possible pits, monsters and gold for each sense
              for (var k = 0; k < adjacentTiles.length; k += 1) {
                if (possibilityList.indexOf(adjacentTiles[k]) !== -1) {
                  counter += 1;
                  definitiveTile = adjacentTiles[k];
                  
                }
                if (definitiveList.indexOf(adjacentTiles[k]) !== -1) {
                  counter += 2;
                }
              }
              // Make that possibility a certainty if the counter is one, because we can say for certain that
              // if we only have one possible location for a pit, it must be a pit.
              if (definitiveTile && counter === 1 && definitiveList.indexOf(definitiveTile) === -1) {
                definitiveList.push(definitiveTile);
                possibilityList.splice(possibilityList.indexOf(definitiveTile), 1);
              }
            }
          } 
        }
      }
    },

    'generatePath': function (start, end, shooting) {
        //create a path to the ladder through the safe tiles we know about
        var time = this.time,
            history = this.history[time],
            tileMap = this.generateTileMap(start, end);
        tileMap.endCol = end.col;
        tileMap.endRow = end.row;
        //if the starting and ending tile are not equal
        if (start.row !== end.row || start.col !== end.col) {
          var path = aStar({
            'start': start, 
            'end': end, 
            'gameState': tileMap
          }).finalPath;
          if (path.length) {
            this.myMap.player.queue = [];
            path.reverse();
            if (path[path.length -1] !== end) {
              path.push(end);
            }/*
            console.log('Follow path from ' + this.myMap.player.col + ', ' + this.myMap.player.row + ' to ' + path[path.length - 1]);
            console.log('This is the path');
            console.log(path)*/
            for (var i = 0; i < path.length; i += 1) {
              this.myMap.player.queue.push(['Move', path[i]]);
            }
            // If the last element of the array contains the gold we need to add a take action onto the end
            if (path[path.length - 1].id === 'Gold') {
              this.myMap.player.queue.push(['Take', path[path.length -1]]);
            }
            //If we are shooting we need to add shoot onto it
            if (shooting) {
              console.log('SHOOOTTTT')
              this.shootingLogic(shooting);
            }
            return true;
          } else {
            console.log('Cannot make a path...')
            console.log(path)
            return false;
          }
        } else {
          //start and end are the same tile.
          if (shooting) {
            console.log('SHOOOTTTT')
            this.shootingLogic(shooting);
            return true;
          } else {
            return true;
          }
        }
      },

    'shootingLogic' : function (shooting) {
      var time = this.time,
          history = this.history[time],
          lastMove,
          adjacentMoves;
      if (history.monsters.length) {
        this.myMap.player.queue.push(['Shoot', shooting]);
      } else if (this.myMap.player.queue[this.myMap.player.queue.length - 1]) {
        lastMove = this.myMap.player.queue[this.myMap.player.queue.length - 1];
        adjacentMoves = this.myMap.getAdjacentTiles(lastMove[1].col, lastMove[1].row);
        for (var i = 0; i < adjacentMoves.length; i += 1) {
          if (history.possibleMonsters.indexOf(adjacentMoves[i]) !== -1) {
            this.myMap.player.queue.push(['Shoot', adjacentMoves[i]]);
          }
        }
      } else {
        //there is no previous move
        console.log('THERE IS NOT PREVIOUS MOVE')
        console.log(this.over)
        adjacentMoves = this.myMap.getAdjacentTiles(this.myMap.player.col, this.myMap.player.row);
        for (var i = 0; i < adjacentMoves.length; i += 1) {
          if (history.possibleMonsters.indexOf(adjacentMoves[i]) !== -1) {
            this.myMap.player.queue.push(['Shoot', adjacentMoves[i]]);
          }
        }
      }
    },

    'updatePotentials' : function (totalSenses, adjacentTiles) {
      var senses = {
      	'Breeze': 'possiblePits', 
      	'Smell': 'possibleMonsters',
      	'Shine': 'possibleGold'
      },
      time = this.history[this.time],
      safeTiles = time.safeTiles;
      //for each adjacent tile to the one we are looking at

      if (!totalSenses.length) {
        //if there are no senses then there aren't any potential things we need to add to our lists
        return;
      }
      //If all we sense is a shine, make all adjacent tiles safe and put them in the possibleGold list
      if (totalSenses[0] === 'Shine' && totalSenses.length === 1) {
        for (var i = 0; i < adjacentTiles.length; i += 1) {  
          if (time.safeTiles.indexOf(adjacentTiles[i]) === -1) {
            time.safeTiles.push(adjacentTiles[i]);
            if (time[senses[totalSenses[0]]].indexOf(adjacentTiles[i]) === -1) {
              time[senses[totalSenses[0]]].push(adjacentTiles[i]);
            }
          }
        }
      }
      //only for senses that aren't gold, loop through each adjacent tile and put them in the possibility lists
      for (var i = 0; i < adjacentTiles.length; i += 1) {
        //for each sense of the current tile
        for (var k = 0; k < totalSenses.length; k += 1) {
        	//if the possibility list for that sense does not contain the adjacent tile and its not a known safe tile
        	if (time[senses[totalSenses[k]]].indexOf(adjacentTiles[i]) === -1 && safeTiles.indexOf(adjacentTiles[i]) === -1) {
        		//put that adjacent tile in the possibility list
        		time[senses[totalSenses[k]]].push(adjacentTiles[i]);
        	}
        }
      }
    },

    'generateTileMap': function (start, end) {
      var tileMap = [],
          rows = [],
          cols = [],
          id, 
          startRow, endRow, startCol, endCol,
          safeTiles = this.history[this.time].safeTiles;
      // gather the rows and columns of the safe tiles we have in our history at this point in time
      for (var i = 0; i < safeTiles.length; i += 1) {
        rows.push(safeTiles[i].row);
        cols.push(safeTiles[i].col);
      }
      // we will sort here because we need to know how large to make our tile map
      rows.sort();
      cols.sort();
      // the starting row will be determined by the lowest row in our safe tiles and the highest row by the
      // highest row in our safe columns.  The same processw ill be completed for our columns.
      startRow = rows[0];
      endRow = rows[rows.length - 1];
      startCol = cols[0];
      endCol = cols[cols.length - 1];
      // We will generate the tile map here and any tiles outside of our known area will be undefined
      for (var col = startCol; col <= endCol; col += 1) {
        tileMap[col] = [];
        for (var row = startRow; row <= endRow; row += 1) {
          if (start && start.row === row && start.col === col) {
            id = 'Start'
          }
          if (end && end.row === row && end.col === col) {
            id = 'End'
          }
          if (safeTiles.indexOf(this.map[col][row]) !== -1) {
            tileMap[col][row] = {
              'id': id ? id : 0
            };
          } else {
            tileMap[col][row] = {
              'id' : id ? id : 'Blocked'
            };
          
          }
          id = undefined;
        } 
      }
      // At this point we will have a tile map to return that is filled with 0's, start, end, blocked and undefined.  When we 
      // generate a path with aStar we will view 0's as safe and both blocked and undefined as not safe.
      return tileMap;
    },

    'findClosestSafe' : function () {
      // We do not have any adjacent unvisited safe tiles to move to so we will have to make a path to a safe tile we have not
      //visited yet.  We have to choose one to go to so we will pick the closest.
      
      var time = this.time,
          history = this.history[time],
          currRow = this.myMap.player.row,
          currCol = this.myMap.player.col,
          //arbitrarily set to 1,000,000 so the first time in the loop it gets over written
          finalOffset = 1000000,
          tileToReturn;
      
      // Loop through the tiles that are both safe and unvisited tiles and find the one that has
      // the lowest row and column offset from our current position

      for (var i = 0; i < history.safeTiles.length; i += 1) {
        if (history.visitedTiles.indexOf(history.safeTiles[i]) === -1) {
            var tempRowOffset = Math.abs(history.safeTiles[i].row - currRow),
              tempColOffset = Math.abs(history.safeTiles[i].col - currCol),
              tempOffset = tempRowOffset + tempColOffset;

          if (tempOffset < finalOffset) {
            finalOffset = tempOffset;
            tileToReturn = history.safeTiles[i];
          }
        }  
      }
   
      return tileToReturn;
    },

    'moveAdjacent' : function (adjacentTiles) {
      var storedMove;
          time = this.time,
          history = this.history[time];
      for (var i = 0; i < adjacentTiles.length; i += 1) {
        // if the adjacent tile has not been visited we will store it because we will want to visit an unvistied 
        // safe tile for our move.
        if (history.safeTiles.indexOf(adjacentTiles[i]) !== -1 && history.visitedTiles.indexOf(adjacentTiles[i]) === -1) {
          storedMove = adjacentTiles[i];
        }
      } 
      // If we have visited all of its adjacent tiles, we need to find the closest
        if (storedMove) {
          //move the player
          if (storedMove.id === 'Gold') {
            this.myMap.player.queue.push(['Move', storedMove]);
            this.myMap.player.queue.push(['Take', storedMove]);
            return true;
          } else {
            this.myMap.player.queue.push(['Move', storedMove]);
            return true;
          }
        } else {
        return false;
      }
    },

    'makeDecision' : function (totalSenses) {
      //Our adjacent tiles will be up, down left and right if they are on the map
      var adjacentTiles = this.myMap.getAdjacentTiles(this.myMap.player.col, this.myMap.player.row),
          currTile = this.myMap.player,
          time = this.time,
          history = this.history[time];
          

     // If we have the gold and know where the ladder is lets make a path to the ladder if we can  

      if (history.takenGold && history.ladder[0]) {
        
        if (this.generatePath(currTile, history.ladder[0])) {
          return;
        }
      //else if we know where the gold is but we do not have it see if it is locatedin an adjacent tile, 
      // if not try to make a path to it

      } else if (history.gold[0] && !history.takenGold) {
        /*if (adjacentTiles.indexOf(history.gold[0])) {
          this.myMap.player.queue = [];
          this.myMap.player.queue.push(['Move', history.gold[0]]);
          this.myMap.player.queue.push(['Take', history.gold[0]]);
          return; 
        } else*/
         if (this.generatePath(currTile, history.gold[0])) {
          console.log('know where gold is and have not taken it');
          return;
        }
      }

      // Now the next best thing we can do is explore adjacent tiles that are safe and unvisited
      // Do we have an adjacent tile that is both safe and unvisited?, if we do, moveAdjacent 
      // will return true and we will return from this function and make the move

      if (this.moveAdjacent(adjacentTiles)) {
        return;
      }

      // Now we know we can not make an adjacent move, we will have to make a path to the closest 
      // unvisited safe tile if there are any safe tiles we have not visited.

      if (history.safeTiles.length !== history.visitedTiles.length) {
        if (this.generatePath(currTile, this.findClosestSafe())) {
          return;
        }
      }
      // Now we know that we do not have any more unvisited safe tiles, we have the option to shoot at the monster.
      // The first situation is when we know where the monster is, we can make a path there and shoot it

      // But first we need to get a safe tile that is adjacent to the monster to shoot from
      if (this.myMap.player.ammo) {
        if (history.monsters[0]) {
          var monsterToShoot = history.monsters[0],
              adjacentTilesToMonster,
              counter = 0,
              lastCounter = 0;
          for (var i = 0; i < history.monsters.length; i += 1) {
            adjacentToMonster = this.myMap.getAdjacentTiles(history.monsters[i].col, history.monsters[i].row);
            for (var j = 0; j < adjacentToMonster.length; j += 1) {
              if (history.safeTiles.indexOf(adjacentToMonster[j]) === -1) {
                if (history.possibleGold.indexOf(adjacentToMonster[i]) !== -1) {
                  counter = 1000000;
                } else {
                  counter += 1;
                }
              }
            }
            if (counter > lastCounter) {
              lastCounter = counter;
              monsterToShoot = history.monsters[i];
            }
          }
          var adjacentToMonster = this.myMap.getAdjacentTiles(monsterToShoot.col, monsterToShoot.row);

          for (var i = 0; i < adjacentToMonster.length; i += 1) {
            if (history.safeTiles.indexOf(adjacentToMonster[i]) !== -1) {
              if (this.generatePath(currTile, adjacentToMonster[i], monsterToShoot)) {
                return;
              }
            }
          }
        }

        // The second situation is that we do not know where the monster is for certain but we have some possibilites to try
        //We need to get adjacent to this spot

        if (history.possibleMonsters[0]) {
          var possibleMonster = history.possibleMonsters[0],
              adjacentToPossibleMonster = this.myMap.getAdjacentTiles(possibleMonster.col, possibleMonster.row);

          for (var i = 0; i < adjacentToPossibleMonster.length; i += 1) {
            if (history.safeTiles.indexOf(adjacentToPossibleMonster[i]) !== -1) {
              console.log(currTile)
              console.log(adjacentToPossibleMonster[i])
              if (this.generatePath(currTile, adjacentToPossibleMonster[i], 1)) {
                return;
              }
            }
          }
        }
      } else {
        console.log('OUT OF AMMO!')
      }

      // The last situation is that we do not even have a clue where the monster is and the game is over.
      this.over = true;

      return this;
    }

  };

  var init = function (that) {
    
      that.history[0] = {
        'senses': that.myMap.map[that.myMap.player.col][that.myMap.player.row].totalSenses || [],
        'monsterAlive' : true,
        'currentTile' : that.map[that.myMap.player.col][that.myMap.player.row],
        'row' : that.myMap.player.row,
        'col' : that.myMap.player.col,
        'time': 0,
        'visitedTiles' : [that.map[that.myMap.player.col][that.myMap.player.row]],
        'safeTiles': [that.map[that.myMap.player.col][that.myMap.player.row]],
        'pits': [],
        'gold': [],
        'possiblePits': [],
        'monsters': [],
        'possibleMonsters': [],
        'killedMonsters' : [],
        'possibleGold' : [],
        'ladder': [],
        'takenGold': 0
      }
      that.over = false;
      that.myMap.player.queue = [];
      that.observe();
    return that;
  }

  return function (OO) {
  	return init(Object.create(logicProto).extend(OO));
  }

}());
},{"./astar":5}],3:[function(require,module,exports){
module.exports = (function () {
  var tile = require('./tile');
  var boardProto = {

    'columns' : 10,

    'rows' : 10,
    
    'pitColor' : '#dd0000',
    'monsterColor' : '#014421',
    'ladderColor' : '#98744e',
    'goldColor' : '#fbff00',
    'playerColor' : '#ff208c',

    'maxPit': 10,
    'maxMonster': 10,
    'maxLadder': 1,
    'maxGold': 1,
    'maxAmmo': 1,

    'createGameArray' : function () {
      var gameState = [];
      for (var col = 0; col < this.columns; col += 1) {
        gameState.push([])
        for (var row = 0; row < this.rows; row += 1) {
          gameState[col].push(tile({
            'id': 0, 
            'row' : row, 
            'col' : col, 
            'board' : this,
            'mutable' : [],
            'immutable' : []  
          }));
        }
      }
      this.map = gameState;
      return this;
    },

    'drawMidGameBoard' : function (history) {

      var ctx = this.ctx,
          myCanvas = this.canvas,
          tileWidth = this.canvas.width / this.rows,
          tileHeight = this.canvas.height / this.columns,
          tileId,
          history = history || {},
          safe = history.safeTiles,
          visited = history.visitedTiles,
          pits = history.pits,
          monsters = history.monsters,
          gold = history.gold,
          ladder = history.ladder;

      //draw outline

      ctx.lineWidth = 3;
      ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

      //draw the tiles

      for (var col = 0; col < this.columns; col += 1) {
        for (var row = 0; row < this.rows; row += 1) {
          tileId = this.map[col][row].id;
          ctx.strokeStyle = 'black'
          ctx.lineWidth = 2;
          ctx.fillStyle = '#000000';

          if (safe) {
            if (safe.indexOf(this.map[col][row]) !== -1) {
              ctx.strokeStyle = 'green'
              ctx.fillStyle = '#ffffff'
              ctx.lineWidth = 8
            }
          }
          if (visited) {
            if (visited.indexOf(this.map[col][row]) !== -1) {
              ctx.strokeStyle = 'blue'
              ctx.fillStyle = '#ffffff'
              ctx.lineWidth = 8
            }
          }
          if (pits) {
            if (pits.indexOf(this.map[col][row]) !== -1) {
              ctx.fillStyle = this.pitColor;
            }
          }
          if (monsters) {
            if (monsters.indexOf(this.map[col][row]) !== -1) {
              ctx.fillStyle = this.monsterColor;
            }
          }

          if (tileId === 'Player') {
            ctx.fillStyle = this.playerColor;
          } else if (tileId === 'Gold') {
            ctx.fillStyle = this.goldColor;
          } else if (tileId === 'Ladder') {
            ctx.fillStyle = this.ladderColor;
          }
          ctx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
          ctx.strokeRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
        }
      }
      return this;
    },

    'drawGameBoard' : function (safeTiles, visitedTiles) {
      var ctx = this.ctx,
          myCanvas = this.canvas,
          tileWidth = this.canvas.width / this.rows,
          tileHeight = this.canvas.height / this.columns,
          tileId;
      //draw outline

      ctx.lineWidth = 3;
      ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

      //draw the tiles

      for (var col = 0; col < this.columns; col += 1) {
        for (var row = 0; row < this.rows; row += 1) {
          tileId = this.map[col][row].id;
          ctx.strokeStyle = 'black'
          ctx.lineWidth = 5;
          if (tileId === 0) {
            ctx.fillStyle = '#ffffff';
          } else if (tileId === 'Pit') {
            ctx.fillStyle = this.pitColor;
          } else if (tileId === 'Monster') {
            ctx.fillStyle = this.monsterColor;
          } else if (tileId === 'Gold') {
            ctx.fillStyle = this.goldColor;
          } else if (tileId === 'Ladder') {
            ctx.fillStyle = this.ladderColor;
          } else if (tileId === 'Player') {
            ctx.fillStyle = this.playerColor;
          }
          
          if (safeTiles) {
            if (safeTiles.indexOf(this.map[col][row]) !== -1) {
              ctx.strokeStyle = 'green';
              ctx.lineWidth = 11;
            }
          }
          if (visitedTiles) {
            if (visitedTiles.indexOf(this.map[col][row]) !== -1) {
              ctx.strokeStyle = 'blue';
              ctx.lineWidth = 11;
            }
          }
          
          ctx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
          ctx.strokeRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
        }
      }
      return this;
    },
    
    'generateObstacle' : function () {

      var colLength = this.map[0].length,
          rowLength = this.map.length,
          ids = ['Pit','Monster','Gold','Ladder'],
          senses = ['Breeze', 'Smell', 'Shine', undefined],
          max = [this.maxPit,this.maxMonster,this.maxGold,this.maxAmmo,this.maxLadder],
          numObjs;
      
      for (var i = 0; i < ids.length; i += 1) {
        numObjs = Math.floor(Math.random()* max[i]) || i === 0 || i === 1 ? 5 : 1;
        for (var k = 0; k < numObjs; k += 1) {
          var randPos = this.getRandPos();
          //get tile and set id
           
          this.map[randPos[0]][randPos[1]].id = ids[i];
          this.map[randPos[0]][randPos[1]].sense = senses[i];
            
        }
      }
      return this;
    
    },
    
    'desensify' : function () {
      for (var row = 0; row < this.rows; row += 1) {
        for (var col = 0; col < this.columns; col += 1) {
          if (this.map[col][row].mutable.length) {
            this.map[col][row].mutable = [];
          }
        }
      }
      return this;
    },

    'getRandPos' : function () {
      var  startX = Math.floor(Math.random()* this.columns),
           startY = Math.floor(Math.random()* this.rows);

      if (this.map[startX][startY].id === 0) {
        return [startX, startY];
      } else {
        return this.getRandPos();
      }
    
  },
  
  'sensify' : function  (isFirstTime) {
    //for every row and for every column
    for (var row = 0; row < this.rows; row += 1) {
      for (var col = 0; col < this.columns; col += 1) {
        //if the tile is a pit, monster, or gold then get the adjacent tiles
        this.map[col][row].totalSenses = this.map[col][row].getTotalSenses();
        if (this.map[col][row].id !== 0 && this.map[col][row].id !== 'Ladder' && this.map[col][row].id !== 'Player') {
          var adjacents = this.getAdjacentTiles(col, row);
          //for every adjacent tile
          for (var i = 0;  i < adjacents.length; i += 1) {
            //if the adjacent tile is a 0, ladder, or player, then we want to put a sense in it
            //if (adjacents[i].id === 0 || adjacents[i].id === 'Ladder' || adjacents[i].id === 'Player' || adjacents[i].id === 'Gold') {
              //if the tile is a pit, then put the sense in the immutable list of the adjacent tile,
              //otherwise, put the sense in the mutable list of the adjacent tile.
              if (this.map[col][row].id !== 'Pit') {
                if (adjacents[i].mutable.indexOf(this.map[col][row].sense) === -1) {
                  adjacents[i].mutable.push(this.map[col][row].sense);
                } 
              } else if (isFirstTime) {
                if (adjacents[i].immutable.indexOf(this.map[col][row].sense) === -1) {
                  adjacents[i].immutable.push(this.map[col][row].sense);
                }
              }
              adjacents[i].totalSenses = adjacents[i].getTotalSenses();
            }
          //}
        }
      }
    }
    return this;
  },

  'getAdjacentTiles' : function (col, row) {
    var adjacents = [];
    for (var startCol = col - 1; startCol <= col + 1; startCol += 1) {
      for (var startRow = row - 1; startRow <= row + 1; startRow += 1) {
        if (this.map[startCol] && 
            this.map[startCol][startRow] && 
            (this.map[col][row] !== this.map[startCol][startRow]) &&
            (startCol === col || startRow === row)) {
          adjacents.push(this.map[startCol][startRow]);
        }
      }
    }
    return adjacents;
  },

  'placePlayer' : function () {
    var randPos = this.getRandPos();
    this.map[randPos[0]][randPos[1]].id = 'Player';
    this.player = {
      'col': randPos[0],
      'row': randPos[1],
      'ammo': 3,
      'queue' :  []
    };
    return this;
  }



  }

  var init = function (that) {
    that.createGameArray().generateObstacle().placePlayer().sensify(1).drawMidGameBoard();
    return that;
  }

  return function (OO) {
    return init(Object.create(boardProto).extend(OO));
  }             

}());
},{"./tile":6}],6:[function(require,module,exports){
module.exports = (function () {
	
	var tileProto = {
	  'getTotalSenses' : function () {
	    var array = [];
      for (var i = 0; i < this.mutable.length; i += 1) {
      	array.push(this.mutable[i]);
      }
      for (var i = 0; i < this.immutable.length; i += 1) {
      	array.push(this.immutable[i]);
      }
      return array;
	  } 
	}

	return function (OO) {
    return Object.create(tileProto).extend(OO);
	}

}())
},{}],5:[function(require,module,exports){
module.exports = (function () {

  var astarTile = require('./astarTile')
  aStarProto = {

  	'current' : undefined,

  	'aStar' : function () {
  		var gameState = this.gameState,
  		    tempCurrent;

      if(!this.openSet.length) {
   
        return false;
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

      if (this.gameState[this.endTile.col] && this.current === this.gameState[this.endTile.col][this.endTile.row]) {
   
        this.finalPath = [];
      	this.setPath(this.current.parent);
   
      	return;
      }
      this.aStar()
  	},

  	'fillOpenSet' : function () {
  
  		var gameState = this.gameState,
          currTile;

      for (var i = this.current.col - 1; i <= this.current.col + 1; i += 1) {
      	for (var k = this.current.row - 1; k <= this.current.row + 1; k += 1) {

          if (gameState[i] && gameState[i][k] && (k === this.current.row || i === this.current.col)) {
            currTile = gameState[i][k];

            if (currTile !== undefined && currTile.id !== 'Blocked' && this.closedSet.indexOf(currTile) === -1) {
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
  		if (tile.id === "Start") {

        return this.finalPath;
      }
      if (this.gameState[tile.col] && this.gameState[tile.col][tile.row]) {
        this.finalPath.push(this.gameState[tile.col][tile.row]);
      }
  		this.setPath(tile.parent);

  	}

  }
  
  var init = function (that) {

    that.openSet =  [];
  	that.closedSet = [];
    that.endTile = that.end;
    var startTile = that.start.extend(astarTile({
      'board': that.gameState,
      'col': that.start.col,
      'row': that.start.row
    }));
    for (var i = 0; i < that.gameState.length; i += 1) {
      if (that.gameState[i] && that.gameState[i].length) {
        for (var k = 0; k < that.gameState[i].length; k += 1) {

          if (that.gameState[i][k]) {
            that.gameState[i][k].extend(astarTile({
              'board': that.gameState,
              'col': i,
              'row': k
            }))
          }
        }
      }
    }
    

  	startTile.parent = startTile;
    startTile.parent.id = 'Start';
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

},{"./astarTile":7}],7:[function(require,module,exports){
module.exports = (function () {
	
  var tileProto = {
	  
	  'gScore' : undefined,
	  'hScore' : undefined,
	  'fScore' : undefined,
	  
	  'parent' : undefined,
    
    'getGScore' : function (current) {
      if(current === undefined) {
        
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

	return function (OO) {

	  return Object.create(tileProto).extend(OO);
	}

}())
},{}]},{},[1])
;