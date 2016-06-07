var _ = require('lodash');
var CollisionUtil = require('./CollisionUtil');
var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');
var EnergyManager = require('./EnergyManager');

var DEFAULT_BULLET_SPEED = 5;

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

  function update(delta) {

    for (var i = 0, len = bullets.length; i < len; i++) {
      var bullet = bullets[i];

      bullet.timeToLive -= delta;

      if (bullet.timeToLive <= 0) {
        bullet.remove = true;
      }

      bullet.x += Math.cos(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);
      bullet.y += Math.sin(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);

      // TODO: check if bullet hits anyone and damage them using the bulletDamage on the player
      var players = PlayerManager.getAll();
      for (var j = players.length - 1; j >= 0; j--) {
        var player = players[j];
        if (player === bullet.player) {
          continue;
        }
        if (player.energy > 0 && CollisionUtil.isColliding(bullet, player)) {
          player.energy -= bullet.player.bulletDamage;
          bullet.remove = true;
          var rx = parseInt(Math.random() * 20) - 10;
          var ry = parseInt(Math.random() * 20) - 10;
          EnergyManager.emitEnergy(player.x + 24, player.y + 24);
        }
      }

      var nearByBlocks = MapManager.getBlocksNear(bullet, 256);
      for (var j = 0, blen = nearByBlocks.length; j < blen; j++) {
        var block = nearByBlocks[j];
        if (CollisionUtil.isColliding(bullet, block)) {
          bullet.remove = true;
        }
      }
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
