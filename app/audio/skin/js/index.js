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


  function getDataURLFromBlob (blob, callback) {
    var f = new FileReader();
    f.onload = function () {
      callback(f.result);
    };
    f.readAsDataURL(blob);
  }

  function errorCallback(arg) {
    console.log(arg);
  }

  if (hasGetUserMedia()) {
    navigator.getUserMedia({audio:true}, function (stream) {
      window.stream = stream;
      var mic = audioCtx.createMediaStreamSource(stream);
      window.mic = mic;
      audioRecorder = new Recorder(mic);
      window.audioRecorder = audioRecorder;
      mic.connect(audioCtx.destination);
      audioRecorder.clear();
      audioRecorder.record();
      setTimeout(function () {
        audioRecorder.stop();
        mic.disconnect();
        console.log('exporting...');
        audioRecorder.exportWAV(function (blob) {
          console.log(blob);
          window.blob = blob;
          getDataURLFromBlob(blob, function (result) {
            window.recording = result;
            console.log(result);
            var httpReq = new XMLHttpRequest();
            httpReq.open('POST', window.location.href + '/index/save');
            httpReq.send(result);
          });
          // Recorder.setupDownload( blob, "myRecording.wav" );
        });
      }, 1000);
    }, errorCallback);
  }

};