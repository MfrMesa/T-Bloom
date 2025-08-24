import { useEffect, useState } from "react";
import BannerEmpresa from "/src/components/BannerEmpresa";
import style from "/src/style/Locales.module.css";

// ❗ MOCK TEMPORAL PARA DISEÑO
const mockLocales = [
    {
        id: "1",
        nombre: "T-Bloom Madrid Norte",
        direccion: "Av. Boyacá 3, Madrid, 28033",
        telefono: "911 234 567",
        email: "contacto@ejemplo.com",
        administrador: "Juan Pérez",
    },
    {
        id: "2",
        nombre: "T-Bloom Serrano",
        direccion: "Calle Serrano 45, Madrid, 28001",
        telefono: "912 345 678",
        email: "ventas@tienda.com",
        administrador: "María García",
    },
];

export default function LocalesEmpresa() {
    const [localesEmpresa, setLocalesEmpresa] = useState([]);

    useEffect(() => {
        // Simulamos llamada a API
        setTimeout(() => {
            setLocalesEmpresa(mockLocales);
        }, 500);
    }, []);

    if (!localesEmpresa || localesEmpresa.length === 0) return null;

    return (
        <section>
            <BannerEmpresa />
            <section className={style.contenedorLocal}>
                {localesEmpresa.map((local, idx) => {
                    const fondo = idx % 2 === 0 ? "#FFFFFF" : "#FBFBFB";
                    return (
                        <div key={local.id} className={style.contenedorInnerLocal} style={{ backgroundColor: fondo }}>
                            <h3 className={style.tituloLocal}>{local.nombre}</h3> {/* ← Aquí se muestra el nombre */}
                            <div className={style.info}>
                                <p>
                                    Dirección:{" "}
                                    <span className={style.innerText}>{local.direccion}</span>
                                </p>
                                <p>
                                    Teléfono:{" "}
                                    <span className={style.innerText}>{local.telefono}</span>
                                </p>
                                <p>
                                    Correo electrónico:{" "}
                                    <span className={style.innerText}>{local.email}</span>
                                </p>
                                <p>
                                    Administrador:{" "}
                                    <span className={style.innerText}>{local.administrador}</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </section>
        </section>
    );
}

// import { useEmpresa } from "/src/contexts/EmpresaProvider";
// import BannerEmpresa from "/src/components/BannerEmpresa";
// import style from "/src/style/Locales.module.css";

// export default function LocalesEmpresa() {
//     const { datosEmpresa } = useEmpresa();
//     const localesEmpresa = datosEmpresa?.locales || [];

//     return (
//         <section>
//         <BannerEmpresa />
//         <section className={style.contenedorLocal}>
//             {localesEmpresa.length === 0 ? (
//             <div className={style.mensajeSinLocales}>
//                 <p>Aún no has registrado locales para tu empresa.</p>
//             </div>
//             ) : (
//             localesEmpresa.map((local, idx) => {
//                 const fondo = idx % 2 === 0 ? "#FFFFFF" : "#FBFBFB";
//                 return (
//                 <div
//                     key={local.id}
//                     className={style.contenedorInnerLocal}
//                     style={{ backgroundColor: fondo }}
//                 >
//                     <h3 className={style.tituloLocal}>{local.nombre}</h3>
//                     <div className={style.info}>
//                     <p>
//                         Dirección:{" "}
//                         <span className={style.innerText}>{local.direccion}</span>
//                     </p>
//                     <p>
//                         Teléfono:{" "}
//                         <span className={style.innerText}>{local.telefono}</span>
//                     </p>
//                     <p>
//                         Correo electrónico:{" "}
//                         <span className={style.innerText}>{local.email}</span>
//                     </p>
//                     <p>
//                         Administrador:{" "}
//                         <span className={style.innerText}>{local.administrador}</span>
//                     </p>
//                     </div>
//                 </div>
//                 );
//             })
//             )}
//         </section>
//         </section>
//     );
// }
