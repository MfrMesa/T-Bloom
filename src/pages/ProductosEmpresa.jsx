import { useEffect, useState } from "react";
import deleteIcon from "/src/assets/Delete.svg";
import pen from "/src/assets/Pen.svg";
import Button from "../components/Button";
import formStyles from "/src/style/ProductosEmpresa.module.css";
import styles from "/src/style/PremiosEmpresa.module.css"; 
import BannerEmpresa from "/src/components/BannerEmpresa";
import { useEmpresa } from "/src/contexts/EmpresaProvider";
import style from "/src/style/Button.module.css"; 


export default function ProductosEmpresa() {
    const { productosEmpresa, obtenerProductos, guardarProductos } = useEmpresa();

    const createProductoVacio = () => ({
        id: crypto.randomUUID(),
        nombre: "",
        precio: "",
    });

    const [productos, setProductos] = useState([]);
    const [editSection, setEditSection] = useState(null);
    const [snapshot, setSnapshot] = useState(null); // ← para cancelar

    useEffect(() => {
        obtenerProductos();
    }, []);

    useEffect(() => {
        if (productosEmpresa && productosEmpresa.length > 0) {
        setProductos(
            productosEmpresa.map((p) => ({
            ...p,
            id: p.id || crypto.randomUUID(),
            }))
        );
        } else {
        setProductos([createProductoVacio()]);
        }
    }, [productosEmpresa]);

    const handleInputChange = (id, field, value) => {
        setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const startEdit = (id) => {
        // Guarda snapshot solo la primera vez que entramos a edición
        if (!editSection) {
        setSnapshot(productos.map((p) => ({ ...p })));
        }
        setEditSection(id);
    };

    const agregarProducto = () => {
        const nuevo = createProductoVacio();
        setProductos((prev) => [...prev, nuevo]);
        startEdit(nuevo.id);
    };

    const eliminarProducto = (id) => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
    };

    const handleGuardar = async () => {
        try {
        await guardarProductos(productos);
        alert("Productos guardados correctamente.");
        setEditSection(null);
        setSnapshot(null);
        await obtenerProductos(); // refresca desde el back
        } catch {
        alert("Error al guardar productos.");
        }
    };

    const handleCancelar = () => {
        if (snapshot) {
        setProductos(snapshot); // vuelve al estado previo
        } else {
        // fallback: recargar del back
        obtenerProductos();
        }
        setEditSection(null);
        setSnapshot(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleGuardar();
    };

    return (
        <section className={formStyles.formContainer}>
        <BannerEmpresa />
        <form onSubmit={handleSubmit}>
            <div className={formStyles.outerContainer}>
            {productos.map((producto, idx) => (
                <div
                key={producto.id}
                className={`${formStyles.productosContainer} ${
                    editSection === producto.id ? formStyles.editando : ""
                }`}
                style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FBFBFB" }}
                >
                <div className={formStyles.inputsContainer}>
                    <div className={formStyles.contenedor}>
                    {editSection === producto.id ? (
                        <div className={formStyles.productoContainer}>
                        <label>Nombre producto:</label>
                        <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) =>
                            handleInputChange(producto.id, "nombre", e.target.value)
                            }
                            placeholder="Café Americano"
                        />
                        </div>
                    ) : (
                        <p>{producto.nombre || "Nombre producto:"}</p>
                    )}
                    </div>

                    <div className={formStyles.productoContainer}>
                    {editSection === producto.id ? (
                        <input
                        type="text"
                        value={producto.precio}
                        onChange={(e) =>
                            handleInputChange(producto.id, "precio", e.target.value)
                        }
                        placeholder="2.50€"
                        />
                    ) : (
                        <span>{producto.precio}</span>
                    )}
                    </div>
                </div>

                <div
                    className={`${formStyles.icons} ${
                    editSection === producto.id ? formStyles.editandoIcons : ""
                    }`}
                >
                    <img
                    src={deleteIcon}
                    alt="Eliminar"
                    style={{ cursor: "pointer" }}
                    onClick={() => eliminarProducto(producto.id)}
                    />
                    {editSection !== producto.id && (
                    <img
                        src={pen}
                        alt="Editar"
                        style={{ cursor: "pointer" }}
                        onClick={() => startEdit(producto.id)}
                    />
                    )}
                </div>
                </div>
            ))}
            </div>

            <button
            type="button"
            onClick={agregarProducto}
            className={styles.moreButton}
            >
            + Añadir producto
            </button>

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
                type="submit"   /* submit para respetar Enter también */
                variant="save"
                className="btnBase btnSave"
                >
                guardar
                </Button>
            </section>
            )}
        </form>
        </section>
    );
}


// import { useEffect, useState } from "react";
// import deleteIcon from "/src/assets/Delete.svg";
// import pen from "/src/assets/Pen.svg";
// import Button from "../components/Button";
// import formStyles from "/src/style/ProductosEmpresa.module.css";
// import styles from "/src/style/PremiosEmpresa.module.css"; 
// import BannerEmpresa from "/src/components/BannerEmpresa";
// import { useEmpresa } from "/src/contexts/EmpresaProvider";
// import style from "/src/style/Button.module.css"; 

