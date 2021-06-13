import Fraction from "./fraction";

export default class ArtificalData {
    // solutionData
    constructor({ refCount, restrictions, varCount }) {
        this.refCount = refCount;
        this.varCount = varCount;
        // startSettings - параметры на 1-м этапе решения
        this.startSettings = {};
        // history - массив объектов {resMatr, base, notBase, count}
        this.history = [];
        // current - текущий объект {resMatr, base, notBase, count}
        this.current = {};
        // curCount - счётчик текущего состояния
        this.curCount = 0;
        // selected - выбранные элементы в качестве базиса
        this.selected = {};
        this._startArt(restrictions);
    }

    autoMode = () => {
        for (let i = 0; i < this.refCount; i++) {
            if (this.isUnsolvable() || this.isOptimal()) return false;
            const { resMatr, base } = this.current;
            for (let j = 0; j < resMatr[i].length - 1; j++) {
                if (this.startSettings.notBase.includes(base[j])) continue;
                if (!resMatr[i][j].ifZero()) {
                    this.addSelectdItem({var: i, rest: j})
                    this.nextStep(i, j);
                    break;
                }
            }
        }
        return true;
    };

    // вычислить итоговые коэффициенты
    calcCoeffs = ({ func, growth }) => {
        const { resMatr, base, notBase } = this.current;
        const sNotBase = this.startSettings.notBase;
        const sBase = this.startSettings.base;
        const arr = new Array(base.filter((item) => !sNotBase.includes(item)).length + 1)
            .fill(0)
            .map(() => new Fraction());

        let copyArr = [...func];
        if (growth === "max") copyArr = copyArr.map((item) => +item * -1);
        resMatr.forEach((item, i) => {
            let j = 0;
            for (let t = 0; t < item.length; t++) {
                if (sNotBase.includes(base[t])) continue;
                arr[j].add(
                    new Fraction(item[t].numerator, item[t].denominator)
                        .changeSign()
                        .multiply(new Fraction(copyArr[notBase[i] - 1]))
                );
                j++;
            }
        });

        sBase
            .filter((el) => !notBase.includes(el))
            .forEach((item, t) => {
                arr[t].add(new Fraction(copyArr[item - 1]));
            });

        const clone = [];
        this._cloneFraction(JSON.parse(JSON.stringify(resMatr))).forEach((arr) => {
            let stringArr = [];
            for (let t = 0; t < arr.length; t++) {
                const item = arr[t];
                if (sNotBase.includes(base[t])) continue;
                stringArr.push(item);
            }
            clone.push(stringArr);
            stringArr = [];
        });

        clone[clone.length - 1] = arr;
        return {
            matrix: clone,
            base: base.filter((item) => !sNotBase.includes(item)),
            notBase: [...notBase],
        };
    };

    isOptimal = () => {
        const { base } = this.current;
        const sNotBase = this.startSettings.notBase;

        for (let i = 0; i < sNotBase.length; i++) {
            const item = sNotBase[i];
            if (!base.includes(item)) return false;
        }
        return true;
    };

    isUnsolvable = () => {
        const { resMatr, base, notBase } = this.current;
        const sBase = this.startSettings.base;
        const sNotBase = this.startSettings.notBase;

        if (this.isOptimal()) return false;
        console.log("usolve!");

        // i-номер ограничения -1
        point: for (let i = 0; i < resMatr.length - 1; i++) {
            if (sBase.includes(notBase[i])) continue;
            const arr = resMatr[i];
            // j-номер переменной -1
            for (let j = 0; j < arr.length - 1; j++) {
                if (sNotBase.includes(base[j])) continue;
                const fraction = arr[j];
                if (!fraction.ifZero()) continue point;
            }
            return true;
        }

        return false;
    };

    addSelectdItem = (value) => {
        this.selected[this.curCount] = value;
    };

