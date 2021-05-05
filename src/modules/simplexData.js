import Fraction from "./fraction";

export default class SimplexData {
    // solutionData
    constructor({ refCount, restrictions, varCount }, calcStart = false) {
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
        // Это если мы решаем без искусственного базиса
        if (calcStart) this._startArt(restrictions);
        console.log("SIMPLEXDATA!!!!");
    }

    // Если уже есть готовая симплекс таблица (исскуственный базис)
    setReadySolution = ({matrix, base, notBase}) => {
        this.current = { resMatr: matrix, base: [...base], notBase: [...notBase], count: 0 };
        const clone = JSON.parse(JSON.stringify(this.current));
        clone.resMatr = this._cloneFraction(clone.resMatr);
        this.history.push(clone);
        this.startSettings = { base: [...base], notBase: [...notBase] };
        this.curCount = 0;
    };

    // TODO переделать !!!
    isOptimal = () => {
        const { resMatr } = this.current;
        resMatr[resMatr.length - 1].forEach((item) => {
            if (+item < 0) return false;
        });
        return true;
    };

    _getCurrentColumnByID = (id) => {
        const { resMatr } = this.current;
        const result = [];
        resMatr.forEach((arr) => {
            result.push(arr[id]);
        });
        return result;
    };

    // TODO переделать !!!
    isUnsolvable = () => {
        const { resMatr } = this.current;

        if (this.isOptimal()) return false;

        resMatr[resMatr.length - 1].forEach((arr) => {
            for (let i = 0; i < arr.length - 1; i++) {
                if (+arr[i] < 0 && this._getCurrentColumnByID(i).filter((i) => i >= 0).length > 0) return true;
            }
        });
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

    // TODO переделать - Нужно только для симплекс метода
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
        for (let i = 0; i < base.length + 1; i++) {
            if (i === varnumb) {
                subVector[i] = "*";
                continue;
            }
            cloneMatr[resnumb][i].multiply(a);
            subVector[i] = new Fraction(cloneMatr[resnumb][i].numerator, cloneMatr[resnumb][i].denominator);
        }

        // столбец опорного элемента
        for (let i = 0; i < notBase.length + 1; i++) {
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