// export default function ProductosEmpresa() {
//     const { productosEmpresa, obtenerProductos, guardarProductos } = useEmpresa();

//     const createProductoVacio = () => ({
//         id: crypto.randomUUID(),
//         nombre: "",
//         precio: "",
//     });

//     const [productos, setProductos] = useState([]);
//     const [editSection, setEditSection] = useState(null);
//     const [snapshot, setSnapshot] = useState(null); // ← para cancelar

//     useEffect(() => {
//         obtenerProductos();
//     }, []);

//     useEffect(() => {
//         if (productosEmpresa && productosEmpresa.length > 0) {
//             setProductos(
//                 productosEmpresa.map((p) => ({
//                     ...p,
//                     id: p.id || crypto.randomUUID(),
//                 }))
//             );
//         } else {
//             setProductos([createProductoVacio()]);
//         }
//     }, [productosEmpresa]);

//     const handleInputChange = (id, field, value) => {
//         setProductos((prev) =>
//             prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
//         );
//     };

//     const startEdit = (id) => {
//         if (!editSection) {
//             setSnapshot(productos.map((p) => ({ ...p })));
//         }
//         setEditSection(id);
//     };

//     const agregarProducto = () => {
//         const nuevo = createProductoVacio();
//         setProductos((prev) => [...prev, nuevo]);
//         startEdit(nuevo.id);
//     };

//     const eliminarProducto = (id) => {
//         setProductos((prev) => prev.filter((p) => p.id !== id));
//     };

//     const handleGuardar = async () => {
//         try {
//             await guardarProductos(productos);
//             alert("Productos guardados correctamente.");
//             setEditSection(null);
//             setSnapshot(null);
//             await obtenerProductos();
//         } catch {
//             alert("Error al guardar productos.");
//         }
//     };

//     const handleCancelar = () => {
//         if (snapshot) {
//             setProductos(snapshot);
//         } else {
//             obtenerProductos();
//         }
//         setEditSection(null);
//         setSnapshot(null);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await handleGuardar();
//     };

//     return (
//         <section className={formStyles.formContainer}>
//             <BannerEmpresa />
//             <form onSubmit={handleSubmit}>
//                 <div className={formStyles.outerContainer}>
//                     {productos.map((producto, idx) => (
//                         <div
//                             key={producto.id}
//                             className={`${formStyles.productosContainer} ${
//                                 editSection === producto.id ? formStyles.editando : ""
//                             }`}
//                             style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FBFBFB" }}
//                         >
//                             <div className={formStyles.inputsContainer}>
//                                 <div className={formStyles.contenedor}>
//                                     {editSection === producto.id ? (
//                                         <div className={formStyles.productoContainer}>
//                                             <label>Nombre producto:</label>
//                                             <input
//                                                 type="text"
//                                                 value={producto.nombre}
//                                                 onChange={(e) =>
//                                                     handleInputChange(producto.id, "nombre", e.target.value)
//                                                 }
//                                                 placeholder="Café Americano"
//                                             />
//                                         </div>
//                                     ) : (
//                                         <p>{producto.nombre || "Nombre producto:"}</p>
//                                     )}
//                                 </div>

//                                 <div className={formStyles.productoContainer}>
//                                     {editSection === producto.id ? (
//                                         <input
//                                             type="text"
//                                             value={producto.precio}
//                                             onChange={(e) =>
//                                                 handleInputChange(producto.id, "precio", e.target.value)
//                                             }
//                                             placeholder="2.50€"
//                                         />
//                                     ) : (
//                                         <span>{producto.precio}</span>
//                                     )}
//                                 </div>
//                             </div>

//                             <div
//                                 className={`${formStyles.icons} ${
//                                     editSection === producto.id ? formStyles.editandoIcons : ""
//                                 }`}
//                             >
//                                 <img
//                                     src={deleteIcon}
//                                     alt="Eliminar"
//                                     style={{ cursor: "pointer" }}
//                                     onClick={() => eliminarProducto(producto.id)}
//                                 />
//                                 {editSection !== producto.id && (
//                                     <img
//                                         src={pen}
//                                         alt="Editar"
//                                         style={{ cursor: "pointer" }}
//                                         onClick={() => startEdit(producto.id)}
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     type="button"
//                     onClick={agregarProducto}
//                     className={styles.moreButton}
//                 >
//                     + Añadir producto
//                 </button>

//                 {editSection && (
//                     <section className={style.btnGroup}>
//                         <Button
//                             type="button"
//                             variant="cancel"
//                             className="btnBase btnCancel"
//                             onClick={handleCancelar}
//                         >
//                             cancelar
//                         </Button>

//                         <Button
//                             type="submit"
//                             variant="save"
//                             className="btnBase btnSave"
//                         >
//                             guardar
//                         </Button>
//                     </section>
//                 )}
//             </form>
//         </section>
//     );
// }
