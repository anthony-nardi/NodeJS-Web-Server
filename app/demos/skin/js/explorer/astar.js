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
