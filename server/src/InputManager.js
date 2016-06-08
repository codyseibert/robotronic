var PlayerManager = require('./PlayerManager');
var BulletManager = require('./BulletManager');
var Bullet = require('./Bullet');

var JUMP_OFFSET = 0;
var JUMP_SPEED = -35.0;
var SPEED = 20;
var FIRE_DELAY = 250;

module.exports = (function() {
  function update(delta) {
    var players = PlayerManager.getAll()

    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];

      if (player.energy <= 0){
        continue;
      }

      if (player.input.left) {
        player.vx = -SPEED + player.energy / 5.0;
        player.isFacingLeft = true;
      } else if (player.input.right) {
        player.vx = SPEED + player.energy / 5.0;
        player.isFacingLeft = false;
      }

      if (player.input.jump && player.canJump) {
        player.y -= JUMP_OFFSET;// + player.energy / 2.0;
        player.vy = JUMP_SPEED - player.energy / 2.0;
        player.canJump = false;
      }

      if (player.input.fire && player.canFire) {
        var angle = player.input.angle;
        player.canFire = false;
        BulletManager.add(new Bullet({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          angle: angle,
          player: player
        }));
        setTimeout((function(player) {
          return function(){
            player.canFire = true;
          }
        }(player)), FIRE_DELAY);
      }
    };
  }

  return {
    update: update
  }
}());
