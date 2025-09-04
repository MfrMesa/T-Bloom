// // src/mappers/cliente.js
// export const mapBackendToFormCliente = (raw) => {
//     const c = raw?.cliente ?? raw ?? {};
//     return {
//         name:            c?.Nombre ?? c?.name ?? "",
//         lastname:        c?.Apellidos ?? c?.lastname ?? "",
//         fechaNacimiento: (c?.FechaNacimiento ?? c?.fechaNacimiento ?? "").slice(0, 10),
//         email:           c?.Email ?? c?.email ?? "",
//         phone:           c?.Telefono ?? c?.phone ?? "",
//     };
//     };

//     export const mapFormToBackendCliente = (form) => ({
//     Nombre:          form.name,
//     Apellidos:       form.lastname,
//     FechaNacimiento: form.fechaNacimiento, // "YYYY-MM-DD"
//     Email:           form.email,
//     Telefono:        form.phone,
//     ...(form.password ? { Password: form.password } : {}),
//     });

//     export const normalizarNivelCliente = (raw) => {
//     const nivel =
//         raw?.cliente?.Nivel?.Nombre ??
//         raw?.cliente?.nivel ??
//         raw?.nivel ??
//         raw?.Nivel?.Nombre ??
//         null;

//     if (!nivel || typeof nivel !== "string") return "Light";
//     const n = nivel.trim();
//     return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
// };
