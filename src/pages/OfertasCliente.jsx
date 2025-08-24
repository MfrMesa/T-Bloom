import BannerEmpresa from "../components/BannerEmpresa";
import Cards from "../components/Cards";
import FooterLocal from "../components/FooterLocal";
import NivelSelector from "../components/NivelSelector";
import { useState } from "react";
import style from "/src/style/Cards.module.css"


export default function OfertasCliente() {
    const [nivelActivo, setNivelActivo] = useState("Light");

    return (
        <section className={style.wrapper}>
            <BannerEmpresa />
            <NivelSelector nivelActivo={nivelActivo} setNivelActivo={setNivelActivo} />

            <div className={style.contentArea}>
                <div className={style.scrollCards}>
                    <Cards nivelActivo={nivelActivo} />
                </div>
                <div className={style.footerPosition}>
                    <FooterLocal />
                </div>
            </div>
        </section>
    );
}

// import BannerEmpresa from "../components/BannerEmpresa";
// import Cards from "../components/Cards";
// import FooterLocal from "../components/FooterLocal";
// import NivelSelector from "../components/NivelSelector";
// import { useState, useEffect } from "react";
// import { useCliente } from "/src/contexts/ClienteProvider";
// import style from "/src/style/Cards.module.css";

// export default function OfertasCliente() {
//     const { ofertasCliente, nivelCliente, datosCliente } = useCliente();
//     const [nivelActivo, setNivelActivo] = useState(nivelCliente || "Light");
//     const [ofertasFiltradas, setOfertasFiltradas] = useState([]);

//     useEffect(() => {
//         if (ofertasCliente && datosCliente?.localId) {
//             const filtradas = ofertasCliente.filter(
//                 (oferta) => oferta.localId === datosCliente.localId && oferta.nivel === nivelActivo
//             );
//             setOfertasFiltradas(filtradas);
//         }
//     }, [ofertasCliente, datosCliente?.localId, nivelActivo]);

//     return (
//         <section className={style.wrapper}>
//             <BannerEmpresa />
//             <NivelSelector nivelActivo={nivelActivo} setNivelActivo={setNivelActivo} />

//             <div className={style.contentArea}>
//                 <div className={style.scrollCards}>
//                     <Cards datos={ofertasFiltradas} tipo="oferta" />
//                 </div>
//                 <div className={style.footerPosition}>
//                     <FooterLocal />
//                 </div>
//             </div>
//         </section>
//     );
// }


