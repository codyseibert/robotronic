
var Sprite = require('./Sprite');

module.exports = (function() {

	function Player(id) {
		var self = this;

		this.id = id;
		this.width = 16;
		this.height = 16;
		this.energy = 3;
		this.isFacingLeft = false;
		this.bulletDamage = 1;
		this.input = {
			left: false,
			right: false,
			jump: false,
			explode: false
		};
		this.canJump = false;
		this.canFire = true;

		this.sprite = new Sprite({
			url: 'assets/images/robot.png',
			width: this.width,
			height: this.height,
			scale: 2,
			isFacingLeft: false
		});

		this.sprite.addAnimation('hover', [0, 1]);
		this.sprite.addAnimation('run', [0, 2]);
		this.sprite.playAnimation('hover', 3);
		//this.sprite.playAnimation('run', 12);
	}

	Player.prototype.update = function(dt) {
		this.sprite.update(dt);
	};

	Player.prototype.setProps = function(props) {

		var oldEnergy = this.energy;
		for (var key in props) {
			this[key] = props[key];
		}

		// level up scale
		this.sprite.isFacingLeft = props.isFacingLeft;
		this.sprite.scale =  2 + this.energy/10.0;

		if (oldEnergy < 10 && this.energy >=10) {
			this.sprite.setImage('assets/images/robot2.png');
		}
	};

	Player.prototype.render = function(context, CameraManager) {
		if (this.energy <= 0) {
			return;
		}

		this.sprite.render(this.x, this.y, context, CameraManager);

		// write name
		context.save();
		context.translate(this.x + CameraManager.getCX(), this.y + CameraManager.getCY());
		var fontSize = 16 + Math.floor(this.energy/4);
		context.font = fontSize + "px 'Orbitron'";
		context.fillText(this.name, (this.name.length / 2) * -5, -10);
		context.restore();

	};

	return Player;
}());
