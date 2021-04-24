import React from "react";

const Row = (props) => {
    const { rowNumb, count, type } = props;

    const onChange = (e) => {
        console.log("INPUT-ON-CHANGE!");

        let initVal = +e.target.value;
        if (/(^0[0-9]+)/.exec(e.target.value)) {
            e.target.value = initVal;
        }
    };

    const getRowInputs = () => {
        const inputs = [];

        for (let i = 0; i < count + 1; i++) {
            inputs.push(
                <td key={i}>
                    <input
                        type="number"
                        input_type={type}
                        index={`${i + 1}-${rowNumb}`}
                        defaultValue="0"
                        onChange={(e) => onChange(e)}
                    />
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
