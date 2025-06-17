/**
 * Módulo de configuración y administración del sistema
 * Funcionalidades para configuración, backup y administración
 */

function loadSistemaSection() {
    const section = document.getElementById('sistema-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-cogs me-2"></i>
                    Configuración del Sistema
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="createBackup()">
                            <i class="fas fa-save me-1"></i> Crear Backup
                        </button>
                        <button type="button" class="btn btn-outline-warning" onclick="showImportModal()">
                            <i class="fas fa-upload me-1"></i> Importar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado del sistema -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="system-status">Activo</div>
                                <div class="small">Estado del Sistema</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-server fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="api-connection">Verificando...</div>
                                <div class="small">Conexión API</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-wifi fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="storage-usage">0 KB</div>
                                <div class="small">Uso de Almacenamiento</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-hdd fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="last-backup">Nunca</div>
                                <div class="small">Último Backup</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pestañas de configuración -->
        <ul class="nav nav-tabs mb-3" id="sistemaTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="api-config-tab" data-bs-toggle="tab" data-bs-target="#api-config" type="button" role="tab">
                    <i class="fas fa-code me-2"></i> Configuración API
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="data-management-tab" data-bs-toggle="tab" data-bs-target="#data-management" type="button" role="tab">
                    <i class="fas fa-database me-2"></i> Gestión de Datos
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="system-logs-tab" data-bs-toggle="tab" data-bs-target="#system-logs" type="button" role="tab">
                    <i class="fas fa-file-alt me-2"></i> Logs del Sistema
                </button>
            </li>
        </ul>

        <!-- Contenido de las pestañas -->
        <div class="tab-content" id="sistemaTabContent">
            <!-- Configuración API -->
            <div class="tab-pane fade show active" id="api-config" role="tabpanel">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Estado de la API REST</h6>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label">URL Base de la API</label>
                                    <input type="text" class="form-control" id="api-base-url" value="/api" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Estado de Conexión</label>
                                    <div id="api-status-details" class="alert alert-info">
                                        Verificando conexión...
                                    </div>
                                </div>
                                <button class="btn btn-primary" onclick="testApiConnection()">
                                    <i class="fas fa-sync me-1"></i> Verificar Conexión
                                </button>
                                <a href="/api_demo.html" class="btn btn-outline-info ms-2" target="_blank">
                                    <i class="fas fa-external-link-alt me-1"></i> Demo API
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Endpoints Disponibles</h6>
                            </div>
                            <div class="card-body">
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item d-flex justify-content-between">
                                        <span>GET /api/estudiantes</span>
                                        <span class="badge bg-primary">Disponible</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between">
                                        <span>POST /api/estudiantes</span>
                                        <span class="badge bg-success">Disponible</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between">
                                        <span>GET /api/profesores</span>
                                        <span class="badge bg-primary">Disponible</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between">
                                        <span>GET /api/notas</span>
                                        <span class="badge bg-primary">Disponible</span>
                                    </div>
                                    <div class="list-group-item d-flex justify-content-between">
                                        <span>GET /api/estadisticas/dashboard</span>
                                        <span class="badge bg-info">Disponible</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gestión de Datos -->
            <div class="tab-pane fade" id="data-management" role="tabpanel">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Estadísticas de Datos</h6>
                            </div>
                            <div class="card-body">
                                <div id="data-stats">
                                    <!-- Se cargan dinámicamente -->
                                </div>
                                <button class="btn btn-info" onclick="refreshDataStats()">
                                    <i class="fas fa-refresh me-1"></i> Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Operaciones de Datos</h6>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-success" onclick="exportAllData()">
                                        <i class="fas fa-download me-1"></i> Exportar Todos los Datos
                                    </button>
                                    <button class="btn btn-warning" onclick="showImportModal()">
                                        <i class="fas fa-upload me-1"></i> Importar Datos
                                    </button>
                                    <button class="btn btn-danger" onclick="confirmClearAllData()">
                                        <i class="fas fa-trash me-1"></i> Limpiar Todos los Datos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Logs del Sistema -->
            <div class="tab-pane fade" id="system-logs" role="tabpanel">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Registro de Actividades</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <button class="btn btn-outline-primary btn-sm" onclick="refreshSystemLogs()">
                                <i class="fas fa-sync me-1"></i> Actualizar Logs
                            </button>
                            <button class="btn btn-outline-danger btn-sm ms-2" onclick="clearSystemLogs()">
                                <i class="fas fa-trash me-1"></i> Limpiar Logs
                            </button>
                        </div>
                        <div id="system-logs-content" style="max-height: 400px; overflow-y: auto;">
                            <!-- Logs se cargan aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadSystemData();
}

async function loadSystemData() {
    try {
        // Verificar conexión API
        await testApiConnection();
        
        // Cargar estadísticas de datos
        refreshDataStats();
        
        // Cargar logs del sistema
        refreshSystemLogs();
        
        // Actualizar estadísticas de almacenamiento
        updateStorageStats();
        
    } catch (error) {
        console.error('Error cargando datos del sistema:', error);
    }
}

async function testApiConnection() {
    try {
        const health = await window.apiClient.healthCheck();
        document.getElementById('api-connection').textContent = 'Conectada';
        document.getElementById('api-status-details').innerHTML = 
            `<div class="text-success"><i class="fas fa-check-circle"></i> ${health.message}</div>`;
    } catch (error) {
        document.getElementById('api-connection').textContent = 'Desconectada';
        document.getElementById('api-status-details').innerHTML = 
            `<div class="text-warning"><i class="fas fa-exclamation-triangle"></i> Usando almacenamiento local: ${error.message}</div>`;
    }
}

function refreshDataStats() {
    const collections = ['estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas', 'eventos'];
    let statsHtml = '<div class="row">';
    
    collections.forEach(collection => {
        const count = db.count(collection);
        statsHtml += `
            <div class="col-6 mb-2">
                <div class="d-flex justify-content-between">
                    <span class="text-capitalize">${collection}:</span>
                    <span class="badge bg-primary">${count}</span>
                </div>
            </div>
        `;
    });
    
    statsHtml += '</div>';
    document.getElementById('data-stats').innerHTML = statsHtml;
}

function updateStorageStats() {
    const stats = db.getStorageStats();
    document.getElementById('storage-usage').textContent = stats.totalSize;
}

function refreshSystemLogs() {
    const logs = db.getLogs(50);
    let logsHtml = '';
    
    if (logs.length === 0) {
        logsHtml = '<div class="text-muted">No hay logs disponibles</div>';
    } else {
        logs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleString();
            const typeClass = getLogTypeClass(log.action);
            logsHtml += `
                <div class="border-bottom py-2">
                    <div class="d-flex justify-content-between">
                        <span class="badge ${typeClass}">${log.action}</span>
                        <small class="text-muted">${date}</small>
                    </div>
                    <div class="small mt-1">
                        <strong>${log.collection}</strong> - ${log.details}
                    </div>
                </div>
            `;
        });
    }
    
    document.getElementById('system-logs-content').innerHTML = logsHtml;
}

function getLogTypeClass(action) {
    switch (action.toLowerCase()) {
        case 'create': return 'bg-success';
        case 'update': return 'bg-warning';
        case 'delete': return 'bg-danger';
        case 'read': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function clearSystemLogs() {
    if (confirm('¿Está seguro de que desea limpiar todos los logs del sistema?')) {
        localStorage.removeItem('system_logs');
        refreshSystemLogs();
        showGlobalAlert('Logs del sistema limpiados correctamente', 'success');
    }
}

function confirmClearAllData() {
    Swal.fire({
        title: '¿Eliminar todos los datos?',
        text: 'Esta acción no se puede deshacer. Todos los datos del sistema serán eliminados permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            db.clearAll();
            refreshDataStats();
            updateStorageStats();
            Swal.fire(
                'Datos eliminados',
                'Todos los datos han sido eliminados correctamente.',
                'success'
            );
        }
    });
}

console.log('✅ Sistema.js cargado correctamente');