export const createEmptyPremio = () => ({
    id: crypto.randomUUID(),
    nombre: "",
    descripcion: "",
    foto: null,
    niveles: { light: false, spark: false, flame: false, aura: false }
});

export const handleImageChange = (e, id, premios, setPremios) => {
    const file = e.target.files[0];
    if (file) {
        const newUrl = URL.createObjectURL(file);
        setPremios(prev =>
            prev.map(item =>
                item.id === id ? { ...item, foto: newUrl } : item
            )
        );
    }
};

export const guardarPremios = async (premios) => {
    const formData = new FormData();
    premios.forEach((premio, index) => {
        formData.append(`premios[${index}][nombre]`, premio.nombre);
        formData.append(`premios[${index}][descripcion]`, premio.descripcion);
        formData.append(`premios[${index}][niveles]`, JSON.stringify(premio.niveles));
        if (premio.foto instanceof File) {
            formData.append(`premios[${index}][foto]`, premio.foto);
        }
    });

    const response = await fetch("/api/premios", {
        method: "POST",
        body: formData
    });

    if (!response.ok) throw new Error("Error al guardar premios");
};
