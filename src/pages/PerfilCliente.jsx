import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEmpresa } from "/src/contexts/EmpresaProvider";
import { useModal } from "/src/contexts/Modal";            
import formStyles from "/src/style/Form.module.css";
import Button from "../components/Button";
import pen from "/src/assets/Pen.svg";
import check from "/src/assets/DobleCheck.svg";
import BannerEmpresa from "../components/BannerEmpresa";
import PointLoader from "../components/PointLoader";
import chevron from "/src/assets/Chevron.svg";

export default function PerfilCliente() {
    const navigate = useNavigate();
    const { showModal } = useModal();                              
    const { datosCliente, guardarPerfilCliente } = useEmpresa();

    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [editSection, setEditSection] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        fechaNacimiento: "",
        email: "",
        phone: "",
        password: "",
        repeatpassword: "",
    });

    useEffect(() => {
        if (datosCliente) {
            setFormData(prev => ({ ...prev, ...datosCliente }));
        }
    }, [datosCliente]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setFotoPerfil(file);
    };

    const handleEliminarCuenta = () => {
        showModal("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.", {
            closeOnOutsideClick: false,
            redirectTo: "/goodbye",
            confirm: {
                confirmText: "Confirmar",
                workingText: "Eliminando…",
                cancelText: "Cancelar",
                onConfirm: async () => {
                    // await eliminarCuenta(); // si se implementa en el provider
                },
            },
        });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            await guardarPerfilCliente(formData, fotoPerfil);
            alert("Perfil actualizado correctamente.");
            setEditSection(null);
        } catch (error) {
            alert("Error al actualizar perfil.");
        }
    };

    const fieldSections = [
        {
            title: "Información general",
            fields: [
                { id: "name", label: "Nombre:", type: "text" },
                { id: "lastname", label: "Apellidos:", type: "text" },
                { id: "fechaNacimiento", label: "Fecha de Nacimiento:", type: "text" },
            ],
        },
        {
            title: "Datos de contacto",
            fields: [
                { id: "email", label: "Correo electrónico:", type: "email" },
                { id: "phone", label: "Teléfono:", type: "text" },
            ],
        },
    ];

    return (
        <section className={formStyles.formContainer}>
            <form className={formStyles.formInnerContainer} onSubmit={handleSubmit}>
                <BannerEmpresa />

                <div className={formStyles.tituloNivel}>
                    <h3>Nivel</h3>
                    <PointLoader />
                </div>

                {fieldSections.map(({ title, fields }) => (
                    <div key={title} className={formStyles.sectionBlock}>
                        <div className={formStyles.sectionHeader}>
                            <h3>{title}</h3>
                            <button
                                type="button"
                                className={formStyles.penButton}
                                onClick={() =>
                                    setEditSection(editSection === title ? null : title)
                                }
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
                    <div className={formStyles.inputButtonContainer}>
                        <Button type="submit" variant="save" className="btnSave">
                            guardar
                        </Button>
                        <Button
                            type="button"
                            variant="cancel"
                            className="btnCancel"
                            onClick={() => setEditSection(null)}
                        >
                            cancelar
                        </Button>
                    </div>
                )}

                <section className={formStyles.buttonsContenedor}>
                    <div className={formStyles.buttons}>
                        <h3>Seguridad</h3>
                        <Link className={formStyles.linkButtons} to="newpassword">
                            Cambiar contraseña
                            <img src={chevron} alt="" />
                        </Link>
                    </div>

                    <div className={formStyles.buttons}>
                        <h3>Locales</h3>
                        <Link className={formStyles.linkButtons} to="/cliente/recompensas">
                            Recompensas
                            <img src={chevron} alt="" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        className={formStyles.deleteButtons}
                        // onClick={handleLogout}
                    >
                        <p className={formStyles.closeSession}>Cerrar sesión</p>
                        <img src={chevron} alt="" />
                    </button>

                    <button
                        type="button"
                        className={formStyles.deleteButtons}
                        onClick={handleEliminarCuenta}
                    >
                        <p className={formStyles.deleteSession}>Eliminar cuenta</p>
                        <img src={chevron} alt="" />
                    </button>
                </section>
            </form>
        </section>
    );
}



