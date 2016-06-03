module.exports = (function() {
  function Box(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  var map = [
    new Box(0, 300, 64, 64),
    new Box(64, 300, 64, 64),
    new Box(128, 300, 64, 64),
    new Box(300, 300, 64, 64),
    new Box(364, 300, 64, 64)
  ]

  for (var i = 0; i < 100; i++) {
    map.push(new Box(i*64 - 500, 500, 64, 64))
  }

  function getCurrentMap() {
    return map;
  }

  return {
    getCurrentMap: getCurrentMap
  }
}());
