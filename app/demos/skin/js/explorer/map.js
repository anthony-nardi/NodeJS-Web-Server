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