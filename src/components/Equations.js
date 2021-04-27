import React, { useContext } from "react";
import Context from "../context/solution/solutionContext";

const Equations = () => {
    const { solutionData } = useContext(Context);
    const { func, restrictions } = solutionData.current;

    const Equality = (arr, delimiter) => {
        const res = [];
        let counter = 0;
        while (res.length === 0 && counter < arr.length - 1) {
            const item = Math.abs(+arr[counter]) === 1 ? "" : `${Math.abs(arr[counter])} ⋅ `;
            if (+arr[counter] !== 0)
                res.push(
                    <span key={counter + "ucount"}>
                        {arr[counter] < 0 ? "-" : ""}
                        {item}X<sub>{counter + 1}</sub>
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

        if (res.length === 0) res.push(<span key={0}>0</span>);

        res.push(
            <span key={arr.length - 1}>
                {delimiter}
                {arr[arr.length - 1]}
            </span>
        );
        return res;
    };

    const GetFunc = () => {
        if (!func || func.length === 0) return <div>Функция не извеcтна</div>;
        return Equality(func, " → ");
    };

    const sign = { eq: "=", le: "≤", ge: "≥" };

    const GetRest = () => {
        if (!restrictions || restrictions.length === 0) return <div>Ограничения не извеcтны</div>;
        const res = [];
        for (const key in restrictions) {
            const element = restrictions[key];
            res.push(<div key={key}>{Equality(element.data, ` ${sign[element.sign]} `)}</div>);
        }
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
                <div>{/* <GetBasis /> */}</div>
            </div>
        </>
    );
};

export default Equations;
