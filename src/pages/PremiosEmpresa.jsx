import { useState, useEffect, Fragment } from "react";
import pen from "/src/assets/Pen.svg";
import check from "/src/assets/DobleCheck.svg";
import deleteIcon from "/src/assets/Delete.svg";
import camera from "/src/assets/Camera.svg";
import premioDefault from "/src/assets/premiologo.png";
import styles from "/src/style/PremiosEmpresa.module.css";
import style from "/src/style/Button.module.css";
import Button from "../components/Button";
import BannerEmpresa from "/src/components/BannerEmpresa";
import { useEmpresa } from "/src/contexts/EmpresaProvider";


    const createEmptyPremio = () => ({
    id: crypto.randomUUID(),
    nombre: "",
    descripcion: "",
    nivel: "light",   
    foto: null,       
    preview: null,    
    porSello: false,  
    });

    const handleImageChange = (e, id, premios, setPremios) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        setPremios(prev =>
        prev.map(p => (p.id === id ? { ...p, foto: file, preview: reader.result } : p))
        );
    };
    reader.readAsDataURL(file);
    };

    export default function PremiosEmpresa() {
    const { guardarPremios, premiosEmpresa, obtenerPremios } = useEmpresa();
    const [premios, setPremios] = useState([]);
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        obtenerPremios();
    }, []);

    useEffect(() => {
        if (premiosEmpresa?.length > 0) {
        const iniciales = premiosEmpresa.map(p => ({
            ...p,
            id: p.id || crypto.randomUUID(),
            preview: p.foto || null,
            porSello: p.porSello ?? false,
            nivel: (p.nivel || "light").toLowerCase(),
        }));
        setPremios(iniciales);
        } else {
        setPremios([createEmptyPremio()]);
        }
    }, [premiosEmpresa]);

    const agregarPremio = () => {
        const nuevo = createEmptyPremio();
        setPremios(prev => [...prev, nuevo]);
        setEditandoId(nuevo.id);
    };

    const handleTextareaInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleInputChange = (id, campo, valor) => {
        setPremios(prev => prev.map(p => (p.id === id ? { ...p, [campo]: valor } : p)));
    };

    const eliminarPremio = (id) => {
        setPremios(prev => prev.filter(p => p.id !== id));
        if (editandoId === id) setEditandoId(null);
    };

    const handleGuardar = async () => {
        try {
        const normalizados = premios.map(({ preview, ...p }) => ({
            ...p,
            nivel: p.nivel ? p.nivel[0].toUpperCase() + p.nivel.slice(1) : "Light", 
            porSello: !!p.porSello,
        }));

        await guardarPremios(normalizados);
        alert("Premios guardados correctamente");
        setEditandoId(null);
        } catch (error) {
        console.error(error);
        alert("Error al guardar los premios");
        }
    };

    const handleCancelar = () => {
    obtenerPremios();     
    setEditandoId(null);
    };

    return (
        <section className={styles.contenedorPremio}>
        <BannerEmpresa />

        {premios.map((p, idx) => (
            <Fragment key={p.id}>
            <form className={styles.innerContenedorPremio}>
                <div className={styles.nombreContainer}>
                <div className={styles.nombreInnerContainer}>
                    <label htmlFor={`nombre-${p.id}`}>Nombre del premio:</label>
                    <input
                    id={`nombre-${p.id}`}
                    type="text"
                    value={p.nombre || ""}
                    onChange={(e) => handleInputChange(p.id, "nombre", e.target.value)}
                    disabled={editandoId !== p.id}
                    />
                </div>

                <button
                    type="button"
                    className={styles.penButton}
                    onClick={() => setEditandoId(editandoId === p.id ? null : p.id)}
                >
                    <img src={editandoId === p.id ? check : pen} alt="Editar" />
                </button>

                {editandoId === p.id && (
                    <button
                    type="button"
                    className={styles.penButton}
                    onClick={() => eliminarPremio(p.id)}
                    >
                    <img src={deleteIcon} alt="Eliminar" />
                    </button>
                )}
                </div>

                <div className={styles.nombreInnerContainer}>
                <label htmlFor={`descripcion-${p.id}`}>Descripción del premio:</label>
                <textarea
                    id={`descripcion-${p.id}`}
                    value={p.descripcion || ""}
                    onChange={(e) => handleInputChange(p.id, "descripcion", e.target.value)}
                    onInput={handleTextareaInput}
                    disabled={editandoId !== p.id}
                />
                </div>

                <div className={styles.nombreInnerContainer}>
                <label>Seleccionar nivel:</label>
                <div className={styles.checkboxGroup}>
                    {["light", "spark", "flame", "aura"].map((nivel) => (
                    <label key={nivel} className={styles.customCheckbox}>
                        <input
                        type="checkbox"
                        id={`${nivel}-${p.id}`}
                        checked={p.nivel === nivel}
                        onChange={() => handleInputChange(p.id, "nivel", nivel)}
                        disabled={editandoId !== p.id}
                        />
                        <span>{nivel[0].toUpperCase() + nivel.slice(1)}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className={styles.nombreInnerContainer}>
                <label>Canje por sellos</label>
                <label className={styles.customCheckbox}>
                    <input
                    type="checkbox"
                    checked={!!p.porSello}
                    onChange={(e) => handleInputChange(p.id, "porSello", e.target.checked)}
                    disabled={editandoId !== p.id}
                    />
                    <span>Se canjea con sellos <em>(10 sellos)</em></span>
                </label>
                </div>

                <div className={styles.photoInnerContainer}>
                <label>Foto representativa:</label>
                <div>
                    <img src={p.preview || premioDefault} alt="Foto premio" />
                    <input
                    type="file"
                    accept="image/*"
                    id={`foto-${p.id}`}
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, p.id, premios, setPremios)}
                    disabled={editandoId !== p.id}
                    />
                    <button
                    type="button"
                    className={styles.photoButton}
                    onClick={() => document.getElementById(`foto-${p.id}`).click()}
                    disabled={editandoId !== p.id}
                    >
                    <img src={camera} alt="Subir" />
                    </button>
                </div>
                </div>
            </form>

            {idx !== premios.length - 1 && <span className={styles.dashedLine}></span>}
            </Fragment>
        ))}

        <button type="button" onClick={agregarPremio} className={styles.moreButton}>
            + Añadir premio
        </button>

        <div className={style.btnGroup}>
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
        </div>
        </section>
    );
}


