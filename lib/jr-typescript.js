var _ = require('underscore');
var path = require('path');
var fork = require('child_process').fork;

function getOptionArgs(options) {
  var args = [];
  var keys = _.keys(options).sort();
  _.each(keys, function (key) {
    var value = options[key];
    if (value) {
      args.push('--' + key);
      if (_.isString(value)) {
        args.push(value);
      }
    }
  });
  return args;
}

function runTsc(options, files, cb) {
  var optionArgs = getOptionArgs(options);
  var args = optionArgs.concat(files);
  var tscjs = path.join(__dirname, '..', 'node_modules', 'typescript', 'bin', 'tsc.js');
  var child = fork(tscjs, args, {
    cwd: process.cwd(),
    stdio: 'pipe'
  });
  child.on('close', function () {
    cb();
  });
}

module.exports = function (opts, cb) {
  var options = opts.options || {};
  var files = opts.files || [];
  if (files.length > 0) {
    runTsc(options, files, cb);
  } else {
    cb();
  }
};