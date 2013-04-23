var _ = require('underscore');
var path = require('path');
var exec = require('child_process').exec;

function getOptionArgs(options) {
  var keys = _.keys(options).sort();
  return _.map(keys, function (key) {
    var value = options[key];
    if (value) {
      var arg = '--' + key;
      if (_.isString(value)) {
        arg += ' ' + value;
      }
      return arg;
    }
  });
}

function runTsc(options, files, cb) {
  var optionArgs = getOptionArgs(options);
  var args = optionArgs.concat(files);
  var tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');
  var command = tsc + ' ' + args.join(' ');
  exec(command, function (err, stdout, stderr) {
    if (err) {
      cb(err);
    } else { 
      cb();
    }
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