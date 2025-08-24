import { createContext, useContext, useState } from "react";

const Modal = createContext();

export const ModalProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [redirectTo, setRedirectTo] = useState(null);
    const [confirm, setConfirm] = useState(null); 
    const [options, setOptions] = useState({}); 


    const showModal = (msg, opts = {}) => {
        setMessage(msg);
        setRedirectTo(opts.redirectTo ?? null);
        setConfirm(opts.confirm ?? null);
        setVisible(true);
        setOptions(opts);
    };

    const closeModal = () => {
        setVisible(false);
        setMessage("");
        setRedirectTo(null);
        setConfirm(null);
    };

    return (
        <Modal.Provider value={{ visible, message, confirm, redirectTo, showModal, closeModal, options }}>
        {children}
        </Modal.Provider>
    );
};

export const useModal = () => useContext(Modal);
