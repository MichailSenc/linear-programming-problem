import React, { useContext, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Context from "../../context/modal/context";

const ModalStart = ({ errors, varCount, refCount, setAll }) => {
    const { showStart, handleCloseStart } = useContext(Context);
    const data = useRef();

    const VarInput = ({ label, id, message, def }) => {
        // вот ЭТО сильно... аааааа
        const changeValue = (e) => {
            let initVal = +e.target.value;
            if (initVal > 16 || initVal < -16) {
                e.target.value = initVal > 16 ? 16 : -16;
            } else if (/^00+/.exec(e.target.value)) {
                e.target.value = initVal;
            }
        };

        const typeClass = message ? "border border-danger form-control" : "form-control";
        return (
            <div className="form-group row mb-0">
                <label htmlFor={id} className="col-sm-5 col-form-label">
                    <strong>{label}</strong>
                </label>
                <div className="col-sm-12 pb-2">
                    <input
                        type="number"
                        className={typeClass}
                        id={id}
                        placeholder="например 2"
                        defaultValue={def || 2}
                        onChange={changeValue}
                    />
                    <small className="form-text text-muted position-absolute w-100 mt-0">{message}</small>
                </div>
            </div>
        );
    };

    const submit = () => {
        setAll();
    };

    return (
        <Modal show={showStart} onHide={handleCloseStart}>
            <Modal.Header closeButton>
                <Modal.Title>Параметры задачи</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column">
                    <VarInput
                        message={errors.messageForVar}
                        label="Число переменных"
                        def={varCount}
                        id="varCount"
                        plValue="4"
                    />
                    <VarInput
                        message={errors.messageForRef}
                        label="Число ограничений"
                        def={refCount}
                        id="refCount"
                        plValue="2"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseStart}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleCloseStart}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStart;
