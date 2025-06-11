/**
 * Gestor de sincronización entre módulos
 * Maneja la comunicación y sincronización de datos entre todos los módulos del sistema
 */

class SyncManager {
    constructor() {
        this.modules = new Map();
        this.syncQueue = [];
        this.isProcessing = false;
        this.setupEventListeners();
    }

    // Registrar un módulo en el sistema de sincronización
    registerModule(name, updateCallback) {
        this.modules.set(name, {
            name,
            updateCallback,
            lastSync: new Date(),
            active: true
        });
    }

    // Configurar listeners para cambios en la base de datos
    setupEventListeners() {
        window.addEventListener('dbChange', (event) => {
            this.handleDatabaseChange(event.detail);
        });

        // Sincronización periódica cada 30 segundos
        setInterval(() => {
            this.processQueue();
        }, 30000);
    }

    // Manejar cambios en la base de datos
    handleDatabaseChange(changeData) {
        const { collection, action, data, timestamp } = changeData;
        
        // Agregar a la cola de sincronización
        this.syncQueue.push({
            collection,
            action,
            data,
            timestamp,
            processed: false
        });

        // Procesar inmediatamente si es una acción crítica
        if (['created', 'updated', 'deleted'].includes(action)) {
            this.processQueue();
        }
    }

    // Procesar cola de sincronización
    async processQueue() {
        if (this.isProcessing || this.syncQueue.length === 0) return;

        this.isProcessing = true;

        try {
            const pendingChanges = this.syncQueue.filter(item => !item.processed);
            
            for (const change of pendingChanges) {
                await this.syncModules(change);
                change.processed = true;
            }

            // Limpiar elementos procesados más antiguos
            this.syncQueue = this.syncQueue.filter(item => 
                !item.processed || 
                (new Date() - new Date(item.timestamp)) < 300000 // 5 minutos
            );

        } catch (error) {
            console.error('Error en procesamiento de sincronización:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    // Sincronizar módulos basado en el cambio
    async syncModules(change) {
        const { collection, action, data } = change;

        // Mapeo de qué módulos necesitan actualizarse por cada colección
        const moduleMapping = {
            estudiantes: ['dashboard', 'estudiantes', 'matriculas', 'notas', 'analytics'],
            profesores: ['dashboard', 'profesores', 'notas', 'analytics'],
            tutores: ['dashboard', 'tutores', 'estudiantes', 'analytics'],
            matriculas: ['dashboard', 'matriculas', 'estudiantes', 'analytics'],
            inscripciones: ['dashboard', 'inscripciones', 'analytics'],
            notas: ['dashboard', 'notas', 'estudiantes', 'profesores', 'analytics'],
            eventos: ['calendario', 'dashboard'],
            system_config: ['sistema', 'dashboard'],
            system_logs: ['sistema']
        };

        const affectedModules = moduleMapping[collection] || [];

        // Notificar a cada módulo afectado
        for (const moduleName of affectedModules) {
            const moduleInfo = this.modules.get(moduleName);
            if (moduleInfo && moduleInfo.active) {
                try {
                    await moduleInfo.updateCallback(change);
                    moduleInfo.lastSync = new Date();
                } catch (error) {
                    console.error(`Error sincronizando módulo ${moduleName}:`, error);
                }
            }
        }
    }

    // Método para que los módulos soliciten datos relacionados
    getRelatedData(collection, filters = {}) {
        return window.db.filter(collection, filters);
    }

    // Método para que los módulos actualicen estadísticas
    updateStats(moduleName, stats) {
        const event = new CustomEvent('statsUpdated', {
            detail: { module: moduleName, stats, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    // Obtener estadísticas cruzadas entre módulos
    getCrossModuleStats() {
        return {
            estudiantes: window.db.getStats('estudiantes'),
            profesores: window.db.getStats('profesores'),
            tutores: window.db.getStats('tutores'),
            matriculas: window.db.getStats('matriculas'),
            inscripciones: window.db.getStats('inscripciones'),
            notas: window.db.getStats('notas'),
            eventos: window.db.getStats('eventos')
        };
    }

    // Validar coherencia de datos entre módulos
    validateDataIntegrity() {
        const issues = [];

        try {
            // Verificar estudiantes sin tutor
            const estudiantes = window.db.read('estudiantes');
            const tutores = window.db.read('tutores');
            const tutorIds = tutores.map(t => t.id);

            estudiantes.forEach(estudiante => {
                if (estudiante.tutor_id && !tutorIds.includes(estudiante.tutor_id)) {
                    issues.push({
                        type: 'missing_reference',
                        module: 'estudiantes',
                        record: estudiante.id,
                        message: `Estudiante ${estudiante.nombre} ${estudiante.apellido} tiene tutor inexistente`
                    });
                }
            });

            // Verificar notas sin estudiante o profesor
            const notas = window.db.read('notas');
            const profesores = window.db.read('profesores');
            const estudianteIds = estudiantes.map(e => e.id);
            const profesorIds = profesores.map(p => p.id);

            notas.forEach(nota => {
                if (!estudianteIds.includes(nota.estudiante_id)) {
                    issues.push({
                        type: 'missing_reference',
                        module: 'notas',
                        record: nota.id,
                        message: `Nota tiene estudiante inexistente`
                    });
                }
                if (!profesorIds.includes(nota.profesor_id)) {
                    issues.push({
                        type: 'missing_reference',
                        module: 'notas',
                        record: nota.id,
                        message: `Nota tiene profesor inexistente`
                    });
                }
            });

            // Verificar matrículas sin estudiante
            const matriculas = window.db.read('matriculas');
            matriculas.forEach(matricula => {
                if (!estudianteIds.includes(matricula.estudiante_id)) {
                    issues.push({
                        type: 'missing_reference',
                        module: 'matriculas',
                        record: matricula.id,
                        message: `Matrícula tiene estudiante inexistente`
                    });
                }
            });

        } catch (error) {
            issues.push({
                type: 'validation_error',
                module: 'sync',
                message: `Error en validación: ${error.message}`
            });
        }

        return issues;
    }

    // Reparar referencias rotas
    repairDataIntegrity() {
        const issues = this.validateDataIntegrity();
        let repaired = 0;

        issues.forEach(issue => {
            try {
                if (issue.type === 'missing_reference') {
                    // Eliminar registros con referencias rotas
                    if (window.db.delete(issue.module, issue.record)) {
                        repaired++;
                    }
                }
            } catch (error) {
                console.error(`Error reparando ${issue.record}:`, error);
            }
        });

        return { total_issues: issues.length, repaired };
    }

    // Generar reporte de sincronización
    getSyncReport() {
        const moduleStats = Array.from(this.modules.entries()).map(([name, info]) => ({
            name,
            lastSync: info.lastSync,
            active: info.active,
            timeSinceSync: new Date() - info.lastSync
        }));

        return {
            totalModules: this.modules.size,
            activeModules: moduleStats.filter(m => m.active).length,
            queueSize: this.syncQueue.length,
            pendingChanges: this.syncQueue.filter(item => !item.processed).length,
            moduleStats,
            dataIntegrity: this.validateDataIntegrity()
        };
    }

    // Forzar sincronización completa
    forceSyncAll() {
        const allData = window.db.exportAllData();
        
        this.modules.forEach((moduleInfo, moduleName) => {
            if (moduleInfo.active) {
                try {
                    moduleInfo.updateCallback({
                        collection: 'all',
                        action: 'force_sync',
                        data: allData,
                        timestamp: new Date().toISOString()
                    });
                    moduleInfo.lastSync = new Date();
                } catch (error) {
                    console.error(`Error en sincronización forzada de ${moduleName}:`, error);
                }
            }
        });
    }

    // Activar/desactivar módulo
    toggleModule(moduleName, active) {
        const moduleInfo = this.modules.get(moduleName);
        if (moduleInfo) {
            moduleInfo.active = active;
            return true;
        }
        return false;
    }

    // Obtener datos para dashboard
    getDashboardData() {
        const stats = this.getCrossModuleStats();
        const today = new Date().toDateString();
        
        return {
            stats,
            recentActivity: this.syncQueue
                .filter(item => new Date(item.timestamp).toDateString() === today)
                .slice(-10),
            systemHealth: {
                modulesActive: Array.from(this.modules.values()).filter(m => m.active).length,
                totalModules: this.modules.size,
                queueHealth: this.syncQueue.length < 100 ? 'good' : 'warning',
                dataIntegrityIssues: this.validateDataIntegrity().length
            }
        };
    }
}

// Crear instancia global del gestor de sincronización
const syncManager = new SyncManager();

// Funciones de utilidad para los módulos
window.syncManager = syncManager;

// Función helper para registrar módulos
window.registerModule = (name, updateCallback) => {
    syncManager.registerModule(name, updateCallback);
};

// Función helper para obtener datos relacionados
window.getRelatedData = (collection, filters) => {
    return syncManager.getRelatedData(collection, filters);
};

// Función helper para actualizar estadísticas
window.updateModuleStats = (moduleName, stats) => {
    syncManager.updateStats(moduleName, stats);
};