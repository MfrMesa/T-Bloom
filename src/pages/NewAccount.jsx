import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import formStyles from "/src/style/Form.module.css";
import loginStyles from "/src/style/LogIn.module.css";
import Button from "../components/Button";
import premiosStyles from "/src/style/PremiosEmpresa.module.css";
import { useModal } from "/src/contexts/Modal";

export default function NewAccount() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        repeatpassword: "",
        termsAccepted: false,
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, repeatpassword, email, termsAccepted, name, lastname, phone } = formData;
    const tipoUsuario = "cliente";
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!termsAccepted) {
        showModal("Debes aceptar los términos y condiciones.");
        return;
    }

    if (password !== repeatpassword) {
        showModal("Las contraseñas no coinciden.");
        return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    if (!passwordRegex.test(password)) {
        showModal("La contraseña debe tener entre 8 y 12 caracteres, al menos 1 número y 1 carácter especial.");
        return;
    }

    try {
        const res = await fetch(`/api/check-email?tipo=${tipoUsuario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
        });

        if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Fallo en check-email. ${msg}`);
        }

        const { exists } = await res.json();
        if (exists) {
        showModal("Este correo ya está registrado. Inicia sesión con tu cuenta.");
        navigate("/login");
        return;
        }

        const payload = { name, lastname, phone, email: cleanEmail, password, tipoUsuario };
        const createRes = await fetch(`/api/create-account?tipo=${tipoUsuario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        if (createRes.status === 409) {
        showModal("Este correo ya está registrado. Inicia sesión con tu cuenta.");
        navigate("/login");
        return;
        }

        if (createRes.ok) {
        showModal("Cuenta creada correctamente.");
        navigate("/login");
        } else {
        const errMsg = await createRes.text().catch(() => "");
        showModal(`Error al crear la cuenta.${errMsg ? ` Detalle: ${errMsg}` : ""}`);
        }
    } catch (error) {
        console.error("Error:", error);
        showModal("Hubo un problema de conexión con el servidor.");
    }
    };

    const fields = [
        { id: "name", label: "Nombre", placeholder: "Luis Alberto", type: "text" },
        { id: "lastname", label: "Apellidos", placeholder: "Gómez Mesa", type: "text" },
        { id: "phone", label: "Teléfono", placeholder: "+34 667 38 35 72", type: "text" },
        { id: "email", label: "Correo electrónico", placeholder: "hola@gmail.com", type: "email" },
    ];

    return (
        <section className={formStyles.formContainer}>
            <form className={formStyles.formInnerContainer} onSubmit={handleSubmit}>
                <div className={loginStyles.titulo}>
                    <h2>Crear tu cuenta</h2>
                </div>

                {fields.map(({ id, label, placeholder, type }) => (
                    <div className={formStyles.inputContainer} key={id}>
                        <label htmlFor={id}>{label}</label>
                        <input
                            id={id}
                            type={type}
                            placeholder={placeholder}
                            required
                            value={formData[id]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <div className={formStyles.inputContainer}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="8-12 caracteres, 1 número, 1 carácter especial"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className={formStyles.inputContainer}>
                    <label htmlFor="repeatpassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="repeatpassword"
                        placeholder="Repite la contraseña"
                        required
                        value={formData.repeatpassword}
                        onChange={handleChange}
                    />
                </div>

                <div className={formStyles.inputContainer}>
                    <label className={premiosStyles.customCheckbox}>
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                        />
                        <span>Acepto términos & condiciones</span>
                    </label>
                </div>

                <div className={formStyles.inputButtonContainer}>
                    <Button type="submit" variant="save" className="btnGeneric">
                        Crear cuenta
                    </Button>
                </div>

                <div className={loginStyles.links}>
                    <Link to="/login">
                        ¿Ya tienes una cuenta?{" "}
                        <span className={loginStyles.linkAccent}>Iniciar sesión</span>
                    </Link>
                </div>
            </form>
        </section>
    );
}
