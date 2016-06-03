var PlayerManager = require('./PlayerManager');
var BulletManager = require('./BulletManager');
var Bullet = require('./Bullet');

var JUMP_OFFSET = 5;
var JUMP_HEIGHT = 50;
var JUMP_SPEED = -15.0;
var SPEED = 8;
var FIRE_DELAY = 500;

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

      if (player.input.fire && player.canFire) {
        var angle = player.input.angle;
        player.canFire = false;
        BulletManager.add(new Bullet({
          x: player.x,
          y: player.y,
          angle: angle,
          player: player
        }));
        setTimeout(function(){
          player.canFire = true;
        }, FIRE_DELAY);
      }
    });
  }

  return {
    update: update
  }
}());
