import { useState } from "react";
import BannerEmpresa from "../components/BannerEmpresa";
import NivelSelector from "../components/NivelSelector";
import Cards from "../components/Cards";
import FooterLocal from "../components/FooterLocal";
import style from "/src/style/Cards.module.css";

const mockDatosCliente = {
    localNombre: "Café Madrid"
    };

    export default function BeneficiosCliente() {
    const [nivelActivo, setNivelActivo] = useState("Light");

    return (
        <section className={style.wrapper}>
        <BannerEmpresa />
        <NivelSelector nivelActivo={nivelActivo} setNivelActivo={setNivelActivo} />

        <div className={style.contentArea}>
            <div className={style.scrollCards}>
            <Cards nivelActivo={nivelActivo} datosCliente={mockDatosCliente} />
            </div>
            <div className={style.footerPosition}>
            <FooterLocal />
            </div>
        </div>
        </section>
    );
}

// import { useState, useEffect } from "react";
// import BannerEmpresa from "../components/BannerEmpresa";
// import NivelSelector from "../components/NivelSelector";
// import Cards from "../components/Cards";
// import FooterLocal from "../components/FooterLocal";
// import style from "/src/style/Cards.module.css";
// import { useCliente } from "/src/contexts/ClienteProvider";

// export default function BeneficiosCliente() {
//     const { nivelCliente, datosCliente } = useCliente();

//     // 🔁 Controlar el nivel desde aquí
//     const [nivelActivo, setNivelActivo] = useState(nivelCliente);

//     // Si el cliente cambia (por ejemplo tras cargar), actualizamos
//     useEffect(() => {
//         setNivelActivo(nivelCliente);
//     }, [nivelCliente]);

//     return (
//         <section className={style.wrapper}>
//             <BannerEmpresa />
//             <NivelSelector nivelActivo={nivelActivo} setNivelActivo={setNivelActivo} />

//             <div className={style.contentArea}>
//                 <div className={style.scrollCards}>
//                     <Cards nivelActivo={nivelActivo} datosCliente={datosCliente} />
//                 </div>
//                 <div className={style.footerPosition}>
//                     <FooterLocal />
//                 </div>
//             </div>
//         </section>
//     );
// }




