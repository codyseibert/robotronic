var PlayerManager = require('./PlayerManager');
var BulletManager = require('./BulletManager');
var Bullet = require('./Bullet');

var JUMP_SPEED = -35.0;
var WALL_JUMP_SPEED = -50;
var SPEED = 30;
var FIRE_DELAY = 250;
var JUMP_SCALE = 0.25;
var SPEED_SCALE = 0.25;
var MAX_CHARGE = 100;

module.exports = (function() {
  function update(delta) {
    var players = PlayerManager.getAll()

    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];

      if (player.energy <= 0){
        continue;
      }

      if (player.input.left) {
        player.vx = -(SPEED + player.energy * SPEED_SCALE);
        player.isFacingLeft = true;
      } else if (player.input.right) {
        player.vx = SPEED + player.energy * SPEED_SCALE;
        player.isFacingLeft = false;
      }

      if (player.input.jump && player.canJump) {
        player.vy = JUMP_SPEED - player.energy * JUMP_SCALE;
        player.canJump = false;
        player.canWallJump = false;
      } else if (player.input.jump && player.canWallJump) {
        player.vy = JUMP_SPEED - player.energy * JUMP_SCALE;

        if (player.collisionX === -1) {
          player.vx = -1 * (WALL_JUMP_SPEED + JUMP_SPEED - player.energy * JUMP_SCALE);
        } else if (player.collisionX === 1) {
          player.vx = WALL_JUMP_SPEED + JUMP_SPEED - player.energy * JUMP_SCALE;
        }

        player.canWallJump = false;
      }

      if (player.input.fire) {
        player.charge = Math.min(MAX_CHARGE + player.energy, player.charge + 2);
      }

      if (player.charge > 0 && !player.input.fire && player.canFire) {

        var angle = player.input.angle;
        // var angle = Math.atan2(player.input.ty - (player.y + player.height / 2), player.input.tx - (player.x + player.width / 2));
        BulletManager.add(new Bullet({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          angle: angle,
          player: player,
          charge: player.charge
        }));

        player.charge = 0;
        player.canFire = false;

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
