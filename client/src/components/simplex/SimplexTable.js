import React, { useContext } from "react";
import Context from "../../context/solution/solutionContext";
import { SIMPLE } from "../../types";

const Table = (props) => {
    const { table, data, setTables, setError, setOptimal } = props;
    const { resMatr, base, notBase, count } = table; // table - объект текущей таблицы

    const { solutionData } = useContext(Context);
    const { varCount, refCount, fraction } = solutionData.current;

    const onClick = (e) => {
        const t = e.target;
        // if (optClick) return;
        if (t.classList.contains("active_simplex") && t.classList.contains(`td-${data.curCount}`)) {
            document.querySelectorAll(`.active_simplex.td-${data.curCount}`).forEach((item) => {
                item.classList.remove("trans_pink");
                item.classList.add(item.classList.contains('main_sup') ? "trans_blue":"trans_green");
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
                if (!elements.max || elements.max.value > value) elements.max = { value, i, j };
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
                <th key={`row-${i}-${0}`} scope="row">
                    {(notBase[i] || notBase[i] === 0) && (
                        <>
                            X<sub>{notBase[i]}</sub>
                        </>
                    )}
                </th>
            );
            // j-номер переменной
            item.forEach((element, j) => {
                const classes = [];
                const supports = getSupportElements();
                const selected = data.selected[count];
                if (element.demicalValue() > 0 && i !== refCount && j !== varCount && supports[i] && supports[i][j]) {
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
                    <td
                        key={`row-${i}-${j + 1}`}
                        className={classes.join(" ")}
                        rest={i}
                        var={j}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                    >
                        {fraction === SIMPLE ? element.simple() : element.decimals()}
                    </td>
                );
            });
            return <tr>{res}</tr>;
        });

        return reVal;
    };

    const GetCols = () => {
        const colls = [];
        colls.push(
            <th key="col-first" scope="col">
                &ensp;{"X\u0305"}
                <sup>({count})</sup>
            </th>
        );

        base.forEach((item, i) => {
            colls.push(
                <th key={i} scope="col">
                    &ensp;X<sub>{item}</sub>
                </th>
            );
        });

        colls.push(<th key={varCount + 2} scope="col"></th>);
        return colls;
    };

    return (
        <>
            <table className="table table-striped table-bordered ref_table text-center">
                <thead>
                    <tr>
                        <GetCols />
                    </tr>
                </thead>
                <tbody>{MatRow()}</tbody>
            </table>
        </>
    );
};

export default Table;
