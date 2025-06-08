/**
 * Módulo de configuración y administración del sistema
 * Funcionalidades para configuración, usuarios, respaldos y mantenimiento
 */

let sistemaConfig = {};
let systemUsers = [];
let systemLogs = [];

// Función principal para cargar la sección de sistema
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
                            <i class="fas fa-download me-1"></i> Crear Respaldo
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="showImportModal()">
                            <i class="fas fa-upload me-1"></i> Importar Datos
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="resetSystem()">
                            <i class="fas fa-trash me-1"></i> Limpiar Sistema
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navegación por pestañas -->
        <ul class="nav nav-tabs mb-3" id="sistemaTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab">
                    <i class="fas fa-school me-2"></i> Información General
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="usuarios-tab" data-bs-toggle="tab" data-bs-target="#usuarios" type="button" role="tab">
                    <i class="fas fa-users me-2"></i> Usuarios
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="configuracion-tab" data-bs-toggle="tab" data-bs-target="#configuracion" type="button" role="tab">
                    <i class="fas fa-sliders-h me-2"></i> Configuración
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="respaldos-tab" data-bs-toggle="tab" data-bs-target="#respaldos" type="button" role="tab">
                    <i class="fas fa-hdd me-2"></i> Respaldos
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="logs-tab" data-bs-toggle="tab" data-bs-target="#logs" type="button" role="tab">
                    <i class="fas fa-list-alt me-2"></i> Logs del Sistema
                </button>
            </li>
        </ul>

        <!-- Contenido de las pestañas -->
        <div class="tab-content" id="sistemaTabContent">
            <!-- Pestaña de Información General -->
            <div class="tab-pane fade show active" id="general" role="tabpanel">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Información de la Institución</h6>
                            </div>
                            <div class="card-body">
                                <form id="institucionForm">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="nombreInstitucion" class="form-label">Nombre de la Institución</label>
                                                <input type="text" class="form-control" id="nombreInstitucion" name="nombre" 
                                                       value="Escuela Jesús El Buen Maestro">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="codigoInstitucion" class="form-label">Código de Centro</label>
                                                <input type="text" class="form-control" id="codigoInstitucion" name="codigo" 
                                                       value="EJBM-001">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="telefonoInstitucion" class="form-label">Teléfono</label>
                                                <input type="tel" class="form-control" id="telefonoInstitucion" name="telefono" 
                                                       value="809-123-4567">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="emailInstitucion" class="form-label">Email</label>
                                                <input type="email" class="form-control" id="emailInstitucion" name="email" 
                                                       value="info@escuelajesuselbuenmaestro.edu.do">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="direccionInstitucion" class="form-label">Dirección</label>
                                        <textarea class="form-control" id="direccionInstitucion" name="direccion" rows="2">Santo Domingo, República Dominicana</textarea>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="directorGeneral" class="form-label">Director(a) General</label>
                                                <input type="text" class="form-control" id="directorGeneral" name="director">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="anoFundacion" class="form-label">Año de Fundación</label>
                                                <input type="number" class="form-control" id="anoFundacion" name="anoFundacion" 
                                                       min="1900" max="2024">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="misionInstitucion" class="form-label">Misión</label>
                                        <textarea class="form-control" id="misionInstitucion" name="mision" rows="3"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label for="visionInstitucion" class="form-label">Visión</label>
                                        <textarea class="form-control" id="visionInstitucion" name="vision" rows="3"></textarea>
                                    </div>

                                    <button type="button" class="btn btn-primary" onclick="saveInstitucionInfo()">
                                        <i class="fas fa-save me-1"></i> Guardar Información
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <!-- Estadísticas del sistema -->
                        <div class="card mb-3">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Estadísticas del Sistema</h6>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <small class="text-muted">Estudiantes Registrados</small>
                                    <div class="fw-bold" id="stats-estudiantes">0</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Profesores Activos</small>
                                    <div class="fw-bold" id="stats-profesores">0</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Notas Registradas</small>
                                    <div class="fw-bold" id="stats-notas">0</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Matrículas Activas</small>
                                    <div class="fw-bold" id="stats-matriculas">0</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Espacio Utilizado</small>
                                    <div class="fw-bold" id="stats-storage">0 KB</div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Último Respaldo</small>
                                    <div class="fw-bold" id="stats-backup">Nunca</div>
                                </div>
                            </div>
                        </div>

                        <!-- Estado del sistema -->
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Estado del Sistema</h6>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Base de Datos</span>
                                    <span class="badge bg-success">Activa</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Almacenamiento Local</span>
                                    <span class="badge bg-success">Disponible</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Última Sincronización</span>
                                    <span class="text-muted small" id="last-sync">Ahora</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Usuarios -->
            <div class="tab-pane fade" id="usuarios" role="tabpanel">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="m-0 font-weight-bold">Gestión de Usuarios del Sistema</h6>
                        <button type="button" class="btn btn-primary btn-sm" onclick="showAddUserModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Usuario
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="usersTableContainer">
                            <!-- Tabla de usuarios se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Configuración -->
            <div class="tab-pane fade" id="configuracion" role="tabpanel">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Configuración Académica</h6>
                            </div>
                            <div class="card-body">
                                <form id="configAcademicaForm">
                                    <div class="mb-3">
                                        <label for="anoLectivoActual" class="form-label">Año Lectivo Actual</label>
                                        <select class="form-select" id="anoLectivoActual" name="anoLectivo">
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="trimestreActual" class="form-label">Trimestre Actual</label>
                                        <select class="form-select" id="trimestreActual" name="trimestre">
                                            <option value="1er Trimestre">1er Trimestre</option>
                                            <option value="2do Trimestre">2do Trimestre</option>
                                            <option value="3er Trimestre">3er Trimestre</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="notaMinima" class="form-label">Nota Mínima de Aprobación</label>
                                        <input type="number" class="form-control" id="notaMinima" name="notaMinima" 
                                               min="0" max="100" value="70">
                                    </div>

                                    <div class="mb-3">
                                        <label for="horasClase" class="form-label">Horas de Clase por Día</label>
                                        <input type="number" class="form-control" id="horasClase" name="horasClase" 
                                               min="1" max="12" value="6">
                                    </div>

                                    <div class="mb-3">
                                        <label for="modalidadClases" class="form-label">Modalidad de Clases</label>
                                        <select class="form-select" id="modalidadClases" name="modalidad">
                                            <option value="Presencial">Presencial</option>
                                            <option value="Virtual">Virtual</option>
                                            <option value="Híbrida">Híbrida</option>
                                        </select>
                                    </div>

                                    <button type="button" class="btn btn-primary" onclick="saveConfigAcademica()">
                                        <i class="fas fa-save me-1"></i> Guardar Configuración
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Configuración del Sistema</h6>
                            </div>
                            <div class="card-body">
                                <form id="configSistemaForm">
                                    <div class="mb-3">
                                        <label for="autoBackup" class="form-label">Respaldo Automático</label>
                                        <select class="form-select" id="autoBackup" name="autoBackup">
                                            <option value="false">Desactivado</option>
                                            <option value="daily">Diario</option>
                                            <option value="weekly">Semanal</option>
                                            <option value="monthly">Mensual</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="idiomaSistema" class="form-label">Idioma del Sistema</label>
                                        <select class="form-select" id="idiomaSistema" name="idioma">
                                            <option value="es">Español</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="formatoFecha" class="form-label">Formato de Fecha</label>
                                        <select class="form-select" id="formatoFecha" name="formatoFecha">
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="zonaHoraria" class="form-label">Zona Horaria</label>
                                        <select class="form-select" id="zonaHoraria" name="zonaHoraria">
                                            <option value="America/Santo_Domingo">Santo Domingo (GMT-4)</option>
                                            <option value="America/New_York">Nueva York (GMT-5)</option>
                                            <option value="UTC">UTC (GMT+0)</option>
                                        </select>
                                    </div>

                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="notificaciones" name="notificaciones" checked>
                                        <label class="form-check-label" for="notificaciones">
                                            Activar Notificaciones
                                        </label>
                                    </div>

                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="modoOscuro" name="modoOscuro">
                                        <label class="form-check-label" for="modoOscuro">
                                            Modo Oscuro
                                        </label>
                                    </div>

                                    <button type="button" class="btn btn-primary" onclick="saveConfigSistema()">
                                        <i class="fas fa-save me-1"></i> Guardar Configuración
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Respaldos -->
            <div class="tab-pane fade" id="respaldos" role="tabpanel">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Historial de Respaldos</h6>
                            </div>
                            <div class="card-body">
                                <div id="backupsHistoryContainer">
                                    <!-- Historial de respaldos se cargará aquí -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Operaciones de Respaldo</h6>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button type="button" class="btn btn-primary" onclick="createBackup()">
                                        <i class="fas fa-download me-2"></i> Crear Respaldo Completo
                                    </button>
                                    
                                    <button type="button" class="btn btn-outline-primary" onclick="createPartialBackup()">
                                        <i class="fas fa-file-export me-2"></i> Respaldo Parcial
                                    </button>
                                    
                                    <button type="button" class="btn btn-success" onclick="showRestoreModal()">
                                        <i class="fas fa-upload me-2"></i> Restaurar Respaldo
                                    </button>
                                    
                                    <hr>
                                    
                                    <button type="button" class="btn btn-outline-secondary" onclick="exportData('estudiantes')">
                                        <i class="fas fa-user-graduate me-2"></i> Exportar Estudiantes
                                    </button>
                                    
                                    <button type="button" class="btn btn-outline-secondary" onclick="exportData('profesores')">
                                        <i class="fas fa-chalkboard-teacher me-2"></i> Exportar Profesores
                                    </button>
                                    
                                    <button type="button" class="btn btn-outline-secondary" onclick="exportData('notas')">
                                        <i class="fas fa-star me-2"></i> Exportar Notas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Logs -->
            <div class="tab-pane fade" id="logs" role="tabpanel">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="m-0 font-weight-bold">Logs del Sistema</h6>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-secondary" onclick="clearLogs()">
                                <i class="fas fa-trash me-1"></i> Limpiar Logs
                            </button>
                            <button type="button" class="btn btn-outline-secondary" onclick="exportLogs()">
                                <i class="fas fa-download me-1"></i> Exportar Logs
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3">
                                    <select class="form-select form-select-sm" id="logLevelFilter" onchange="filterLogs()">
                                        <option value="">Todos los niveles</option>
                                        <option value="INFO">Info</option>
                                        <option value="WARNING">Advertencia</option>
                                        <option value="ERROR">Error</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <input type="date" class="form-control form-control-sm" id="logDateFilter" onchange="filterLogs()">
                                </div>
                                <div class="col-md-5">
                                    <input type="text" class="form-control form-control-sm" id="logSearchFilter" 
                                           placeholder="Buscar en logs..." oninput="filterLogs()">
                                </div>
                            </div>
                        </div>
                        <div id="logsContainer" style="max-height: 500px; overflow-y: auto;">
                            <!-- Logs se cargarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para agregar usuario -->
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user-plus me-2"></i>
                            Nuevo Usuario del Sistema
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            <input type="hidden" id="userId">
                            
                            <div class="mb-3">
                                <label for="userName" class="form-label">Nombre de Usuario</label>
                                <input type="text" class="form-control" id="userName" name="username" required>
                            </div>

                            <div class="mb-3">
                                <label for="userFullName" class="form-label">Nombre Completo</label>
                                <input type="text" class="form-control" id="userFullName" name="fullName" required>
                            </div>

                            <div class="mb-3">
                                <label for="userEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="userEmail" name="email" required>
                            </div>

                            <div class="mb-3">
                                <label for="userRole" class="form-label">Rol</label>
                                <select class="form-select" id="userRole" name="role" required>
                                    <option value="">Seleccionar rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Director">Director</option>
                                    <option value="Secretario">Secretario</option>
                                    <option value="Profesor">Profesor</option>
                                    <option value="Solo Lectura">Solo Lectura</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="userPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="userPassword" name="password" required>
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="userActive" name="active" checked>
                                <label class="form-check-label" for="userActive">
                                    Usuario Activo
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveUser()">
                            <i class="fas fa-save me-1"></i> Guardar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para importar datos -->
        <div class="modal fade" id="importModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-upload me-2"></i>
                            Importar Datos
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="importFile" class="form-label">Seleccionar Archivo de Respaldo</label>
                            <input type="file" class="form-control" id="importFile" accept=".json,.xlsx,.csv">
                        </div>
                        
                        <div class="mb-3">
                            <label for="importType" class="form-label">Tipo de Importación</label>
                            <select class="form-select" id="importType">
                                <option value="full">Respaldo Completo</option>
                                <option value="students">Solo Estudiantes</option>
                                <option value="teachers">Solo Profesores</option>
                                <option value="grades">Solo Notas</option>
                            </select>
                        </div>

                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Advertencia:</strong> La importación reemplazará los datos existentes. Se recomienda crear un respaldo antes de continuar.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-warning" onclick="processImport()">
                            <i class="fas fa-upload me-1"></i> Importar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos iniciales
    loadSistemaData();
    updateSystemStats();
    loadUsers();
    loadBackupsHistory();
    loadSystemLogs();
    loadSystemConfig();
}

