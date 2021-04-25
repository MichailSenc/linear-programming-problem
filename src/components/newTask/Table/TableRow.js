import React, { useContext } from "react";
import { TYPE_FUNCTION } from "../../../types";

import Context from "../../../context/newTask/context";

const Row = (props) => {
    const { rowNumb, count, type } = props;
    const { setInputValue, inputValues } = useContext(Context);

    const onChange = (e) => {
        let initVal = +e.target.value;
        if (/(^0[0-9]+)/.exec(e.target.value)) {
            e.target.value = initVal;
        }

        const t = e.target;

        setInputValue(
            `${t.getAttribute("input_type")}-${t.getAttribute("row_index")}-${t.getAttribute("position_index")}`,
            initVal
        );
    };

    const getRowInputs = () => {
        const inputs = [];

        for (let i = 0; i < count + 1; i++) {
            inputs.push(
                <td key={i}>
                    <input
                        type="number"
                        input_type={type}
                        row_index={rowNumb}
                        position_index={i + 1}
                        defaultValue={inputValues.current[`${type}-${rowNumb}-${i + 1}`] || 0}
                        onChange={(e) => onChange(e)}
                    />
                </td>
            );
        }

        if (type === TYPE_FUNCTION) {
            inputs[count] = (
                <td key={TYPE_FUNCTION}>
                    <select name="solve_type" id="solve_type" input_type={TYPE_FUNCTION} position_index={count + 1}>
                        <option value="min">min</option>
                        <option value="max">max</option>
                    </select>
                </td>
            );
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
