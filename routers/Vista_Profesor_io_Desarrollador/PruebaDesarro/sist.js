/**
 * Módulo de configuración y administración del sistema
 * Funcionalidades para configuración, usuarios, respaldos y mantenimiento
 */

let sistemaConfig = {};
let systemUsers = [];
let systemLogs = [];
let currentUsersPage = 1;
const usersPerPage = 10;

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
                                                <label for="nombreInstitucion" class="form-label">Nombre de la Institución *</label>
                                                <input type="text" class="form-control" id="nombreInstitucion" name="nombre" 
                                                       value="Escuela Jesús El Buen Maestro" required>
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
                                                <label for="telefonoInstitucion" class="form-label">Teléfono *</label>
                                                <input type="tel" class="form-control" id="telefonoInstitucion" name="telefono" 
                                                       value="809-123-4567" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="emailInstitucion" class="form-label">Email *</label>
                                                <input type="email" class="form-control" id="emailInstitucion" name="email" 
                                                       value="info@escuelajesuselbuenmaestro.edu.do" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="direccionInstitucion" class="form-label">Dirección *</label>
                                        <textarea class="form-control" id="direccionInstitucion" name="direccion" rows="2" required>Santo Domingo, República Dominicana</textarea>
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
                                        <textarea class="form-control" id="misionInstitucion" name="mision" rows="3" 
                                                  placeholder="Misión de la institución educativa"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label for="visionInstitucion" class="form-label">Visión</label>
                                        <textarea class="form-control" id="visionInstitucion" name="vision" rows="3"
                                                  placeholder="Visión de la institución educativa"></textarea>
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
                                    <span>Almacenamiento Local</span>
                                    <span class="badge bg-success">Disponible</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Sistema Operativo</span>
                                    <span class="text-muted small" id="user-agent">Detectando...</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Última Actualización</span>
                                    <span class="text-muted small" id="last-update">Ahora</span>
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
                            <!-- La tabla de usuarios se cargará aquí -->
                        </div>
                        <div id="usersPagination" class="mt-3">
                            <!-- La paginación se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Configuración -->
            <div class="tab-pane fade" id="configuracion" role="tabpanel">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Configuración General</h6>
                            </div>
                            <div class="card-body">
                                <form id="configForm">
                                    <div class="mb-3">
                                        <label for="idiomaConfig" class="form-label">Idioma del Sistema</label>
                                        <select class="form-select" id="idiomaConfig" name="idioma">
                                            <option value="es">Español</option>
                                            <option value="en">Inglés</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="zonaHoraria" class="form-label">Zona Horaria</label>
                                        <select class="form-select" id="zonaHoraria" name="zonaHoraria">
                                            <option value="America/Santo_Domingo">Santo Domingo (UTC-4)</option>
                                            <option value="America/New_York">Nueva York (UTC-5)</option>
                                            <option value="America/Caracas">Caracas (UTC-4)</option>
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
                                        <label for="monedaConfig" class="form-label">Moneda</label>
                                        <select class="form-select" id="monedaConfig" name="moneda">
                                            <option value="DOP">Peso Dominicano (RD$)</option>
                                            <option value="USD">Dólar Americano ($)</option>
                                            <option value="EUR">Euro (€)</option>
                                        </select>
                                    </div>

                                    <button type="button" class="btn btn-primary" onclick="saveSystemConfig()">
                                        <i class="fas fa-save me-1"></i> Guardar Configuración
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Configuración Académica</h6>
                            </div>
                            <div class="card-body">
                                <form id="academicConfigForm">
                                    <div class="mb-3">
                                        <label for="anoLectivoActual" class="form-label">Año Lectivo Actual</label>
                                        <select class="form-select" id="anoLectivoActual" name="anoLectivoActual">
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="periodoActual" class="form-label">Período Actual</label>
                                        <select class="form-select" id="periodoActual" name="periodoActual">
                                            <option value="1er Trimestre">1er Trimestre</option>
                                            <option value="2do Trimestre">2do Trimestre</option>
                                            <option value="3er Trimestre">3er Trimestre</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="escalaNota" class="form-label">Escala de Calificación</label>
                                        <select class="form-select" id="escalaNota" name="escalaNota">
                                            <option value="0-100">0 - 100 puntos</option>
                                            <option value="0-20">0 - 20 puntos</option>
                                            <option value="A-F">A, B, C, D, F</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="notaMinima" class="form-label">Nota Mínima Aprobatoria</label>
                                        <input type="number" class="form-control" id="notaMinima" name="notaMinima" 
                                               value="70" min="0" max="100">
                                    </div>

                                    <button type="button" class="btn btn-primary" onclick="saveAcademicConfig()">
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
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Gestión de Respaldos</h6>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Crear Respaldo</h6>
                                <p class="text-muted">Genere un respaldo completo de todos los datos del sistema.</p>
                                <button type="button" class="btn btn-primary" onclick="createFullBackup()">
                                    <i class="fas fa-download me-1"></i> Crear Respaldo Completo
                                </button>
                            </div>
                            <div class="col-md-6">
                                <h6>Restaurar Sistema</h6>
                                <p class="text-muted">Restaure el sistema desde un archivo de respaldo.</p>
                                <input type="file" class="form-control mb-2" id="backupFile" accept=".json">
                                <button type="button" class="btn btn-warning" onclick="restoreBackup()">
                                    <i class="fas fa-upload me-1"></i> Restaurar Respaldo
                                </button>
                            </div>
                        </div>

                        <h6>Respaldos Automáticos</h6>
                        <div id="backupHistoryContainer">
                            <!-- Historial de respaldos se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de Logs -->
            <div class="tab-pane fade" id="logs" role="tabpanel">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="m-0 font-weight-bold">Logs del Sistema</h6>
                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="clearSystemLogs()">
                            <i class="fas fa-trash me-1"></i> Limpiar Logs
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="logsContainer">
                            <!-- Los logs se cargarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar usuario -->
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalTitle">
                            <i class="fas fa-user me-2"></i>
                            Nuevo Usuario
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            <input type="hidden" id="userId">
                            
                            <div class="mb-3">
                                <label for="nombreUsuario" class="form-label">Nombre Completo *</label>
                                <input type="text" class="form-control" id="nombreUsuario" name="nombre" required>
                            </div>

                            <div class="mb-3">
                                <label for="emailUsuario" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="emailUsuario" name="email" required>
                            </div>

                            <div class="mb-3">
                                <label for="rolUsuario" class="form-label">Rol *</label>
                                <select class="form-select" id="rolUsuario" name="rol" required>
                                    <option value="">Seleccionar rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Director">Director</option>
                                    <option value="Profesor">Profesor</option>
                                    <option value="Secretario">Secretario</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="passwordUsuario" class="form-label">Contraseña *</label>
                                <input type="password" class="form-control" id="passwordUsuario" name="password" required>
                            </div>

                            <div class="mb-3">
                                <label for="estadoUsuario" class="form-label">Estado *</label>
                                <select class="form-select" id="estadoUsuario" name="estado" required>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
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

        <!-- Modal de importación -->
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
                            <label for="importFile" class="form-label">Seleccionar archivo</label>
                            <input type="file" class="form-control" id="importFile" accept=".json,.xlsx,.csv">
                        </div>
                        <div class="mb-3">
                            <label for="importType" class="form-label">Tipo de datos</label>
                            <select class="form-select" id="importType">
                                <option value="estudiantes">Estudiantes</option>
                                <option value="profesores">Profesores</option>
                                <option value="matriculas">Matrículas</option>
                                <option value="notas">Notas</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="importData()">
                            <i class="fas fa-upload me-1"></i> Importar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadSistemaData();
    updateSystemStats();
    loadSystemUsers();
    loadSystemLogs();
    detectUserAgent();
}

