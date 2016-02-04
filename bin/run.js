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

  .describe('browser', '[Object|String]. Object with browser.name and browser.options fields. Or string to pass browser.name only.' +
      '\n\tAlways available: electron. ' +
      '\n\tOptions available: electron only. ' +
      '\n\tAvailable if installed: chrome, firefox, ie, phantom, safari' +
      '\n\tUsage: '+
      '\n\t\t--browser=chrome - set browser name with no options passed.' +
      '\n\t\t--browser.name=electron --browser.options.width=800 --browser.options.height=500 --browser.options.webPreferences.webSecurity=false - set browser and specify browser options.\n')
  .alias('b', 'browser')
  .default('browser.name', 'electron')

  .describe('render', 'Command to pipe tap output to for custom rendering')
  .alias('r', 'render')

  .describe('help', 'Print usage instructions')
  .alias('h', 'help')

  .argv;

if (argv.help) {
  return optimist.showHelp();
}

if (typeof argv.browser == 'string') {
  argv.browser = argv.b = {
    name: argv.browser,
    options: {}
  };
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
