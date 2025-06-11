/**
 * Módulo de gestión de tutores
 * Funcionalidades CRUD para tutores y representantes legales
 */

let tutoresData = [];
let currentTutoresPage = 1;
const tutoresPerPage = 10;

// Función principal para cargar la sección de tutores
function loadTutoresSection() {
    const section = document.getElementById('tutores-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-users me-2"></i>
                    Gestión de Tutores
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showAddTutorModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Tutor
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportTutores()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshTutores()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total Tutores
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-tutores">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-users fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Tutores Activos
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="tutores-activos">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-user-check fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Padres
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-padres">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-male fa-2x text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Madres
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-madres">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-female fa-2x text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-4">
                    <label for="searchTutores" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchTutores" 
                           placeholder="Nombre, apellido o cédula..." 
                           oninput="filterTutores()">
                </div>
                <div class="col-md-3">
                    <label for="filterParentesco" class="form-label">Parentesco:</label>
                    <select class="form-select" id="filterParentesco" onchange="filterTutores()">
                        <option value="">Todos</option>
                        <option value="Padre">Padre</option>
                        <option value="Madre">Madre</option>
                        <option value="Abuelo/a">Abuelo/a</option>
                        <option value="Tío/a">Tío/a</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filterEstadoTutor" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstadoTutor" onchange="filterTutores()">
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearTutoresFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de tutores -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Lista de Tutores</h6>
            </div>
            <div class="card-body">
                <div id="tutoresTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="tutoresPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar tutor -->
        <div class="modal fade" id="tutorModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tutorModalTitle">
                            <i class="fas fa-users me-2"></i>
                            Nuevo Tutor
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="tutorForm">
                            <input type="hidden" id="tutorId">
                            
                            <!-- Información personal -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary">Información Personal</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombresTutor" class="form-label">Nombres *</label>
                                        <input type="text" class="form-control" id="nombresTutor" name="nombres" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="apellidosTutor" class="form-label">Apellidos *</label>
                                        <input type="text" class="form-control" id="apellidosTutor" name="apellidos" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="cedulaTutor" class="form-label">Cédula *</label>
                                        <input type="text" class="form-control" id="cedulaTutor" name="cedula" 
                                               placeholder="000-0000000-0" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaNacimientoTutor" class="form-label">Fecha de Nacimiento</label>
                                        <input type="date" class="form-control" id="fechaNacimientoTutor" name="fechaNacimiento">
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="generoTutor" class="form-label">Género</label>
                                        <select class="form-select" id="generoTutor" name="genero">
                                            <option value="">Seleccionar género</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estadoCivilTutor" class="form-label">Estado Civil</label>
                                        <select class="form-select" id="estadoCivilTutor" name="estadoCivil">
                                            <option value="">Seleccionar</option>
                                            <option value="Soltero/a">Soltero/a</option>
                                            <option value="Casado/a">Casado/a</option>
                                            <option value="Divorciado/a">Divorciado/a</option>
                                            <option value="Viudo/a">Viudo/a</option>
                                            <option value="Unión Libre">Unión Libre</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nacionalidadTutor" class="form-label">Nacionalidad</label>
                                        <input type="text" class="form-control" id="nacionalidadTutor" name="nacionalidad" 
                                               value="Dominicana">
                                    </div>
                                </div>
                            </div>

                            <!-- Información de contacto -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-success">Información de Contacto</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoTutor" class="form-label">Teléfono Principal *</label>
                                        <input type="tel" class="form-control" id="telefonoTutor" name="telefono" 
                                               placeholder="809-000-0000" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoSecundarioTutor" class="form-label">Teléfono Secundario</label>
                                        <input type="tel" class="form-control" id="telefonoSecundarioTutor" name="telefonoSecundario" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="emailTutor" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="emailTutor" name="email">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="whatsappTutor" class="form-label">WhatsApp</label>
                                        <input type="tel" class="form-control" id="whatsappTutor" name="whatsapp" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="direccionTutor" class="form-label">Dirección *</label>
                                <textarea class="form-control" id="direccionTutor" name="direccion" rows="2" required></textarea>
                            </div>

                            <!-- Información laboral -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-info">Información Laboral</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="ocupacionTutor" class="form-label">Ocupación</label>
                                        <select class="form-select" id="ocupacionTutor" name="ocupacion">
                                            <option value="">Seleccionar ocupación</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="lugarTrabajoTutor" class="form-label">Lugar de Trabajo</label>
                                        <input type="text" class="form-control" id="lugarTrabajoTutor" name="lugarTrabajo">
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="ingresosMensualesTutor" class="form-label">Ingresos Mensuales</label>
                                        <input type="number" class="form-control" id="ingresosMensualesTutor" name="ingresosMensuales" 
                                               step="0.01" min="0" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoTrabajoTutor" class="form-label">Teléfono del Trabajo</label>
                                        <input type="tel" class="form-control" id="telefonoTrabajoTutor" name="telefonoTrabajo" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                            </div>

                            <!-- Relación familiar -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-warning">Relación Familiar</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="parentescoTutor" class="form-label">Parentesco *</label>
                                        <select class="form-select" id="parentescoTutor" name="parentesco" required>
                                            <option value="">Seleccionar parentesco</option>
                                            <option value="Padre">Padre</option>
                                            <option value="Madre">Madre</option>
                                            <option value="Abuelo">Abuelo</option>
                                            <option value="Abuela">Abuela</option>
                                            <option value="Tío">Tío</option>
                                            <option value="Tía">Tía</option>
                                            <option value="Hermano">Hermano</option>
                                            <option value="Hermana">Hermana</option>
                                            <option value="Tutor Legal">Tutor Legal</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estadoTutor" class="form-label">Estado *</label>
                                        <select class="form-select" id="estadoTutor" name="estado" required>
                                            <option value="">Seleccionar estado</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de emergencia -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-danger">Contacto de Emergencia</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="contactoEmergenciaNombre" class="form-label">Nombre Contacto de Emergencia</label>
                                        <input type="text" class="form-control" id="contactoEmergenciaNombre" name="contactoEmergenciaNombre">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="contactoEmergenciaTelefono" class="form-label">Teléfono Contacto de Emergencia</label>
                                        <input type="tel" class="form-control" id="contactoEmergenciaTelefono" name="contactoEmergenciaTelefono" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="mb-3">
                                <label for="observacionesTutor" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observacionesTutor" name="observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveTutor()">
                            <i class="fas fa-save me-1"></i> Guardar Tutor
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para ver detalles del tutor -->
        <div class="modal fade" id="tutorDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-users me-2"></i>
                            Detalles del Tutor
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="tutorDetailsContent">
                        <!-- El contenido se cargará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="printTutorDetails()">
                            <i class="fas fa-print me-1"></i> Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadTutoresData();
    loadOcupacionesForTutores();
    updateTutoresStats();
}

// Función para cargar datos de tutores
function loadTutoresData() {
    tutoresData = db.getAll('tutores') || [];
    displayTutores();
}

// Función para cargar ocupaciones para tutores
function loadOcupacionesForTutores() {
    const ocupaciones = db.getAll('ocupaciones') || [];
    const select = document.getElementById('ocupacionTutor');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar ocupación</option>';
        ocupaciones.forEach(ocupacion => {
            select.innerHTML += `<option value="${ocupacion.id}">${ocupacion.nombre}</option>`;
        });
    }
}

