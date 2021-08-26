import React, {useContext} from "react";
import {TYPE_FUNCTION} from "../../../types";

import Context from "../../../context/newTask/context";

const Row = (props) => {
    const {rowNumb, count, type} = props;
    const {setInputValue, inputValues} = useContext(Context);

    const changeInput = (e) => {
        let initVal = e.target.value;
        const t = e.target;
        // тут крч создаётся ключ в контексте таблицы, содержащей данный input
        setInputValue(
            `${t.getAttribute("input_type")}-${t.getAttribute("row_index")}-${t.getAttribute("position_index")}`,
            initVal
        );
    };

    const changeMinMax = (e) => {
        setInputValue("min-max", e.target.value);
    };

    const GetInput = (key, type, rowNumb) => {
        return (
            <div className="table__body-item" key={key}>
                <input
                    className="table__body-input input"
                    type="text"
                    input_type={type}
                    row_index={rowNumb}
                    position_index={key + 1}
                    placeholder="0"
                    defaultValue={inputValues.current[`${type}-${rowNumb}-${key + 1}`]}
                    onChange={(e) => changeInput(e)}
                />
            </div>
        );
    };

    const getRowInputs = () => {
        const inputs = [];

        for (let i = 0; i < count; i++) {
            inputs.push(GetInput(i, type, rowNumb));
        }

        if (type === TYPE_FUNCTION) {
            inputs.push(
                <div className="table__body-item" key={count}>
                    <select
                        className="table__body-select select"
                        input_type={type}
                        position_index={count + 1}
                        onChange={(e) => changeMinMax(e)}
                        defaultValue={inputValues.current["min-max"] || "min"}
                    >
                        <option label="min" value="min" />
                        <option label="max" value="max" />
                    </select>
                </div>
            );
        } else {
            inputs.push(GetInput(count + 1, type, rowNumb));
        }

        return inputs;
    };

    return (
        <div className="table__body-row">
            <div className="table__body-item" scope="row">
                {rowNumb}
            </div>
            {getRowInputs()}
        </div>
    );
};

export default Row;
