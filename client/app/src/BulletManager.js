var CameraManager = require('./CameraManager');

module.exports = (function() {
  var bullets = [];

  var bulletImg = new Image();
  bulletImg.src = "assets/images/bullet.png";

  function setBullets(b) {
    bullets = b;
  }

  function render(context) {
    bullets.map(function(bullet) {
      var scale = 0.15;
      context.save();
      context.translate(bullet.x + CameraManager.getCX(), bullet.y + CameraManager.getCY());
      context.scale(scale, scale);
      context.drawImage(bulletImg, 0, 0);
      context.restore();
    });
  }

  return {
    render: render,
    setBullets: setBullets
  }
}());