import React, { useState } from "react";
import Context from "./solutionContext";

const SolutionState = ({ children }) => {
    const [solutionData, setSolutionData] = useState({
        func: [],
        restrictions: [],
        baseVector: [],
        varCount: 0,
        refCount: 0,
        isNeedBase: false,
    });

    return (
        <Context.Provider
            value={{
                solutionData,
                setSolutionData,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default SolutionState;
