import React, {useContext, useEffect, useRef, useState} from "react";
import Context from "../context/solution/solutionContext";
import SimplexData from "../modules/simplexData";
import Button from "react-bootstrap/Button";
import SimplexMethod from "../components/simplex/SimplexMethod";
import Gaus from "../modules/gaus";
import Equations from "../components/Equations";
import CalcCoeffs from "../modules/calcCoeffs";
import {AUTO_MODE} from "../types";

const SolveSimplex = () => {
    const {solutionData} = useContext(Context);
    const gaus = useRef(new Gaus(solutionData.current));
    const simData = useRef(null);
    const [setted, setSetted] = useState(false);

    useEffect(() => {
        if (solutionData.current.mode === AUTO_MODE) {
            setSimplexData();
            simData.current.autoMode();

            setSetted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setSimplexData = () => {
        if (!setted) {
            simData.current = new SimplexData(solutionData.current);
            simData.current.setReadySolution(
                new CalcCoeffs(gaus.current, solutionData.current.func, solutionData.current.growth).createTable()
            );
        }
    };

    const Error = () => {
        if (gaus.current.error.isError) {
            return <p className="text-center text-danger" dangerouslySetInnerHTML={gaus.current.error.message}></p>;
        }
        return null;
    };

    const Basis = () => {
        return (
            <p className="mb-3 mt-3">
                Базис: X<sup>(0)</sup> = ({gaus.current.base.join(", ")})
            </p>
        );
    };

    const Simplex = () => {
        if (!gaus.current.error.isError) {
            setSimplexData();
            return <SimplexMethod data={simData} />;
        }
        return null;
    };

    return (
        <div className="container">
            <div className="simplex">
                <p className="simplex__title title">Начальные условия</p>
                <Equations />
                <Basis />
                <Error />
                <Simplex />
            </div>
        </div>
    );
};

export default SolveSimplex;
