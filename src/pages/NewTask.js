import React, { useState } from "react";
import { ARTIFICAL } from "../components/newTask/taskTypes";
import Form from "../components/newTask/Form";
import Context from "../context/newTask/context";

const NewTask = () => {
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
            <Form />
        </Context.Provider>
    );
};

export default NewTask;
