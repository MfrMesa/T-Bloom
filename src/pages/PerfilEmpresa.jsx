import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmpresa } from "/src/contexts/EmpresaProvider";
import formStyles from "/src/style/Form.module.css";
import styles from "/src/style/PremiosEmpresa.module.css";
import Button from "../components/Button";
import pen from "/src/assets/Pen.svg";
import check from "/src/assets/DobleCheck.svg";
import placeholderLogo from "/src/assets/PlaceholderLogo.png";
import camera from "/src/assets/Camera.svg";
import style from "/src/style/Button.module.css";


export default function PerfilEmpresa() {
    const navigate = useNavigate();
    const { datosEmpresa, guardarPerfil } = useEmpresa();

    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [editSection, setEditSection] = useState(null);
    const [formData, setFormData] = useState({
        company: "",
        store: "",
        direccionLocal: "",
        country: "",
        state: "",
        postalCode: "",
        name: "",
        lastname: "",
        identity: "",
        email: "",
        instagram: "",
        web: "",
        phone: "",
        password: "",
        repeatpassword: "",
    });

    // snapshot para poder cancelar
    const [snapshot, setSnapshot] = useState(null);

    useEffect(() => {
        if (datosEmpresa) {
        setFormData(prev => ({
            ...prev,
            ...datosEmpresa,
        }));
        }
    }, [datosEmpresa]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setFotoPerfil(file);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Submit del form (por si se presiona Enter)
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleGuardar();
    };

    // ⬇️ Comienza edición de una sección guardando snapshot
    const startEdit = (title) => {
        if (editSection === title) {
        setEditSection(null);
        return;
        }
        setSnapshot(formData);     // guarda estado actual
        setEditSection(title);
    };

    // ⬇️ Guardar (misma validación que antes)
    const handleGuardar = async () => {
        const { password, repeatpassword } = formData;

        if (password && password !== repeatpassword) {
        alert("Las contraseñas no coinciden.");
        return;
        }

        if (
        password &&
        !/^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/.test(password)
        ) {
        alert("La contraseña debe tener entre 8 y 12 caracteres, al menos 1 número y 1 carácter especial.");
        return;
        }

        try {
        await guardarPerfil(formData, fotoPerfil);
        alert("Perfil actualizado correctamente.");
        setEditSection(null);
        setSnapshot(null);
        // navega si corresponde
        navigate("/empresa");
        } catch (error) {
        alert("Error al actualizar perfil.");
        }
    };

    // ⬇️ Cancelar: vuelve al snapshot y limpia cambios temporales
    const handleCancelar = () => {
        if (snapshot) {
        setFormData(snapshot);
        } else if (datosEmpresa) {
        setFormData(prev => ({ ...prev, ...datosEmpresa }));
        }
        setFotoPerfil(null);   // descarta foto seleccionada sin guardar
        setEditSection(null);
        setSnapshot(null);
    };

    const fieldSections = [
        {
        title: "Información general",
        fields: [
            { id: "company", label: "Nombre Empresa/Franquicia:", type: "text" },
            { id: "store", label: "Nombre Local:", type: "text" },
            { id: "direccionLocal", label: "Dirección de establecimiento:", type: "text" },
            { id: "country", label: "País:", type: "text" },
            { id: "state", label: "Provincia:", type: "text" },
            { id: "postalCode", label: "Código Postal:", type: "text" },
        ],
        },
        {
        title: "Datos del administrador",
        fields: [
            { id: "name", label: "Nombre administrador:", type: "text" },
            { id: "lastname", label: "Apellidos administrador:", type: "text" },
            { id: "identity", label: "NIF (Documento de identidad fiscal):", type: "text" },
        ],
        },
        {
        title: "Datos de contacto",
        fields: [
            { id: "email", label: "Correo electrónico:", type: "email" },
            { id: "phone", label: "Teléfono:", type: "text" },
            { id: "instagram", label: "Instagram:", type: "text" },
            { id: "web", label: "Página web:", type: "text" },
        ],
        },
        {
        title: "Seguridad",
        fields: [
            { id: "password", label: "Contraseña:", type: "password", placeholder: "8-12 caracteres, 1 número, 1 carácter especial" },
            { id: "repeatpassword", label: "Confirmar contraseña:", type: "password", placeholder: "8-12 caracteres, 1 número, 1 carácter especial" },
        ],
        },
    ];

    return (
        <section className={formStyles.formContainer}>
        <form
            className={`${formStyles.formInnerContainer} ${formStyles.perfilEmpresa}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.contenedorTitulo}>
            <h3>Perfil</h3>
            <div>
                <img
                src={fotoPerfil ? URL.createObjectURL(fotoPerfil) : (datosEmpresa?.logo || placeholderLogo)}
                alt="Foto perfil"
                className={styles.logoPhoto}
                />
                <input
                type="file"
                accept="image/*"
                id="foto-perfil"
                style={{ display: "none" }}
                onChange={handleFotoChange}
                />
                <button
                type="button"
                className={styles.photoPerfilButton}
                onClick={() => document.getElementById("foto-perfil").click()}
                >
                <img src={camera} alt="Subir foto" />
                </button>
            </div>
            </div>

            {fieldSections.map(({ title, fields }) => (
            <div key={title} className={formStyles.sectionBlock}>
                <div className={formStyles.sectionHeader}>
                <h3>{title}</h3>
                <button
                    type="button"
                    className={formStyles.penButton}
                    onClick={() => startEdit(title)}
                >
                    <img src={editSection === title ? check : pen} alt="Editar" />
                </button>
                </div>

                {fields.map(({ id, label, type, placeholder }) => (
                <div className={formStyles.inputContainer} key={id}>
                    <label htmlFor={id}>{label}</label>
                    <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required
                    disabled={!editSection || editSection !== title}
                    value={formData[id] || ""}
                    onChange={handleChange}
                    />
                </div>
                ))}
            </div>
            ))}

            {editSection && (
            <section className={style.btnGroup}>
                <Button
                type="button"
                variant="cancel"
                className="btnBase btnCancel"
                onClick={handleCancelar}
                >
                cancelar
                </Button>

                <Button
                type="button"
                variant="save"
                className="btnBase btnSave"
                onClick={handleGuardar}
                >
                guardar
                </Button>
            </section>
            )}
        </form>
        </section>
    );
}
