var _ = require('lodash');
var CollisionUtil = require('./CollisionUtil');
var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');

var DEFAULT_BULLET_SPEED = 7;

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
    bullets.map(function(bullet) {
      bullet.timeToLive -= delta;

      if (bullet.timeToLive <= 0) {
        bullet.remove = true;
      }

      bullet.x += Math.cos(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);
      bullet.y += Math.sin(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);

      // TODO: check if bullet hits anyone and damage them using the bulletDamage on the player
      var players = PlayerManager.getAll();
      for (var i = players.length - 1; i >= 0; i--) {
        var player = players[i];
        if (player === bullet.player) {
          continue;
        }
        if (player.health > 0 && CollisionUtil.isColliding(bullet, player)) {
          player.health -= bullet.player.bulletDamage;
          bullet.remove = true;
        }
      }

      var nearByBlocks = MapManager.getBlocksNear(bullet, 256);
      for (var i = 0; i < nearByBlocks.length; i++) {
        var block = nearByBlocks[i];
        if (CollisionUtil.isColliding(bullet, block)) {
          bullet.remove = true;
        }
      }
    });

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
