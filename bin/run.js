#!/usr/bin/env node

var run = require('..');
var optimist = require('optimist');
var spawn = require('child_process').spawn;

var argv = optimist
  .usage('Pipe a browserify stream into this.\nbrowserify [opts] [files] | $0 [opts]')

  .describe('wait', 'Timeout for tap-finished')
  .alias('w', 'wait')

  .describe('port', 'Wait to be opened by a browser on that port')
  .alias('p', 'port')

  .describe('static', 'Serve static files from this directory')
  .alias('s', 'static')

  .describe('browser', 'Browser to use. ' +
      'Always available: electron. ' +
      'Available if installed: chrome, firefox, ie, phantom, safari')
  .alias('b', 'browser')
  .default('browser', 'electron')

  .describe('render', 'Command to pipe tap output to for custom rendering')
  .alias('r', 'render')

  .describe('keep-open', 'Leave the browser open for debugging after running tests')
  .alias('k', 'keep-open')
  .alias('keepOpen', 'keep-open')

  .describe('node', 'Enable nodejs integration for electron')
  .alias('n', 'integration')
  .alias('node-integration', 'node')
  .alias('nodeIntegration', 'node')

  .describe('basedir', 'Set this if you need to require node modules in node mode')

  .describe('help', 'Print usage instructions')
  .alias('h', 'help')

  .argv;

if (argv.help) {
  return optimist.showHelp();
}

var runner = run(argv);

process.stdin
  .pipe(runner)
  .on('results', function (results) {
    process.exit(Number(!results.ok));
  });

if (argv.render) {
  var ps = spawn(argv.render);
  runner.pipe(ps.stdin);
  ps.stdout.pipe(process.stdout, { end: false });
  ps.stderr.pipe(process.stderr, { end: false });
} else {
  runner.pipe(process.stdout);
}
