import React, { useContext, useEffect, useRef, useState } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import ArtificalData from "../modules/artificalData";
import SimplexData from "../modules/simplexData";
import ArtificalTable from "../components/simplex/ArtificalTable";
import SimplexTable from "../components/simplex/SimplexTable";
import Button from "react-bootstrap/Button";

const SolveArtifical = () => {
    const { solutionData } = useContext(Context);
    const artData = useRef(new ArtificalData(solutionData.current));
    const simData = useRef(new SimplexData(solutionData.current));
    const [artTables, setArtTables] = useState(artData.current.history);
    const [tables, setTables] = useState([]);
    const [artificlaError, setArtificalError] = useState(false);
    const [error, setError] = useState(false);
    const [artOptimal, setArtOptimal] = useState(false);
    const [optimal, setOptimal] = useState(false);
    const [optClick, setOptClick] = useState(false);

    const ArtificalTables = () => {
        // массив таблиц реверсированный (как по мне так выглядит лучше, чем обычный)
        return [...artTables].reverse().map((table, i) => {
            return (
                <ArtificalTable
                    key={i}
                    data={artData.current}
                    table={table}
                    setTables={setArtTables}
                    setError={setArtificalError}
                    setOptimal={setArtOptimal}
                    optClick={optClick}
                />
            );
        });
    };

    const SimplexTabels = () => {
        console.log(tables);
        // tabels - simData.current.history
        return [...tables].reverse().map((table, i) => {
            console.log(table);
            return (
                <SimplexTable
                    key={i}
                    data={simData.current}
                    table={table}
                    setTables={setTables}
                    setError={setError}
                    setOptimal={setOptimal}
                    optClick={optClick}
                />
            );
        });
    };

    useEffect(() => {
        setArtificalError(artData.current.isUnsolvable());
        setArtOptimal(artData.current.isOptimal());
    }, []);

    const onNextClick = () => {
        const selected = artData.current.selected[artData.current.curCount];
        if (selected) {
            artData.current.nextStep(selected.var, selected.rest);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
            setArtTables([...artData.current.history]);
        }
    };

    const onPreviousClick = () => {
        artData.current.previousStep();
        setArtificalError(artData.current.isUnsolvable());
        setArtOptimal(artData.current.isOptimal());
        setArtTables([...artData.current.history]);
    };

    const onOptimalClick = () => {
        setOptClick(true);
        simData.current.setReadySolution(artData.current.calcCoeffs(solutionData.current.func));
        setTables(simData.current.history);
        setError(simData.current.isUnsolvable());
        setOptimal(simData.current.isOptimal());
    };

    const ArtificalError = () => {
        if (artificlaError)
            return (
                <h6 className="text-center mb-3 text-danger">
                    Задача неразрешима, все Z<sub>is</sub> при каждом Z<sub>i0</sub> из нового базиса равны 0
                </h6>
            );
        return null;
    };

    const SimplexError = () => {
        if (error)
            return (
                <h6 className="text-center mb-3 text-danger">
                    Задача неразрешима, существует ребро, уходящее в бесконечность
                </h6>
            );
        return null;
    };

    const YeahOptimal = () => {
        if (artOptimal) {
            return <h6 className="text-center mb-3 text-success">Задача достигла оптимального решения</h6>;
        }
        return null;
    };

    const OptimalButton = () => {
        if (artOptimal) {
            return (
                // <Button className="btn-sm mb-2" variant="success" onClick={onOptimalClick} disabled={optClick}>
                <Button className="btn-sm mb-2" variant="success" onClick={onOptimalClick}>
                    Перейти к симплекс методу
                </Button>
            );
        }

        return null;
    };

    const SimplexMethod = () => {
        if (optClick) {
            return (
                <>
                    <h4 className="text-center mb-3">Симплекс Метод</h4>
                    <YeahOptimal />
                    <SimplexError />
                    <div className="row d-flex">
                        <div className="d-flex col-sm-12">
                            <Button
                                className="btn-sm mb-2 mr-1"
                                variant="primary"
                                onClick={onNextClick}
                                disabled={optClick}
                            >
                                Следующий шаг
                            </Button>
                            <Button
                                className="btn-sm mb-2 mr-1"
                                variant="secondary"
                                onClick={onPreviousClick}
                                disabled={optClick}
                            >
                                Предыдущий шаг
                            </Button>
                            <OptimalButton />
                        </div>
                        <div className="col-sm-12">
                            <SimplexTabels />
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <>
            <h1>{artTables.length}</h1>
            <Equations />
            <SimplexMethod />
            <h4 className="text-center mb-3">Метод искусственного базиса</h4>
            <YeahOptimal />
            <ArtificalError />
            <div className="row d-flex">
                <div className="d-flex col-sm-12">
                    <Button className="btn-sm mb-2 mr-1" variant="primary" onClick={onNextClick} disabled={optClick}>
                        Следующий шаг
                    </Button>
                    <Button
                        className="btn-sm mb-2 mr-1"
                        variant="secondary"
                        onClick={onPreviousClick}
                        disabled={optClick}
                    >
                        Предыдущий шаг
                    </Button>
                    <OptimalButton />
                </div>
                <div className="col-sm-12">
                    <ArtificalTables />
                </div>
            </div>
        </>
    );
};

export default SolveArtifical;
