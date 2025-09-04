import chevron from "/src/assets/ChevronRight.svg";
import gift from "/src/assets/gift.svg";
import locales from "/src/assets/locales.svg";
import promos from "/src/assets/promos.svg";
import perfil from "/src/assets/perfil.svg";
import style from "/src/style/Cliente.module.css";
import PointLoader from "/src/components/PointLoader";
import { Link } from "react-router-dom";
import { useCliente } from "/src/contexts/ClienteProvider";

export default function Cliente() {
    const { datosClienteRaw } = useCliente();
    const nombreCliente = datosClienteRaw?.cliente.Nombre || "Hola de nuevo";

    return (
        <section className={style.clienteContenedor}>
            <h1>¡Hola, {nombreCliente}!</h1>
            <p>¡Eres parte de algo especial, disfruta cada paso!</p>

            <PointLoader puntosIniciales={120} total={200} />

            <div className={style.buttonContenedor}>
                <div className={style.buttonInnerContenedor}>
                    <Link className={style.buttonRuta} to="/cliente/recompensas">
                        <img src={gift} />
                        <span className={style.buttonText}>Premios</span>
                    </Link>
                    <Link className={style.buttonRuta} to="/cliente/misLocales">
                        <img src={locales} />
                        <span className={style.buttonText}>Mis Locales</span>
                    </Link>
                </div>
                <div className={style.buttonInnerContenedor}>
                    <Link className={style.buttonRuta} to="/cliente/ofertas">
                        <img src={promos} />
                        <span className={style.buttonText}>Ofertas</span>
                    </Link>
                    <Link className={style.buttonRuta} to="/cliente/perfil">
                        <img src={perfil} />
                        <span className={style.buttonText}>Perfil</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

