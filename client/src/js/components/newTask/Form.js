import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GAPHICAL_REF, SIMPLEX_REF, ARTIFICAL_REF } from "../../refs";
import VarInput from "./VarInput";
import Basis from "./Basis";
import FractionInput from "./FractionTypeInput";
import ModeInput from "./OperatingModeInput";
import Button from "react-bootstrap/Button";
import ModalSave from "../ModalWindow";
import ModalContext from "../../context/modal/context";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";
import Fracrion from "../../modules/fraction";

import {
    GRAPHICAL,
    ARTIFICAL,
    SIMPLEX,
    TYPE_FUNCTION,
    TYPE_REFERENCE,
    SIMPLE,
    DECIMAL,
    AUTO_MODE,
    MANUAL_MODE,
} from "../../types";

import SolutionContext from "../../context/solution/solutionContext";

const Form = () => {
    const { newTaskstate, inputValues, setAll, clearInputValues } = useContext(Context);
    const { varCount, refCount, typeData, typeFraction, errors, mode } = newTaskstate;

    const { setSolutionData, solutionData } = useContext(SolutionContext);
    const { handleShowSave } = useContext(ModalContext);

    const history = useHistory();

    // возвращает отсортированный массив данных функции/базиса
    const getFunctionArray = () => {
        let data = [];
        let err = false;

        for (const item of document.querySelectorAll(`[input_type=${TYPE_FUNCTION}]`)) {
            if (item.value === "min" || item.value === "max") continue;
            console.log(item);
            console.log(item.value);
            const fraction = new Fracrion(item.value);
            data.push([fraction, +item.getAttribute("position_index")]);
            if (fraction.error) {
                err = true;
                item.classList.add("trans_danger");
                setTimeout(() => {
                    item.classList.remove("trans_danger");
                }, 2000);
            }
        }

        data = data.sort((a, b) => a[1] - b[1]).map((item) => item[0]);
        return [data, err];
    };

    // возвращает матрицу функций-ограничений
    const getRestArray = () => {
        let err = false;
        let res = []; // each elem: { data: [], sign: "", pos: i, };
        for (let i = 0; i < refCount; i++) {
            let str = [];
            // eslint-disable-next-line no-loop-func
            document.querySelectorAll(`[input_type='${TYPE_REFERENCE}'][row_index='${i + 1}']`).forEach((item) => {
                const fraction = new Fracrion(item.value);
                str.push([fraction, +item.getAttribute("position_index")]);
                if (fraction.error) {
                    err = true;
                    item.classList.add("trans_danger");
                    setTimeout(() => {
                        item.classList.remove("trans_danger");
                    }, 2000);
                }
            });
            res.push({
                data: str.sort((a, b) => a[1] - b[1]).map((item) => item[0]),
                pos: i,
            });
        }
        return [res, err];
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

        const [func, err1] = getFunctionArray();
        const [restrictions, err2] = getRestArray();

        if (err1 || err2) {
            const message = document.querySelector("#message");
            if (message) {
                message.classList.remove("d-none");
                message.innerHTML = "Ошибка, проверьте корректновсть введённых данных";
            }
            return;
        }
        console.log(restrictions);

        console.log("RESTRICTIONS");
        console.log(restrictions);
        for (const { data, pos } of restrictions) {
            let ifZero = true;
            for (let i = 0; i < data.length - 1; i++) {
                if (+data[i] !== 0) {
                    ifZero = false;
                    break;
                }
            }

            if (ifZero && +data[data.length - 1] !== 0) {
                setAll({ generalMessage: `Ошибка, ограничение №${pos + 1} некорректно. (слева 0, справа НЕ 0)` });
                return;
            }

            if (ifZero && +data[data.length - 1] === 0) {
                setAll({
                    generalMessage: `Ошибка, ограничение №${
                        pos + 1
                    } не имеет смысла. Пожалуйста уберите или измените его`,
                });
                return;
            }
        }

        const baseVector = getBase();
        if (typeData !== ARTIFICAL && baseVector.filter((item) => item).length !== refCount) {
            setAll({ generalMessage: `Ошибка, количество базисных переменных должно ровнятся количеству ограничений` });
            return;
        }
        console.log(getBase());
        setAll({ generalMessage: "" });

        setSolutionData({
            growth: inputValues.current["min-max"] || "min",
            func,
            restrictions,
            baseVector,
            varCount,
            mode,
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
        handleShowSave();
        console.log("SAVE!");
    };

    const ErrorMessage = () => {
        return (
            <h6 id="message" className={`text-danger text-center ${errors.generalMessage || "d-none"}`}>
                {errors.generalMessage}
            </h6>
        );
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
                    <div className="d-flex align-items-center form-group col-sm-12">
                        <legend className="col-form-label col-sm-3 pl-0 w-auto">
                            <strong>Режим</strong>
                        </legend>
                        <ModeInput value={MANUAL_MODE} label="Ручной" checked={MANUAL_MODE === mode} />
                        <ModeInput value={AUTO_MODE} label="Автоматический" checked={AUTO_MODE === mode} />
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
