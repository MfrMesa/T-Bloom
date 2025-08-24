import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
    const [empresaId, setEmpresaId] = useState(() => localStorage.getItem("empresaId") || null);
    const [datosEmpresa, setDatosEmpresa] = useState(null);
    const [cargandoPerfil, setCargandoPerfil] = useState(false);

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem("tokenEmpresa");
        const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        return fetch(url, { credentials: "include", ...options, headers });
    };

    // Obtener perfil de empresa
    useEffect(() => {
        const obtenerDatosEmpresa = async () => {
        if (!empresaId) return;
        setCargandoPerfil(true);
        try {
            const res = await fetchWithAuth(`${BASE_URL}/empresa/perfil/${empresaId}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            setDatosEmpresa(data);
        } catch (error) {
            console.error("Error al obtener datos de la empresa:", error);
        } finally {
            setCargandoPerfil(false);
        }
        };
        obtenerDatosEmpresa();
    }, [empresaId]);

    // Guardar perfil
    const guardarPerfil = async (formDataObj, fotoFile) => {
        if (!empresaId) throw new Error("Empresa no definida.");

        const body = new FormData();
        Object.entries(formDataObj || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, v);
        });
        if (fotoFile) body.append("logo", fotoFile);

        const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}`, {
        method: "PUT",
        body,
        });

        if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.mensaje || `Error ${res.status} al guardar el perfil`);
        }

        const actualizado = await res.json();
        setDatosEmpresa(actualizado);
        return actualizado;
    };

    // Eliminar empresa
    const eliminarEmpresa = async () => {
        if (!empresaId) throw new Error("Empresa no definida.");

        try {
        const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const json = await res.json().catch(() => null);
            throw new Error(json?.mensaje || `Error ${res.status} al eliminar la empresa`);
        }

        // Limpiar estado y storage
        localStorage.removeItem("tokenEmpresa");
        localStorage.removeItem("empresaId");
        setEmpresaId(null);
        setDatosEmpresa(null);

        navigate("/empresa/login");
        } catch (error) {
        console.error("Error eliminando empresa:", error);
        alert("No se pudo eliminar la empresa. Intenta de nuevo.");
        }
    };

    return (
        <EmpresaContext.Provider
        value={{
            empresaId,
            setEmpresaId,
            datosEmpresa,
            cargandoPerfil,
            guardarPerfil,
            eliminarEmpresa,
        }}
        >
        {children}
        </EmpresaContext.Provider>
    );
};

export const useEmpresa = () => useContext(EmpresaContext);
