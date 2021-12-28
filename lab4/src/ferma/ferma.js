const bignum = require('../bignum/bignum');

const ferma = (value) => {
    if (bignum(value).rem(2).equal(0)) return {
        num1: '2',
        num2: bignum(value).div(2).result,
        isPrime: false,
    };
    let b, a = bignum(value).ceilSqrt();
    if (bignum(a).pow(2).equal(value)) return {
            num1: a.result,
            num2: a.result,
            isPrime: false,
        }
    while (true) {
        const tmp = bignum(a).pow(2).sub(value);
        b = bignum(tmp).ceilSqrt();
        if (bignum(b).pow(2).equal(tmp)) return {
            num1: bignum(a).sub(b).result,
            num2: bignum(a).add(b).result,
            isPrime: bignum(a).sub(b).result === '1',
        };
        a.add(1);
    }
}

module.exports = ferma;
