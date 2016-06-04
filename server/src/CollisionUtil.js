var js2dmath = require('js-2dmath');
var Vec2 = js2dmath.Vec2;
var Polygon = js2dmath.Polygon;
var Intersection = js2dmath.Intersection;

module.exports = (function() {

  function isColliding(obj1, obj2) {
    var obj1Poly = Polygon.create(
      Vec2.create(obj1.x, obj1.y),
      Vec2.create(obj1.x + obj1.width, obj1.y),
      Vec2.create(obj1.x + obj1.width, obj1.y + obj1.height),
      Vec2.create(obj1.x, obj1.y + obj1.height)
    )
    var obj2Poly = Polygon.create(
      Vec2.create(obj2.x, obj2.y),
      Vec2.create(obj2.x + obj2.width, obj2.y),
      Vec2.create(obj2.x + obj2.width, obj2.y + obj2.height),
      Vec2.create(obj2.x, obj2.y + obj2.height)
    )
    var intersection = Intersection.polygon_polygon(obj1Poly, obj2Poly);
    if (intersection.reason === 8) {
      return true;
    }
    return false;
  }

  return {
    isColliding: isColliding
  }
}());
