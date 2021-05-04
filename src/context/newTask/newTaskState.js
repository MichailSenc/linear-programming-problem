import React, { useReducer, useRef } from "react";
import { newTaskReducer } from "./newTaskReducer";
import Context from "./context";
import { ARTIFICAL } from "../../types";
import {
    CHANGE_VAR_COUNT,
    CHANGE_REF_COUNT,
    CHANGE_TYPE_DATA,
    CHANGE_GENERAL_MESSAGE,
    CHANGE_TYPE_FRACTION,
    CHANGE_ALL,
    SIMPLE,
} from "../../types";

const NewTaskState = ({ children }) => {
    const [newTaskstate, dispatch] = useReducer(newTaskReducer, {
        varCount: 3,
        refCount: 2,
        typeData: ARTIFICAL,
        typeFraction: SIMPLE,
        generalMessage: "",
        errors: { isError: false },
    });

    const inputValues = useRef({});

    const setAll = ({ varCount, refCount, typeData, generalMessage, typeFraction }) => {
        if ((refCount || refCount === 0) && (varCount || varCount === 0))
            dispatch({ type: CHANGE_ALL, data: { varCount, refCount } });
        else if (varCount || varCount === 0) setVarCount(varCount);
        else if (refCount || refCount === 0) setRefCount(refCount);

        if (typeData) setTypeData(typeData);
        if (generalMessage || generalMessage === "") setGeneralMessage(generalMessage);
        if (typeFraction) setTypeFraction(typeFraction);
    };

    const setTypeFraction = (typeFraction) => {
        dispatch({
            type: CHANGE_TYPE_FRACTION,
            typeFraction,
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
        console.log(`set type data ${typeData}`);
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
                setAll,
                setInputValue,
                clearInputValues,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default NewTaskState;
