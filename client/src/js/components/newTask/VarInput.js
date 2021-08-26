import React, {useContext} from "react";
import Context from "../../context/newTask/context";

const VarInput = (props) => {
    const {label, id, def} = props;
    const {setAll} = useContext(Context);

    // вот ЭТО сильно... аааааа
    const changeValue = (e) => {
        let initVal = +e.target.value;
        let valForState = initVal;
        if (initVal > 16) {
            initVal = valForState = 16;
            e.target.value = initVal;
        } else if (initVal < -16) {
            e.target.value = -16;
            valForState = -1;
        } else if (/^00+/.exec(e.target.value)) {
            e.target.value = initVal;
        }

        setAll({[id]: valForState});
    };

    return (
        <div className="input-container">
            <p className="input-container__label label">{label}</p>
            <input
                type="number"
                className="input-container__input input"
                id={id}
                placeholder="например 4"
                onChange={(e) => changeValue(e)}
                defaultValue={def || 1}
            />
        </div>
    );
};

export default VarInput;
