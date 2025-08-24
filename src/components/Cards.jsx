import { useLocation } from "react-router-dom";
import style from "/src/style/Cards.module.css";
import perfilStyle from "/src/style/PerfilLocalCliente.module.css";
import cafe from "/src/assets/Tonex Compe Café.jpeg";
import candado from "/src/assets/Candado.svg";
import { useCliente } from "/src/contexts/ClienteProvider";

export default function Cards({ nivelActivo }) {
    const location = useLocation();
    const { datosCliente, premiosCliente, ofertasCliente } = useCliente();

    const isBeneficios = location.pathname === "/cliente/beneficios";
    const isOfertas = location.pathname === "/cliente/ofertas";
    const isPremios = location.pathname === "/cliente/recompensas";

    const localActual = datosCliente?.localNombre;

    // Filtramos por local y nivel para beneficios y ofertas
    const premiosPorLocalYNivel = premiosCliente?.filter(
        (p) => p.nivel === nivelActivo && p.localNombre === localActual
    ) || [];

    const premiosPorSoloNivel = premiosCliente?.filter(
        (p) => p.nivel === nivelActivo
    ) || [];

    const ofertasPorLocalYNivel = ofertasCliente?.filter(
        (o) => o.nivel === nivelActivo && o.localNombre === localActual
    ) || [];

    const renderCards = (items, tipo) => {
        const disponibles = items.filter(i => !i.usada);
        const usados = items.filter(i => i.usada);

        const render = (item, yaUsado = false) => (
        <section
            key={item.id}
            className={`${style.cardContenedor} ${yaUsado ? perfilStyle.cardDisabled : ""}`}
            aria-disabled={yaUsado}
        >
            <img
            src={item.foto || cafe}
            alt={item.nombre}
            className={style.cardImg}
            />
            <div className={style.cardInnerContenedor}>
            <h4>{item.nombre}</h4>
            <p>{item.descripcion}</p>

            {tipo === "oferta" && item.fecha && (
                <h5 className={style.fecha}>Válido hasta el {item.fecha}</h5>
            )}

            {tipo === "premio" && isPremios && (
                <small className={style.localName}>
                Local: {item.localNombre}
                </small>
            )}

            {yaUsado && (
                <div className={perfilStyle.estadoInfo}>
                <img src={candado} className={perfilStyle.candado} alt="" />
                <span className={perfilStyle.estadoOk}>Ya usado</span>
                </div>
            )}
            </div>
        </section>
        );

        return (
        <>
            {disponibles.map((item) => render(item))}
            {usados.map((item) => render(item, true))}
        </>
        );
    };

    return (
        <>
        {isBeneficios && renderCards(premiosPorLocalYNivel, "premio")}
        {isOfertas && renderCards(ofertasPorLocalYNivel, "oferta")}
        {isPremios && renderCards(premiosPorSoloNivel, "premio")}
        </>
    );
}
