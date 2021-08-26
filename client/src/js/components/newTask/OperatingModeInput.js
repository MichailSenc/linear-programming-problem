import React, {useContext} from "react";
import Context from "../../context/newTask/context";

const ModeInput = (props) => {
    const {value, label, checked} = props;
    const {setAll} = useContext(Context);

    return (
        <div className="checkbox-container">
            <input
                className="checkbox-container__input input"
                type="radio"
                name="ModeRadios"
                id={value}
                defaultValue={value}
                defaultChecked={checked}
                onChange={(e) => {
                    if (e.target.checked) setAll({mode: value});
                }}
            />
            <label className="checkbox-container__label label" htmlFor={value}>
                {label}
            </label>
        </div>
    );
};

export default ModeInput;
