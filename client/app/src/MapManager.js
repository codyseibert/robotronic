var CameraManager = require('./CameraManager');

module.exports = (function() {
  var map = [];

  var crateImg = new Image();
  crateImg.src = "assets/images/crate.jpg";

  function setMap(m) {
    map = m;
  }

  function render(context) {
    map.forEach(function(crate) {
      context.save();
      context.translate(crate.x + CameraManager.getCX(), crate.y + CameraManager.getCY());
      context.drawImage(crateImg, 0, 0);
      context.restore();
    });
  }

  return {
    render: render,
    setMap: setMap
  };
}());
