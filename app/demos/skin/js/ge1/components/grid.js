moduleLoader.imports("grid", ['canvas'], function (canvas) {

  var prototype = Object.create(canvas);

  prototype.extend({
    
    'tileMap' : undefined,
    'tile'    : undefined,
    'width'   : undefined,
    'height'  : undefined,
    'gridId'  : undefined,
    'handle'  : prototype.handle || [],
    
    'initializeGrid': function (config) {
    
      if (config.height && config.width) {

        this.tileMap = [];
        this.gridId = config.id;
        delete config.id;

        for (var prop in config) {
          if (config.hasOwnProperty(prop)) {
            this[prop] = config[prop];        
          }
        }

        for (var i = 0; i < this.width; i += 1) {
          this.tileMap[i] = [];
          for (var j = 0; j < this.height; j += 1) {
            this.tileMap[i][j] = [];
          }
        }

      }

      return this;
    
    },
    
    'getWidth': function () {

      return this.width + 1;
    
    },
    
    'getHeight': function () {
    
      return this.height + 1;
    
    }
  
  });

  var grid = Object.create(prototype);

  return grid;

});