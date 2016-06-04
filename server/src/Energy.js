var uuid = require('node-uuid')

module.exports = function() {
  this.x = 0;
  this.y = 0;
  this.width = 10;
  this.height = 10;
  this.id = uuid.v4();
};
