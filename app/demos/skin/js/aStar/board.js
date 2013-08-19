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

