var test = require('tape');
var fs = require('fs');
var spawn = require('child_process').spawn;
var through = require('through');

var passing = ['one'];
var failing = ['fail'];
var fixtures = passing.concat(failing);

/**
 * Run all the fixtures.
 */

fixtures.forEach(function (name) {
  test('cli: ' + name, function (t) {
    t.plan(2);

    var browserify = spawn(__dirname + '/../node_modules/.bin/browserify', [
      __dirname + '/fixtures/' + name + '.js',
    ]);
    browserify.stderr.pipe(process.stderr, { end: false });

    var run = spawn('node', [ __dirname + '/../bin/run.js' ]);
    run.stderr.pipe(process.stderr, { end: false });

    run.on('exit', function (code) {
      t.equals(code, Number(passing.indexOf(name) == -1));
    });

    browserify.stdout.pipe(run.stdin);
    run.stdout.pipe(through(write, end));

    var out = '';

    function write (chunk) { out += chunk.toString() }
    function end () {
      t.equals(out, read(__dirname + '/fixtures/' + name + '.txt'));
    }
  })
});

function read (path) {
  return fs.readFileSync(path, 'utf8').toString();
}
