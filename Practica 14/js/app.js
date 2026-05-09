import { loadCharacters, renderFavorites, initEventListeners } from './pages/dashboard.js';

/**
 * Punto de entrada principal de la aplicación.
 * Se ejecuta cuando el DOM está completamente cargado.
 * 
 * Inicializa:
 * 1. Los iconos de Lucide
 * 2. Los event listeners (búsqueda, filtros, paginación)
 * 3. La carga inicial de personajes desde la API
 * 4. La sidebar de favoritos desde localStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Configurar todos los event listeners
    initEventListeners();

    // Cargar personajes de la primera página
    loadCharacters();

    // Renderizar favoritos guardados en localStorage
    renderFavorites();
});
