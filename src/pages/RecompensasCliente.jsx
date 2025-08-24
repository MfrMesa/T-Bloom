import { useState } from "react";
import BannerEmpresa from "../components/BannerEmpresa";
import Cards from "../components/Cards";
import PointLoader from "../components/PointLoader";
import style from "/src/style/Cards.module.css";

export default function RecompensasCliente() {
  const [nivelActivo, setNivelActivo] = useState("Light");

  return (
    <section className={style.wrapper}>
      <BannerEmpresa />
      <PointLoader />

      <div className={style.contentArea}>
        <div className={style.scrollCards}>
          <Cards nivelActivo={nivelActivo} />
        </div>
      </div>
    </section>
  );
}

// import BannerEmpresa from "../components/BannerEmpresa";
// import Cards from "../components/Cards";
// import PointLoader from "../components/PointLoader";
// import style from "/src/style/Cards.module.css";
// import { useCliente } from "/src/contexts/ClienteProvider";

// export default function RecompensasCliente() {
//   const { nivelCliente } = useCliente(); // 🔹 obtenemos el nivel desde el provider

//   return (
//     <section className={style.wrapper}>
//       <BannerEmpresa />
//       <PointLoader />

//       <div className={style.contentArea}>
//         <div className={style.scrollCards}>
//           <Cards nivelActivo={nivelCliente} />
//         </div>
//       </div>
//     </section>
//   );
// }






