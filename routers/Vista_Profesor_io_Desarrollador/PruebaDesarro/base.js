/**
 * Sistema de Gestión Escolar con almacenamiento local y sincronización con SQL Server
 */

class SQLDatabaseAdapter {
    constructor(connectionConfig) {
        this.connectionConfig = {
            server: connectionConfig.server || '',
            authenticationType: connectionConfig.authenticationType || 'windows',
            database: connectionConfig.database || '',
            encrypt: connectionConfig.encrypt || true,
            trustCertificate: connectionConfig.trustCertificate || false,
            username: connectionConfig.username || '',
            password: connectionConfig.password || ''
        };
        this.connected = false;
        this.connectionId = null;
    }

    async connect() {
        try {
            console.log('Estableciendo conexión con SQL Server...', this.connectionConfig);
            
            // Simulación de conexión exitosa (en producción usarías una API real)
            this.connectionId = 'conn_' + Math.random().toString(36).substr(2, 9);
            this.connected = true;
            
            console.log(`Conexión establecida (ID: ${this.connectionId})`);
            return { success: true, connectionId: this.connectionId };
        } catch (error) {
            console.error('Error conectando a SQL Server:', error);
            throw new Error(`Error de conexión: ${error.message}`);
        }
    }

    async disconnect() {
        if (this.connected) {
            console.log(`Cerrando conexión (ID: ${this.connectionId})`);
            this.connected = false;
            this.connectionId = null;
            return { success: true };
        }
        return { success: false, message: 'No había conexión activa' };
    }

