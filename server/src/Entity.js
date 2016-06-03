var uuid = require('node-uuid')

module.exports = function() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.id = uuid.v4();
};