// Función para cargar datos del sistema
function loadSistemaData() {
    try {
        // Cargar configuración del sistema
        sistemaConfig = JSON.parse(localStorage.getItem('sistemaConfig') || '{}');
        
        // Cargar usuarios del sistema
        systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
        
        // Cargar logs del sistema
        systemLogs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
        
        // Inicializar configuración por defecto si no existe
        if (Object.keys(sistemaConfig).length === 0) {
            sistemaConfig = {
                institucion: {
                    nombre: 'Escuela Jesús El Buen Maestro',
                    codigo: 'EJBM-001',
                    telefono: '809-123-4567',
                    email: 'info@escuelajesuselbuenmaestro.edu.do',
                    direccion: 'Santo Domingo, República Dominicana'
                },
                academica: {
                    anoLectivo: '2024',
                    trimestre: '1er Trimestre',
                    notaMinima: 70,
                    horasClase: 6,
                    modalidad: 'Presencial'
                },
                sistema: {
                    autoBackup: 'false',
                    idioma: 'es',
                    formatoFecha: 'DD/MM/YYYY',
                    zonaHoraria: 'America/Santo_Domingo',
                    notificaciones: true,
                    modoOscuro: false
                }
            };
            saveSistemaConfig();
        }
        
        // Crear usuario administrador por defecto si no existe
        if (systemUsers.length === 0) {
            systemUsers.push({
                id: 1,
                username: 'admin',
                fullName: 'Administrador del Sistema',
                email: 'admin@escuela.edu.do',
                role: 'Administrador',
                active: true,
                password: 'admin123', // En un sistema real, esto estaría hasheado
                dateCreated: new Date().toISOString(),
                lastLogin: null
            });
            saveSystemUsers();
        }
        
    } catch (error) {
        console.error('Error al cargar datos del sistema:', error);
        addSystemLog('ERROR', 'Error al cargar configuración del sistema');
    }
}

