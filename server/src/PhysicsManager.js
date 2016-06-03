var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var js2dmath = require('js-2dmath');
var Vec2 = js2dmath.Vec2;
var Polygon = js2dmath.Polygon;
var Intersection = js2dmath.Intersection;

var GRAVITY = 0.5;
var FRICTION = 0.80;

module.exports = (function() {

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
        Vec2.create(player.x, player.y),
        Vec2.create(player.x + player.width, player.y),
        Vec2.create(player.x + player.width, player.y + player.height),
        Vec2.create(player.x, player.y + player.height)
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
      if (isPlayerColliding(player, map)) {
        player.x -= player.vx;
      }

      player.y += player.vy;
      if (isPlayerColliding(player, map)) {
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
