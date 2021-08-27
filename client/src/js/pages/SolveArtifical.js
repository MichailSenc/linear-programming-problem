import React, {useContext, useEffect, useRef, useState} from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import ArtificalData from "../modules/artificalData";
import SimplexData from "../modules/simplexData";
import ArtificalTable from "../components/simplex/ArtificalTable";
import Button from "react-bootstrap/Button";
import SimplexMethod from "../components/simplex/SimplexMethod";
import {AUTO_MODE} from "../types";

const SolveArtifical = () => {
    const {solutionData} = useContext(Context);
    const artData = useRef(new ArtificalData(solutionData.current));
    const simData = useRef(new SimplexData(solutionData.current));
    const [artTables, setArtTables] = useState(artData.current.history);
    const [artificlaError, setArtificalError] = useState(false);
    const [artOptimal, setArtOptimal] = useState(false);
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

    useEffect(() => {
        if (solutionData.current.mode === AUTO_MODE) {
            artData.current.autoMode();
            setArtTables([...artData.current.history]);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
            if (artData.current.isOptimal()) {
                simData.current = new SimplexData(solutionData.current);
                simData.current.setReadySolution(artData.current.calcCoeffs(solutionData.current));
                simData.current.autoMode();
                setOptClick(true);
            }
        } else {
            setArtTables([...artData.current.history]);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        simData.current = new SimplexData(solutionData.current);
        simData.current.setReadySolution(artData.current.calcCoeffs(solutionData.current));
    };

    const ArtificalError = () => {
        if (artificlaError)
            return (
                <p className="text-center mb-3 text-danger">
                    Задача неразрешима. Существует Z<sub>i0</sub>, при котором все Z<sub>is</sub> из нового базиса равны
                    0
                </p>
            );
        return null;
    };

    const YeahOptimal = () => {
        if (artOptimal) {
            return (
                <h6 className={`text-center mb-3 text-success ${optClick ? "d-none" : ""}`}>
                    Задача достигла оптимального решения
                </h6>
            );
        }
        return null;
    };

    const OptimalButton = () => {
        if (artOptimal) {
            return (
                <button
                    className={`solve-buttons__button button button_success ${optClick ? "d-none" : ""}`}
                    type="button"
                    onClick={onOptimalClick}
                >
                    Перейти к симплекс методу
                </button>
            );
        }

        return null;
    };

    const Simplex = () => {
        if (optClick)
            return (
                <div className="solution__container">
                    <SimplexMethod data={simData} backToArt={setOptClick} />;
                </div>
            );
        return null;
    };

    return (
        <div className="container">
            <div className="solution">
                <div className="solution__container">
                    <p className="solution__title title">Начальные условия</p>
                    <Equations />
                </div>
                <Simplex />
                <div className="solution__container">
                    <h4 className="solution__title title">Метод искусственного базиса</h4>
                    <YeahOptimal />
                    <ArtificalError />
                    <div className="solve-buttons">
                        <button
                            className={`solve-buttons__button button button_primary ${optClick ? "d-none" : ""}`}
                            type="button"
                            onClick={onNextClick}
                        >
                            Следующий шаг
                        </button>
                        <button
                            className={`solve-buttons__button button button_secondary ${optClick ? "d-none" : ""}`}
                            type="button"
                            onClick={onPreviousClick}
                        >
                            Предыдущий шаг
                        </button>
                        <OptimalButton />
                    </div>
                    <div className="solve-tables">
                        <ArtificalTables />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolveArtifical;
