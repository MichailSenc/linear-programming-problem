import React, { useReducer, useRef } from "react";
import { newTaskReducer } from "./newTaskReducer";
import Context from "./context";
import { ARTIFICAL } from "../../types";
import { CHANGE_VAR_COUNT, CHANGE_REF_COUNT, CHANGE_TYPE_DATA, CHANGE_GENERAL_MESSAGE, CHANGE_ALL } from "../../types";
import { NO_ERROR } from "./messages";

const NewTaskState = ({ children }) => {
    const [newTaskstate, dispatch] = useReducer(newTaskReducer, {
        varCount: 2,
        refCount: 2,
        typeData: ARTIFICAL,
        errors: NO_ERROR(),
    });

    const inputValues = useRef({});

    const setAll = ({ varCount, refCount }) => {
        dispatch({
            type: CHANGE_ALL,
            data: { varCount, refCount },
        });
    };

    const setVarCount = (varCount) => {
        dispatch({
            type: CHANGE_VAR_COUNT,
            varCount,
        });
    };

    const setRefCount = (refCount) => {
        dispatch({
            type: CHANGE_REF_COUNT,
            refCount,
        });
    };

    const setTypeData = (typeData) => {
        dispatch({
            type: CHANGE_TYPE_DATA,
            typeData,
        });
    };

    const setGeneralMessage = (generalMessage) => {
        dispatch({
            type: CHANGE_GENERAL_MESSAGE,
            generalMessage,
        });
    };
    const setInputValue = (key, value) => {
        inputValues.current = { ...inputValues.current, [key]: value };
    };

    const clearInputValues = () => {
        inputValues.current = {};
    };

    return (
        <Context.Provider
            value={{
                newTaskstate,
                inputValues,
                setVarCount,
                setRefCount,
                setTypeData,
                setAll,
                setGeneralMessage,
                setInputValue,
                clearInputValues,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default NewTaskState;
