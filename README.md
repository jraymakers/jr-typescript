# JR-TYPESCRIPT

A [jr](https://npmjs.org/package/jr) job for [typescript](http://www.typescriptlang.org/).

### Example

```javascript
var jrTypeScript = require('jr-typescript');

jrTypeScript({
  files: [ 'main.ts' ],
  options: {
    out: 'program.js'
  }
}, function (err) {
  if (err) {
    console.log(err);
  }
});
```

Given main.ts:
```
/// <reference path="greeter.ts" />

var greeter = new Greeter("world");
greeter.greet();
```

and greeter.ts:
```
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

this writes program.js:
```
var Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();
var greeter = new Greeter("world");
greeter.greet();
```

### Details

Jr-typescript is a function that compiles [TypeScript](http://www.typescriptlang.org/) files into JavaScript files.  Although designed to be used with [jr](https://npmjs.org/package/jr), it does not depend on jr and can be used by itself.

Jr-typescript is a thin wrapper around the command-line TypeScript compiler 'tsc'.  The 'files' array indicates the set of TypeScript files to compile.  The 'options' object controls other aspects of the compilation, such as the output file; see 'tsc --help' for details.  The options are specified using their long form without the leading hyphens, so "--out" becomes "out".