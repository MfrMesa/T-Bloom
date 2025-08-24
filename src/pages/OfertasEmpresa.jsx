import { useState, useEffect, Fragment } from "react";
import styles from "/src/style/OfertasEmpresa.module.css";
import pen from "/src/assets/Pen.svg";
import camera from "/src/assets/Camera.svg";
import ofertaPlaceholder from "/src/assets/ofertalogo.png";
import deleteIcon from "/src/assets/Delete.svg";
import Button from "../components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "/src/index.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import BannerEmpresa from "/src/components/BannerEmpresa";
import { useEmpresa } from "/src/contexts/EmpresaProvider";
import { useModal } from "/src/contexts/Modal";
import style from "/src/style/Button.module.css";

registerLocale("es", es);

export default function OfertasEmpresa() {
    const { guardarOfertas, obtenerOfertas } = useEmpresa();
    const { showModal } = useModal();

    const [ofertas, setOfertas] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [snapshot, setSnapshot] = useState(null);
    const [confirmarEliminar, setConfirmarEliminar] = useState(null);

    useEffect(() => {
        const cargarOfertas = async () => {
            try {
                const existentes = await obtenerOfertas(); // <-- debe existir en tu Provider
                const formateadas = existentes.map(oferta => ({
                    ...oferta,
                    preview: oferta.fotoURL || null, // ajusta si tienes nombre diferente
                    foto: null
                }));
                setOfertas(formateadas);
            } catch (error) {
                console.error("Error al cargar ofertas:", error);
            }
        };
        cargarOfertas();
    }, []);

    const handleInputChange = (id, field, value) => {
        setOfertas(prev =>
            prev.map(oferta =>
                oferta.id === id ? { ...oferta, [field]: value } : oferta
            )
        );
    };

    const handleImageChange = (id, file) => {
        const preview = URL.createObjectURL(file);
        setOfertas(prev =>
            prev.map(oferta =>
                oferta.id === id ? { ...oferta, foto: file, preview } : oferta
            )
        );
    };

    const agregarOferta = () => {
        const nuevoId = crypto.randomUUID();
        setSnapshot(ofertas.map(o => ({ ...o })));
        setOfertas(prev => [
            ...prev,
            {
                id: nuevoId,
                nombre: "",
                descripcion: "",
                precio: "",
                descuento: "",
                fecha: "",
                foto: null,
                preview: null,
            },
        ]);
        setEditandoId(nuevoId);
    };

    const confirmarEliminarOferta = (id) => {
        setConfirmarEliminar(id);
    };

    const eliminarOferta = () => {
        setOfertas(prev => prev.filter(oferta => oferta.id !== confirmarEliminar));
        setConfirmarEliminar(null);
    };

    const handleGuardar = async () => {
        try {
            await guardarOfertas(ofertas);
            showModal("Ofertas guardadas con éxito.");
            setEditandoId(null);
            setSnapshot(null);
        } catch (error) {
            showModal("Error al guardar una oferta.");
            console.error(error);
        }
    };

    const handleCancelar = () => {
        if (snapshot) {
            setOfertas(snapshot);
        }
        setEditandoId(null);
        setSnapshot(null);
    };

    const handleTextareaInput = e => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <section>
            <BannerEmpresa />

            {ofertas.map((oferta, idx) => (
                <Fragment key={oferta.id}>
                    <form className={styles.ofertasContainer}>
                        <div className={styles.innerContainer}>
                            <div className={styles.ofertaItemsContainer}>
                                <label htmlFor={`nombre-${oferta.id}`}>Nombre:</label>
                                <input
                                    type="text"
                                    required
                                    id={`nombre-${oferta.id}`}
                                    value={oferta.nombre}
                                    onChange={e => handleInputChange(oferta.id, "nombre", e.target.value)}
                                    disabled={editandoId !== oferta.id}
                                />
                            </div>
                            <div className={styles.ofertaItemsContainer}>
                                <label htmlFor={`descripcion-${oferta.id}`}>Descripción:</label>
                                <textarea
                                    required
                                    id={`descripcion-${oferta.id}`}
                                    value={oferta.descripcion}
                                    onChange={e => handleInputChange(oferta.id, "descripcion", e.target.value)}
                                    disabled={editandoId !== oferta.id}
                                    onInput={handleTextareaInput}
                                />
                            </div>
                            <div className={styles.costoContainer}>
                                <div className={styles.ofertaItemsContainer}>
                                    <label htmlFor={`precio-${oferta.id}`}>Precio:</label>
                                    <div className={styles.inputWithIcon}>
                                        <input
                                            required
                                            type="number"
                                            id={`precio-${oferta.id}`}
                                            value={oferta.precio}
                                            onChange={e => handleInputChange(oferta.id, "precio", e.target.value)}
                                            disabled={editandoId !== oferta.id}
                                        />
                                        <span className={styles.euroSymbol}>€</span>
                                    </div>
                                </div>
                                <div className={styles.ofertaItemsContainer}>
                                    <label htmlFor={`descuento-${oferta.id}`}>Descuento:</label>
                                    <input
                                        required
                                        type="number"
                                        id={`descuento-${oferta.id}`}
                                        value={oferta.descuento}
                                        onChange={e => handleInputChange(oferta.id, "descuento", e.target.value)}
                                        disabled={editandoId !== oferta.id}
                                    />
                                </div>
                            </div>
                            <div className={styles.ofertaItemsContainer}>
                                <label htmlFor={`foto-${oferta.id}`}>Foto representativa:</label>
                                <div className={styles.imagePreview}>
                                    {oferta.preview ? (
                                        <img src={oferta.preview} alt="Vista previa" />
                                    ) : (
                                        <img src={ofertaPlaceholder} alt="Vista previa" className={styles.imagePlaceholder} />
                                    )}
                                </div>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    id={`foto-${oferta.id}`}
                                    style={{ display: "none" }}
                                    onChange={e => handleImageChange(oferta.id, e.target.files[0])}
                                    disabled={editandoId !== oferta.id}
                                />
                                <button
                                    className={styles.buttonCamera}
                                    type="button"
                                    onClick={() => document.getElementById(`foto-${oferta.id}`).click()}
                                    disabled={editandoId !== oferta.id}
                                >
                                    <img src={camera} alt="cambiar foto" />
                                </button>
                            </div>
                            <div className={styles.ofertaItemsContainer}>
                                <label htmlFor={`fecha-${oferta.id}`}>Fecha de vencimiento:</label>
                                <DatePicker
                                    locale="es"
                                    id={`fecha-${oferta.id}`}
                                    selected={oferta.fecha ? new Date(oferta.fecha) : null}
                                    onChange={(date) =>
                                        handleInputChange(oferta.id, "fecha", date.toISOString().split("T")[0])
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Selecciona una fecha"
                                    disabled={editandoId !== oferta.id}
                                    className={styles.datePickerInput}
                                    popperPlacement="bottom"
                                    showPopperArrow={false}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.accionesOferta}>
                            <img
                                src={deleteIcon}
                                alt="Eliminar"
                                style={{ cursor: "pointer" }}
                                onClick={() => confirmarEliminarOferta(oferta.id)}
                            />
                            {editandoId !== oferta.id && (
                                <img
                                    src={pen}
                                    alt="Editar"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setSnapshot(ofertas.map(o => ({ ...o })));
                                        setEditandoId(oferta.id);
                                    }}
                                />
                            )}
                        </div>
                    </form>
                    {idx !== ofertas.length - 1 && <span className={styles.dashedLine}></span>}
                </Fragment>
            ))}

            <button type="button" onClick={agregarOferta} className={styles.moreButton}>
                + Añadir premio
            </button>

            {editandoId && (
                <section className={style.btnGroup}>
                    <Button type="button" variant="cancel" className="btnBase btnCancel" onClick={handleCancelar}>
                        cancelar
                    </Button>
                    <Button type="button" variant="save" className="btnBase btnSave" onClick={handleGuardar}>
                        guardar
                    </Button>
                </section>
            )}
        </section>
    );
}
