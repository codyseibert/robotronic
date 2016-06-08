var Table = require('cli-table');

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
    sums[msg] = sums[msg] + hrend[1];
  }

  function print() {
    var table = new Table({
      head: ['Stop Watch Key', 'Average Time (ms)'],
      colWidths: [20, 20],
      colAligns: ['left', 'right']
    });

    var keys = Object.keys(starts);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      var sum = sums[key];
      var count = counts[key];
      counts[key] = 0;
      sums[key] = 0;
      table.push([key, (sum / count / 1000000.0).toFixed(5)]);
    }

    console.log(table.toString());
  }

  return {
    start: start,
    stop: stop,
    print: print
  }
}());
