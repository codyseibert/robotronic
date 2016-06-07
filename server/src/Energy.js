var uuid = require('node-uuid')

module.exports = function() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.fixed = true;
  this.width = 10;
  this.height = 10;
  this.ready = true;
  this.id = uuid.v4();
};
