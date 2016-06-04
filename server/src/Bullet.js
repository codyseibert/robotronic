var _ = require('lodash');
module.exports = function(options) {
  this.x = options.x;
  this.y = options.y;
  this.width = 5;
  this.height = 5;
  this.timeToLive = 2000;
  this.angle = options.angle;
  this.player = options.player;
}
