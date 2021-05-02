export default class GetData {
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

    addSelectdItem = (value) => {
        this.selected[this.curCount] = value;
    };

    // функция формирует первую(стартовую) симплекс таблицу
    _startArt = (restrictions) => {
        const res = [];
        for (let i = 0; i < this.refCount; i++) {
            res[i] = restrictions[`${i}`].data.map((item) => +item);
            if (res[i][res[i].length - 1] < 0) res[i] = res[i].map((item) => +item * -1);
        }

        // Сумма всех столбцов * -1 (нижняя строчка таблицы)
        const total = Array(this.varCount + 1).fill(0);
        res.forEach((arr) => {
            arr.forEach((item, i) => (total[i] -= item));
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
        this.history.push(JSON.parse(JSON.stringify(this.current)));
        this.startSettings = { base, notBase };
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
        const { resMatr, base, notBase, count } = this.current;

        // поменять базисные переменные
        const baseItem = base[varnumb];
        base[varnumb] = notBase[resnumb];
        notBase[resnumb] = baseItem;

        // далее модифицированный метод гаусса
        let cloneMatr = JSON.parse(JSON.stringify(resMatr));
        const a = 1 / cloneMatr[resnumb][varnumb];
        cloneMatr[resnumb][varnumb] = a;

        const subVector = [];

        // строка опорного элемента
        for (let i = 0; i < this.varCount + 1; i++) {
            if (i === varnumb) {
                subVector[i] = "*";
                continue;
            }
            cloneMatr[resnumb][i] *= a;
            subVector[i] = cloneMatr[resnumb][i];
        }

        // столбец опорного элемента
        for (let i = 0; i < this.refCount + 1; i++) {
            if (i === resnumb) continue;
            cloneMatr[i][varnumb] *= -a;
        }

        // i - номер ограничения
        for (let i = 0; i < cloneMatr.length; i++) {
            if (i === resnumb) continue;
            const element = resMatr[i];

            const multiplier = element[varnumb];
            // j - номер переменной
            for (let j = 0; j < element.length; j++) {
                if (j === varnumb) continue;
                cloneMatr[i][j] -= multiplier * subVector[j];
            }
        }

        this.current = { resMatr: cloneMatr, base, notBase, count: count + 1 };
        this.history.push(JSON.parse(JSON.stringify(this.current)));
        this.curCount = count + 1;
    };
}