// Función para actualizar estadísticas del sistema
function updateSystemStats() {
    try {
        const stats = db.getEstadisticas();
        
        document.getElementById('stats-estudiantes').textContent = stats.totalEstudiantes;
        document.getElementById('stats-profesores').textContent = stats.totalProfesores;
        document.getElementById('stats-notas').textContent = db.getNotas().length;
        document.getElementById('stats-matriculas').textContent = stats.totalMatriculas;
        
        // Calcular espacio utilizado (aproximado)
        const dataSize = JSON.stringify(db.exportarDatos()).length;
        document.getElementById('stats-storage').textContent = (dataSize / 1024).toFixed(2) + ' KB';
        
        // Último respaldo
        const lastBackup = localStorage.getItem('lastBackupDate');
        document.getElementById('stats-backup').textContent = lastBackup ? formatDate(lastBackup) : 'Nunca';
        
        // Última sincronización
        document.getElementById('last-sync').textContent = formatDate(new Date().toISOString(), true);
        
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        addSystemLog('ERROR', 'Error al actualizar estadísticas del sistema');
    }
}

// Función para guardar información de la institución
function saveInstitucionInfo() {
    try {
        const form = document.getElementById('institucionForm');
        const formData = new FormData(form);
        
        sistemaConfig.institucion = {};
        for (let [key, value] of formData.entries()) {
            sistemaConfig.institucion[key] = value;
        }
        
        saveSistemaConfig();
        addSystemLog('INFO', 'Información de la institución actualizada');
        showAlert.success('¡Guardado!', 'Información de la institución actualizada correctamente');
        
    } catch (error) {
        console.error('Error al guardar información:', error);
        addSystemLog('ERROR', 'Error al guardar información de la institución');
        showAlert.error('Error', 'No se pudo guardar la información');
    }
}

