import React from "react";
import Row from "./TableRow";

const Table = (props) => {
    const { varCount, refCount, type } = props;

    // console.log(varCount, refCount);

    const getCols = () => {
        const colls = [];
        for (let i = 0; i < varCount; i++) {
            colls.push(
                <th key={i} scope="col">
                    {"X"}
                    <sub>{i + 1}</sub>
                </th>
            );
        }
        return colls;
    };

    const getRows = () => {
        const rows = [];
        for (let i = 0; i < refCount; i++) {
            rows.push(<Row key={i} rowNumb={i + 1} count={varCount} type={type} />);
        }
        return rows;
    };

    return (
        <>
            <table className="table table-striped ref_table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        {getCols()}
                        <th scope="col">res</th>
                    </tr>
                </thead>
                <tbody>{getRows()}</tbody>
            </table>
        </>
    );
};

export default Table;
