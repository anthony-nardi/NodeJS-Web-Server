module.exports = (function () {

  var tickListProto = {
    'update' : function () {
      for (var i = 0; i < this.list.length; i += 1) {
      	this.list[i]();
      }
      return this;
    },
    'add' : function (fn) {
      this.list.push(fn);
      return this;
    }
  };

  return Object.create(tickListProto).extend(tickListProto).extend({
  	'list' : []
  });

});