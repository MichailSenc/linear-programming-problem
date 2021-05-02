export default class Fraction {
    constructor(numerator, denominator) {
        this.numerator = parseInt(numerator);
        this.denominator = parseInt(denominator);
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
        return {
            numerator: this.numerator,
            denominator: this.denominator,
        };
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

    // простая дробь
    simple = () => {
        return `${this.numerator}\\${this.denominator}`;
    };

    // десятичная дробь
    decimals = () => {
        return `${(this.numerator / this.denominator).toFixed(2)}`;
    };
}