// Función para mostrar tutores
function displayTutores() {
    const container = document.getElementById('tutoresTableContainer');
    if (!container) return;

    if (tutoresData.length === 0) {
        showEmptyState(container, 'No hay tutores registrados', 'fas fa-users');
        document.getElementById('tutoresPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyTutoresFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentTutoresPage, tutoresPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Tutor</th>
                        <th>Cédula</th>
                        <th>Parentesco</th>
                        <th>Contacto</th>
                        <th>Ocupación</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    const ocupaciones = db.getAll('ocupaciones') || [];
    
    paginatedData.data.forEach(tutor => {
        const edad = tutor.fechaNacimiento ? calculateAge(tutor.fechaNacimiento) : 'N/A';
        const estadoBadge = getTutorEstadoBadge(tutor.estado);
        const ocupacion = ocupaciones.find(o => o.id == tutor.ocupacion);
        const ocupacionNombre = ocupacion ? ocupacion.nombre : 'No especificada';
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">
                            ${getInitials(tutor.nombres, tutor.apellidos)}
                        </div>
                        <div>
                            <div class="fw-bold">${tutor.nombres} ${tutor.apellidos}</div>
                            <small class="text-muted">${edad} años • ${tutor.genero || 'N/A'}</small>
                        </div>
                    </div>
                </td>
                <td>${tutor.cedula}</td>
                <td>
                    <span class="badge ${getParentescoBadgeClass(tutor.parentesco)}">${tutor.parentesco}</span>
                </td>
                <td>
                    <div>
                        <i class="fas fa-phone text-muted me-1"></i>${tutor.telefono}
                    </div>
                    ${tutor.email ? `<div><i class="fas fa-envelope text-muted me-1"></i>${tutor.email}</div>` : ''}
                    ${tutor.whatsapp ? `<div><i class="fab fa-whatsapp text-success me-1"></i>${tutor.whatsapp}</div>` : ''}
                </td>
                <td>
                    <small class="text-muted">${ocupacionNombre}</small>
                    ${tutor.lugarTrabajo ? `<br><small class="text-muted">${tutor.lugarTrabajo}</small>` : ''}
                </td>
                <td>${estadoBadge}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editTutor('${tutor.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewTutor('${tutor.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteTutor('${tutor.id}')" title="Eliminar">
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
    document.getElementById('tutoresPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentTutoresPage, 'goToTutoresPage');
}

// Función para obtener clase de badge por parentesco
function getParentescoBadgeClass(parentesco) {
    const classes = {
        'Padre': 'bg-primary',
        'Madre': 'bg-info',
        'Abuelo': 'bg-secondary',
        'Abuela': 'bg-secondary',
        'Tío': 'bg-warning',
        'Tía': 'bg-warning',
        'Tutor Legal': 'bg-danger',
        'Otro': 'bg-dark'
    };
    return classes[parentesco] || 'bg-secondary';
}

// Función para obtener badge del estado del tutor
function getTutorEstadoBadge(estado) {
    const badges = {
        'Activo': '<span class="badge bg-success">Activo</span>',
        'Inactivo': '<span class="badge bg-secondary">Inactivo</span>'
    };
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

// Función para aplicar filtros
function applyTutoresFilters() {
    let filtered = [...tutoresData];
    
    const searchTerm = document.getElementById('searchTutores')?.value?.toLowerCase() || '';
    const parentescoFilter = document.getElementById('filterParentesco')?.value || '';
    const estadoFilter = document.getElementById('filterEstadoTutor')?.value || '';
    
    if (searchTerm) {
        filtered = filtered.filter(tutor => {
            const nombreCompleto = `${tutor.nombres} ${tutor.apellidos}`.toLowerCase();
            return nombreCompleto.includes(searchTerm) || 
                   tutor.cedula.includes(searchTerm) ||
                   (tutor.telefono && tutor.telefono.includes(searchTerm)) ||
                   (tutor.email && tutor.email.toLowerCase().includes(searchTerm));
        });
    }
    
    if (parentescoFilter) {
        filtered = filtered.filter(t => t.parentesco === parentescoFilter);
    }
    
    if (estadoFilter) {
        filtered = filtered.filter(t => t.estado === estadoFilter);
    }
    
    return filtered;
}

// Función para limpiar filtros
function clearTutoresFilters() {
    document.getElementById('searchTutores').value = '';
    document.getElementById('filterParentesco').value = '';
    document.getElementById('filterEstadoTutor').value = '';
    filterTutores();
}

// Función para filtrar tutores
function filterTutores() {
    currentTutoresPage = 1;
    displayTutores();
}

// Función para cambiar página
function goToTutoresPage(page) {
    currentTutoresPage = page;
    displayTutores();
}

// Función para mostrar modal de nuevo tutor
function showAddTutorModal() {
    const modal = new bootstrap.Modal(document.getElementById('tutorModal'));
    document.getElementById('tutorModalTitle').innerHTML = '<i class="fas fa-users me-2"></i>Nuevo Tutor';
    document.getElementById('tutorId').value = '';
    clearForm(document.getElementById('tutorForm'));
    
    // Establecer valores por defecto
    document.getElementById('estadoTutor').value = 'Activo';
    document.getElementById('nacionalidadTutor').value = 'Dominicana';
    
    // Cargar ocupaciones
    loadOcupacionesForTutores();
    
    modal.show();
}

// Función para editar tutor
function editTutor(id) {
    const tutor = tutoresData.find(t => t.id === parseInt(id));
    if (!tutor) {
        showAlert.error('Error', 'Tutor no encontrado');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('tutorModal'));
    document.getElementById('tutorModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Tutor';
    document.getElementById('tutorId').value = tutor.id;
    
    // Cargar ocupaciones
    loadOcupacionesForTutores();
    
    // Llenar formulario con datos existentes
    setTimeout(() => {
        document.getElementById('nombresTutor').value = tutor.nombres || '';
        document.getElementById('apellidosTutor').value = tutor.apellidos || '';
        document.getElementById('cedulaTutor').value = tutor.cedula || '';
        document.getElementById('fechaNacimientoTutor').value = tutor.fechaNacimiento || '';
        document.getElementById('generoTutor').value = tutor.genero || '';
        document.getElementById('estadoCivilTutor').value = tutor.estadoCivil || '';
        document.getElementById('nacionalidadTutor').value = tutor.nacionalidad || '';
        document.getElementById('telefonoTutor').value = tutor.telefono || '';
        document.getElementById('telefonoSecundarioTutor').value = tutor.telefonoSecundario || '';
        document.getElementById('emailTutor').value = tutor.email || '';
        document.getElementById('whatsappTutor').value = tutor.whatsapp || '';
        document.getElementById('direccionTutor').value = tutor.direccion || '';
        document.getElementById('ocupacionTutor').value = tutor.ocupacion || '';
        document.getElementById('lugarTrabajoTutor').value = tutor.lugarTrabajo || '';
        document.getElementById('ingresosMensualesTutor').value = tutor.ingresosMensuales || '';
        document.getElementById('telefonoTrabajoTutor').value = tutor.telefonoTrabajo || '';
        document.getElementById('parentescoTutor').value = tutor.parentesco || '';
        document.getElementById('estadoTutor').value = tutor.estado || '';
        document.getElementById('contactoEmergenciaNombre').value = tutor.contactoEmergenciaNombre || '';
        document.getElementById('contactoEmergenciaTelefono').value = tutor.contactoEmergenciaTelefono || '';
        document.getElementById('observacionesTutor').value = tutor.observaciones || '';
    }, 100);
    
    modal.show();
}

// Función para guardar tutor
function saveTutor() {
    const form = document.getElementById('tutorForm');
    
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const tutorData = {};
    
    // Convertir FormData a objeto
    for (let [key, value] of formData.entries()) {
        tutorData[key] = value;
    }
    
    try {
        const tutorId = document.getElementById('tutorId').value;
        
        if (tutorId) {
            // Actualizar tutor existente
            const updatedTutor = db.update('tutores', tutorId, tutorData);
            const index = tutoresData.findIndex(t => t.id === parseInt(tutorId));
            if (index !== -1) {
                tutoresData[index] = updatedTutor;
            }
            showAlert.success('¡Éxito!', 'Tutor actualizado correctamente');
        } else {
            // Verificar si la cédula ya existe
            const existingTutor = tutoresData.find(t => t.cedula === tutorData.cedula);
            if (existingTutor) {
                showAlert.error('Error', 'Ya existe un tutor con esta cédula');
                return;
            }
            
            // Crear nuevo tutor
            const newTutor = db.insert('tutores', tutorData);
            tutoresData.push(newTutor);
            showAlert.success('¡Éxito!', 'Tutor registrado correctamente');
        }
        
        // Actualizar vista y cerrar modal
        displayTutores();
        updateTutoresStats();
        bootstrap.Modal.getInstance(document.getElementById('tutorModal')).hide();
        
    } catch (error) {
        console.error('Error al guardar tutor:', error);
        showAlert.error('Error', 'No se pudo guardar el tutor');
    }
}

// Función para eliminar tutor
function deleteTutor(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer. ¿Desea eliminar este tutor?'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('tutores', id);
                tutoresData = tutoresData.filter(t => t.id !== parseInt(id));
                displayTutores();
                updateTutoresStats();
                showAlert.success('¡Eliminado!', 'El tutor ha sido eliminado');
            } catch (error) {
                console.error('Error al eliminar tutor:', error);
                showAlert.error('Error', 'No se pudo eliminar el tutor');
            }
        }
    });
}

// Función para ver detalles del tutor
function viewTutor(id) {
    const tutor = tutoresData.find(t => t.id === parseInt(id));
    if (!tutor) {
        showAlert.error('Error', 'Tutor no encontrado');
        return;
    }
    
    const edad = tutor.fechaNacimiento ? calculateAge(tutor.fechaNacimiento) : 'No especificada';
    const ocupaciones = db.getAll('ocupaciones') || [];
    const ocupacion = ocupaciones.find(o => o.id == tutor.ocupacion);
    
    const content = `
        <div class="container-fluid">
            <!-- Información personal -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-primary text-white p-2 rounded">INFORMACIÓN PERSONAL</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Nombres:</strong> ${tutor.nombres}</p>
                    <p><strong>Apellidos:</strong> ${tutor.apellidos}</p>
                    <p><strong>Cédula:</strong> ${tutor.cedula}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${formatDate(tutor.fechaNacimiento) || 'No especificada'}</p>
                    <p><strong>Edad:</strong> ${edad} años</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Género:</strong> ${tutor.genero || 'No especificado'}</p>
                    <p><strong>Estado Civil:</strong> ${tutor.estadoCivil || 'No especificado'}</p>
                    <p><strong>Nacionalidad:</strong> ${tutor.nacionalidad || 'No especificada'}</p>
                    <p><strong>Parentesco:</strong> <span class="badge ${getParentescoBadgeClass(tutor.parentesco)}">${tutor.parentesco}</span></p>
                    <p><strong>Estado:</strong> ${getTutorEstadoBadge(tutor.estado)}</p>
                </div>
                <div class="col-12">
                    <p><strong>Dirección:</strong> ${tutor.direccion}</p>
                </div>
            </div>
            
            <!-- Información de contacto -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-success text-white p-2 rounded">INFORMACIÓN DE CONTACTO</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Teléfono Principal:</strong> ${tutor.telefono}</p>
                    <p><strong>Teléfono Secundario:</strong> ${tutor.telefonoSecundario || 'No especificado'}</p>
                    <p><strong>Email:</strong> ${tutor.email || 'No especificado'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>WhatsApp:</strong> ${tutor.whatsapp || 'No especificado'}</p>
                    <p><strong>Teléfono del Trabajo:</strong> ${tutor.telefonoTrabajo || 'No especificado'}</p>
                </div>
            </div>
            
            <!-- Información laboral -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-info text-white p-2 rounded">INFORMACIÓN LABORAL</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Ocupación:</strong> ${ocupacion ? ocupacion.nombre : 'No especificada'}</p>
                    <p><strong>Lugar de Trabajo:</strong> ${tutor.lugarTrabajo || 'No especificado'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Ingresos Mensuales:</strong> ${tutor.ingresosMensuales ? formatCurrency(tutor.ingresosMensuales) : 'No especificado'}</p>
                </div>
            </div>
            
            <!-- Contacto de emergencia -->
            ${tutor.contactoEmergenciaNombre ? `
                <div class="row mb-4">
                    <div class="col-12">
                        <h5 class="bg-danger text-white p-2 rounded">CONTACTO DE EMERGENCIA</h5>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Nombre:</strong> ${tutor.contactoEmergenciaNombre}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Teléfono:</strong> ${tutor.contactoEmergenciaTelefono || 'No especificado'}</p>
                    </div>
                </div>
            ` : ''}
            
            <!-- Observaciones -->
            ${tutor.observaciones ? `
                <div class="row mb-4">
                    <div class="col-12">
                        <h5 class="bg-warning text-dark p-2 rounded">OBSERVACIONES</h5>
                        <p>${tutor.observaciones}</p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('tutorDetailsContent').innerHTML = content;
    const modal = new bootstrap.Modal(document.getElementById('tutorDetailsModal'));
    modal.show();
}

// Función para imprimir detalles del tutor
function printTutorDetails() {
    window.print();
}

// Función para actualizar estadísticas
function updateTutoresStats() {
    const stats = {
        total: tutoresData.length,
        activos: tutoresData.filter(t => t.estado === 'Activo').length,
        padres: tutoresData.filter(t => t.parentesco === 'Padre').length,
        madres: tutoresData.filter(t => t.parentesco === 'Madre').length
    };
    
    document.getElementById('total-tutores').textContent = stats.total;
    document.getElementById('tutores-activos').textContent = stats.activos;
    document.getElementById('total-padres').textContent = stats.padres;
    document.getElementById('total-madres').textContent = stats.madres;
}

// Función para exportar tutores
function exportTutores() {
    if (tutoresData.length === 0) {
        showAlert.warning('Sin datos', 'No hay tutores para exportar');
        return;
    }
    
    const ocupaciones = db.getAll('ocupaciones') || [];
    
    const dataToExport = tutoresData.map(tutor => {
        const ocupacion = ocupaciones.find(o => o.id == tutor.ocupacion);
        return {
            'Nombres': tutor.nombres,
            'Apellidos': tutor.apellidos,
            'Cédula': tutor.cedula,
            'Fecha Nacimiento': formatDateShort(tutor.fechaNacimiento) || '',
            'Edad': tutor.fechaNacimiento ? calculateAge(tutor.fechaNacimiento) : '',
            'Género': tutor.genero || '',
            'Estado Civil': tutor.estadoCivil || '',
            'Nacionalidad': tutor.nacionalidad || '',
            'Parentesco': tutor.parentesco,
            'Estado': tutor.estado,
            'Teléfono Principal': tutor.telefono,
            'Teléfono Secundario': tutor.telefonoSecundario || '',
            'Email': tutor.email || '',
            'WhatsApp': tutor.whatsapp || '',
            'Dirección': tutor.direccion,
            'Ocupación': ocupacion ? ocupacion.nombre : '',
            'Lugar de Trabajo': tutor.lugarTrabajo || '',
            'Ingresos Mensuales': tutor.ingresosMensuales || '',
            'Teléfono Trabajo': tutor.telefonoTrabajo || '',
            'Contacto Emergencia': tutor.contactoEmergenciaNombre || '',
            'Teléfono Emergencia': tutor.contactoEmergenciaTelefono || '',
            'Observaciones': tutor.observaciones || ''
        };
    });
    
    exportToExcel('Lista de Tutores', dataToExport, 'tutores_' + new Date().toISOString().split('T')[0]);
}

// Función para refrescar datos
function refreshTutores() {
    loadTutoresData();
    updateTutoresStats();
    showAlert.success('Actualizado', 'Los datos han sido actualizados');
}