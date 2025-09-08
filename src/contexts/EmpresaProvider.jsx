import { createContext, useContext, useEffect, useState } from "react";

const EmpresaContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const EmpresaProvider = ({ children }) => {
    const [empresaId, setEmpresaId] = useState(() => localStorage.getItem("empresaId") || null);
    const [datosEmpresa, setDatosEmpresa] = useState(null);

    const [ofertasEmpresa, setOfertasEmpresa] = useState([]);
    const [localesEmpresa, setLocalesEmpresa] = useState([]);

  // Backend -> Form de Perfil 
    const mapBackendToForm = (raw) => {
        const e = raw?.empresa ?? raw ?? {};
        return {
        company:        e?.NombreEmpresa   ?? e?.company       ?? "",
        store:          e?.NombreLocal     ?? e?.store         ?? "",
        direccionLocal: e?.DireccionLocal  ?? e?.direccionLocal?? "",
        country:        e?.Pais            ?? e?.country       ?? "",
        state:          e?.Provincia       ?? e?.state         ?? "",
        postalCode:     e?.CodigoPostal    ?? e?.postalCode    ?? "",
        name:           e?.NombreAdmin     ?? e?.name          ?? "",
        lastname:       e?.ApellidosAdmin  ?? e?.lastname      ?? "",
        identity:       e?.NIF             ?? e?.identity      ?? "",
        email:          e?.Email           ?? e?.email         ?? "",
        phone:          e?.Telefono        ?? e?.phone         ?? "",
        instagram:      e?.Instagram       ?? e?.instagram     ?? "",
        web:            e?.Web             ?? e?.web           ?? "",
        logo:           e?.Logo            ?? raw?.logo        ?? null,
        };
    };

    // Form de Perfil -> Backend 
    const mapFormToBackend = (form) => {
        return {
        NombreEmpresa:  form.company,
        NombreLocal:    form.store,
        DireccionLocal: form.direccionLocal,
        Pais:           form.country,
        Provincia:      form.state,
        CodigoPostal:   form.postalCode,
        NombreAdmin:    form.name,
        ApellidosAdmin: form.lastname,
        NIF:            form.identity,
        Email:          form.email,
        Telefono:       form.phone,
        Instagram:      form.instagram,
        Web:            form.web,
        ...(form.password ? { Password: form.password } : {}),
        };
    };

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
        const res = await fetchWithAuth(`${BASE_URL}/empresa/perfil/${empresaId}`);
        if (!res) return;
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const mapeado = mapBackendToForm(data);
        setDatosEmpresa(mapeado);
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

        const payload = mapFormToBackend(formDataInput);

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value);
        }
        });
        if (fotoPerfil) formData.append("logo", fotoPerfil);

        try {
        const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}`, {
            method: "PUT",
            body: formData,
        });
        if (!res?.ok) throw new Error("Error al actualizar perfil");

        const mapeado = mapBackendToForm(actualizado);
        setDatosEmpresa(mapeado);
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
            const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/ofertas`, {
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
        const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/ofertas`);
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
        const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/locales`);
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



    // import { createContext, useContext, useEffect, useMemo, useState } from "react";
    // import { useNavigate } from "react-router-dom";

    // const EmpresaContext = createContext();
    // const BASE_URL = import.meta.env.VITE_API_URL;

    // export const EmpresaProvider = ({ children }) => {
    //   const [empresaId, setEmpresaId] = useState(() => localStorage.getItem("empresaId") || null);
    //   const [datosEmpresa, setDatosEmpresa] = useState(null);

    //   const [ofertasEmpresa, setOfertasEmpresa] = useState([]);
    //   const [localesEmpresa, setLocalesEmpresa] = useState([]);

    //   // Auth gate
    //   const [authChecked, setAuthChecked] = useState(false);
    //   const navigate = useNavigate();
    //   const token =
    //     localStorage.getItem("tokenEmpresa") || sessionStorage.getItem("tokenEmpresa");
    //   const isAuthenticated = useMemo(() => Boolean(token && empresaId), [token, empresaId]);

    //   // Backend -> Form de Perfil
    //   const mapBackendToForm = (raw) => {
    //     const e = raw?.empresa ?? raw ?? {};
    //     return {
    //       company:        e?.NombreEmpresa   ?? e?.company       ?? "",
    //       store:          e?.NombreLocal     ?? e?.store         ?? "",
    //       direccionLocal: e?.DireccionLocal  ?? e?.direccionLocal?? "",
    //       country:        e?.Pais            ?? e?.country       ?? "",
    //       state:          e?.Provincia       ?? e?.state         ?? "",
    //       postalCode:     e?.CodigoPostal    ?? e?.postalCode    ?? "",
    //       name:           e?.NombreAdmin     ?? e?.name          ?? "",
    //       lastname:       e?.ApellidosAdmin  ?? e?.lastname      ?? "",
    //       identity:       e?.NIF             ?? e?.identity      ?? "",
    //       email:          e?.Email           ?? e?.email         ?? "",
    //       phone:          e?.Telefono        ?? e?.phone         ?? "",
    //       instagram:      e?.Instagram       ?? e?.instagram     ?? "",
    //       web:            e?.Web             ?? e?.web           ?? "",
    //       logo:           e?.Logo            ?? raw?.logo        ?? null,
    //     };
    //   };

    //   // Form de Perfil -> Backend
    //   const mapFormToBackend = (form) => ({
    //     NombreEmpresa:  form.company,
    //     NombreLocal:    form.store,
    //     DireccionLocal: form.direccionLocal,
    //     Pais:           form.country,
    //     Provincia:      form.state,
    //     CodigoPostal:   form.postalCode,
    //     NombreAdmin:    form.name,
    //     ApellidosAdmin: form.lastname,
    //     NIF:            form.identity,
    //     Email:          form.email,
    //     Telefono:       form.phone,
    //     Instagram:      form.instagram,
    //     Web:            form.web,
    //     ...(form.password ? { Password: form.password } : {}),
    //   });

    //   // fetch con auth (pone Authorization y maneja FormData/JSON)
    //   const fetchWithAuth = async (pathOrUrl, options = {}) => {
    //     const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
    //     const url = isAbsolute ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;

    //     const headers = {
    //       ...(options.headers || {}),
    //       ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
    //     };

    //     const res = await fetch(url, {
    //       ...options,
    //       headers,
    //       credentials: "include",
    //     });

    //     if (res.status === 401 || res.status === 403) {
    //       // Sesión caducada o inválida → limpiar y mandar a login de empresa
    //       localStorage.removeItem("tokenEmpresa");
    //       localStorage.removeItem("empresaId");
    //       sessionStorage.removeItem("tokenEmpresa");
    //       sessionStorage.removeItem("empresaId");
    //       setEmpresaId(null);
    //       setDatosEmpresa(null);
    //       navigate("/empresa/login", { replace: true });
    //       return null;
    //     }

    //     return res;
    //   };

    //   // Gate de autenticación
    //   useEffect(() => {
    //     if (!token || !empresaId) {
    //       setDatosEmpresa(null);
    //       setAuthChecked(true);
    //       navigate("/empresa/login", { replace: true });
    //       return;
    //     }
    //     setAuthChecked(true);
    //   }, [token, empresaId, navigate]);

    //   // Datos Empresa (solo si autenticado)
    //   const obtenerDatosEmpresa = async () => {
    //     if (!isAuthenticated) return;
    //     try {
    //       const res = await fetchWithAuth(`${BASE_URL}/empresa/perfil/${empresaId}`);
    //       if (!res) return; // ya manejado (401/403)
    //       if (!res.ok) throw new Error(`Error ${res.status}`);
    //       const data = await res.json();
    //       setDatosEmpresa(mapBackendToForm(data));
    //     } catch (error) {
    //       console.error("Error al obtener los datos de la empresa:", error);
    //     }
    //   };

    //   useEffect(() => {
    //     if (!authChecked || !isAuthenticated) return;
    //     obtenerDatosEmpresa();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [authChecked, isAuthenticated, empresaId]);

    //   // Actualizar perfil
    //   const guardarPerfil = async (formDataInput, fotoPerfil) => {
    //     if (!isAuthenticated) throw new Error("No autenticado.");

    //     const payload = mapFormToBackend(formDataInput);

    //     const formData = new FormData();
    //     Object.entries(payload).forEach(([key, value]) => {
    //       if (value !== null && value !== undefined && value !== "") {
    //         formData.append(key, value);
    //       }
    //     });
    //     if (fotoPerfil) formData.append("logo", fotoPerfil);

    //     const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}`, {
    //       method: "PUT",
    //       body: formData,
    //     });
    //     if (!res) return false; // 401/403 ya gestionado
    //     if (!res.ok) throw new Error("Error al actualizar perfil");

    //     const actualizado = await res.json(); // <-- antes faltaba
    //     setDatosEmpresa(mapBackendToForm(actualizado));
    //     return true;
    //   };

    //   // Nuevas ofertas
    //   const guardarOfertas = async (ofertas) => {
    //     if (!isAuthenticated) throw new Error("No autenticado.");
    //     const results = await Promise.all(
    //       (ofertas || []).map(async (oferta) => {
    //         const formData = new FormData();
    //         Object.entries(oferta).forEach(([key, value]) => {
    //           if (value !== null && value !== undefined && value !== "") {
    //             formData.append(key, value);
    //           }
    //         });

    //         try {
    //           const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/ofertas`, {
    //             method: "POST",
    //             body: formData,
    //           });
    //           if (!res) return false;
    //           if (!res.ok) throw new Error("Error al guardar la oferta");
    //           return true;
    //         } catch (error) {
    //           console.error(error);
    //           return false;
    //         }
    //       })
    //     );
    //     return results;
    //   };

    //   // Cargar ofertas
    //   const obtenerOfertas = async () => {
    //     if (!isAuthenticated) return [];
    //     try {
    //       const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/ofertas`);
    //       if (!res) return [];
    //       if (!res.ok) throw new Error("Error al obtener ofertas");
    //       const data = await res.json();
    //       setOfertasEmpresa(data);
    //       return data;
    //     } catch (error) {
    //       console.error("Error al obtener ofertas:", error);
    //       return [];
    //     }
    //   };

    //   // Locales
    //   const obtenerLocales = async () => {
    //     if (!isAuthenticated) return;
    //     try {
    //       const res = await fetchWithAuth(`${BASE_URL}/empresa/${empresaId}/locales`);
    //       if (!res) return;
    //       if (!res.ok) throw new Error("Error al obtener locales");
    //       const data = await res.json();
    //       setLocalesEmpresa(data);
    //     } catch (error) {
    //       console.error("Error al obtener locales:", error);
    //     }
    //   };

    //   return (
    //     <EmpresaContext.Provider
    //       value={{
    //         // auth
    //         isAuthenticated,
    //         authChecked,

    //         // ids/datos
    //         empresaId,
    //         setEmpresaId,
    //         datosEmpresa,

    //         // ofertas/locales
    //         obtenerDatosEmpresa,
    //         guardarPerfil,
    //         guardarOfertas,
    //         obtenerOfertas,
    //         ofertasEmpresa,
    //         obtenerLocales,
    //         localesEmpresa,
    //       }}
    //     >
    //       {children}
    //     </EmpresaContext.Provider>
    //   );
    // };

    // export const useEmpresa = () => useContext(EmpresaContext);