    async executeQuery(query, params = []) {
        if (!this.connected) {
            throw new Error('No hay conexión activa con la base de datos');
        }

        console.log('Ejecutando consulta SQL:', { query, params });
        
        // Simulación de resultados (en producción esto sería una llamada a tu backend)
        const mockResults = {
            'SELECT * FROM estudiantes': [
                { id: 1, nombre: 'Juan Pérez', grado: '1A', activo: true },
                { id: 2, nombre: 'María García', grado: '2B', activo: true }
            ],
            'SELECT * FROM profesores': [
                { id: 1, nombre: 'Profesor Smith', materia: 'Matemáticas' },
                { id: 2, nombre: 'Profesora Johnson', materia: 'Ciencias' }
            ],
            'default': [{ id: 1, message: 'Consulta ejecutada correctamente' }]
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                const results = mockResults[query] || mockResults.default;
                resolve({
                    success: true,
                    results,
                    rowCount: results.length,
                    connectionId: this.connectionId
                });
            }, 500); // Simular latencia de red
        });
    }

    async syncTable(tableName, localData) {
        if (!this.connected) {
            throw new Error('No hay conexión activa para sincronización');
        }

        console.log(`Iniciando sincronización para tabla ${tableName}`);
        
        // 1. Obtener datos remotos
        const remoteData = await this.executeQuery(`SELECT * FROM ${tableName}`);
        
        // 2. Comparar y determinar cambios
        const changes = this.compareData(localData, remoteData.results);
        
        // 3. Aplicar cambios (simulado)
        console.log(`Aplicando ${changes.length} cambios a ${tableName}`);
        
        return {
            success: true,
            table: tableName,
            localCount: localData.length,
            remoteCount: remoteData.results.length,
            changesApplied: changes.length,
            changes
        };
    }

    compareData(localData, remoteData) {
        const changes = [];
        
        // Identificar registros nuevos locales
        localData.forEach(localItem => {
            const remoteItem = remoteData.find(r => r.id === localItem.id);
            if (!remoteItem) {
                changes.push({ type: 'INSERT', id: localItem.id });
            } else if (JSON.stringify(localItem) !== JSON.stringify(remoteItem)) {
                changes.push({ type: 'UPDATE', id: localItem.id });
            }
        });
        
        // Identificar registros eliminados localmente
        remoteData.forEach(remoteItem => {
            if (!localData.find(l => l.id === remoteItem.id)) {
                changes.push({ type: 'DELETE', id: remoteItem.id });
            }
        });
        
        return changes;
    }
}

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
        this.sqlAdapter = null;
        this.syncInterval = null;
        this.initializeCollections();
    }

    initializeCollections() {
        this.collections.forEach(collection => {
            if (!this.exists(collection)) {
                this.initializeCollection(collection);
            }
        });
    }

    exists(collection) {
        return localStorage.getItem(this.prefix + collection) !== null;
    }

    initializeCollection(collection) {
        let initialData = [];
        
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

    read(collection) {
        try {
            const data = localStorage.getItem(this.prefix + collection);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error leyendo colección ${collection}:`, error);
            return [];
        }
    }

    write(collection, data) {
        try {
            localStorage.setItem(this.prefix + collection, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error escribiendo colección ${collection}:`, error);
            return false;
        }
    }

    find(collection, id) {
        const data = this.read(collection);
        return data.find(item => item.id === id);
    }

    findWhere(collection, criteria) {
        const data = this.read(collection);
        return data.filter(item => {
            return Object.entries(criteria).every(([key, value]) => item[key] === value);
        });
    }

    create(collection, record) {
        try {
            const data = this.read(collection);
            
            if (!record.id) {
                record.id = this.generateId();
            }
            
            record.created_at = new Date().toISOString();
            record.updated_at = new Date().toISOString();
            
            const existingIndex = data.findIndex(item => item.id === record.id);
            if (existingIndex !== -1) {
                throw new Error(`Ya existe un registro con ID ${record.id} en ${collection}`);
            }
            
            data.push(record);
            this.write(collection, data);
            
            this.logAction('create', collection, record.id, 'Registro creado');
            
            return record;
        } catch (error) {
            console.error(`Error creando registro en ${collection}:`, error);
            throw error;
        }
    }

    update(collection, id, updates) {
        try {
            const data = this.read(collection);
            const index = data.findIndex(item => item.id === id);
            
            if (index === -1) {
                throw new Error(`Registro con ID ${id} no encontrado en ${collection}`);
            }
            
            updates.updated_at = new Date().toISOString();
            Object.assign(data[index], updates);
            
            this.write(collection, data);
            
            this.logAction('update', collection, id, `Campos actualizados: ${Object.keys(updates).join(', ')}`);
            
            return data[index];
        } catch (error) {
            console.error(`Error actualizando registro ${id} en ${collection}:`, error);
            throw error;
        }
    }

    delete(collection, id) {
        try {
            const data = this.read(collection);
            const index = data.findIndex(item => item.id === id);
            
            if (index === -1) {
                throw new Error(`Registro con ID ${id} no encontrado en ${collection}`);
            }
            
            const deletedRecord = data.splice(index, 1)[0];
            this.write(collection, data);
            
            this.logAction('delete', collection, id, 'Registro eliminado');
            
            return deletedRecord;
        } catch (error) {
            console.error(`Error eliminando registro ${id} en ${collection}:`, error);
            throw error;
        }
    }

    // Métodos de conexión y sincronización con SQL Server

    async configureSQLConnection(config) {
        this.sqlAdapter = new SQLDatabaseAdapter(config);
        const result = await this.sqlAdapter.connect();
        
        if (result.success) {
            this.logAction('sql_connect', 'sistema', null, 
                `Conexión SQL establecida. Server: ${config.server}, DB: ${config.database}`);
            return true;
        }
        
        throw new Error('No se pudo establecer la conexión SQL');
    }

    async syncCollection(collectionName, strategy = 'merge') {
        if (!this.sqlAdapter) {
            throw new Error('No se ha configurado la conexión SQL');
        }

        try {
            const localData = this.read(collectionName);
            const result = await this.sqlAdapter.syncTable(collectionName, localData);
            
            // Aquí implementarías la lógica para aplicar cambios remotos a local
            // Por ahora solo registramos el resultado
            this.logAction('sync', collectionName, null, 
                `Sincronización completada. Local: ${result.localCount}, Remoto: ${result.remoteCount}, Cambios: ${result.changesApplied}`);
            
            return result;
        } catch (error) {
            this.logAction('sync_error', collectionName, null, 
                `Error en sincronización: ${error.message}`);
            throw error;
        }
    }

    async syncAll(collections = this.collections) {
        if (!this.sqlAdapter || !this.sqlAdapter.connected) {
            throw new Error('No hay conexión SQL activa');
        }

        const results = {};
        
        for (const collection of collections) {
            try {
                results[collection] = await this.syncCollection(collection);
            } catch (error) {
                results[collection] = { error: error.message };
            }
        }
        
        return results;
    }

    startAutoSync(intervalMinutes = 60) {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.syncInterval = setInterval(async () => {
            try {
                const results = await this.syncAll();
                console.log('Sincronización automática completada:', results);
                this.logAction('auto_sync', 'sistema', null, 
                    `Sincronización automática completada. ${Object.keys(results).length} colecciones procesadas`);
            } catch (error) {
                console.error('Error en sincronización automática:', error);
                this.logAction('auto_sync_error', 'sistema', null, 
                    `Error en sincronización automática: ${error.message}`);
            }
        }, intervalMinutes * 60 * 1000);
        
        // Ejecutar primera sincronización 
        this.syncAll().catch(console.error);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            this.logAction('auto_sync_stop', 'sistema', null, 'Sincronización automática detenida');
        }
    }

    // Métodos auxiliares

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

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
            
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            this.write('logs', logs);
        } catch (error) {
            console.error('Error registrando log:', error);
        }
    }

    getLogs(limit = 50) {
        const logs = this.read('logs');
        return logs.slice(-limit).reverse();
    }

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

    clearAll() {
        try {
            this.collections.forEach(collection => {
                if (collection !== 'sistema') {
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

// Inicialización global
function initializeDatabase() {
    if (!window.db) {
        window.db = new LocalDatabase();
        console.log('✅ Base de datos local inicializada');
        
        // Configuración inicial de conexión (opcional)
        const savedConfig = localStorage.getItem('escuela_sql_config');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                window.db.configureSQLConnection(config).catch(console.error);
            } catch (e) {
                console.error('Error cargando configuración SQL guardada:', e);
            }
        }
    }
    return window.db;
}

// Manejo del formulario de conexión SQL
function setupConnectionForm() {
    const form = document.getElementById('db-connect-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const connectionConfig = {
            server: form.querySelector('[name="server"]').value,
            authenticationType: form.querySelector('[name="authentication"]:checked').value,
            database: form.querySelector('[name="database"]').value,
            encrypt: form.querySelector('[name="encrypt"]').checked,
            trustCertificate: form.querySelector('[name="trust-certificate"]').checked,
            username: form.querySelector('[name="username"]')?.value || '',
            password: form.querySelector('[name="password"]')?.value || ''
        };

        try {
            // Inicializar base de datos si existe
            const db = initializeDatabase();
            
            // Establecer conexión
            await db.configureSQLConnection(connectionConfig);
            
            // Guardar configuración para futuras sesiones
            localStorage.setItem('escuela_sql_config', JSON.stringify(connectionConfig));
            
            // Mostrar éxito
            alert('✅ Conexión establecida correctamente');
            
            // Iniciar sincronización automática
            db.startAutoSync();
            
        } catch (error) {
            console.error('Error en conexión:', error);
            alert(`❌ Error al conectar: ${error.message}`);
        }
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    setupConnectionForm();
    console.log('Sistema de Gestión Escolar listo');
});

// Exportar para uso global
window.LocalDatabase = LocalDatabase;
window.SQLDatabaseAdapter = SQLDatabaseAdapter;
window.initializeDatabase = initializeDatabase;