import {
    CHANGE_VAR_COUNT,
    CHANGE_REF_COUNT,
    CHANGE_TYPE_DATA,
    CHANGE_GENERAL_MESSAGE,
    CHANGE_ALL,
    CHANGE_TYPE_FRACTION,
    CHANGE_MODE
} from "../../types";

const VAR_LOWER_REF = () => {
    return {
        messageForVar: "Число переменных должно быть не меньше числа ограничений",
        messageForRef: "Число ограничений должно быть не больше числа переменных",
        generalMessage: "Количество переменных должно быть больше количества ограничений",
        isError: true,
    };
};

const LOWER_THAN_TWO = (varCount, refCount) => {
    return {
        messageForVar: varCount < 2 ? "Число переменных не может быть меньше 2" : "",
        messageForRef: refCount < 2 ? "Число ограничений не может быть меньше 2" : "",
        generalMessage: "При данных параметрах таблицы составить невозможно",
        isError: true,
    };
};

const NO_ERROR = () => {
    return {
        isError: false,
    };
};

const checkData = ({ varCount, refCount }) => {
    if (varCount < 2 || refCount < 2) return LOWER_THAN_TWO(varCount, refCount);
    if (varCount <= refCount) return VAR_LOWER_REF();
    return NO_ERROR();
};

const handlers = {
    [CHANGE_VAR_COUNT]: (state, { varCount }) => ({ ...state, varCount, errors: checkData({ ...state, varCount }) }),
    [CHANGE_REF_COUNT]: (state, { refCount }) => ({ ...state, refCount, errors: checkData({ ...state, refCount }) }),
    [CHANGE_ALL]: (state, { data }) => ({ ...state, ...data, errors: checkData({ ...state, ...data }) }),
    [CHANGE_TYPE_DATA]: (state, { typeData }) => ({ ...state, typeData }),
    [CHANGE_MODE]: (state, { mode }) => ({ ...state, mode }),
    [CHANGE_TYPE_FRACTION]: (state, { typeFraction }) => ({ ...state, typeFraction }),
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
