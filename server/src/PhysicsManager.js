var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var EnergyManager = require('./EnergyManager');
var CollisionUtil = require('./CollisionUtil');

var GRAVITY = 0.5;
var FRICTION = 0.80;

module.exports = (function() {

  MapManager.generateMap();

  function isEntityColliding(player, objects) {
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
    var energies = EnergyManager.getAll();

    energies.forEach(function(energy) {
      if (energy.fixed) {
        return;
      }

      energy.x += energy.vx;
      energy.y += energy.vy;
      energy.vy += GRAVITY;

      var near = MapManager.getBlocksNear(energy, 256);
      if (isEntityColliding(energy, near)) {
        energy.x -= energy.vx;
        energy.y -= energy.vy;
        energy.vx = 0;
        energy.vy = 0;
        energy.fixed = true;
      };
    });

    players.forEach(function(player) {
      player.vy += GRAVITY;
      player.vx *= FRICTION;

      player.width = (2 + player.energy/4) * 12;
      player.height = (2 + player.energy/4) * 12;

      player.x += player.vx;
      player.collisionX = 0;

      var near = MapManager.getBlocksNear(player, 256);
      if (isEntityColliding(player, near)) {
        if (player.vx > 0) {
          player.collisionX = 1
        } else if (player.vx < 0) {
          player.collisionX = -1
        }
        player.x -= player.vx;
      }

      player.y += player.vy;
      if (isEntityColliding(player, near)) {
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
