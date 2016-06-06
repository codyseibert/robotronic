
var Sprite = require('./Sprite');

module.exports = (function() {

	function Player(id) {
		var self = this;

		this.id = id;
		this.width = 48;
		this.height = 48;
		this.health = 10;
		this.energy = 0;
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
			isFacingLeft: false
		});

	}

	Player.prototype.setProps = function(props) {
		for (var key in props) {
			this[key] = props[key];
		}
		this.sprite.isFacingLeft = props.isFacingLeft;
	};

	Player.prototype.render = function(context, CameraManager) {
		if (this.health <= 0) {
			return;
		}

		this.sprite.render(this.x, this.y, context, CameraManager);

		// write name
		context.save();
		context.translate(this.x + CameraManager.getCX(), this.y + CameraManager.getCY());
		context.font = "20px Georgia";
		context.fillText(this.name, (this.name.length / 2) * -5, -10);
		context.restore();

	};

	return Player;
}());

