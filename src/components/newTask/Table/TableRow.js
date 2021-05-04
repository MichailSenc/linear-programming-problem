import React, { useContext } from "react";
import { TYPE_FUNCTION } from "../../../types";

import Context from "../../../context/newTask/context";

const Row = (props) => {
    const { rowNumb, count, type } = props;
    const { setInputValue, inputValues } = useContext(Context);

    const changeInput = (e) => {
        let initVal = +e.target.value;
        if (/(^0[0-9]+)/.exec(e.target.value)) {
            e.target.value = initVal;
        }

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
            <td key={key}>
                <input
                    type="number"
                    input_type={type}
                    row_index={rowNumb}
                    position_index={key + 1}
                    placeholder="0"
                    defaultValue={inputValues.current[`${type}-${rowNumb}-${key + 1}`]}
                    onChange={(e) => changeInput(e)}
                />
            </td>
        );
    };

    const getRowInputs = () => {
        const inputs = [];

        for (let i = 0; i < count; i++) {
            inputs.push(GetInput(i, type, rowNumb));
        }

        if (type === TYPE_FUNCTION) {
            inputs.push(
                <td key={count}>
                    <select
                        input_type={type}
                        position_index={count + 1}
                        onChange={(e) => changeMinMax(e)}
                        defaultValue={inputValues.current["min-max"] || "min"}
                    >
                        <option label="min" value="min" />
                        <option label="max" value="max" />
                    </select>
                </td>
            );
        } else {
            inputs.push(GetInput(count + 1, type, rowNumb));
        }

        return inputs;
    };

    return (
        <tr>
            <th className="text-center" scope="row">
                {rowNumb}
            </th>
            {getRowInputs()}
        </tr>
    );
};

export default Row;