// Función para cargar datos del sistema
function loadSistemaData() {
    const savedConfig = localStorage.getItem('sistemaConfig');
    if (savedConfig) {
        sistemaConfig = JSON.parse(savedConfig);
        loadConfigToForm();
    } else {
        // Configuración por defecto
        sistemaConfig = {
            idioma: 'es',
            zonaHoraria: 'America/Santo_Domingo',
            formatoFecha: 'DD/MM/YYYY',
            moneda: 'DOP',
            anoLectivoActual: getCurrentAcademicYear().toString(),
            periodoActual: getCurrentAcademicPeriod(),
            escalaNota: '0-100',
            notaMinima: 70
        };
        localStorage.setItem('sistemaConfig', JSON.stringify(sistemaConfig));
    }
}

// Función para cargar configuración en formularios
function loadConfigToForm() {
    // Configuración general
    const idiomaSelect = document.getElementById('idiomaConfig');
    const zonaSelect = document.getElementById('zonaHoraria');
    const fechaSelect = document.getElementById('formatoFecha');
    const monedaSelect = document.getElementById('monedaConfig');
    
    if (idiomaSelect) idiomaSelect.value = sistemaConfig.idioma || 'es';
    if (zonaSelect) zonaSelect.value = sistemaConfig.zonaHoraria || 'America/Santo_Domingo';
    if (fechaSelect) fechaSelect.value = sistemaConfig.formatoFecha || 'DD/MM/YYYY';
    if (monedaSelect) monedaSelect.value = sistemaConfig.moneda || 'DOP';
    
    // Configuración académica
    const anoSelect = document.getElementById('anoLectivoActual');
    const periodoSelect = document.getElementById('periodoActual');
    const escalaSelect = document.getElementById('escalaNota');
    const notaInput = document.getElementById('notaMinima');
    
    if (anoSelect) anoSelect.value = sistemaConfig.anoLectivoActual || getCurrentAcademicYear().toString();
    if (periodoSelect) periodoSelect.value = sistemaConfig.periodoActual || getCurrentAcademicPeriod();
    if (escalaSelect) escalaSelect.value = sistemaConfig.escalaNota || '0-100';
    if (notaInput) notaInput.value = sistemaConfig.notaMinima || 70;
}

