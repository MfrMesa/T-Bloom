import { createContext, useContext, useEffect, useState } from "react";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
    const [empresaId, setEmpresaId] = useState(() => localStorage.getItem("empresaId") || null);
    const [datosEmpresa, setDatosEmpresa] = useState(null);

    const [ofertasEmpresa, setOfertasEmpresa] = useState([]);
    const [localesEmpresa, setLocalesEmpresa] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const fetchWithAuth = async (pathOrUrl, options = {}) => {
        const token = localStorage.getItem("tokenEmpresa");
        const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
        const url = isAbsolute ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;

        const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
        console.warn("Acceso no autorizado");
        return null;
        }

        return res;
    };

    //Datos Empresa
    const obtenerDatosEmpresa = async () => {
        if (!empresaId) return;
        try {
        const res = await fetchWithAuth(`/empresa/perfil/${empresaId}`);
        if (!res) return;
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setDatosEmpresa(data);
        } catch (error) {
        console.error("Error al obtener los datos de la empresa:", error);
        }
    };

    useEffect(() => {
        obtenerDatosEmpresa();
    }, [empresaId]);

    //Actualizar perfil
    const guardarPerfil = async (formDataInput, fotoPerfil) => {
        if (!empresaId) throw new Error("Empresa no definida.");

        const formData = new FormData();
        Object.entries(formDataInput).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value);
        }
        });
        if (fotoPerfil) formData.append("logo", fotoPerfil);

        try {
        const res = await fetchWithAuth(`/empresa/${empresaId}`, {
            method: "PUT",
            body: formData,
        });
        if (!res?.ok) throw new Error("Error al actualizar perfil");

        const actualizado = await res.json();
        setDatosEmpresa(actualizado);
        return true;
        } catch (error) {
        console.error("Error al guardar perfil:", error);
        throw error;
        }
    };

    //Nuevas ofertas
    const guardarOfertas = async (ofertas) => {
        if (!empresaId) throw new Error("Empresa no definida.");
        const results = await Promise.all(
        ofertas.map(async (oferta) => {
            const formData = new FormData();
            Object.entries(oferta).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value);
            }
            });

            try {
            const res = await fetchWithAuth(`/empresa/${empresaId}/ofertas`, {
                method: "POST",
                body: formData,
            });
            if (!res?.ok) throw new Error("Error al guardar la oferta");
            return true;
            } catch (error) {
            console.error(error);
            return false;
            }
        })
        );
        return results;
    };

    //Cargar ofertas
    const obtenerOfertas = async () => {
        if (!empresaId) return [];
        try {
        const res = await fetchWithAuth(`/empresa/${empresaId}/ofertas`);
        if (!res?.ok) throw new Error("Error al obtener ofertas");
        const data = await res.json();
        setOfertasEmpresa(data);
        return data;
        } catch (error) {
        console.error("Error al obtener ofertas:", error);
        return [];
        }
    };

    //Locales
    const obtenerLocales = async () => {
        if (!empresaId) return;
        try {
        const res = await fetchWithAuth(`/empresa/${empresaId}/locales`);
        if (!res?.ok) throw new Error("Error al obtener locales");
        const data = await res.json();
        setLocalesEmpresa(data);
        } catch (error) {
        console.error("Error al obtener locales:", error);
        }
    };

    return (
        <EmpresaContext.Provider
        value={{
            empresaId,
            setEmpresaId,
            datosEmpresa,
            obtenerDatosEmpresa,
            guardarPerfil,
            guardarOfertas,
            obtenerOfertas,
            ofertasEmpresa,
            obtenerLocales,
            localesEmpresa,
        }}
        >
        {children}
        </EmpresaContext.Provider>
    );
};

export const useEmpresa = () => useContext(EmpresaContext);
