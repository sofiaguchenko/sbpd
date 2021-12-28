const bigInt = require('./bigInt');
const bignum = require('../bignum/bignum');

const genPrimeNumberByRange = (a, d) => {
    let c = bignum(d), b, e;
    for (e = b = bignum(bignum().random(a, c)); !bigInt(b.result).isPrime();) {
        if (b.equal(c)) {
            b = bignum(a);
            for (c = bignum(e); !bigInt(b.result).isPrime();) {
                if (b.equal(c)) return 0;
                b.add(1);
            }
            break
        }
        b.add(1);
    }
    return b.result;
}

module.exports = genPrimeNumberByRange;