// Función para actualizar estadísticas del sistema
function updateSystemStats() {
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const profesoresData = JSON.parse(localStorage.getItem('profesoresData')) || [];
    const notasData = JSON.parse(localStorage.getItem('notasData')) || [];
    const matriculasData = JSON.parse(localStorage.getItem('matriculasData')) || [];
    
    const estudiantesActivos = estudiantesData.filter(e => e.estado === 'Activo').length;
    const profesoresActivos = profesoresData.filter(p => p.estado === 'Activo').length;
    const matriculasActivas = matriculasData.filter(m => m.estado === 'Activa').length;
    
    // Calcular espacio usado (aproximado)
    const totalData = JSON.stringify({
        estudiantes: estudiantesData,
        profesores: profesoresData,
        notas: notasData,
        matriculas: matriculasData
    });
    const storageSize = Math.round(totalData.length / 1024); // KB
    
    document.getElementById('stats-estudiantes').textContent = estudiantesActivos;
    document.getElementById('stats-profesores').textContent = profesoresActivos;
    document.getElementById('stats-notas').textContent = notasData.length;
    document.getElementById('stats-matriculas').textContent = matriculasActivas;
    document.getElementById('stats-storage').textContent = `${storageSize} KB`;
    
    // Último respaldo
    const lastBackup = localStorage.getItem('lastBackupDate');
    document.getElementById('stats-backup').textContent = lastBackup ? 
        formatDateShort(lastBackup) : 'Nunca';
}

// Función para detectar información del sistema
function detectUserAgent() {
    const userAgentElement = document.getElementById('user-agent');
    if (userAgentElement) {
        const ua = navigator.userAgent;
        let os = 'Desconocido';
        
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iOS')) os = 'iOS';
        
        userAgentElement.textContent = os;
    }
    
    // Actualizar timestamp
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleTimeString('es-ES');
    }
}

// Función para cargar usuarios del sistema
function loadSystemUsers() {
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
        systemUsers = JSON.parse(savedUsers);
    } else {
        // Usuario administrador por defecto
        systemUsers = [
            {
                id: generateId(),
                nombre: 'Administrador',
                email: 'admin@escuela.edu.do',
                rol: 'Administrador',
                estado: 'Activo',
                fechaCreacion: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString()
            }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    }
    displaySystemUsers();
}

