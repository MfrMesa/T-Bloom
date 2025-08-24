import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
    const [datosCliente, setDatosCliente] = useState(null);
    // const [premiosCliente, setPremiosCliente] = useState([]);
    // const [ofertasCliente, setOfertasCliente] = useState([]);
    const [nivelCliente, setNivelCliente] = useState("Light");

    const navigate = useNavigate();

    //Perfil del cliente
    useEffect(() => {
        const obtenerDatosCliente = async () => {
            try {
                const res = await fetch("http://localhost:3000/cliente/perfil/:id", { credentials: "include" });
                const data = await res.json();

                setDatosCliente(data);

                if (data.nivel) {
                    const nivelNormalizado = data.nivel.charAt(0).toUpperCase() + data.nivel.slice(1).toLowerCase();
                    setNivelCliente(nivelNormalizado);
                }
            } catch (error) {
                console.error("Error al obtener datos del cliente:", error);
            }
        };

        // //Premios del clientes
        // const obtenerPremios = async () => {
        //     try {
        //         const res = await fetch("/api/cliente-premios", { credentials: "include" });
        //         const data = await res.json();
        //         setPremiosCliente(data);
        //     } catch (error) {
        //         console.error("Error al obtener premios:", error);
        //     }
        // };

        // //Ofertas disponibles para el cliente
        // const obtenerOfertas = async () => {
        //     try {
        //         const res = await fetch("/api/cliente-ofertas", { credentials: "include" });
        //         const data = await res.json();
        //         setOfertasCliente(data);
        //     } catch (error) {
        //         console.error("Error al obtener ofertas:", error);
        //     }
        // };

        obtenerDatosCliente();
        // obtenerPremios();
        // obtenerOfertas();
    }, []);

    //Eliminar Perfil del cliente
    const eliminarCuenta = async () => {
        const token = localStorage.getItem("tokenCliente");

        try {
            const res = await fetch("http://localhost:3000/cliente/:id", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
            });

            if (!res.ok) {
                const json = await res.json().catch(() => null);
                throw new Error(json?.mensaje || `Error ${res.status} al eliminar la cuenta`);
            }

            // Limpiar estado y storage
            localStorage.removeItem("tokenCliente");
            setDatosCliente(null);
            // setPremiosCliente([]);
            // setOfertasCliente([]);
            setNivelCliente("Light");

            // Redirigir al login o pantalla inicial
            navigate("/cliente/login");

        } catch (error) {
            console.error("Error eliminando cuenta:", error);
            alert("No se pudo eliminar la cuenta. Intenta de nuevo.");
        }
    };

    return (
        <ClienteContext.Provider
            value={{
                datosCliente,
                // nivelCliente,
                // premiosCliente,
                // ofertasCliente,
                // eliminarCuenta,
            }}
        >
            {children}
        </ClienteContext.Provider>
    );
};

export const useCliente = () => useContext(ClienteContext);
