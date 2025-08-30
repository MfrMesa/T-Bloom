import { createContext, useContext, useEffect, useState } from "react";
import { ClienteService } from "/src/services/cliente";
import { mapBackendToFormCliente, mapFormToBackendCliente, normalizarNivelCliente } from "/src/mappers/cliente";

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
    const [clienteId, setClienteId] = useState(() => localStorage.getItem("clienteId") || null);
    const [datosCliente, setDatosCliente] = useState(null);
    const [nivelCliente, setNivelCliente] = useState("Light");
    const [cargandoPerfil, setCargandoPerfil] = useState(false);

    useEffect(() => {
        const load = async () => {
        if (!clienteId) return;
        setCargandoPerfil(true);
        try {
            const data = await ClienteService.getPerfil(clienteId);
            setDatosCliente(mapBackendToFormCliente(data));
            setNivelCliente(normalizarNivelCliente(data));
        } catch (e) {
            console.error("Error al obtener datos del cliente:", e);
        } finally {
            setCargandoPerfil(false);
        }
        };
        load();
    }, [clienteId]);

    const guardarPerfilCliente = async (formDataObj = {}) => {
        if (!clienteId) throw new Error("Cliente no definido.");
        const payload = mapFormToBackendCliente(formDataObj);
        const actualizado = await ClienteService.updatePerfil(clienteId, payload);
        setDatosCliente(mapBackendToFormCliente(actualizado));
        setNivelCliente(normalizarNivelCliente(actualizado));
        return actualizado;
    };

    const eliminarCuenta = async () => {
        if (!clienteId) throw new Error("Cliente no definido.");
        await ClienteService.deleteCuenta(clienteId);
        localStorage.removeItem("clienteId");
        setClienteId(null);
        setDatosCliente(null);
        setNivelCliente("Light");
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











































// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ClienteContext = createContext();

// export const ClienteProvider = ({ children }) => {
//     const [clienteId, setClienteId] = useState(() => localStorage.getItem("clienteId") || null);
//     const [datosCliente, setDatosCliente] = useState(null);
//     const [nivelCliente, setNivelCliente] = useState("Light");
//     const [cargandoPerfil, setCargandoPerfil] = useState(false);

//     const navigate = useNavigate();

//     const BASE_URL =import.meta.env.VITE_API_URL;

//     // Backend -> Form de Perfil
//     const mapBackendToForm = (raw) => {
//         const c = raw?.cliente ?? raw ?? {};
//         return {
//         name:            c?.Nombre ?? c?.name ?? "",
//         lastname:        c?.Apellidos ?? c?.lastname ?? "",
//         fechaNacimiento: (c?.FechaNacimiento ?? c?.fechaNacimiento ?? "").slice(0, 10),
//         email:           c?.Email ?? c?.email ?? "",
//         phone:           c?.Telefono ?? c?.phone ?? "",
//         };
//     };

//  // Form de Perfil -> Backend 
//     const mapFormToBackend = (form) => {
//         return {
//             Nombre:          form.name,
//             Apellidos:       form.lastname,
//             FechaNacimiento: form.fechaNacimiento, // "YYYY-MM-DD"
//             Email:           form.email,
//             Telefono:        form.phone,
//             ...(form.password ? { Password: form.password } : {}),
//         };
//         };

//     // const normalizarNivel = (raw) => {
//     //     const nivel =
//     //     raw?.cliente?.Nivel?.Nombre ??
//     //     raw?.nivel ??
//     //     raw?.Nivel?.Nombre ??
//     //     null;

//     //     if (!nivel || typeof nivel !== "string") return "Light";
//     //     return nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();
//     // };


//     const fetchWithAuth = async (url, options = {}) => {
//         const token = localStorage.getItem("tokenCliente");
//         const headers = {
//         ...(options.headers || {}),
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         };
//         return fetch(url, { credentials: "include", ...options, headers });
//     };

//     // Obtener perfil
//     useEffect(() => {
//         const obtenerDatosCliente = async () => {
//         if (!clienteId) return;
//         setCargandoPerfil(true);
//         try {
//             const res = await fetch(`${BASE_URL}/cliente/${clienteId}`);
//             if (!res.ok) throw new Error(`Error ${res.status}`);
//             const data = await res.json();
//              // Mapeo que espera el form
//             const mapeado = mapBackendToForm(data);
//             setDatosCliente(mapeado);
//             // Nivel (normalizado)
//             setNivelCliente(normalizarNivel(data));

//             // setDatosCliente(data);
//             // if (data.cliente.Nivel) {
//             // const nivelNormalizado = data.cliente.Nivel.Nombre.charAt(0).toUpperCase() + data.cliente.Nivel.Nombre.slice(1).toLowerCase();
//             // setNivelCliente(nivelNormalizado);
//             // }
//         } catch (error) {
//             console.error("Error al obtener datos del cliente:", error);
//         } finally {
//             setCargandoPerfil(false);
//         }
//         };
//         obtenerDatosCliente();
//     }, [clienteId]);

//     // Guardar perfil
//     const guardarPerfilCliente = async (formDataObj, fotoFile) => {
//         if (!clienteId) throw new Error("Cliente no definido.");

//         const payload = mapFormToBackend(formDataObj || {});

//         const body = new FormData();
//         Object.entries(payload || {}).forEach(([k, v]) => {
//         if (v !== undefined && v !== null) body.append(k, v);
//         });
//         if (fotoFile) body.append("foto", fotoFile);

//         const res = await fetchWithAuth(`${BASE_URL}/cliente/${clienteId}`, {
//         method: "PUT",
//         body,
//         });

//         if (!res.ok) {
//         const json = await res.json().catch(() => null);
//         throw new Error(json?.mensaje || `Error ${res.status} al guardar el perfil`);
//         }

//         const actualizado = await res.json();
//         // Vuelve a mapear para mantener el formulario sincronizado
//         const mapeado = mapBackendToForm(actualizado);
//         setDatosCliente(mapeado);

//         // Nivel (normalizado)
//         setNivelCliente(normalizarNivel(actualizado));

//         // setDatosCliente(actualizado);

//         // if (actualizado?.nivel) {
//         // const nivelNormalizado = actualizado.nivel.charAt(0).toUpperCase() + actualizado.nivel.slice(1).toLowerCase();
//         // setNivelCliente(nivelNormalizado);
//         // }

//         return actualizado;
//     };

//     // Eliminar cuenta
//     const eliminarCuenta = async () => {
//         if (!clienteId) throw new Error("Cliente no definido.");

//         try {
//         const res = await fetchWithAuth(`${BASE_URL}/cliente/${clienteId}`, {
//             method: "DELETE",
//         });

//         if (!res.ok) {
//             const json = await res.json().catch(() => null);
//             throw new Error(json?.mensaje || `Error ${res.status} al eliminar la cuenta`);
//         }

//         // Limpiar estado y storage
//         localStorage.removeItem("tokenCliente");
//         localStorage.removeItem("clienteId");
//         setClienteId(null);
//         setDatosCliente(null);
//         setNivelCliente("Light");

//         navigate("/cliente/login");
//         } catch (error) {
//         console.error("Error eliminando cuenta:", error);
//         alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
//         }
//     };

//     return (
//         <ClienteContext.Provider
//         value={{
//             clienteId,
//             setClienteId,
//             datosCliente,
//             nivelCliente,
//             cargandoPerfil,
//             guardarPerfilCliente,
//             eliminarCuenta,
//         }}
//         >
//         {children}
//         </ClienteContext.Provider>
//     );
// };

// export const useCliente = () => useContext(ClienteContext);
