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
        messageForVar: varCount < 2 ? "Число переменных не может быть меньше 2" : "",
        messageForRef: refCount < 2 ? "Число ограничений не может быть меньше 2" : "",
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
