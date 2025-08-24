import { useEffect, useMemo, useState } from "react";

// Iconos por nivel
import lightOff from "/src/assets/LightGris.svg";
import lightOn  from "/src/assets/LightChico.svg";
import sparkOff from "/src/assets/SparkGris.svg";
import sparkOn  from "/src/assets/SparkChico.svg";
import flameOff from "/src/assets/FlameGris.svg";
import flameOn  from "/src/assets/FlameChico.svg";
import auraOff  from "/src/assets/AuraGris.svg";
import auraOn   from "/src/assets/AuraChico.svg";

import candado from "/src/assets/Candado.svg";
import celebrate from "/src/assets/Confetti.svg";

import perfilStyle from "/src/style/PerfilLocalCliente.module.css";
import cardsStyle from "/src/style/Cards.module.css";
import fallbackFoto from "/src/assets/Cozy Coffee Break with Pumpkin Pie.jpeg";

const ICONS_BY_LEVEL = {
  Light: { on: lightOn,  off: lightOff  },
  Spark: { on: sparkOn,  off: sparkOff  },
  Flame: { on: flameOn,  off: flameOff  },
  Aura:  { on: auraOn,   off: auraOff   },
};

export default function PuntosSVG({ nivel = "Light", puntosIniciales = 0, recompensa = null }) {
  const totalPuntos = 10;
  const [puntos, setPuntos] = useState(puntosIniciales);

  useEffect(() => {
    setPuntos(puntosIniciales);
  }, [puntosIniciales]);

  const { on: selloOn, off: selloOff } = ICONS_BY_LEVEL[nivel] ?? ICONS_BY_LEVEL.Light;
  const sellos = useMemo(() => Array.from({ length: totalPuntos }, (_, i) => i < puntos), [puntos]);

  const locked = recompensa?.porSello ? puntos < totalPuntos : false;

  // Mock botón para test (quítalo cuando conectes QR)
  const handleAddPunto = () => setPuntos(p => Math.min(totalPuntos, p + 1));

  return (
    <div className={perfilStyle.puntosContainer}>
      {/* Sellos */}
      <div className={perfilStyle.puntosInnerContainer}>
        {sellos.slice(0, 6).map((on, i) => <img key={i} src={on ? selloOn : selloOff} alt="" />)}
      </div>
      <div className={perfilStyle.puntosInnerContainer}>
        {sellos.slice(6).map((on, i) => <img key={i + 6} src={on ? selloOn : selloOff} alt="" />)}
      </div>

      {/* Botón mock */}
      <button onClick={handleAddPunto} className={perfilStyle.addButton}>
        Escanear QR (mock) — {puntos}/{totalPuntos}
      </button>

      {/* Card de recompensa – siempre visible; bloqueada si corresponde */}
      {recompensa && (
        <section
          className={`${cardsStyle.cardContenedor} ${locked ? perfilStyle.cardDisabled : ""}`}
          aria-disabled={locked}
        >
          <img
            src={recompensa.foto || fallbackFoto}
            alt={recompensa.nombre}
            className={cardsStyle.cardImg}
          />
          <div className={cardsStyle.cardInnerContenedor}>
            <h4>{recompensa.nombre}</h4>
            <p>{recompensa.descripcion}</p>

            {recompensa.porSello ? (
              locked ? (
                <div className={perfilStyle.estadoInfo}>
                  <img src={candado} className={perfilStyle.candado} alt="" />
                  <span>Faltan {totalPuntos - puntos} sellos</span>
                </div>
              ) : (
                <div className={perfilStyle.estadoInfo}>
                  <img src={celebrate} className={perfilStyle.candado} alt="" />
                  <span className={perfilStyle.estadoOk}>¡Disponible!</span>
                </div>
              )
            ) : (
              <span className={perfilStyle.estadoOk}>Disponible por nivel</span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}







