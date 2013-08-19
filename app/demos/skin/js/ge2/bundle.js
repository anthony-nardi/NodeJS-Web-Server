;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
module.exports = (function () {
  console.log('start')
  require('./util/functional/extend');
  var input = require('./system/input'),
      clock = require('./system/clock')();

   var viewport = require('./models/viewport'),
      vector = require('./util/math/vector'),
      rectangleFactory = require('./models/rectangle'),
      circleFactory = require('./models/circle'),
      orbitFactory = require('./models/orbit'),
      generateShow = require('./models/generateShow');



/*
  var fps = require('./util/functional/fps')();
  clock.render.add(function () {
    fps.start();
  });
  clock.render.add(function () {
    fps.end();
  });
 */
  viewport = viewport({
    'clock': clock,
    'input': input,
    'up' : 'h',
    'left' : 'b',
    'right' : 'm',
    'down' : 'n',
    'width' : 900,
    'height' : 300
  });
  var quadTree = viewport.quadTree;

  var redRect = rectangleFactory({
    'color' : "#FF0000",
    'width' : 25,
    'height' : 25,
    'clock' : clock,
    'position' : vector(50,50)
  });

  var blueRect = rectangleFactory({
    'color' : "#3399FF",
    'width' : 25,
    'height' : 25,
    'clock' : clock,
    'position' : vector(75,75)
  });

  var yellowRect = rectangleFactory({
    'color' : "#FFFFA3",
    'width' : 25,
    'height' : 25,
    'clock' : clock,
    'position' : vector(100,100)
  });

  var greenRect = rectangleFactory({
    'color' : "#D6F5D6",
    'width' : 25,
    'height' : 25,
    'clock' : clock,
    'position' : vector(125,125)
  });

  var rects = [redRect, blueRect, yellowRect, greenRect];
  window.redRect = redRect;
  window.blueRect = blueRect;
  window.yellowRect = yellowRect;
  window.greenRect = greenRect;
  window.telRects = function (x, y) {
    for(var i = 0; i < rects.length; i += 1) {
      rects[i].position = vector(rects[i].position.x + x, rects[i].position.y + y);
    }
  }
  telRects(-100,0);
  //window.telRects(-400, 0);

  quadTree.insert(redRect);
  quadTree.insert(blueRect);
  quadTree.insert(yellowRect);
  quadTree.insert(greenRect);

  window.moveRects = function (x, y) {
    for(var i = 0; i < rects.length; i += 1) {
      rects[i].move(rects[i].position.x + x, rects[i].position.y + y);
    }
  }


  generateShow({
    'viewport': viewport,
    'srcs': [
      'ge2/01.jpg','ge2/02.jpg','ge2/03.jpg','ge2/04.jpg',
      'ge2/05.jpg','ge2/06.jpg','ge2/07.jpg','ge2/08.jpg',
      'ge2/09.jpg','ge2/10.png','ge2/11.jpg','ge2/12.jpg',
      'ge2/13.png'
    ]
  });



  window.collides = function () {
    var things = viewport.quadTree.getChildren().concat(viewport.quadTree.getOrphans());
    for (var i = 0; i < things.length; i += 1) {
      if (things[i].collidesList().length > 1) { 
        console.log(things[i].collidesList())
      }
    }
  }

  clock.start();
  window.within = require('./util/math/within');
  window.intersects = require('./util/math/intersects');
  window.quadTree = quadTree;
  window.viewport = viewport;
  window.rotateBounds = require('./util/math/rotateBounds');
  window.bounds = require('./util/math/bounds');

}())

},{"./util/functional/extend":2,"./system/input":3,"./system/clock":4,"./models/viewport":5,"./util/math/vector":6,"./models/rectangle":7,"./models/circle":8,"./models/orbit":9,"./models/generateShow":10,"./util/math/within":11,"./util/math/intersects":12,"./util/math/rotateBounds":13,"./util/math/bounds":14}],2:[function(require,module,exports){
// All credit to Anthony Nardi
// git@github.com:anthony-nardi/Extends.git
if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {
        
        this[key].extend(object[key]);

      } else {
        this[key] = object[key];
      }
    }
    return this;
  };
};

},{}],6:[function(require,module,exports){
module.exports = (function () {
  var vectorProto = {
    'add' : function (v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    'sub' : function (v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },
    'mult' : function (m) {
      this.x *= m;
      this.y *= m;
      return this;
    },
    'div' : function (m) {
      this.x /= m;
      this.y /= m;
      return this;
    },
    'dupe' : function () {
      var that = this;
      return Object.create(vectorProto).extend({
        'x': that.x, 
        'y': that.y
      });
    },
    'dot' : function (v) {
      return v.x * this.x + v.y * this.y;
    },
    'lengthSquared' : function () {
      return this.dot(this);
    },
    'length' : (function () {
      var sqrt = Math.sqrt;
      return function () {
        return sqrt(this.lengthSquared());
      }
    }()),
    'rotate' : function(radians) { 
      var s = Math.sin(radians), 
          c = Math.cos(radians),
          that = this;

      return Object.create(vectorProto).extend({
        'x': that.x*c - that.y*s, 
        'y': that.x*s + that.y*c
      }); 

    },
    'normalize' : function () {
      return this.div(this.length());
    },
    'atan2': function () {
      return Math.atan2(this.y, this.x);
    }
  }
  return function (x, y) {
    return Object.create(vectorProto).extend({
      'x' : x || 0,
      'y' : y || 0
    });
  }
}())

},{}],4:[function(require,module,exports){
module.exports = (function () {
  
  var tickList = require('../util/functional/tickList');

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



},{"../util/functional/tickList":15}],3:[function(require,module,exports){
module.exports = (function () {
  
  var keys = require('../util/functional/keys'),
      inputState = [];
      
  window.addEventListener('keydown', function (event) {
    inputState[event.which] = true;
  });
  
  window.addEventListener('keyup', function (event) {
  	inputState[event.which] = false;
  })

  return function (key) {
    return (true === inputState[keys.indexOf(key)]);
  }

}());

},{"../util/functional/keys":16}],5:[function(require,module,exports){
module.exports = (function () {
  var tickList = require('../util/functional/tickList');
  var display = require('../system/display');
  var QuadTree = require('./quadTree');
  var bounds = require('../util/math/bounds');
  var sortByProp = require('../util/functional/sortByProp');
  var viewportCounter = 0;
  var vector = require('../util/math/vector'),
      viewportProto = {
        'width' : 900,
        'height' : 300,
        'zIndex' : 0,
        'scale' : 1,
        //display properties
        'display' : display,
        'displayCanvas' : display.canvas,
        'displayCtx' : display.ctx,
        'zoomSpeed': 120,
        'speed': 200,
        'rotationSpeed' : 1,
        'up' : 'h',
        'left': 'b',
        'right': 'm',
        'down': 'n',
        'zoomDirection' : 0,
        'zoomIn' : 'i',
        'zoomOut' : 'k',
        'rotateClockwise' : 'l',
        'rotateCounterClockwise' : 'o',
        //-----viewport proto methods--------
        'calculateDisplayPositions' : function () {
          display.resize();
          this.canvas.width = this.displayCanvas.width;
          this.canvas.height = this.displayCanvas.height;
          //TO DO: Actually calculate x and y display positions...
          return this;
        },
        'calculateScale' : function () {
          this.calculateDisplayPositions();
          this.ratio = this.width / this.height;
          this.displayRatio = this.canvas.width / this.canvas.height;
          if(this.ratio <= this.displayRatio) {
            this.scale = this.canvas.height / this.height;
          } else {
            this.scale = this.canvas.width / this.width;
          }
          return this;
        },
        'follow' : function (obj) {
          var that = this;
          this.following = this.update.addWithRemove(function () {
            that.move(obj.position.x, obj.position.y);
          });
          console.log("Following ID :" + this.following);
        },
        'unfollow' : function () {
          this.following.remove();
        },
        'zoomBy' : function (dUnits) {
          var oldHeight = this.height,
              oldWidth = this.width;
          this.height += dUnits;
          this.width += dUnits * this.ratio;
          if (this.height < 1) {
            this.height = oldHeight;
            this.width = oldWidth;
            return this;
          }
          if (this.width < 1) {
            this.height = oldHeight;
            this.width = oldWidth;
            return this;
          }
          this.calculateScale();
          this.updateParent();
          return this;
        },
        'inputUpdate': function () {
          var state = this.input(this.up)    * 8 + 
                      this.input(this.down)  * 2 + 
                      this.input(this.right) * 1 + 
                      this.input(this.left)  * 4;
          
          switch (state) {
            case 0:
              this.direction.x= 0;
              this.direction.y= 0;
              break;
            case 1: //right
              this.direction = this.angle.dupe();
              break;
            case 2: //down
              this.direction = this.angle.rotate(Math.PI / 2);
              break;
            case 3: //SE
              this.direction = this.angle.rotate(Math.PI / 4);
              break;
            case 4: //left
              this.direction = this.angle.dupe().mult(-1);
              break;
            case 5:
              this.direction.x= 0;
              this.direction.y= 0;
              break;
            case 6: //SW
              this.direction = this.angle.rotate(Math.PI / 4 * 3);
              break;
            case 7: //down
              this.direction = this.angle.rotate(Math.PI / 2);
              break;
            case 8: //UP
              this.direction = this.angle.rotate(-Math.PI / 2);
              break;
            case 9: //NE
              this.direction = this.angle.rotate(-Math.PI / 4);
              break;
            case 10:
              this.direction.x= 0;
              this.direction.y= 0;
              break;
            case 11:
              this.direction = this.angle.dupe();
              break;
            case 12: //NW
              this.direction = this.angle.rotate(-Math.PI / 4 * 3);
              break;
          }

          state = this.input(this.rotateClockwise) * 1 +
                  this.input(this.rotateCounterClockwise) * 2;
          if (state === 1) {
            this.angle = this.angle.rotate(this.rotationSpeed * this.sim);
          } else if (state === 2) {
            this.angle = this.angle.rotate(-this.rotationSpeed * this.sim);
          }
          state = this.input(this.zoomIn) * 1 +
                  this.input(this.zoomOut) * 2;
          if (state === 1) {
            this.zoomDirection = -1;
            return this;
          }
          if (state === 2) {
            this.zoomDirection = 1;
            return this;
          }
          if (!state) {
            this.zoomDirection = 0;
            return this;
          }
          return this;
        },
        'render' : function () {
          var renderList = this.collidesList(),
              scale = this.scale,
              ctx = this.displayCtx,
              offsetX = this.position.x,
              offsetY = this.position.y,
              that = this;

          //fill background
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);

          ctx.save();
          ctx.translate(this.width * scale * 0.5, this.height * scale * 0.5);
          ctx.rotate(-this.angle.atan2());
          //get bounds for render
          renderList = sortByProp(renderList, 'zIndex');
          for (var i = 0; i < renderList.length; i += 1) {
            ctx.save();
            ctx.translate((renderList[i].position.x - offsetX) * scale, (renderList[i].position.y - offsetY) * scale);
            renderList[i].render(ctx, this);
            ctx.restore();
          }
          ctx.restore();
          ctx.strokeStyle = '#E01B6A';
          ctx.strokeRect(0,0,this.width * scale, this.height * scale)
          return this;
        }
      };
      //end viewport prototype
  var init = function (that) {
    that.viewportName = viewportCounter += 1;
    that.position = that.position || vector();
    that.angle =  (typeof that.angle === 'number') ? vector(1,0).rotate(that.angle) : vector(1,0);

    that.direction = vector(0,0);
    that.sim = that.clock.SIM_RES / 1000;
    that.canvas = document.createElement('canvas');
    that.ctx = that.canvas.getContext('2d');
    that.quadTree = that.quadTree || QuadTree({'bounds':true});
    that.calculateDisplayPositions().calculateScale();

    that.quadTree.insert(that);

    that.update = tickList().add(function () {
      that.move(that.position.x + that.direction.x * that.speed * that.sim, that.position.y + that.direction.y * that.speed * that.sim).zoomBy(that.zoomDirection * that.zoomSpeed * that.sim);
      that.position = that.position || vector();
      return this;
    });
    that.clock.render.add(function () {
      that.render();
    });
    that.clock.model.add(function () {
      that.update.update();
    });
    that.clock.input.add(function () {
      that.inputUpdate();
    });
    return that;  
  };

  return function (OO) {
    return init(Object.create(viewportProto).extend(OO || {}));
  }
}())

},{"../util/functional/tickList":15,"../system/display":17,"./quadTree":18,"../util/math/bounds":14,"../util/functional/sortByProp":19,"../util/math/vector":6}],7:[function(require,module,exports){
module.exports = (function () {
  var vector = require('../util/math/vector');
  var tickList = require('../util/functional/tickList');
  var rectangleProto = {
    'width': 25,
    'height': 25,
    'color': '#ffffff',
    'borderColor': '#ff0022',
    'rotationSpeed' : 0,
   
    'render' : function (ctx, viewport) {
      var scale = viewport.scale,
          halfWidth = this.width / 2 * scale,
          halfHeight = this.height / 2 * scale;
      ctx.save()
      ctx.fillStyle = this.color;
      ctx.rotate(this.angle.atan2());
      ctx.fillRect(0 - halfWidth, 0 - halfHeight, this.width * scale, this.height * scale);
      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth =  scale < 1 ? 1 : scale;
      ctx.strokeRect(-halfWidth, -halfHeight, this.width * scale, this.height * scale); 
      ctx.restore();
      return this;
    }
  }

  var update = function () {
    this.angle = this.angle.rotate(this.rotationSpeed * this.sim);
    var that = this;

    return this;
  };

  

  var init = function (that) {
    var that = that;
    if(!that.position) that.position = vector();

    that.angle =  (typeof that.angle === 'number') ? vector(1,0).rotate(that.angle) : vector(1,0);

    that.sim = that.clock.SIM_RES / 1000;
    if (!that.update || !that.update.list) {
      that.update = tickList();
      that.clock.model.add(function () { that.update.update();});
      console.log('47')
    }
    that.update.add(function () {
      update.call(that);
    });
console.log(that.update.list)


    return that;
  }

  return function (OO) {
    console.log(OO);
    return init(Object.create(rectangleProto).extend(OO));
  }
}())

},{"../util/math/vector":6,"../util/functional/tickList":15}],8:[function(require,module,exports){
module.exports = (function () {
  var vector = require('../util/math/vector');
  var tickList = require('../util/functional/tickList');
  var rectangleProto = {
    'radius': 100,
    'color': '#ffffff',
    'borderColor': '#ff0022',
   
    'render' : function (ctx, viewport) {
      var scale = viewport.scale,
          halfWidth = this.radius / 2 * scale,
          halfHeight = this.radius / 2 * scale,
          that = this;
      ctx.save()
      ctx.fillStyle = this.color;
      ctx.rotate(this.angle.atan2());
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * viewport.scale, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.radius * viewport.scale, 0);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      return this;
    },  

    'rotationSpeed': 1
  }

  

  var update = function () {
    this.angle = this.angle.rotate(this.rotationSpeed * this.sim);

    return this;
  };

  var init = function (that) {


    that.width = that.radius * 2;
    that.height = that.radius * 2; 
    that.position = vector(0,0);

    that.angle =  (typeof that.angle === 'number') ? vector(1,0).rotate(that.angle) : vector(1,0);
    console.log(typeof(that.angle));
    that.sim = that.clock.SIM_RES / 1000;
    if (!that.update || !that.update.list) {
      that.update = tickList();
      that.clock.model.add(function () { that.update.update() });
    }
    that.update.add(function() {
      update.call(that);
    });
    
    
    return that;
  }

  return function (OO) {
    return init(Object.create(rectangleProto).extend(OO));
  }
}())

},{"../util/math/vector":6,"../util/functional/tickList":15}],9:[function(require,module,exports){
module.exports = (function () {
  var vector = require('../util/math/vector');  
  var tickList = require('../util/functional/tickList');

  var update = function () {

    var rotation = (this.orbitSpeed * this.sim / this.orbitCircumference) * 2 * Math.PI;
    this.orbitAngle = this.orbitAngle.rotate(this.orbitDirection * rotation);
    var that = this;


    this.move(this.anchor.position.x + this.orbitAngle.x * this.leash, this.anchor.position.y + this.orbitAngle.y * this.leash);

    return this;
  }
  var init = function (that) {
    
    that.orbitCircumference = 2 * that.leash * Math.PI;

    if (!that.update || !that.update.list) {
      that.update = tickList();
      that.clock.model.add(function () {
        that.update.update();
      });
    }
  
    that.update.add(function() { 
        update.call(that)      
    });

    return that;
  }

  return {
    'orbit': function (anchor) {
        this.anchor = anchor;
        return init(this);
    }
  }
}())

},{"../util/math/vector":6,"../util/functional/tickList":15}],10:[function(require,module,exports){
module.exports = (function () {
  var imageFactory = require('./image.js');
  var vector = require('../util/math/vector');
  var randBetween = require('../util/math/randBetween');
  var Proto = {
    'rotateSrcs' : true,
    'minHeight' : 20,
    'maxHeight' : 500,
    'placeSrcs' : function () {
      var quadTree = this.viewport.quadTree,
          hWidth = quadTree.width / 2,
          hHeight = quadTree.height / 2,
          touching = true;
      for(var i = 0, curr, len = this.srcs.length; i < len; i += 1) {
       
        //add render method to srcs
        console.log(this.srcs);
        curr = imageFactory(this.srcs[i]);
        touching = true;
     
         //try a random position, see if it collides with another
        //object on the quadTree. If it does, re-try another position
        //figure X, Ys, and rotations
        if(this.rotateSrcs) {
          curr.angle = vector(1, 0).rotate(Math.random() * Math.PI * 2);
        } else {
          curr.angle = vector(1, 0);
        }
        //setting default values so object can be moved on the quadTree
        curr.height = 1;
        curr.width = 1;
        curr.position = vector(1,0);
        quadTree.insert(curr)
        while(touching) {
          curr.height = randBetween(this.minHeight, this.maxHeight);
          curr.width = curr.height * curr.ratio;
          curr.position = vector(randBetween(-hWidth, hWidth), randBetween(-hHeight, hHeight));
          curr.move(curr.position.x, curr.position.y)
 

          if(!curr.collidesList().length) {
            touching = false;          
           } 
        }
      }
    },
  }


  var init = function (that) {
    if(!that.viewport) {
      console.log("ERROR: generateShow requires a viewport.");
      return;
    }
    var srcObjects = [];
      for(var i = 0, currObject, len = that.srcs.length; i < len; i += 1) {
        currObject = new Image();
        currObject.onload = (function (i, currObject) {
          
          return function () {
            console.log(i)      
            srcObjects.push(currObject);
            if(srcObjects.length === len) {             
              that.srcs = srcObjects;
              that.placeSrcs();
            }
          }
        }(i, currObject));
        currObject.src = that.srcs[i];
      }
    return that;
  }
  return function (OO) {
    return init(Object.create(Proto).extend(OO));
  }
}())


},{"./image.js":20,"../util/math/vector":6,"../util/math/randBetween":21}],11:[function(require,module,exports){
module.exports = (function () {

  var bounds = require('./bounds');

  return function (obj1, obj2) {
    var b1 = bounds(obj1),
        b2 = bounds(obj2);

    return (b1.left >= b2.left &&
        b1.top >= b2.top &&
        b1.right <= b2.right &&
        b1.bottom <= b2.bottom)
  }
}());

},{"./bounds":14}],12:[function(require,module,exports){
module.exports = (function () {
  var bounds = require('./bounds');

  return function (obj1, obj2) {
		
		var obj1 = bounds(obj1),
	      obj2 = bounds(obj2);

		return (obj1.left < obj2.right &&
		        obj1.right > obj2.left &&
	          obj1.top < obj2.bottom &&
	          obj1.bottom > obj2.top);
  }

}());

},{"./bounds":14}],13:[function(require,module,exports){
module.exports = (function () {
 
  var vector = require('./vector');

  return function (obj) {
    var hHypotenuse = vector(obj.width, obj.height).length() / 2,
        angleToBottomRightCorner = vector(obj.width, obj.height).normalize().atan2(),
        topRight = obj.angle.rotate(-angleToBottomRightCorner), 
        bottomRight = obj.angle.rotate(angleToBottomRightCorner),
        x1 = topRight.x * hHypotenuse,
        x2 = bottomRight.x * hHypotenuse,
        y1 = topRight.y * hHypotenuse,
        y2 = bottomRight.y * hHypotenuse,
        maxX = Math.max(Math.abs(x1), Math.abs(x2)), 
        maxY = Math.max(Math.abs(y1), Math.abs(y2));
    return {
      'left': obj.position.x - maxX, 
      'right': obj.position.x + maxX,
      'top': obj.position.y - maxY,
      'bottom': obj.position.y + maxY
    };
  }
 
}());

},{"./vector":6}],14:[function(require,module,exports){
module.exports = (function (obj) {
  var rotateBounds = require('./rotateBounds'); 
  return function (obj) {
    var isCircle = !!obj.radius;
    if (obj.angle && !isCircle) return rotateBounds(obj);
    
    if(isCircle) {
      obj.width = obj.radius * 2;
      obj.height = obj.radius * 2;
    }

    var left = obj.position.x - obj.width / 2,
        right = left + obj.width,
        top = obj.position.y - obj.height / 2,
        bottom = top + obj.height;  
    
    return {
      'left': left, 
      'right': right,
      'top': top,
      'bottom': bottom
    };

  }  
}());

},{"./rotateBounds":13}],20:[function(require,module,exports){
module.exports = (function () {
  var Proto = {
    'render' : function(ctx, viewport) {
      var scale = viewport.scale,
          halfWidth = this.width / 2 * scale,
          halfHeight = this.height / 2 * scale;
      ctx.save();
      ctx.rotate(this.angle.atan2());
      ctx.drawImage(this.image, -halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2);
      ctx.restore();      
      return this;
    }
  }
  
  var init = function (that) {
    that.ratio = that.image.width / that.image.height;
    return that;
  }
  return function (imageObject) {
    var image = Object.create(Proto);
    image.image = imageObject;
    return init(image);
  }
}())


},{}],15:[function(require,module,exports){
module.exports = (function () {
  var slice = Array.prototype.slice;
  var taskProto = {
    'remove' : function () {
      var list = this.list;
      list.splice(this.id, 1);
      for (var i = this.id; i < list.length; i += 1) {
        list[i].id -= 1;
      }
    }
  }
  var sleepTask = Object.create(taskProto).extend({
    'init' : function (sleepTime, interval, killAfter, fn) {
      var times = 0,
          total = 0;

      killAfter = killAfter || 0;
      times -= sleepTime;
      this.fn = function () {
        if(times === interval) {
          fn();
          total += 1;
          times = 0;
          if(total === killAfter) {
            this.remove();
          }
        }
        times += 1;
        times
      }
      return this;
    }
  });
  var tickListProto = {
    'update' : function () {
      for (var i = 0; i < this.list.length; i += 1) {
      	this.list[i].fn();
      }
      return this;
    },
    'add' : function (fn) {
      var list = this.list;
      list.push(Object.create(taskProto).extend({
        'id' : list.length,
        'list' : list,
        'fn' : fn
      }));
      return this;
    },
    'addWithRemove' : function (fn) {
      var list = this.list,
          fn = Object.create(taskProto).extend({
            'id' : list.length,
            'list' : list,
            'fn' : fn
          });
      list.push(fn);
      return fn;
    },
    'addSleeper' : function (sleepTime, interval, killAfter, fn) {
      var list = this.list;
      list.push(Object.create(sleepTask).extend({
        'id' : list.length,
        'list' : list
      }).init());
      return this;
    },
    'remove' : function (id) {
      if(id) this.list[id].remove();
    }
  };

  return Object.create(tickListProto).extend({
  	'list' : []
  });

});

},{}],16:[function(require,module,exports){
module.exports = [,,,
'CANCEL',
,
,
'HELP',
,
'BACK SPACE',
'TAB',
,
,
'CLEAR',
'RETURN',
'ENTER',
,
'SHIFT',
'CTRL',
'ALT',
'PAUSE',
'CAPS LOCK',
,
,
,
,
,
,
'ESCAPE' ,
,
,
,
,
'SPACE',
'PAGE UP',
'PAGE DOWN',
'END',
'HOME',
'LEFT',
'UP',
'RIGHT',
'DOWN',
,
,
,
'PRINT SCREEN',
'INSERT',
'DELETE',
,
'0',
'1',
'2',
'3',
'4',
'5',
'6',
'7',
'8',
'9',
,
';',
,
'=',
,
,
,
'a',
'b',
'c',
'd',
'e',
'f',
'g',
'h',
'i',
'j',
'k',
'l',
'm',
'n',
'o',
'p',
'q',
'r',
's',
't',
'u',
'v',
'w',
'x',
'y',
'z',
'META',
,
'CONTEXT MENU',
,
,
'NUMPAD0',
'NUMPAD1',
'NUMPAD2',
'NUMPAD3',
'NUMPAD4',
'NUMPAD5',
'NUMPAD6',
'NUMPAD7',
'NUMPAD8',
'NUMPAD9',
'*',
'+',
'SEPARATOR',
'-',
'DECIMAL',
'DIVIDE',
'F1',
'F2',
'F3',
'F4',
'F5',
'F6',
'F7',
'F8',
'F9',
'F10',
'F11',
'F12',
'F13',
'F14',
'F15',
'F16',
'F17',
'F18',
'F19',
'F20',
'F21',
'F22',
'F23',
'F24',
,
,
,
,
,
,
,
,
'NUM LOCK',
'SCROLL LOCK',
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
';',
'=',
',',
'-',
'.',
'/',
'"',
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
'[',
'\\',
']',
"'",
,
'META'];

},{}],17:[function(require,module,exports){
module.exports = (function () {
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      toResize = true;

  var resize = function () {
    if(toResize) {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      toResize = false;
    }
  }


  var setToResize = function () {
    toResize = true;
  }


  //setfull screen styles
  document.body.appendChild(canvas);
  document.body.style.margin = '0px';
  document.body.style.overflow = 'hidden';
  canvas.ctx = ctx;
  //init
  resize();
  window.addEventListener('resize', setToResize, false);
  return {
    'canvas' : canvas,
    'ctx' : ctx,
    'resize' : resize
  }
}());

},{}],19:[function(require,module,exports){
module.exports =  function (objs, prop) {
  return objs.sort(function (a, b) {
    return a[prop] - b[prop];
  });
}

},{}],21:[function(require,module,exports){
module.exports = function (min, max) {
  return min + Math.random() * (max - min);
}

},{}],18:[function(require,module,exports){
module.exports = (function () {
  
  var bounds = require('../util/math/bounds'),
      intersects = require('../util/math/intersects'),
      within = require('../util/math/within'),
      vector = require('../util/math/vector'),
      
      Leaf = (function () {

        var boxPrototype = {
          
          'quadrant': undefined, //what quadrants does this box fall within relative to its root
          
          'collidesList' : function () {
            //Get all objects that have a decent chance of colliding with this object
            var children = this.root.getChildren(this, true)
                           .concat(this.root.getOrphans())
                           .concat(this.root.rootOrphanOverlap()),
                list = [];

            children.splice(children.indexOf(this), 1);

            for (var i = 0; i < children.length; i += 1) {
              if (intersects(this, children[i])) list.push(children[i]);
            }
          
            return list;
          },
          
          'move': function (x, y) {
            
            this.position.x = x;
            this.position.y = y;
            
            //if (this.root.orphans.indexOf(this) !== -1 && !within(this, this.root)) {
              //Update the parent if this is not completely within the parent leaf.
              //Update the parent if this is an orphan
              this.updateParent();
            //}
            return this;
          },

          'updateParent' : function () {
            this.remove().insert();
            return this;
          },
          'remove' : function () {
            this.root.remove(this);
            return this;
          },
          'insert' : function () {
            this.root.insert(this);
            return this;
          },
        
        };
       
        var leafBoundPrototype = {
          
          'containsPoints': true,
          
          'insert': function (obj) {

            if (obj instanceof Array) {
              for (var i = 0; i < obj.length; i += 1) {
                this.insert(obj[i]);
              }
              return;
            }
 
            if (!obj.root) { obj.extend(boxPrototype) }

            var leafBounds = bounds(this),
                objBounds = bounds(obj),
                leftOfLeaf = (objBounds.left <= leafBounds.left),
                rightOfLeaf = (objBounds.right > leafBounds.right),
                aboveLeaf = (objBounds.top <= leafBounds.top),
                belowLeaf = (objBounds.bottom > leafBounds.bottom),
                leafHWidth = this.width / 2,
                leafHHeight = this.height / 2,
                quadrant = (obj.position.x <= this.position.x ? 0 : 2) + (obj.position.y <= this.position.y ? 0 : 1);
         
            obj.bounds = objBounds;


            if (leftOfLeaf || rightOfLeaf || aboveLeaf || belowLeaf) {

              if (this.quadrant) {
                /*
                  if the object is not contained within the current leaf and 
                  the leaf is a quadrant of another leaf, insert it into that leaf...
                */
                return this.root.insert(obj);
              }
              /*
                if the object is not contained within the leaf and there isnt
                a parent leaf
              */
              if (leftOfLeaf) {
                while (obj.position.x <= leafBounds.left) {
                  obj.position.x = leafBounds.right + obj.position.x + leafHWidth;
                }
              }
              if (rightOfLeaf) {
                while (obj.position.x > leafBounds.right) {
                  obj.position.x = leafBounds.left + obj.position.x - leafHWidth;
                }
              }
              if (aboveLeaf) {
                while (obj.position.y <= leafBounds.top) {
                  obj.position.y = leafBounds.bottom + obj.position.y + leafHHeight;
                }
              }
              if (belowLeaf) {
                while (obj.y > leafBounds.bottom) {
                  obj.position.y = leafBounds.top + obj.position.y - leafHHeight;
                }
              }
              objBounds = bounds(obj);
              obj.bounds = objBounds;
            }

            if (this.containsPoints) {        
              //If this leaf contains points, then we can insert the object into it
              obj.root = this;
              obj.quadrant = this.quadrant;
            
              this.children.push(obj);

              if (this.maxChildren < this.children.length && this.maxDepth) {
                this.burst();              
              }
      
            } else {
              /*
                At this point, we know that the object is completely contained
                in a leaf that has sub-leafs.  We must now determine whether or not
                the object is an orphan of the leaf or can be inserted into a sub-leaf.
              */
              var subleaf = this.children[quadrant],
                  withinSubleaf = within(obj, subleaf); 

                                  /*(objBounds.left > subleafBounds.left &&
                                  objBounds.right <= subleafBounds.right &&
                                  objBounds.top > subleafBounds.top && 
                                  objBounds.bottom <= subleafBounds.bottom);*/

              if (withinSubleaf) {
                console.log('child');
                return subleaf.insert(obj);
              } else {
                
                obj.root = this;
                obj.quadrant = this.quadrantOverlap(obj);  
    
                this.orphans.push(obj);
                return;
              }
            }
          },

          'quadrantOverlap' : function (obj) {
            return (
              (intersects(this.children[0], obj) * 1) +
              (intersects(this.children[1], obj) * 2) + 
              (intersects(this.children[2], obj) * 4) +
              (intersects(this.children[3], obj) * 8)
            );
          },

          'remove' : function (obj) {
            var pos = this.children.indexOf(obj);
            if(pos !== -1) {
              this.children.splice(pos, 1);
            } else {
              this.orphans.splice(this.orphans.indexOf(obj), 1);
            }
            if (this.root.collapse) this.root.collapse();  
          },
          'childCount': function () {
            var sum = 0;
            
            if (this.containsPoints) {
              return this.children.length;
            }

            if(this.orphans.length) {
              sum += this.orphans.length;
            }

            for (var i = 0; i < this.children.length; i += 1) {
              sum += this.children[i].childCount();
            }
           
            return sum;
          },
          'getChildren': function (obj, root) {

            var returnList = [], quadrant;

            if (this.containsPoints) {

                returnList = this.children;

            } else {

              if (obj) {

                quadrant = root ? obj.quadrant : this.quadrantOverlap(obj);

                for (var i = 0; i < this.children.length; i += 1) {
                  if ((quadrant & this.children[i].quadrant) !== 0) {
                    returnList = returnList.concat(this.children[i].getChildren(obj));
                  }
                }
              } else {
                  for (var i = 0; i < this.children.length; i += 1) {
                    returnList = returnList.concat(this.children[i].getChildren());
                  }
              }

            }

            return returnList;

          },
          'getOrphans' : function (obj, root) {
            
            var returnList = [], quadrant;

            if (!this.containsPoints) {
              
              returnList = this.orphans;
            
              for (var i = 0; i < this.children.length; i += 1) {
                returnList = returnList.concat(this.children[i].getOrphans());
              }

            }

            return returnList;

          },
          'rootOrphanOverlap': function () {
            /*
              Search every orphan on the root of this zleaf that may overlap with this leaf
            */
            var returnOrphans = [],
                orphans = this.root.orphans;     

            if (!orphans) return returnOrphans;
            
            for (var i = 0; i < orphans.length; i += 1) {
              if ((orphans[i].quadrant & this.quadrant) === this.quadrant) {
                returnOrphans.push(orphans[i]);
              }          
            }

            returnOrphans = returnOrphans.concat(this.root.rootOrphanOverlap());

            return returnOrphans;

          },
          'collapse': function () {
            /*
              Collapse is called like this:
                 Object.root.remove -> Object.root.root.collapse
              so basically, when an object in the quadTree removes itself, its root removes it
              from itself and then calls collapse on ITS root. (the objects roots root)

              We know that objects are only contained within leafs that contain points only, 
              therefore it only makes sense to collapse its roots root...

              So if the leaf we are collapsing contains less than or an equal amount of objects
              than its maxChildren property, then we should gather all of the leafs orphans and
              children and make them children of the leaf.
            */
            if (this.childCount() <= this.maxChildren) {
              console.log('Collapsing leaf that contains ' + this.childCount() + ' children.');
              this.children = this.getChildren().concat(this.getOrphans());
              
              for (var i = 0; i < this.children.length; i += 1) {
                this.children[i].root = this;
              }

              this.containsPoints = true;
              console.log('Finished collapsing leaf that now contains ' + this.childCount() + ' children.');
            }
          },
          'spawn': function () {
            var root = this,
                x = this.position.x,
                y = this.position.y,
                width = this.width / 4,
                height = this.height /4;

            this.containsPoints = false;
            return [
              Leaf({
                'root':root,
                'position':vector(x - width, y - height),
                'quadrant': 1
              }),
              Leaf({
                'root':root,
                'position':vector(x - width, y + height),
                'quadrant': 2
              }),
              Leaf({
                'root':root,
                'position':vector(x + width, y - height),
                'quadrant': 4        
              }),
              Leaf({
                'root':root,
                'position':vector(x + width, y + height),
                'quadrant': 8
              })
            ];
          },
          'burst': function () {
            var children = this.children;
      
            this.children = this.spawn();
            
            for (var i = 0; i < children.length; i += 1) {
              this.insert(children[i]);
            }
          }
        };

        return function (OO) {
          var leaf;
          OO.root = OO.root || {};
          
          return Object.create(leafBoundPrototype).extend({
            'width' : OO.width || (OO.root.width ? OO.root.width / 2 : 1920),
            'height' : OO.height || (OO.root.height ? OO.root.height / 2 : 1080),
            'maxChildren' : OO.maxChildren || 3,
            'maxDepth' : OO.root.maxDepth ? OO.root.maxDepth - 1 : (OO.maxDepth || 4),
            'root' : OO.root,
            'children' : [], 
            'halfWidth' : OO.width/ 2 || (OO.root.width ? OO.root.width / 4 : 960),
            'halfHeight' : OO.height/ 2 || (OO.root.height ? OO.root.height / 4 : 540),
            'position' : OO.position || vector(),
            'quadrant': OO.quadrant || undefined,
            'orphans': []
           });
          };
      
      }());

  return function (OO) {
    return Leaf(OO || {});
  };

}());

},{"../util/math/bounds":14,"../util/math/intersects":12,"../util/math/vector":6,"../util/math/within":11}]},{},[1])
;