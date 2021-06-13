import React, { useContext } from "react";
import Context from "../../context/newTask/context";

const Basis = (props) => {
    const { varCount } = props;
    const { inputValues } = useContext(Context);

    const onChange = (e, id) => {
        inputValues.current[`base-vector-${id}`] = e.target.checked;
    };

    const defVal = (id) => {
        return inputValues.current[`base-vector-${id}`] || false;
    };

    const CheckBox = ({ id, count }) => {
        return (
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`base-${id}`}
                    onClick={(e) => onChange(e, id)}
                    defaultChecked={defVal(id)}
                />
                <label className="form-check-label" htmlFor={`base-${id}`}>
                    X<sub>{count}</sub>
                </label>
            </div>
        );
    };

    const GetCheckSet = () => {
        const res = [];
        for (let i = 0; i < varCount; i++) {
            res.push(<CheckBox key={i} id={i + 1} count={i + 1} />);
        }
        return res;
    };

    return (
        <div className="d-flex mb-2 mt-0">
            <label className="m-0">
                <strong>Базис:&emsp;</strong>
            </label>
            <div>
                <GetCheckSet />
            </div>
        </div>
    );
};

export default Basis;
