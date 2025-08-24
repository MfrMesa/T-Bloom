import { useState } from "react";
import Button from "../components/Button";
import styles from "/src/style/LogIn.module.css";
import { useModal } from "/src/contexts/Modal";

const MIN_LOADING_MS = 1500;
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export default function GetPassword() {
    const { showModal } = useModal();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidEmail || loading) return;

        setLoading(true);
        try {
        const req = fetch("/api/password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        await Promise.all([req, wait(MIN_LOADING_MS)]);
        setEmail("");
        setLoading(false);

        // ⬇️ al cerrar el modal, redirige a /login
        showModal(
            "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisa tu bandeja de entrada y spam.",
            { redirectTo: "/login", title: "Correo enviado" }
        );
        } catch (err) {
        console.error(err);
        await wait(MIN_LOADING_MS);
        setLoading(false);
        showModal(
            "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisa tu bandeja de entrada y spam.",
            { redirectTo: "/login", title: "Correo enviado" }
        );
        }
    };

    return (
        <section className={styles.container}>
        <form className={styles.formPassword} onSubmit={handleSubmit}>
            <div>
            <h2>Reestablecer contraseña</h2>
            <p>Introduzca la dirección de correo electrónico asociada a su cuenta de T-Bloom.</p>
            </div>

            <div className={styles.inputWrapper}>
            <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={email && !isValidEmail ? "true" : "false"}
            />
            <label htmlFor="email">Correo electrónico</label>
            </div>

            <Button
            type="submit"
            variant="save"
            className="btnGeneric"
            disabled={!isValidEmail || loading}
            aria-busy={loading ? "true" : "false"}
            >
            {loading ? "Enviando…" : "Enviar enlace"}
            </Button>
        </form>
        </section>
    );
}


// import { useState } from "react";
// import Button from "../components/Button";
// import styles from "/src/style/LogIn.module.css";
// import { useModal } from "/src/contexts/Modal";

// const MIN_LOADING_MS = 1500;
// const wait = (ms) => new Promise(r => setTimeout(r, ms));

// export default function GetPassword() {
//     const { showModal } = useModal();
//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false);

//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!isValidEmail || loading) return;

//         setLoading(true);

//         try {
//             const req = fetch("/api/password-reset", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email }),
//             });

//             await Promise.all([req, wait(MIN_LOADING_MS)]);
//             setEmail("");
//             setLoading(false);

//             showModal(
//                 "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisa tu bandeja de entrada y spam.",
//                 {
//                     redirectTo: "/login",
//                     title: "Correo enviado"
//                 }
//             );
//         } catch (err) {
//             console.error(err);
//             await wait(MIN_LOADING_MS);
//             setLoading(false);

//             showModal(
//                 "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisa tu bandeja de entrada y spam.",
//                 {
//                     redirectTo: "/login",
//                     title: "Correo enviado"
//                 }
//             );
//         }
//     };

//     return (
//         <section className={styles.container}>
//             <form className={styles.formPassword} onSubmit={handleSubmit}>
//                 <div>
//                     <h2>Reestablecer contraseña</h2>
//                     <p>Introduzca la dirección de correo electrónico asociada a su cuenta de T‑Bloom.</p>
//                 </div>

//                 <div className={styles.inputWrapper}>
//                     <input
//                         type="email"
//                         id="email"
//                         placeholder=" "
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         aria-invalid={email && !isValidEmail ? "true" : "false"}
//                     />
//                     <label htmlFor="email">Correo electrónico</label>
//                 </div>

//                 <Button
//                     type="submit"
//                     variant="save"
//                     className="btnGeneric"
//                     disabled={!isValidEmail || loading}
//                     aria-busy={loading ? "true" : "false"}
//                 >
//                     {loading ? "Enviando…" : "Enviar enlace"}
//                 </Button>
//             </form>
//         </section>
//     );
// }