// import { useState, useEffect, Fragment } from "react";
// import pen from "/src/assets/Pen.svg";
// import check from "/src/assets/DobleCheck.svg";
// import deleteIcon from "/src/assets/Delete.svg";
// import camera from "/src/assets/Camera.svg";
// import premioDefault from "/src/assets/premiologo.png";
// import styles from "/src/style/PremiosEmpresa.module.css";
// import style from "/src/style/Button.module.css";
// import Button from "../components/Button";
// import BannerEmpresa from "/src/components/BannerEmpresa";
// import { useEmpresa } from "/src/contexts/EmpresaProvider";


// const createEmptyPremio = () => ({
//     id: crypto.randomUUID(),
//     nombre: "",
//     descripcion: "",
//     nivel: "light",
//     foto: null,
//     preview: null,
//     porSello: false,
//     });

//     const handleImageChange = (e, id, premios, setPremios) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//         setPremios((prev) =>
//         prev.map((p) => (p.id === id ? { ...p, foto: file, preview: reader.result } : p))
//         );
//     };
//     reader.readAsDataURL(file);
//     };
//     /* ========================= */

//     export default function PremiosEmpresa() {
//     const { guardarPremios, premiosEmpresa, obtenerPremios } = useEmpresa();
//     const [premios, setPremios] = useState([]);
//     const [editandoId, setEditandoId] = useState(null);

//     useEffect(() => {
//         obtenerPremios();
//     }, []);

//     useEffect(() => {
//         if (premiosEmpresa?.length > 0) {
//         const iniciales = premiosEmpresa.map((p) => ({
//             ...p,
//             id: p.id || crypto.randomUUID(),
//             preview: p.foto || null,
//             porSello: p.porSello ?? false,
//             nivel: (p.nivel || "light").toLowerCase(),
//         }));
//         setPremios(iniciales);
//         } else {
//         setPremios([createEmptyPremio()]);
//         }
//     }, [premiosEmpresa]);

//     const agregarPremio = () => {
//         const nuevo = createEmptyPremio();
//         setPremios((prev) => [...prev, nuevo]);
//         setEditandoId(nuevo.id);
//     };

//     const handleTextareaInput = (e) => {
//         e.target.style.height = "auto";
//         e.target.style.height = `${e.target.scrollHeight}px`;
//     };

//     const handleInputChange = (id, campo, valor) => {
//         setPremios((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
//     };

//     const eliminarPremio = (id) => {
//         setPremios((prev) => prev.filter((p) => p.id !== id));
//         if (editandoId === id) setEditandoId(null);
//     };

//     const handleGuardar = async () => {
//         try {
//         const normalizados = premios.map(({ preview, ...p }) => ({
//             ...p,
//             nivel: p.nivel ? p.nivel[0].toUpperCase() + p.nivel.slice(1) : "Light",
//             porSello: !!p.porSello,
//         }));

