import React, { useContext } from "react";
import Context from "../../context/newTask/context";

const VarInput = (props) => {
    const { label, id, message, def } = props;
    const { setAll } = useContext(Context);

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

    const typeClass = message ? "border border-danger form-control" : "form-control";
    return (
        <div className="d-flex form-group row">
            <label htmlFor={id} className="col-sm-3 col-form-label">
                <strong>{label}</strong>
            </label>
            <div className="col-sm-9 p-0">
                <input
                    type="number"
                    className={typeClass}
                    id={id}
                    placeholder="например 4"
                    onChange={(e) => changeValue(e)}
                    defaultValue={def || 1}
                />
                <small className="form-text text-muted position-absolute col-sm-12 mt-0">{message}</small>
            </div>
        </div>
    );
};

export default VarInput;
