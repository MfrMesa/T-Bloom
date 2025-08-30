import styles from "/src/style/Crm.module.css";

export default function BadgePlan({ plan }) {
    const cls =
        plan === "Basico"
        ? `${styles.badge} ${styles.badgeBasico}`
        : plan === "Plus"
        ? `${styles.badge} ${styles.badgePlus}`
        : plan === "Empresarial"
        ? `${styles.badge} ${styles.badgeEmpresarial}`
        : `${styles.badge} ${styles.badgeNeutral}`;

    return <span className={cls}>{plan ?? "—"}</span>;
}
