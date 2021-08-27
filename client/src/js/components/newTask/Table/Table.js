import React from "react";
import Row from "./TableRow";

const GetCols = ({varCount}) => {
    const colls = [];
    colls.push(
        <div key={0} className="table-16__head-item">
            #
        </div>
    );
    for (let i = 1; i < varCount + 1; i++) {
        colls.push(
            <div key={i} className="table-16__head-item">
                X<sub>{i}</sub>
            </div>
        );
    }
    colls.push(
        <div key={varCount + 2} className="table-16__head-item">
            res
        </div>
    );
    return colls;
};

const GetRows = ({varCount, refCount, type}) => {
    const rows = [];
    for (let i = 0; i < refCount; i++) {
        rows.push(<Row key={i} rowNumb={i + 1} count={varCount} type={type} />);
    }
    return rows;
};

const Table = (props) => {
    return (
        <div className="table-content__table table-16 table-16_striped">
            <div className="table-16__head">
                <GetCols varCount={props.varCount} />
            </div>
            <div className="table-16__body">
                <GetRows {...props} />
            </div>
        </div>
    );
};

export default Table;
export {GetCols};
