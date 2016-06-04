var _ = require('lodash');
var js2dmath = require('js-2dmath');
var Vec2 = js2dmath.Vec2;
var Polygon = js2dmath.Polygon;
var Intersection = js2dmath.Intersection;

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

  function isColliding(bullet, obj) {
    var bulletPoly = Polygon.create(
      Vec2.create(bullet.x, bullet.y),
      Vec2.create(bullet.x + bullet.width, bullet.y),
      Vec2.create(bullet.x + bullet.width, bullet.y + bullet.height),
      Vec2.create(bullet.x, bullet.y + bullet.height)
    )
    var obj = Polygon.create(
      Vec2.create(obj.x, obj.y),
      Vec2.create(obj.x + obj.width, obj.y),
      Vec2.create(obj.x + obj.width, obj.y + obj.height),
      Vec2.create(obj.x, obj.y + obj.height)
    )
    var intersection = Intersection.polygon_polygon(bulletPoly, obj);
    if (intersection.reason === 8) {
      return true;
    }
    return false;
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
        if (player.health > 0 && isColliding(bullet, player)) {
          player.health -= bullet.player.bulletDamage;
          bullet.remove = true;
        }
      }

      var nearByBlocks = MapManager.getBlocksNear(bullet, 128);
      for (var i = 0; i < nearByBlocks.length; i++) {
        var block = nearByBlocks[i];
        if (isColliding(bullet, block)) {
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
