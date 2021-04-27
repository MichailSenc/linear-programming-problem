import React, { useRef } from "react";
import Context from "./solutionContext";

const SolutionState = ({ children }) => {
    const solutionData = useRef({
        func: [],
        restrictions: {},
        baseVector: {},
        varCount: 0,
        refCount: 0,
        isNeedBase: false,
    });

    const setSolutionData = (data) => {
        solutionData.current = data;
    };

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
