moduleLoader.imports('vector', [], function () {
  
  var prototype = {
  
    'vector': function (x, y) {
    
      this.vx = x;
      this.vy = y;
    
      return this;
    
    },
  
    'scale': function (magnitude) {
    
      this.vx *= magnitude;
      this.vy *= magnitude;
    
      return this;
    
    },

    'scaleX': function (magnitude) {
      this.vx *= magnitude;
      return this;
    },

    'scaleY': function (magnitude) {
      this.vy *= magnitude;
      return this;
    },
  
    'add': function (vector) {
    
      this.vx += vector.vx;
      this.vy += vector.vy;
    
      return this;
    
    },
  
    'sub': function (vector) {
    
      this.vx -= vector.vx;
      this.vy -= vector.vy;
    
      return this;

    },
  
    'negate': function () {
      
      this.vx = -(this.vx);
      this.vy = -(this.vy);
      
      return this;
    
    },
  
    'length': function () {
  
      return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  
    },
  
    'lengthSquared': function () {
    
      return this.vx * this.vx + this.vy * this.vy;
    
    },
  
    'normalize': function () {
    
      var len = this.length();
    
      if (len) {
        this.vx /= len;
        this.vy /= len;
      }
    
      return this;
    
    },
  
    'rotate': function (angle) {
    
      var vx = this.vx,
          vy = this.vy,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);
      this.vx = vx * cosVal - vy * sinVal;
      this.vy = vx * sinVal + vy * cosVal;
    
      return this;

    },
  
    'toString': function () {
      return '(' + this.vx.toFixed(3) + ', ' + this.vy.toFixed(3) + ')';
    },

    'toRadians': function () {
      return Math.atan2(this.vy, this.vx);
    }
  
  };

  return prototype;

});