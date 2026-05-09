/**
 * URL base de la API de Rick and Morty
 */
const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Obtiene una lista de personajes desde la API con soporte para
 * paginación y filtros (nombre y estado).
 * 
 * @param {number} page - Número de página a consultar
 * @param {Object} filters - Objeto con los filtros a aplicar
 * @param {string} filters.name - Filtro por nombre del personaje
 * @param {string} filters.status - Filtro por estado (alive, dead, unknown)
 * @returns {Promise<Object>} Objeto con info de paginación y resultados
 * @throws {Error} Si la petición falla o no hay resultados
 */
export async function fetchCharacters(page = 1, filters = {}) {
    try {
        // Construimos la URL con los query parameters
        let url = `${BASE_URL}/character/?page=${page}`;

        // Añadimos el filtro de nombre si existe
        if (filters.name && filters.name.trim() !== '') {
            url += `&name=${encodeURIComponent(filters.name.trim())}`;
        }

        // Añadimos el filtro de estado si no es 'all'
        if (filters.status && filters.status !== 'all') {
            url += `&status=${encodeURIComponent(filters.status)}`;
        }

        const response = await fetch(url);

        // Si la API devuelve 404, significa que no hay resultados
        if (response.status === 404) {
            return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
        }

        // Para cualquier otro error HTTP, lanzamos una excepción
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // Si es un error de red (sin conexión, DNS, etc.)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('Error de red: No se pudo conectar con la API.', error);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        }

        // Re-lanzamos el error para que lo maneje el llamador
        console.error('Error al obtener personajes:', error);
        throw error;
    }
}

/**
 * Obtiene múltiples personajes por sus IDs.
 * Útil para cargar los personajes favoritos desde localStorage.
 * 
 * @param {number[]} ids - Array de IDs de personajes
 * @returns {Promise<Object[]>} Array de objetos de personaje
 * @throws {Error} Si la petición falla
 */
export async function fetchCharactersByIds(ids) {
    // Si no hay IDs, retornamos un array vacío
    if (!ids || ids.length === 0) {
        return [];
    }

    try {
        const url = `${BASE_URL}/character/${ids.join(',')}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // La API retorna un objeto si solo hay un ID, o un array si hay varios
        return Array.isArray(data) ? data : [data];

    } catch (error) {
        console.error('Error al obtener personajes por IDs:', error);
        throw error;
    }
}
