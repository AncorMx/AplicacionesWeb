/**
 * Clave para almacenar los favoritos en el LocalStorage
 */
const STORAGE_KEY = 'rick_morty_favorites';

/**
 * Objeto Store que centraliza el estado de la aplicación y la lógica de datos
 */
export const store = {
    // Estado inicial
    state: {
        characters: [], // Lista de personajes cargados actualmente
        favorites: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [], // Favoritos desde LocalStorage
        currentPage: 1, // Página actual para la paginación
        totalPages: 1,  // Total de páginas disponibles
        filters: {
            name: '',   // Filtro por nombre
            status: 'all' // Filtro por estado (alive, dead, unknown)
        }
    },

    /**
     * Alterna un personaje entre favoritos (lo añade o lo quita)
     * 
     * @param {Object} character - El objeto del personaje
     * @returns {boolean} True si se añadió, False si se eliminó
     */
    toggleFavorite(character) {
        const index = this.state.favorites.findIndex(f => f.id === character.id);
        
        if (index === -1) {
            // Si no existe, lo agregamos a la lista
            this.state.favorites.push({
                id: character.id,
                name: character.name,
                image: character.image
            });
        } else {
            // Si ya existe, lo eliminamos
            this.state.favorites.splice(index, 1);
        }

        this.saveFavorites(); // Persistimos los cambios
        return index === -1;
    },

    /**
     * Guarda la lista de favoritos actual en el LocalStorage del navegador
     */
    saveFavorites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.favorites));
    },

    /**
     * Verifica si un personaje ya está en la lista de favoritos
     * 
     * @param {number} id - ID del personaje
     */
    isFavorite(id) {
        return this.state.favorites.some(f => f.id === id);
    }
};
