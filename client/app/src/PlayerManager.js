var CameraManager = require('./CameraManager');
var Player = require('./Player');

module.exports = (function() {
  var players = {};

  function setPlayers(p) {
    //players = p;

    for (var i=0; i< p.length; i++) {
      players[p[i].id] = players[p[i].id] || new Player(p[i].id);
      players[p[i].id].setProps(p[i]);
    }
  }

  function update(dt) {
    for (var key in players) {
      players[key].update(dt);
    }
  }

  function getPlayers() {
    return players;
  }

  function render(context) {

    for (var key in players) {
      players[key].render(context, CameraManager);
    }
  }

  return {
    render: render,
    update: update,
    setPlayers: setPlayers,
    getPlayers: getPlayers
  };
}());
