import { fetchJson } from "./http";

export const ClienteService = {
    getPerfil:    (id)          => fetchJson(`/cliente/${id}`, { method: "GET" }),
    updatePerfil: (id, payload) => fetchJson(`/cliente/${id}`, { method: "PUT", body: payload }),
    deleteCuenta: (id)          => fetchJson(`/cliente/${id}`, { method: "DELETE" }),
};
