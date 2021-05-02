import React, { useContext, useRef, useState } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import GetData from "../modules/getData";
import Table from "../components/simplex/ArtificalTable";

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

    return (
        <>
            <h1>{tables.length}</h1>
            <Equations />
            <Tables />
        </>
    );
};

export default SolveSimplex;
