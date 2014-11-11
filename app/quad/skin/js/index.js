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
