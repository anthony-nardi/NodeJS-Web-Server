(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  function init () {
    window.document.body.appendChild(canvas);
    window.document.body.style.margin = '0px';
    window.document.body.style.overflow = 'hidden';

    canvas.ctx = ctx;

    resize();

    window.addEventListener('resize', setToResize, false);
  }

  return {
    'canvas' : canvas,
    'ctx'    : ctx,
    'resize' : resize,
    'init'   : init
  };

}());

},{}],2:[function(require,module,exports){
'use strict';
var display = require('./display');

window.onload = function () {

	var audioElement = document.createElement('audio'),
			ctx 				 = new AudioContext(),
			audioSrc 		 = ctx.createMediaElementSource(audioElement),
			analyser 		 = ctx.createAnalyser(),
			gainNode     = ctx.createGain(),
      src;

  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(analyser);
	audioSrc.connect(gainNode);
	gainNode.connect(ctx.destination);

  if (!!audioElement.canPlayType('audio/mpeg')) {
    src = '/app/music/sevenlions.mp3';
  } else if (!!audioElement.canPlayType('audio/ogg')) {
    src = '/app/music/sevenlions.ogg';
  } else {
    alert('Browser does not support .mp3 or .ogg');
    return;
  }


 	audioElement.src = src;

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
},{"./display":1}]},{},[2]);
