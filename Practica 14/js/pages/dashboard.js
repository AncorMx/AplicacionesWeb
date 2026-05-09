import { fetchCharacters } from '../core/api.js';
import { store } from '../state/store.js';

// ==========================================
// Referencias al DOM
// ==========================================
const charactersGrid = document.getElementById('charactersGrid');
const loader = document.getElementById('loader');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('characterSearch');
const statusFilter = document.getElementById('statusFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const favoritesList = document.getElementById('favoritesList');

// ==========================================
// Variable para controlar el debounce de búsqueda
// ==========================================
let searchTimeout = null;

// ==========================================
// RENDERIZADO DINÁMICO
// ==========================================

/**
 * Carga personajes desde la API y actualiza el grid del DOM.
 * Maneja el loader, errores y el estado vacío.
 */
export async function loadCharacters() {
    // Mostrar loader y ocultar mensaje de "sin resultados"
    showLoader();
    noResults.classList.add('hidden');

    try {
        const { currentPage, filters } = store.state;

        // Petición fetch al endpoint /character con filtros
        const data = await fetchCharacters(currentPage, filters);

        // Actualizamos el estado con los datos recibidos
        store.state.characters = data.results || [];
        store.state.totalPages = data.info ? data.info.pages : 0;

        // Renderizamos las tarjetas en el grid
        renderCharacters(store.state.characters);

        // Actualizamos los controles de paginación
        updatePagination(data.info);

    } catch (error) {
        // Mostramos el mensaje de error al usuario
        charactersGrid.innerHTML = '';
        noResults.querySelector('p').textContent = error.message || 'Ocurrió un error al cargar los personajes.';
        noResults.classList.remove('hidden');
        updatePagination(null);
    }
}

/**
 * Renderiza las tarjetas de personajes en el grid principal.
 * Limpia el contenedor antes de inyectar el nuevo HTML.
 * 
 * @param {Object[]} characters - Array de personajes de la API
 */
function renderCharacters(characters) {
    // Limpiar el contenedor principal
    charactersGrid.innerHTML = '';

    // Si no hay personajes, mostrar estado vacío
    if (!characters || characters.length === 0) {
        noResults.querySelector('p').textContent = 'No characters found matching your criteria.';
        noResults.classList.remove('hidden');
        return;
    }

    // Generar una tarjeta HTML por cada personaje
    characters.forEach((character, index) => {
        const card = createCharacterCard(character, index);
        charactersGrid.appendChild(card);
    });

    // Re-inicializar los iconos de Lucide para los nuevos elementos
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Crea el elemento HTML de una tarjeta de personaje usando la
 * estructura proporcionada en resursos.md
 * 
 * @param {Object} character - Objeto del personaje de la API
 * @param {number} index - Índice para la animación escalonada
 * @returns {HTMLElement} Elemento div de la tarjeta
 */
function createCharacterCard(character, index) {
    const card = document.createElement('div');
    card.classList.add('character-card');
    // Animación escalonada para cada tarjeta
    card.style.animationDelay = `${index * 0.05}s`;

    // Determinar la clase CSS condicional según el estado
    const statusClass = `status-${character.status.toLowerCase()}`;
    const isFav = store.isFavorite(character.id);

    // HTML dinámico basado en la estructura de resursos.md
    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${character.image}" alt="${character.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="character-name">${character.name}</h3>
            <div class="status-label ${statusClass}">
                <span class="status-indicator"></span>
                ${character.status}
            </div>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${character.id}">
                <i data-lucide="star"></i>
                <span>${isFav ? 'Remove Favorite' : 'Add Favorite'}</span>
            </button>
        </div>
    `;

    // Event listener para el botón de favoritos
    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', () => {
        handleToggleFavorite(character, favBtn);
    });

    return card;
}

// ==========================================
// SISTEMA DE FAVORITOS
// ==========================================

/**
 * Maneja el toggle de favoritos: actualiza el store, la tarjeta
 * y la sidebar de favoritos.
 * 
 * @param {Object} character - Objeto del personaje
 * @param {HTMLElement} btn - Botón de favorito clickeado
 */
function handleToggleFavorite(character, btn) {
    const wasAdded = store.toggleFavorite(character);

    // Actualizar el botón visualmente
    if (wasAdded) {
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Remove Favorite';
    } else {
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Add Favorite';
    }

    // Re-inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Actualizar la sidebar de favoritos
    renderFavorites();
}

/**
 * Renderiza la lista de favoritos en la sidebar.
 * Usa la estructura proporcionada en resursos.md
 */
export function renderFavorites() {
    const favorites = store.state.favorites;

    // Si no hay favoritos, mostrar mensaje vacío
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-favorites">
                <p>No favorites yet</p>
            </div>
        `;
        return;
    }

    // Limpiar y reconstruir la lista
    favoritesList.innerHTML = '';

    favorites.forEach(fav => {
        const item = document.createElement('div');
        item.classList.add('fav-item');

        // HTML basado en la estructura de recurso de favoritos
        item.innerHTML = `
            <img src="${fav.image}" alt="${fav.name}">
            <div class="fav-item-info">
                <p class="fav-item-name">${fav.name}</p>
            </div>
            <button class="remove-fav" data-id="${fav.id}">
                <i data-lucide="x"></i>
            </button>
        `;

        // Event listener para el botón de eliminar favorito
        const removeBtn = item.querySelector('.remove-fav');
        removeBtn.addEventListener('click', () => {
            // Eliminamos del store (toggle lo quita si ya existe)
            store.toggleFavorite(fav);
            renderFavorites();

            // Actualizar el botón en el grid si la tarjeta está visible
            const gridBtn = charactersGrid.querySelector(`.fav-btn[data-id="${fav.id}"]`);
            if (gridBtn) {
                gridBtn.classList.remove('active');
                gridBtn.querySelector('span').textContent = 'Add Favorite';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });

        favoritesList.appendChild(item);
    });

    // Re-inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ==========================================
// PAGINACIÓN
// ==========================================

/**
 * Actualiza los controles de paginación según la info de la API.
 * Deshabilita botones si no hay más páginas.
 * 
 * @param {Object|null} info - Objeto info de la respuesta de la API
 */
function updatePagination(info) {
    if (!info || info.pages === 0) {
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        pageInfo.textContent = 'Page 0 of 0';
        return;
    }

    // Mostrar página actual y total
    pageInfo.textContent = `Page ${store.state.currentPage} of ${info.pages}`;

    // Deshabilitar botones según info.prev e info.next
    prevPageBtn.disabled = info.prev === null;
    nextPageBtn.disabled = info.next === null;
}

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Muestra el loader en el grid
 */
function showLoader() {
    charactersGrid.innerHTML = `
        <div class="loader-container" id="loader">
            <div class="loader"></div>
        </div>
    `;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Inicializa todos los event listeners del dashboard
 */
export function initEventListeners() {
    // Búsqueda por nombre con debounce (espera 400ms después de dejar de escribir)
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            store.state.filters.name = e.target.value;
            store.state.currentPage = 1; // Reiniciar a la primera página
            loadCharacters();
        }, 400);
    });

    // Filtro de estado
    statusFilter.addEventListener('change', (e) => {
        store.state.filters.status = e.target.value;
        store.state.currentPage = 1; // Reiniciar a la primera página
        loadCharacters();
    });

    // Botón de página anterior
    prevPageBtn.addEventListener('click', () => {
        if (store.state.currentPage > 1) {
            store.state.currentPage--;
            loadCharacters();
            // Scroll hacia arriba para ver los nuevos resultados
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Botón de página siguiente
    nextPageBtn.addEventListener('click', () => {
        if (store.state.currentPage < store.state.totalPages) {
            store.state.currentPage++;
            loadCharacters();
            // Scroll hacia arriba para ver los nuevos resultados
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}
