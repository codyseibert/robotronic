var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var EnergyManager = require('./EnergyManager');
var CollisionUtil = require('./CollisionUtil');

var GRAVITY = 5;
var FRICTION = 1.2;
var DELTA_SCALE = 100.0
var SLIDE_SPEED = 0.1;

module.exports = (function() {

  MapManager.generateMap();

  function isEntityColliding(player, objects) {
    for (var i = 0, len = objects.length; i < len; i++) {
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

    for (var i = 0, len = energies.length; i < len; i++) {
      var energy = energies[i];

      if (energy.fixed) {
        continue;
      }

      energy.x += energy.vx * delta / DELTA_SCALE;
      energy.y += energy.vy * delta / DELTA_SCALE;
      energy.vy += GRAVITY;

      var near = MapManager.getBlocksNear(energy, 256);
      if (isEntityColliding(energy, near)) {
        energy.x -= energy.vx * delta / DELTA_SCALE;
        energy.y -= energy.vy * delta / DELTA_SCALE;
        energy.vx = 0;
        energy.vy = 0;
        energy.fixed = true;
      };
    }

    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];

      if (player.energy <= 0) {
        continue;
      }

      player.vy += GRAVITY * delta / DELTA_SCALE;
      player.vx *= FRICTION * delta / DELTA_SCALE;

      player.width = (2 + player.energy/4.0) * 12;
      player.height = (2 + player.energy/4.0) * 12;

      // check if player is stuck
      var near = MapManager.getBlocksNear(player, 512);

      player.x += player.vx * delta / DELTA_SCALE;
      player.collisionX = 0;
      player.canWallJump = false;

      if (isEntityColliding(player, near)) {
        if (player.vx > 0) {
          player.collisionX = 1
        } else if (player.vx < 0) {
          player.collisionX = -1
        }
        player.x -= player.vx * delta / DELTA_SCALE;
      }

      if (!player.wallStick) {
        player.y += player.vy * delta / DELTA_SCALE;
      }

      if (isEntityColliding(player, near)) {
        player.canJump = true;
        player.y -= player.vy * delta / DELTA_SCALE;
        player.vy = 0;
      }

      if (player.vy > 0) {
        player.canJump = false;
      }
      
      if (!player.canJump && (player.collisionX === 1 || player.collisionX === -1)) {
        player.canWallJump = true;
      }
    };
  }

  return {
    update: update
  };
}());
