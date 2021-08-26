import React from "react";
import Equations from "../components/Equations";

const SolveGraphical = () => {
    // return <h1>Hello!</h1>
    return (
        <div className="container">
            <Equations />
            <canvas className="my-4 w-100 chartjs-render-monitor"></canvas>
        </div>
    );
};

export default SolveGraphical;
