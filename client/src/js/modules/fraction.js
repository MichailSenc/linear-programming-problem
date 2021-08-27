import {SIMPLE} from "../types";

const dotRegex = /^([+-]?\d+)([+-]?\.(\d+))?$/;
const slashRegex = /^([+-]?\d+)([+-]?\/(\d+))?$/;
const emptyRegex = /^\s*$/;

export default class Fraction {
    constructor(numerator = 0, denominator = 1) {
        this.isMin = false;
        if (typeof numerator === "object") {
            this.numerator = numerator.numerator;
            this.denominator = numerator.denominator;
        } else if (typeof numerator === "string") {
            let matcher = numerator.trim().match(dotRegex);
            if (matcher) {
                const newLocal = typeof matcher[3] === "undefined";
                this.numerator = parseInt(matcher[1] + (newLocal ? "" : matcher[3]));
                this.denominator = parseInt(`1${"0".repeat(newLocal ? 0 : matcher[3].length)}`);
                this._applyGCD();
                return;
            }

            matcher = numerator.trim().match(slashRegex);
            if (matcher) {
                const newLocal = typeof matcher[3] === "undefined";
                if (!newLocal) {
                    if (matcher[3].match(/^0+$/)) {
                        this.error = true;
                        return;
                    }
                }
                this.numerator = parseInt(matcher[1]);
                this.denominator = parseInt(newLocal ? "0" : matcher[3]);
                this._applyGCD();
                return;
            }

            matcher = numerator.trim().match(emptyRegex);
            if (matcher) {
                this.numerator = 0;
                this.denominator = 1;
                this._applyGCD();
                return;
            }

            this.error = true;
            this._applyGCD();
            return;
        } else {
            this.numerator = parseInt(numerator);
            this.denominator = parseInt(denominator);
        }
        this._applyGCD();
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
        if (this.denominator < 0) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
        return this;
    };

    // сложение дробей
    add = (fraction) => {
        const {numerator, denominator} = fraction;
        this.numerator = this.numerator * denominator + numerator * this.denominator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    // вычитание дробей
    subtract = (fraction) => {
        const {numerator, denominator} = fraction;
        this.numerator = this.numerator * denominator - numerator * this.denominator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    asObject = () => {
        return {numerator: this.numerator, denominator: this.denominator};
    };

    // умножение дробей
    multiply = (fraction) => {
        const {numerator, denominator} = fraction;
        this.numerator *= numerator;
        this.denominator *= denominator;
        return this._applyGCD();
    };

    // деление  дробей
    divide = (fraction) => {
        const {numerator, denominator} = fraction;
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
    };

    // простая дробь
    simple = () => {
        return this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
    };

    // десятичная дробь
    decimals = () => {
        return `${(this.numerator / this.denominator).toFixed(2).replace(/\.00/, "")}`;
    };

    demicalValue = () => {
        return this.numerator / this.denominator;
    };

    toString = (type) => {
        return type === SIMPLE ? this.simple() : this.decimals();
    };

    sign = () => {
        return this.numerator === 0 ? 0 : this.numerator > 0 ? 1 : -1;
    };
}
