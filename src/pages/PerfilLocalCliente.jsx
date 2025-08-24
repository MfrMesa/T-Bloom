// import { useEffect, useMemo, useRef, useState } from "react";
// import PuntosSVG from "/src/components/PuntosSVG";
// import style from "/src/style/PerfilLocalCliente.module.css";
// import { Link } from "react-router-dom";
// import whiteChevron from "/src/assets/WhiteChevron.svg";
// import bannerCafe from "/src/assets/Tonex Compe Café.jpeg";
// import bannerDeli from "/src/assets/Cozy Coffee Break with Pumpkin Pie.jpeg";
// import bannerRoma from "/src/assets/Tonex Compe Café.jpeg";
// import chevron from "/src/assets/Chevron.svg"
// import FooterLocal from "../components/FooterLocal";

// const localesMock = [
//     { id: "mesa-cafe", nombre: "MESA CAFÉ",  banner: bannerCafe, nivel: "Light", puntos: 4 },
//     { id: "deli-co",   nombre: "Deli & Co",  banner: bannerDeli, nivel: "Spark", puntos: 8 },
//     { id: "roma",      nombre: "Restaurante Roma", banner: bannerRoma, nivel: "Flame", puntos: 10 },
//     ];

//     const recompensasMock = [
//     { id: "r1", localId: "mesa-cafe", nivel: "Light", nombre: "Taza de café gratis", descripcion: "Al completar 10 sellos", foto: null, porSello: true,  usada: false },
//     { id: "r2", localId: "mesa-cafe", nivel: "Light", nombre: "Galleta artesanal",   descripcion: "Disponible por nivel",  foto: null, porSello: false, usada: false },
//     { id: "r3", localId: "deli-co",   nivel: "Spark", nombre: "Cookie + Espresso",    descripcion: "Por nivel",             foto: null, porSello: false, usada: false },
//     { id: "r4", localId: "roma",      nivel: "Flame", nombre: "Postre gratis",        descripcion: "Al completar 10 sellos", foto: null, porSello: true, usada: false },
//     ];

//     export default function PerfilLocalCliente() {
//     const [sel, setSel] = useState(localesMock[0]);
//     const [open, setOpen] = useState(false);

//     const recompensaSel = useMemo(() => {
//         const candidatas = recompensasMock.filter(
//         r => r.localId === sel.id && r.nivel === sel.nivel && !r.usada
//         );
//         if (!candidatas.length) return null;
//         const porSello = candidatas.find(r => r.porSello);
//         return porSello || candidatas[0];
//     }, [sel]);

//     const btnRef = useRef(null);
//     const menuRef = useRef(null);
//     useEffect(() => {
//         const onDoc = (e) => {
//         if (!btnRef.current || !menuRef.current) return;
//         if (!btnRef.current.contains(e.target) && !menuRef.current.contains(e.target)) {
//             setOpen(false);
//         }
//         };
//         document.addEventListener("mousedown", onDoc);
//         return () => document.removeEventListener("mousedown", onDoc);
//     }, []);

//     return (
//         <section className={style.wrapperLocal}>
//         <div
//             className={style.headerLocal}
//             style={{
//             backgroundImage: `radial-gradient(circle, rgba(29,23,23,.41) 50%, rgba(211,211,211,.26) 70%), url(${sel.banner})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             position: "relative",
//             }}
//         >
//             <h1>{sel.nombre}</h1>

//             <button
//             ref={btnRef}
//             type="button"
//             className={style.chevronBtn}
//             onClick={() => setOpen(o => !o)}
//             aria-haspopup="listbox"
//             aria-expanded={open}
//             >
//             <img
//                 src={whiteChevron}
//                 className={`${style.headerChevron} ${open ? style.open : ""}`}
//                 alt=""
//             />
//             </button>

