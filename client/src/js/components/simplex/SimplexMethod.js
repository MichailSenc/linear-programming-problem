import React, {useContext, useEffect, useRef, useState} from "react";
import Context from "../../context/solution/solutionContext";
import SimplexData from "../../modules/simplexData";
import SimplexTable from "./SimplexTable";
import Button from "react-bootstrap/Button";
import {SIMPLE} from "../../types";

const SimplexMethod = (props) => {
    const {data, backToArt} = props;
    const {solutionData} = useContext(Context);
    let simData = useRef(new SimplexData(solutionData.current));
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(false);
    const [opt, setOpt] = useState(false);
    const [optClick, setOptClick] = useState(false);
    const isArt = !!data;

    if (isArt) {
        simData.current = data.current;
    }

    const SimplexTabels = () => {
        // tabels - simData.current.history
        return [...tables].reverse().map((table, i) => {
            return (
                <SimplexTable
                    key={i}
                    data={simData.current}
                    table={table}
                    setTables={setTables}
                    setError={setError}
                    setOptimal={setOpt}
                    optClick={optClick}
                />
            );
        });
    };

    useEffect(() => {
        setTables(simData.current.history);
        setError(simData.current.isUnsolvable());
        setOpt(simData.current.isOptimal());
    }, []);

    const onNextClick = () => {
        const selected = simData.current.selected[simData.current.curCount];
        if (selected) {
            simData.current.nextStep(selected.var, selected.rest);
            setError(simData.current.isUnsolvable());
            setOpt(simData.current.isOptimal());
            setTables([...simData.current.history]);
        }
    };

    const onPreviousClick = () => {
        if (!simData.current.previousStep() && backToArt) backToArt(false);
        setError(simData.current.isUnsolvable());
        setOpt(simData.current.isOptimal());
        setTables([...simData.current.history]);
    };

    const onOptimalClick = () => {
        setOptClick(true);
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
        if (opt) {
            return (
                <h6 className={`text-center mb-3 text-success ${optClick ? "d-none" : ""}`}>
                    Задача достигла оптимального решения
                </h6>
            );
        }
        return null;
    };

    const OptimalButton = () => {
        if (opt) {
            return (
                <button
                    className={`solve-buttons__button button button_success ${optClick ? "d-none" : ""}`}
                    type="button"
                    onClick={onOptimalClick}
                >
                    Получить ответ
                </button>
            );
        }

        return null;
    };

    const Solution = () => {
        const solution = simData.current.getSolution();
        if (optClick) {
            return (
                <>
                    <h6>Ответ:</h6>
                    <h6>
                        X<sup>*</sup> = (
                        {solution.vector
                            .map((item) => {
                                if (solutionData.current.fraction === SIMPLE) return item.simple();
                                return item.decimals();
                            })
                            .join(", ")}
                        )
                    </h6>
                    <h6>
                        F<sup>*</sup> =
                        {solutionData.current.fraction === SIMPLE ? solution.value.simple() : solution.value.decimals()}
                    </h6>
                </>
            );
        }
        return null;
    };

    const BackToSolveButton = () => {
        if (optClick) {
            return (
                <button className="button button_success" variant="success" onClick={() => setOptClick(false)}>
                    Вернутся к решению
                </button>
            );
        }
        return null;
    };

    return (
        <>
            <Solution />
            <p className="title">Симплекс Метод</p>
            <BackToSolveButton />
            <YeahOptimal />
            <SimplexError />
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
                <SimplexTabels />
            </div>
        </>
    );
};

export default SimplexMethod;