    _cloneFraction = (matrix) => {
        return matrix.map((item) => {
            return item.map((fraction) => new Fraction(fraction.numerator, fraction.denominator));
        });
    };

    // функция формирует первую(стартовую) симплекс таблицу
    _startArt = (restrictions) => {
        const res = [];
        for (let i = 0; i < this.refCount; i++) {
            res[i] = restrictions[`${i}`].data.map((item) => new Fraction(item, 1));
            if (res[i][res[i].length - 1].sign() < 0) res[i] = res[i].map((fraction) => fraction.changeSign());
        }

        // Сумма всех столбцов * -1 (нижняя строчка таблицы)
        const total = new Array(this.varCount + 1).fill(0).map((item) => new Fraction());

        res.forEach((arr) => {
            arr.forEach((fraction, i) => {
                total[i].subtract(fraction);
            });
        });
        res[this.refCount] = total;

        const base = [];
        for (let i = 0; i < this.varCount; i++) {
            base[i] = i + 1;
        }

        const notBase = [];
        for (let i = 0; i < this.refCount; i++) {
            notBase[i] = i + 1 + this.varCount;
        }
        this.current = { resMatr: res, base, notBase, count: 0 };

        const clone = JSON.parse(JSON.stringify(this.current));
        clone.resMatr = this._cloneFraction(clone.resMatr);

        this.history.push(clone);
        this.startSettings = { base: [...base], notBase: [...notBase] };
        this.curCount = 0;
    };

    previousStep = () => {
        if (this.curCount === 0) return false;
        this.history.pop();
        this.current = this.history[this.history.length - 1];
        delete this.selected[this.curCount];
        this.curCount--;
        return true;
    };

    // следующий симплекс шаг (varnumb - индекс переменной; resnumb - номер ограничения)
    nextStep = (varnumb, resnumb) => {
        console.log(`nextStep, varnumb: ${varnumb}, resnumb: ${resnumb}`);
        let { resMatr, base, notBase, count } = JSON.parse(JSON.stringify(this.current));
        resMatr = this._cloneFraction(resMatr);

        // поменять базисные переменные
        const baseItem = base[varnumb];
        base[varnumb] = notBase[resnumb];
        notBase[resnumb] = baseItem;

        // далее модифицированный метод гаусса
        let cloneMatr = this._cloneFraction(JSON.parse(JSON.stringify(resMatr)));
        const a = new Fraction(1, 1).divide(cloneMatr[resnumb][varnumb]);
        cloneMatr[resnumb][varnumb] = a;

        const subVector = [];

        // строка опорного элемента
        for (let i = 0; i < this.varCount + 1; i++) {
            if (i === varnumb) {
                subVector[i] = "*";
                continue;
            }
            cloneMatr[resnumb][i].multiply(a);
            subVector[i] = new Fraction(cloneMatr[resnumb][i].numerator, cloneMatr[resnumb][i].denominator);
        }

        // столбец опорного элемента
        for (let i = 0; i < this.refCount + 1; i++) {
            if (i === resnumb) continue;
            cloneMatr[i][varnumb].multiply(a).changeSign();
        }

        // i - номер ограничения
        for (let i = 0; i < cloneMatr.length; i++) {
            if (i === resnumb) continue;
            const element = resMatr[i];

            // const multiplier = new Fraction(element[varnumb].numerator, element[varnumb].denominator);
            // j - номер переменной
            for (let j = 0; j < element.length; j++) {
                if (j === varnumb) continue;
                cloneMatr[i][j].subtract(
                    new Fraction(element[varnumb].numerator, element[varnumb].denominator).multiply(subVector[j])
                );
            }
        }

        this.current = { resMatr: cloneMatr, base, notBase, count: count + 1 };

        const clone = JSON.parse(JSON.stringify(this.current));
        clone.resMatr = this._cloneFraction(clone.resMatr);

        this.history.push(clone);
        this.curCount = count + 1;
    };
}
