import React, {useContext} from "react";
import Context from "../../context/newTask/context";

const Basis = (props) => {
    const {varCount} = props;
    const {inputValues} = useContext(Context);

    const onChange = (e, id) => {
        inputValues.current[`base-vector-${id}`] = e.target.checked;
    };

    const defVal = (id) => {
        return inputValues.current[`base-vector-${id}`] || false;
    };

    const CheckBox = ({id, count}) => {
        return (
            <div className="checkbox-set">
                <input
                    className="checkbox-set__input input"
                    type="checkbox"
                    id={`base-${id}`}
                    onClick={(e) => onChange(e, id)}
                    defaultChecked={defVal(id)}
                />
                <p className="checkbox-set__label label" htmlFor={`base-${id}`}>
                    X<sub>{count}</sub>
                </p>
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
        <div className="basis">
            <p className="basis__label label">Базис:</p>
            <div className="basis__checkboxies">
                <GetCheckSet />
            </div>
        </div>
    );
};

export default Basis;
