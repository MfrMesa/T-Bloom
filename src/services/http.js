const API = import.meta.env.VITE_API_URL;

const toUrl = (p) => (/^https?:\/\//i.test(p) ? p : `${API}${p}`);

export async function fetchJson(pathOrUrl, { method = "GET", body, headers, ...rest } = {}) {
    const res = await fetch(toUrl(pathOrUrl), {
        method,
        headers: { "Content-Type": "application/json", ...(headers || {}) },
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    const text = await res.text();
    const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

    if (!res.ok) {
        const msg = data?.mensaje || data?.message || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}
