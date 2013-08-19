require('./extend');
var board = require('./board'),
    pathFinder = require('./aStar');

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d');

window.restart = function () {
  var myBoard = board({'ctx' : ctx, 'canvas' : myCanvas}).createGameArray(),
	    numObstacles = (function (min, max) {
        return ~~(Math.random() * (max - min) + min);
      }(8,39)),
      myPathFinder;

  window.myBoard = myBoard;
	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

  for (var i = 0; i < numObstacles; i += 1) {
    myBoard.generateObstacle();
  }

  myBoard.generateEndPoints();

  //initiating the open set with the start point
  myPathFinder = pathFinder({
  	'myBoard' : myBoard
  })
}
window.restart();
}
