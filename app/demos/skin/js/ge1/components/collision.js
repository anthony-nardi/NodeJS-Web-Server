moduleLoader.imports('collision', ['events'], function (events) {
  
  var collisionObjects = [],
      collisionCallbacks = [];

  var isOverlap = function (shape1, shape2) {
      
    var collisions = 0,
        s1left = shape1.x,
        s1right = shape1.x + shape1.width,
        s1top = shape1.y,
        s1bottom = shape1.y + shape1.height,
        s2left = shape2.x,
        s2right = shape2.x + shape2.width,
        s2top = shape2.y,
        s2bottom = shape2.y + shape2.height;

    if (s1left > s2left && s1top > s2top && s1right < s2right && s1bottom < s2bottom) { 
      //shape1 inside shape2
      return true;
    }
    if (s2left > s1left && s2top > s1top && s2right < s1right && s2bottom < s1bottom) {
      //shape2 inside shape1
      return true;
    }
    if (s1left < s2left && s2left < s1right && s1top < s2top && s2top < s1bottom) {
      //left edge of shape2 is inside shape1
      return true;
    }
    if (s1left < s2left && s2left < s1right && s1top < s2bottom && s2bottom < s1bottom) {
      return true;
    }
    if (s1left < s2right && s2right < s1right && s1top < s2top && s2top < s1bottom) {
      //right edge of shape2 is inside shape1
      return true;
    }
    if (s1left < s2right && s2right < s1right && s1top < s2bottom && s2bottom < s1bottom) {
      //right edge of shape2 is inside shape1
      return true;
    }

    return false;
  
  };

  events.on('checkCollisions', function () {

    for (var i=0; i<collisionObjects.length; i+=1) {
      
      if (!collisionObjects[i + 1]) return;
      
      for (var j=1; j<collisionObjects.length; j+=1) {
        
        if (isOverlap(collisionObjects[i], collisionObjects[j])) {
          try {
            collisionCallbacks[i].call(collisionObjects[i], collisionObjects[j]);
            collisionCallbacks[j].call(collisionObjects[j], collisionObjects[i]);
          } catch (e) {
            console.log(e);
          }
          
        }
      
      }
    }
    
  });

  var collision = {

  	'collides': function (callback) {
  		collisionObjects.push(this);
      collisionCallbacks.push(callback);
  		return this;
  	},
    'notcollides': function (callback) {
      collisionObjects.splice(collisionObjects.indexOf(this), 1);
      collisionCallbacks.splice(collisionCallbacks.indexOf(this), 1);
      return this;
    }

  };

  return collision;

});