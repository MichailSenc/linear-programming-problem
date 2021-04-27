import React from "react";
import Row from "./TableRow";
import { TYPE_REFERENCE } from "../../../types";

const Table = (props) => {
    const { varCount, refCount, type } = props;

    const GetCols = () => {
        const colls = [];
        colls.push(
            <th key={0} scope="col" style={{ width: "5%" }}>
                #
            </th>
        );
        for (let i = 1; i < varCount + 1; i++) {
            colls.push(
                <th key={i} scope="col">
                    X<sub>{i}</sub>
                </th>
            );
        }
        if (type === TYPE_REFERENCE) colls.push(<th key={varCount + 1} style={{ width: "5%" }} scope="col"></th>);
        colls.push(
            <th key={varCount + 2} scope="col">
                res
            </th>
        );
        return colls;
    };

    const GetRows = () => {
        const rows = [];
        for (let i = 0; i < refCount; i++) {
            rows.push(<Row key={i} rowNumb={i + 1} count={varCount} type={type} />);
        }
        return rows;
    };

    return (
        <table className="table table-striped ref_table table-bordered">
            <thead>
                <tr>
                    <GetCols />
                </tr>
            </thead>
            <tbody>
                <GetRows />
            </tbody>
        </table>
    );
};

export default Table;
