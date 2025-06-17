/**
 * Sistema de base de datos local para el Sistema de Gestión Escolar
 * Utiliza localStorage para persistencia de datos
 */

class LocalDatabase {
    constructor() {
        this.prefix = 'escuela_';
        this.collections = [
            'estudiantes',
            'profesores', 
            'tutores',
            'matriculas',
            'inscripciones',
            'notas',
            'eventos',
            'turnos',
            'materias',
            'ocupaciones',
            'sistema',
            'logs'
        ];
        this.initializeCollections();
    }

    // Inicializar colecciones si no existen
    initializeCollections() {
        this.collections.forEach(collection => {
            if (!this.exists(collection)) {
                this.initializeCollection(collection);
            }
        });
    }

    // Verificar si una colección existe
    exists(collection) {
        return localStorage.getItem(this.prefix + collection) !== null;
    }

    // Inicializar una colección específica
    initializeCollection(collection) {
        let initialData = [];
        
        // Datos iniciales según la colección
        switch(collection) {
            case 'turnos':
                initialData = [
                    { id: '1', nombre: 'Matutino', hora_inicio: '07:00', hora_fin: '12:00', activo: true },
                    { id: '2', nombre: 'Vespertino', hora_inicio: '13:00', hora_fin: '18:00', activo: true }
                ];
                break;
            case 'materias':
                initialData = [
                    { id: '1', nombre: 'Lengua Española', codigo: 'ESP', creditos: 4, activa: true },
                    { id: '2', nombre: 'Matemáticas', codigo: 'MAT', creditos: 4, activa: true },
                    { id: '3', nombre: 'Ciencias Naturales', codigo: 'CN', creditos: 3, activa: true },
                    { id: '4', nombre: 'Ciencias Sociales', codigo: 'CS', creditos: 3, activa: true },
                    { id: '5', nombre: 'Inglés', codigo: 'ING', creditos: 2, activa: true },
                    { id: '6', nombre: 'Educación Física', codigo: 'EF', creditos: 2, activa: true },
                    { id: '7', nombre: 'Educación Artística', codigo: 'EA', creditos: 2, activa: true },
                    { id: '8', nombre: 'Formación Integral, Humana y Religiosa', codigo: 'FIHR', creditos: 2, activa: true }
                ];
                break;
            case 'ocupaciones':
                initialData = [
                    { id: '1', nombre: 'Empleado/a' },
                    { id: '2', nombre: 'Comerciante' },
                    { id: '3', nombre: 'Profesional' },
                    { id: '4', nombre: 'Ama de Casa' },
                    { id: '5', nombre: 'Estudiante' },
                    { id: '6', nombre: 'Jubilado/a' },
                    { id: '7', nombre: 'Desempleado/a' },
                    { id: '8', nombre: 'Otro' }
                ];
                break;
            case 'sistema':
                initialData = [{
                    id: 'config',
                    nombre: 'Escuela Jesús El Buen Maestro',
                    codigo: 'EJBM-001',
                    telefono: '809-123-4567',
                    email: 'info@escuelajesuselbuenmaestro.edu.do',
                    direccion: 'Santo Domingo, República Dominicana',
                    director: '',
                    anoFundacion: '',
                    mision: '',
                    vision: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }];
                break;
        }
        
        this.write(collection, initialData);
    }

