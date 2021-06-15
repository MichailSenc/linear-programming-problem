import React, { useContext } from "react";
import Context from "../context/solution/solutionContext";

const Equations = () => {
    const { solutionData } = useContext(Context);
    const { func, restrictions, growth } = solutionData.current;

    const getSign = (fract) => {
        if (fract === "" || fract.search(/^\s*0+(\.0+)?\s*$/) !== -1 || fract.search(/^\s*0+(\\\d+)?\s*$/) !== -1)
            return 0;
        if (fract.search(/-/i) !== -1) return -1;
        return 1;
    };

    const getRest = (rest, right, sign = "=") => {
        let isSetted = false;
        const arr = rest.map((item, i) => {
            const sign = getSign(item);
            if (sign === 0) return null;
            const value = (
                <span key={i}>
                    {sign === 1 ? (isSetted ? "+" : "") : "-"} {`${item.replaceAll(/[+-]/g, "")}X`}
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
