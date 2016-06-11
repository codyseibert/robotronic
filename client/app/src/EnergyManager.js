var CameraManager = require('./CameraManager');

module.exports = (function() {
  var energies = [];

  var energyImg = new Image();
  energyImg.src = "assets/images/energy2.png";

  var energyFixed = new Image();
  energyFixed.src = "assets/images/energy3.png";

  var energyReady = new Image();
  energyReady.src = "assets/images/energy.png";

  function setEnergies(b) {
    energies = b;
  }

  function render(context) {
    var target = CameraManager.getTarget();
    energies.map(function(energy) {
      if (!target) {
        return;
      }
      var dx = energy.x - target.x;
      var dy = energy.y - target.y;
      var distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < 1000) {
        var scale = 1;
        context.save();
        context.translate(energy.x + CameraManager.getCX(), energy.y + CameraManager.getCY());
        context.scale(scale, scale);
        var image = energyImg;
        if (energy.fixed) {
          image = energyFixed;
        }
        if (energy.ready) {
          image = energyReady;
        }
        context.drawImage(image, 0, 0);
        context.restore();

        if (window.DEBUG) {
          context.save();
          context.translate(energy.x + CameraManager.getCX(), energy.y + CameraManager.getCY());
          context.beginPath();
          context.rect(0, 0, 10, 10);
          context.stroke();
          context.closePath();
          context.restore();
        }
      }
    });
  }

  return {
    render: render,
    setEnergies: setEnergies
  };
}());
