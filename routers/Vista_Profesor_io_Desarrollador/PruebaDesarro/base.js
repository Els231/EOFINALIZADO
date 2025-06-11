/**
 * Sistema de base de datos en memoria usando localStorage
 * Proporciona funcionalidades CRUD para todas las entidades del sistema


class Database {
    constructor() {
        this.collections = [
            'estudiantes',
            'profesores', 
            'matriculas',
            'inscripciones',
            'tutores',
            'notas',
            'eventos',
            'departamentos',
            'municipios',
            'materias',
            'turnos',
            'ocupaciones',
            'analytics',
            'system_config',
            'system_logs'
        ];
        
        this.init();
        this.setupEventListeners();
    }

    // Inicializar base de datos con datos predeterminados
    init() {
        // Verificar si ya existe data inicializada
        if (!localStorage.getItem('db_initialized')) {
            this.initializeDefaultData();
            localStorage.setItem('db_initialized', 'true');
        }
        this.notifyChange('database', 'initialized');
    }

    // Sistema de eventos para sincronización entre módulos
    setupEventListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('eduoptima_')) {
                this.handleStorageChange(e);
            }
        });
    }

    handleStorageChange(event) {
        const collection = event.key.replace('eduoptima_', '');
        this.notifyChange(collection, 'updated', JSON.parse(event.newValue));
    }

    notifyChange(collection, action, data = null) {
        const event = new CustomEvent('dbChange', {
            detail: { collection, action, data, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    // Inicializar datos predeterminados
    initializeDefaultData() {
        // Departamentos de República Dominicana
        this.setCollection('departamentos', this.getDepartamentosData());
        
        // Municipios de República Dominicana
        this.setCollection('municipios', this.getMunicipiosData());
        
        // Materias básicas
        this.setCollection('materias', this.getMateriasData());
        
        // Turnos escolares
        this.setCollection('turnos', this.getTurnosData());
        
        // Ocupaciones comunes
        this.setCollection('ocupaciones', this.getOcupacionesData());
        
        // Inicializar colecciones vacías
        this.collections.forEach(collection => {
            if (!this.getCollection(collection)) {
                this.setCollection(collection, []);
            }
        });

        // Configuración inicial del sistema
        this.setCollection('system_config', this.getSystemConfigData());
    }

    // Datos de departamentos
    getDepartamentosData() {
        return [
            { id: 1, nombre: 'Distrito Nacional', codigo: 'DN' },
            { id: 2, nombre: 'Azua', codigo: 'AZ' },
            { id: 3, nombre: 'Baoruco', codigo: 'BC' },
            { id: 4, nombre: 'Barahona', codigo: 'BH' },
            { id: 5, nombre: 'Dajabón', codigo: 'DJ' },
            { id: 6, nombre: 'Duarte', codigo: 'DU' },
            { id: 7, nombre: 'Elías Piña', codigo: 'EP' },
            { id: 8, nombre: 'El Seibo', codigo: 'ES' },
            { id: 9, nombre: 'Espaillat', codigo: 'ET' },
            { id: 10, nombre: 'Hato Mayor', codigo: 'HM' },
            { id: 11, nombre: 'Hermanas Mirabal', codigo: 'MI' },
            { id: 12, nombre: 'Independencia', codigo: 'IN' },
            { id: 13, nombre: 'La Altagracia', codigo: 'AL' },
            { id: 14, nombre: 'La Romana', codigo: 'RO' },
            { id: 15, nombre: 'La Vega', codigo: 'VE' },
            { id: 16, nombre: 'María Trinidad Sánchez', codigo: 'MT' },
            { id: 17, nombre: 'Monseñor Nouel', codigo: 'MN' },
            { id: 18, nombre: 'Monte Cristi', codigo: 'MC' },
            { id: 19, nombre: 'Monte Plata', codigo: 'MP' },
            { id: 20, nombre: 'Pedernales', codigo: 'PE' },
            { id: 21, nombre: 'Peravia', codigo: 'PR' },
            { id: 22, nombre: 'Puerto Plata', codigo: 'PP' },
            { id: 23, nombre: 'Samaná', codigo: 'SM' },
            { id: 24, nombre: 'San Cristóbal', codigo: 'SC' },
            { id: 25, nombre: 'San José de Ocoa', codigo: 'JO' },
            { id: 26, nombre: 'San Juan', codigo: 'SJ' },
            { id: 27, nombre: 'San Pedro de Macorís', codigo: 'PM' },
            { id: 28, nombre: 'Sánchez Ramírez', codigo: 'SR' },
            { id: 29, nombre: 'Santiago', codigo: 'ST' },
            { id: 30, nombre: 'Santiago Rodríguez', codigo: 'SR' },
            { id: 31, nombre: 'Santo Domingo', codigo: 'SD' },
            { id: 32, nombre: 'Valverde', codigo: 'VA' }
        ];
    }

    // Datos de municipios (muestra de algunos principales)
    getMunicipiosData() {
        return [
            { id: 1, nombre: 'Santo Domingo de Guzmán', departamento_id: 31 },
            { id: 2, nombre: 'Santiago de los Caballeros', departamento_id: 29 },
            { id: 3, nombre: 'San Pedro de Macorís', departamento_id: 27 },
            { id: 4, nombre: 'La Romana', departamento_id: 14 },
            { id: 5, nombre: 'San Francisco de Macorís', departamento_id: 6 },
            { id: 6, nombre: 'Puerto Plata', departamento_id: 22 },
            { id: 7, nombre: 'San Cristóbal', departamento_id: 24 },
            { id: 8, nombre: 'Higüey', departamento_id: 13 },
            { id: 9, nombre: 'Moca', departamento_id: 9 },
            { id: 10, nombre: 'Baní', departamento_id: 21 }
        ];
    }

    // Datos de materias
    getMateriasData() {
        return [
            { id: 1, nombre: 'Lengua Española', codigo: 'ESP', creditos: 4, activa: true },
            { id: 2, nombre: 'Matemáticas', codigo: 'MAT', creditos: 4, activa: true },
            { id: 3, nombre: 'Ciencias Naturales', codigo: 'CN', creditos: 3, activa: true },
            { id: 4, nombre: 'Ciencias Sociales', codigo: 'CS', creditos: 3, activa: true },
            { id: 5, nombre: 'Inglés', codigo: 'ING', creditos: 2, activa: true },
            { id: 6, nombre: 'Educación Física', codigo: 'EF', creditos: 2, activa: true },
            { id: 7, nombre: 'Educación Artística', codigo: 'EA', creditos: 2, activa: true },
            { id: 8, nombre: 'Formación Humana y Religiosa', codigo: 'FHR', creditos: 2, activa: true },
            { id: 9, nombre: 'Informática', codigo: 'INF', creditos: 2, activa: true }
        ];
    }

    // Datos de turnos
    getTurnosData() {
        return [
            { id: 1, nombre: 'Matutino', hora_inicio: '07:00', hora_fin: '12:00', activo: true },
            { id: 2, nombre: 'Vespertino', hora_inicio: '13:00', hora_fin: '18:00', activo: true },
            { id: 3, nombre: 'Nocturno', hora_inicio: '18:00', hora_fin: '22:00', activo: false }
        ];
    }

    // Datos de ocupaciones
    getOcupacionesData() {
        return [
            { id: 1, nombre: 'Estudiante' },
            { id: 2, nombre: 'Empleado' },
            { id: 3, nombre: 'Comerciante' },
            { id: 4, nombre: 'Profesional' },
            { id: 5, nombre: 'Técnico' },
            { id: 6, nombre: 'Artesano' },
            { id: 7, nombre: 'Agricultor' },
            { id: 8, nombre: 'Ama de Casa' },
            { id: 9, nombre: 'Jubilado' },
            { id: 10, nombre: 'Desempleado' },
            { id: 11, nombre: 'Otro' }
        ];
    }

    // Configuración inicial del sistema
    getSystemConfigData() {
        return [{
            id: 1,
            nombre_escuela: 'Escuela Jesús El Buen Maestro',
            director: 'Director General',
            telefono: '809-000-0000',
            email: 'info@escuelajesusbuentmaestro.edu.do',
            direccion: 'San Juan de Oriente, República Dominicana',
            ano_escolar: '2024-2025',
            periodo_actual: 'Primer Período',
            logo_url: 'assets/logo.svg',
            creado: new Date().toISOString()
        }];
    }

    // Métodos CRUD básicos
    getCollection(name) {
        try {
            const data = localStorage.getItem(`eduoptima_${name}`);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error al obtener colección ${name}:`, error);
            return [];
        }
    }

    setCollection(name, data) {
        try {
            localStorage.setItem(`eduoptima_${name}`, JSON.stringify(data));
            this.notifyChange(name, 'collection_updated', data);
            return true;
        } catch (error) {
            console.error(`Error al guardar colección ${name}:`, error);
            return false;
        }
    }

    // Crear registro
    create(collection, data) {
        try {
            const records = this.getCollection(collection);
            const newRecord = {
                id: this.generateId(),
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            records.push(newRecord);
            this.setCollection(collection, records);
            this.notifyChange(collection, 'created', newRecord);
            this.logAction('create', collection, newRecord.id);
            return newRecord;
        } catch (error) {
            console.error(`Error al crear en ${collection}:`, error);
            return null;
        }
    }

    // Leer registros
    read(collection, id = null) {
        try {
            const records = this.getCollection(collection);
            if (id) {
                return records.find(record => record.id === id) || null;
            }
            return records;
        } catch (error) {
            console.error(`Error al leer ${collection}:`, error);
            return id ? null : [];
        }
    }

    // Actualizar registro
    update(collection, id, data) {
        try {
            const records = this.getCollection(collection);
            const index = records.findIndex(record => record.id === id);
            if (index !== -1) {
                records[index] = {
                    ...records[index],
                    ...data,
                    updated_at: new Date().toISOString()
                };
                this.setCollection(collection, records);
                this.notifyChange(collection, 'updated', records[index]);
                this.logAction('update', collection, id);
                return records[index];
            }
            return null;
        } catch (error) {
            console.error(`Error al actualizar ${collection}:`, error);
            return null;
        }
    }

    // Eliminar registro
    delete(collection, id) {
        try {
            const records = this.getCollection(collection);
            const index = records.findIndex(record => record.id === id);
            if (index !== -1) {
                const deletedRecord = records.splice(index, 1)[0];
                this.setCollection(collection, records);
                this.notifyChange(collection, 'deleted', deletedRecord);
                this.logAction('delete', collection, id);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error al eliminar de ${collection}:`, error);
            return false;
        }
    }

    // Buscar registros
    search(collection, query, fields = []) {
        try {
            const records = this.getCollection(collection);
            if (!query) return records;

            return records.filter(record => {
                if (fields.length === 0) {
                    // Buscar en todos los campos de texto
                    return Object.values(record).some(value => 
                        value && value.toString().toLowerCase().includes(query.toLowerCase())
                    );
                } else {
                    // Buscar solo en campos específicos
                    return fields.some(field => 
                        record[field] && record[field].toString().toLowerCase().includes(query.toLowerCase())
                    );
                }
            });
        } catch (error) {
            console.error(`Error al buscar en ${collection}:`, error);
            return [];
        }
    }

    // Filtrar registros
    filter(collection, filters) {
        try {
            const records = this.getCollection(collection);
            return records.filter(record => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === null || value === undefined) return true;
                    return record[key] === value;
                });
            });
        } catch (error) {
            console.error(`Error al filtrar ${collection}:`, error);
            return [];
        }
    }

    // Obtener estadísticas
    getStats(collection) {
        try {
            const records = this.getCollection(collection);
            return {
                total: records.length,
                active: records.filter(r => r.estado === 'Activo' || r.activo === true).length,
                inactive: records.filter(r => r.estado === 'Inactivo' || r.activo === false).length,
                created_today: records.filter(r => {
                    const today = new Date().toDateString();
                    const created = new Date(r.created_at).toDateString();
                    return today === created;
                }).length,
                created_this_month: records.filter(r => {
                    const thisMonth = new Date().getMonth();
                    const thisYear = new Date().getFullYear();
                    const created = new Date(r.created_at);
                    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
                }).length
            };
        } catch (error) {
            console.error(`Error al obtener estadísticas de ${collection}:`, error);
            return { total: 0, active: 0, inactive: 0, created_today: 0, created_this_month: 0 };
        }
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Sistema de logs
    logAction(action, collection, recordId, details = null) {
        try {
            const logs = this.getCollection('system_logs');
            const logEntry = {
                id: this.generateId(),
                action,
                collection,
                record_id: recordId,
                details,
                timestamp: new Date().toISOString(),
                user: 'sistema' // Aquí se podría agregar el usuario actual
            };
            logs.push(logEntry);
            
            // Mantener solo los últimos 1000 logs
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            this.setCollection('system_logs', logs);
        } catch (error) {
            console.error('Error al registrar log:', error);
        }
    }

    // Exportar todos los datos
    exportAllData() {
        try {
            const allData = {};
            this.collections.forEach(collection => {
                allData[collection] = this.getCollection(collection);
            });
            return allData;
        } catch (error) {
            console.error('Error al exportar datos:', error);
            return null;
        }
    }

    // Importar datos
    importData(data) {
        try {
            Object.entries(data).forEach(([collection, records]) => {
                if (this.collections.includes(collection)) {
                    this.setCollection(collection, records);
                }
            });
            this.logAction('import', 'system', 'all', 'Datos importados');
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    // Limpiar base de datos
    clearDatabase() {
        try {
            this.collections.forEach(collection => {
                this.setCollection(collection, []);
            });
            localStorage.removeItem('db_initialized');
            this.logAction('clear', 'system', 'all', 'Base de datos limpiada');
            return true;
        } catch (error) {
            console.error('Error al limpiar base de datos:', error);
            return false;
        }
    }

    // Relaciones entre entidades
    getRelated(collection, id, relatedCollection, foreignKey) {
        try {
            const relatedRecords = this.getCollection(relatedCollection);
            return relatedRecords.filter(record => record[foreignKey] === id);
        } catch (error) {
            console.error(`Error al obtener registros relacionados:`, error);
            return [];
        }
    }

    // Validar integridad referencial
    validateReferences(collection, id) {
        const references = {
            estudiantes: [
                { collection: 'matriculas', field: 'estudiante_id' },
                { collection: 'notas', field: 'estudiante_id' }
            ],
            profesores: [
                { collection: 'notas', field: 'profesor_id' }
            ],
            tutores: [
                { collection: 'estudiantes', field: 'tutor_id' }
            ]
        };

        if (references[collection]) {
            return references[collection].every(ref => {
                const relatedRecords = this.getCollection(ref.collection);
                return !relatedRecords.some(record => record[ref.field] === id);
            });
        }
        return true;
    }
}

// Inicializar base de datos global
const db = new Database();

// Exportar para uso en módulos
window.db = db;
 */

