import React, {useContext} from "react";
import Context from "../../context/solution/solutionContext";
import {SIMPLE} from "../../types";

const Table = (props) => {
    const {table, data, setTables, setError, setOptimal} = props;
    const {resMatr, base, notBase, count} = table; // table - объект текущей таблицы

    const {solutionData} = useContext(Context);
    const {varCount, refCount, fraction} = solutionData.current;

    const onClick = (e) => {
        const t = e.target;
        if (t.classList.contains("active_simplex") && t.classList.contains(`td-${data.curCount}`)) {
            document.querySelectorAll(`.active_simplex.td-${data.curCount}`).forEach((item) => {
                item.classList.remove("trans_pink");
                item.classList.add(item.classList.contains("main_sup") ? "trans_blue" : "trans_green");
            });
            t.classList.remove("trans_green");
            t.classList.remove("trans_blue");
            t.classList.add("trans_pink");

            data.addSelectdItem({
                var: +t.getAttribute("var"),
                rest: +t.getAttribute("rest"),
            });
        }
    };

    const onDoubleClick = (e) => {
        const t = e.target;

        if (t.classList.contains(`td-${data.curCount}`)) {
            data.nextStep(+t.getAttribute("var"), +t.getAttribute("rest"));
            setError(data.isUnsolvable());
            setOptimal(data.isOptimal());
            setTables([...data.history]);
        }
    };

    // Явяется ли элемент лучшей кандидатурой на опорный
    const getSupportElements = () => {
        const elements = {};
        for (let i = 0; i < resMatr.length - 1; i++) {
            elements[i] = {};
            for (let j = 0; j < resMatr[i].length - 1; j++) {
                if (resMatr[resMatr.length - 1][j].demicalValue() >= 0) continue;
                if (resMatr[i][j].ifZero() || resMatr[i][j].demicalValue() <= 0) continue;
                const value = resMatr[i][resMatr[i].length - 1].demicalValue() / resMatr[i][j].demicalValue();
                elements[i][j] = true;
                if (!elements.max || elements.max.value > value) elements.max = {value, i, j};
            }
        }
        return elements;
    };

    const MatRow = () => {
        // item - это массив значеий одногo равенства
        // i-номер ограничения
        const reVal = resMatr.map((item, i) => {
            const res = [];
            res.push(
                <div className="table-16__body-item _bold" key={`row-${i}-${0}`}>
                    {(notBase[i] || notBase[i] === 0) && (
                        <>
                            X<sub>{notBase[i]}</sub>
                        </>
                    )}
                </div>
            );
            // j-номер переменной
            item.forEach((element, j) => {
                const classes = [];
                const supports = getSupportElements();
                const selected = data.selected[count];
                if (
                    element.demicalValue() > 0 &&
                    i !== refCount &&
                    j !== varCount &&
                    supports[i] &&
                    supports[i][j] &&
                    !element.isMin
                ) {
                    classes.push(`td-${count}`, "active_simplex");
                    if (supports.max.i === i && supports.max.j === j) {
                        classes.push("main_sup", "trans_blue");
                    } else if (selected && selected.var === j && selected.rest === i) {
                        classes.push("trans_pink");
                    } else {
                        classes.push("trans_green");
                    }
                }

                res.push(
                    <div
                        className={`table-16__body-item ${classes.join(" ")}`}
                        key={`row-${i}-${j + 1}`}
                        rest={i}
                        var={j}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                    >
                        {fraction === SIMPLE ? element.simple() : element.decimals()}
                    </div>
                );
            });
            return (
                <div
                    className="table-16__body-row"
                    style={{gridTemplate: `20px / 40px repeat(${varCount - refCount + 1},1fr)`}}
                >
                    {res}
                </div>
            );
        });

        return reVal;
    };

    const GetCols = () => {
        const colls = [];
        colls.push(
            <div className="table-16__head-item" key="col-first">
                {"X\u0305"}
                <sup>({count})</sup>
            </div>
        );

        base.forEach((item, i) => {
            colls.push(
                <div className="table-16__head-item" key={i}>
                    X<sub>{item}</sub>
                </div>
            );
        });

        colls.push(<div className="table-16__head-item" key={varCount + 2}></div>);
        return colls;
    };

    return (
        <>
            <div className="table-16 table-16_striped">
                <div
                    className="table-16__head"
                    style={{gridTemplate: `20px / 40px repeat(${varCount - refCount + 1},1fr)`}}
                >
                    <GetCols />
                </div>
                <div className="table-16__body">{MatRow()}</div>
            </div>
        </>
    );
};

export default Table;
