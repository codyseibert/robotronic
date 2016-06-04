var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var CollisionUtil = require('./CollisionUtil');

var GRAVITY = 0.5;
var FRICTION = 0.80;

module.exports = (function() {

  MapManager.generateMap();

  function isPlayerColliding(player, objects) {
    for (var i = 0; i < objects.length; i++) {
      obj = objects[i];
      if (CollisionUtil.isColliding(player, obj)) {
        return true;
      }
    }
    return false;
  }

  function update(delta) {
    var players = PlayerManager.getAll();
    var map = MapManager.getCurrentMap();

    players.forEach(function(player) {
      player.vy += GRAVITY;
      player.vx *= FRICTION;

      player.x += player.vx;
      var near = MapManager.getBlocksNear(player, 128);
      if (isPlayerColliding(player, near)) {
        player.x -= player.vx;
      }

      player.y += player.vy;
      if (isPlayerColliding(player, near)) {
        if (player.vy > 0) {
          player.canJump = true;
        }

        player.y -= player.vy;
        player.vy = 0;
      }
      
      if (player.vy > 0) {
        player.canJump = false;
      }
    });
  }

  return {
    update: update
  };
}());
