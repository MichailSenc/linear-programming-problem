import React from "react";

const TaskInput = (props) => {
    const { value, label, checked, setTypeData } = props;

    return (
        <div className="form-check mb-2">
            <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id={value}
                defaultValue={value}
                defaultChecked={checked}
                onChange={(e) => {
                    if (e.target.checked) setTypeData(value);
                }}
            />
            <label className="form-check-label" htmlFor={value}>
                {label}
            </label>
        </div>
    );
};

export default TaskInput;
