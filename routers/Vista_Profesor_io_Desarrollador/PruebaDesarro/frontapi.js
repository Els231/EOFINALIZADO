/**
 * Cliente API REST para el Sistema de Gestión Escolar
 * Proporciona funciones para conectar el frontend con la API REST
 */

class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API Error en ${endpoint}:`, error);
            throw error;
        }
    }

    // ================================
    // MÉTODOS PARA ESTUDIANTES
    // ================================

    async getEstudiantes(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/estudiantes?${queryParams}`);
    }

    async getEstudiante(id) {
        return this.request(`/estudiantes/${id}`);
    }

    async createEstudiante(data) {
        return this.request('/estudiantes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateEstudiante(id, data) {
        return this.request(`/estudiantes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteEstudiante(id) {
        return this.request(`/estudiantes/${id}`, {
            method: 'DELETE'
        });
    }

    // ================================
    // MÉTODOS PARA PROFESORES
    // ================================

    async getProfesores(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/profesores?${queryParams}`);
    }

    async createProfesor(data) {
        return this.request('/profesores', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateProfesor(id, data) {
        return this.request(`/profesores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteProfesor(id) {
        return this.request(`/profesores/${id}`, {
            method: 'DELETE'
        });
    }

    // ================================
    // MÉTODOS PARA NOTAS
    // ================================

    async getNotas(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/notas?${queryParams}`);
    }

    async createNota(data) {
        return this.request('/notas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateNota(id, data) {
        return this.request(`/notas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteNota(id) {
        return this.request(`/notas/${id}`, {
            method: 'DELETE'
        });
    }

    // ================================
    // MÉTODOS PARA MATRÍCULAS
    // ================================

    async getMatriculas(params = {}) {
        const queryParams = new URLSearchParams(params);
        return this.request(`/matriculas?${queryParams}`);
    }

    async createMatricula(data) {
        return this.request('/matriculas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ================================
    // MÉTODOS PARA ESTADÍSTICAS
    // ================================

    async getDashboardStats() {
        return this.request('/estadisticas/dashboard');
    }

    // ================================
    // BÚSQUEDA GLOBAL
    // ================================

    async buscarGlobal(query) {
        return this.request(`/buscar?q=${encodeURIComponent(query)}`);
    }

    // ================================
    // EXPORTACIÓN
    // ================================

    async exportarColeccion(collection) {
        return this.request(`/exportar/${collection}`);
    }

    // ================================
    // HEALTH CHECK
    // ================================

    async healthCheck() {
        return this.request('/health');
    }
}

// Crear instancia global de la API
window.apiClient = new ApiClient();

// Funciones de utilidad para integrar con el sistema existente
async function syncWithAPI() {
    try {
        const health = await window.apiClient.healthCheck();
        console.log('✅ API REST conectada:', health.message);
        
        // Mostrar indicador de conexión API
        showApiStatus(true);
        return true;
    } catch (error) {
        console.warn('⚠️ API REST no disponible, usando localStorage:', error.message);
        showApiStatus(false);
        return false;
    }
}

function showApiStatus(connected) {
    const statusElement = document.getElementById('api-status');
    if (statusElement) {
        statusElement.innerHTML = connected 
            ? '<i class="fas fa-wifi text-success"></i> API Conectada'
            : '<i class="fas fa-wifi text-warning"></i> Modo Local';
    }
}

// Función híbrida que usa API o localStorage según disponibilidad
async function hybridDataOperation(operation, collection, data = null) {
    const isApiAvailable = await syncWithAPI();
    
    if (isApiAvailable) {
        try {
            switch (operation) {
                case 'read':
                    return await window.apiClient.request(`/${collection}`);
                case 'create':
                    return await window.apiClient.request(`/${collection}`, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                // Agregar más operaciones según sea necesario
            }
        } catch (error) {
            console.warn('Fallback a localStorage debido a error de API:', error);
        }
    }
    
    // Fallback a localStorage
    return performLocalStorageOperation(operation, collection, data);
}

function performLocalStorageOperation(operation, collection, data) {
    // Integrar con el sistema de database.js existente
    switch (operation) {
        case 'read':
            return db.read(collection);
        case 'create':
            return db.create(collection, data);
        case 'update':
            return db.update(collection, data.id, data);
        case 'delete':
            return db.delete(collection, data.id);
        default:
            throw new Error(`Operación no soportada: ${operation}`);
    }
}

// Inicializar conexión API al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Agregar indicador de estado de API al header
    const headerTools = document.querySelector('.btn-toolbar');
    if (headerTools) {
        const apiStatus = document.createElement('div');
        apiStatus.id = 'api-status';
        apiStatus.className = 'btn btn-sm btn-outline-info me-2';
        apiStatus.innerHTML = '<i class="fas fa-wifi"></i> Conectando...';
        headerTools.prepend(apiStatus);
    }
    
    // Verificar conexión API
    syncWithAPI();
});

console.log('✅ Frontend API client cargado correctamente');