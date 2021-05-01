import React, { useContext, useRef } from "react";
import Context from "../../context/solution/solutionContext";

const Table = (props) => {
    const { data } = props;
    const { resMatr, base, notBase, count } = data.startArt();
    console.log(data);

    const tables = useRef([]);

    console.log(data);

    const {
        solutionData: {
            current: { varCount, refCount },
        },
    } = useContext(Context);

    const onClick = (e) => {
        const t = e.target;
        if (t.classList.contains("active")) {
            document.querySelectorAll(".active").forEach((item) => {
                item.classList.remove("trans_pink");
                item.classList.add("trans_green");
            });
            t.classList.remove("trans_green");
            t.classList.add("trans_pink");

            console.log(`click ${e.target.textContent}`);
        }
    };

    const onDoubleClick = (e) => {
        console.log("DOUBLE!!!");

        const t = e.target;

        data.nextStep(+t.getAttribute("var"), +t.getAttribute('rest'));
    };

    const MatRow = () => {
        // item - это массив значеий одногo равенства
        const reVal = resMatr.map((item, i) => {
            const res = [];
            // console.log(`i: ${i}, notBase[i]: ${notBase[i]}`);
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
                const classes =
                    element === 0 || i === refCount || j === varCount ? "" : `td-${count} active trans_green`;
                res.push(
                    <td
                        key={`row-${i}-${j + 1}`}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        className={classes}
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
            <table className="table table-striped table-bordered ref_table col-sm-6 text-center">
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
