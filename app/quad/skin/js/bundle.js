(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = (function () {

  require('./core/extends');

  var quadTree = window.quadTree = require('./core/quadTree'),
      clock                      = require('./core/clock'),
      boxFactory                 = require('./models/boxFactory'),
      bouncyBoxFactory           = require('./models/bouncyBoxFactory'),
      shipFactory                = require('./models/shipFactory');




  (function () {

    function initGame () {
        
      var viewport = require('./core/viewport');

      var myQuadTree = quadTree();


      window.myQuadTree = myQuadTree;


      window.clock = clock;


      window.viewport = viewport;

      var myViewport = viewport({
        'quadTree': myQuadTree
      });

      myViewport.zoomBy(100);

      window.myViewport = myViewport;
      window.bouncyBoxFactory = bouncyBoxFactory;


      // myViewport.fullScreenDisplayCanvas.on('click', function (e) {
      //   console.log('Click detected on canvas.');
      //   console.log(e.clientX + ', ' + e.clientY);
      //   console.log(e);
      //   console.log('Created box at ' + myViewport.translateCanvasCoordinates({
      //     'x': e.clientX,
      //     'y': e.clientY
      //   }).x + ', ' + myViewport.translateCanvasCoordinates({
      //     'x': e.clientX,
      //     'y': e.clientY
      //   }).y);
      //   myQuadTree.insert(boxFactory(myViewport.translateCanvasCoordinates({
      //     'x': e.clientX,
      //     'y': e.clientY
      //   })));
      //   myViewport.clearRender();
      //   createBoxForEveryNode(myQuadTree);
      //   myViewport.forceRender();
      // });

      // myQuadTree.insert(boxFactory({
      //   'x': 0,
      //   'y': 0,
      //   'width': 880
      // }));


      // myQuadTree.insert(boxFactory({
      //   'x': 0,
      //   'y': 0,
      //   'height':280
      // }));

      function createBoxForEveryNode (node) {

        var children,
            quadrantList = node.getQuadrantList(node);

        if (quadrantList) {
          quadrantList.reverse();
        }

        if (node.containsPoints) {

          myViewport.addObjectToAlwaysRender(boxFactory({
            'x'     : node.x,
            'y'     : node.y,
            'width' : node.width,
            'height': node.height,
            'color' : 'blue',
            'render': function (ctx, viewport) {
              ctx.strokeStyle = this.color;
              ctx.strokeWidth = 3;
              ctx.strokeRect(-this.width  * viewport.scale / 2,
                             -this.height * viewport.scale / 2,
                             this.width   * viewport.scale,
                             this.height  * viewport.scale);
              if (quadrantList) {
                ctx.fillStyle = '#ffffff';
                ctx.font = (40 * viewport.scale) + 'px Georgia';
                ctx.fillText(
                  quadrantList.toString(), 
                  (this.width  / 2   * viewport.scale) + 
                  -this.width        * viewport.scale / 2,
                  (this.height / 2   * viewport.scale) + 
                  -this.height       * viewport.scale / 2
                );
              }
            }
          }));
          return;
        }

        children = node.children;

        for (var i = 0; i < children.length; i += 1) {
          createBoxForEveryNode(children[i]);
        }

      }

      //createBoxForEveryNode(myQuadTree);

      if (!Math.getRandomInt) {
        Math.getRandomInt = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
      }



      window.shipFactory = shipFactory;

      var myShip = myQuadTree.insert(shipFactory({
        'angle':{
          'x':0.5,
          'y':0
        },
        'quadTree': myQuadTree,
        'viewport': myViewport
      }));

      window.myShip = myShip;
      clock.start();
      console.log(myShip)
      myViewport.follow(myShip);

      setInterval(function () {
        myViewport.clearRender();
        createBoxForEveryNode(myQuadTree);
      }, 50);
      
      for (var i = 0; i < 20; i += 1) {

        var negX   = Math.random() < 0.5,
            negY   = Math.random() < 0.5,
            angleX = Math.random(),
            angleY = Math.random(),
            width  = Math.getRandomInt(25,100);

        myQuadTree.insert(bouncyBoxFactory({

        'width' : width,
        'height': width,

        'quadTree' : myQuadTree,

        'speed': Math.getRandomInt(1, 10),

        'x': Math.getRandomInt(myQuadTree.x - myQuadTree.halfWidth,  myQuadTree.x  + myQuadTree.halfWidth),
        'y': Math.getRandomInt(myQuadTree.y - myQuadTree.halfHeight, myQuadTree.y + myQuadTree.halfHeight),

        'angle': {
          'x': negX ? - angleX : angleX,
          'y': negY ? - angleY : angleY
        },

        // 'color': '#'+Math.floor(Math.random()*16777215).toString(16)
        'color': '#ffffff'
        }));
      }

      for (var i = 0; i < 100; i += 1) {
        myViewport.addObjectToAlwaysRender({
          'x': Math.getRandomInt(-myQuadTree.halfWidth,  myQuadTree.halfWidth),
          'y': Math.getRandomInt(-myQuadTree.halfHeight, myQuadTree.halfHeight),
          'size': Math.getRandomInt(1,5),
          'color': '#ffffff',
          'render': function (ctx, viewport) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.size * viewport.scale / 2, -this.size* viewport.scale / 2, this.size * viewport.scale, this.size * viewport.scale);
          }
        });
      }

      // setInterval(function(){
      //   console.log(myQuadTree.childCount());
      // },2000);

    }

    window.onload = initGame;

  }());

}());

},{"./core/clock":2,"./core/extends":4,"./core/quadTree":8,"./core/viewport":9,"./models/bouncyBoxFactory":10,"./models/boxFactory":11,"./models/shipFactory":14}],2:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var inputs = require('./input'),
  		events = require('./events'),

      UPDATE_BUFFER  = 10,

      getCurrentTime = Date.now,

      now            = 0,
      last           = 0,
      dtBuffer       = 0,

      looping        = false;

  //renderOpsPerSec = Object.create(fps);

  function loop () {

    now = getCurrentTime();

    dtBuffer += now - last;

    events.fire('input', inputs);

    while (dtBuffer >= UPDATE_BUFFER) {
      events.fire('update');
      dtBuffer -= UPDATE_BUFFER;
    }


    events.fire('render');

    last = now;

    if (looping) {
    	setTimeout(loop, 1);
    }

  }

  /*
      PUBLIC METHODS
   */

  function start () {

    if (!looping) {
      console.log('Clock started.');
      looping = true;
      last    = getCurrentTime();

      loop();

    }

  }

  function stop () {

    looping = false;

  }

  return {
    'start': start,
    'stop' : stop,
    'UPDATE_BUFFER': UPDATE_BUFFER
  };

}());
},{"./events":3,"./input":6}],3:[function(require,module,exports){
'use strict';

module.exports = (function () {

  /*jshint validthis: true */

  var list = [];

  function isElement (object) {
    return object instanceof Node || object instanceof HTMLElement;
  }

  function on (name, callback) {

    if (!list[name]) {

      if (isElement(this)) {
        this.addEventListener(name, fire);
      } else {
        window.addEventListener(name, fire);
      }

      list[name] = [];
      list[name].push([this, callback]);

    } else {
      list[name].push([this, callback]);
    }

    return this;

  }

  function off (name, callback, opt) {

    var event = list[name];

    if (opt) {
      if (isElement(this)) {
        this.removeEventListener(name, fire);
       } else {
        window.removeEventListener(name, fire);
       }
    }

    if (event.length) {

      for (var i = 0; i < event.length; i += 1) {
        if (event[i][0] === this) {
          if (!callback) {
            event.splice(i, 1);
            i -= 1;
          } else if (event[i][1] === callback) {
            event.splice(i, 1);
            i -= 1;
          }
        }
      }

    }

    return this;

  }


  function fire (event) {

    var type      = typeof event === 'string' ? event : event.type,
        data      = typeof event === 'string' ? arguments[1] : event,
        listeners = list[type],
        listener;

    if (listeners && listeners.length) {
      for (var i = 0; i < listeners.length; i += 1) {
        listener = listeners[i];
        listener[1].call(listener[0], data);
      }
    }

    return this;

  }

  if (Object.prototype.on === undefined) {
    Object.prototype.on = on;
  }

  if (Object.prototype.off === undefined) {
    Object.prototype.off = off;
  }

  if (Object.prototype.fire === undefined) {
    Object.prototype.fire = fire;
  }

  return {
    'on'  : on,
    'off' : off,
    'fire': fire
  };

}());
},{}],4:[function(require,module,exports){
'use strict';

if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (var key in object) {

      if (typeof object[key] === 'object' &&
          typeof this[key] === 'object'   &&
          this.hasOwnProperty(key)) {

        this[key].extend(object[key]);

      } else {
        this[key] = object[key];
      }
    }
    return this;
  };
}
},{}],5:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var canvas   = document.createElement('canvas'),
      ctx      = canvas.getContext('2d'),
      toResize = true;

  function resize () {
    if (toResize) {
      console.log('Resizing canvas.');
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      toResize      = false;
    }
  }

  function setToResize () {
    console.log('Window resizing.');
    toResize = true;
  }

  window.document.body.appendChild(canvas);
  window.document.body.style.margin = '0px';
  window.document.body.style.overflow = 'hidden';

  canvas.ctx = ctx;

  resize();

  window.addEventListener('resize', setToResize, false);

  return {
    'canvas' : canvas,
    'ctx'    : ctx,
    'resize' : resize
  };

}());

},{}],6:[function(require,module,exports){
'use strict';

module.exports = (function () {


  var keys = require('./keys'),
      inputState = [];

  window.addEventListener('keydown', function (event) {
    inputState[event.which] = true;
  });

  window.addEventListener('keyup', function (event) {
  	inputState[event.which] = false;
  });

  return function (key) {
    return (true === inputState[keys.indexOf(key)]);
  };

}());
},{"./keys":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var bounds     = require('../util/math/bounds'),
      intersects = require('../util/math/intersects'),
      within     = require('../util/math/within');

  var createQuadTree = (function () {

        var boxPrototype = {

          // What quadrants does this box fall within relative to its root?
          //
          // *********************
          // *         *         *
          // *    1    *    4    *
          // *         *         *
          // *         *         *
          // *********************
          // *         *         *
          // *    2    *    8    *
          // *         *         *
          // *         *         *
          // *********************
          'quadrant': undefined, // See above.

          'collidesList' : function () {

            // Get all objects that have a decent chance of colliding with this object
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

            this.x = x;
            this.y = y;

            if (this.root.orphans.indexOf(this) > -1 || !within(this, this.root)) {
              // Update the parent if this is not completely within the parent leaf.
              // Update the parent if this is an orphan
              try {
                this.updateParent();
              } catch (e) {
                //console.log(this);
              }
            }

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

            if (!obj.root) {
              obj.extend(boxPrototype);
            }

            var leafBounds  = bounds(this),
                objBounds   = bounds(obj),
                leftOfLeaf  = (objBounds.left   <= leafBounds.left),
                rightOfLeaf = (objBounds.right  > leafBounds.right),
                aboveLeaf   = (objBounds.top    <= leafBounds.top),
                belowLeaf   = (objBounds.bottom > leafBounds.bottom),
                leafHWidth  = this.width  / 2,
                leafHHeight = this.height / 2,
                quadrant    = (obj.x <= this.x ? 0 : 2) +
                              (obj.y <= this.y ? 0 : 1);

            // console.log('Inserting ' + obj + ' into the quadTree in quadrant ' + quadrant);
            // console.log(objBounds);

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
               // console.log('WHILE left')
                while (obj.x <= leafBounds.left) {
                  obj.x = leafBounds.right + obj.x + leafHWidth;
                }
              }
              if (rightOfLeaf) {
               // console.log('WHILE right')
                while (obj.x > leafBounds.right) {
                  obj.x = leafBounds.left + obj.x - leafHWidth;
                }
              }
              if (aboveLeaf) {
              //  console.log('WHILE above')
                while (obj.y <= leafBounds.top) {
                  obj.y = leafBounds.bottom + obj.y + leafHHeight;
                }
              }
              if (belowLeaf) {
                //console.log('WHILE below')
                while (obj.y > leafBounds.bottom) {
                  obj.y = leafBounds.top + obj.y - leafHHeight;
                }
              }
              objBounds = bounds(obj);
            }

            if (this.containsPoints) {
              //If this leaf contains points, then we can insert the object into it
              obj.root = this;
              obj.quadrant = this.quadrant;

              this.children.push(obj);
              //console.log('Pushed object into quadTree children.');
              if (this.maxChildren < this.children.length && this.maxDepth) {
                this.burst();
              }

            } else {
              /*
                At this point, we know that the object is completely contained
                in a leaf that has sub-leafs.  We must now determine whether or not
                the object is an orphan of the leaf or can be inserted into a sub-leaf.
              */
           //   console.log('Found subleaf');
              var subleaf = this.children[quadrant],
                  subleafBounds = bounds(subleaf),
                  withinSubleaf = (objBounds.left > subleafBounds.left &&
                                  objBounds.right <= subleafBounds.right &&
                                  objBounds.top > subleafBounds.top &&
                                  objBounds.bottom <= subleafBounds.bottom);

              if (withinSubleaf) {
              //  console.log('Completely within subleaf');
                return subleaf.insert(obj);
              } else {
             //   console.log('Gonna be an orphan');
                obj.root = this;
                obj.quadrant = this.quadrantOverlap(obj);
                this.orphans.push(obj);
                return obj;
              }
            }
            return obj;
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

            if (this.root.collapse) {
              this.root.collapse();
            }

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
          'getOrphans' : function () {

            var returnList = [];

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
              Search every orphan on the root of this leaf that may overlap with this leaf
            */
            var returnOrphans = [],
                orphans = this.root.orphans;

            if (!orphans) return returnOrphans;

            for (var i = 0; i < orphans.length; i += 1) {
              if (orphans[i].quadrant & this.quadrant === this.quadrant) {
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
            if (this.childCount() <= this.maxChildren && this.children[0].containsPoints) {
              
              this.children = this.getChildren().concat(this.getOrphans());
              
              for (var i = 0; i < this.children.length; i += 1) {
                this.children[i].root = this;
              }

              this.orphans        = [];
              this.containsPoints = true;
              this.checkForDuplicates(this.children);
            }

          },

          'spawn': function () {

            var root   = this,
                x      = this.x,
                y      = this.y,
                width  = this.width  / 4,
                height = this.height / 4;

            this.containsPoints = false;

            return [

              // Top-Left
              createQuadTree({
                'root'     : root,
                'x'        : x - width,
                'y'        : y - height,
                'quadrant' : 1,
                'bounds'   : true
              }),

              // Bottom-left
              createQuadTree({
                'root'     : root,
                'x'        : x - width,
                'y'        : y + height,
                'quadrant' : 2,
                'bounds'   : true
              }),

              // Top-Right
              createQuadTree({
                'root'     : root,
                'x'        : x + width,
                'y'        : y - height,
                'quadrant' : 4,
                'bounds'   : true
              }),

              // Bottom-Right
              createQuadTree({
                'root'     : root,
                'x'        : x + width,
                'y'        : y + height,
                'quadrant' : 8,
                'bounds'   : true
              })
            ];
          },

          'burst': function () {

            // These children are boxes (not bounding leafs)
            var children = this.children;

            // Now, these children are bounding leafs
            this.children = this.spawn();

            // Don't forget to insert the boxes into our bounding leafs (unless they are orphans!)
            for (var i = 0; i < children.length; i += 1) {
              this.insert(children[i]);
            }

          },

          'getQuadrantList': function (object) {
            
            var quadrantList = [],
                currentRoot  = object.root;
            
            if (!object.quadrant) {
              console.error('Object does not have quadrant property.');
              return;
            }
            
            quadrantList.push(object.quadrant);
            
            while (currentRoot.quadrant) {
              quadrantList.push(currentRoot.quadrant);
              currentRoot = currentRoot.root;
            }
            
            return quadrantList;

          },

          'checkForDuplicates': function (objects) {
            var root = (function (currentRoot) {
              while (currentRoot.root && currentRoot.root.root) {
                currentRoot = currentRoot.root;
              }
              return currentRoot;
            }(this));
            console.log('Checking for any duplicates in ' + root);
            var allChildren = [].extend(root.getChildren());
            var allOrphans  = [].extend(root.getOrphans());
            var allBoxesCount = allChildren.length + allOrphans.length;
            if (allBoxesCount !== root.childCount()) {
              console.error('WTF!');
            }
            for (var i = 0; i < objects.length; i += 1) {
              if (allChildren.indexOf(objects[i]) !== -1) {
                allChildren.splice(allChildren.indexOf(objects[i]), 1);
                if (allOrphans.indexOf(objects[i]) !== -1) {
                  console.error('DUPLICATE FOUND IN ORPHANS');
                }
              }
            }
            for (var i = 0; i < objects.length; i += 1) {
              if (allOrphans.indexOf(objects[i]) !== -1) {
                allOrphans.splice(allOrphans.indexOf(objects[i]), 1);
                if (allChildren.indexOf(objects[i]) !== -1) {
                  console.error('DUPLICATE FOUND IN CHILDREN');
                }
              }
            }
          }

        };

        /**
         * [description]
         * @param  {[Object]} config [The configuration for the quadTree instance]
         * @return {[type]}        [description]
         */
        return function (config) {

          config.root = config.root || {};

          return Object.create(leafBoundPrototype).extend({
            
            'width'       : config.width       || (config.root.width  ? config.root.width  / 2 : 1920),
            'height'      : config.height      || (config.root.height ? config.root.height / 2 : 1080),
            'halfWidth'   : config.width  / 2  || (config.root.width  ? config.root.width  / 4 : 960),
            'halfHeight'  : config.height / 2  || (config.root.height ? config.root.height / 4 : 540),
            'maxChildren' : config.maxChildren || 4,
            'maxDepth'    : config.root.maxDepth ? config.root.maxDepth - 1 : (config.maxDepth || 4),
            'root'        : config.root,
            'quadrant'    : config.quadrant || undefined,
            'x'           : config.x || 0,
            'y'           : config.y || 0,
            'children'    : [],
            'orphans'     : []

           });
          };

      }());

  return function (config) {
    return createQuadTree(config || {});
  };

}());


},{"../util/math/bounds":15,"../util/math/intersects":16,"../util/math/within":18}],9:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var createQuadTree    = require('./quadTree'),
      createVector      = require('../util/math/vector'),
      fullScreenDisplay = require('./fullScreenDisplay'),
      bounds            = require('../util/math/bounds'),
      clock             = require('./clock'),
      viewportCounter   = 0,
      render            = true,
      resizeTimeout,

      viewportProto = {

        // PROPERTIES
        'width'                   : 900,
        'height'                  : 300,
        'zIndex'                  : 0,
        'scale'                   : 1,
        'angle'                   : createVector(0, 0),
        'zoomSpeed'               : 40,
        'speed'                   : 100,
        'up'                      : 'h',
        'left'                    : 'b',
        'right'                   : 'm',
        'down'                    : 'n',
        'zoomDirection'           : 0,
        'zoomIn'                  : 'i',
        'zoomOut'                 : 'k',

        //DISPLAY PROPERTIES
        'fullScreenDisplay'       : fullScreenDisplay,
        'fullScreenDisplayCanvas' : fullScreenDisplay.canvas,
        'fullScreenDisplayCtx'    : fullScreenDisplay.ctx,
        'fullScreenDisplayRange'  : [0, 1, 0, 1],
        'fullScreenDisplayX'      : 0,
        'fullScreenDisplayY'      : 0,

        //-----PROTOTYPE METHODS--------
        'calculateDisplayPositions' : function () {

          // Fullscreen to fit browser window size
          fullScreenDisplay.resize();

          // this.canvas.width  = this.fullScreenDisplayCanvas.width;
          // this.canvas.height = this.fullScreenDisplayCanvas.height;

          //TO DO: Actually calculate x and y fullScreenDisplay positions...
          return this;

        },

        'alwaysRender' : [],

        'addObjectToAlwaysRender': function (obj) {
          this.alwaysRender.push(obj);
        },

        'clearRender': function () {
          this.alwaysRender = [];
        },

        'calculateScale' : function () {

          // // Fullscreen to fit browser window size.
          this.calculateDisplayPositions();

          // Ideal aspect ratio is 3:1 as defined by the prototype width/height
          this.ratio = this.width / this.height;

          // The
          this.fullScreenDisplayRatio = this.fullScreenDisplayCanvas.width / this.fullScreenDisplayCanvas.height;

          // If our display ratio (width/height) is greater than our ideal display ratio (3:1), then scale by height.
          if(this.ratio <= this.fullScreenDisplayRatio) {

            this.scale = this.fullScreenDisplayCanvas.height / this.height;

          } else {

            this.scale = this.fullScreenDisplayCanvas.width  / this.width; //Wtf.

          }

          return this;

        },

        'follow' : function (obj) {
          console.log('Following ' + obj);
          this.following = obj;
        },

        'unfollow' : function () {
          this.following = false;
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

        'translateCanvasCoordinates': function (coordinates) {

          var x = coordinates.x,
              y = coordinates.y;

          return {
            'x': this.bounds.left + x / this.scale,
            'y': this.bounds.top  + y / this.scale
          };

        },

        'inputUpdate': function () {
          var state = this.input(this.up)    * 8 +
                      this.input(this.down)  * 2 +
                      this.input(this.right) * 1 +
                      this.input(this.left)  * 4;
          switch (state) {
            case 0:
              this.angle.x= 0;
              this.angle.y= 0;
              break;
            case 1:
              this.angle.x= 1;
              this.angle.y= 0;
              break;
            case 2:
              this.angle.x= 0;
              this.angle.y= 1;
              break;
            case 3:
              this.angle.x= 0.7071067811865475;
              this.angle.y= 0.7071067811865475;
              break;
            case 4:
              this.angle.x= -1;
              this.angle.y= 0;
              break;
            case 5:
              this.angle.x= 0;
              this.angle.y= 0;
              break;
            case 6:
              this.angle.x= -0.7071067811865475;
              this.angle.y= 0.7071067811865475;
              break;
            case 7:
              this.angle.x= 0;
              this.angle.y= 1;
              break;
            case 8:
              this.angle.x= 0;
              this.angle.y= -1;
              break;
            case 9:
              this.angle.x= 0.7071067811865475;
              this.angle.y= -0.7071067811865475;
              break;
            case 10:
              this.angle.x= 0;
              this.angle.y= 0;
              break;
            case 11:
              this.angle.x= 1;
              this.angle.y= 0;
              break;
            case 12:
              this.angle.x= -0.7071067811865475;
              this.angle.y= -0.7071067811865475;
              break;
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

          var scale      = this.scale,
              ctx        = this.fullScreenDisplayCtx,
              renderList = this.collidesList().concat(this.alwaysRender),
              offsetX    = this.x - this.width / 2,
              offsetY    = this.y - this.height / 2;
          // console.log('~~~~~~~~~~~~~~RENDER LIST~~~~~~~~~~~~~~~~~~~~~');
          // console.log(renderList);
          //get bounds for render
          this.bounds = bounds(this);


          // renderList = sortByProp(renderList, 'zIndex');

          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, this.fullScreenDisplayCanvas.width, this.fullScreenDisplayCanvas.height);

          for (var i = 0; i < renderList.length; i += 1) {
            ctx.save();
            ctx.translate((renderList[i].x - offsetX) * scale, (renderList[i].y - offsetY) * scale);
            if (renderList[i].getRotation) {
             ctx.rotate(renderList[i].getRotation());
            }
            renderList[i].render(ctx, this);
            ctx.restore();
          }

          ctx.strokeStyle = '#E01B6A';
          ctx.lineWidth = '2';
          ctx.strokeRect(0, 0, this.width * scale, this.height * scale);
          return this;

        }

      }.extend(createVector());


  function init (that) {

    that.sim          = clock.UPDATE_BUFFER / 1000;
    that.viewportName = viewportCounter += 1;

    window.addEventListener('resize', function () {

      render = false;

      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(function () {

        that.calculateScale();
        render = true;

      }, 500);

    }, false);

    that.quadTree = that.quadTree || createQuadTree({'bounds':true});

    // Fullscreen to fit browser window size and set scale.
    that.calculateScale();

    that.quadTree.insert(that);
    that.forceRender = function () {
      render = true;
    };
    that.on('update', function () {

      if (this.following) {
        this.x = this.following.x;
        this.y = this.following.y;
      }

      // if (that.quadTree.getOrphans().indexOf(that) !== -1) {
      //   // console.error('~~~~~~IM AN ORPHAN~~~~~~~~');
      // }
      //*.log('UPDATING VIEWPORT....');
      // that.move(that.x + that.angle.x * that.speed * that.sim,
      //           that.y + that.angle.y * that.speed * that.sim)
      //     .zoomBy(that.zoomDirection * that.zoomSpeed * that.sim);

      // return this;

    });

    that.on('render', function () {
      if (render) {
        //console.log('Updating viewport.');
        that.render();

      }
    });

    that.on('input', function (inputs) {
      if (inputs('z')) {
        that.zoomBy(-1);
      }
      if (inputs('x')) {
        that.zoomBy(1);
      }
      render = true;
    });

    return that;

  }

  return function (OO) {
    return init(Object.create(viewportProto).extend(OO || {}));
  };

}());
},{"../util/math/bounds":15,"../util/math/vector":17,"./clock":2,"./fullScreenDisplay":5,"./quadTree":8}],10:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var createVector = require('../util/math/vector'),
      clock        = require('../core/clock');

  var boxPrototype = {

    'x': 0,
    'y': 0,

    'width': 50,
    'height': 50,

    'color': 'green',

    'border': 'blue',

    'lineWidth': 2,

    'angle': {},

    'speed': 1,

    'breaks': 2,

    'isAsteroid': true,

    'removeNextUpdate': false,

    'sim'  : clock.UPDATE_BUFFER,

    'impact': function () {
      var quadTree = this.quadTree;

        this.removeNextUpdate = true;
      if (this.breaks === 0) {
      } else {

        // quadTree.insert(init({
        //   'width': this.width * 0.6,
        //   'height': this.height * 0.6,
        //   'speed': this.speed * 0.9,
        //   'angle': this.angle.rotate(Math.random()),
        //   'breaks': this.breaks - 1
        // }));

        quadTree.insert(create({
          'x': this.x,
          'y': this.y,
          'width': this.width * 0.6,
          'height': this.height * 0.6,
          'speed': this.speed * 0.9,
          'angle': {
            'x': Math.getRandomInt(-180, 180),
            'y': Math.getRandomInt(-180, 180)
          },
          'breaks': this.breaks - 1,
          'quadTree': quadTree
        }));
        quadTree.insert(create({
          'x': this.x,
          'y': this.y,
          'width': this.width * 0.6,
          'angle': {
            'x': Math.getRandomInt(-180, 180),
            'y': Math.getRandomInt(-180, 180)
          },
          'height': this.height * 0.6,
          'speed': this.speed * 0.9,
          'breaks': this.breaks - 1,
          'quadTree': quadTree
        }));

      }

    },

    'update': function () {

      if (this.removeNextUpdate) {
        this.off('update');
       this.remove();
      }

      this.add(this.angle.normalize().mult(this.speed / this.sim));

      this.move(this.x, this.y);

    },

    'render': function (ctx, viewport) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth * viewport.scale;
      ctx.strokeRect(-this.width * viewport.scale / 2, -this.height* viewport.scale / 2, this.width * viewport.scale, this.height * viewport.scale);
    }

  };

  function init(newBox) {
console.log(newBox)
    newBox.extend(createVector(newBox.x, newBox.y));
    newBox.angle.extend(createVector(newBox.angle.x, newBox.angle.y));
    newBox.on('update', newBox.update);

    return newBox;

  }

  function create (config) {
    return init(Object.create(boxPrototype).extend(config));
  };

  return create;

}());
},{"../core/clock":2,"../util/math/vector":17}],11:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var boxPrototype = {
    'x': 0,
    'y': 0,
    'width': 10,
    'height': 10,
    'color': 'yellow',
    'border': 'blue',
    'render': function (ctx, viewport) {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width * viewport.scale / 2, -this.height* viewport.scale / 2, this.width * viewport.scale, this.height * viewport.scale);
    }
  };

  function init(newBox) {

    return newBox;

  }

  return function (config) {
    return init(Object.create(boxPrototype).extend(config));
  };

}());
},{}],12:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var createVector  = require('../util/math/vector'),
      clock         = require('../core/clock'),
	  bulletPrototype = {
      'width'       : 6,
      'height'      : 6,
      'x'           : 0,
      'y'           : 0,
      'color'       : '#ffffff',
      'angle'       : {},
      'velocity'    : {},
      'acceleration': {},
      'mass'        : 3,
      'force'       : 20,
      'range'       : 400,
      'isBullet'    : true,
      'traveled'    : 0,
      'sim'         : clock.UPDATE_BUFFER,
      'render' : function (ctx, viewport) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width * viewport.scale / 2, -this.height* viewport.scale / 2, this.width * viewport.scale, this.height * viewport.scale);
      },
      'update':function () {

        var collidesList = this.collidesList();

        for (var i = 0; i < collidesList.length; i += 1) {
          if (collidesList[i].isAsteroid) {
            collidesList[i].impact(this);
            this.onCollision();
          }
        }

        this.angle.normalize().mult(this.force / this.mass);
        this.traveled += this.angle.length();
        this.add(this.angle);
        this.move(this.x, this.y);

      }
    };

  function init(newBullet) {

    newBullet.extend(createVector(newBullet.x, newBullet.y));
    newBullet.angle.extend(createVector(newBullet.angle.x, newBullet.angle.y));
    newBullet.velocity.extend(createVector());
    newBullet.on('update', newBullet.update);

    return newBullet;
  }

  return function (config) {
    return init(Object.create(bulletPrototype).extend(config));
  };

}());
},{"../core/clock":2,"../util/math/vector":17}],13:[function(require,module,exports){
'use strict';

module.exports = (function () {

	var logProto = {

    'information': {},

    'x': 0,
    'y': 0,

    'width': undefined,
    'height': undefined,

    'font': '20px Georgia',

    'color': '#ffffff',

    'getText': function () {

      var text = '';

      for (var key in this.information) {
        if (this.information.hasOwnProperty(key)) {
          text += key + ': ' + this.information[key] + '\n';
        }
      }

      return text.split('\n');

    },

    'render': function (ctx, viewport) {

      var text = this.getText();

      ctx.font = this.font;
      ctx.fillStyle = this.color;

      for (var i = 0; i < text.length; i += 1) {
        ctx.fillText(text[i], 0, i * 20);
      }

  	}

  };

	function init (newLog) {
		newLog.viewport.addObjectToAlwaysRender(newLog);
    return newLog;
	}

	return function (config) {
    return init(Object.create(logProto).extend(config));
	};

}());
},{}],14:[function(require,module,exports){
'use strict';

module.exports = (function () {

  var createVector  = require('../util/math/vector'),
      clock         = require('../core/clock'),
      createBullet  = require('./bulletFactory'),
      createLog     = require('./logFactory'),

      shipPrototype = {

        'x': 0,
        'y': 0,

        'width': 30,
        'height':30,

        'color': '#ffffff',
        'thrustColor': '#3E65C0',

        'angle': {},
        'velocity': {},
        'acceleration': {},
        'mass': 30,
        'force': 1,

        'bullets': undefined,
        'maxBullets': 7,

        'cooldown': 0,
        'maxCooldown': 0.25,

        'thrustWidthPercentage': 0.8,
        'thrustHeightPercentage': 0.4,

        'rotate': true ,

        'sim': clock.UPDATE_BUFFER / 1000,

        'maxSpeed': 3,

        'thrust': false,
        'fire'  : false,

        'ammoCapacity': 2,

        'fireBullet': function () {

          if (this.bullets.length >= this.maxBullets) {
            return;
          }

          var newBullet = createBullet({
            'x': this.x,
            'y': this.y,
            'angle': {
              'x': this.angle.x,
              'y': this.angle.y
            }
          }),

          that = this;

          newBullet.on('update', function () {
            if (this.traveled > this.range) {
              console.log('Removing bullet');
              that.bullets.splice(that.bullets.indexOf(newBullet, 1));
              this.off('update');
              newBullet.remove();
            }
          });

          newBullet.onCollision = function () {
            that.bullets.splice(that.bullets.indexOf(newBullet, 1));
            this.off('update');
            newBullet.remove();
          };

          this.bullets.push(this.quadTree.insert(newBullet));
        },

        'getRotation': function () {
          return this.angle.toRadians();
        },

        'updatePosition': function () {
          this.add(this.velocity);
          this.move(this.x, this.y);
        },

        'updateVelocity': function () {
          if (this.thrust) this.velocity.add(this.angle.normalize().mult(this.force / this.mass));
        },

        'limitVelocity': function () {
          if (this.velocity.length() > this.maxSpeed) {

            this.velocity.mult(this.maxSpeed / this.velocity.length());

          }
        },

        'update': function () {

          this.updatePosition();
          this.updateVelocity();
          this.limitVelocity();


          if (this.fire && this.cooldown <= 0) {
            this.fireBullet();
            this.cooldown  = this.maxCooldown;
          }

          this.cooldown -= this.sim;

        },

        'render': function (ctx, viewport) {

          var thrustWidth, thrustHeight;

          ctx.fillStyle = this.color;

          ctx.beginPath();

          /*
               | *1
               | *    *
               | *        ->2
               | *    *
               | *3
          */

          //TODO : do the correct math for drawing a triangle...
          ctx.moveTo(-this.width / 2 * viewport.scale, -(this.height * viewport.scale) / 2);
          ctx.lineTo( this.width / 2 * viewport.scale, 0                                  );
          ctx.lineTo(-this.width / 2 * viewport.scale, (this.height * viewport.scale)  / 2);
          ctx.closePath();
          ctx.fill();
          if (this.thrust) {
            ctx.beginPath();
            ctx.fillStyle = this.thrustColor;
            thrustWidth  = this.thrustWidthPercentage  * this.width;
            thrustHeight = this.thrustHeightPercentage * this.height;
            ctx.moveTo(-this.width / 2 * viewport.scale, (this.height * viewport.scale)  / 2);
            ctx.lineTo((-this.width - thrustWidth)  / 2 * viewport.scale, this.height * viewport.scale / 2);

            ctx.lineTo((-this.width  - thrustWidth) / 2 * viewport.scale, (this.height - thrustHeight) * viewport.scale / 2);

            ctx.lineTo(-this.width / 2 * viewport.scale, ((this.height-thrustHeight) * viewport.scale)  / 2);

            ctx.moveTo(-this.width / 2 * viewport.scale, -(this.height * viewport.scale) / 2);

            ctx.lineTo((-this.width - thrustWidth) / 2 * viewport.scale, -(this.height * viewport.scale) / 2);

            ctx.lineTo((-this.width - thrustWidth) / 2 * viewport.scale, ((-this.height + thrustHeight) * viewport.scale) / 2);

            ctx.lineTo(-this.width / 2 * viewport.scale, (((-this.height+thrustHeight)) * viewport.scale) / 2);

            ctx.fill();
            ctx.closePath();
          }

          //ctx.fillRect(-this.width * viewport.scale / 2, -this.height* viewport.scale / 2, this.width * viewport.scale, this.height * viewport.scale);
        },

        'input': function (inputs) {

          if (inputs('w')) {
            this.thrust = true;
            if (this.speed < this.maxSpeed) {
              if (this.speed === 0) {
                this.speed = 1;
              } else {
                this.speed += 1;
              }
            }
          } else {
            this.thrust = false;
          }

          if (inputs('s')) {
            if (this.speed > 0) {
              this.speed -= 0.1;
            }
            if (this.speed < 0) {
              this.speed = 0;
            }
          }

          if (inputs('a')) {
            this.angle.rotate(-0.025);
          }

          if (inputs('d')) {
            this.angle.rotate(0.025);
          }

          if (inputs('v')) {
            this.fire = true;
          } else {
            this.fire = false;
          }

        }
      };

  function init(newShip) {

    newShip.bullets = [];

    newShip.extend(createVector(newShip.x, newShip.y));

    newShip.angle.extend(createVector(newShip.angle.x, newShip.angle.y));

    newShip.velocity.extend(createVector(0, 0));
    newShip.acceleration.extend(createVector(0, 0));

    newShip.on('update', newShip.update);

    newShip.on('input',  newShip.input);

    // createLog({'viewport': newShip.viewport}).on('update', function () {
    //   this.information.velocityX     = newShip.velocity.x;
    //   this.information.velocityY     = newShip.velocity.y;
    //   this.information.angle         = newShip.getRotation() * (180/Math.PI);
    //   this.information.speed         = newShip.velocity.length();
    // });

    return newShip;

  }

  return function (config) {
    return init(Object.create(shipPrototype).extend(config));
  };

}());
},{"../core/clock":2,"../util/math/vector":17,"./bulletFactory":12,"./logFactory":13}],15:[function(require,module,exports){
'use strict';

module.exports = function (obj) {
  var left = obj.x - obj.width / 2,
      right = left + obj.width,
      top = obj.y - obj.height / 2,
      bottom = top + obj.height;
  return {
    'left': left,
    'right': right,
    'top': top,
    'bottom': bottom
  };
};

},{}],16:[function(require,module,exports){
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

},{"./bounds":15}],17:[function(require,module,exports){
'use strict';

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
      };
    }()),

    'normalize' : function () {
      var len = this.length();
      if (len) {
        return this.div(len);
      }
      return this;
    },

    'rotate' : function (angle) {

      var x      = this.x,
          y      = this.y,
          cosVal = Math.cos(angle),
          sinVal = Math.sin(angle);

      this.x = x * cosVal - y * sinVal;
      this.y = x * sinVal + y * cosVal;

      return this;

    },

    'toRadians': function () {
      return Math.atan2(this.y, this.x);
    }

  };

  return function (x, y) {
    return Object.create(vectorProto).extend({
      'x' : x || 0,
      'y' : y || 0
    });
  };

}());

},{}],18:[function(require,module,exports){
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

},{"./bounds":15}]},{},[1]);
