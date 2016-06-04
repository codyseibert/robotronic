var CameraManager = require('./CameraManager');

module.exports = (function() {
  var players = [];

  var playerImg = new Image();
  playerImg.src = "assets/images/player.gif";

  function setPlayers(p) {
    players = p;
  }

  function getPlayers() {
    return players;
  }

  function render(context) {
    players.map(function(player) {
      if (player.health <= 0) {
        return;
      }
      
      var scaleX = player.isFacingLeft ? -1 : 1;
      var offsetX = player.isFacingLeft ? -48 : 0;
      var scale = 1;
      context.save();
      context.translate(player.x + CameraManager.getCX(), player.y + CameraManager.getCY());
      context.scale(scaleX / scale, 1 / scale);
      var img = playerImg;
      context.drawImage(img, offsetX, 0);
      context.restore();

      context.save();
      context.translate(player.x + CameraManager.getCX(), player.y + CameraManager.getCY());
      context.font = "20px Georgia";
      context.fillText(player.name, (player.name.length / 2) * -5, -10);
      context.restore();

      if (window.DEBUG) {
        context.save();
        context.translate(player.x + CameraManager.getCX(), player.y + CameraManager.getCY());
        context.beginPath()
        context.rect(0, 0, 48, 48);
        context.stroke();
        context.closePath()
        context.restore();
      }
    });
  }

  return {
    render: render,
    setPlayers: setPlayers,
    getPlayers: getPlayers
  };
}());
