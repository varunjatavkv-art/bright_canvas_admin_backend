const assert = require('assert');
const { sayHello } = require('./index');

// Happy path
assert.strictEqual(sayHello(), 'Hello, world!');
assert.strictEqual(sayHello('Varun'), 'Hello, Varun!');

// Edge cases
assert.strictEqual(sayHello(''), 'Hello, !');

console.log('All tests passed.');
