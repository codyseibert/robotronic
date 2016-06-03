var _ = require('lodash');

var DEFAULT_BULLET_SPEED = 15;

module.exports = (function() {
  var bullets = [];

  function add(bullet) {
    bullets.push(bullet);
  }

  function remove(bullet) {
    bullets.splice(bullets.indexOf(bullet), 1);
  }

  function getAll() {
    return bullets;
  }

  function update() {
    bullets.map(function(bullet) {
      bullet.x += Math.cos(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);
      bullet.y += Math.sin(bullet.angle) * (bullet.player.bulletSpeed || DEFAULT_BULLET_SPEED);
      // TODO: check if bullet hits anyone and damage them using the bulletDamage on the player
    });
  }

  return {
    add: add,
    remove: remove,
    getAll: getAll,
    update: update
  }
}());
