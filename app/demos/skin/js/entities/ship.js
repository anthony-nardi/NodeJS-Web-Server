moduleLoader.imports('ship', ['unit','mainView', 'vector', 'collision'], function (unit, mainView, vector, collision) {

  var ship = Object.create(unit).inputs().extend({
    
    'ctx': mainView.getContext(),
    
    'speed': 4,

    'currentSpeed': 0,
                                        
    'x': mainView.getElement().width / 2,
    'y': mainView.getElement().height / 2,

    'height': 10,
    'width' : 50,

    'color': '#ffffff',
    
    'vectors': {
      'position': vector.vector(mainView.getElement().width / 2, mainView.getElement().height / 2)
    },

    'state': {
      
      'move':        false,
      'thrust':      false,
      'slow':        false,
      'render':      true,
      'rotateLeft':  false,
      'rotateRight': false,
      'shoot':       false
    
    },

    'bullets': [],
    'maxBullets': 30,
    'range': 2000,
    'dmg': 3,

    'shoot': function () {
      
      if (this.bullets.length >= this.maxBullets) {
        return;
      }

      var x = this.x,
          y = this.y,
          vx = this.vectors.position.vx,
          vy = this.vectors.position.vy,
          ctx = this.ctx,
          bulletVector = Object.create(vector).vector(vx, vy),
          range = this.range,
          bullets = this.bullets;



      var bullet = Object.create(unit).extend({
      
        'speed': 14,

        'distanceTraveled': 0,

        'x': x,
        'y': y,
      
        'vector': bulletVector,

        'color': '#ffffff',

        'height': 5,

        'width': 5,

        'ctx': ctx,

        'collisionCallback': function (otherObject) {
          
          // console.log('Bullet hit object!');
          otherObject.height += 1;
          otherObject.width += 1;
          collision.notcollides.call(this, this.collisionCallback);
          this.off('update', this.update).off('render', this.render);
          bullets.splice(bullets.indexOf(this), 1);
          

        },

        'render': function () {
          
          this.ctx.fillStyle = this.color;
          
          this.ctx.fillRect(
            this.x * mainView.zoom - mainView.scroll.x,
            this.y * mainView.zoom - mainView.scroll.y,
            this.width * mainView.zoom,
            this.height * mainView.zoom
          );

        },

        'update': function () {

          this.vector.normalize().scale(this.speed);
          this.x += this.vector.vx;
          this.y += this.vector.vy;
          this.distanceTraveled += this.vector.length();

          if (this.distanceTraveled > range) {
            
            collision.notcollides.call(this, this.collisionCallback);
            this.off('update', this.update).off('render', this.render);
            bullets.splice(bullets.indexOf(this), 1);
            
          }

        }
      
      });

      collision.collides.call(bullet, bullet.collisionCallback);
      bullet.on('update', bullet.update).on('render', bullet.render);

      this.bullets.push(bullet);

    },

    'thrust': function () {
      
      if (this.currentSpeed < this.speed) {
        this.currentSpeed += .01;
      } else {
        this.currentSpeed = this.speed;
      }

      this.state.move = true;

    },

    'slow': function () {

      if (this.currentSpeed > .01) {
        this.currentSpeed -= .01;
      } else {
        this.currentSpeed = 0;
      }

      this.state.move = true;

    },

    'rotateLeft': function () {

      this.vectors.position.rotate(-.02);

    },

    'rotateRight': function () {

      this.vectors.position.rotate(.02);

    },

    'move': function () {
      this.vectors.position.normalize().scale(this.currentSpeed);
      this.x += this.vectors.position.vx;
      this.y += this.vectors.position.vy;
      mainView.scroll.x += (this.vectors.position.vx * mainView.zoom);
      mainView.scroll.y += (this.vectors.position.vy * mainView.zoom);
    },

    'handle': {

      'keydown': function (key) {
      
        if (key.UP) {
          this.state.thrust = true;
        }
      
        if (key.LEFT) {
          this.state.rotateLeft = true;
        }
      
        if (key.RIGHT) {
          this.state.rotateRight = true;
        }

        if (key.DOWN) {
          this.state.slow = true;
        }

        if (key.SPACE) {
          this.state.shoot = true;
        }
      
      },

      'keyup': function (key) {

        if (key.UP) {
          this.state.thrust = false;
        }
      
        if (key.LEFT) {
          this.state.rotateLeft = false;
        }
      
        if (key.RIGHT) {
          this.state.rotateRight = false;
        }

        if (key.DOWN) {
          this.state.slow = false;
        }

        if (key.SPACE) {
          this.state.shoot = false;
        }

      }

    }  

  }).on('update', function () {
  
    if (this.state.thrust) {
      this.thrust();
    }
  
    if (this.state.move) {
      this.move();
    }
  
    if (this.state.rotateLeft) {
      this.rotateLeft();
    }
  
    if (this.state.rotateRight) {
      this.rotateRight();
    }

    if (this.state.slow) {
      this.slow();
    }

    if (this.state.shoot) {
      this.shoot();
    }
  
  }).on('render', function () {
      
    if (this.state.render) {

      this.ctx.fillStyle = this.color;
      this.ctx.save()
      this.ctx.translate(
       this.x * mainView.zoom - mainView.scroll.x, 
       this.y * mainView.zoom - mainView.scroll.y
      );

      this.ctx.rotate(this.vectors.position.toRadians());

      this.ctx.fillRect(
        0 - ((this.width * mainView.zoom) / 2),
        0 - ((this.height * mainView.zoom) / 2),
        this.width * mainView.zoom, 
        this.height * mainView.zoom
      );
      this.ctx.restore();
    
    }
      
  });

  return ship;

});