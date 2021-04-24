import React, { useContext, useEffect, useState } from "react";
import VarInput from "./VarInput";
import TaskInput from "./TaskTypeInput";
import { GRAPHICAL, ARTIFICAL, SIMPLEX, TYPE_FUNCTION, TYPE_REFERENCE, TYPE_BASIS } from "./taskTypes";
import Button from "react-bootstrap/Button";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";

const Form = () => {
    const { typeData, setTypeData, varCount, refCount, setVarCount, setRefCount } = useContext(Context);

    const [dataState, setDataState] = useState({
        borderStyle: "",
        messageForVar: "",
        messageForRef: "",
        generalMessage: "",
        isError: false,
    });

    useEffect(() => {
        console.log("effect!");
        if (varCount < refCount) {
            setDataState({
                borderStyle: "border border-danger",
                messageForVar: "Число переменных должно быть не меньше числа ограничений",
                messageForRef: "Число ограничений должно быть не больше числа переменных",
                generalMessage: "При данных параметрах таблицы составить не возможно",
                isError: true,
            });
        } else {
            setDataState({
                borderStyle: "",
                messageForVar: "",
                messageForRef: "",
                generalMessage: "",
                isError: false,
            });
        }
    }, [varCount, refCount]);

    const isChecked = (currentType) => {
        return currentType === typeData;
    };

    const submitData = (e) => {
        e.preventDefault();
        console.log("SUBMIT-EVENT!");

        if (!varCount || !refCount) {
            setDataState({
                borderStyle: "border border-danger",
                messageForVar: varCount ? "" : "Введите число переменных",
                messageForRef: refCount ? "" : "Введите число ограничений",
                generalMessage: "Ошибка не все параметры были введены",
                isError: true,
            });
        }
    };

    const solveTask = () => {
        console.log("SOLVE_TASK!");
    };

    const clearParams = () => {
        console.log("CLEAR!");
        document.querySelectorAll("input[input_type]").forEach((item) => {
            item.value = 0;
        });
    };

    const save = () => {
        console.log("SAVE!");
    };

    const Tables = (jsx) => {
        if (dataState.isError) {
            return <h6 className="text-danger">{dataState.generalMessage}</h6>;
        }
        return jsx;
    };

    return (
        <form onSubmit={(e) => submitData(e)}>
            <div className="d-flex">
                <div className="col-sm-6">
                    <VarInput
                        message={dataState.messageForVar}
                        border={dataState.borderStyle}
                        label="Число переменных"
                        id="varCount"
                        value={varCount}
                        plValue="4"
                        setValue={setVarCount}
                    />
                    <VarInput
                        message={dataState.messageForRef}
                        border={dataState.borderStyle}
                        label="Число ограничений"
                        id="refCount"
                        value={refCount}
                        plValue="4"
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
                                checked={isChecked(ARTIFICAL)}
                                setTypeData={setTypeData}
                            />
                            <TaskInput
                                value={SIMPLEX}
                                label="Симплекс метод"
                                checked={isChecked(SIMPLEX)}
                                setTypeData={setTypeData}
                            />
                            <TaskInput
                                value={GRAPHICAL}
                                label="Графический метод"
                                checked={isChecked(GRAPHICAL)}
                                setTypeData={setTypeData}
                            />
                    </div>
                </fieldset>
            </div>

            <hr />

            {Tables(
                <>
                    <label>Функция</label>
                    <Table varCount={varCount} refCount={1} type={TYPE_FUNCTION} />
                    {typeData !== ARTIFICAL ? (
                        <>
                            <label>Базисный вектор</label>
                            <Table varCount={varCount} refCount={1} type={TYPE_BASIS} />
                        </>
                    ) : null}
                    <label>Ограничения</label>
                    <Table varCount={varCount} refCount={refCount} type={TYPE_REFERENCE} />
                </>
            )}
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
