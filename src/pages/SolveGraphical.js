import React, { useContext } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";

const SolveGraphical = () => {
    const { solutionData } = useContext(Context);
    const { func } = solutionData;
    console.log(func);
    return <Equations func={func} />;
};

export default SolveGraphical;
