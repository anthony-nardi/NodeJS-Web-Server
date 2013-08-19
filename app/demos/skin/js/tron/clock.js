module.exports = (function () {
  
  var tickList = require('./tickList'),

      clockProto = {
        'now' : 0,
        'dt' : 0,
        'dtBuffer' : 0,
        'last' : 0,
        'looping' : false,
        'SIM_RES' : 10,

        'loop' : function () {
          var that = this;   
          this.now = Date.now();
          this.dt = (this.now - this.last);
          this.dtBuffer += this.dt;
          this.input.update();
          while (this.dtBuffer >= this.SIM_RES) {
            this.model.update();
            this.dtBuffer -= this.SIM_RES;
          }
          this.render.update();
          if(this.looping === true) {
            this.last = this.now;
            setTimeout(function () {
              that.loop.call(that);
            }, 1);
          }
          return this;
        },
        'start' : function () {
          if(this.looping === false) {
            this.last = Date.now();
            this.looping = true;
            this.loop();
          }
          return this;
        },
        'stop' : function () {
          this.looping = false;
          return this;
        }

      };
      
  return function (OO) {
    return Object.create(clockProto).extend(OO).extend({
      'input' : tickList(),
      'model' : tickList(),
      'render': tickList()
    })
  }

}());


