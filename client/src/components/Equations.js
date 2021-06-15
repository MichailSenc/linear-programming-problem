import React, { useContext } from "react";
import Context from "../context/solution/solutionContext";

const Equations = () => {
    const { solutionData } = useContext(Context);
    console.log(solutionData);
    const { func, restrictions, growth, fraction } = solutionData.current;

    const getRest = (rest, right, sign = "=") => {
        let isSetted = false;
        const arr = rest.map((item, i) => {
            const sign = item.sign();
            if (sign === 0) return null;
            const value = (
                <span key={i}>
                    {sign === 1 ? (isSetted ? "+" : "") : "-"} {`${item.toString(fraction).replaceAll(/[+-]/g, "")}X`}
                    <sub>{`${i + 1} `}</sub>
                </span>
            );
            isSetted = true;
            return value;
        });
        arr.push(<span key={arr.length}>{` ${sign} ${right}`}</span>);
        return arr;
    };

    const GetFunc = () => {
        if (!func || func.length === 0) return <div>Функция не извеcтна</div>;
        console.log(func);
        return getRest(func, growth, "→");
    };

    const GetRest = () => {
        if (!restrictions || restrictions.length === 0) return <div>Ограничения не извеcтны</div>;
        return restrictions.map(({ data }, i) => {
            console.log(data);
            return <div key={i}>{getRest(data.slice(0, data.length - 1), data[data.length - 1])}</div>;
        });
    };

    return (
        <div className="mr-4">
            <h6>Условие:</h6>
            <div className="d-flex flex-column mb-2">
                <div>
                    <GetFunc />
                </div>
                <div>
                    <GetRest />
                </div>
            </div>
        </div>
    );
};

export default Equations;
