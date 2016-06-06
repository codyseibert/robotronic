module.exports = (function() {

	function Sprite(props) {

		for (var key in props) {
			this[key] = props[key];
		}

		this.spriteImage = new Image();
		this.spriteImage.src = this.url;

		this.animations = {};

	}

	Sprite.prototype.render = function(x, y, context, CameraManager) {
		var scale = 1;

		var dy = this.isFacingLeft ? this.height : 0;

		context.save();
		context.translate(x + CameraManager.getCX(), y + CameraManager.getCY());
		context.scale(1 / scale, 1 / scale);
		context.drawImage(this.spriteImage, 0, dy, this.width, this.height, 0, 0, this.width, this.height);
		context.restore();

		if (window.DEBUG) {
			context.save();
			context.translate(x + CameraManager.getCX(), y + CameraManager.getCY());
			context.beginPath();
			context.rect(0, 0, this.width, this.height);
			context.stroke();
			context.closePath();
			context.restore();
		}
	};

	Sprite.prototype.addAnimation = function(name, frames) {

	};

	return Sprite;
}());
