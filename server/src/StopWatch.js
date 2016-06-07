module.exports = (function() {
  var starts = {};
  var sums = {};
  var counts = {};

  function start(msg) {
    starts[msg] = process.hrtime();
    if (!sums[msg]) {
      sums[msg] = 0;
    }
    if (!sums[msg]) {
      counts[msg] = 0;
    }
  }

  function stop(msg) {
    var hrend = process.hrtime(starts[msg]);
    counts[msg] = counts[msg] + 1;
    sums[msg] = sums[msg] + hrend[1]
    var sum = sums[msg];
    var count = counts[msg];

    if (count > 500) {
      counts[msg] = 0;
      sums[msg] = 0;
      console.info(msg, '- average: ' + (sum / count));
    }
  }

  return {
    start: start,
    stop: stop
  }
}());
