import React from "react";

const Equations = ({ func, base, rest }) => {
    const GetFunc = () => {
        if (!func || func.length === 0) {
            return <div>Функция не извеcтна</div>;
        }
        const res = [].push(
            <span key={0}>
                {func[0]}x<sub>1</sub>
            </span>
        );

        for (let i = 1; i < func.length - 1; i++) {
            const item = func[i];
            res.push(
                <span key={i}>
                    {item} + x<sub>{i + 1}</sub>
                </span>
            );
        }

        // res.push(<span key={func.length - 1}>→ {func[func.length - 1]}</span>);

        return res;
    };

    // →
    return (
        <>
            <div className="d-flex flex-column">
                <div>
                    <GetFunc />
                </div>
            </div>
        </>
    );
};

export default Equations;
