var PlayerManager = require('./PlayerManager');

var JUMP_OFFSET = 5;
var JUMP_HEIGHT = 50;
var JUMP_SPEED = -15.0;
var SPEED = 8;

module.exports = (function() {
  function update(delta) {
    var players = PlayerManager.getAll()

    players.forEach(function(player) {
      if (player.input.left) {
        player.vx = -SPEED;
        player.isFacingLeft = true;
      } else if (player.input.right) {
        player.vx = SPEED;
        player.isFacingLeft = false;
      }

      if (player.input.jump && player.canJump) {
        player.y -= JUMP_OFFSET;
        player.vy = JUMP_SPEED;
        player.canJump = false;
      }
    });
  }

  return {
    update: update
  }
}());
