var browserRun = require('browser-run')
var finished = require('tap-finished');
var through = require('through');
var throughout = require('throughout');

module.exports = run;

function run (opts) {
  if (!opts) opts = {};

  var input = through();
  var browser = browserRun(opts);
  var dpl = throughout(input, browser);

  browser
    .pipe(finished(opts, function (results) {
      browser.stop();
      dpl.emit('results', results);
    }));

  return dpl;
}
