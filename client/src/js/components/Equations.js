import React, {useContext} from "react";
import Context from "../context/solution/solutionContext";
import {GetCols} from "./newTask/Table/Table";

const Equations = () => {
    const {solutionData} = useContext(Context);
    const {func, restrictions, growth, fraction, varCount} = solutionData.current;

    console.log(solutionData);

    const GetRows = ({source, growth}) => {
        const rowItems = (row) => {
            return row.map((item, i) => {
                return (
                    <div className="table-16__body-item" key={i}>
                        {item.toString(fraction)}
                    </div>
                );
            });
        };
        return source.map((row, i) => {
            return (
                <div
                    className="table-16__body-row"
                    style={{gridTemplate: `20px / 20px repeat(${varCount + 1}, 1fr)`}}
                    key={i}
                >
                    <div className="table-16__body-item _bold">{i}</div>
                    {rowItems(row)}
                    {growth && (
                        <div className="table-16__body-item" key="growth">
                            {growth}
                        </div>
                    )}
                </div>
            );
        });
    };

    const EqTable = ({source, growth}) => {
        return (
            <div className="table-content__table table-16 table-16_striped">
                <div className="table-16__head" style={{gridTemplate: `20px / 20px repeat(${varCount + 1}, 1fr)`}}>
                    <GetCols varCount={varCount} />
                </div>
                <div className="table-16__body">
                    <GetRows source={source} growth={growth} />
                </div>
            </div>
        );
    };

    return (
        <div className="main-form-tables">
            <div className="table-content">
                <p className="table-content__label label">Целевая функция</p>
                <EqTable source={[func]} growth={growth} />
            </div>
            <div className="table-content">
                <p className="table-content__label label">Ограничения</p>
                <EqTable source={restrictions.map((res) => res.data)} />
            </div>
        </div>
    );
};

export default Equations;
