import React, { useReducer } from "react";
import { newTaskReducer } from "./newTaskReducer";
import Context from "./context";
import { ARTIFICAL } from "../../types";
import { CHANGE_VAR_COUNT, CHANGE_REF_COUNT, CHANGE_TYPE_DATA, CHANGE_GENERAL_MESSAGE } from "../../types";
import { NO_ERROR } from "./messages";

const NewTaskState = ({ children }) => {
    const [newTaskstate, dispatch] = useReducer(newTaskReducer, {
        varCount: 1,
        refCount: 1,
        typeData: ARTIFICAL,
        errors: NO_ERROR(),
    });

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

    return (
        <Context.Provider
            value={{
                newTaskstate,
                setVarCount,
                setRefCount,
                setTypeData,
                setGeneralMessage,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default NewTaskState;
