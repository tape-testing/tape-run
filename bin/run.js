#!/usr/bin/env node

var run = require('..');
var optimist = require('optimist');

var argv = optimist
  .usage('Pipe a browserify stream into this.\nbrowserify [opts] [files] | $0 [opts]')

  .describe('wait', 'Timeout for tap-finished')
  .alias('w', 'wait')

  .describe('port', 'Wait to be opened by a browser on that port')
  .alias('p', 'port')

  .describe('browser', 'Browser to use. Available if installed: ' +
      'chrome, firefox, ie, phantom, safari')
  .alias('b', 'browser')
  .default('browser', 'phantom')

  .describe('help', 'Print usage instructions')
  .alias('h', 'help')

  .argv;

if (argv.help) {
  return optimist.showHelp();
}

process.stdin
  .pipe(run(argv))
  .on('results', function (results) {
    process.exit(Number(!results.ok));
  })
  .pipe(process.stdout);
