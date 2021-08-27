import React, {useContext} from "react";
import Context from "../../context/solution/solutionContext";
import {SIMPLE} from "../../types";

const Table = (props) => {
    const {data, table, setTables, setError, setOptimal, optClick} = props;
    const {resMatr, base, notBase, count} = table;

    const {solutionData} = useContext(Context);
    const {varCount, refCount, fraction} = solutionData.current;

    const onClick = (e) => {
        const t = e.target;
        // console.log(data);
        if (optClick) return;
        if (t.classList.contains("active") && t.classList.contains(`td-${data.curCount}`)) {
            document.querySelectorAll(`.active.td-${data.curCount}`).forEach((item) => {
                item.classList.remove("trans_pink");
                item.classList.add("trans_green");
            });
            t.classList.remove("trans_green");
            t.classList.add("trans_pink");

            data.addSelectdItem({
                var: +t.getAttribute("var"),
                rest: +t.getAttribute("rest"),
            });
        }
    };

    const onDoubleClick = (e) => {
        // console.log("DOUBLE!!!");

        const t = e.target;

        if (t.classList.contains(`td-${data.curCount}`)) {
            // console.log("Contains!");
            data.nextStep(+t.getAttribute("var"), +t.getAttribute("rest"));
            setError(data.isUnsolvable());
            setOptimal(data.isOptimal());
            setTables([...data.history]);
        }
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
            // console.log(item.map(arr => arr.map(t => t.simple())));

            item.forEach((element, j) => {
                const classes = [];
                const selected = data.selected[count];
                if (data.startSettings.notBase.includes(base[j])) {
                    classes.push("text-muted");
                } else if (element.ifZero() && i !== refCount && j !== varCount) {
                    classes.push("text-muted");
                } else if (!(element.ifZero() || i === refCount || j === varCount || !element.isMin)) {
                    classes.push(`td-${count}`, "active");
                    if (selected && selected.var === j && selected.rest === i) {
                        classes.push("trans_pink");
                    } else {
                        classes.push("trans_green");
                    }
                }
                res.push(
                    <div
                        className={`table-16__body-item ` + classes.join(" ")}
                        key={`row-${i}-${j + 1}`}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        rest={i}
                        var={j}
                    >
                        {fraction === SIMPLE ? element.simple() : element.decimals()}
                    </div>
                );
            });
            return (
                <div className="table-16__body-row" style={{gridTemplate: `20px / 40px repeat(${varCount + 1},1fr)`}}>
                    {res}
                </div>
            );
        });

        return reVal;
    };

    // "X\u0305"
    const GetCols = () => {
        const colls = [];
        colls.push(
            <div className="table-16__head-item" key="col-first">
                {"X\u0303"}
                <sup>({count})</sup>
            </div>
        );

        base.forEach((item, i) => {
            const classes = data.startSettings.notBase.includes(base[i]) ? "text-muted " : "";
            colls.push(
                <div key={i} scope="col" className={`table-16__head-item ${classes}`}>
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
                <div className="table-16__head" style={{gridTemplate: `20px / 40px repeat(${varCount + 1},1fr)`}}>
                    <GetCols />
                </div>
                <div className="table-16__body">{MatRow()}</div>
            </div>
        </>
    );
};

export default Table;
