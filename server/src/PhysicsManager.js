var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var js2dmath = require('js-2dmath');
var Vec2 = js2dmath.Vec2;
var Polygon = js2dmath.Polygon;
var Intersection = js2dmath.Intersection;

var GRAVITY = 0.5;
var FRICTION = 0.80;

module.exports = (function() {

  MapManager.generateMap();

  function isPlayerColliding(player, objects) {
    for (var i = 0; i < objects.length; i++) {
      obj = objects[i];

      var boxPoly = Polygon.create(
        Vec2.create(obj.x, obj.y),
        Vec2.create(obj.x + obj.width, obj.y),
        Vec2.create(obj.x + obj.width, obj.y + obj.height),
        Vec2.create(obj.x, obj.y + obj.height)
      )
      var playerPoly = Polygon.create(
        Vec2.create(player.x - player.width / 2, player.y),
        Vec2.create(player.x + player.width / 2, player.y),
        Vec2.create(player.x + player.width / 2, player.y + player.height),
        Vec2.create(player.x - player.width / 2, player.y + player.height)
      )
      var intersection = Intersection.polygon_polygon(boxPoly, playerPoly);
      if (intersection.reason === 8) {
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
    });
  }

  return {
    update: update
  };
}());
