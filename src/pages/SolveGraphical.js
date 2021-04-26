import React, { useContext } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";

const SolveGraphical = () => {
    const { solutionData } = useContext(Context);
    const { func, baseVector, isNeedBase, restrictions } = solutionData;
    return <Equations func={func} baseVector={baseVector} isNeedBase={isNeedBase} restrictions={restrictions} />;
};

export default SolveGraphical;
