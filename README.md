# jsonconsole

A no-dependency console.{log,error,..} replacement that outputs JSON bunyan compatible output to stderr & stdout

**No configuration**, use `process.env.LOG_LEVEL` to ensure log output level.

```javascript
require('jsonconsole')();

console.error('foo'); // will output JSON to STDERR (with err stack trace) 
console.log('foo'); // will output JSON to STDOUT 
// {"name":"myapp","hostname":"myhost","pid":64,"level":20,"msg":"foo","time":"2017-01-18T21:02:18.780+01:00","src":{"file":"test.js","line":10,"r":"/projects"},"levelName":"DEBUG","v":0}

```



That's it, now `console.log`, `console.info`, `console.debug`, and `console.warn` outputs json lines to `process.stdout`.

`console.error` will output to `process.stderr`.

```javascript
var  = require('jsonconsole').RawValue;

console.log(new RawValue({
    a: 'Raw', value: [1,2,4]
})); 
/*
    {"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":33000,"level":20,"msg":"{ a: 'Raw', value: [ 1, 2, 4 ] }","raw":{"a":"Raw","value":[1,2,4]},"time":"2017-01-19T19:00:48.144+01:00","src":{"file":"example.js","line":27,"r":"/Users/evaisse/Sites/projects/node-jsonconsole"},"levelName":"DEBUG","v":0}
 */ 

// restoreConsole(); to restore original console API.
```

## env configuration

you can use environment conf to 

```
# to forbid JSONCONSOLE to override default console
JSONCONSOLE_DISABLE

# to allow logging but with raw output
JSONCONSOLE_DISABLE_JSON_OUTPUT 

# to disable output logging < LOG_LEVEL
# by default NODE_ENV=production will set this to LOG_LEVEL=info
LOG_LEVEL=info,debug,error
```


## Out-Of-The-Box Features

 - Every line is decorated with a trace to your original `console.*` call
 - No Dependencies
 - Providing root app dirname will reduce size of the path & auto bind you package.json name to logger

## Example

```javascript
let restoreConsole = require('./jsonconsole')();
let err = new Error();
let i = {};

i.i = i; // circular references are not JSON.stringify friendly

console.log('foo', 'bar', i);
console.debug('klkjljkl');
console.info('klkjljkl');
console.warn('klkjljkl');
console.error('klkjljkl');
console.info(new Error());
```

outputs 

```
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":20,"msg":"foo","time":"2017-01-18T21:02:18.780+01:00","src":{"file":"test.js","line":10,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"DEBUG","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":20,"msg":"bar","time":"2017-01-18T21:02:18.784+01:00","src":{"file":"test.js","line":10,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"DEBUG","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":20,"msg":"{ i: [Circular] }","time":"2017-01-18T21:02:18.787+01:00","src":{"file":"test.js","line":10,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"DEBUG","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":20,"msg":"klkjljkl","time":"2017-01-18T21:02:18.787+01:00","src":{"file":"test.js","line":11,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"DEBUG","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":30,"msg":"klkjljkl","time":"2017-01-18T21:02:18.787+01:00","src":{"file":"test.js","line":12,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"INFO","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":40,"msg":"klkjljkl","time":"2017-01-18T21:02:18.788+01:00","src":{"file":"test.js","line":13,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"Error\n    at write ({root}/jsonconsole.js:97:54)\n    at Array.slice.call.forEach ({root}/jsonconsole.js:147:17)\n    at Array.forEach (native)\n    at Console.console.(anonymous function) [as warn] ({root}/jsonconsole.js:146:51)\n    at Object.<anonymous> ({root}/test.js:13:9)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)","levelName":"WARN","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":50,"msg":"klkjljkl","time":"2017-01-18T21:02:18.788+01:00","src":{"file":"test.js","line":14,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"Error\n    at write ({root}/jsonconsole.js:97:54)\n    at Array.slice.call.forEach ({root}/jsonconsole.js:147:17)\n    at Array.forEach (native)\n    at Console.console.(anonymous function) [as error] ({root}/jsonconsole.js:146:51)\n    at Object.<anonymous> ({root}/test.js:14:9)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)","levelName":"ERROR","v":0}
{"name":"jsonconsole","hostname":"Mac-mini-de-Emmanuel.local","pid":6471,"level":30,"msg":"Error\n    at Object.<anonymous> (/Users/evaisse/Sites/projects/jsonconsole/test.js:15:14)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.runMain (module.js:604:10)\n    at run (bootstrap_node.js:394:7)\n    at startup (bootstrap_node.js:149:9)\n    at bootstrap_node.js:509:3","time":"2017-01-18T21:02:18.788+01:00","src":{"file":"test.js","line":15,"r":"/Users/evaisse/Sites/projects/jsonconsole"},"stack":"","levelName":"INFO","v":0}
```

And while using `node test.js 2>&1 | bunyan` you get the nice colored filter enabled bunyan output. Just install `npm install -g bunyan`

![Bunyan output]
(https://raw.githubusercontent.com/evaisse/jsonconsole/master/screenshot.png)
