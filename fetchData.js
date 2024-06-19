// fetchData.js - Módulo para manejar la carga de datos
export async function fetchData(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error al realizar la petición:', error);
        return null;
    }
}
