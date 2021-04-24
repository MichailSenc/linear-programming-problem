import React, { useState } from "react";
import Context from "./context";
import { ARTIFICAL } from "../../components/newTask/taskTypes";

export const AlertState = ({ children }) => {
    const [varCount, setVarCount] = useState(1);
    const [refCount, setRefCount] = useState(1);
    const [typeData, setTypeData] = useState(ARTIFICAL);

    return (
        <Context.Provider
            value={{
                varCount,
                setVarCount,
                refCount,
                setRefCount,
                typeData,
                setTypeData,
            }}
        >
            {children}
        </Context.Provider>
    );
};
