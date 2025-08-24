import styles from "/src/style/Modal.module.css";
import exitButton from "/src/assets/Close.svg";
import { useModal } from "/src/contexts/Modal";
import { useNavigate } from "react-router-dom";
import Button from "/src/components/Button"; 

export default function ModalRoot() {
    const { visible, message, redirectTo, confirm, closeModal, options } = useModal();
    const navigate = useNavigate();

    if (!visible) return null;

    const doClose = () => {
        closeModal();
        if (redirectTo) navigate(redirectTo); 
    };

    const doConfirm = async () => {
        try {
            if (typeof confirm === "function") {
                await confirm();
            } else {
                await confirm?.onConfirm?.();
            }
        } finally {
            doClose(); // Cierra el modal y redirige si aplica
        }
    };

    const doCancel = () => {
        if (typeof confirm !== "function") {
            confirm?.onCancel?.();
        }
        closeModal(); // Cancelar no redirige
    };

    return (
        <section
            className={styles.cober}
            role="dialog"
            aria-modal="true"
            onClick={() => {
                if (options?.closeOnOutsideClick !== false) {
                    doClose();
                }
            }}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
            >
                <button className={styles.closeButton} onClick={doClose} aria-label="Cerrar">
                    <img src={exitButton} alt="Cerrar modal" />
                </button>

                <p>{message}</p>

                {/* Si es confirmación, muestra los botones, si no, solo mensaje */}
                {confirm && (
                    <div className={styles.modalActions}>
                        <Button type="button" variant="cancel" onClick={doCancel}>
                            {confirm.cancelText ?? "Cancelar"}
                        </Button>
                        <Button type="button" variant="save" onClick={doConfirm}>
                            {confirm.confirmText ?? "Aceptar"}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
