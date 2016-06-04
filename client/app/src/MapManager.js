var CameraManager = require('./CameraManager');

module.exports = (function() {
  var map = [];

  var crateImg = new Image();
  crateImg.src = "assets/images/crate.jpg";

  function setMap(m) {
    map = m;
  }

  function render(context) {
    var target = CameraManager.getTarget();
    map.forEach(function(crate) {
      if (!target) {
        return;
      }
      var dx = crate.x - target.x;
      var dy = crate.y - target.y;
      var distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < 1000) {
        context.save();
        context.translate(crate.x + CameraManager.getCX(), crate.y + CameraManager.getCY());
        context.drawImage(crateImg, 0, 0);
        context.restore();
      }
    });
  }

  return {
    render: render,
    setMap: setMap
  };
}());
