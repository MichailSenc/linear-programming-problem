import React, { useContext, useRef, useState } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import GetData from "../modules/getData";
import Table from "../components/simplex/ArtificalTable";
import Button from "react-bootstrap/Button";

const SolveSimplex = () => {
    const { solutionData } = useContext(Context);
    const data = useRef(new GetData(solutionData.current));
    const [tables, setTables] = useState(data.current.history);

    const Tables = () => {
        // массив таблиц реверсированный (как по мне так выглядит лучше, чем обычный)
        console.log(tables);
        return [...tables].reverse().map((table, i) => {
            return <Table key={i} data={data.current} table={table} setTables={setTables} />;
        });
    };

    const onNextClick = () => {
        const selected = data.current.selected[data.current.curCount]
        if (selected) {
            data.current.nextStep(selected.var, selected.rest);
            setTables([...data.current.history]);
        } 
    };

    const onPreviousClick = () => {
        data.current.previousStep();
        setTables([...data.current.history]);
    };

    return (
        <>
            <h1>{tables.length}</h1>
            <Equations />
            <div className="d-flex">
                <div className="d-flex flex-column col-sm-6">
                <div className="d-flex">
                    <Button className="btn-sm mb-2 mr-1" variant="primary" onClick={onNextClick}>
                        Следующий шаг
                    </Button>
                    <Button className="btn-sm mb-2" variant="secondary" onClick={onPreviousClick}>
                        Предыдущий шаг
                    </Button>
                </div>
                    <Tables />
                </div>
            </div>
        </>
    );
};

export default SolveSimplex;
