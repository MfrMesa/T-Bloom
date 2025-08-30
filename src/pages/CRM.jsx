import React, { useEffect, useMemo, useState } from "react";
import styles from "/src/style/Crm.module.css";
import BadgePlan from "/src/components/BadgePlan";
import { csv, formatDate, formatPhone, exportCompaniesCsv } from "/src/services/helpers.js";
import { MOCK_DATA } from "/src/services/mock.js";

export default function CRMList({ logoUrl, data, onAddCompany, onRowClick }) {
    const [empresas, setEmpresas] = useState(() => data ?? MOCK_DATA);
    const [nameQuery, setNameQuery] = useState("");
    const [plan, setPlan] = useState("ALL");
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        if (Array.isArray(data)) setEmpresas(data);
    }, [data]);

    const toggleAllVisible = (rows) => {
        const ids = rows.map((r) => r.id);
        const allSelected = ids.every((id) => selected.has(id));
        const next = new Set(selected);
        ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
        setSelected(next);
    };

    const toggleOne = (id) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const clearSelection = () => setSelected(new Set());

    const visibleRows = useMemo(() => {
        const q = nameQuery.trim().toLowerCase();
        return empresas.filter((e) => {
        const matchesPlan = plan === "ALL" || e.plan === plan;
        const matchesName = q === "" || (e.nombre ?? "").toLowerCase().includes(q);
        return matchesPlan && matchesName;
        });
    }, [empresas, nameQuery, plan]);

    const allVisibleSelected =
        visibleRows.length > 0 && visibleRows.every((r) => selected.has(r.id));

    const handleExport = () => {
        const rows = empresas.filter((e) => selected.has(e.id));
        const toExport = rows.length ? rows : visibleRows;
        exportCompaniesCsv(toExport);
    };

    return (
        <section className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
            {logoUrl && <img src={logoUrl} alt="logo" className={styles.logo} />}
            <h1 className={styles.title}>LISTA DE EMPRESAS</h1>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
            <div className={styles.filters}>
            <input
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Filtrar por nombre de empresa"
                className={styles.input}
                aria-label="Filtrar por nombre de empresa"
            />
            <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className={styles.select}
                aria-label="Filtrar por plan"
            >
                <option value="ALL">Todos los planes</option>
                <option value="Basico">Básico</option>
                <option value="Plus">Plus</option>
                <option value="Empresarial">Empresarial</option>
            </select>
            </div>

            <div className={styles.actions}>
            <button onClick={handleExport} className={styles.button}>
                Exportar CSV
            </button>
            {onAddCompany && (
                <button
                onClick={onAddCompany}
                className={`${styles.button} ${styles.buttonPrimary}`}
                >
                + Nueva empresa
                </button>
            )}
            </div>
        </div>

        {/* Acciones masivas */}
        {selected.size > 0 && (
            <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>{selected.size} seleccionadas</span>
            <button className={styles.link} onClick={clearSelection}>
                Limpiar
            </button>
            </div>
        )}

        {/* Tabla */}
        <div className={styles.tableWrap}>
            <table className={styles.table}>
            <thead className={styles.thead}>
                <tr>
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                    <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={() => toggleAllVisible(visibleRows)}
                    aria-label="Seleccionar todas las visibles"
                    />
                </th>
                <Th>Empresa</Th>
                <Th>Fecha de alta</Th>
                <Th>Administrador</Th>
                <Th>Teléfono</Th>
                <Th>Correo electrónico</Th>
                <Th>Dirección</Th>
                <Th>Plan</Th>
                <Th>Locales</Th>
                </tr>
            </thead>
            <tbody>
                {visibleRows.map((e) => (
                <tr
                    key={e.id}
                    className={styles.row}
                    onClick={() => onRowClick && onRowClick(e)}
                >
                    <td
                    className={`${styles.td} ${styles.tdCheckbox}`}
                    onClick={(ev) => ev.stopPropagation()}
                    >
                    <input
                        type="checkbox"
                        checked={selected.has(e.id)}
                        onChange={() => toggleOne(e.id)}
                        aria-label={`Seleccionar ${e.nombre}`}
                    />
                    </td>
                    <Td primary>{e.nombre}</Td>
                    <Td>{formatDate(e.fechaAlta)}</Td>
                    <Td>{e.admin}</Td>
                    <Td>{formatPhone(e.telefono)}</Td>
                    <Td>{e.email}</Td>
                    <Td className={styles.truncate} title={e.direccion}>
                    {e.direccion}
                    </Td>
                    <Td><BadgePlan plan={e.plan} /></Td>
                    <Td>{e.locales?.length ?? 0}</Td>
                </tr>
                ))}

                {visibleRows.length === 0 && (
                <tr>
                    <td colSpan={9} className={styles.empty}>No hay resultados</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </section>
    );
    }

    function Th({ children }) {
    return <th className={styles.th}>{children}</th>;
    }
    function Td({ children, primary, className = "" }) {
    return (
        <td className={`${styles.td} ${primary ? styles.primary : ""} ${className}`}>
        {children}
        </td>
    );
}
