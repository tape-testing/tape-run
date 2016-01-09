var run = require('..');
var browserify = require('browserify');
var resolve = require('path').resolve;

var script = process.argv[2] || __dirname + '/../test/fixtures/one.js';
script = resolve(script);

browserify(script)
  .bundle()
  .pipe(run())
  .on('results', console.log)
  .pipe(process.stdout);
