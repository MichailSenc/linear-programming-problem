import {
    CHANGE_VAR_COUNT,
    CHANGE_REF_COUNT,
    CHANGE_TYPE_DATA,
    CHANGE_GENERAL_MESSAGE,
} from "../../types";

import { NO_ERROR, VAR_LOWER_REF, LOWER_THAN_ONE } from "./messages";

const checkData = ({ varCount, refCount }) => {
    if (varCount < refCount) return VAR_LOWER_REF();
    if (varCount < 1 || refCount < 1) return LOWER_THAN_ONE(varCount, refCount);
    return NO_ERROR();
};

const handlers = {
    [CHANGE_VAR_COUNT]: (state, { varCount }) => ({ ...state, varCount, errors: checkData({ ...state, varCount }) }),
    [CHANGE_REF_COUNT]: (state, { refCount }) => ({ ...state, refCount, errors: checkData({ ...state, refCount }) }),
    [CHANGE_TYPE_DATA]: (state, { typeData }) => ({ ...state, typeData }),
    [CHANGE_GENERAL_MESSAGE]: (state, { generalMessage }) => ({
        ...state,
        errors: { ...state.errors, generalMessage },
    }),
    DEFAULT: (state) => state,
};

export const newTaskReducer = (state, action) => {
    const handle = handlers[action.type] || handlers.DEFAULT;
    return handle(state, action);
};
