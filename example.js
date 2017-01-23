const RawValue = require('./jsonconsole').RawValue;
let rb = require('./jsonconsole')();
let err = new Error();
let i = {};

i.i = i; // circular references are not JSON.stringify friendly



console.log('foo', 'bar', i);
console.debug('klkjljkl');
console.info('klkjljkl');
console.warn('klkjljkl');
console.error('klkjljkl');
console.info(new Error());


var util = require('util');



function foo() {
    console.error('from foo');
}

foo();


let rawValue = new RawValue({
    a: 'Raw', value: [1,2,4]
});

console.log(rawValue);