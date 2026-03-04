/**
 * Parsea y valida parámetros de paginación desde query string.
 *
 * @param {Object} query - req.query
 * @param {Object} [defaults] - Valores por defecto
 * @param {number} [defaults.limit=20] - Límite por defecto
 * @param {number} [defaults.maxLimit=100] - Límite máximo permitido
 * @returns {{ page: number, limit: number, offset: number }}
 */
const parsePagination = (query = {}, defaults = {}) => {
    const maxLimit = defaults.maxLimit || 100;
    const defaultLimit = defaults.limit || 20;

    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = defaultLimit;
    if (limit > maxLimit) limit = maxLimit;

    const offset = (page - 1) * limit;

    return { page, limit, offset };
};

/**
 * Construye el objeto de metadatos de paginación.
 *
 * @param {number} totalItems - Total de registros
 * @param {number} page - Página actual
 * @param {number} limit - Registros por página
 * @returns {Object} Metadata de paginación
 */
const buildPaginationMeta = (totalItems, page, limit) => {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

module.exports = { parsePagination, buildPaginationMeta };
