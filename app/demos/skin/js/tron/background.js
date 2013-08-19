module.exports = (function () {
	var backgroundProto = {
		"draw" : function () {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return this;
		}
	}
  return function (OO) {
    return Object.create(backgroundProto).extend(OO);
  }
}())