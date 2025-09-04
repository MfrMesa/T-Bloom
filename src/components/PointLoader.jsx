import { useEffect, useState } from "react";
import styles from "/src/style/Point.module.css";

export default function PointLoader({ total = 200, puntosIniciales = 0 }) {
    const [puntos, setPuntos] = useState(puntosIniciales);

    useEffect(() => {
        const interval = setInterval(() => {
            setPuntos((prev) => {
                if (prev < total) return prev + 5;
                clearInterval(interval);
                return prev;
            });
        }, 300); // velocidad del incremento
        return () => clearInterval(interval);
    }, [total]);

    const porcentaje = Math.min((puntos / total) * 100, 100);

    return (
        <section className={styles.loader}>
            <div className={styles.loaderWrapper}>
                <div className={styles.barraContenedor}>
                    <div className={styles.etiqueta}>Light</div>
                    <div className={styles.barraProgreso} style={{ width: `${porcentaje}%` }} />
                    <div className={styles.texto}>{puntos}/{total}</div>
                </div>
            </div>
        </section>
    );
}
