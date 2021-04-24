import React from "react";

const Row = (props) => {
    const { rowNumb, count, type } = props;

    const onChange = () => {
        console.log("INPUT-ON-CHANGE!");
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
                        onChange={onChange}
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
