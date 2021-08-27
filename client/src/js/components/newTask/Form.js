import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import {GAPHICAL_REF, SIMPLEX_REF, ARTIFICAL_REF} from "../../refs";
import VarInput from "./VarInput";
import Basis from "./Basis";
import FractionInput from "./FractionTypeInput";
import ModeInput from "./OperatingModeInput";
import ModalSave from "../ModalWindow";
import ModalContext from "../../context/modal/context";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";
import Fracrion from "../../modules/fraction";

import * as types from "../../types";

import SolutionContext from "../../context/solution/solutionContext";

const Form = () => {
    const {newTaskstate, inputValues, setAll, clearInputValues} = useContext(Context);
    const {varCount, refCount, typeData, typeFraction, errors, mode} = newTaskstate;

    const {setSolutionData, solutionData} = useContext(SolutionContext);
    const {handleShowSave} = useContext(ModalContext);

    const history = useHistory();

    // возвращает отсортированный массив данных функции/базиса
    const getFunctionArray = () => {
        let data = [];
        let err = false;

        for (const item of document.querySelectorAll(`[input_type=${types.TYPE_FUNCTION}]`)) {
            if (item.value === "min" || item.value === "max") continue;

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
            document
                .querySelectorAll(`[input_type='${types.TYPE_REFERENCE}'][row_index='${i + 1}']`)
                .forEach((item) => {
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

        if (errors.isError) {
            setAll({generalMessage: "Ошибка, проверьте корректновсть введённых данных"});
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

        console.log("RESTRICTIONS");

        for (const {data, pos} of restrictions) {
            let ifZero = true;
            for (let i = 0; i < data.length - 1; i++) {
                if (+data[i] !== 0) {
                    ifZero = false;
                    break;
                }
            }

            if (ifZero && +data[data.length - 1] !== 0) {
                setAll({generalMessage: `Ошибка, ограничение №${pos + 1} некорректно. (слева 0, справа НЕ 0)`});
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
        if (typeData !== types.ARTIFICAL && baseVector.filter((item) => item).length !== refCount) {
            setAll({generalMessage: `Ошибка, количество базисных переменных должно ровнятся количеству ограничений`});
            return;
        }

        setAll({generalMessage: ""});

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
            isNeedBase: typeData === types.ARTIFICAL,
        });

        switch (typeData) {
            case types.GRAPHICAL:
                history.push(GAPHICAL_REF);
                break;
            case types.ARTIFICAL:
                history.push(ARTIFICAL_REF);
                break;
            case types.SIMPLEX:
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
        setAll({typeData});
        clearInputValues();
    };

    // сохранить данные в файл
    const save = () => {
        handleShowSave();
        console.log("SAVE!");
    };

    const ErrorMessage = () => {
        return (
            <p id="message" className={`message message_error ${errors.generalMessage || "d-none"}`}>
                {errors.generalMessage}
            </p>
        );
    };

    const Tables = () => {
        return (
            <div className="main-form-tables">
                <div className="table-content">
                    <p className="table-content__label label">Целевая функция</p>
                    <Table varCount={varCount} refCount={1} type={types.TYPE_FUNCTION} />
                </div>
                <div className="table-content">
                    <p className="table-content__label label">Ограничения</p>
                    <Table varCount={varCount} refCount={refCount} type={types.TYPE_REFERENCE} />
                </div>
            </div>
        );
    };

    const GetBasis = () => {
        return typeData !== types.ARTIFICAL ? <Basis {...{varCount, solutionData}} /> : null;
    };

    return (
        <>
            <ModalSave />
            <form className="main-form" onSubmit={(e) => submitData(e)}>
                <div className="inputs">
                    <VarInput label="Число переменных" def={varCount} id="varCount" />
                    <VarInput label="Число ограничений" def={refCount} id="refCount" />

                    <div className="input-container">
                        <p className="input-container__label label">Метод решения</p>
                        <select
                            className="input-container__select select"
                            onChange={(e) => setAll({typeData: e.target.value})}
                            defaultValue={newTaskstate.typeData || types.ARTIFICAL}
                            id="select_data_type"
                        >
                            <option label="Графический" value={types.GRAPHICAL} />
                            <option label="Симплекс" value={types.SIMPLEX} />
                            <option label="Искусственный базис" value={types.ARTIFICAL} />
                        </select>
                    </div>
                    <div className="input-container">
                        <p className="input-container__label label">Дроби в решении</p>
                        <div className="checkbox-set">
                            <FractionInput
                                value={types.SIMPLE}
                                label="Простые"
                                checked={types.SIMPLE === typeFraction}
                            />
                            <FractionInput
                                value={types.DECIMAL}
                                label="Десятичные"
                                checked={types.DECIMAL === typeFraction}
                            />
                        </div>
                    </div>
                    <div className="input-container">
                        <p className="input-container__label label">Режим</p>
                        <div className="checkbox-set">
                            <ModeInput value={types.MANUAL_MODE} label="Ручной" checked={types.MANUAL_MODE === mode} />
                            <ModeInput
                                value={types.AUTO_MODE}
                                label="Автоматический"
                                checked={types.AUTO_MODE === mode}
                            />
                        </div>
                    </div>
                    <ErrorMessage />
                    <div className="form-buttons">
                        <button className="form-buttons__button button button_primary" type="submit">
                            Решить задачу
                        </button>
                        <button
                            type="button"
                            className="form-buttons__button button button_secondary"
                            onClick={() => clearParams()}
                        >
                            Очистить параметры
                        </button>
                        <button
                            type="button"
                            className="form-buttons__button button button_success"
                            onClick={() => save()}
                        >
                            Сохранить задачу
                        </button>
                    </div>
                </div>

                <div>
                    <GetBasis />
                    <Tables />
                </div>
            </form>
        </>
    );
};

export default Form;
