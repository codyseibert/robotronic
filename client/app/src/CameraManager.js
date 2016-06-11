module.exports = (function() {
  var cx, cy;
  cx = cy = 0;

  var target = null;

  var crateImg = new Image();
  crateImg.src = "assets/images/crate.jpg";

  function getCX() {
    return cx;
  }

  function getCY() {
    return cy;
  }

  function setTarget(t) {
    target = t;
  }

  function getTarget() {
    return target;
  }

  function update() {
    if (target) {
      cx = parseInt(window.innerWidth / 2 - target.x - target.width / 2, 10);
      cy = parseInt(window.innerHeight / 2 - target.y - target.height / 2, 10);
    }
  }

  return {
    update: update,
    getCX: getCX,
    getCY: getCY,
    setTarget: setTarget,
    getTarget: getTarget
  };
}());
