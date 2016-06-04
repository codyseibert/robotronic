var _ = require('lodash');
module.exports = function(options) {
  this.x = options.x;
  this.y = options.y;
  this.width = 15;
  this.height = 15;
  this.timeToLive = 2000;
  this.angle = options.angle;
  this.player = options.player;
}
