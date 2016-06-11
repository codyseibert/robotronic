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
      var scale = 0.15625 + (bullet.charge / 100.0 * .3125);
      context.save();
      context.translate(bullet.x + CameraManager.getCX(), bullet.y + CameraManager.getCY());
      context.scale(scale, scale);
      context.drawImage(bulletImg, 0, 0);
      context.restore();

      if (window.DEBUG) {
        context.save();
        context.translate(bullet.x + CameraManager.getCX(), bullet.y + CameraManager.getCY());
        context.beginPath();
        context.scale(scale, scale);
        context.rect(0, 0, 128, 128);
        context.stroke();
        context.closePath();
        context.restore();
      }
    });
  }

  return {
    render: render,
    setBullets: setBullets
  };
}());
