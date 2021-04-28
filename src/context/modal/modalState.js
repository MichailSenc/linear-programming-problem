import React, { useState } from "react";
import Context from "./context";

const ModalState = ({ children }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Context.Provider
            value={{
                show,
                handleClose,
                handleShow,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default ModalState;
