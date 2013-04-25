moduleLoader.imports('mainView', ['viewport', 'events'], function (viewport, events) {

  var mainView      = Object.create(viewport).extend(events),
      handle        = mainView.handle,
      state         = mainView.state,
      render        = state.render = true;

  mainView.initializeCanvas({    
    
    'id':'viewport',
    
    'parent':document.getElementById('container'),
    
    'style': {
      
      'width':'100%',
      'height':'100%',
      'margin':'auto',
      'border':'1px solid black',
      'display':'block'
    
    }
  
  }).initializeGrid({
    
    'id':'viewport',
    
    'width':20,
    'height':20,
    
    'tile': {
      'width':100,
      'height':100
    }
  
  });

  var canvasElement = mainView.getElement(),
      ctx           = mainView.getContext(),
      canvasWidth   = canvasElement.width,
      canvasHeight  = canvasElement.height;

  handle['mousemove'] = function (event) {
    
    if (event.target.id === mainView.canvasId && event.which === 1) {
      state.moving = true;
    } 
    if (event.target.id === mainView.canvasId) {
      state.render = true;
    }

  };

  handle['mouseup'] = function (event) {
    
    if (event.target.id === mainView.canvasId) {
      state.moving = false;
    }
  
  };

  handle['mousewheel'] = function (event) {
    
    event.wheelDelta > 0 ? state.zooming = 1 : state.zooming = -1;
    state.render = true;
  
  };

  handle['click'] = function (event) {
    var tilePos = this.getTilePosFromPointer(this.getCurrentPointerPosition());
  };
 
  var render = function () {
      
    if (state.render) {
     
     var tileOffsetX   = this.tileOffsetX(),
         tileOffsetY   = this.tileOffsetY(),
         tileRowCount  = this.tileRowCount(),
         tileColCount  = this.tileColCount(),
         tileWidth     = this.getTileWidth(),
         tileHeight    = this.getTileHeight(),
         scrollX       = this.scroll.x,
         scrollY       = this.scroll.y;

      ctx.fillStyle = '#9A32CD';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.strokeStyle = '#EEEf00';
      ctx.lineWidth = 2 * this.zoom;
      
      for (var x = tileOffsetX < 0 ? 0 : tileOffsetX; x < tileRowCount + 1; x += 1) {
        for (var y = tileOffsetY < 0 ? 0 : tileOffsetY; y < tileColCount + 1; y += 1) {
          if (this.tileMap[x] && this.tileMap[x][y]) {
            ctx.strokeRect(
              tileWidth * x - scrollX, 
              tileHeight * y - scrollY, 
              tileWidth, 
              tileHeight
            );
          }
        }
      }
    }

    render = false;

  };
  
  var update = function () {
    if (state['moving']) move();
    if (state['zooming']) zoom();
  };  
  
  mainView.on('render', render);
  mainView.on('update', update);


  
  var zoom = function () {
    
    var lastTileWidth = mainView.getTileWidth(),
        lastTileHeight = mainView.getTileHeight(),
        tilesX = ((canvasWidth / 2) + mainView.scroll.x) / mainView.getTileWidth(),
        tilesY = ((canvasHeight / 2) + mainView.scroll.y) / mainView.getTileHeight(),
        deltaWidth = 0, deltaHeight = 0;

    state['zooming'] === 1   ? 
      mainView.zoom < 4 ? mainView.zoom += .1 : mainView.zoom = 4 : 
      mainView.zoom <= .5 ? 
        mainView.zoom = .5 : 
        mainView.zoom -= .1;

    deltaWidth = mainView.getTileWidth() - lastTileWidth;
    deltaHeight = mainView.getTileHeight() - lastTileHeight;

    mainView.scroll.x += deltaWidth * tilesX;
    mainView.scroll.y += deltaHeight * tilesY;
    state.zooming = 0;
      
  };

  var move = function () {  //instance
    mainView.scroll.x -= (mainView.getCurrentPointerPosition().x - mainView.getLastPointerPosition().x);
    mainView.scroll.y -= (mainView.getCurrentPointerPosition().y - mainView.getLastPointerPosition().y);
    state.moving = false;
  };

  return mainView;

});