const bignum = function (num1 = 0) {
    let value = typeof num1 === 'object' ? BigInt(num1.result) : BigInt(num1);
    return {
        get result() {
            return value.toString();
        },

        add(num2) {
            value += typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2);
            return this;
        },

        div(num2) {
            value /= typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2);
            return this;
        },

        mul(num2) {
            value *= typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2);
            return this;
        },

        sub(num2) {
            value -= typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2);
            return this;
        },

        pow(num2) {
            value = value ** (typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2));
            return this;
        },

        rem(num2) {
            value = value % (typeof num2 === 'object' ? BigInt(num2.result) : BigInt(num2));
            return this;
        },

        sqrt(coof = 1) {
            if (value < 0n) return;
            if (value < 2n) return this;

            function newtonIteration(n, x0) {
                const x1 = ((n / x0) + x0) >> 1n;
                if (x0 === x1 || x0 === (x1 - 1n)) return x0;
                return newtonIteration(n, x1);
            }

            value = newtonIteration(value * BigInt(10 ** coof), 1n);
            return this;
        },

        ceilSqrt() {
            this.sqrt(2);
            const remainder = value.toString().slice(-1);
            this.div('10');
            if (Number(remainder) !== 0) this.add('1');
            return this;
        },

        equal(num2) {
            const lastNum = typeof num2 === 'object' ? num2.result : num2.toString();
            return value.toString() === lastNum;
        },

        random(start, end) {
            const startBig = typeof start === 'object' ? BigInt(start.result) : BigInt(start.toString());
            const endBig = typeof end === 'object' ? BigInt(end.result) : BigInt(end.toString());
            if (startBig > endBig) return '0';
            const randBigNumber = BigInt(Math.floor(Math.random() * 10000));
            const resultBig = (randBigNumber * (endBig - startBig) + startBig) / BigInt(10000);
            return resultBig.toString();
        },

        minForDischarge(num) {
            return '1' + new Array(num - 1).fill('0').join('');
        },

        maxForDischarge(num) {
            return new Array(num).fill('9').join('');
        }
    }
}

module.exports = bignum;
