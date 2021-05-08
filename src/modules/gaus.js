import Fraction from "./fraction";

export default class Gaus {
    constructor({ restrictions, varCount, refcount, baseVector }) {
        this.varCount = varCount;
        this.refcount = refcount;
        this.matrix = restrictions.map((obj) => obj.data.map((item) => new Fraction(+item)));
        this.base = baseVector
            ? baseVector.map((i) => (i ? 1 : 0))
            : () => {
                  const arr = new Array(varCount - refcount).fill(0).push.apply(new Array(refcount).fill(1));
                  return arr.reverse();
              };
        this.error = { isError: false, errorCode: -1, message: "" };
        this.solveEquations();
    }

    checkError = () => {
        for (const arr of this.matrix) {
            const flag = this.isZeroArray(arr);
            switch (flag) {
                case 1:
                    this.error.isError = true;
                    this.error.message = {
                        __html: `Ошибка, невозможно составить решение, так как в ограничениях есть строка, являющиеся линейной комбинацией других строк`,
                    };
                    this.error.errorCode = 1;
                    return true;
                case 0:
                    this.error.isError = true;
                    this.error.message = {
                        __html: `Ошибка, в решении появилось некорректное ограничение, в котором слева все переменные обулились, а справа не 0`,
                    };
                    this.error.errorCode = 0;
                    return true;
                default:
                    this.error.isError = false;
                    this.error.message = "";
                    this.error.errorCode = -1;
                    break;
            }
        }
        return false;
    };

    // массив из нулей - 1;
    // массив из нулей, последний элемент не 0 - 0;
    // в массиве есть ненулевой элемент - -1;
    isZeroArray = (arr) => {
        const withoutLastElem = [...arr];
        const lastElement = withoutLastElem.pop();
        let isZeroArray = true;
        for (const item of withoutLastElem) {
            if (!item.ifZero()) {
                isZeroArray = false;
                break;
            }
        }
        if (isZeroArray) {
            if (lastElement.ifZero()) {
                return 1;
            } else {
                return 0;
            }
        }
        return -1;
    };

    getIngexOfMaxValueByAbs = (arr, step = 0) => {
        let index = step,
            max = arr[step];
        for (let i = step + 1; i < arr.length; i++) {
            if (Math.abs(arr[i].demicalValue()) > Math.abs(max.demicalValue())) {
                index = i;
                max = arr[i];
            }
        }
        return { max, index };
    };

    getColumnById = (id) => {
        const column = [];
        for (let i = 0; i < this.matrix.length; i++) {
            column.push(this.matrix[i][id]);
        }
        return column;
    };

    //Метод Гаусса
    solveEquations = () => {
        // прямой ход
        let step = 0; // индекс текущей сторки
        for (let i = 0; i < this.base.length; i++) {
            if (!this.base[i]) continue;
            const { max, index } = this.getIngexOfMaxValueByAbs(this.getColumnById(i), step);
            if (index !== step) {
                const cpval = this.matrix[step];
                this.matrix[step] = this.matrix[index];
                this.matrix[index] = cpval;
            }

            if (max.ifZero()) {
                if (this.checkError()) return;
                this.error.isError = true;
                this.error.message = {
                    __html: `Ошибка, система имеет бесконечно много решений, так как для базисной переменной X<sub>${
                        i + 1
                    }</sub> обнулился весь столбец`,
                };
                this.error.errorCode = 2;
                return;
            }

            this.matrix[step] = this.matrix[step].map((item) => new Fraction(item).divide(max));
            for (let j = step + 1; j < this.matrix.length; j++) {
                const multiplier = this.matrix[j][i];
                // eslint-disable-next-line no-loop-func
                this.matrix[j] = this.matrix[j].map((item, t) => {
                    return new Fraction(item).subtract(new Fraction(this.matrix[step][t]).multiply(multiplier));
                });
            }
            step++;
        }
        // обратный ход
        step = this.matrix.length - 1;
        for (let i = this.base.length - 1; i >= 0; i--) {
            if (!this.base[i]) continue;

            for (let j = step - 1; j >= 0; j--) {
                const multiplier = this.matrix[j][i];
                // eslint-disable-next-line no-loop-func
                this.matrix[j] = this.matrix[j].map((item, t) => {
                    return new Fraction(item).subtract(new Fraction(this.matrix[step][t]).multiply(multiplier));
                });
            }
            step--;
        }

        // проверка на ошибки
        this.checkError();
    };
}