//             {open && (
//             <ul
//                 ref={menuRef}
//                 className={style.headerDropdown}
//                 role="listbox"
//                 aria-label="Selecciona un local"
//             >
//                 {localesMock.map((l) => (
//                 <li
//                     key={l.id}
//                     role="option"
//                     aria-selected={l.id === sel.id}
//                     className={`${style.dropdownItem} ${l.id === sel.id ? style.active : ""}`}
//                     onClick={() => {
//                     setSel(l);
//                     setOpen(false);
//                     }}
//                 >
//                     {l.nombre}
//                 </li>
//                 ))}
//             </ul>
//             )}
//         </div>

//         <PuntosSVG nivel={sel.nivel} puntosIniciales={sel.puntos} recompensa={recompensaSel} />

//         <div>
//             <Link className={style.linksLocal} to={`/cliente/${sel.id}/productos`}>
//                 <p>Productos</p>
//                 <img src={chevron}/>
//             </Link>
//             <Link className={style.linksLocal} to={`/cliente/${sel.id}/ofertas`}>
//                 <p>Ofertas</p>
//                 <img src={chevron}/>
//             </Link>
//         </div>
//         <FooterLocal/>
//         </section>
//     );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PuntosSVG from "/src/components/PuntosSVG";
import FooterLocal from "/src/components/FooterLocal";
import style from "/src/style/PerfilLocalCliente.module.css";
import whiteChevron from "/src/assets/WhiteChevron.svg";
import chevron from "/src/assets/Chevron.svg";
import { useCliente } from "/src/contexts/ClienteProvider";
import { useEmpresa } from "/src/contexts/EmpresaProvider";

export default function PerfilLocalCliente() {
    const { localesCliente, puntosCliente } = useCliente();
    const { premiosEmpresa } = useEmpresa();

    const [sel, setSel] = useState(null);
    const [open, setOpen] = useState(false);

    const btnRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (localesCliente?.length) setSel(localesCliente[0]);
    }, [localesCliente]);

    useEffect(() => {
        const onDoc = (e) => {
        if (!btnRef.current || !menuRef.current) return;
        if (!btnRef.current.contains(e.target) && !menuRef.current.contains(e.target)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const recompensaSel = useMemo(() => {
        if (!sel || !premiosEmpresa?.length) return null;
        const candidatas = premiosEmpresa.filter(
        (p) => p.localId === sel.id && p.nivel === sel.nivel && !p.usada
        );
        const porSello = candidatas.find((p) => p.porSello);
        return porSello || null;
    }, [sel, premiosEmpresa]);

    const puntosLocal = puntosCliente?.find((p) => p.localId === sel?.id)?.puntos || 0;

    if (!sel) return null;

    return (
        <section className={style.wrapperLocal}>
        <div
            className={style.headerLocal}
            style={{
            backgroundImage: `radial-gradient(circle, rgba(29,23,23,.41) 50%, rgba(211,211,211,.26) 70%), url(${sel.banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            }}
        >
            <h1>{sel.nombre}</h1>

            <button
            ref={btnRef}
            type="button"
            className={style.chevronBtn}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            >
            <img
                src={whiteChevron}
                className={`${style.headerChevron} ${open ? style.open : ""}`}
                alt=""
            />
            </button>

            {open && (
            <ul
                ref={menuRef}
                className={style.headerDropdown}
                role="listbox"
                aria-label="Selecciona un local"
            >
                {localesCliente.map((l) => (
                <li
                    key={l.id}
                    role="option"
                    aria-selected={l.id === sel.id}
                    className={`${style.dropdownItem} ${l.id === sel.id ? style.active : ""}`}
                    onClick={() => {
                    setSel(l);
                    setOpen(false);
                    }}
                >
                    {l.nombre}
                </li>
                ))}
            </ul>
            )}
        </div>

        <PuntosSVG
            nivel={sel.nivel}
            puntosIniciales={puntosLocal}
            recompensa={recompensaSel}
        />

        <div>
            <Link className={style.linksLocal} to={`/cliente/${sel.id}/productos`}>
            <p>Productos</p>
            <img src={chevron} />
            </Link>
            <Link className={style.linksLocal} to={`/cliente/${sel.id}/ofertas`}>
            <p>Ofertas</p>
            <img src={chevron} />
            </Link>
        </div>

        <FooterLocal />
        </section>
    );
    }
