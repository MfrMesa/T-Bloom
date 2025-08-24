// import styles from "/src/style/Modal.module.css";
// import exitButton from "/src/assets/Close.svg";
// import { useModal } from "/src/contexts/Modal";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useCliente } from "/src/contexts/ClienteProvider";
// import { useEmpresa } from "/src/contexts/EmpresaProvider";


// export default function ConfirmationModal() {

//     const { visible, message, closeModal } = useModal();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const { datosCliente } = useCliente();
//     const { datosEmpresa } = useEmpresa();

//     const handleClose = () => {
//         closeModal();

//         // Caso cliente editando su propia clave
//         if (location.pathname === "/cliente/perfil/newpassword") {
//         navigate("/cliente/perfil");

//         // Caso desde login
//         } else if (location.pathname === "/login/newpassword") {
//         if (datosCliente) {
//             navigate("/cliente/perfil");
//         } else if (datosEmpresa) {
//             navigate("/empresa/perfil");
//         } else {
//             navigate("/login");
//         }

//         } else {
//         navigate("/login");
//         }
//     };

//     if (!visible) return null;

//     return (
//         <section className={styles.cober}>
//         <div className={styles.modal}>
//             <button className={styles.closeButton} onClick={handleClose}>
//             <img src={exitButton} alt="Cerrar modal" />
//             </button>
//             <p>{message}</p>
//         </div>
//         </section>
//     );
// }


// ConfirmationModalPrueba.jsx
import styles from "/src/style/Modal.module.css";
import exitButton from "/src/assets/Close.svg";
import { useNavigate } from "react-router-dom";

export default function ConfirmationModalPrueba() {
    const navigate = useNavigate();

    const handleClose = () => {
        // Acción de cierre de prueba
        navigate("/"); // o simplemente console.log("cerrar modal");
    };

    return (
        <section className={styles.cober}>
        <div className={styles.modal}>
            <button className={styles.closeButton} onClick={handleClose}>
            <img src={exitButton} alt="Cerrar modal" />
            </button>
            <p>Este es un mensaje de prueba para ver el estilo del modal.</p>
        </div>
        </section>
    );
}


