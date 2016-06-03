var _ = require('lodash');
var Entity = require('./Entity');

module.exports = function() {
  _.extend(this, new Entity());
  this.width = 64;
  this.height = 64;
  this.isFacingLeft = false;
  this.input = {
    left: false,
    right: false,
    jump: false,
    explode: false
  };
  this.canJump = false;
}
