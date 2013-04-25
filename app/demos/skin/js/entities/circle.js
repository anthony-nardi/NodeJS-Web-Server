moduleLoader.imports('circle', ['unit', 'mainView'], function (unit, mainView) {

  var circle = Object.create(unit).extend({

    'ctx': mainView.getContext(),

    'radius': 100,
    
    'lineWidth': 4,

    'mass': {
      'from': 0,
      'to'  : 200,
      'now' : 100
    },

    'color': {
    
      'from': {
        'r': 73,
        'g': 226,
        'b': 14
      },
    
      'to': {
        'r': 0,
        'g': 0,
        'b': 0        
      },
    
      'now': {
        'r': 73,
        'g': 226,
        'b': 14
      }
    
    },
    
    'state': {

      'render': true,
      'fill'  : false,
      'empty' : false

    },

    'getColor': function (color) {
      return 'rgb(' 
        + Math.floor(color.r) + ',' 
        + Math.floor(color.g) + ',' 
        + Math.floor(color.b) + ')';
    },  

    'changeColor': function (from, to, delta) {
      
      if (from.r - to.r !== 0) {
        from.r -= (from.r - to.r) * delta;
        from.r < 1 ? from.r = 0 : from.r > 255 ? from.r = 255 : from.r = from.r;
      }
      
      if (from.g - to.g !== 0) {
        from.g -= (from.g - to.g) * delta;
        from.g < 1 ? from.g = 0 : from.g > 255 ? from.g = 255 : from.g = from.g;
      }
      
      if (from.b - to.b !== 0) {
        from.b -= (from.b - to.b) * delta;  
        from.b < 1 ? from.b = 0 : from.b > 255 ? from.b = 255 : from.b = from.b;
      }
    
    },

    'changeMass': function (from, to, delta) {

      if (from - to !== 0) {
        from -= (from - to) * delta;
      }

    },
  
    'drawCircleOnPoint': function (point) {
     
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, this.radius * mainView.zoom, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = this.lineWidth * mainView.zoom;
        this.ctx.strokeStyle = this.getColor(this.color.now);
        this.ctx.stroke();
    
    },

    'handle': {
      
      'mousemove': function () {
        this.vector((mainView.getCurrentPointerPosition().x 
                  + mainView.scroll.x)  / mainView.zoom, 
                    (mainView.getCurrentPointerPosition().y 
                  + mainView.scroll.y)  / mainView.zoom);
      },
      
      'mousedown': function () {
        this.state.fill = true;
        this.state.empty = false;
      },

      'mouseup': function () {
        this.state.fill = false;
        this.state.empty = true;
      }
    
    },

    'fill': function () {
      
      var step = undefined;
      
      if (this.radius > 100 / Math.PI) {
        step = this.radius * .02;
        this.radius -= step;
        this.lineWidth += step;
        var delta = step / Math.abs(this.radius - 100/Math.PI)
        this.changeColor(this.color.now, this.color.to, delta);
        this.changeMass(this.mass.now, this.mass.to, delta);
      
      } else {
      
        this.state.fill = false;
      
      }
    
    },

    'empty': function () {

      var step = undefined;

      if (this.lineWidth > 4) {
      
        step = this.radius * .02
        this.radius += step;
        this.lineWidth -= step;
        var delta = step / (100 - this.radius)
        this.changeColor(this.color.now, this.color.from, delta);
        this.changeMass(this.mass.now, this.mass.from, delta);

      } else {
      
        this.state.empty = false;
      
      }
    
    }

  }).on('update', function () {

    if (this.state.fill) {
      this.fill();
    }

    if (this.state.empty) {
      this.empty();
    }

  }).on('render', function () {
    
    if (this.state.render) {
      this.drawCircleOnPoint(mainView.getCurrentPointerPosition());    
    }
  
  }).inputs();

  return circle;

});