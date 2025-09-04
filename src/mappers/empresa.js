// // src/mappers/empresa.js
// export const mapBackendToFormEmpresa = (raw) => {
//     const e = raw?.empresa ?? raw ?? {};
//     return {
//     company:        e?.NombreEmpresa   ?? e?.company       ?? "",
//     store:          e?.NombreLocal     ?? e?.store         ?? "",
//     direccionLocal: e?.DireccionLocal  ?? e?.direccionLocal?? "",
//     country:        e?.Pais            ?? e?.country       ?? "",
//     state:          e?.Provincia       ?? e?.state         ?? "",
//     postalCode:     e?.CodigoPostal    ?? e?.postalCode    ?? "",
//     name:           e?.NombreAdmin     ?? e?.name          ?? "",
//     lastname:       e?.ApellidosAdmin  ?? e?.lastname      ?? "",
//     identity:       e?.NIF             ?? e?.identity      ?? "",
//     email:          e?.Email           ?? e?.email         ?? "",
//     phone:          e?.Telefono        ?? e?.phone         ?? "",
//     instagram:      e?.Instagram       ?? e?.instagram     ?? "",
//     web:            e?.Web             ?? e?.web           ?? "",
//     logo:           e?.Logo            ?? raw?.logo        ?? null,
// };
// };

// export const mapFormToBackendEmpresa = (form) => ({
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
// });
