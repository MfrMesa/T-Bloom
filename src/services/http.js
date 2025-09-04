//     const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

//     const toUrl = (p = "") => {
//     if (/^https?:\/\//i.test(p)) return p;
//     const path = String(p).replace(/^\/+/, "");
//     return `${API}/${path}`;
//     };

//     /**
//      * fetchJson(pathOrUrl, {
//      *   method: "GET" | "POST" | ...,
//      *   body: object | FormData,
//      *   headers: { ... },
//      *   query: { [k]: v },          // => ?k=v
//      *   timeout: number (ms),       // default 15s
//      *   credentials: "include" | "same-origin" | "omit"
//      * })
//      */

//     export async function fetchJson(pathOrUrl, opts = {}) {
//     const {
//         method = "GET",
//         body,
//         headers,
//         query,
//         timeout = 15000,
//         credentials = "include", 
//         ...rest
//     } = opts;

//     const base = toUrl(pathOrUrl);
//     const qs = query ? new URLSearchParams(query).toString() : "";
//     const url = qs ? `${base}${base.includes("?") ? "&" : "?"}${qs}` : base;


//     const ctrl = new AbortController();
//     const t = setTimeout(() => ctrl.abort(new DOMException("Timeout", "AbortError")), timeout);

//     const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

//     let res;
//     try {
//         res = await fetch(url, {
//         method,
//         credentials,
//         headers: {
//             ...(isFormData ? {} : { "Content-Type": "application/json" }),
//             ...(headers || {}),
//         },
//         body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
//         signal: ctrl.signal,
//         ...rest,
//         });
//     } finally {
//         clearTimeout(t);
//     }

//     const ct = res.headers.get("content-type") || "";
//     let data = null;

//     if (res.status === 204 || res.status === 205 || method.toUpperCase() === "HEAD") {
//         data = null;
//     } else if (ct.includes("application/json")) {
//         data = await res.json().catch(() => null);
//     } else {
//         data = await res.text().catch(() => null);
//         try {
//         if (typeof data === "string" && data.trim().startsWith("{")) {
//             data = JSON.parse(data);
//         }
//         } catch {}
//     }

//     if (!res.ok) {
//         const msg = data?.mensaje || data?.message || `HTTP ${res.status}`;
//         const err = new Error(msg);
//         err.status = res.status;
//         err.data = data;
//         throw err;
//     }

//     return data;
// }
