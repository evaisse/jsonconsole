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