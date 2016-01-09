var test = require('tape');
var run = require('..');
var browserify = require('browserify');

test('api: one', function (t) {
  t.plan(1);

  browserify(__dirname + '/fixtures/one.js')
    .bundle()
    .pipe(run())
    .on('results', function (results) {
      t.equal(results.ok, true);
    })
});

test('api: fail', function (t) {
  t.plan(1);

  browserify(__dirname + '/fixtures/fail.js')
    .bundle()
    .pipe(run())
    .on('results', function (results) {
      t.equal(results.ok, false);
    });
});

test('api: error', function (t) {
  t.plan(1);

  browserify(__dirname + '/fixtures/error.js')
    .bundle()
    .pipe(run())
    .on('results', function (results) {
      t.equal(results.ok, false);
    });
});

