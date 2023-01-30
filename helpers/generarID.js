
// Generar un ID unico para el registro de un veterinario
const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

export default generarId;