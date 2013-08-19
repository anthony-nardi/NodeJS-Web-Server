module.exports = (function () {
  var canvas = document.createElement('canvas');

  canvas.width = 1900;
  canvas.height = 1000;
  canvas.ctx = canvas.getContext('2d');;
  console.log(canvas.ctx)
  //setfull screen styles
  document.body.appendChild(canvas);
  document.body.style.margin = '0px';
  document.body.style.overflow = 'hidden';
  console.log(canvas.ctx)

  return canvas;

}());
