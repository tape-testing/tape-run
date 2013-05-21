var run = require('..');
var browserify = require('browserify');

browserify(__dirname + '/../test/fixtures/one.js')
  .bundle()
  .pipe(run())
  .on('results', console.log)
  .pipe(process.stdout);
