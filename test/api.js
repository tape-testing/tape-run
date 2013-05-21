var test = require('tape');
var run = require('..');
var fs = require('fs');
var browserify = require('browserify');

var passing = ['one'];
var failing = ['fail'];
var fixtures = passing.concat(failing);

/**
 * Run all the fixtures.
 */

fixtures.forEach(function (name) {
  test('api: ' + name, function (t) {
    t.plan(1);

    var out = '';

    browserify(__dirname + '/fixtures/' + name + '.js')
      .bundle()
      .pipe(run())
      .on('results', function (results) {
        t.equal(results.ok, passing.indexOf(name) > -1)
      })
      .on('data', function (d) { out += d; })
      .on('end', function () {
        t.equal(out, read(__dirname + '/fixtures/' + name + '.txt'));
      });
  })
});

function read (path) {
  return fs.readFileSync(path, 'utf8').toString();
}
