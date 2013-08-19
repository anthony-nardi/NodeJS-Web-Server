moduleLoader.imports('player', ['unit', 'mainView', 'circle', 'vector'], function (unit, mainView, circle, vector) {

  var player = Object.create(unit).extend({
    
    'position': {
      'x': mainView.getElement().width / 2,
      'y': mainView.getElement().height / 2
    },
    
    'height': 100,
    'width' : 100,
    
    'color' : '#000000',
    'alpha' : 1,
    
    'speed' : 2,
    'currentSpeed': 0,
    'mass'  : 5,
    
    'state' : {
      'moving': false,
      'render': true
    },
    
    'moveTo': {
      'x': 0,
      'y': 0
    },
    
    'ctx': mainView.getContext(),

    'handle': {

      'click': function (event) {
        
        this.state.moving = true;
        this.state.render = true;
        this.moveTo.x = undefined;
        this.moveTo.y = undefined;

      }

    }
  
  });

  var render = player.state.render;

  mainView.place(player); //puts player in the grid

  var move = function (event) {

    var oldTile   = mainView.getTile(this.position.x, this.position.y),
        newTile   = undefined,
        touchedTiles = undefined,
        R = (Math.pow(this.position.x - mainView.getCurrentPointerPosition().x, 2),
             Math.pow(this.position.y - mainView.getCurrentPointerPosition().y, 2)),
        g = this.mass * circle.mass / R;

    this.moveTo.x = this.moveTo.x || (mainView.getCurrentPointerPosition().x 
                  + mainView.scroll.x)  / mainView.zoom;
    this.moveTo.y = this.moveTo.y || (mainView.getCurrentPointerPosition().y 
                  + mainView.scroll.y) / mainView.zoom;
    /*
    Basically, I want to have each source of gravity effect the movement of 
    the "player".  From what I understand, the equation f=ma, the "f" represents
    the magnitude of the "gravity vector".  The distance between each gravity
    source and the player represents the direction of the vector.  I assume, 
    once I have figured out how to implement acceleration, that all I need to
    do is modify the acceleration with the computed gravitational vector.
    */
    this.currentSpeed += .1;

    var distanceFromGravitySourceSquared = Math.pow((circle.vx - this.position.x), 2) 
      + Math.pow((circle.vy - this.position.y), 2);

    var directionFromGravitySource = {};

    directionFromGravitySource.extend(vector)
                  .vector(circle.vx - this.position.x, circle.vy - this.position.y);



    var gravityForce = window.gravity * circle.mass.now / distanceFromGravitySourceSquared;
    var gravityVector = {};

    gravityVector.extend(vector)
                 .vector(directionFromGravitySource.vx, directionFromGravitySource.vy)
                 .normalize()
                 .scale(gravityForce);
   

    
    if (this.currentSpeed > this.speed) this.currentSpeed = this.speed;
    
    this.vector(this.position.x - this.moveTo.x, this.position.y - this.moveTo.y)
        .normalize()
        .scale(this.currentSpeed);
    
    if (Math.sqrt(distanceFromGravitySourceSquared) > (circle.radius + circle.lineWidth + (this.width/2)) * mainView.zoom) {
      this.sub(gravityVector)
    } else {
      this.state.moving = false;
      this.currentSpeed = 0;
      this.position.x = circle.vx;
      this.position.y = circle.vy;
      this.add(this.vx, this.vy);
      return;
    }
    
    if (this.position.x === this.moveTo.x 
    && this.position.y === this.moveTo.y) {
      
      this.state.moving = false;
      this.currentSpeed = 0;
      this.add(this.vx, this.vy);
      return;      
    
    }
    
    this.position.x -= this.vx;
    this.position.y -= this.vy;
    
    if (Math.abs(Math.round(this.position.x - this.moveTo.x)) < this.speed) {
      this.position.x = this.moveTo.x;
    }

    if (Math.abs(Math.round(this.position.y - this.moveTo.y)) < this.speed) {
      this.position.y = this.moveTo.y;
    }



    newTile = mainView.getTile(this.position.x, this.position.y);

    if ((newTile.x - oldTile.x) !== 0 || (newTile.y - oldTile.y) !== 0) {
      mainView.remove(this, oldTile).place(this, newTile);
    }

  };

  player.inputs();
  
  player.on('update', function () {
    if (this.state.moving) {
      move.call(this);
    }
  });

  player.on('render', function () {

    if (render) {
      var ctx = this.ctx;
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = 'black'
      
      ctx.fillRect(
        this.position.x * mainView.zoom - mainView.scroll.x - (this.getWidth() * mainView.zoom) / 2, 
        this.position.y * mainView.zoom - mainView.scroll.y - (this.getHeight() * mainView.zoom) / 2, 
        this.width * mainView.zoom, 
        this.height * mainView.zoom
      );
      ctx.globalAlpha = 1;
    }

  });

  return player;

});