import React, { useContext } from "react";
import VarInput from "./VarInput";
import TaskInput from "./TaskTypeInput";
import { GRAPHICAL, ARTIFICAL, SIMPLEX, TYPE_FUNCTION, TYPE_REFERENCE, TYPE_BASIS } from "./taskTypes";
import Button from "react-bootstrap/Button";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";

const Form = () => {
    const { typeData, setTypeData, varCount, refCount, setVarCount, setRefCount } = useContext(Context);

    const isChecked = (currentType) => {
        return currentType === typeData;
    };

    const submitData = (e) => {
        e.preventDefault();
        console.log("SUB");
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
        if (varCount < refCount) {
            return (
                <>
                    <h6 className="text-danger">Число ограничений больше числа переменных</h6>
                    <h6 className="text-danger">При данных параметрах таблицы составить не возможно</h6>
                </>
            );
        }
        return jsx;
    };

    return (
        <form onSubmit={(e) => submitData(e)}>
            <div className="d-flex">
                <div className="col-sm-6">
                    <VarInput
                        label="Число переменных"
                        id="varCount"
                        value={varCount}
                        plValue="4"
                        setValue={setVarCount}
                    />
                    <VarInput
                        label="Число ограничений"
                        id="refCount"
                        value={refCount}
                        plValue="4"
                        setValue={setRefCount}
                    />
                </div>
                <fieldset className="form-group col-sm-6">
                    <div className="row">
                        <legend className="col-form-label col-sm-3 pt-0">
                            <strong>Тип задачи</strong>
                        </legend>
                        <div className="col-sm-6 d-flex flex-column ">
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
                <Button className="mr-1" variant="primary" onClick={() => solveTask()}>
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
