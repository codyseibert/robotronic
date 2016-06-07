var _ = require('lodash');
var MapManager = require('./MapManager');

var RESPAWN_TIME = 5000;

module.exports = (function() {
  var computers = []

  function add(computer) {
    computer.untilNextState = 1000;
    computer.state = 0;
    computers.push(computer);
  }

  function remove(computer) {
    computers.splice(computers.indexOf(computer), 1);
  }

  function getAll() {
    return computers;
  }

  function update(delta) {

    for (var i = 0, len = computers.length; i < len; i++) {
      var computer = computers[i];

      computer.untilNextState -= delta;

      if (computer.untilNextState <= 0){
        computer.untilNextState = parseInt(Math.random() * 5000) + 1000;
        computer.state = (computer.state + 1) % 2;
      }

      if (computer.state === 0 ){
        computer.input.right = false;
        computer.input.left = true;
        computer.input.angle = -Math.PI;
      } else {
        computer.input.left = false;
        computer.input.right = true;
        computer.input.angle = 0;
      }

      computer.input.fire = true;

      if (computer.collisionX > 0) {
        if (Math.random() > 0.2) {
          computer.state = 0;
        }
      } else if (computer.collisionX < 0) {
        if (Math.random() > 0.2) {
          computer.state = 1;
        }
      }

      computer.input.jump = false;
      if (Math.random() < 0.1) {
        computer.input.jump = true;
      }

      // get all of the open world tiles

      // find the closest one to the AI

      // if there are computers nearby

        // if so, pick a target & fire at them

        // jump randomly when bullets are nearby

        // move in opposite direction is bullet is nearby

      // if there are coins close enough above

        // jump towards the coin

      // else

        // pick a random location on the map if we don't have a target

        // path find towards that location

    };
  }

  return {
    add: add,
    remove: remove,
    getAll: getAll,
    update: update
  }
}());
