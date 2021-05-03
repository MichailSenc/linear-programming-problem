import React, { useState } from "react";
import Context from "./context";

const ModalState = ({ children }) => {
    const [showStart, setShowSart] = useState(false);

    const handleCloseStart = () => setShowSart(false);
    const handleShowStart = () => setShowSart(true);

    const [showSave, setShowSave] = useState(false);

    const handleCloseSave = () => setShowSave(false);
    const handleShowSave = () => setShowSave(true);

    return (
        <Context.Provider
            value={{
                showSave,
                handleCloseSave,
                handleShowSave,
                showStart,
                handleCloseStart,
                handleShowStart,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default ModalState;
