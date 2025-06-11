/**
 * Módulo de gestión de inscripciones
 * Sistema de matrículas avanzado basado en el código proporcionado
 */

let inscripcionesData = [];
let currentInscripcionesPage = 1;
const inscripcionesPerPage = 10;

// Función principal para cargar la sección de inscripciones
function loadInscripcionesSection() {
    const section = document.getElementById('inscripciones-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-file-signature me-2"></i>
                    Gestión de Inscripciones
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showAddInscripcionModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Inscripción
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportInscripciones()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshInscripciones()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Inscripciones Activas
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-inscripciones-activas">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clipboard-check fa-2x text-success"></i>
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
                                    Inscripciones Este Mes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="inscripciones-este-mes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-check fa-2x text-warning"></i>
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
                                    Pendientes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="inscripciones-pendientes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clock fa-2x text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Ingresos
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="ingresos-inscripciones">$0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-3">
                    <label for="searchInscripciones" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchInscripciones" 
                           placeholder="Código o estudiante..." 
                           oninput="filterInscripciones()">
                </div>
                <div class="col-md-2">
                    <label for="filterGradoInscripcion" class="form-label">Grado:</label>
                    <select class="form-select" id="filterGradoInscripcion" onchange="filterInscripciones()">
                        <option value="">Todos</option>
                        <option value="1">1ro</option>
                        <option value="2">2do</option>
                        <option value="3">3ro</option>
                        <option value="4">4to</option>
                        <option value="5">5to</option>
                        <option value="6">6to</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterEstadoInscripcion" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstadoInscripcion" onchange="filterInscripciones()">
                        <option value="">Todos</option>
                        <option value="activa">Activa</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="inactiva">Inactiva</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterAnoLectivoInscripcion" class="form-label">Año:</label>
                    <select class="form-select" id="filterAnoLectivoInscripcion" onchange="filterInscripciones()">
                        <option value="">Todos</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterModalidadInscripcion" class="form-label">Modalidad:</label>
                    <select class="form-select" id="filterModalidadInscripcion" onchange="filterInscripciones()">
                        <option value="">Todas</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Semi-presencial">Semi-presencial</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearInscripcionesFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de inscripciones -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Lista de Inscripciones</h6>
            </div>
            <div class="card-body">
                <div id="inscripcionesTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="inscripcionesPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar inscripción -->
        <div class="modal fade" id="inscripcionModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="inscripcionModalTitle">
                            <i class="fas fa-file-signature me-2"></i>
                            Nueva Inscripción
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="inscripcionForm">
                            <input type="hidden" id="inscripcionId">
                            
                            <!-- Selección de estudiante -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary">Selección de Estudiante</h6>
                                    <hr>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudianteInscripcion" class="form-label">Estudiante *</label>
                                        <select class="form-select" id="estudianteInscripcion" name="estudianteId" required>
                                            <option value="">Seleccionar estudiante</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="codigoInscripcion" class="form-label">Código de Inscripción</label>
                                        <input type="text" class="form-control" id="codigoInscripcion" name="codigo" readonly>
                                    </div>
                                </div>
                            </div>

                            <!-- Información académica -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-success">Información Académica</h6>
                                    <hr>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="gradoInscripcion" class="form-label">Grado *</label>
                                        <select class="form-select" id="gradoInscripcion" name="grado" required>
                                            <option value="">Seleccionar grado</option>
                                            <option value="1">Primer Grado</option>
                                            <option value="2">Segundo Grado</option>
                                            <option value="3">Tercer Grado</option>
                                            <option value="4">Cuarto Grado</option>
                                            <option value="5">Quinto Grado</option>
                                            <option value="6">Sexto Grado</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="anoLectivoInscripcion" class="form-label">Año Lectivo *</label>
                                        <select class="form-select" id="anoLectivoInscripcion" name="anoLectivo" required>
                                            <option value="">Seleccionar año</option>
                                            <option value="2024-2025">2024-2025</option>
                                            <option value="2025-2026">2025-2026</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="modalidadInscripcion" class="form-label">Modalidad *</label>
                                        <select class="form-select" id="modalidadInscripcion" name="modalidad" required>
                                            <option value="">Seleccionar modalidad</option>
                                            <option value="Presencial">Presencial</option>
                                            <option value="Semi-presencial">Semi-presencial</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de la inscripción -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-info">Información de la Inscripción</h6>
                                    <hr>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="fechaInscripcion" class="form-label">Fecha de Inscripción *</label>
                                        <input type="date" class="form-control" id="fechaInscripcion" name="fechaInscripcion" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estadoInscripcion" class="form-label">Estado *</label>
                                        <select class="form-select" id="estadoInscripcion" name="estado" required>
                                            <option value="">Seleccionar estado</option>
                                            <option value="activa">Activa</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="inactiva">Inactiva</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="montoInscripcion" class="form-label">Monto de Inscripción</label>
                                        <input type="number" class="form-control" id="montoInscripcion" name="monto" step="0.01" min="0">
                                    </div>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="observacionesInscripcion" class="form-label">Observaciones</label>
                                        <textarea class="form-control" id="observacionesInscripcion" name="observaciones" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info me-1" onclick="previewInscripcion()">
                            <i class="fas fa-eye me-1"></i> Vista Previa
                        </button>
                        <button type="button" class="btn btn-primary" onclick="saveInscripcion()">
                            <i class="fas fa-save me-1"></i> Guardar Inscripción
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para vista previa -->
        <div class="modal fade" id="previewInscripcionModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-eye me-2"></i>
                            Vista Previa de Inscripción
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="previewInscripcionContent">
                        <!-- El contenido de la vista previa se cargará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-success" onclick="printInscripcion()">
                            <i class="fas fa-print me-1"></i> Imprimir
                        </button>
                        <button type="button" class="btn btn-primary" onclick="exportInscripcionPDF()">
                            <i class="fas fa-file-pdf me-1"></i> Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadInscripcionesData();
    updateInscripcionesStats();
}

// Función para cargar datos de inscripciones
function loadInscripcionesData() {
    inscripcionesData = db.getAll('inscripciones') || [];
    displayInscripciones();
}

// Función para mostrar inscripciones
function displayInscripciones() {
    const container = document.getElementById('inscripcionesTableContainer');
    if (!container) return;

    if (inscripcionesData.length === 0) {
        showEmptyState(container, 'No hay inscripciones registradas', 'fas fa-file-signature');
        document.getElementById('inscripcionesPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyInscripcionesFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentInscripcionesPage, inscripcionesPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Año Lectivo</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Modalidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    const estudiantesData = db.getAll('estudiantes') || [];
    
    paginatedData.data.forEach(inscripcion => {
        const estudiante = estudiantesData.find(e => e.id === inscripcion.estudianteId);
        const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante no encontrado';
        
        const estadoBadge = getInscripcionEstadoBadge(inscripcion.estado);
        
        tableHTML += `
            <tr>
                <td><strong>${inscripcion.codigo}</strong></td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                            <i class="fas fa-user-graduate text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${nombreCompleto}</div>
                            <small class="text-muted">${estudiante ? estudiante.cedula || 'Sin cédula' : ''}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${getGradoText(inscripcion.grado)}</span>
                </td>
                <td>${inscripcion.anoLectivo}</td>
                <td>${estadoBadge}</td>
                <td>${formatDateShort(inscripcion.fechaInscripcion)}</td>
                <td>
                    <small class="text-muted">${inscripcion.modalidad}</small>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editInscripcion('${inscripcion.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewInscripcion('${inscripcion.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="printInscripcionCertificate('${inscripcion.id}')" title="Certificado">
                            <i class="fas fa-certificate"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteInscripcion('${inscripcion.id}')" title="Eliminar">
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
    document.getElementById('inscripcionesPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentInscripcionesPage, 'goToInscripcionesPage');
}

// Función para obtener badge del estado de inscripción
function getInscripcionEstadoBadge(estado) {
    const badges = {
        'activa': '<span class="badge bg-success">Activa</span>',
        'pendiente': '<span class="badge bg-warning">Pendiente</span>',
        'inactiva': '<span class="badge bg-secondary">Inactiva</span>'
    };
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

// Función para aplicar filtros
function applyInscripcionesFilters() {
    let filtered = [...inscripcionesData];
    
    const searchTerm = document.getElementById('searchInscripciones')?.value?.toLowerCase() || '';
    const gradoFilter = document.getElementById('filterGradoInscripcion')?.value || '';
    const estadoFilter = document.getElementById('filterEstadoInscripcion')?.value || '';
    const anoFilter = document.getElementById('filterAnoLectivoInscripcion')?.value || '';
    const modalidadFilter = document.getElementById('filterModalidadInscripcion')?.value || '';
    
    if (searchTerm) {
        const estudiantesData = db.getAll('estudiantes') || [];
        filtered = filtered.filter(inscripcion => {
            const estudiante = estudiantesData.find(e => e.id === inscripcion.estudianteId);
            if (estudiante) {
                const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase();
                return nombreCompleto.includes(searchTerm) || 
                       inscripcion.codigo.toLowerCase().includes(searchTerm) ||
                       (estudiante.cedula && estudiante.cedula.includes(searchTerm));
            }
            return inscripcion.codigo.toLowerCase().includes(searchTerm);
        });
    }
    
    if (gradoFilter) {
        filtered = filtered.filter(i => i.grado === gradoFilter);
    }
    
    if (estadoFilter) {
        filtered = filtered.filter(i => i.estado === estadoFilter);
    }
    
    if (anoFilter) {
        filtered = filtered.filter(i => i.anoLectivo === anoFilter);
    }
    
    if (modalidadFilter) {
        filtered = filtered.filter(i => i.modalidad === modalidadFilter);
    }
    
    return filtered;
}

// Función para limpiar filtros
function clearInscripcionesFilters() {
    document.getElementById('searchInscripciones').value = '';
    document.getElementById('filterGradoInscripcion').value = '';
    document.getElementById('filterEstadoInscripcion').value = '';
    document.getElementById('filterAnoLectivoInscripcion').value = '';
    document.getElementById('filterModalidadInscripcion').value = '';
    filterInscripciones();
}

// Función para filtrar inscripciones
function filterInscripciones() {
    currentInscripcionesPage = 1;
    displayInscripciones();
}

// Función para cambiar página
function goToInscripcionesPage(page) {
    currentInscripcionesPage = page;
    displayInscripciones();
}

// Función para mostrar modal de nueva inscripción
function showAddInscripcionModal() {
    const modal = new bootstrap.Modal(document.getElementById('inscripcionModal'));
    document.getElementById('inscripcionModalTitle').innerHTML = '<i class="fas fa-file-signature me-2"></i>Nueva Inscripción';
    document.getElementById('inscripcionId').value = '';
    clearForm(document.getElementById('inscripcionForm'));
    
    // Establecer fecha actual
    document.getElementById('fechaInscripcion').value = new Date().toISOString().split('T')[0];
    document.getElementById('anoLectivoInscripcion').value = getCurrentAcademicYear();
    document.getElementById('estadoInscripcion').value = 'activa';
    
    // Cargar estudiantes
    loadEstudiantesForInscripcion();
    
    modal.show();
}

// Función para cargar estudiantes para inscripción
function loadEstudiantesForInscripcion() {
    const estudiantesData = db.getAll('estudiantes') || [];
    const select = document.getElementById('estudianteInscripcion');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar estudiante</option>';
        estudiantesData.forEach(estudiante => {
            if (estudiante.estado === 'Activo') {
                select.innerHTML += `
                    <option value="${estudiante.id}">
                        ${estudiante.nombres} ${estudiante.apellidos} - ${estudiante.cedula || 'Sin cédula'}
                    </option>
                `;
            }
        });
    }
}

// Función para generar código de inscripción
function generateInscripcionCode(year, grade) {
    const inscripciones = db.getAll('inscripciones') || [];
    const existingCodes = inscripciones
        .filter(i => i.anoLectivo === year && i.grado === grade)
        .map(i => i.codigo);
    
    let counter = 1;
    let code;
    
    do {
        code = `INS-${year.replace('-', '')}-${grade}-${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingCodes.includes(code));
    
    return code;
}

// Función para guardar inscripción
function saveInscripcion() {
    const form = document.getElementById('inscripcionForm');
    
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const inscripcionData = {};
    
    // Convertir FormData a objeto
    for (let [key, value] of formData.entries()) {
        inscripcionData[key] = value;
    }
    
    // Generar código si no existe
    if (!inscripcionData.codigo) {
        inscripcionData.codigo = generateInscripcionCode(inscripcionData.anoLectivo, inscripcionData.grado);
    }
    
    try {
        const inscripcionId = document.getElementById('inscripcionId').value;
        
        if (inscripcionId) {
            // Actualizar inscripción existente
            const updatedInscripcion = db.update('inscripciones', inscripcionId, inscripcionData);
            const index = inscripcionesData.findIndex(i => i.id === parseInt(inscripcionId));
            if (index !== -1) {
                inscripcionesData[index] = updatedInscripcion;
            }
            showAlert.success('¡Éxito!', 'Inscripción actualizada correctamente');
        } else {
            // Verificar si el estudiante ya tiene una inscripción activa para el mismo año
            const existingInscripcion = inscripcionesData.find(i => 
                i.estudianteId === inscripcionData.estudianteId && 
                i.anoLectivo === inscripcionData.anoLectivo && 
                i.estado === 'activa'
            );
            
            if (existingInscripcion) {
                const estudiantesData = db.getAll('estudiantes') || [];
                const estudiante = estudiantesData.find(e => e.id === inscripcionData.estudianteId);
                const nombreEstudiante = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'El estudiante';
                showAlert.error('Error', `${nombreEstudiante} ya tiene una inscripción activa para el año ${inscripcionData.anoLectivo}`);
                return;
            }
            
            // Crear nueva inscripción
            const newInscripcion = db.insert('inscripciones', inscripcionData);
            inscripcionesData.push(newInscripcion);
            showAlert.success('¡Éxito!', 'Inscripción registrada correctamente');
        }
        
        // Actualizar vista y cerrar modal
        displayInscripciones();
        updateInscripcionesStats();
        bootstrap.Modal.getInstance(document.getElementById('inscripcionModal')).hide();
        
    } catch (error) {
        console.error('Error al guardar inscripción:', error);
        showAlert.error('Error', 'No se pudo guardar la inscripción');
    }
}

// Función para editar inscripción
function editInscripcion(id) {
    const inscripcion = inscripcionesData.find(i => i.id === parseInt(id));
    if (!inscripcion) {
        showAlert.error('Error', 'Inscripción no encontrada');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('inscripcionModal'));
    document.getElementById('inscripcionModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Inscripción';
    document.getElementById('inscripcionId').value = inscripcion.id;
    
    // Cargar estudiantes
    loadEstudiantesForInscripcion();
    
    // Llenar formulario con datos existentes
    setTimeout(() => {
        document.getElementById('estudianteInscripcion').value = inscripcion.estudianteId || '';
        document.getElementById('codigoInscripcion').value = inscripcion.codigo || '';
        document.getElementById('gradoInscripcion').value = inscripcion.grado || '';
        document.getElementById('anoLectivoInscripcion').value = inscripcion.anoLectivo || '';
        document.getElementById('modalidadInscripcion').value = inscripcion.modalidad || '';
        document.getElementById('fechaInscripcion').value = inscripcion.fechaInscripcion || '';
        document.getElementById('estadoInscripcion').value = inscripcion.estado || '';
        document.getElementById('montoInscripcion').value = inscripcion.monto || '';
        document.getElementById('observacionesInscripcion').value = inscripcion.observaciones || '';
    }, 100);
    
    modal.show();
}

// Función para eliminar inscripción
function deleteInscripcion(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer. ¿Desea eliminar esta inscripción?'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('inscripciones', id);
                inscripcionesData = inscripcionesData.filter(i => i.id !== parseInt(id));
                displayInscripciones();
                updateInscripcionesStats();
                showAlert.success('¡Eliminado!', 'La inscripción ha sido eliminada');
            } catch (error) {
                console.error('Error al eliminar inscripción:', error);
                showAlert.error('Error', 'No se pudo eliminar la inscripción');
            }
        }
    });
}

// Función para ver detalles de inscripción
function viewInscripcion(id) {
    const inscripcion = inscripcionesData.find(i => i.id === parseInt(id));
    if (!inscripcion) {
        showAlert.error('Error', 'Inscripción no encontrada');
        return;
    }
    
    // Generar vista previa y mostrar modal
    generateInscripcionPreviewContent(inscripcion);
    const previewModal = new bootstrap.Modal(document.getElementById('previewInscripcionModal'));
    previewModal.show();
}

// Función para generar vista previa de inscripción
function previewInscripcion() {
    const form = document.getElementById('inscripcionForm');
    const formData = new FormData(form);
    const inscripcionData = {};
    
    for (let [key, value] of formData.entries()) {
        inscripcionData[key] = value;
    }
    
    generateInscripcionPreviewContent(inscripcionData);
    const previewModal = new bootstrap.Modal(document.getElementById('previewInscripcionModal'));
    previewModal.show();
}

// Función para generar contenido de vista previa de inscripción
function generateInscripcionPreviewContent(inscripcion) {
    const estudiantesData = db.getAll('estudiantes') || [];
    const estudiante = estudiantesData.find(e => e.id == inscripcion.estudianteId);
    
    const content = `
        <div class="container-fluid">
            <!-- Encabezado del documento -->
            <div class="text-center mb-4">
                <h3 class="mb-1">ESCUELA JESÚS EL BUEN MAESTRO</h3>
                <p class="mb-1">CERTIFICADO DE INSCRIPCIÓN</p>
                <p class="text-muted mb-0">Código: ${inscripcion.codigo || 'Sin código'}</p>
                <hr>
            </div>
            
            <!-- Información del Estudiante -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-primary text-white p-2 rounded">INFORMACIÓN DEL ESTUDIANTE</h5>
                </div>
                ${estudiante ? `
                <div class="col-md-6">
                    <p><strong>Nombres:</strong> ${estudiante.nombres}</p>
                    <p><strong>Apellidos:</strong> ${estudiante.apellidos}</p>
                    <p><strong>Cédula:</strong> ${estudiante.cedula || 'No especificada'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${formatDate(estudiante.fechaNacimiento) || 'No especificada'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Género:</strong> ${estudiante.genero || 'No especificado'}</p>
                    <p><strong>Teléfono:</strong> ${estudiante.telefono || 'No especificado'}</p>
                    <p><strong>Email:</strong> ${estudiante.email || 'No especificado'}</p>
                    <p><strong>Estado:</strong> ${getEstadoBadge(estudiante.estado)}</p>
                </div>
                <div class="col-12">
                    <p><strong>Dirección:</strong> ${estudiante.direccion || 'No especificada'}</p>
                </div>
                ` : `
                <div class="col-12">
                    <p class="text-muted">Información del estudiante no disponible</p>
                </div>
                `}
            </div>
            
            <!-- Información de la Inscripción -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-success text-white p-2 rounded">DETALLES DE LA INSCRIPCIÓN</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Grado:</strong> ${getGradoText(inscripcion.grado) || 'No especificado'}</p>
                    <p><strong>Año Lectivo:</strong> ${inscripcion.anoLectivo || 'No especificado'}</p>
                    <p><strong>Modalidad:</strong> ${inscripcion.modalidad || 'No especificada'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Estado:</strong> ${getInscripcionEstadoBadge(inscripcion.estado)}</p>
                    <p><strong>Fecha de Inscripción:</strong> ${formatDate(inscripcion.fechaInscripcion) || 'No especificada'}</p>
                    <p><strong>Monto:</strong> ${formatCurrency(inscripcion.monto || 0)}</p>
                </div>
            </div>
            
            <!-- Observaciones -->
            ${inscripcion.observaciones ? `
                <div class="row mb-4">
                    <div class="col-12">
                        <h5 class="bg-warning text-dark p-2 rounded">OBSERVACIONES</h5>
                        <p>${inscripcion.observaciones}</p>
                    </div>
                </div>
            ` : ''}
            
            <!-- Firmas -->
            <div class="row mt-5">
                <div class="col-md-6 text-center">
                    <div style="border-top: 1px solid #000; margin-top: 60px; padding-top: 5px;">
                        <small>Firma del Director</small>
                    </div>
                </div>
                <div class="col-md-6 text-center">
                    <div style="border-top: 1px solid #000; margin-top: 60px; padding-top: 5px;">
                        <small>Sello de la Institución</small>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <small class="text-muted">
                    Documento generado el ${formatDate(new Date().toISOString(), true)}
                </small>
            </div>
        </div>
    `;
    
    document.getElementById('previewInscripcionContent').innerHTML = content;
}

// Función para imprimir inscripción
function printInscripcion() {
    window.print();
}

// Función para exportar inscripción a PDF
function exportInscripcionPDF() {
    const content = document.getElementById('previewInscripcionContent');
    
    try {
        if (typeof window.jsPDF === 'undefined') {
            showAlert.error('Error', 'La librería jsPDF no está disponible');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar el documento
        doc.setFontSize(16);
        doc.text('CERTIFICADO DE INSCRIPCIÓN', 20, 20);
        doc.setFontSize(12);
        doc.text('Escuela Jesús El Buen Maestro', 20, 30);
        
        // Obtener datos del formulario actual
        const form = document.getElementById('inscripcionForm');
        const formData = new FormData(form);
        
        let yPosition = 50;
        const lineHeight = 8;
        
        // Información de la inscripción
        doc.setFontSize(14);
        doc.text('INFORMACIÓN DE LA INSCRIPCIÓN', 20, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.text(`Código: ${formData.get('codigo') || 'Sin código'}`, 20, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Grado: ${getGradoText(formData.get('grado')) || ''}`, 20, yPosition);
        doc.text(`Año Lectivo: ${formData.get('anoLectivo') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Modalidad: ${formData.get('modalidad') || ''}`, 20, yPosition);
        doc.text(`Estado: ${formData.get('estado') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Fecha Inscripción: ${formData.get('fechaInscripcion') || ''}`, 20, yPosition);
        doc.text(`Monto: ${formatCurrency(formData.get('monto') || 0)}`, 110, yPosition);
        yPosition += lineHeight * 2;
        
        // Observaciones
        if (formData.get('observaciones')) {
            doc.setFontSize(14);
            doc.text('OBSERVACIONES', 20, yPosition);
            yPosition += lineHeight;
            
            doc.setFontSize(10);
            doc.text(formData.get('observaciones'), 20, yPosition);
        }
        
        const fileName = `inscripcion_${formData.get('codigo') || 'sin_codigo'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);
        
        showAlert.success('¡Exportado!', 'El archivo PDF se ha generado correctamente');
        
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showAlert.error('Error', 'No se pudo generar el archivo PDF');
    }
}

// Función para imprimir certificado de inscripción
function printInscripcionCertificate(id) {
    const inscripcion = inscripcionesData.find(i => i.id === parseInt(id));
    if (!inscripcion) {
        showAlert.error('Error', 'Inscripción no encontrada');
        return;
    }
    
    generateInscripcionPreviewContent(inscripcion);
    const previewModal = new bootstrap.Modal(document.getElementById('previewInscripcionModal'));
    previewModal.show();
    
    // Imprimir después de mostrar el modal
    setTimeout(() => {
        window.print();
    }, 500);
}

// Función para actualizar estadísticas
function updateInscripcionesStats() {
    const stats = {
        activas: inscripcionesData.filter(i => i.estado === 'activa').length,
        esteMes: inscripcionesData.filter(i => {
            const fecha = new Date(i.fechaInscripcion);
            const hoy = new Date();
            return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
        }).length,
        pendientes: inscripcionesData.filter(i => i.estado === 'pendiente').length,
        ingresos: inscripcionesData
            .filter(i => i.estado === 'activa')
            .reduce((total, i) => total + (parseFloat(i.monto) || 0), 0)
    };
    
    document.getElementById('total-inscripciones-activas').textContent = stats.activas;
    document.getElementById('inscripciones-este-mes').textContent = stats.esteMes;
    document.getElementById('inscripciones-pendientes').textContent = stats.pendientes;
    document.getElementById('ingresos-inscripciones').textContent = formatCurrency(stats.ingresos);
}

// Función para exportar todas las inscripciones
function exportInscripciones() {
    if (inscripcionesData.length === 0) {
        showAlert.warning('Sin datos', 'No hay inscripciones para exportar');
        return;
    }
    
    const estudiantesData = db.getAll('estudiantes') || [];
    
    const dataToExport = inscripcionesData.map(inscripcion => {
        const estudiante = estudiantesData.find(e => e.id === inscripcion.estudianteId);
        return {
            'Código': inscripcion.codigo || '',
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            'Cédula': estudiante ? (estudiante.cedula || '') : '',
            'Grado': getGradoText(inscripcion.grado),
            'Año Lectivo': inscripcion.anoLectivo,
            'Modalidad': inscripcion.modalidad,
            'Estado': inscripcion.estado,
            'Fecha Inscripción': formatDateShort(inscripcion.fechaInscripcion),
            'Monto': inscripcion.monto || 0,
            'Observaciones': inscripcion.observaciones || ''
        };
    });
    
    exportToExcel('Registro de Inscripciones', dataToExport, 'inscripciones_' + new Date().toISOString().split('T')[0]);
}

// Función para refrescar datos
function refreshInscripciones() {
    loadInscripcionesData();
    updateInscripcionesStats();
    showAlert.success('Actualizado', 'Los datos han sido actualizados');
}