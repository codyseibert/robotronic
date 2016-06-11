var _ = require('lodash');
module.exports = function(options) {
  this.x = options.x;
  this.y = options.y;
  this.WIDTH = 128;
  this.HEIGHT = 128;
  this.width = 128;
  this.height = 128;
  this.timeToLive = 2000;
  this.angle = options.angle;
  this.player = options.player;
  this.charge = options.charge || 1;
}
