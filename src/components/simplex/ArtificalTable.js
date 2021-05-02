import React, { useContext, useRef } from "react";
import Context from "../../context/solution/solutionContext";

const Table = (props) => {
    const { data, table, setTables } = props;
    const { resMatr, base, notBase, count } = table;

    const { solutionData } = useContext(Context);
    const { varCount, refCount } = solutionData.current;

    const selectedItem = useRef(null);

    const onClick = (e) => {
        const t = e.target;
        console.log(data);
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
            })

            console.log(`click ${e.target.textContent}`);
        }
    };

    const onDoubleClick = (e) => {
        console.log("DOUBLE!!!");

        const t = e.target;

        if (t.classList.contains(`td-${data.curCount}`)) {
            console.log("Contains!");
            data.nextStep(+t.getAttribute("var"), +t.getAttribute("rest"));
            setTables([...data.history]);
        }
    };

    const MatRow = () => {
        // item - это массив значеий одногo равенства
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
            item.forEach((element, j) => {
                const classes = [];
                const selected = data.selected[count];
                if (!(element === 0 || i === refCount || j === varCount)) {
                    classes.push(`td-${count}`, "active");
                    if (selected && selected.var === j && selected.rest === i) {
                        classes.push("trans_pink");
                    } else {
                        classes.push("trans_green");
                    }
                }
                res.push(
                    <td
                        key={`row-${i}-${j + 1}`}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        className={classes.join(" ")}
                        rest={i}
                        var={j}
                    >
                        {element}
                    </td>
                );
            });
            return <tr>{res}</tr>;
        });

        return reVal;
    };

    // "X\u0305"
    const GetCols = () => {
        const colls = [];
        console.log(`count: ${count}`);
        colls.push(
            <th key="col-first" scope="col">
                &ensp;{"X\u0303"}
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
