import React, { useContext } from "react";
import Context from "../../context/newTask/context";

const ModeInput = (props) => {
    const { value, label, checked } = props;
    const { setAll } = useContext(Context);

    return (
        <div className="form-check col-sm-2 mr-3">
            <input
                className="form-check-input"
                type="radio"
                name="ModeRadios"
                id={value}
                defaultValue={value}
                defaultChecked={checked}
                onChange={(e) => {
                    if (e.target.checked) setAll({mode: value});
                }}
            />
            <label className="form-check-label" htmlFor={value}>
                {label}
            </label>
        </div>
    );
};

export default ModeInput;
