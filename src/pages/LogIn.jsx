// import Button from "../components/Button.jsx";
// import styles from "/src/style/LogIn.module.css";
// import premiosStyles from "/src/style/PremiosEmpresa.module.css"; import { useState } from "react";
// import EyeClosed from "/src/assets/EyeClosed.svg";
// import EyeOpen from "/src/assets/EyeOpen.svg";
// import { Link } from "react-router-dom";



// export default function LogIn(){
//     const [showPassword, setShowPassword] = useState(false);
//     const [remember, setRemember] = useState(false); 

//     const handleLogin = (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         if (!email || !password) {
//         alert("Por favor completa todos los campos.");
//         return;
//         }

//         console.log("Iniciando sesión con:", { email, password, remember });
//     };

//     return (
//         <section className={styles.container}>
//         <h2>Bienvenido de nuevo</h2>
//         <form className={styles.form} onSubmit={handleLogin}>
//             <div className={styles.inputsContainer}>
//             <div className={styles.inputWrapper}>
//                 <input type="email" id="email" placeholder=" " required />
//                 <label htmlFor="email">Correo electrónico</label>
//             </div>

//             <div className={styles.inputWrapper}>
//                 <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 placeholder=" "
//                 required
//                 />
//                 <label htmlFor="password">Contraseña</label>
//                 <img
//                 src={showPassword ? EyeOpen : EyeClosed}
//                 alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
//                 className={styles.eyeIcon}
//                 onClick={() => setShowPassword(!showPassword)}
//                 />
//             </div>

//             <label className={premiosStyles.customCheckbox}>
//                 <input
//                 type="checkbox"
//                 id="remember"
//                 checked={remember}
//                 onChange={(e) => setRemember(e.target.checked)}
//                 />
//                 <span>Recordarme</span>
//             </label>
//             </div>

//             <div className={styles.links}>
//             <Link to="/login/newpassword">¿Has olvidado tu contraseña?</Link>
//             <Link to="/login/newaccount">
//                 ¿No tienes una cuenta? <span className={styles.linkAccent}>Suscribete</span>
//             </Link>
//             </div>

//             <Button type="submit" variant="save" className="btnGeneric">
//             iniciar sesión
//             </Button>
//         </form>
//         </section>
//     );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import styles from "/src/style/LogIn.module.css";
import premiosStyles from "/src/style/PremiosEmpresa.module.css";
import EyeClosed from "/src/assets/EyeClosed.svg";
import EyeOpen from "/src/assets/EyeOpen.svg";
import { useModal } from "/src/contexts/Modal";

export default function LogIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showModal } = useModal();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        console.log({ email, password, remember });
        if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
        }

        try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/cliente/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password}),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data?.message || "Error al iniciar sesión.");
            return;
        }

        // Guarda el token dependiendo del checkbox "Recordarme"
        if (remember) {
            localStorage.setItem("tokenEmpresa", data.token); 
        } else {
            sessionStorage.setItem("tokenEmpresa", data.token); 
        }

        // Redirección basada en rol
        if (data.tipo === "cliente") {
            navigate("/cliente/locales");
        } else if (data.tipo === "empresa") {
            navigate("/panel");
        } else {
            navigate("/"); 
        }

        showModal("Inicio de sesión exitoso");

        } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema de conexión con el servidor.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <section className={styles.container}>
        <h2>Bienvenido de nuevo</h2>
        <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputsContainer}>
            <div className={styles.inputWrapper}>
                <input type="email" id="email" placeholder=" " required />
                <label htmlFor="email">Correo electrónico</label>
            </div>

            <div className={styles.inputWrapper}>
                <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                required
                />
                <label htmlFor="password">Contraseña</label>
                <img
                src={showPassword ? EyeOpen : EyeClosed}
                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
                />
            </div>

            <label className={premiosStyles.customCheckbox}>
                <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Recordarme</span>
            </label>
            </div>

            <div className={styles.links}>
            <Link to="/login/newpassword">¿Has olvidado tu contraseña?</Link>
            <Link to="/login/newaccount">
                ¿No tienes una cuenta?{" "}
                <span className={styles.linkAccent}>Suscribete</span>
            </Link>
            </div>

            <Button type="submit" variant="save" className="btnGeneric" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
        </form>
        </section>
    );
}
