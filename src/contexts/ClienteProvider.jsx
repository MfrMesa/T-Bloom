import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
    const [clienteId, setClienteId] = useState(() => localStorage.getItem("clienteId") || null);
    const [datosCliente, setDatosCliente] = useState(null);
    const [nivelCliente, setNivelCliente] = useState("Light");
    const [cargandoPerfil, setCargandoPerfil] = useState(false);

    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem("tokenCliente");
        const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        return fetch(url, { credentials: "include", ...options, headers });
    };

    // Obtener perfil
    useEffect(() => {
        const obtenerDatosCliente = async () => {
        if (!clienteId) return;
        setCargandoPerfil(true);
        try {
            const res = await fetchWithAuth(`https://localhost:3000/cliente/perfil/${clienteId}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();

            setDatosCliente(data);

            if (data.nivel) {
            const nivelNormalizado = data.nivel.charAt(0).toUpperCase() + data.nivel.slice(1).toLowerCase();
            setNivelCliente(nivelNormalizado);
            }
        } catch (error) {
            console.error("Error al obtener datos del cliente:", error);
        } finally {
            setCargandoPerfil(false);
        }
        };

        obtenerDatosCliente();
    }, [clienteId]);

    // Guardar perfil
    const guardarPerfilCliente = async (formDataObj, fotoFile) => {
        if (!clienteId) throw new Error("Cliente no definido.");

        const body = new FormData();
        Object.entries(formDataObj || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, v);
        });
        if (fotoFile) body.append("foto", fotoFile);

        const res = await fetchWithAuth(`${BASE_URL}/cliente/${clienteId}`, {
        method: "PUT",
        body,
        });

        if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.mensaje || `Error ${res.status} al guardar el perfil`);
        }

        const actualizado = await res.json();
        setDatosCliente(actualizado);

        if (actualizado?.nivel) {
        const nivelNormalizado = actualizado.nivel.charAt(0).toUpperCase() + actualizado.nivel.slice(1).toLowerCase();
        setNivelCliente(nivelNormalizado);
        }

        return actualizado;
    };

    // Eliminar cuenta
    const eliminarCuenta = async () => {
        if (!clienteId) throw new Error("Cliente no definido.");

        try {
        const res = await fetchWithAuth(`${BASE_URL}/cliente/${clienteId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const json = await res.json().catch(() => null);
            throw new Error(json?.mensaje || `Error ${res.status} al eliminar la cuenta`);
        }

        // Limpiar estado y storage
        localStorage.removeItem("tokenCliente");
        localStorage.removeItem("clienteId");
        setClienteId(null);
        setDatosCliente(null);
        setNivelCliente("Light");

        navigate("/cliente/login");
        } catch (error) {
        console.error("Error eliminando cuenta:", error);
        alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
        }
    };

    return (
        <ClienteContext.Provider
        value={{
            clienteId,
            setClienteId,
            datosCliente,
            nivelCliente,
            cargandoPerfil,
            guardarPerfilCliente,
            eliminarCuenta,
        }}
        >
        {children}
        </ClienteContext.Provider>
    );
};

export const useCliente = () => useContext(ClienteContext);