    // Leer toda una colección
    read(collection) {
        try {
            const data = localStorage.getItem(this.prefix + collection);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error leyendo colección ${collection}:`, error);
            return [];
        }
    }

    // Escribir toda una colección
    write(collection, data) {
        try {
            localStorage.setItem(this.prefix + collection, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error escribiendo colección ${collection}:`, error);
            return false;
        }
    }

    // Encontrar un registro por ID
    find(collection, id) {
        const data = this.read(collection);
        return data.find(item => item.id === id);
    }

    // Encontrar registros que cumplan una condición
    findWhere(collection, criteria) {
        const data = this.read(collection);
        return data.filter(item => {
            return Object.entries(criteria).every(([key, value]) => item[key] === value);
        });
    }

    // Crear un nuevo registro
    create(collection, record) {
        try {
            const data = this.read(collection);
            
            // Generar ID si no existe
            if (!record.id) {
                record.id = this.generateId();
            }
            
            // Agregar timestamps
            record.created_at = new Date().toISOString();
            record.updated_at = new Date().toISOString();
            
            // Verificar que no exista un registro con el mismo ID
            const existingIndex = data.findIndex(item => item.id === record.id);
            if (existingIndex !== -1) {
                throw new Error(`Ya existe un registro con ID ${record.id} en ${collection}`);
            }
            
            data.push(record);
            this.write(collection, data);
            
            // Registrar en logs
            this.logAction('create', collection, record.id, 'Registro creado');
            
            return record;
        } catch (error) {
            console.error(`Error creando registro en ${collection}:`, error);
            throw error;
        }
    }

    // Actualizar un registro
    update(collection, id, updates) {
        try {
            const data = this.read(collection);
            const index = data.findIndex(item => item.id === id);
            
            if (index === -1) {
                throw new Error(`Registro con ID ${id} no encontrado en ${collection}`);
            }
            
            // Actualizar campos
            updates.updated_at = new Date().toISOString();
            Object.assign(data[index], updates);
            
            this.write(collection, data);
            
            // Registrar en logs
            this.logAction('update', collection, id, `Campos actualizados: ${Object.keys(updates).join(', ')}`);
            
            return data[index];
        } catch (error) {
            console.error(`Error actualizando registro ${id} en ${collection}:`, error);
            throw error;
        }
    }

    // Eliminar un registro
    delete(collection, id) {
        try {
            const data = this.read(collection);
            const index = data.findIndex(item => item.id === id);
            
            if (index === -1) {
                throw new Error(`Registro con ID ${id} no encontrado en ${collection}`);
            }
            
            const deletedRecord = data.splice(index, 1)[0];
            this.write(collection, data);
            
            // Registrar en logs
            this.logAction('delete', collection, id, 'Registro eliminado');
            
            return deletedRecord;
        } catch (error) {
            console.error(`Error eliminando registro ${id} en ${collection}:`, error);
            throw error;
        }
    }

    // Contar registros en una colección
    count(collection) {
        return this.read(collection).length;
    }

    // Buscar registros por texto
    search(collection, query, fields = []) {
        const data = this.read(collection);
        
        if (!query) return data;
        
        const searchQuery = query.toLowerCase();
        
        return data.filter(item => {
            // Si no se especifican campos, buscar en todos los campos de texto
            const searchFields = fields.length > 0 ? fields : 
                Object.keys(item).filter(key => typeof item[key] === 'string');
            
            return searchFields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(searchQuery);
            });
        });
    }

    // Paginar resultados
    paginate(collection, page = 1, limit = 10, filters = {}) {
        let data = this.read(collection);
        
        // Aplicar filtros
        if (Object.keys(filters).length > 0) {
            data = data.filter(item => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === null || value === undefined) return true;
                    return item[key] === value;
                });
            });
        }
        
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
            data: data.slice(startIndex, endIndex),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Registrar acción en logs
    logAction(action, collection, recordId, details = '') {
        try {
            const logEntry = {
                id: this.generateId(),
                action,
                collection,
                recordId,
                details,
                timestamp: new Date().toISOString(),
                user: 'sistema'
            };
            
            const logs = this.read('logs');
            logs.push(logEntry);
            
            // Mantener solo los últimos 1000 logs
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            this.write('logs', logs);
        } catch (error) {
            console.error('Error registrando log:', error);
        }
    }

    // Obtener logs del sistema
    getLogs(limit = 50) {
        const logs = this.read('logs');
        return logs.slice(-limit).reverse(); // Últimos logs primero
    }

    // Limpiar colección
    clear(collection) {
        try {
            this.write(collection, []);
            this.logAction('clear', collection, null, 'Colección limpiada');
            return true;
        } catch (error) {
            console.error(`Error limpiando colección ${collection}:`, error);
            return false;
        }
    }

    // Limpiar todas las colecciones
    clearAll() {
        try {
            this.collections.forEach(collection => {
                if (collection !== 'sistema') { // No limpiar configuración del sistema
                    this.clear(collection);
                }
            });
            this.logAction('clear_all', 'sistema', null, 'Todas las colecciones limpiadas');
            return true;
        } catch (error) {
            console.error('Error limpiando todas las colecciones:', error);
            return false;
        }
    }

    // Obtener estadísticas de almacenamiento
    getStorageStats() {
        try {
            let totalSize = 0;
            const collectionSizes = {};
            
            this.collections.forEach(collection => {
                const data = localStorage.getItem(this.prefix + collection);
                const size = data ? new Blob([data]).size : 0;
                collectionSizes[collection] = size;
                totalSize += size;
            });
            
            return {
                totalSize,
                totalSizeFormatted: this.formatBytes(totalSize),
                collections: collectionSizes,
                totalCollections: this.collections.length,
                totalRecords: this.collections.reduce((total, collection) => total + this.count(collection), 0)
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de almacenamiento:', error);
            return null;
        }
    }

    // Formatear bytes
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Exportar todos los datos
    exportAll() {
        const exportData = {};
        
        this.collections.forEach(collection => {
            exportData[collection] = this.read(collection);
        });
        
        return {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: exportData
        };
    }

    // Importar datos
    importAll(importData) {
        try {
            if (!importData.data) {
                throw new Error('Formato de datos inválido');
            }
            
            Object.entries(importData.data).forEach(([collection, data]) => {
                if (this.collections.includes(collection) && Array.isArray(data)) {
                    this.write(collection, data);
                }
            });
            
            this.logAction('import', 'sistema', null, 'Datos importados completamente');
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            throw error;
        }
    }
}

// Inicializar base de datos
function initializeDatabase() {
    window.db = new LocalDatabase();
    console.log('✅ Base de datos local inicializada');
}


// Exportar para uso global
window.LocalDatabase = LocalDatabase;
window.initializeDatabase = initializeDatabase;

console.log('✅ base.js cargado correctamente');
