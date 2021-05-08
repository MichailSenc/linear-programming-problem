import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../context/solution/solutionContext";
import SimplexData from "../modules/simplexData";
import Button from "react-bootstrap/Button";
import Gaus from "../modules/gaus";
import Equations from "../components/Equations";
import CalcCoeffs from '../modules/calcCoeffs'

const SolveSimplex = () => {
    const { solutionData } = useContext(Context);
    const gaus = new Gaus(solutionData.current);
    const coeffs = new CalcCoeffs(gaus, solutionData.current.func, solutionData.current.growth);
    const simData = useRef(new SimplexData(solutionData.current));
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(false);
    const [opt, setOpt] = useState(false);
    const [optClick, setOptClick] = useState(false);

    console.log(solutionData.current);
    console.log(gaus);
    console.log(gaus.matrix.map(arr => arr.map(item => item.simple())));
    console.log(gaus.base);
    console.log(gaus.notBase);
    console.log(coeffs.createTable().matrix.map(arr => arr.map(item => item.simple())));

    const Error = () => {
        if (gaus.error.isError) {
            return (
                <>
                    <h6 dangerouslySetInnerHTML={gaus.error.message}></h6>
                </>
            );
        }
        return null;
    };

    const Basis = () => {
        return (
            <>
                <h6 className="mb-3">X<sup>(0)</sup> = ({gaus.base.join(", ")})</h6>
            </>
        );
    };

    return (
        <>
            <h4 className="text-center mb-3">Симплекс Метод старт</h4>
            <div className='d-flex flex-column'>
                <Equations />
                <Basis />
            </div>
            <Error />
        </>
    );
};

export default SolveSimplex;
