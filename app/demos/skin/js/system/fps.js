moduleLoader.imports('fps', [], function () {

  var prototype = {
    
    'start' : function () {
      
      if (!this.frames) {
        this.frames = 0;
      }
      
      if (!this.startTime) {
        this.startTime = Date.now();
      }

      if (!this.fps) {
        this.fps = 0;
      }
    
    },
    
    'end' : function () {
    
      var time = Date.now();

      this.frames += 1;

      if (time > this.startTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (time - this.startTime));
        this.startTime = time;
        this.frames = 0;
      }

      console.log(this.fps);
    
    }
  
  };

  return prototype;

});