import { useState } from "react";
import styles from "/src/style/LogIn.module.css"
import EyeClosed from "/src/assets/EyeClosed.svg"
import EyeOpen from "/src/assets/EyeOpen.svg"
import Button from "../components/Button";
import { useModal } from "/src/contexts/Modal";



export default function NewPassword(){

    const [showPassword, setShowPassword] = useState(false);
    const { showModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const password = document.getElementById("newpassword").value;
        const repeat = document.getElementById("repeatpassword").value;
        
        if (password !== repeat) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        
        if (!/^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/.test(password)) {
            alert("La contraseña debe tener entre 8 y 12 caracteres, al menos 1 número y 1 carácter especial.");
            return;
        }
        
        try {
            const response = await fetch("/api/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });
        
        if (response.ok) {
            showModal("Su contraseña ha sido cambiada correctamente");
            // Aquí puedes redirigir o cerrar modal, etc.
        } else {
            alert("Error al actualizar la contraseña.");
        }
        } catch (error) {
        console.error("Error al enviar la nueva contraseña:", error);
        alert("Hubo un problema con la conexión al servidor.");
        }
    };
    

    return(
        <section className={styles.container}>
            <div className={styles.containerTitulo}>
                <h2>Cambiar contraseña</h2>
                <p>Protege tu cuenta con una contraseña única de 8-12 caracteres, 1 número y 1 carácter especial.</p>
            </div>
            <form onSubmit={handleSubmit}  className={styles.inputOuterWrapper}>
                <div className={styles.inputWrapper}>
                    <input
                    type={showPassword ? 'text' : 'password'}
                    id="newpassword"
                    placeholder=" "
                    required
                    />
                    <label htmlFor="newpassword">Nueva contraseña</label>
                    <img
                    src={showPassword ? EyeOpen : EyeClosed}
                    alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <input
                    type={showPassword ? 'text' : 'password'}
                    id="repeatpassword"
                    placeholder=" "
                    required
                    />
                    <label htmlFor="repeatpassword">Repetir contraseña</label>
                    <img
                    src={showPassword ? EyeOpen : EyeClosed}
                    alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <Button
                type="submit"
                variant="save"
                className="btnSave"
                >
                cambiar contraseña               
                </Button>
            </form>
        </section>
    )

}

// import { useState } from "react";
// import styles from "/src/style/LogIn.module.css";
// import EyeClosed from "/src/assets/EyeClosed.svg";
// import EyeOpen from "/src/assets/EyeOpen.svg";
// import Button from "../components/Button";
// import { useModal } from "/src/contexts/Modal";

// export default function NewPassword() {
//     const [showPassword, setShowPassword] = useState(false);
//     const { showModal } = useModal();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const password = document.getElementById("newpassword").value;
//         const repeat = document.getElementById("repeatpassword").value;

//         if (password !== repeat) {
//             alert("Las contraseñas no coinciden.");
//             return;
//         }

//         if (!/^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/.test(password)) {
//             alert("La contraseña debe tener entre 8 y 12 caracteres, al menos 1 número y 1 carácter especial.");
//             return;
//         }

//         try {
//             const token =
//                 localStorage.getItem("tokenCliente") || localStorage.getItem("tokenEmpresa");

//             const response = await fetch("/api/update-password", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token && { Authorization: `Bearer ${token}` }),
//                 },
//                 credentials: "include",
//                 body: JSON.stringify({ password }),
//             });

//             if (response.ok) {
//                 showModal("Su contraseña ha sido cambiada correctamente");
//             } else {
//                 alert("Error al actualizar la contraseña.");
//             }
//         } catch (error) {
//             console.error("Error al enviar la nueva contraseña:", error);
//             alert("Hubo un problema con la conexión al servidor.");
//         }
//     };

//     return (
//         <section className={styles.container}>
//             <div className={styles.containerTitulo}>
//                 <h2>Cambiar contraseña</h2>
//                 <p>
//                     Protege tu cuenta con una contraseña única de 8-12 caracteres, 1 número y 1
//                     carácter especial.
//                 </p>
//             </div>
//             <form onSubmit={handleSubmit} className={styles.inputOuterWrapper}>
//                 <div className={styles.inputWrapper}>
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         id="newpassword"
//                         placeholder=" "
//                         required
//                     />
//                     <label htmlFor="newpassword">Nueva contraseña</label>
//                     <img
//                         src={showPassword ? EyeOpen : EyeClosed}
//                         alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//                         className={styles.eyeIcon}
//                         onClick={() => setShowPassword(!showPassword)}
//                     />
//                 </div>
//                 <div className={styles.inputWrapper}>
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         id="repeatpassword"
//                         placeholder=" "
//                         required
//                     />
//                     <label htmlFor="repeatpassword">Repetir contraseña</label>
//                     <img
//                         src={showPassword ? EyeOpen : EyeClosed}
//                         alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//                         className={styles.eyeIcon}
//                         onClick={() => setShowPassword(!showPassword)}
//                     />
//                 </div>
//                 <Button type="submit" variant="save" className="btnSave">
//                     cambiar contraseña
//                 </Button>
//             </form>
//         </section>
//     );
// }
