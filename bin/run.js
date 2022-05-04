#!/usr/bin/env node

var run = require('..');
var yargs = require('yargs/yargs');
var { hideBin } = require('yargs/helpers');
var spawn = require('child_process').spawn;

var argv = yargs(hideBin(process.argv))
  .usage('Pipe a browserify stream into this.\nbrowserify [opts] [files] | $0 [opts]')

  .option('wait', {
    alias: 'w',
    type: 'number',
    description: 'Timeout for tap-finished'
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Wait to be opened by a browser on that port'
  })
  .option('static', {
    alias: 's',
    type: 'string',
    description: 'Serve static files from this directory'
  })
  .option('browser', {
    alias: 'b',
    type: 'string',
    default: 'electron',
    description: 'Browser to use. ' +
    'Always available: electron. ' +
    'Available if installed: chrome, firefox, ie, phantom, safari'
  })
  .option('render', {
    alias: 'r',
    type: 'string',
    description: 'Command to pipe tap output to for custom rendering'
  })
  .option('keep-open', {
    alias: ['k', 'keepOpen'],
    type: 'boolean',
    description: 'Leave the browser open for debugging after running tests'
  })
  .option('node', {
    alias: ['n', 'node-integration', 'nodeIntegration'],
    type: 'boolean',
    description: 'Enable nodejs integration for electron'
  })
  .option('sandbox', {
    type: 'boolean',
    default: true,
    description: 'Enable electron sandbox'
  })
  .option('basedir', {
    description: 'Set this if you need to require node modules in node mode'
  })
  .parse();

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
