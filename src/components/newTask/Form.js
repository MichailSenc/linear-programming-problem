import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GRAPHICAL, ARTIFICAL, SIMPLEX, TYPE_FUNCTION, TYPE_REFERENCE } from "../../types";
import { GAPHICAL_REF, SIMPLEX_REF } from "../../refs";
import VarInput from "./VarInput";
import Basis from "./Basis";
import TaskInput from "./TaskTypeInput";
import Button from "react-bootstrap/Button";
import ModalWindow from "../ModalWindow";
import ModalContext from "../../context/modal/context";
import Table from "./Table/Table";
import Context from "../../context/newTask/context";
import SolutionContext from "../../context/solution/solutionContext";

const Form = () => {
    const {
        newTaskstate: { varCount, refCount, typeData, errors },
        inputValues,
        setTypeData,
        setVarCount,
        setRefCount,
        setGeneralMessage,
        clearInputValues,
    } = useContext(Context);

    const { setSolutionData, solutionData } = useContext(SolutionContext);

    const { handleShow } = useContext(ModalContext);

    const history = useHistory();

    // возвращает отсортированный массив данных функции/базиса
    const getDataArray = (type) => {
        let data = [];

        document.querySelectorAll(`[input_type=${type}]`).forEach((item) => {
            data.push([item.value, +item.getAttribute("position_index")]);
        });

        return data.sort((a, b) => a[1] - b[1]).map((item) => item[0]);
    };

    // возвращает матрицу функций-ограничений
    const getRestArray = () => {
        let res = []; // each elem: { data: [], sign: "", pos: i, };

        for (let i = 0; i < refCount; i++) {
            let str = [];
            document.querySelectorAll(`[input_type='${TYPE_REFERENCE}'][row_index='${i + 1}']`).forEach((item) => {
                str.push([item.value, +item.getAttribute("position_index")]);
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
            setGeneralMessage("Ошибка, проверьте корректновсть введённых данных");
            return;
        }

        setSolutionData({
            growth: inputValues.current["min-max"] || "min",
            func: getDataArray(TYPE_FUNCTION),
            restrictions: getRestArray(),
            baseVector: typeData === ARTIFICAL ? [] : getBase(),
            varCount,
            refCount,
            type: typeData,
            isNeedBase: typeData === ARTIFICAL,
        });

        console.log(solutionData.current);

        switch (typeData) {
            case GRAPHICAL:
                history.push(GAPHICAL_REF);
                break;
            case ARTIFICAL:
                history.push(SIMPLEX_REF);
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
        setTypeData(typeData);
        clearInputValues();
    };

    // сохранить данные в файл
    const save = () => {
        // TODO дописать сохранение конфигурации в файл
        handleShow();
        console.log("SAVE!");
    };

    const Tables = ({ children }) => {
        if (errors.isError) {
            return <h6 className="text-danger">{errors.generalMessage}</h6>;
        }
        return children;
    };

    const GetBasis = ({ children }) => {
        return typeData !== ARTIFICAL ? children : null;
    };

    return (
        <>
            <ModalWindow />
            <form onSubmit={(e) => submitData(e)}>
                <div className="d-flex">
                    <div className="col-sm-6">
                        <VarInput
                            message={errors.messageForVar}
                            label="Число переменных"
                            def={varCount}
                            id="varCount"
                            plValue="4"
                            setValue={setVarCount}
                        />
                        <VarInput
                            message={errors.messageForRef}
                            label="Число ограничений"
                            def={refCount}
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
        </>
    );
};

export default Form;
