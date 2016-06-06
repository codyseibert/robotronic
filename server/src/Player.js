var _ = require('lodash');
var Entity = require('./Entity');

module.exports = function() {
  _.extend(this, new Entity());
  this.width = 12;
  this.height = 12;
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
}
