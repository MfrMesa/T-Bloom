import { useLocation } from "react-router-dom";
import { useCliente } from "../contexts/ClienteProvider";
import placeholder from "/src/assets/logo.png";
import iconLight from "/src/assets/LightIcon.svg";
import iconSpark from "/src/assets/SparkIcon.svg";
import iconFlame from "/src/assets/FlameIcon.svg";
import iconAura from "/src/assets/AuraIcon.svg";
import style from "/src/style/PremiosEmpresa.module.css";

const TITULOS = {
    "/empresa/locales": "Locales",
    "/empresa/premios": "Premios",
    "/empresa/ofertas": "Ofertas",
    "/empresa/productos": "Productos",
    "/empresa/perfil": "Perfil",
    "/cliente/perfil": "Perfil",
    "/cliente/ofertas": "Ofertas",
    "/cliente/beneficios": "Beneficios",
    "/cliente/productos": "Productos",
    "/cliente/recompensas": "Recompensas",
    "/cliente/local/productos": "Productos"
};

const ICONOS_NIVEL = {
    Light: iconLight,
    Spark: iconSpark,
    Flame: iconFlame,
    Aura: iconAura
};

export default function BannerEmpresa({ logoEmpresa }) {
    const location = useLocation();

    // Protege la lectura del contexto
    let nivelCliente = "Light";
    let datosCliente = null;

    try {
        const clienteContext = useCliente();
        if (clienteContext) {
            nivelCliente = clienteContext.nivelCliente || "Light";
            datosCliente = clienteContext.datosCliente || null;
        }
    } catch (error) {
        // El contexto no está definido, usar mocks
    }

    const titulo = TITULOS[location.pathname] || "Cliente";

    let imagenSrc = placeholder;

    if (
    location.pathname === "/cliente/recompensas" ||
    location.pathname === "/cliente/perfil"
    ) {
        imagenSrc = ICONOS_NIVEL[nivelCliente] || iconLight;
    } else if (
        location.pathname === "/cliente/ofertas" ||
        location.pathname === "/cliente/beneficios" ||
        location.pathname === "/cliente/local/productos"
    ) {
        imagenSrc = datosCliente?.logo || logoEmpresa || placeholder;
    }

    return (
        <div className={style.contenedorTitulo}>
            <h3>{titulo}</h3>
            <img
                src={imagenSrc}
                alt="Visual"
                className={style.logoPhoto}
            />
        </div>
    );
}




// import { useLocation } from "react-router-dom";
// import { useCliente } from "../contexts/ClienteProvider";

// import placeholder from "/src/assets/logo.png";
// import iconLight from "/src/assets/LightIcon.svg";
// import iconSpark from "/src/assets/SparkIcon.svg";
// import iconFlame from "/src/assets/FlameIcon.svg";
// import iconAura from "/src/assets/AuraIcon.svg";

// import style from "/src/style/PremiosEmpresa.module.css";

// const TITULOS = {
//     "/empresa/locales": "Locales",
//     "/empresa/premios": "Premios",
//     "/empresa/ofertas": "Ofertas",
//     "/empresa/productos": "Productos",
//     "/empresa/perfil": "Perfil",
//     "/cliente/perfil": "Perfil",
//     "/cliente/ofertas": "Ofertas",
//     "/cliente/beneficios": "Beneficios",
//     "/cliente/productos": "Productos",
//     "/cliente/recompensas": "Recompensas",
//     "/cliente/local/productos": "Productos"
//     };

//     const ICONOS_NIVEL = {
//     Light: iconLight,
//     Spark: iconSpark,
//     Flame: iconFlame,
//     Aura: iconAura
//     };

//     export default function BannerEmpresa({ logoEmpresa }) {
//     const location = useLocation();
//     const ruta = location.pathname;

//     let nivelCliente = "Light";
//     let datosCliente = null;

//     try {
//         const clienteContext = useCliente();
//         nivelCliente = clienteContext?.nivelCliente || "Light";
//         datosCliente = clienteContext?.datosCliente || null;
//     } catch {
//         // Contexto no disponible (vista empresa)
//     }

//     const titulo = TITULOS[ruta] || "Cliente";

//     const mostrarNivel = ["/cliente/recompensas", "/cliente/perfil"].includes(ruta);
//     const mostrarLogoCliente = ["/cliente/ofertas", "/cliente/beneficios", "/cliente/local/productos"].includes(ruta);

//     const imagenSrc = mostrarNivel
//         ? ICONOS_NIVEL[nivelCliente] || iconLight
//         : mostrarLogoCliente
//         ? datosCliente?.logo || logoEmpresa || placeholder
//         : placeholder;

//     return (
//         <div className={style.contenedorTitulo}>
//         <h3>{titulo}</h3>
//         <img src={imagenSrc} alt="Visual" className={style.logoPhoto} />
//         </div>
//     );
// }
