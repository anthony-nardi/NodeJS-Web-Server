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