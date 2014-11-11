'use strict';

require('../audio/recorder.js');

window.onload = function () {

  if (!window.Recorder) {
    console.log('Recorder did not load.');
  }

  var audioCtx,
      audioRecorder;

  navigator.getUserMedia = navigator.getUserMedia       ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia    ||
                           navigator.msGetUserMedia;

  window.AudioContext = window.AudioContext ||
                        window.webkitAudioContext;

  audioCtx = new AudioContext();

  function hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia);
  }


  function errorCallback(arg) {
    console.log(arg);
  }

  if (hasGetUserMedia()) {
    navigator.getUserMedia({audio:true}, function (stream) {
      window.stream = stream;
      var mic = audioCtx.createMediaStreamSource(stream);
      audioRecorder = new Recorder(mic);
      window.audioRecorder = audioRecorder;
      mic.connect(audioCtx.destination);
      audioRecorder.clear();
      audioRecorder.record();
      setTimeout(function () {
        console.log('exporting...');
        audioRecorder.exportWAV(function (blob) {
          Recorder.setupDownload( blob, "myRecording.wav" );
        });
      }, 15000);
    }, errorCallback);
  }

};