//         await guardarPremios(normalizados);
//         alert("Premios guardados correctamente");
//         setEditandoId(null);
//         } catch (error) {
//         console.error(error);
//         alert("Error al guardar los premios");
//         }
//     };

//     const handleCancelar = () => {
//         obtenerPremios();
//         setEditandoId(null);
//     };

//     return (
//         <section className={styles.contenedorPremio}>
//         <BannerEmpresa />

//         {premios.map((p, idx) => (
//             <Fragment key={p.id}>
//             <form className={styles.innerContenedorPremio}>
//                 <div className={styles.nombreContainer}>
//                 <div className={styles.nombreInnerContainer}>
//                     <label htmlFor={`nombre-${p.id}`}>Nombre del premio:</label>
//                     <input
//                     id={`nombre-${p.id}`}
//                     type="text"
//                     value={p.nombre || ""}
//                     onChange={(e) => handleInputChange(p.id, "nombre", e.target.value)}
//                     disabled={editandoId !== p.id}
//                     />
//                 </div>

//                 <button
//                     type="button"
//                     className={styles.penButton}
//                     onClick={() => setEditandoId(editandoId === p.id ? null : p.id)}
//                 >
//                     <img src={editandoId === p.id ? check : pen} alt="Editar" />
//                 </button>

//                 {editandoId === p.id && (
//                     <button
//                     type="button"
//                     className={styles.penButton}
//                     onClick={() => eliminarPremio(p.id)}
//                     >
//                     <img src={deleteIcon} alt="Eliminar" />
//                     </button>
//                 )}
//                 </div>

//                 <div className={styles.nombreInnerContainer}>
//                 <label htmlFor={`descripcion-${p.id}`}>Descripción del premio:</label>
//                 <textarea
//                     id={`descripcion-${p.id}`}
//                     value={p.descripcion || ""}
//                     onChange={(e) => handleInputChange(p.id, "descripcion", e.target.value)}
//                     onInput={handleTextareaInput}
//                     disabled={editandoId !== p.id}
//                 />
//                 </div>

//                 <div className={styles.nombreInnerContainer}>
//                 <label>Seleccionar nivel:</label>
//                 <div className={styles.checkboxGroup}>
//                     {["light", "spark", "flame", "aura"].map((nivel) => (
//                     <label key={nivel} className={styles.customCheckbox}>
//                         <input
//                         type="checkbox"
//                         id={`${nivel}-${p.id}`}
//                         checked={p.nivel === nivel}
//                         onChange={() => handleInputChange(p.id, "nivel", nivel)}
//                         disabled={editandoId !== p.id}
//                         />
//                         <span>{nivel[0].toUpperCase() + nivel.slice(1)}</span>
//                     </label>
//                     ))}
//                 </div>
//                 </div>

//                 <div className={styles.nombreInnerContainer}>
//                 <label>Canje por sellos</label>
//                 <label className={styles.customCheckbox}>
//                     <input
//                     type="checkbox"
//                     checked={!!p.porSello}
//                     onChange={(e) => handleInputChange(p.id, "porSello", e.target.checked)}
//                     disabled={editandoId !== p.id}
//                     />
//                     <span>Se canjea con sellos <em>(10 sellos)</em></span>
//                 </label>
//                 </div>

//                 <div className={styles.photoInnerContainer}>
//                 <label>Foto representativa:</label>
//                 <div>
//                     <img src={p.preview || premioDefault} alt="Foto premio" />
//                     <input
//                     type="file"
//                     accept="image/*"
//                     id={`foto-${p.id}`}
//                     style={{ display: "none" }}
//                     onChange={(e) => handleImageChange(e, p.id, premios, setPremios)}
//                     disabled={editandoId !== p.id}
//                     />
//                     <button
//                     type="button"
//                     className={styles.photoButton}
//                     onClick={() => document.getElementById(`foto-${p.id}`).click()}
//                     disabled={editandoId !== p.id}
//                     >
//                     <img src={camera} alt="Subir" />
//                     </button>
//                 </div>
//                 </div>
//             </form>

//             {idx !== premios.length - 1 && <span className={styles.dashedLine}></span>}
//             </Fragment>
//         ))}

//         <button type="button" onClick={agregarPremio} className={styles.moreButton}>
//             + Añadir premio
//         </button>

//         <div className={style.btnGroup}>
//             <Button
//             type="button"
//             variant="cancel"
//             className="btnBase btnCancel"
//             onClick={handleCancelar}
//             >
//             cancelar
//             </Button>

//             <Button
//             type="button"
//             variant="save"
//             className="btnBase btnSave"
//             onClick={handleGuardar}
//             >
//             guardar
//             </Button>
//         </div>
//         </section>
//     );
// }
