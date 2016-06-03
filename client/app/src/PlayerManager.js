var CameraManager = require('./CameraManager');

module.exports = (function() {
  var players = [];

  var playerImg = new Image();
  playerImg.src = "assets/images/player.gif";

  function setPlayers(p) {
    players = p
  }

  function render(context) {
    players.map(function(player) {
      var scaleX = player.isFacingLeft ? -1 : 1;
      var scale = 3.1;
      context.save();
      context.translate(player.x + CameraManager.getCX(), player.y + CameraManager.getCY());
      context.scale(scaleX / scale, 1 / scale);
      var img = playerImg;
      context.drawImage(img, -150, -64);
      context.restore();
    });
  }

  return {
    render: render,
    setPlayers: setPlayers
  }
}());
