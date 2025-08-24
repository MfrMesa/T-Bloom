import BannerEmpresa from "/src/components/BannerEmpresa";
import FooterLocal from "/src/components/FooterLocal";
import style from "/src/style/PerfilLocalCliente.module.css";

const productosMock = [
    { id: 1, nombre: "Corte de Cabello", precio: 15.0 },
    { id: 2, nombre: "Manicura", precio: 12.5 },
    { id: 3, nombre: "Masaje", precio: 30.0 },
    { id: 4, nombre: "Depilación", precio: 18.0 },
    { id: 5, nombre: "Tratamiento Facial", precio: 25.0 },
    { id: 6, nombre: "Peinado", precio: 20.0 },
    { id: 7, nombre: "Coloración", precio: 45.0 },
    { id: 8, nombre: "Corte de Barba", precio: 10.0 },
    { id: 9, nombre: "Mascarilla Capilar", precio: 13.5 },
    { id: 6, nombre: "Peinado", precio: 20.0 },
    { id: 7, nombre: "Coloración", precio: 45.0 },
    { id: 8, nombre: "Corte de Barba", precio: 10.0 },
    { id: 9, nombre: "Mascarilla Capilar", precio: 13.5 }
];

export default function ProductosLocales() {
    return (
        <section>
            <BannerEmpresa />
            <div className={style.contentArea}>
                <div className={style.scrollServicios}>
                    {productosMock.map((producto, index) => (
                        <div
                            key={`${producto.nombre}-${index}`}
                            className={`${style.servicioContainer} ${
                                index % 2 === 0 ? style.fondoBlanco : style.fondoGris
                            }`}
                        >
                            <p>{producto.nombre}</p>
                            <p>€{producto.precio.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className={style.footerPosition}>
                    <FooterLocal />
                </div>
            </div>
        </section>
    );
}


// import BannerEmpresa from "/src/components/BannerEmpresa";
// import FooterLocal from "/src/components/FooterLocal";
// import style from "/src/style/PerfilLocalCliente.module.css";
// import { useEmpresa } from "/src/contexts/EmpresaProvider";

// export default function ProductosLocales() {
//     const { productosEmpresa } = useEmpresa();

//     return (
//         <section>
//             <BannerEmpresa />
//             <div className={style.contentArea}>
//                 <div className={style.scrollServicios}>
//                     {productosEmpresa.map((producto, index) => (
//                         <div
//                             key={`${producto.nombre}-${index}`}
//                             className={`${style.servicioContainer} ${
//                                 index % 2 === 0 ? style.fondoBlanco : style.fondoGris
//                             }`}
//                         >
//                             <p>{producto.nombre}</p>
//                             <p>€{producto.precio.toFixed(2)}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <div className={style.footerPosition}>
//                     <FooterLocal />
//                 </div>
//             </div>
//         </section>
//     );
// }
