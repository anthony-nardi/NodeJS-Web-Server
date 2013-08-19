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