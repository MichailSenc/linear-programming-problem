import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GRAPHICAL, ARTIFICAL, SIMPLEX, TYPE_FUNCTION, TYPE_REFERENCE, SIMPLE, DECIMAL } from "../../types";
import { GAPHICAL_REF, SIMPLEX_REF, ARTIFICAL_REF } from "../../refs";
import VarInput from "./VarInput";
import Basis from "./Basis";
import FractionInput from "./FractionTypeInput";
import Button from "react-bootstrap/Button";
import ModalSave from "../ModalWindow";
import ModalContext from "../../context/modal/context";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";

import SolutionContext from "../../context/solution/solutionContext";

const Form = () => {
    const { newTaskstate, inputValues, setAll, clearInputValues } = useContext(Context);
    const { varCount, refCount, typeData, typeFraction, errors } = newTaskstate;

    const { setSolutionData, solutionData } = useContext(SolutionContext);
    const { handleShowSave } = useContext(ModalContext);

    const history = useHistory();

    // возвращает отсортированный массив данных функции/базиса
    const getFunctionArray = () => {
        let data = [];

        document.querySelectorAll(`[input_type=${TYPE_FUNCTION}]`).forEach((item) => {
            data.push([item.value, +item.getAttribute("position_index")]);
        });

        data = data.sort((a, b) => a[1] - b[1]).map((item) => +item[0]);
        data.pop();
        return data;
    };

    // возвращает матрицу функций-ограничений
    const getRestArray = () => {
        let res = []; // each elem: { data: [], sign: "", pos: i, };
        for (let i = 0; i < refCount; i++) {
            let str = [];
            document.querySelectorAll(`[input_type='${TYPE_REFERENCE}'][row_index='${i + 1}']`).forEach((item) => {
                str.push([+item.value || 0, +item.getAttribute("position_index")]);
            });
            res.push({
                data: str.sort((a, b) => a[1] - b[1]).map((item) => item[0]),
                sign: inputValues.current[`TYPE_SIGN-${i + 1}`] || "eq",
                pos: i,
            });
        }
        return res;
    };

    const getBase = () => {
        const res = [];
        for (let i = 0; i < varCount; i++) {
            res.push(inputValues.current[`base-vector-${i + 1}`] || false);
        }
        return res;
    };

    // сабмит формы
    const submitData = (e) => {
        e.preventDefault();
        console.log("sub!!");

        if (errors.isError) {
            setAll({ generalMessage: "Ошибка, проверьте корректновсть введённых данных" });
            return;
        }

        const func = getFunctionArray();
        const restrictions = getRestArray();
        console.log(restrictions);

        for (const { data, pos } of restrictions) {
            let ifZero = true;
            for (let i = 0; i < data.length - 1; i++) {
                if (+data[i] !== 0) {
                    ifZero = false;
                    break;
                }
            }
            console.log(+data[data.length - 1]);
            console.log(+data[data.length - 1] !== 0);
            if (ifZero && +data[data.length - 1] !== 0) {
                setAll({ generalMessage: `Ошибка, ограничение №${pos + 1} некорректно. (слева 0, справа НЕ 0)` });
                return;
            }
        }

        setAll({ generalMessage: "" });

        setSolutionData({
            growth: inputValues.current["min-max"] || "min",
            func,
            restrictions,
            baseVector: typeData === ARTIFICAL ? [] : getBase(),
            varCount,
            refCount,
            type: typeData,
            fraction: typeFraction,
            isNeedBase: typeData === ARTIFICAL,
        });

        console.log(solutionData);

        console.log(solutionData.current);

        switch (typeData) {
            case GRAPHICAL:
                history.push(GAPHICAL_REF);
                break;
            case ARTIFICAL:
                history.push(ARTIFICAL_REF);
                break;
            case SIMPLEX:
                history.push(SIMPLEX_REF);
                break;
            default:
                break;
        }
    };

    // очистить всем параметрам таблиц присвоить 0
    const clearParams = () => {
        document.querySelectorAll("input[input_type]").forEach((item) => {
            item.value = 0;
        });
        setAll({ typeData });
        clearInputValues();
    };

    // сохранить данные в файл
    const save = () => {
        // TODO дописать сохранение конфигурации в файл
        handleShowSave();
        console.log("SAVE!");
    };

    const ErrorMessage = () => {
        if (errors.generalMessage !== "") {
            return <h6 className="text-danger text-center">{errors.generalMessage}</h6>;
        }
        return null;
    };

    const Tables = () => {
        if (!errors.isError) {
            return (
                <>
                    <GetBasis>
                        <Basis {...{ varCount, solutionData }} />
                    </GetBasis>
                    <label className="mb-3 mt-3">
                        <strong>Целевая функция</strong>
                    </label>
                    <Table varCount={varCount} refCount={1} type={TYPE_FUNCTION} />
                    <label className="mb-3 mt-3">
                        <strong>Ограничения</strong>
                    </label>
                    <Table varCount={varCount} refCount={refCount} type={TYPE_REFERENCE} />
                </>
            );
        }
        return null;
    };

    const GetBasis = ({ children }) => {
        return typeData !== ARTIFICAL ? children : null;
    };

    return (
        <>
            <ModalSave />
            <form onSubmit={(e) => submitData(e)}>
                <div className="d-flex flex-column">
                    <div className="d-flex form-group col-sm-12 flex-column">
                        <VarInput
                            message={errors.messageForVar}
                            label="Число переменных"
                            def={varCount}
                            id="varCount"
                        />
                        <VarInput
                            message={errors.messageForRef}
                            label="Число ограничений"
                            def={refCount}
                            id="refCount"
                        />
                    </div>

                    <div className="d-flex align-items-center form-group col-sm-12 ml-0 pl-0">
                        <label className="col-form-label col-sm-3">
                            <strong>Метод решения</strong>
                        </label>
                        <select
                            className="w-100 h-100 m-0 p-0 form-control"
                            onChange={(e) => {
                                console.log(e.target.value);
                                setAll({ typeData: e.target.value });
                            }}
                            defaultValue={newTaskstate.typeData || ARTIFICAL}
                            id="select_data_type"
                        >
                            <option label="Графический метод" value={GRAPHICAL} />
                            <option label="Симплекс метод" value={SIMPLEX} />
                            <option label="Метод искусственного базиса" value={ARTIFICAL} />
                        </select>
                    </div>
                    <div className="d-flex align-items-center form-group col-sm-12">
                        <legend className="col-form-label col-sm-3 pl-0 w-auto">
                            <strong>Дроби в решении</strong>
                        </legend>
                        <FractionInput value={SIMPLE} label="Простые" checked={SIMPLE === typeFraction} />
                        <FractionInput value={DECIMAL} label="Десятичные" checked={DECIMAL === typeFraction} />
                    </div>
                </div>

                <hr />

                <ErrorMessage />
                <Tables />

                <div className="d-flex justify-content-start p-3">
                    <Button className="mr-1" type="submit" variant="primary">
                        Решить задачу
                    </Button>
                    <Button className="mr-1" variant="secondary" onClick={() => clearParams()}>
                        Очистить параметры
                    </Button>
                    <Button className="mr-1" variant="success" onClick={() => save()}>
                        Сохранить задачу
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Form;
