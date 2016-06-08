var js2dmath = require('js-2dmath');
var Vec2 = js2dmath.Vec2;
var Polygon = js2dmath.Polygon;
var Intersection = js2dmath.Intersection;

module.exports = (function() {

  function isColliding(obj1, obj2) {
    return !(obj1.x + obj1.width < obj2.x ||
      obj2.x + obj2.width < obj1.x ||
      obj1.y + obj1.height < obj2.y ||
      obj2.y + obj2.height < obj1.y);
  }

  return {
    isColliding: isColliding
  }
}());
