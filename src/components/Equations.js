import React from "react";

const Equations = (props) => {
    const { func, baseVector, isNeedBase, restrictions } = props;
    // const { solutionData } = useContext(Context);
    // const { func, baseVector, isNeedBase, restrictions } = solutionData;

    const Equality = (arr, delimiter) => {
        const res = [];
        let counter = 0;
        while (res.length === 0 && counter < arr.length - 1) {
            if (+arr[counter] !== 0) 
            res.push(
                <span key={counter + 'ucount'}>
                    {arr[counter] < 0 ? "-" : ""}
                    {Math.abs(arr[counter])}&#8901;X<sub>{counter + 1}</sub>
                </span>
            );
            counter++;
        }

        for (let i = counter; i < arr.length - 1; i++) {
            const item = Math.abs(+arr[i]) === 1 ? "" : `${Math.abs(arr[i])} ⋅ `;
            if (+arr[i] === 0) continue;
            res.push(
                <span key={i}>
                    {arr[i] >= 0 ? " + " : " - "}
                    {item}X<sub>{i + 1}</sub>
                </span>
            );
        }

        if (res.length === 0) res.push((
            <span key={0}>0</span>
        ))

        res.push(
            <span key={arr.length - 1}>
                {delimiter} {arr[arr.length - 1]}
            </span>
        );
        return res;
    };

    const GetFunc = () => {
        if (!func || func.length === 0) return <div>Функция не извеcтна</div>;
        return Equality(func, "→");
    };

    const GetBasis = () => {
        if (isNeedBase) return null;
        if (!baseVector || baseVector.length === 0) return <div>Базис не известен</div>;
        return (
            <span>
                X<sup>(0)</sup> = ({baseVector.join(",")})
            </span>
        );
    };

    const GetRest = () => {
        if (!restrictions || restrictions.length === 0) return <div>Ограничения не извеcтны</div>;
        const res = [];
        restrictions.forEach((arr, i) => {
            res.push(<div key={i}>{Equality(restrictions[i], "=")}</div>);
        });
        return res;
    };

    return (
        <>
            <div className="d-flex flex-column">
                <label>Функция</label>
                <div>
                    <GetFunc />
                </div>
                <div>
                    <GetRest />
                </div>
                <div>
                    <GetBasis />
                </div>
            </div>
        </>
    );
};

export default Equations;
