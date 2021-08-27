import Fraction from "./fraction";

// данный класс вычисляет коэффициенты функции из готово таблицы метода Гаусса
export default class CalcCoeffs {
    // gaus - экземаляр объека метода гаусса, func - массив аргументов функции
    constructor(gaus, func, growth) {
        this.base = gaus.base;
        this.matrix = gaus.matrix;
        this.func = func;
        this.growth = growth;
    }

    createTable = () => {
        const result = [];
        // готовая матрица, но без нижней строчки
        this.matrix.forEach((arr) => {
            const resArr = [];
            for (let i = 0; i < arr.length - 1; i++) {
                if (this.base[i]) continue;
                resArr.push(new Fraction(arr[i]));
            }
            resArr.push(new Fraction(arr[arr.length - 1]));
            result.push(resArr);
        });

        const base = this.base.map((item, i) => (!item ? i + 1 : 0)).filter((item) => item);
        const notBase = this.base.map((item, i) => (item ? i + 1 : item)).filter((item) => item);

        const arr = new Array(base.length + 1).fill(0).map(() => new Fraction());

        let copyFunc = [...this.func];
        if (this.growth === "max") copyFunc = copyFunc.map((item) => +item * -1);

        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            for (let j = 0; j < item.length; j++) {
                arr[j].add(new Fraction(item[j]).changeSign().multiply(new Fraction(copyFunc[notBase[i] - 1])));
            }
        }

        let k = 0;

        for (let i = 0; i < copyFunc.length; i++) {
            const item = copyFunc[i];
            if (!this.base[i]) {
                arr[k].add(new Fraction(item));
                k++;
            }
        }

        result.push(arr);

        return {
            matrix: result,
            base,
            notBase,
        };
    };
}
