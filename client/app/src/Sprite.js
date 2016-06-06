module.exports = (function() {

	function Sprite(props) {

		for (var key in props) {
			this[key] = props[key];
		}

		// TODO: image cache
		this.spriteImage = new Image();
		this.spriteImage.src = this.url;

		// animation
		this.frameIndex = 0;
		this.animFPS = 1;
		this.currentAnim = null;
		this.animations = {};

	}

	Sprite.prototype.playAnimation = function(name, speed, once) {
		this.animFPS = speed;
		this.frameIndex = 0;
		this.currentAnim = name;
	};

	Sprite.prototype.update = function(dt) {
		if (this.currentAnim !== null) {
			this.frameIndex = (this.frameIndex + this.animFPS * dt) % this.animations[this.currentAnim].frames.length;
		}
	};

	Sprite.prototype.stopAnimation = function() {
		this.currentAnim = null;
		this.frameIndex = 0;
	};

	Sprite.prototype.addAnimation = function(name, frames) {
		this.animations[name] = { frames: frames };
	};

	Sprite.prototype.render = function(x, y, context, CameraManager) {
		var scale = 1;
		var scaleX = this.isFacingLeft ? -1 : 1;
		// animation
		var dx = 0;
		if (this.currentAnim !== null) {
			dx = this.width * this.animations[this.currentAnim].frames[Math.floor(this.frameIndex)];
		}

		// facing
		var fx = this.isFacingLeft ? this.width : 0;
		//var dy = this.isFacingLeft ? this.height : 0;

		context.save();
		context.translate(x + fx + CameraManager.getCX(), y + CameraManager.getCY());
		context.scale(scaleX * scale, scale);
		context.drawImage(this.spriteImage, dx, 0, this.width, this.height, 0, 0, this.width, this.height);
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

	return Sprite;
}());
