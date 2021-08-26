import React, {useContext} from "react";
import Context from "../../context/newTask/context";

const FractionInput = (props) => {
    const {value, label, checked} = props;
    const {setAll} = useContext(Context);

    return (
        <div className="checkbox-container">
            <input
                className="checkbox-container__input input"
                type="radio"
                name="fractionRadios"
                id={value}
                defaultValue={value}
                defaultChecked={checked}
                onChange={(e) => {
                    if (e.target.checked) setAll({typeFraction: value});
                }}
            />
            <p className="checkbox-container__label label">{label}</p>
        </div>
    );
};

export default FractionInput;