/**
 * Sistema de base de datos MSSQL para el sistema escolar
 * Reemplaza localStorage con conexión real a SQL Server
 */

class DatabaseMSSQL {
    constructor() {
        this.apiBaseUrl = '/api'; // URL base de tu API backend
        this.collections = [
            'estudiantes',
            'profesores', 
            'matriculas',
            'inscripciones',
            'tutores',
            'notas',
            'eventos',
            'departamentos',
            'municipios',
            'materias',
            'turnos',
            'ocupaciones',
            'analytics',
            'system_config',
            'system_logs'
        ];
        
        this.init();
        this.setupEventListeners();
    }

    // Inicializar base de datos
    async init() {
        try {
            // Verificar conexión con el servidor
            const response = await this.makeRequest('GET', '/health');
            if (response.status === 'ok') {
                console.log('Conexión con base de datos MSSQL establecida');
                this.notifyChange('database', 'initialized');
            }
        } catch (error) {
            console.error('Error conectando a base de datos:', error);
            // Fallback a localStorage si no hay conexión
            this.fallbackToLocalStorage();
        }
    }

    // Sistema de eventos para sincronización entre módulos
    setupEventListeners() {
        // Mantener el mismo sistema de eventos
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('eduoptima_')) {
                this.handleStorageChange(e);
            }
        });
    }

    handleStorageChange(event) {
        const collection = event.key.replace('eduoptima_', '');
        this.notifyChange(collection, 'updated', JSON.parse(event.newValue));
    }

    notifyChange(collection, action, data = null) {
        const event = new CustomEvent('dbChange', {
            detail: { collection, action, data, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    // Realizar peticiones HTTP al backend
    async makeRequest(method, endpoint, data = null) {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    // Métodos CRUD adaptados para MSSQL

    // Obtener colección completa
    async getCollection(name) {
        try {
            const response = await this.makeRequest('GET', `/${name}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error al obtener colección ${name}:`, error);
            return this.getCollectionFallback(name);
        }
    }

    // Crear registro
    async create(collection, data) {
        try {
            const newRecord = {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const response = await this.makeRequest('POST', `/${collection}`, newRecord);
            
            this.notifyChange(collection, 'created', response);
            this.logAction('create', collection, response.id);
            
            return response;
        } catch (error) {
            console.error(`Error al crear en ${collection}:`, error);
            return this.createFallback(collection, data);
        }
    }

    // Leer registros
    async read(collection, id = null) {
        try {
            if (id) {
                const response = await this.makeRequest('GET', `/${collection}/${id}`);
                return response;
            } else {
                const response = await this.makeRequest('GET', `/${collection}`);
                return response.data || response;
            }
        } catch (error) {
            console.error(`Error al leer ${collection}:`, error);
            return this.readFallback(collection, id);
        }
    }

    // Actualizar registro
    async update(collection, id, data) {
        try {
            const updateData = {
                ...data,
                updated_at: new Date().toISOString()
            };

            const response = await this.makeRequest('PUT', `/${collection}/${id}`, updateData);
            
            this.notifyChange(collection, 'updated', response);
            this.logAction('update', collection, id);
            
            return response;
        } catch (error) {
            console.error(`Error al actualizar ${collection}:`, error);
            return this.updateFallback(collection, id, data);
        }
    }

    // Eliminar registro
    async delete(collection, id) {
        try {
            await this.makeRequest('DELETE', `/${collection}/${id}`);
            
            this.notifyChange(collection, 'deleted', { id });
            this.logAction('delete', collection, id);
            
            return true;
        } catch (error) {
            console.error(`Error al eliminar de ${collection}:`, error);
            return this.deleteFallback(collection, id);
        }
    }

    // Buscar registros
    async search(collection, query, fields = []) {
        try {
            const params = new URLSearchParams({
                q: query,
                fields: fields.join(',')
            });

            const response = await this.makeRequest('GET', `/${collection}/search?${params}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error al buscar en ${collection}:`, error);
            return this.searchFallback(collection, query, fields);
        }
    }

    // Filtrar registros
    async filter(collection, filters) {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    params.append(key, value);
                }
            });

            const response = await this.makeRequest('GET', `/${collection}/filter?${params}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error al filtrar ${collection}:`, error);
            return this.filterFallback(collection, filters);
        }
    }

    // Obtener estadísticas
    async getStats(collection) {
        try {
            const response = await this.makeRequest('GET', `/${collection}/stats`);
            return response;
        } catch (error) {
            console.error(`Error al obtener estadísticas de ${collection}:`, error);
            return this.getStatsFallback(collection);
        }
    }

    // Métodos de fallback usando localStorage
    fallbackToLocalStorage() {
        console.warn('Usando localStorage como fallback');
        this.useFallback = true;
    }

    getCollectionFallback(name) {
        try {
            const data = localStorage.getItem(`eduoptima_${name}`);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    createFallback(collection, data) {
        try {
            const records = this.getCollectionFallback(collection);
            const newRecord = {
                id: this.generateId(),
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            records.push(newRecord);
            localStorage.setItem(`eduoptima_${collection}`, JSON.stringify(records));
            this.notifyChange(collection, 'created', newRecord);
            return newRecord;
        } catch (error) {
            console.error('Error en fallback create:', error);
            return null;
        }
    }

    readFallback(collection, id) {
        try {
            const records = this.getCollectionFallback(collection);
            if (id) {
                return records.find(record => record.id === id) || null;
            }
            return records;
        } catch (error) {
            return id ? null : [];
        }
    }

    updateFallback(collection, id, data) {
        try {
            const records = this.getCollectionFallback(collection);
            const index = records.findIndex(record => record.id === id);
            if (index !== -1) {
                records[index] = {
                    ...records[index],
                    ...data,
                    updated_at: new Date().toISOString()
                };
                localStorage.setItem(`eduoptima_${collection}`, JSON.stringify(records));
                this.notifyChange(collection, 'updated', records[index]);
                return records[index];
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    deleteFallback(collection, id) {
        try {
            const records = this.getCollectionFallback(collection);
            const index = records.findIndex(record => record.id === id);
            if (index !== -1) {
                const deletedRecord = records.splice(index, 1)[0];
                localStorage.setItem(`eduoptima_${collection}`, JSON.stringify(records));
                this.notifyChange(collection, 'deleted', deletedRecord);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    searchFallback(collection, query, fields) {
        try {
            const records = this.getCollectionFallback(collection);
            if (!query) return records;

            return records.filter(record => {
                if (fields.length === 0) {
                    return Object.values(record).some(value => 
                        value && value.toString().toLowerCase().includes(query.toLowerCase())
                    );
                } else {
                    return fields.some(field => 
                        record[field] && record[field].toString().toLowerCase().includes(query.toLowerCase())
                    );
                }
            });
        } catch (error) {
            return [];
        }
    }

    filterFallback(collection, filters) {
        try {
            const records = this.getCollectionFallback(collection);
            return records.filter(record => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === null || value === undefined) return true;
                    return record[key] === value;
                });
            });
        } catch (error) {
            return [];
        }
    }

    getStatsFallback(collection) {
        try {
            const records = this.getCollectionFallback(collection);
            return {
                total: records.length,
                active: records.filter(r => r.estado === 'Activo' || r.activo === true).length,
                inactive: records.filter(r => r.estado === 'Inactivo' || r.activo === false).length,
                created_today: records.filter(r => {
                    const today = new Date().toDateString();
                    const created = new Date(r.created_at).toDateString();
                    return today === created;
                }).length,
                created_this_month: records.filter(r => {
                    const thisMonth = new Date().getMonth();
                    const thisYear = new Date().getFullYear();
                    const created = new Date(r.created_at);
                    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
                }).length
            };
        } catch (error) {
            return { total: 0, active: 0, inactive: 0, created_today: 0, created_this_month: 0 };
        }
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Sistema de logs
    async logAction(action, collection, recordId, details = null) {
        try {
            const logEntry = {
                action,
                collection,
                record_id: recordId,
                details,
                timestamp: new Date().toISOString(),
                user: 'sistema'
            };

            await this.makeRequest('POST', '/system_logs', logEntry);
        } catch (error) {
            console.error('Error al registrar log:', error);
            // Fallback a localStorage
            try {
                const logs = this.getCollectionFallback('system_logs');
                logEntry.id = this.generateId();
                logs.push(logEntry);
                
                if (logs.length > 1000) {
                    logs.splice(0, logs.length - 1000);
                }
                
                localStorage.setItem('eduoptima_system_logs', JSON.stringify(logs));
            } catch (fallbackError) {
                console.error('Error en fallback de logs:', fallbackError);
            }
        }
    }

    // Exportar todos los datos
    async exportAllData() {
        try {
            const response = await this.makeRequest('GET', '/export/all');
            return response;
        } catch (error) {
            console.error('Error al exportar datos:', error);
            // Fallback
            const allData = {};
            this.collections.forEach(collection => {
                allData[collection] = this.getCollectionFallback(collection);
            });
            return allData;
        }
    }

    // Importar datos
    async importData(data) {
        try {
            const response = await this.makeRequest('POST', '/import/all', data);
            this.logAction('import', 'system', 'all', 'Datos importados');
            return response.success;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    // Limpiar base de datos
    async clearDatabase() {
        try {
            const response = await this.makeRequest('DELETE', '/clear/all');
            this.logAction('clear', 'system', 'all', 'Base de datos limpiada');
            return response.success;
        } catch (error) {
            console.error('Error al limpiar base de datos:', error);
            return false;
        }
    }

    // Relaciones entre entidades
    async getRelated(collection, id, relatedCollection, foreignKey) {
        try {
            const response = await this.makeRequest('GET', `/${collection}/${id}/related/${relatedCollection}?foreignKey=${foreignKey}`);
            return response.data || response;
        } catch (error) {
            console.error('Error al obtener registros relacionados:', error);
            // Fallback
            const relatedRecords = this.getCollectionFallback(relatedCollection);
            return relatedRecords.filter(record => record[foreignKey] === id);
        }
    }

    // Validar integridad referencial
    async validateReferences(collection, id) {
        try {
            const response = await this.makeRequest('GET', `/${collection}/${id}/validate-references`);
            return response.valid;
        } catch (error) {
            console.error('Error al validar referencias:', error);
            // Fallback con validación local
            const references = {
                estudiantes: [
                    { collection: 'matriculas', field: 'estudiante_id' },
                    { collection: 'notas', field: 'estudiante_id' }
                ],
                profesores: [
                    { collection: 'notas', field: 'profesor_id' }
                ],
                tutores: [
                    { collection: 'estudiantes', field: 'tutor_id' }
                ]
            };

            if (references[collection]) {
                return references[collection].every(ref => {
                    const relatedRecords = this.getCollectionFallback(ref.collection);
                    return !relatedRecords.some(record => record[ref.field] === id);
                });
            }
            return true;
        }
    }
}

// Inicializar base de datos global
const db = new DatabaseMSSQL();

// Exportar para uso en módulos
window.db = db;