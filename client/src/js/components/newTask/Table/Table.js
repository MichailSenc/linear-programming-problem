import React from "react";
import Row from "./TableRow";

const Table = (props) => {
    const {varCount, refCount, type} = props;

    const GetCols = () => {
        const colls = [];
        colls.push(
            <div key={0} className="table__head-item">
                #
            </div>
        );
        for (let i = 1; i < varCount + 1; i++) {
            colls.push(
                <div key={i} className="table__head-item">
                    X<sub>{i}</sub>
                </div>
            );
        }
        colls.push(
            <div key={varCount + 2} className="table__head-item">
                res
            </div>
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
        <div className="table-content__table table table_striped">
            <div className="table__head">
                <GetCols />
            </div>
            <div className="table__body">
                <GetRows />
            </div>
        </div>
    );
};

export default Table;
