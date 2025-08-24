import style from "/src/style/MisLocales.module.css";
import chevron from "/src/assets/Chevron.svg";
import { Link } from "react-router-dom";
import { useCliente } from "/src/contexts/ClienteProvider";
import cafe from "/src/assets/LogoLocal.png"

const mockLocales = [
    {
        id: "1",
        nombre: "Café Central",
        logo: cafe
    },
    {
        id: "2",
        nombre: "Panadería Sucre",
        logo: cafe
    }
    ];

    export default function MisLocalesCliente() {
    let locales = mockLocales;

    try {
        const { datosCliente } = useCliente();
        if (datosCliente?.locales) {
        locales = datosCliente.locales;
        }
    } catch (e) {
        // Está en modo diseño o sin Provider → usar mocks
    }

    return (
        <section className={style.LocalContainer}>
        <h3>Mis Locales</h3>

        {locales.map((local) => (
            <section key={local.id} className={style.cardContainer}>
            <img
                src={local.logo || "/src/assets/LogoLocal.png"}
                alt={local.nombre}
                className={style.cardImagen}
            />
            <h4>{local.nombre}</h4>
            <Link className={style.chevron} to={`/cliente/local/${local.id}`}>
                <img src={chevron} alt="Ir al local" />
            </Link>
            </section>
        ))}
        </section>
    );
}

// import style from "/src/style/MisLocales.module.css";
// import chevron from "/src/assets/Chevron.svg";
// import { Link } from "react-router-dom";
// import { useCliente } from "/src/contexts/ClienteProvider";
// import cafe from "/src/assets/LogoLocal.png";

// export default function MisLocalesCliente() {
//     let locales = [];

//     try {
//         const { datosCliente } = useCliente();
//         if (Array.isArray(datosCliente?.locales)) {
//         locales = datosCliente.locales;
//         }
//     } catch (e) {
//         // En caso de que el Provider no esté disponible aún
//     }

//     return (
//         <section className={style.LocalContainer}>
//         <h3>Mis Locales</h3>

//         {locales.length > 0 ? (
//             locales.map((local) => (
//             <section key={local.id} className={style.cardContainer}>
//                 <img
//                 src={local.logo || cafe}
//                 alt={local.nombre}
//                 className={style.cardImagen}
//                 />
//                 <h4>{local.nombre}</h4>
//                 <Link className={style.chevron} to={`/cliente/local/${local.id}`}>
//                 <img src={chevron} alt="Ir al local" />
//                 </Link>
//             </section>
//             ))
//         ) : (
//             <p className={style.sinLocales}>Aún no tienes locales asignados.</p>
//         )}
//         </section>
//     );
// }
