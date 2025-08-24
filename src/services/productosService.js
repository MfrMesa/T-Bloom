// /src/services/productosService.js

export async function guardarProductos(productos) {
    try {
        const response = await fetch("/api/productos", {
            method: "POST", // o "PUT" si estás actualizando
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productos }),
        });

        if (!response.ok) {
            throw new Error("Error al guardar productos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en guardarProductos:", error);
        throw error;
    }
}
