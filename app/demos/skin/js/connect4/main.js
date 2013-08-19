require('./extend');
var player = require('./player'),
    board = require('./board'),
    aiConstructor = require('./gameAI');


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d'),
	    myBoard = board(),
	    gameState = myBoard.createGameArray(),
	    myPlayer = player(),
	    myAI = aiConstructor({ 'depth' : 4 });

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

  var winner = function (ctx, myCanvas) {
  	ctx.fillStyle = '#000000';
  	ctx.fillRect((myCanvas.width/2 - 300), (myCanvas.height/2 - 100), 600, 150);
  	ctx.fillStyle = '#FF0000';
  	ctx.font = '100px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Game Over', myCanvas.width/2, myCanvas.height/2);
  	ctx.fillStyle = '#000000';
  	ctx.fillRect((myCanvas.width/2 - 150), 2*(myCanvas.height/3), 300, 50);
  	ctx.fillStyle = '#FF0000';
  	ctx.font = '20px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Refresh To Play Again!', myCanvas.width/2, 2*(myCanvas.height/3) + 30);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      if (myAI.winner(gameState.gameBoard)) {
      	setTimeout(function () { winner(ctx, myCanvas) }, 2000);
      	return;
      }
      gameState.storedAlpha = undefined;
      myAI.botChecker(gameState);
      myAI.moveApiPlayer(gameState);
      update(ctx, myCanvas);
      if (myAI.winner(gameState.gameBoard)) {
      	setTimeout(function () { winner(ctx, myCanvas) }, 2000);
      	return;
      }
		}
	});

  update(ctx, myCanvas);

}