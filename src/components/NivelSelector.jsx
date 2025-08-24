import style from "/src/style/NivelSelector.module.css";

const niveles = ["Light", "Spark", "Flame", "Aura"];

const coloresNivel = {
    Light: "#F67EAA",
    Spark: "#FA8966",
    Flame: "#F9B481",
    Aura: "#F65681"
};

export default function NivelSelector({ nivelActivo, setNivelActivo }) {
    const color = coloresNivel[nivelActivo];

    return (
        <nav className={style.nivelesNav}>
            {niveles.map((nivel, index) => (
                <div key={nivel} className={style.nivel}>
                    <button
                        className={`${style.nivelBtn} ${nivel === nivelActivo ? style.activo : ""}`}
                        onClick={() => setNivelActivo(nivel)}
                        style={{
                            color: nivel === nivelActivo ? color : "#000"
                        }}
                    >
                        {nivel}
                    </button>
                    {index < niveles.length - 1 && (
                        <span className={style.separador}></span>
                    )}
                </div>
            ))}
        </nav>
    );
}


