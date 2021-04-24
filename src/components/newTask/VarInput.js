import React from "react";

const VarInput = (props) => {
    const { label, id, value, plValue, setValue } = props;

    return (
        <div className="form-group row">
            <label htmlFor={id} className="col-sm-5 col-form-label">
                <strong>{label}</strong>
            </label>
            <div className="col-sm-6">
                <input
                    type="number"
                    className="form-control"
                    id={id}
                    placeholder={`например ${plValue}`}
                    min="1"
                    max="16"
                    value={value}
                    onChange={(e) => setValue(+e.target.value)}
                />
            </div>
        </div>
    );
};

export default VarInput;
