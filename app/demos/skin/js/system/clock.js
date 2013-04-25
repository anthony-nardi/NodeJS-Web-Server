moduleLoader.imports('clock', ['inputs', 'events', 'fps'], function (inputs, events, fps) {
   
  var returnObject = {},
  
  getNow = Date.now,
  now = 0, last = 0,
  delta = 0,
  dtBuffer = 0,  
  looping = false,
  SIM_RES = 10,
  renderOpsPerSec = Object.create(fps),
  fpsStart = renderOpsPerSec.start,
  fpsEnd = renderOpsPerSec.end,
  dispatch = inputs.dispatch,
  clear = inputs.clear,
  fire = events.fire;

  var loop = function () {
  
    now = getNow();
    delta = (now - last);
    dtBuffer += delta;

    dispatch();

    while (dtBuffer >= SIM_RES) {
      fire('update');
      //fire('checkCollisions');
      dtBuffer -= SIM_RES;
    }
    
    fpsStart();
    fire('render');
    fpsEnd();

    clear();
    
    last = now;

    if (looping) setTimeout(loop, 1);

  };

  var start = function () {
  
    if (!looping) {
      
      looping = true;
      last = getNow();
      loop();
    
    }
    
  };

  var stop = function () {
    
    clearTimeout(loop);
    looping = false;

  };

  returnObject.start = start;
  returnObject.stop = stop;
  returnObject.SIM_RES = SIM_RES;

  return returnObject;

});
