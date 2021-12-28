const bignum = require('../bignum/bignum');
const ferma = require('../ferma/ferma');

const genPrimeNumberByRange = (a, d) => {
    let c = bignum(d), b, e;
    for (e = b = bignum(bignum().random(a, c)); !ferma(b).isPrime;) {
        if (b.equal(c)) {
            b = bignum(a);
            for (c = bignum(e); !ferma(b).isPrime;) {
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
