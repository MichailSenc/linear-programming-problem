import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../context/solution/solutionContext";
import SimplexData from "../modules/simplexData";
import Button from "react-bootstrap/Button";
import SimplexMethod from "../components/simplex/SimplexMethod";
import Gaus from "../modules/gaus";
import Equations from "../components/Equations";
import CalcCoeffs from '../modules/calcCoeffs'

const SolveSimplex = () => {
    const { solutionData } = useContext(Context);
    const gaus = useRef(new Gaus(solutionData.current));
    const simData = useRef(null);

    console.log(solutionData.current);
    console.log(gaus.current);
    console.log(gaus.current.matrix.map(arr => arr.map(item => item.simple())));
    console.log(gaus.current.base);
    console.log(gaus.current.notBase);

    const setSimplexData = () => {
        simData.current = new SimplexData(solutionData.current);
        simData.current.setReadySolution(new CalcCoeffs(gaus.current, solutionData.current.func, solutionData.current.growth).createTable());
    }

    const Error = () => {
        if (gaus.current.error.isError) {
            return (
                <>
                    <h6 dangerouslySetInnerHTML={gaus.current.error.message}></h6>
                </>
            );
        }
        return null;
    };

    const Basis = () => {
        return (
            <>
                <h6 className="mb-3">X<sup>(0)</sup> = ({gaus.current.base.join(", ")})</h6>
            </>
        );
    };

    const Simplex = () => {
        if (!gaus.current.error.isError) {
            setSimplexData()
            return <SimplexMethod data={simData} />;
        }
        return null;
    }

    return (
        <>
            <h4 className="text-center mb-3">Симплекс Метод старт</h4>
            <div className='d-flex flex-column'>
                <Equations />
                <Basis />
            </div>
            <Error />
            <Simplex/>
        </>
    );
};

export default SolveSimplex;
