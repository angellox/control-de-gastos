export const generarId = () => {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36);
    return random + fecha;
}
export const formatDate = dateCurrent => {
    const fecha = new Date(dateCurrent);
    const conf = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };

    return fecha.toLocaleDateString('es-ES', conf);
};