export const VAR_LOWER_REF = () => {
    return {
        messageForVar: "Число переменных должно быть не меньше числа ограничений",
        messageForRef: "Число ограничений должно быть не больше числа переменных",
        generalMessage: "При данных параметрах таблицы составить невозможно",
        isError: true,
    };
};

export const LOWER_THAN_ONE = (varCount, refCount) => {
    return {
        messageForVar: varCount < 1 ? "Число переменных не может быть меньше 1" : "",
        messageForRef: refCount < 1 ? "Число ограничений не может быть меньше 1" : "",
        generalMessage: "При данных параметрах таблицы составить невозможно",
        isError: true,
    };
};

export const NO_ERROR = () => {
    return {
        messageForVar: "",
        messageForRef: "",
        generalMessage: "",
        isError: false,
    };
};