// Función para guardar configuración académica
function saveConfigAcademica() {
    try {
        const form = document.getElementById('configAcademicaForm');
        const formData = new FormData(form);
        
        sistemaConfig.academica = {};
        for (let [key, value] of formData.entries()) {
            sistemaConfig.academica[key] = value;
        }
        
        saveSistemaConfig();
        addSystemLog('INFO', 'Configuración académica actualizada');
        showAlert.success('¡Guardado!', 'Configuración académica actualizada correctamente');
        
    } catch (error) {
        console.error('Error al guardar configuración académica:', error);
        addSystemLog('ERROR', 'Error al guardar configuración académica');
        showAlert.error('Error', 'No se pudo guardar la configuración');
    }
}

// Función para guardar configuración del sistema
function saveConfigSistema() {
    try {
        const form = document.getElementById('configSistemaForm');
        const formData = new FormData(form);
        
        sistemaConfig.sistema = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'notificaciones' || key === 'modoOscuro') {
                sistemaConfig.sistema[key] = form.querySelector(`[name="${key}"]`).checked;
            } else {
                sistemaConfig.sistema[key] = value;
            }
        }
        
        saveSistemaConfig();
        addSystemLog('INFO', 'Configuración del sistema actualizada');
        showAlert.success('¡Guardado!', 'Configuración del sistema actualizada correctamente');
        
        // Aplicar configuración inmediatamente si es necesario
        if (sistemaConfig.sistema.modoOscuro) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
    } catch (error) {
        console.error('Error al guardar configuración del sistema:', error);
        addSystemLog('ERROR', 'Error al guardar configuración del sistema');
        showAlert.error('Error', 'No se pudo guardar la configuración');
    }
}

