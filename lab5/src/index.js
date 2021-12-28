const robin = require('./generator/robin');
const bignum = require('./bignum/bignum');
const IDEA = require('./idea/idea');
const fs = require('fs');

const min16 = bignum().minForDischarge(16);
const max16 = bignum().maxForDischarge(16);

const closedKey = robin(min16, max16);
const publicKey = robin(min16, max16);

const cipher = new IDEA(publicKey);

const input = fs.readFileSync(__dirname + '/input.txt');
const encrypted = cipher.encrypt(closedKey, input);

fs.writeFileSync(__dirname + '/close.txt', encrypted);
const closed = fs.readFileSync(__dirname + '/close.txt');

const decrypted = cipher.decrypt(closed);
fs.writeFileSync(__dirname + '/open.txt', decrypted);
