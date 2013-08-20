moduleLoader.imports('movers', ['unit', 'mainView', 'vector'], function (unit, mainView, vector) {

  var move = function (event) {

    var oldTile = mainView.getTile(this.x, this.y),
        newTile = undefined;

    this.vector(this.x - this.moveTo.x, this.y - this.moveTo.y);
    this.normalize();
    this.scale(this.speed);

    if (this.x === this.moveTo.x 
    && this.y === this.moveTo.y) {
      
      this.moveTo.x = Math.getRandomInt(1, mainView.width * mainView.tile.width - this.width * mainView.zoom);
      this.moveTo.y = Math.getRandomInt(1, mainView.height * mainView.tile.height - this.height * mainView.zoom);
      
      if (this.height > this.shrinkTo) this.state.shrink = true;

      this.speed = Math.getRandomInt(1, 10);
      
      return;      
    
    }
    
    if (this.x !== this.moveTo.x) {
      if (Math.abs(Math.round(this.x - this.moveTo.x)) < this.speed) {
        this.x = this.moveTo.x;
      } else {
        this.x -= this.vx;
      }
    }
    
    if (this.y !== this.moveTo.y) {
      if (Math.abs(Math.round(this.y - this.moveTo.y)) < this.speed) {
        this.y = this.moveTo.y;
      } else {
        this.y -= this.vy;
      }
    }

    newTile = mainView.getTile(this.x, this.y);

    if ((newTile.x - oldTile.x) !== 0 || (newTile.y - oldTile.y) !== 0) {
      mainView.remove(this, oldTile).place(this, newTile);
    }
  
  };

  var shrink = function () {
    this.height *= .9;
    this.width *= .9;
    this.state.shrink = false;
  }

  var grow = function () {
    this.height *= 1.1;
    this.width *= 1.1;
    this.state.grow = false;
  };

  var movers = Object.create(unit).extend({
    
    'x': 0,
    'y': 0,

    'moveTo': {
      'x': 0,
      'y': 0
    },
    'growTo': 100,
    'shrinkTo': 4,
    'height': 1000,
    'width': 1000,
    'color': '#000000',
    'speed': 0,
    'state': {
      'render': true,
      'moving': true,
      'grow'  : false,
      'shrink': true
    }
  }).extend(vector);  
   
  var dm = 0;
  
  for (var i = 0; i < 500; i += 1) {
  
    dm = Math.getRandomInt(15, 50);

    var mover = Object.create(movers).extend({

      'x': Math.getRandomInt(1, mainView.width * mainView.tile.width - dm * mainView.zoom),
      'y': Math.getRandomInt(1, mainView.height * mainView.tile.height - dm * mainView.zoom),
  
      'moveTo': {
        'x': Math.getRandomInt(1, mainView.width * mainView.tile.width - dm * mainView.zoom),
        'y': Math.getRandomInt(1, mainView.height * mainView.tile.height - dm * mainView.zoom)
      },
  
      'speed': Math.getRandomInt(1, 20),
  
      'height': dm,
  
      'width': dm,
  
      'alpha': 1,
  
      'color': '#'+Math.floor(Math.random()*16777215).toString(16),
  
    }).on('update', function () {
  
      if (this.state.moving) {
  
        move.call(this);
        mainView.state.render = true;
  
      }

      if (this.state.grow) {

        grow.call(this);
        mainView.state.render = true;
      
      }

      if (this.state.shrink) {
        shrink.call(this);
        mainView.state.render = true;
      }
  
    }).on('render', function () {

      if (this.state.render || false) {

        var ctx = mainView.getContext();
        
        ctx.fillStyle = this.color;
        
        ctx.fillRect(
          this.x * mainView.zoom - mainView.scroll.x, 
          this.y * mainView.zoom - mainView.scroll.y, 
          this.width * mainView.zoom, 
          this.height * mainView.zoom
        );
      }
  
    });

    mainView.place(mover);
  
  }

  return movers;

});