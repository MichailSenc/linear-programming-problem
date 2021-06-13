import React, { useRef } from "react";
import Context from "./solutionContext";

const SolutionState = ({ children }) => {
    const solutionData = useRef(null);

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