// Función para cargar configuración en los formularios
function loadSystemConfig() {
    try {
        // Cargar información de la institución
        if (sistemaConfig.institucion) {
            Object.keys(sistemaConfig.institucion).forEach(key => {
                const field = document.getElementById(key === 'nombre' ? 'nombreInstitucion' : 
                                                   key === 'codigo' ? 'codigoInstitucion' :
                                                   key === 'telefono' ? 'telefonoInstitucion' :
                                                   key === 'email' ? 'emailInstitucion' :
                                                   key === 'direccion' ? 'direccionInstitucion' :
                                                   key);
                if (field) {
                    field.value = sistemaConfig.institucion[key];
                }
            });
        }
        
        // Cargar configuración académica
        if (sistemaConfig.academica) {
            Object.keys(sistemaConfig.academica).forEach(key => {
                const field = document.getElementById(key === 'anoLectivo' ? 'anoLectivoActual' :
                                                   key === 'trimestre' ? 'trimestreActual' :
                                                   key === 'modalidad' ? 'modalidadClases' :
                                                   key);
                if (field) {
                    field.value = sistemaConfig.academica[key];
                }
            });
        }
        
        // Cargar configuración del sistema
        if (sistemaConfig.sistema) {
            Object.keys(sistemaConfig.sistema).forEach(key => {
                const field = document.getElementById(key === 'idioma' ? 'idiomaSistema' : key);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = sistemaConfig.sistema[key];
                    } else {
                        field.value = sistemaConfig.sistema[key];
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        addSystemLog('ERROR', 'Error al cargar configuración del sistema');
    }
}

// Función para guardar configuración del sistema
function saveSistemaConfig() {
    try {
        localStorage.setItem('sistemaConfig', JSON.stringify(sistemaConfig));
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        throw error;
    }
}

// Función para cargar usuarios
function loadUsers() {
    const container = document.getElementById('usersTableContainer');
    
    if (systemUsers.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay usuarios registrados en el sistema.</p>';
        return;
    }
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Último Acceso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    systemUsers.forEach(user => {
        const statusBadge = user.active 
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Inactivo</span>';
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">
                            ${user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <strong>${user.username}</strong>
                    </div>
                </td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                    <span class="badge bg-primary">${user.role}</span>
                </td>
                <td>${statusBadge}</td>
                <td>${user.lastLogin ? formatDate(user.lastLogin, true) : 'Nunca'}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-warning" onclick="editUser(${user.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table></div>';
    container.innerHTML = tableHTML;
}

// Función para mostrar modal de nuevo usuario
function showAddUserModal() {
    document.getElementById('userId').value = '';
    clearForm(document.getElementById('userForm'));
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

// Función para editar usuario
function editUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (!user) {
        showAlert.error('Error', 'Usuario no encontrado');
        return;
    }
    
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.username;
    document.getElementById('userFullName').value = user.fullName;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPassword').value = user.password;
    document.getElementById('userActive').checked = user.active;
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

// Función para guardar usuario
function saveUser() {
    try {
        const form = document.getElementById('userForm');
        
        if (!validateForm(form)) {
            showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
            return;
        }
        
        const formData = new FormData(form);
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            if (key === 'active') {
                userData[key] = true;
            } else {
                userData[key] = value;
            }
        }
        
        const userId = document.getElementById('userId').value;
        
        if (userId) {
            // Actualizar usuario existente
            const userIndex = systemUsers.findIndex(u => u.id == userId);
            if (userIndex !== -1) {
                systemUsers[userIndex] = { ...systemUsers[userIndex], ...userData };
                addSystemLog('INFO', `Usuario ${userData.username} actualizado`);
            }
        } else {
            // Crear nuevo usuario
            const newId = systemUsers.length > 0 ? Math.max(...systemUsers.map(u => u.id)) + 1 : 1;
            userData.id = newId;
            userData.active = document.getElementById('userActive').checked;
            userData.dateCreated = new Date().toISOString();
            userData.lastLogin = null;
            
            systemUsers.push(userData);
            addSystemLog('INFO', `Nuevo usuario ${userData.username} creado`);
        }
        
        saveSystemUsers();
        loadUsers();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        modal.hide();
        
        showAlert.success('¡Guardado!', 'Usuario guardado correctamente');
        
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        addSystemLog('ERROR', 'Error al guardar usuario');
        showAlert.error('Error', 'No se pudo guardar el usuario');
    }
}

// Función para eliminar usuario
function deleteUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (!user) {
        showAlert.error('Error', 'Usuario no encontrado');
        return;
    }
    
    if (user.username === 'admin') {
        showAlert.error('Error', 'No se puede eliminar el usuario administrador');
        return;
    }
    
    showAlert.confirm(
        '¿Eliminar Usuario?',
        `¿Estás seguro de que deseas eliminar al usuario "${user.fullName}"?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                systemUsers = systemUsers.filter(u => u.id !== id);
                saveSystemUsers();
                loadUsers();
                
                addSystemLog('WARNING', `Usuario ${user.username} eliminado`);
                showAlert.success('¡Eliminado!', 'Usuario eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                addSystemLog('ERROR', 'Error al eliminar usuario');
                showAlert.error('Error', 'No se pudo eliminar el usuario');
            }
        }
    });
}

// Función para guardar usuarios del sistema
function saveSystemUsers() {
    try {
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    } catch (error) {
        console.error('Error al guardar usuarios:', error);
        throw error;
    }
}

// Función para crear respaldo completo
function createBackup() {
    try {
        const backupData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            system: 'Escuela Jesús El Buen Maestro',
            data: db.exportarDatos(),
            config: sistemaConfig,
            users: systemUsers.map(user => ({ ...user, password: '***' })) // No incluir contraseñas en el respaldo
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `respaldo_escuela_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        // Registrar el respaldo
        localStorage.setItem('lastBackupDate', new Date().toISOString());
        addSystemLog('INFO', 'Respaldo completo creado exitosamente');
        
        // Actualizar historial de respaldos
        const backupsHistory = JSON.parse(localStorage.getItem('backupsHistory') || '[]');
        backupsHistory.unshift({
            id: Date.now(),
            type: 'Completo',
            date: new Date().toISOString(),
            size: dataStr.length,
            filename: link.download
        });
        
        // Mantener solo los últimos 10 respaldos en el historial
        if (backupsHistory.length > 10) {
            backupsHistory.splice(10);
        }
        
        localStorage.setItem('backupsHistory', JSON.stringify(backupsHistory));
        
        updateSystemStats();
        loadBackupsHistory();
        
        showAlert.success('¡Respaldo Creado!', 'El respaldo completo se ha descargado correctamente');
        
    } catch (error) {
        console.error('Error al crear respaldo:', error);
        addSystemLog('ERROR', 'Error al crear respaldo completo');
        showAlert.error('Error', 'No se pudo crear el respaldo');
    }
}

// Función para crear respaldo parcial
function createPartialBackup() {
    showAlert.confirm(
        'Respaldo Parcial',
        '¿Qué datos deseas incluir en el respaldo?'
    ).then((result) => {
        if (result.isConfirmed) {
            // Aquí se podría implementar un selector de datos específicos
            // Por simplicidad, crearemos un respaldo solo de estudiantes
            try {
                const partialData = {
                    version: '1.0',
                    timestamp: new Date().toISOString(),
                    type: 'Parcial - Solo Estudiantes',
                    system: 'Escuela Jesús El Buen Maestro',
                    data: {
                        estudiantes: db.getEstudiantes()
                    }
                };
                
                const dataStr = JSON.stringify(partialData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = `respaldo_parcial_estudiantes_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                
                addSystemLog('INFO', 'Respaldo parcial (estudiantes) creado');
                showAlert.success('¡Respaldo Parcial Creado!', 'El respaldo de estudiantes se ha descargado correctamente');
                
            } catch (error) {
                console.error('Error al crear respaldo parcial:', error);
                addSystemLog('ERROR', 'Error al crear respaldo parcial');
                showAlert.error('Error', 'No se pudo crear el respaldo parcial');
            }
        }
    });
}

// Función para mostrar modal de restaurar
function showRestoreModal() {
    showAlert.confirm(
        'Restaurar Respaldo',
        'Esta operación reemplazará todos los datos actuales. ¿Deseas continuar?'
    ).then((result) => {
        if (result.isConfirmed) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    restoreFromFile(file);
                }
            };
            input.click();
        }
    });
}

// Función para restaurar desde archivo
function restoreFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (backupData.data && backupData.version) {
                // Restaurar datos
                db.importarDatos(backupData.data);
                
                // Restaurar configuración si existe
                if (backupData.config) {
                    sistemaConfig = backupData.config;
                    saveSistemaConfig();
                }
                
                addSystemLog('INFO', 'Datos restaurados desde respaldo');
                showAlert.success('¡Restaurado!', 'Los datos se han restaurado correctamente');
                
                // Recargar la página para reflejar los cambios
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } else {
                throw new Error('Formato de archivo no válido');
            }
            
        } catch (error) {
            console.error('Error al restaurar respaldo:', error);
            addSystemLog('ERROR', 'Error al restaurar respaldo: ' + error.message);
            showAlert.error('Error', 'No se pudo restaurar el respaldo: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Función para exportar datos específicos
function exportData(type) {
    try {
        let data = [];
        let filename = '';
        
        switch (type) {
            case 'estudiantes':
                data = db.getEstudiantes();
                filename = 'estudiantes';
                break;
            case 'profesores':
                data = db.getProfesores();
                filename = 'profesores';
                break;
            case 'notas':
                data = db.getNotas();
                filename = 'notas';
                break;
            default:
                throw new Error('Tipo de datos no válido');
        }
        
        exportToExcel(`Datos de ${filename}`, data, filename);
        addSystemLog('INFO', `Datos de ${filename} exportados`);
        
    } catch (error) {
        console.error('Error al exportar datos:', error);
        addSystemLog('ERROR', `Error al exportar datos de ${type}`);
        showAlert.error('Error', 'No se pudieron exportar los datos');
    }
}

// Función para cargar historial de respaldos
function loadBackupsHistory() {
    const container = document.getElementById('backupsHistoryContainer');
    const backupsHistory = JSON.parse(localStorage.getItem('backupsHistory') || '[]');
    
    if (backupsHistory.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay respaldos en el historial.</p>';
        return;
    }
    
    let historyHTML = '<div class="list-group">';
    
    backupsHistory.forEach(backup => {
        const sizeKB = (backup.size / 1024).toFixed(2);
        
        historyHTML += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">
                        <i class="fas fa-file-archive me-2"></i>
                        ${backup.type}
                    </h6>
                    <small>${formatDate(backup.date, true)}</small>
                </div>
                <p class="mb-1">
                    <small class="text-muted">
                        Archivo: ${backup.filename} (${sizeKB} KB)
                    </small>
                </p>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    container.innerHTML = historyHTML;
}

// Función para mostrar modal de importar
function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Función para procesar importación
function processImport() {
    const fileInput = document.getElementById('importFile');
    const importType = document.getElementById('importType').value;
    
    if (!fileInput.files[0]) {
        showAlert.warning('Archivo Requerido', 'Por favor selecciona un archivo para importar');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
            } else {
                showAlert.error('Formato No Soportado', 'Solo se admiten archivos JSON por el momento');
                return;
            }
            
            // Procesar según el tipo de importación
            if (importType === 'full' && data.data) {
                db.importarDatos(data.data);
                addSystemLog('INFO', 'Importación completa realizada');
            } else if (importType === 'students' && data.estudiantes) {
                // Importar solo estudiantes
                data.estudiantes.forEach(estudiante => {
                    db.insertEstudiante(estudiante);
                });
                addSystemLog('INFO', 'Importación de estudiantes realizada');
            } else {
                throw new Error('Formato de datos no válido para el tipo de importación seleccionado');
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
            modal.hide();
            
            showAlert.success('¡Importado!', 'Los datos se han importado correctamente');
            
            // Actualizar estadísticas
            updateSystemStats();
            
        } catch (error) {
            console.error('Error al importar datos:', error);
            addSystemLog('ERROR', 'Error al importar datos: ' + error.message);
            showAlert.error('Error', 'No se pudieron importar los datos: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// Función para agregar log del sistema
function addSystemLog(level, message) {
    const log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: level,
        message: message,
        user: 'admin' // En un sistema real, esto vendría de la sesión actual
    };
    
    systemLogs.unshift(log);
    
    // Mantener solo los últimos 1000 logs
    if (systemLogs.length > 1000) {
        systemLogs.splice(1000);
    }
    
    saveSystemLogs();
    
    // Actualizar vista de logs si está visible
    if (document.getElementById('logs').classList.contains('show')) {
        loadSystemLogs();
    }
}

// Función para cargar logs del sistema
function loadSystemLogs() {
    const container = document.getElementById('logsContainer');
    let filteredLogs = [...systemLogs];
    
    // Aplicar filtros
    const levelFilter = document.getElementById('logLevelFilter')?.value;
    const dateFilter = document.getElementById('logDateFilter')?.value;
    const searchFilter = document.getElementById('logSearchFilter')?.value;
    
    if (levelFilter) {
        filteredLogs = filteredLogs.filter(log => log.level === levelFilter);
    }
    
    if (dateFilter) {
        const filterDate = new Date(dateFilter).toDateString();
        filteredLogs = filteredLogs.filter(log => 
            new Date(log.timestamp).toDateString() === filterDate
        );
    }
    
    if (searchFilter) {
        filteredLogs = filteredLogs.filter(log => 
            log.message.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }
    
    if (filteredLogs.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay logs que mostrar.</p>';
        return;
    }
    
    let logsHTML = '';
    
    filteredLogs.slice(0, 100).forEach(log => { // Mostrar solo los primeros 100 para rendimiento
        const levelClass = log.level === 'ERROR' ? 'text-danger' :
                          log.level === 'WARNING' ? 'text-warning' :
                          log.level === 'INFO' ? 'text-info' : 'text-muted';
        
        const levelIcon = log.level === 'ERROR' ? 'fas fa-exclamation-circle' :
                         log.level === 'WARNING' ? 'fas fa-exclamation-triangle' :
                         log.level === 'INFO' ? 'fas fa-info-circle' : 'fas fa-circle';
        
        logsHTML += `
            <div class="border-bottom py-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-1">
                            <i class="${levelIcon} ${levelClass} me-2"></i>
                            <span class="fw-bold ${levelClass}">${log.level}</span>
                            <small class="text-muted ms-2">${formatDate(log.timestamp, true)}</small>
                        </div>
                        <div class="text-dark">${log.message}</div>
                        <small class="text-muted">Usuario: ${log.user}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = logsHTML;
}

// Función para filtrar logs
function filterLogs() {
    loadSystemLogs();
}

// Función para limpiar logs
function clearLogs() {
    showAlert.confirm(
        '¿Limpiar Logs?',
        '¿Estás seguro de que deseas eliminar todos los logs del sistema?'
    ).then((result) => {
        if (result.isConfirmed) {
            systemLogs = [];
            saveSystemLogs();
            loadSystemLogs();
            addSystemLog('INFO', 'Logs del sistema limpiados');
            showAlert.success('¡Limpiado!', 'Logs del sistema eliminados correctamente');
        }
    });
}

// Función para exportar logs
function exportLogs() {
    if (systemLogs.length === 0) {
        showAlert.warning('Sin Logs', 'No hay logs para exportar');
        return;
    }
    
    const logsData = systemLogs.map(log => ({
        'Fecha/Hora': formatDate(log.timestamp, true),
        'Nivel': log.level,
        'Mensaje': log.message,
        'Usuario': log.user
    }));
    
    exportToExcel('Logs del Sistema', logsData, 'system_logs');
    addSystemLog('INFO', 'Logs del sistema exportados');
}

// Función para guardar logs del sistema
function saveSystemLogs() {
    try {
        localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
    } catch (error) {
        console.error('Error al guardar logs:', error);
    }
}

// Función para resetear el sistema
function resetSystem() {
    showAlert.confirm(
        '¿Resetear Sistema Completo?',
        'Esta acción eliminará TODOS los datos del sistema y no se puede deshacer. ¿Estás absolutamente seguro?'
    ).then((result) => {
        if (result.isConfirmed) {
            // Segunda confirmación
            showAlert.confirm(
                'CONFIRMACIÓN FINAL',
                'Escribe "RESETEAR" para confirmar que deseas eliminar todos los datos:'
            ).then((finalResult) => {
                if (finalResult.isConfirmed) {
                    try {
                        // Limpiar todos los datos
                        db.limpiarDatos();
                        
                        // Limpiar configuración y usuarios (excepto admin)
                        localStorage.removeItem('sistemaConfig');
                        localStorage.removeItem('systemUsers');
                        localStorage.removeItem('systemLogs');
                        localStorage.removeItem('backupsHistory');
                        localStorage.removeItem('lastBackupDate');
                        
                        showAlert.success('¡Sistema Reseteado!', 'El sistema se reiniciará en 3 segundos...');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                        
                    } catch (error) {
                        console.error('Error al resetear sistema:', error);
                        showAlert.error('Error', 'No se pudo resetear el sistema completamente');
                    }
                }
            });
        }
    });
}

// Exponer funciones globalmente
window.loadSistemaSection = loadSistemaSection;
window.saveInstitucionInfo = saveInstitucionInfo;
window.saveConfigAcademica = saveConfigAcademica;
window.saveConfigSistema = saveConfigSistema;
window.showAddUserModal = showAddUserModal;
window.editUser = editUser;
window.saveUser = saveUser;
window.deleteUser = deleteUser;
window.createBackup = createBackup;
window.createPartialBackup = createPartialBackup;
window.showRestoreModal = showRestoreModal;
window.exportData = exportData;
window.showImportModal = showImportModal;
window.processImport = processImport;
window.filterLogs = filterLogs;
window.clearLogs = clearLogs;
window.exportLogs = exportLogs;
window.resetSystem = resetSystem;

