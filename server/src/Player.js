var _ = require('lodash');
var Entity = require('./Entity');

module.exports = function() {
  _.extend(this, new Entity());
  this.width = 12;
  this.height = 12;
  this.energy = 3;
  this.isFacingLeft = false;
  this.bulletDamage = 1;
  this.input = {
    left: false,
    right: false,
    jump: false,
    fire: false,
    angle: 0
  };
  this.canJump = false;
  this.canFire = true;
  this.wallStick = false;
}
