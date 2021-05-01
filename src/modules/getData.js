export default class GetData {
    // solutionData
    constructor({ refCount, restrictions, varCount }) {
        this.refCount = refCount;
        this.varCount = varCount;
        this.restrictions = restrictions;

        // { resMatr: - матрица ограничений, base, notBase, count: текущий шаг }
        this.history = {};
        this.current = {};
    }

    startArt = () => {
        const res = [];
        for (let i = 0; i < this.refCount; i++) {
            res[i] = this.restrictions[`${i}`].data.map((item) => +item);
            if (res[i][res[i].length - 1] < 0) res[i] = res[i].map((item) => +item * -1);
        }

        // Сумма всех столбнов * -1 (нижняя строчка)
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
        return { resMatr: res, base, notBase, count: 0 };
    };

    nextStep = (varnumb, resnumb) => {
        // re
        console.log(this.current);
        const { resMatr, base, notBase, count } = this.current;
        // this.history[count] = this.current;

        // убрать/добавить переменные в базис
        const baseItem = base[varnumb];
        base[resnumb] = notBase[resnumb];
        notBase[resnumb] = baseItem;

        // далее модифицированный метод гаусса
        let cloneMatr = JSON.parse(JSON.stringify(resMatr));
        console.log(cloneMatr);
        console.log(varnumb);
        console.log(resnumb);
        const a = 1 / cloneMatr[varnumb][resnumb];
        cloneMatr[varnumb][resnumb] = a;

        const subVector = [];

        for (let i = 0; i < this.varCount + 1; i++) {
            if (i === resnumb) {
                subVector[i] = "*";
                continue;
            }
            cloneMatr[varnumb][i] *= a;
            subVector[i] = cloneMatr[varnumb][i];
        }

        for (let i = 0; i < this.refCount + 1; i++) {
            if (i === varnumb) continue;
            cloneMatr[i][resnumb] *= -a;
        }

        for (let i = 0; i < cloneMatr.length; i++) {
            const element = resMatr[i];
            if (i === resnumb) continue;

            const multiplier = element[varnumb];
            for (let j = 0; j < element.length; j++) {
                if (j === varnumb) continue;
                cloneMatr[i][j] -= multiplier * subVector[j];
            }
        }
        console.log(cloneMatr);
    };
}
