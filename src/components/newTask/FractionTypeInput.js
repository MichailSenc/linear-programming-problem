import React, { useContext } from "react";
import Context from "../../context/newTask/context";

const FractionInput = (props) => {
    const { value, label, checked } = props;
    const { setAll } = useContext(Context);

    return (
        <div className="form-check col-sm-1 mr-3">
            <input
                className="form-check-input"
                type="radio"
                name="fractionRadios"
                id={value}
                defaultValue={value}
                defaultChecked={checked}
                onChange={(e) => {
                    if (e.target.checked) setAll({typeFraction: value});
                }}
            />
            <label className="form-check-label" htmlFor={value}>
                {label}
            </label>
        </div>
    );
};

export default FractionInput;
