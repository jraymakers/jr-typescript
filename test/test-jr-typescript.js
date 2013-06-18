var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jrTypeScript = require('../');
var path = require('path');

function outputFileError(contents) {
  return new Error('Unexpected output file contents: ' + contents.replace(/\r\n/g, '\\r\\n'));
}

describe('jr-typescript', function () {

  var testFilesDir = path.join('test', 'files');
  var inFileA  = path.join(testFilesDir, 'a.ts');
  var inFileB  = path.join(testFilesDir, 'b.ts');
  var outFileA = path.join(testFilesDir, 'a.js');
  var outFileB = path.join(testFilesDir, 'b.js');
  var outFile  = path.join(testFilesDir, 'out.js');
  var fileAContents = 'class A { }';
  var fileBContents = 'class B { }';
  var expectedFileAOutput = [
    'var A = (function () {',
    '    function A() {',
    '    }',
    '    return A;',
    '})();',
    ''].join('\r\n');
  var expectedFileBOutput = [
    'var B = (function () {',
    '    function B() {',
    '    }',
    '    return B;',
    '})();',
    ''].join('\r\n');

  afterEach(function (done) {
    fse.remove(testFilesDir, done);
  });

  it('should produce no output file for no input files', function (done) {
    async.waterfall([
      async.apply(jrTypeScript, { }),
      function (cb) {
        fs.exists(outFile, function (exists) {
          if (exists) {
            cb(new Error('Output file exists, but it should not.'));
          } else {
            cb();
          }
        });
      }
    ], done);
  });

  it('should produce the correct output file for a single input file', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, fileAContents),
      async.apply(jrTypeScript, { files: [ inFileA ] }),
      async.apply(fs.readFile, outFileA, 'utf-8'),
      function (data, cb) {
        if (data === expectedFileAOutput) {
          cb();
        } else {
          cb(outputFileError(data));
        }
      }
    ], done);
  });

  it('should produce the correct output file for a single input file when the "--out" options is used', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, fileAContents),
      async.apply(jrTypeScript, { files: [ inFileA ], options: { out: outFile } }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        if (data === expectedFileAOutput) {
          cb();
        } else {
          cb(outputFileError(data));
        }
      }
    ], done);
  });

  it('should produce the correct output files for multiple input files', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, fileAContents),
      async.apply(fse.outputFile, inFileB, fileBContents),
      async.apply(jrTypeScript, { files: [ inFileA, inFileB ] }),
      async.apply(fs.readFile, outFileA, 'utf-8'),
      function (data, cb) {
        if (data === expectedFileAOutput) {
          cb();
        } else {
          cb(outputFileError(data));
        }
      },
      async.apply(fs.readFile, outFileB, 'utf-8'),
      function (data, cb) {
        if (data === expectedFileBOutput) {
          cb();
        } else {
          cb(outputFileError(data));
        }
      }
    ], done);
  });

  it('should produce the correct (single) output file for multiple input files when the "--out" option is used', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, fileAContents),
      async.apply(fse.outputFile, inFileB, fileBContents),
      async.apply(jrTypeScript, { files: [ inFileA, inFileB ], options: { out: outFile } }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        if (data === expectedFileAOutput + expectedFileBOutput) {
          cb();
        } else {
          cb(outputFileError(data));
        }
      }
    ], done);
  });

});