moduleLoader.imports('viewport', ['grid'], function (grid) {
  
  var prototype = Object.create(grid);
   
  prototype.extend({
     
    'state': {      
      'zooming' : 0,    
      'moving'  : false    
    },
    
    'handle': {},
    
    'zoom' : 1,
    
    'scroll': {    
      'x' : 0,    
      'y' : 0    
    },

    'getClickedTile': function (event) {
     
      var coordinates = this.translateEventToPointerPosition(event);
     
      return {
        'x': Math.floor((coordinates.x + this.scroll.x) / this.getTileWidth()),
        'y': Math.floor((coordinates.y + this.scroll.y) / this.getTileHeight())
      };
    
    },

    'getTile': function (x, y) { //gets the tile of coordinate pair
    
      return {
        'x': Math.floor((x) / this.tile.width),
        'y': Math.floor((y) / this.tile.height)
      }
    
    },

    'getTouchedTiles': function (object) {
      
      var x = object.x,
          y = object.y,
          w = object.width,
          h = object.height,
          topleft = this.getTile(x - w / 2, y - h / 2),
          topright = this.getTile(x + w / 2, y + h / 2),
          botleft = this.getTile(x - w / 2, y + h / 2),
          botright = this.getTile(x + w / 2, y - h / 2);
      
      return {
        'topleft': topleft,
        'topright': topright,
        'botleft': botleft,
        'botright': botright
      };

    },

    'getTilePosFromPointer': function (point) {

      var tilePos = this.getTile(
        (point.x + this.scroll.x) / this.zoom,
        (point.y + this.scroll.y) / this.zoom
      );
  
      return tilePos;
      
    },

    'getTileContents': function (x, y) {
      if (this.tileMap[x] && this.tileMap[x][y]) {
        return this.tileMap[x][y];
      }
      return false    
    },

    'getTileWidth': function () {

      return Math.round(this.tile.width * this.zoom);
    
    },
    
    'getTileHeight': function () {
    
      return Math.round(this.tile.height * this.zoom);
    
    },
    
    'tileOffsetX': function () {
    
      return Math.floor(this.scroll.x / this.getTileWidth());    
    
    },
    
    'tileOffsetY': function () {
      
      return Math.floor(this.scroll.y / this.getTileHeight());
  
    },
    
    'tileOffset': function () {
    
      return {

        'x' : Math.floor(this.scroll.x / this.getTileWidth()),
        'y' : Math.floor(this.scroll.y / this.getTileHeight())
      
      };
    
    },
        
    'maxTilesInView' : function () {
    
      return this.maxTilesInRow() * this.maxTilesInCol();
   
    },
    
    'maxTilesInRow' : function () {
    
      return Math.floor(this.getElement().width / this.getTileWidth());
  
    },
    
    'maxTilesInCol' : function () {
      
      return Math.floor(this.getElement().height / this.getTileHeight());
    
    },
    
    'tileRowCount' : function () {
    
      var count = this.tileOffsetX() + this.maxTilesInRow() + 1;
    
      return count * this.getTileWidth() > this.width * this.getTileWidth() ? 

             this.width : count;  
    },
    
    'tileColCount' : function () {
    
      var count = this.tileOffsetY() + this.maxTilesInCol() + 1;
      
      return count * this.getTileHeight() > this.height * this.getTileHeight() ? 

             this.height : count;
    },

    'place': function (object, coordinates) { //put object in tile

      var x = coordinates ? coordinates.x
                          : this.getTile(object.x, object.y).x,
          y = coordinates ? coordinates.y
                          : this.getTile(object.x, object.y).y;

      if (this.tileMap[x] && this.tileMap[y]) {
        this.tileMap[x][y].push(object);
      }
      
      return this;

    },
    
    'remove': function (object, coordinates) { //remove object in tile
   
      var x = coordinates ? coordinates.x
                         : this.getTile(object.position.x, object.position.y).x,
          y = coordinates ? coordinates.y
                         : this.getTile(object.position.x, object.position.y).y;

      if (this.tileMap[x] && this.tileMap[y]) {
        this.tileMap[x][y].splice(this.tileMap[x][y].indexOf(object), 1);
      }

      return this;

    }
  
  });

  var viewport = Object.create(prototype);

  return viewport;

});