import React, { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Context from "../context/modal/context";
import NewContext from "../context/newTask/context";
import { ADDHOST } from "../refs";

const ModalWindow = () => {
    const { showSave, handleCloseSave } = useContext(Context);
    const { newTaskstate, inputValues } = useContext(NewContext);
    const input = useRef(null);
    const [error, setError] = useState(null);

    const onSave = () => {
        if (!input.current.value) {
            setError("Введите название сохранения");
            return;
        } 

        const sendRequest = (url, body = null) => {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            };

            return fetch(url, requestOptions).then((response) => {
                if (response.ok) {
                    return response.json();
                }

                return response.json().then((error) => {
                    const e = new Error("Что-то пошло не так");
                    e.data = error;
                    throw e;
                });
            });
        };

        sendRequest(
            ADDHOST,
            JSON.stringify({
                name: input.current.value,
                date: new Date().toLocaleString(),
                newTaskstate,
                inputValues: inputValues.current,
            })
        ).catch((err) => {
            setError("Произошла ошибка на стороне сервера");
            console.log(err);
        });

        setError(null);
        handleCloseSave();
    };

    const Error = () => {
        if (error)
            return (
                <>
                    <h6 className="text-danger mt-1 ml-1">{error}</h6>
                </>
            );
        return null;
    };

    return (
        <Modal show={showSave} onHide={handleCloseSave}>
            <Modal.Header closeButton>
                <Modal.Title>Сохранение конфигурации</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input ref={input} className="form-control" type="text" placeholder="название сохранения" />
                <Error />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSave}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalWindow;
