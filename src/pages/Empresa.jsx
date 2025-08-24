// // import { useParams, Link } from "react-router-dom";
// import { Link } from "react-router-dom";
// // import { useEffect, useState } from "react";
// import Premio from "/src/assets/Premio.svg";
// import Profile from "/src/assets/Profile.svg";
// import Star from "/src/assets/Star.svg";
// import PinMap from "/src/assets/PinMap.svg";
// import Ofertas from "/src/assets/Ofertas.svg";
// import styles from "/src/style/Empresa.module.css";
// import logo from "/src/assets/Logo.png";
// //import { ReactComponent as Spinner } from '/src/assets/Spinner.svg';





// export default function Empresa() {

//     // const { id } = useParams();
//     // const [empresa, setEmpresa] = useState(null);

//     // useEffect(() => {
//     //     const fetchEmpresa = async () => {
//     //     try {
//     //         const res = await fetch(`/api/empresas/${id}`);
//     //         const data = await res.json();
//     //         setEmpresa(data);
//     //     } catch (err) {
//     //         console.error("Error al obtener la empresa:", err);
//     //     }
//     //     };
//     //     fetchEmpresa();
//     // }, [id]);

//     //if (!empresa) {
//     //   return (
//     //     <div>
//     //       <Spinner className={styles.spinner} />
//     //     </div>
//     //   );
// // }

//     return (
//         <section className={styles.containerEmpresa}>
//             <div className={styles.logoProfile}>
//                 <img src={logo} className={styles.logoEmpresa}/>
//                 <h3>MESA CAFÉ</h3> 
//                 {/* <img src={empresa.logo} alt={empresa.nombre} /> 
//                 <h3>{empresa.nombre}</h3> */}
//             </div>
//             <section className={styles.containerSections}>
//                 <Link className={styles.innerSections}> 
//                 {/* <Link to={`/empresa/${id}/premios`} className={styles.innerSections}>  */}
//                     <img src={Premio} />
//                     <h4>Premios</h4>
//                 </Link>
//                 <Link  className={styles.innerSections} >
//                     <img src={Ofertas} />
//                     <h4>Ofertas</h4>
//                 </Link>
//                 <Link className={styles.innerSections}>
//                     <img src={PinMap} />
//                     <h4>Locales</h4>
//                 </Link>
//                 <Link className={styles.innerSections}>
//                     <img src={Star} />
//                     <h4>Productos</h4>
//                 </Link>
//                 <Link  className={styles.innerSections}>
//                     <img src={Profile} />
//                     <h4>Perfil</h4>
//                 </Link>
//             </section>
//         </section>
//     );
// }


import { Link } from "react-router-dom";
import { useEmpresa } from "/src/contexts/EmpresaProvider";
import Premio from "/src/assets/Premio.svg";
import Profile from "/src/assets/Profile.svg";
import Star from "/src/assets/Star.svg";
import PinMap from "/src/assets/PinMap.svg";
import Ofertas from "/src/assets/Ofertas.svg";
import styles from "/src/style/Empresa.module.css";

export default function Empresa() {
    const { datosEmpresa } = useEmpresa();

    if (!datosEmpresa) return null;

    return (
        <section className={styles.containerEmpresa}>
            <div className={styles.logoProfile}>
                <img
                    src={datosEmpresa.logo || "/src/assets/Logo.png"}
                    className={styles.logoEmpresa}
                    alt={datosEmpresa.nombre}
                />
                <h3>{datosEmpresa.nombre}</h3>
            </div>

            <section className={styles.containerSections}>
                <Link to="/empresa/premios" className={styles.innerSections}>
                    <img src={Premio} alt="Premios" />
                    <h4>Premios</h4>
                </Link>

                <Link to="/empresa/ofertas" className={styles.innerSections}>
                    <img src={Ofertas} alt="Ofertas" />
                    <h4>Ofertas</h4>
                </Link>

                <Link to="/empresa/locales" className={styles.innerSections}>
                    <img src={PinMap} alt="Locales" />
                    <h4>Locales</h4>
                </Link>

                <Link to="/empresa/productos" className={styles.innerSections}>
                    <img src={Star} alt="Productos" />
                    <h4>Productos</h4>
                </Link>

                <Link to="/empresa/perfil" className={styles.innerSections}>
                    <img src={Profile} alt="Perfil" />
                    <h4>Perfil</h4>
                </Link>
            </section>
        </section>
    );
}

