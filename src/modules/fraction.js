export default class Fraction {
    constructor(numerator = 0, denominator = 1) {
        this.numerator = parseInt(numerator);
        this.denominator = parseInt(denominator);
        if (denominator < 0) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
    }

    // НОД двух чисел
    _gcd = (a, b) => {
        if (!b) return a;
        return this._gcd(b, a % b);
    };

    // разделить числитель и знаменатель на НОД
    _applyGCD = () => {
        const gcd = this._gcd(this.numerator, this.denominator);
        this.numerator /= gcd;
        this.denominator /= gcd;
        return this;
    };

    // сложение дробей
    add = (fraction) => {
        const { numerator, denominator } = fraction;
        this.numerator = this.numerator * denominator + numerator * this.denominator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    // вычитание дробей
    subtract = (fraction) => {
        const { numerator, denominator } = fraction;
        this.numerator = this.numerator * denominator - numerator * this.denominator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    // умножение дробей
    multiply = (fraction) => {
        const { numerator, denominator } = fraction;
        this.numerator *= numerator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    // деление  дробей
    divide = (fraction) => {
        const { numerator, denominator } = fraction;
        this.numerator *= denominator;
        this.denominator *= numerator;
        return this._applyGCD();
    };

    changeSign = () => {
        this.numerator *= -1;
        return this;
    };

    ifZero = () => {
        return this.numerator === 0;
    }

    // простая дробь
    simple = () => {
        return this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
    };

    // десятичная дробь
    decimals = () => {
        return `${(this.numerator / this.denominator).toFixed(2)}`;
    };
}
