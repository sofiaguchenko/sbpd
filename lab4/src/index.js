const robin = require('./generator/robin');
const bignum = require('./bignum/bignum');

const min32 = bignum().minForDischarge(32);
const max32 = bignum().maxForDischarge(32);

const primeNum1 = robin(min32, max32);
const primeNum2 = robin(min32, max32);

console.log('First prime number with discharge 32: ' + primeNum1);
console.log('Second prime number with discharge 32: ' + primeNum2);
