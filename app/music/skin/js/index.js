var display = require('./display');

window.onload = function () {

	var audioElement = document.createElement('audio'),
			ctx 				 = new AudioContext(),
			audioSrc 		 = ctx.createMediaElementSource(audioElement);
			analyser 		 = ctx.createAnalyser(),
			gainNode     = ctx.createGain();

  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(analyser);
	audioSrc.connect(gainNode);
	gainNode.connect(ctx.destination);

 	audioElement.src = '/app/music/sevenlions.mp3';

	document.body.appendChild(audioElement);

	window.audioElement = audioElement;
	window.display      = display;

  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // we're ready to receive some data!
  // loop
  function renderFrame() {

    var lowSum  = 0,
        midSum  = 0,
        highSum = 0,
        midThird = display.canvas.width / 3 / 2;

    requestAnimationFrame(renderFrame);
    // update data in frequencyData

    analyser.getByteFrequencyData(frequencyData);
    // render frame based on values in frequencyData
    // console.log(frequencyData)
    display.ctx.fillStyle = '#000000';
  	display.ctx.fillRect(0,0,display.canvas.width,display.canvas.height);
	  display.ctx.fillStyle = '#1fc00c';
    var width = display.canvas.width / 255;

    for (var i = 0; i < frequencyData.length; i += 1) {

      if (i < 86)        lowSum  += frequencyData[i];
      if (86 < i < 171)  midSum  += frequencyData[i];
      if (171 < i < 256) highSum += frequencyData[i];

    	display.ctx.fillRect(width * i, display.canvas.height - frequencyData[i], width, frequencyData[i]);

    }

    display.ctx.fillStyle = '#fe11a3';
    display.ctx.beginPath();
    display.ctx.arc(midThird, display.canvas.height / 3, lowSum / 85 /2, 0, 2 * Math.PI, false);
    display.ctx.fill();

    display.ctx.fillStyle = '#a1a1ef';
    display.ctx.beginPath();
    display.ctx.arc(midThird * 2, display.canvas.height / 3, lowSum / 85 /2, 0, 2 * Math.PI, false);
    display.ctx.fill();

    display.ctx.fillStyle = '#112afe';
    display.ctx.beginPath();
    display.ctx.arc(midThird * 3, display.canvas.height / 3, lowSum / 85 /2, 0, 2 * Math.PI, false);
    display.ctx.fill();
  }

  display.ctx.fillStyle = '#000000';
 	display.init();
 	display.ctx.fillStyle = '#1fc00c';
  display.ctx.fillRect(0,0,display.canvas.width,display.canvas.height);
  audioElement.play();
  renderFrame();

};