import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Context from "../context/modal/context";

const ModalWindow = () => {
    const { showSave, handleCloseSave } = useContext(Context);

    return (
        <Modal show={showSave} onHide={handleCloseSave}>
            <Modal.Header closeButton>
                <Modal.Title>Сохранение конфигурации</Modal.Title>
            </Modal.Header>
            <Modal.Body>Ура! Это модальное окно!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSave}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCloseSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalWindow;
