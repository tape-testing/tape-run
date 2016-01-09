var test = require('tape');
var spawn = require('child_process').spawn;
var browserify = require('browserify');

test('cli: one', function (t) {
  t.plan(1);

  var run = spawn('node', [ __dirname + '/../bin/run.js' ]);
  run.stderr.pipe(process.stderr, { end: false });

  run.on('exit', function (code) {
    t.equals(code, 0);
  });

  browserify(__dirname + '/fixtures/one.js')
    .bundle()
    .pipe(run.stdin);
});

test('cli: fail', function (t) {
  t.plan(1);

  var run = spawn('node', [ __dirname + '/../bin/run.js' ]);
  run.stderr.pipe(process.stderr, { end: false });

  run.on('exit', function (code) {
    t.equals(code, 1);
  });

  browserify(__dirname + '/fixtures/fail.js')
    .bundle()
    .pipe(run.stdin);
});

test('cli: error', function (t) {
  t.plan(1);

  var run = spawn('node', [ __dirname + '/../bin/run.js' ]);
  run.stderr.pipe(process.stderr, { end: false });

  run.on('exit', function (code) {
    t.equals(code, 1);
  });

  browserify(__dirname + '/fixtures/error.js')
    .bundle()
    .pipe(run.stdin);
});