// Función para mostrar usuarios del sistema
function displaySystemUsers() {
    const container = document.getElementById('usersTableContainer');
    if (!container) return;

    if (systemUsers.length === 0) {
        showEmptyState(container, 'No hay usuarios registrados', 'fas fa-users');
        return;
    }

    // Paginar datos
    const paginatedData = paginateData(systemUsers, currentUsersPage, usersPerPage);
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Último Acceso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(user => {
        const estadoBadge = user.estado === 'Activo' ? 
            '<span class="badge bg-success">Activo</span>' : 
            '<span class="badge bg-danger">Inactivo</span>';
        
        tableHTML += `
            <tr>
                <td>
                    <div>
                        <div class="fw-bold">${user.nombre}</div>
                        <small class="text-muted">${user.email}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${user.rol}</span>
                </td>
                <td>${estadoBadge}</td>
                <td>${formatDateShort(user.ultimoAcceso)}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editUser('${user.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteUser('${user.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Actualizar paginación
    document.getElementById('usersPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentUsersPage, 'goToUsersPage');
}

// Función para cargar logs del sistema
function loadSystemLogs() {
    const savedLogs = localStorage.getItem('systemLogs');
    if (savedLogs) {
        systemLogs = JSON.parse(savedLogs);
    } else {
        systemLogs = [];
    }
    displaySystemLogs();
}

// Función para mostrar logs del sistema
function displaySystemLogs() {
    const container = document.getElementById('logsContainer');
    if (!container) return;

    if (systemLogs.length === 0) {
        showEmptyState(container, 'No hay logs del sistema', 'fas fa-list-alt');
        return;
    }

    let logsHTML = '<div class="log-container" style="max-height: 400px; overflow-y: auto;">';
    
    // Mostrar últimos 50 logs
    const recentLogs = systemLogs.slice(-50).reverse();
    
    recentLogs.forEach(log => {
        const logClass = getLogClass(log.level);
        logsHTML += `
            <div class="log-entry mb-2 p-2 border rounded ${logClass}">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold">[${log.level}]</span>
                    <small class="text-muted">${formatDate(log.timestamp, true)}</small>
                </div>
                <div>${log.message}</div>
                ${log.details ? `<small class="text-muted">${log.details}</small>` : ''}
            </div>
        `;
    });
    
    logsHTML += '</div>';
    container.innerHTML = logsHTML;
}

// Función para obtener clase CSS del log
function getLogClass(level) {
    switch (level) {
        case 'ERROR': return 'border-danger bg-danger-subtle';
        case 'WARNING': return 'border-warning bg-warning-subtle';
        case 'INFO': return 'border-info bg-info-subtle';
        case 'SUCCESS': return 'border-success bg-success-subtle';
        default: return 'border-secondary bg-light';
    }
}

// Función para agregar log al sistema
function addSystemLog(level, message, details = '') {
    const logEntry = {
        id: generateId(),
        level: level,
        message: message,
        details: details,
        timestamp: new Date().toISOString()
    };
    
    systemLogs.push(logEntry);
    
    // Mantener solo los últimos 1000 logs
    if (systemLogs.length > 1000) {
        systemLogs = systemLogs.slice(-1000);
    }
    
    localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
    displaySystemLogs();
}

// Función para guardar información de la institución
function saveInstitucionInfo() {
    const form = document.getElementById('institucionForm');
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const institucionInfo = {
        nombre: formData.get('nombre'),
        codigo: formData.get('codigo'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        direccion: formData.get('direccion'),
        director: formData.get('director'),
        anoFundacion: formData.get('anoFundacion'),
        mision: formData.get('mision'),
        vision: formData.get('vision'),
        fechaModificacion: new Date().toISOString()
    };
    
    localStorage.setItem('institucionInfo', JSON.stringify(institucionInfo));
    addSystemLog('SUCCESS', 'Información de la institución actualizada');
    showAlert.success('¡Guardado!', 'La información de la institución ha sido actualizada');
}

// Función para guardar configuración del sistema
function saveSystemConfig() {
    const formData = new FormData(document.getElementById('configForm'));
    
    sistemaConfig.idioma = formData.get('idioma');
    sistemaConfig.zonaHoraria = formData.get('zonaHoraria');
    sistemaConfig.formatoFecha = formData.get('formatoFecha');
    sistemaConfig.moneda = formData.get('moneda');
    sistemaConfig.fechaModificacion = new Date().toISOString();
    
    localStorage.setItem('sistemaConfig', JSON.stringify(sistemaConfig));
    addSystemLog('SUCCESS', 'Configuración general actualizada');
    showAlert.success('¡Guardado!', 'La configuración ha sido actualizada');
}

// Función para guardar configuración académica
function saveAcademicConfig() {
    const formData = new FormData(document.getElementById('academicConfigForm'));
    
    sistemaConfig.anoLectivoActual = formData.get('anoLectivoActual');
    sistemaConfig.periodoActual = formData.get('periodoActual');
    sistemaConfig.escalaNota = formData.get('escalaNota');
    sistemaConfig.notaMinima = parseInt(formData.get('notaMinima'));
    sistemaConfig.fechaModificacion = new Date().toISOString();
    
    localStorage.setItem('sistemaConfig', JSON.stringify(sistemaConfig));
    addSystemLog('SUCCESS', 'Configuración académica actualizada');
    showAlert.success('¡Guardado!', 'La configuración académica ha sido actualizada');
}

// Función para mostrar modal de nuevo usuario
function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user me-2"></i>Nuevo Usuario';
    document.getElementById('userId').value = '';
    clearForm(document.getElementById('userForm'));
    modal.show();
}

// Función para editar usuario
function editUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (!user) return;
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Usuario';
    
    document.getElementById('userId').value = user.id;
    document.getElementById('nombreUsuario').value = user.nombre;
    document.getElementById('emailUsuario').value = user.email;
    document.getElementById('rolUsuario').value = user.rol;
    document.getElementById('estadoUsuario').value = user.estado;
    document.getElementById('passwordUsuario').removeAttribute('required');
    
    modal.show();
}

// Función para guardar usuario
function saveUser() {
    const form = document.getElementById('userForm');
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const userId = document.getElementById('userId').value;
    
    const userData = {
        id: userId || generateId(),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        rol: formData.get('rol'),
        estado: formData.get('estado'),
        fechaModificacion: new Date().toISOString()
    };
    
    if (formData.get('password')) {
        userData.password = formData.get('password'); // En un sistema real, esto debería ser hasheado
    }
    
    const existingIndex = systemUsers.findIndex(u => u.id === userData.id);
    
    if (existingIndex >= 0) {
        systemUsers[existingIndex] = { ...systemUsers[existingIndex], ...userData };
        addSystemLog('SUCCESS', `Usuario ${userData.nombre} actualizado`);
        showAlert.success('¡Actualizado!', 'El usuario ha sido actualizado correctamente');
    } else {
        userData.fechaCreacion = new Date().toISOString();
        userData.ultimoAcceso = new Date().toISOString();
        systemUsers.push(userData);
        addSystemLog('SUCCESS', `Nuevo usuario ${userData.nombre} creado`);
        showAlert.success('¡Registrado!', 'El usuario ha sido registrado correctamente');
    }
    
    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    displaySystemUsers();
}

// Función para eliminar usuario
function deleteUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (!user) return;
    
    showAlert.confirm(
        '¿Está seguro?',
        `Esta acción eliminará al usuario ${user.nombre} permanentemente`
    ).then((result) => {
        if (result.isConfirmed) {
            systemUsers = systemUsers.filter(u => u.id !== id);
            localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
            addSystemLog('WARNING', `Usuario ${user.nombre} eliminado`);
            displaySystemUsers();
            showAlert.success('¡Eliminado!', 'El usuario ha sido eliminado correctamente');
        }
    });
}

// Función para cambiar página de usuarios
function goToUsersPage(page) {
    currentUsersPage = page;
    displaySystemUsers();
}

// Función para crear respaldo completo
function createFullBackup() {
    try {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                estudiantes: JSON.parse(localStorage.getItem('estudiantesData')) || [],
                profesores: JSON.parse(localStorage.getItem('profesoresData')) || [],
                matriculas: JSON.parse(localStorage.getItem('matriculasData')) || [],
                notas: JSON.parse(localStorage.getItem('notasData')) || [],
                usuarios: systemUsers,
                configuracion: sistemaConfig,
                institucion: JSON.parse(localStorage.getItem('institucionInfo')) || {}
            }
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_escuela_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        localStorage.setItem('lastBackupDate', new Date().toISOString());
        updateSystemStats();
        addSystemLog('SUCCESS', 'Respaldo completo creado exitosamente');
        showAlert.success('¡Respaldo Creado!', 'El respaldo se ha descargado correctamente');
    } catch (error) {
        addSystemLog('ERROR', 'Error al crear respaldo', error.message);
        showAlert.error('Error', 'No se pudo crear el respaldo');
    }
}

// Función para crear respaldo
function createBackup() {
    createFullBackup();
}

// Función para mostrar modal de importación
function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Función para importar datos
function importData() {
    const fileInput = document.getElementById('importFile');
    const importType = document.getElementById('importType').value;
    
    if (!fileInput.files[0]) {
        showAlert.error('Error', 'Por favor seleccione un archivo');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.data && data.data[importType]) {
                localStorage.setItem(`${importType}Data`, JSON.stringify(data.data[importType]));
                addSystemLog('SUCCESS', `Datos de ${importType} importados exitosamente`);
                showAlert.success('¡Importado!', `Los datos de ${importType} han sido importados correctamente`);
            } else {
                showAlert.error('Error', 'Formato de archivo no válido');
            }
        } catch (error) {
            addSystemLog('ERROR', 'Error al importar datos', error.message);
            showAlert.error('Error', 'No se pudo importar el archivo');
        }
    };
    
    reader.readAsText(file);
    bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
}

// Función para restaurar respaldo
function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    
    if (!fileInput.files[0]) {
        showAlert.error('Error', 'Por favor seleccione un archivo de respaldo');
        return;
    }
    
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción sobrescribirá todos los datos actuales del sistema'
    ).then((result) => {
        if (result.isConfirmed) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (backupData.data) {
                        // Restaurar datos
                        Object.keys(backupData.data).forEach(key => {
                            if (key === 'usuarios') {
                                systemUsers = backupData.data[key];
                                localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
                            } else if (key === 'configuracion') {
                                sistemaConfig = backupData.data[key];
                                localStorage.setItem('sistemaConfig', JSON.stringify(sistemaConfig));
                            } else if (key === 'institucion') {
                                localStorage.setItem('institucionInfo', JSON.stringify(backupData.data[key]));
                            } else {
                                localStorage.setItem(`${key}Data`, JSON.stringify(backupData.data[key]));
                            }
                        });
                        
                        addSystemLog('SUCCESS', 'Sistema restaurado desde respaldo');
                        showAlert.success('¡Restaurado!', 'El sistema ha sido restaurado exitosamente');
                        
                        // Recargar datos
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        showAlert.error('Error', 'Archivo de respaldo no válido');
                    }
                } catch (error) {
                    addSystemLog('ERROR', 'Error al restaurar respaldo', error.message);
                    showAlert.error('Error', 'No se pudo restaurar el respaldo');
                }
            };
            
            reader.readAsText(file);
        }
    });
}

// Función para limpiar sistema
function resetSystem() {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción eliminará TODOS los datos del sistema permanentemente'
    ).then((result) => {
        if (result.isConfirmed) {
            // Limpiar localStorage
            const keysToRemove = [
                'estudiantesData',
                'profesoresData',
                'matriculasData',
                'notasData',
                'systemUsers',
                'systemLogs',
                'institucionInfo'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            addSystemLog('WARNING', 'Sistema reiniciado - Todos los datos eliminados');
            showAlert.success('¡Sistema Limpio!', 'Todos los datos han sido eliminados');
            
            // Recargar la página
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    });
}

// Función para limpiar logs del sistema
function clearSystemLogs() {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción eliminará todos los logs del sistema'
    ).then((result) => {
        if (result.isConfirmed) {
            systemLogs = [];
            localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
            displaySystemLogs();
            showAlert.success('¡Logs Limpiados!', 'Todos los logs han sido eliminados');
        }
    });
}

// Inicializar sistema de logs
document.addEventListener('DOMContentLoaded', function() {
    // Agregar log de inicio de sesión
    if (typeof addSystemLog === 'function') {
        addSystemLog('INFO', 'Sistema iniciado', 'Usuario accedió al sistema de gestión escolar');
    }
});

// Función para exportar logs
function exportSystemLogs() {
    if (systemLogs.length === 0) {
        showAlert.warning('Sin datos', 'No hay logs para exportar');
        return;
    }
    
    const dataToExport = systemLogs.map(log => ({
        Fecha: formatDate(log.timestamp, true),
        Nivel: log.level,
        Mensaje: log.message,
        Detalles: log.details || ''
    }));
    
    exportToExcel('Logs del Sistema', dataToExport, 'logs_sistema_' + new Date().toISOString().split('T')[0]);
}

// Inicializar cuando se carga la sección
document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadSistemaSection === 'function') {
        // La función está disponible pero no la ejecutamos automáticamente
        // Se ejecutará cuando el usuario navegue a la sección
    }
});
