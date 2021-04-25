import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GRAPHICAL, ARTIFICAL, SIMPLEX, TYPE_FUNCTION, TYPE_REFERENCE, TYPE_BASIS } from "./taskTypes";
import { SOLUTION_REF } from "../../refs";
import VarInput from "./VarInput";
import TaskInput from "./TaskTypeInput";
import Button from "react-bootstrap/Button";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";
import SolutionContext from "../../context/solution/solutionContext";

const Form = () => {
    const { typeData, setTypeData, varCount, refCount, setVarCount, setRefCount } = useContext(Context);
    const { setSolutionData } = useContext(SolutionContext);
    const history = useHistory();

    const [dataState, setDataState] = useState({
        messageForVar: "",
        messageForRef: "",
        generalMessage: "",
        isError: false,
    });

    useEffect(() => {
        if (varCount < refCount) {
            setDataState({
                messageForVar: "Число переменных должно быть не меньше числа ограничений",
                messageForRef: "Число ограничений должно быть не больше числа переменных",
                generalMessage: "При данных параметрах таблицы составить невозможно",
                isError: true,
            });
        } else if (varCount < 1 || refCount < 1) {
            setDataState({
                messageForVar: varCount < 1 ? "Число переменных не может быть меньше 1" : "",
                messageForRef: refCount < 1 ? "Число ограничений не может быть меньше 1" : "",
                generalMessage: "При данных параметрах таблицы составить невозможно",
                isError: true,
            });
        } else {
            setDataState({
                messageForVar: "",
                messageForRef: "",
                generalMessage: "",
                isError: false,
            });
        }
    }, [varCount, refCount]);

    const getDataArray = (type) => {
        let data = [];

        document.querySelectorAll(`[input_type=${type}]`).forEach((item) => {
            data.push([item.value, +item.getAttribute("position_index")]);
        });

        data = data.sort((a, b) => a[1] - b[1]).map((item) => item[0]);
        return data;
    };

    const getRefArray = () => {
        let data = [];
        for (let i = 0; i < refCount; i++) {
            let str = [];
            document.querySelectorAll(`[input_type='${TYPE_REFERENCE}'][row_index='${i + 1}']`).forEach((item) => {
                str.push([item.value, +item.getAttribute("position_index")]);
            });
            data.push(str.sort((a, b) => a[1] - b[1]).map((item) => item[0]));
        }
        return data;
    };

    const submitData = (e) => {
        e.preventDefault();

        if (dataState.isError) {
            setDataState({ ...dataState, generalMessage: "Ошибка, проверьте корректновсть введённых данных" });
            return;
        }

        setSolutionData({
            func: getDataArray(TYPE_FUNCTION),
            restrictions: getRefArray(),
            baseVector: typeData === ARTIFICAL ? [] : getDataArray(TYPE_BASIS),
            varCount,
            refCount,
            isArt: typeData === ARTIFICAL,
        });

        history.push(SOLUTION_REF);
    };

    const clearParams = () => {
        document.querySelectorAll("input[input_type]").forEach((item) => {
            item.value = 0;
        });
    };

    const save = () => {
        // TODO дописать сохранение конфигурации в файл
        console.log("SAVE!");
    };

    const Tables = ({ children }) => {
        if (dataState.isError) {
            return <h6 className="text-danger">{dataState.generalMessage}</h6>;
        }
        return children;
    };

    const Basis = ({ children }) => {
        return typeData !== ARTIFICAL ? children : null;
    };

    return (
        <form onSubmit={(e) => submitData(e)}>
            <div className="d-flex">
                <div className="col-sm-6">
                    <VarInput
                        message={dataState.messageForVar}
                        label="Число переменных"
                        id="varCount"
                        plValue="4"
                        setValue={setVarCount}
                    />
                    <VarInput
                        message={dataState.messageForRef}
                        label="Число ограничений"
                        id="refCount"
                        plValue="2"
                        setValue={setRefCount}
                    />
                </div>

                <fieldset className="form-group col-sm-6">
                    <legend className="col-form-label col-sm-3 pl-0">
                        <strong>Тип задачи</strong>
                    </legend>
                    <div className="d-flex flex-column  h-75 justify-content-around">
                        <TaskInput
                            value={ARTIFICAL}
                            label="Метод исккусственного базиса"
                            checked={ARTIFICAL === typeData}
                            setTypeData={setTypeData}
                        />
                        <TaskInput
                            value={SIMPLEX}
                            label="Симплекс метод"
                            checked={SIMPLEX === typeData}
                            setTypeData={setTypeData}
                        />
                        <TaskInput
                            value={GRAPHICAL}
                            label="Графический метод"
                            checked={GRAPHICAL === typeData}
                            setTypeData={setTypeData}
                        />
                    </div>
                </fieldset>
            </div>

            <hr />

            <Tables>
                <label>Функция</label>
                <Table varCount={varCount} refCount={1} type={TYPE_FUNCTION} />
                <Basis>
                    <label>Базисный вектор</label>
                    <Table varCount={varCount} refCount={1} type={TYPE_BASIS} />
                </Basis>
                <label>Ограничения</label>
                <Table varCount={varCount} refCount={refCount} type={TYPE_REFERENCE} />
            </Tables>
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
    );
};

export default Form;
