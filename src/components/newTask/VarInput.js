import React from "react";

const VarInput = (props) => {
    const { label, id, plValue, setValue, border, message } = props;

    // вот ЭТО сильно... аааааа
    const changeValue = (e) => {
        let initVal = +e.target.value;
        console.log(initVal);
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

        setValue(valForState);
    };

    const typeClass = border ? `${border} ` : "";
    return (
        <div className="form-group row">
            <label htmlFor={id} className="col-sm-5 col-form-label">
                <strong>{label}</strong>
            </label>
            <div className="col-sm-10 pb-2">
                <input
                    type="number"
                    className={`${typeClass} form-control`}
                    id={id}
                    placeholder={`например ${plValue}`}
                    onChange={(e) => changeValue(e)}
                />
                    <small className="form-text text-muted position-absolute w-100 mt-0">{message}</small>
            </div>
        </div>
    );
};

export default VarInput;
