var _ = require('lodash');
var CollisionUtil = require('./CollisionUtil');
var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');
var EnergyManager = require('./EnergyManager');

var DEFAULT_BULLET_SPEED = 50;

module.exports = (function() {
  var bullets = [];

  function add(bullet) {
    bullets.push(bullet);
  }

  function remove(bullet) {
    bullets.splice(bullets.indexOf(bullet), 1);
  }

  function getAll() {
    return bullets;
  }

  var DELTA_SCALE = 100.0

  function update(delta) {

    for (var i = 0, len = bullets.length; i < len; i++) {
      var bullet = bullets[i];

      bullet.timeToLive -= delta;

      if (bullet.timeToLive <= 0) {
        bullet.remove = true;
      }

      bullet.x += Math.cos(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED) * delta / DELTA_SCALE;
      bullet.y += Math.sin(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED) * delta / DELTA_SCALE;
      var lastY = bullet.y;

      var scale = 0.15625 + (bullet.charge / 100.0 * .3125);

      // TODO: check if bullet hits anyone and damage them using the bulletDamage on the player
      bullet.width = bullet.WIDTH * scale;
      bullet.height = bullet.HEIGHT * scale;
      var players = PlayerManager.getAll();
      for (var j = players.length - 1; j >= 0; j--) {
        var player = players[j];
        if (player === bullet.player) {
          continue;
        }
        if (player.energy > 0 && CollisionUtil.isColliding(bullet, player)) {
          var damage = bullet.player.bulletDamage + parseInt(bullet.charge / 20.0);
          player.energy -= damage;
          bullet.remove = true;
          for (var x = 0; x < damage; x++) {
            EnergyManager.emitEnergy(player.x + 24, player.y + 24);
          }
        }
      }

      bullet.width = 1;
      bullet.height = 1;
      bullet.y += bullet.charge * 0.25;
      var nearByBlocks = MapManager.getBlocksNear(bullet, 128);
      for (var j = 0, blen = nearByBlocks.length; j < blen; j++) {
        var block = nearByBlocks[j];
        if (CollisionUtil.isColliding(bullet, block)) {
          bullet.remove = true;
        }
      }
      bullet.y = lastY;
      bullet.width = bullet.WIDTH * scale;
      bullet.height = bullet.HEIGHT * scale;

    };

    for (var i = bullets.length - 1; i >= 0; i--) {
      var bullet = bullets[i];
      if (bullet.remove) {
        bullets.splice(i, 1);
      }
    }
  }

  return {
    add: add,
    remove: remove,
    getAll: getAll,
    update: update
  }
}());
