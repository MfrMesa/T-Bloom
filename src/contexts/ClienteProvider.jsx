    import { createContext, useContext, useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";

    const ClienteContext =createContext();

    export const ClienteProvider = ({ children }) => {
    const [clienteId, setClienteId] = useState(() => localStorage.getItem("clienteId") || null);

    const [datosClienteRaw, setDatosClienteRaw] = useState(null);
    const [datosCliente, setDatosCliente] = useState(null);

    const [nivelCliente, setNivelCliente] = useState("Light");
    const [cargandoPerfil, setCargandoPerfil] = useState(false);

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const mapBackendToForm = (raw) => {
        const c = raw?.cliente ?? raw ?? {};
        return {
        name:            c?.Nombre ?? c?.name ?? "",
        lastname:        c?.Apellidos ?? c?.lastname ?? "",
        fechaNacimiento: (c?.FechaNacimiento ?? c?.fechaNacimiento ?? "").slice(0, 10),
        email:           c?.Email ?? c?.email ?? "",
        phone:           c?.Telefono ?? c?.phone ?? "",
        };
    };

    const mapFormToBackend = (form) => ({
        Nombre:          form.name,
        Apellidos:       form.lastname,
        FechaNacimiento: form.fechaNacimiento, // "YYYY-MM-DD"
        Email:           form.email,
        Telefono:        form.phone,
        ...(form.password ? { Password: form.password } : {}),
    });

    const normalizarNivel = (raw) => {
        const nivel =
        raw?.cliente?.Nivel?.Nombre ??
        raw?.nivel ??
        raw?.Nivel?.Nombre ??
        null;
        if (!nivel || typeof nivel !== "string") return "Light";
        return nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();
    };

    // ---------- Obtener perfil ----------
    useEffect(() => {
        const obtenerDatosCliente = async () => {
        if (!clienteId) {
            setDatosClienteRaw(null);
            setDatosCliente(null);
            setNivelCliente("Light");
            return;
        }
        setCargandoPerfil(true);
        try {
            const res = await fetch(`${BASE_URL}/cliente/${clienteId}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();

            setDatosClienteRaw(data);
            setDatosCliente(mapBackendToForm(data));
            setNivelCliente(normalizarNivel(data));
        } catch (error) {
            console.error("Error al obtener datos del cliente:", error);
        } finally {
            setCargandoPerfil(false);
        }
        };
        obtenerDatosCliente();
    }, [clienteId, BASE_URL]);

    // ---------- Guardar perfil ----------
    const guardarPerfilCliente = async (formDataObj = {}, fotoFile) => {
        if (!clienteId) throw new Error("Cliente no definido.");

        const payload = mapFormToBackend(formDataObj || {});
        let options;

        if (fotoFile) {
        // multipart si envías foto
        const body = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null) body.append(k, v);
        });
        body.append("foto", fotoFile);
        options = { method: "PUT", body};
        } else {
        // JSON puro
        options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        };
        }

        const res = await fetch(`${BASE_URL}/cliente/${clienteId}`, options);
        if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.mensaje || `Error ${res.status} al guardar el perfil`);
        }

        const actualizado = await res.json();
        // 1) raw
        setDatosClienteRaw(actualizado);
        // 2) derivados
        setDatosCliente(mapBackendToForm(actualizado));
        setNivelCliente(normalizarNivel(actualizado));

        return actualizado;
    };

    // ---------- Eliminar cuenta ----------
    const eliminarCuenta = async () => {
        if (!clienteId) throw new Error("Cliente no definido.");
        try {
        const res = await fetch(`${BASE_URL}/cliente/${clienteId}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            const json = await res.json().catch(() => null);
            throw new Error(json?.mensaje || `Error ${res.status} al eliminar la cuenta`);
        }

        // limpiar estado y storage
        localStorage.removeItem("tokenCliente");
        localStorage.removeItem("clienteId");
        sessionStorage.removeItem("clienteId");
        setClienteId(null);
        setDatosClienteRaw(null);
        setDatosCliente(null);
        setNivelCliente("Light");

        redirect("/"); // va a la web
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
            datosClienteRaw,  
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



    // import { createContext, useContext, useEffect, useMemo, useState } from "react";
    // import { useNavigate } from "react-router-dom";

    // const ClienteContext = createContext();

    // export const ClienteProvider = ({ children }) => {
    //   const [clienteId, setClienteId] = useState(() => localStorage.getItem("clienteId") || null);

    //   const [datosClienteRaw, setDatosClienteRaw] = useState(null);
    //   const [datosCliente, setDatosCliente] = useState(null);
    //   const [nivelCliente, setNivelCliente] = useState("Light");
    //   const [cargandoPerfil, setCargandoPerfil] = useState(false);

    //   const [authChecked, setAuthChecked] = useState(false);
    //   const navigate = useNavigate();
    //   const BASE_URL = import.meta.env.VITE_API_URL;

    //   const token =
    //     localStorage.getItem("tokenCliente") || sessionStorage.getItem("tokenCliente");

    //   const isAuthenticated = useMemo(() => Boolean(token && clienteId), [token, clienteId]);

    //   // --- fetch con token ---
    //   const apiFetch = async (url, options = {}) => {
    //     const headers = {
    //       ...(options.headers || {}),
    //       ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
    //     };
    //     const res = await fetch(url, { ...options, headers });
    //     return res;
    //   };

    //   // --- Gate de autenticación ---
    //   useEffect(() => {
    //     // Si no hay token o clienteId, limpiamos y mandamos a /login
    //     if (!token || !clienteId) {
    //       setDatosClienteRaw(null);
    //       setDatosCliente(null);
    //       setNivelCliente("Light");
    //       setAuthChecked(true);
    //       navigate("/login", { replace: true });
    //       return;
    //     }
    //     // Autenticación verificada
    //     setAuthChecked(true);
    //   }, [token, clienteId, navigate]);

    //   const mapBackendToForm = (raw) => {
    //     const c = raw?.cliente ?? raw ?? {};
    //     return {
    //       name:            c?.Nombre ?? c?.name ?? "",
    //       lastname:        c?.Apellidos ?? c?.lastname ?? "",
    //       fechaNacimiento: (c?.FechaNacimiento ?? c?.fechaNacimiento ?? "").slice(0, 10),
    //       email:           c?.Email ?? c?.email ?? "",
    //       phone:           c?.Telefono ?? c?.phone ?? "",
    //     };
    //   };

    //   const mapFormToBackend = (form) => ({
    //     Nombre:          form.name,
    //     Apellidos:       form.lastname,
    //     FechaNacimiento: form.fechaNacimiento,
    //     Email:           form.email,
    //     Telefono:        form.phone,
    //     ...(form.password ? { Password: form.password } : {}),
    //   });

    //   const normalizarNivel = (raw) => {
    //     const nivel =
    //       raw?.cliente?.Nivel?.Nombre ??
    //       raw?.nivel ??
    //       raw?.Nivel?.Nombre ??
    //       null;
    //     if (!nivel || typeof nivel !== "string") return "Light";
    //     return nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();
    //   };

    //   // ---------- Obtener perfil (solo si autenticado) ----------
    //   useEffect(() => {
    //     const obtenerDatosCliente = async () => {
    //       if (!authChecked || !isAuthenticated) return;

    //       setCargandoPerfil(true);
    //       try {
    //         const res = await apiFetch(`${BASE_URL}/cliente/${clienteId}`);
    //         if (!res.ok) throw new Error(`Error ${res.status}`);
    //         const data = await res.json();

    //         setDatosClienteRaw(data);
    //         setDatosCliente(mapBackendToForm(data));
    //         setNivelCliente(normalizarNivel(data));
    //       } catch (error) {
    //         console.error("Error al obtener datos del cliente:", error);
    //         // Si 401/403 → limpiar y a login
    //         // Opcionalmente: if (error.status === 401 || error.status === 403) ...
    //         localStorage.removeItem("tokenCliente");
    //         localStorage.removeItem("clienteId");
    //         sessionStorage.removeItem("tokenCliente");
    //         sessionStorage.removeItem("clienteId");
    //         setClienteId(null);
    //         navigate("/login", { replace: true });
    //       } finally {
    //         setCargandoPerfil(false);
    //       }
    //     };
    //     obtenerDatosCliente();
    //   }, [authChecked, isAuthenticated, clienteId, BASE_URL]); // apiFetch no en deps

    //   // ---------- Guardar perfil ----------
    //   const guardarPerfilCliente = async (formDataObj = {}, fotoFile) => {
    //     if (!isAuthenticated) throw new Error("No autenticado.");

    //     const payload = mapFormToBackend(formDataObj || {});
    //     let options;

    //     if (fotoFile) {
    //       const body = new FormData();
    //       Object.entries(payload).forEach(([k, v]) => {
    //         if (v !== undefined && v !== null) body.append(k, v);
    //       });
    //       body.append("foto", fotoFile);
    //       options = { method: "PUT", body };
    //     } else {
    //       options = { method: "PUT", body: JSON.stringify(payload) };
    //     }

    //     const res = await apiFetch(`${BASE_URL}/cliente/${clienteId}`, options);
    //     if (!res.ok) {
    //       const json = await res.json().catch(() => null);
    //       throw new Error(json?.mensaje || `Error ${res.status} al guardar el perfil`);
    //     }

    //     const actualizado = await res.json();
    //     setDatosClienteRaw(actualizado);
    //     setDatosCliente(mapBackendToForm(actualizado));
    //     setNivelCliente(normalizarNivel(actualizado));
    //     return actualizado;
    //   };

    //   // ---------- Eliminar cuenta ----------
    //   const eliminarCuenta = async () => {
    //     if (!isAuthenticated) throw new Error("No autenticado.");
    //     try {
    //       const res = await apiFetch(`${BASE_URL}/cliente/${clienteId}`, { method: "DELETE" });
    //       if (!res.ok) {
    //         const json = await res.json().catch(() => null);
    //         throw new Error(json?.mensaje || `Error ${res.status} al eliminar la cuenta`);
    //       }
    //       // limpiar estado y storage
    //       localStorage.removeItem("tokenCliente");
    //       localStorage.removeItem("clienteId");
    //       sessionStorage.removeItem("tokenCliente");
    //       sessionStorage.removeItem("clienteId");
    //       setClienteId(null);
    //       setDatosClienteRaw(null);
    //       setDatosCliente(null);
    //       setNivelCliente("Light");
    //       navigate("/", { replace: true }); // <-- corrige redirect
    //     } catch (error) {
    //       console.error("Error eliminando cuenta:", error);
    //       alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
    //     }
    //   };

    //   return (
    //     <ClienteContext.Provider
    //       value={{
    //         // auth
    //         isAuthenticated,
    //         authChecked,
    //         // ids/datos
    //         clienteId,
    //         setClienteId,
    //         datosClienteRaw,
    //         datosCliente,
    //         nivelCliente,
    //         cargandoPerfil,
    //         // acciones
    //         guardarPerfilCliente,
    //         eliminarCuenta,
    //       }}
    //     >
    //       {children}
    //     </ClienteContext.Provider>
    //   );
    // };

    // export const useCliente = () => useContext(ClienteContext);
