import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../context/solution/solutionContext";
import SimplexData from "../../modules/simplexData";
import SimplexTable from "./SimplexTable";
import Button from "react-bootstrap/Button";
import { SIMPLE } from "../../types";

const SimplexMethod = (props) => {
    const { data, backToArt } = props;
    const { solutionData } = useContext(Context);
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
        if (!simData.current.previousStep()) {
            if (isArt) backToArt(false);
        }
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
            return <h6 className="text-center mb-3 text-success">Задача достигла оптимального решения</h6>;
        }
        return null;
    };

    const OptimalButton = () => {
        if (opt) {
            return (
                <Button className="btn-sm mb-2" variant="success" onClick={onOptimalClick}>
                    Получить ответ
                </Button>
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

    return (
        <>
            <Solution />
            <h4 className="text-center mb-3">Симплекс Метод</h4>
            <YeahOptimal />
            <SimplexError />
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
                    <SimplexTabels />
                </div>
            </div>
        </>
    );
};

export default SimplexMethod;
