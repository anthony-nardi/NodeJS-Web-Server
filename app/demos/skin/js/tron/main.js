module.exports = (function () {
  
  require('./extend');
   var canvas = require('./canvas'),
      backgroundFactory = require('./background'),
      tileMapFactory = require('./tileMap'),
      input = require('./input'),
      clockFactory = require('./clock'),
      clock = clockFactory(),
      playerFactory = require('./player');

  var drawBackground = backgroundFactory({ 
  	'ctx' : canvas.ctx,
  	'width' : canvas.width,
  	'height' : canvas.height,
  	'color' : '#000000'
  }).draw();

  var tileMap = tileMapFactory({
  	'canvas' : canvas,
  	'width' : 190,
  	'height' : 100,
  	'tileColor' : '#000000',
  	'tileBorder' : '#000066'
  })

  var playerOne = playerFactory({
  	'x' : ~~(tileMap.width / 3),
  	'y' : ~~(tileMap.height / 3),
  	'tileMap' : tileMap,
  	'color' : '#FF66FF',
  	'clock' : clock,
  	'input' : input
  });

  var playerTwo = playerFactory({
  	'x' : ~~(tileMap.width / 2),
  	'y' : ~~(tileMap.height / 2),
  	'tileMap' : tileMap,
  	'color' : '#1975FF',
  	'up' : 'UP',
  	'down' : 'DOWN',
  	'right' : 'RIGHT',
  	'left' : 'LEFT',
  	'clock' : clock,
  	'input' : input,
  	'horizontal' : 0,
  	'vertical' : -1
  });

  var playerThree = playerFactory({
  	'x' : ~~(tileMap.width) - 4,
  	'y' : ~~(tileMap.height) - 4,
  	'tileMap' : tileMap,
  	'color' : '#FFFF66',
  	'up' : 'i',
  	'down' : 'k',
  	'right' : 'l',
  	'left' : 'j',
  	'clock' : clock,
  	'input' : input,
  });

  clock.start();

  window.tileMap = tileMap;

}())