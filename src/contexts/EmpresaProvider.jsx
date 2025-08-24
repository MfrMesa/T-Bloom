import { createContext, useContext, useEffect, useState } from "react";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
    const [datosEmpresa, setDatosEmpresa] = useState(null);
    // const [premiosEmpresa, setPremiosEmpresa] = useState([]);
    // const [premiosCargados, setPremiosCargados] = useState(false);
    // const [productosEmpresa, setProductosEmpresa] = useState([]);
    // const [localesEmpresa, setLocalesEmpresa] = useState([]);
    // const [ofertasEmpresa, setOfertasEmpresa] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        obtenerDatosEmpresa();
    }, []);

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem("tokenEmpresa");
        const headers = {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const res = await fetch(BASE_URL + url, {
            ...options,
            headers,
            credentials: "include"
        });

        if (res.status === 401 || res.status === 403) {
            console.warn("Acceso no autorizado");
            return null;
        }

        return res;
    };

    //Datos empresa

    const obtenerDatosEmpresa = async () => {
        try {
            const res = await fetchWithAuth("http://localhost:3000/empresa/:id");
            if (!res) return;
            const data = await res.json();
            setDatosEmpresa(data);
        } catch (error) {
            console.error("Error al obtener los datos de la empresa:", error);
        }
    };


    // const obtenerDatosCliente = async () => {
    //     try {
    //         const res = await fetchWithAuth("/api/cliente-datos");
    //         if (!res) return;
    //         const data = await res.json();
    //         setDatosCliente(data);
    //     } catch (error) {
    //         console.error("Error al obtener los datos del cliente:", error);
    //     }
    // };

    // const guardarPerfilCliente = async (formDataInput, fotoPerfil) => {
    //     const formData = new FormData();
    //     Object.entries(formDataInput).forEach(([key, value]) => {
    //         if (value) formData.append(key, value);
    //     });
    //     if (fotoPerfil) formData.append("foto", fotoPerfil);

    //     try {
    //         const res = await fetchWithAuth("/api/cliente-actualizar", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         if (!res?.ok) throw new Error("Error al actualizar perfil del cliente");

    //         await obtenerDatosCliente();
    //         return true;
    //     } catch (error) {
    //         console.error("Error al guardar perfil del cliente:", error);
    //         throw error;
    //     }
    // };

    //Crear nueva oferta empresa
    const guardarOfertas = async (ofertas) => {
        const results = await Promise.all(
            ofertas.map(async (oferta) => {
                const formData = new FormData();
                Object.entries(oferta).forEach(([key, value]) => {
                    if (value) formData.append(key, value);
                });

                try {
                    const res = await fetchWithAuth("http://localhost:3000/oferta", {
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


    //Traer todas las ofertas de la empresa 
    const obtenerOfertas = async () => {
        try {
            const res = await fetchWithAuth("http://localhost:3000/ofertas");
            if (!res?.ok) throw new Error("Error al obtener ofertas");
            const data = await res.json();
            setOfertasEmpresa(data);
            return data;
        } catch (error) {
            console.error("Error al obtener ofertas:", error);
            return [];
        }
    };


    //Todos los Premios de la empresa (Recompensas)
    // const obtenerPremios = async () => {
    //     if (premiosCargados) return;
    //     try {
    //         const res = await fetchWithAuth("/api/obtener-premios");
    //         if (!res?.ok) throw new Error("Error al obtener premios");
    //         const data = await res.json();
    //         setPremiosEmpresa(data);
    //         setPremiosCargados(true);
    //     } catch (error) {
    //         console.error("Error al obtener premios:", error);
    //     }
    // };
    
    //Crear premios empresa
    // const guardarPremios = async (premios) => {
    //     const results = await Promise.all(
    //         premios.map(async (premio) => {
    //             const formData = new FormData();
    //             Object.entries(premio).forEach(([key, value]) => {
    //                 if (key === "foto" && value instanceof File) {
    //                     formData.append("foto", value);
    //                 } else if (value !== null && value !== undefined) {
    //                     formData.append(key, value);
    //                 }
    //             });

    //             try {
    //                 const res = await fetchWithAuth("/api/guardar-premio", {
    //                     method: "POST",
    //                     body: formData,
    //                 });
    //                 if (!res?.ok) throw new Error("Error al guardar el premio");
    //                 return true;
    //             } catch (error) {
    //                 console.error("Error guardando premio:", error);
    //                 return false;
    //             }
    //         })
    //     );

    //     setPremiosCargados(false);
    //     await obtenerPremios();
    //     return results;
    // };

    //Productos empresa (Todos)
    // const obtenerProductos = async () => {
    //     try {
    //         const res = await fetchWithAuth("/api/obtener-productos");
    //         if (!res?.ok) throw new Error("Error al obtener productos");
    //         const data = await res.json();
    //         setProductosEmpresa(data);
    //     } catch (error) {
    //         console.error("Error al obtener productos:", error);
    //     }
    // };

    //Crear nuevo producto empresa
    // const guardarProductos = async (productos) => {
    //     const results = await Promise.all(
    //         productos.map(async (producto) => {
    //             try {
    //                 const res = await fetchWithAuth("/api/guardar-producto", {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify(producto),
    //                 });
    //                 if (!res?.ok) throw new Error("Error al guardar producto");
    //                 return true;
    //             } catch (error) {
    //                 console.error("Error al guardar producto:", error);
    //                 return false;
    //             }
    //         })
    //     );
    //     return results;
    // };

    //Perfil empresa
    const guardarPerfil = async (formDataInput, fotoPerfil) => {
        const formData = new FormData();
        Object.entries(formDataInput).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        if (fotoPerfil) formData.append("logo", fotoPerfil);

        try {
            const res = await fetchWithAuth("http://localhost:3000/empresa/:id", {
                method: "UPDATE",
                body: formData,
            });

            if (!res?.ok) throw new Error("Error al actualizar perfil");

            await obtenerDatosEmpresa();
            return true;
        } catch (error) {
            console.error("Error al guardar perfil:", error);
            throw error;
        }
    };

    //Locales de la empresa
    const obtenerLocales = async () => {
        try {
            const res = await fetchWithAuth("/api/obtener-locales");
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
                guardarOfertas,
                obtenerOfertas,
                guardarPerfil,
                obtenerLocales,
                datosEmpresa,
                // guardarPremios,
                // premiosEmpresa,
                // obtenerPremios,
                // productosEmpresa,
                // obtenerProductos,
                // guardarProductos,
                // localesEmpresa,
                // ofertasEmpresa,
            }}
        >
            {children}
        </EmpresaContext.Provider>
    );
};

export const useEmpresa = () => useContext(EmpresaContext);
