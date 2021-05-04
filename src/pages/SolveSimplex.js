import React, { useContext, useEffect, useRef, useState } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import GetData from "../modules/getData";
import Table from "../components/simplex/ArtificalTable";
import Button from "react-bootstrap/Button";

const SolveSimplex = () => {
    const { solutionData } = useContext(Context);
    const data = useRef(new GetData(solutionData.current));
    const [tables, setTables] = useState(data.current.history);
    const [error, setError] = useState(false);
    const [optimal, setOptimal] = useState(false);

    const Tables = () => {
        // массив таблиц реверсированный (как по мне так выглядит лучше, чем обычный)
        console.log(tables);
        return [...tables].reverse().map((table, i) => {
            return (
                <Table
                    key={i}
                    data={data.current}
                    table={table}
                    setTables={setTables}
                    setError={setError}
                    setOptimal={setOptimal}
                />
            );
        });
    };

    useEffect(() => {
        setError(data.current.isUnsolvable());
        setOptimal(data.current.isOptimal());
    }, []);

    const onNextClick = () => {
        const selected = data.current.selected[data.current.curCount];
        if (selected) {
            data.current.nextStep(selected.var, selected.rest);
            setError(data.current.isUnsolvable());
            setOptimal(data.current.isOptimal());
            setTables([...data.current.history]);
        }
    };

    const onPreviousClick = () => {
        data.current.previousStep();
        setError(data.current.isUnsolvable());
        setOptimal(data.current.isOptimal());
        setTables([...data.current.history]);
    };

    const Error = () => {
        if (error)
            return (
                <h6 className="text-center mb-3 text-danger">
                    Задача неразрешима, все Z<sub>is</sub> при каждом Z<sub>i0</sub> из нового базиса равны 0
                </h6>
            );
        return null;
    };

    const YeahOptimal = () => {
        console.log(optimal);
        if (optimal) {
            return <h6 className="text-center mb-3 text-success">Задача достигла оптимального решения</h6>;
        }
        return null;
    };

    const OptimalButton = () => {
        if (optimal) {
            return (
                <Button className="btn-sm mb-2" variant="success" onClick={() => {}}>
                    Перейти к симплекс методу
                </Button>
            );
        }

        return null;
    };

    return (
        <>
            <h1>{tables.length}</h1>
            <Equations />
            <h4 className="text-center mb-3">Метод искусственного базиса</h4>
            <YeahOptimal />
            <Error />
            <div className="row d-flex">
                <div className="d-flex col-sm-12">
                    <Button className="btn-sm mb-2 mr-1" variant="primary" onClick={onNextClick}>
                        Следующий шаг
                    </Button>
                    <Button className="btn-sm mb-2 mr-1" variant="secondary" onClick={onPreviousClick}>
                        Предыдущий шаг
                    </Button>
                    <OptimalButton />
                </div>
                <div className="col-sm-12">
                    <Tables />
                </div>
            </div>
        </>
    );
};

export default SolveSimplex;
