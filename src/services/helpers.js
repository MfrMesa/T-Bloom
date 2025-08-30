export const csv = (v) => {
    if (v == null) return "";
    const s = String(v).replaceAll('"', '""');
    return `"${s}"`;
    };

    export const formatDate = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    if (isNaN(d)) return String(v);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
    };

    export const formatPhone = (v) => {
    if (!v) return "—";
    const s = String(v).replace(/\D/g, "");
    if (s.length >= 9) return s.replace(/(\d{3})(\d{3})(\d{3,})/, "$1 $2 $3");
    return v;
    };

    export const exportCompaniesCsv = (rows = []) => {
    const headers = [
        "ID",
        "EMPRESA",
        "FECHA DE ALTA",
        "ADMINISTRADOR",
        "TELEFONO",
        "CORREO ELECTRONICO",
        "DIRECCIÓN",
        "TIPO DE PLAN",
        "LOCALES",
    ];
    const lines = [headers.join(",")];

    rows.forEach((e) => {
        lines.push(
        [
            e.id,
            csv(e.nombre),
            formatDate(e.fechaAlta),
            csv(e.admin),
            csv(e.telefono),
            csv(e.email),
            csv(e.direccion),
            csv(e.plan),
            String(e.locales?.length ?? 0),
        ].join(",")
        );
    });

    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `empresas_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    };
