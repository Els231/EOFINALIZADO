/**
 * Módulo de gestión de matrículas
 * Sistema completo de CRUD para matrículas con validaciones y seguimiento
 */

let currentMatriculasPage = 1;
const matriculasPerPage = 10;
let matriculasFilters = {};
let matriculasSearchQuery = '';

// Función principal para cargar la sección de matrículas
function loadMatriculasSection() {
    const section = document.getElementById('matriculas-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-clipboard-list me-2"></i>
                    Gestión de Matrículas
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showMatriculaModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Matrícula
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportMatriculas()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="generarReporteMatriculas()">
                            <i class="fas fa-chart-bar me-1"></i> Reporte
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="search-filters">
            <div class="row">
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-search"></i>
                        </span>
                        <input type="text" class="form-control" id="matriculas-search" 
                               placeholder="Buscar por código o estudiante..."
                               onkeyup="debounce(searchMatriculas, 300)()">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-grado" onchange="filterMatriculas()">
                        <option value="">Todos los grados</option>
                        <option value="1">1° Grado</option>
                        <option value="2">2° Grado</option>
                        <option value="3">3° Grado</option>
                        <option value="4">4° Grado</option>
                        <option value="5">5° Grado</option>
                        <option value="6">6° Grado</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-turno" onchange="filterMatriculas()">
                        <option value="">Todos los turnos</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-estado" onchange="filterMatriculas()">
                        <option value="">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>
                        <option value="Completada">Completada</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-ano" onchange="filterMatriculas()">
                        <option value="">Todos los años</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearMatriculasFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="total-matriculas">0</div>
                                <div class="small">Total Matrículas</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clipboard-list fa-2x"></i>
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
                                <div class="h4 mb-0" id="matriculas-aprobadas">0</div>
                                <div class="small">Aprobadas</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-check-circle fa-2x"></i>
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
                                <div class="h4 mb-0" id="matriculas-pendientes">0</div>
                                <div class="small">Pendientes</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="matriculas-ano-actual">0</div>
                                <div class="small">Año Actual</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-calendar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de matrículas -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">
                    Lista de Matrículas
                    <span class="badge bg-primary ms-2" id="matriculas-count">0</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Estudiante</th>
                                <th>Grado</th>
                                <th>Turno</th>
                                <th>Año Escolar</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="matriculas-tbody">
                            <!-- Datos se cargan aquí -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de matrículas">
                    <ul class="pagination justify-content-center" id="matriculas-pagination">
                        <!-- Paginación se genera aquí -->
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal de matrícula -->
        <div class="modal fade" id="matriculaModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="matriculaModalTitle">
                            <i class="fas fa-clipboard-list me-2"></i>
                            Nueva Matrícula
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="matriculaForm">
                            <input type="hidden" id="matricula-id">
                            
                            <!-- Información básica -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="matricula-codigo" class="form-label">Código de Matrícula</label>
                                        <input type="text" class="form-control" id="matricula-codigo" readonly>
                                        <div class="form-text">Se genera automáticamente</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="matricula-fecha" class="form-label">Fecha de Matrícula *</label>
                                        <input type="date" class="form-control" id="matricula-fecha" required>
                                    </div>
                                </div>
                            </div>

                            <!-- Estudiante -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="matricula-estudiante" class="form-label">Estudiante *</label>
                                        <select class="form-select" id="matricula-estudiante" required onchange="loadEstudianteInfo()">
                                            <option value="">Seleccionar estudiante...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información del estudiante seleccionado -->
                            <div id="estudiante-info" class="alert alert-info" style="display: none;">
                                <!-- Información se carga dinámicamente -->
                            </div>

                            <!-- Información académica -->
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="matricula-grado" class="form-label">Grado *</label>
                                        <select class="form-select" id="matricula-grado" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="1">1° Grado</option>
                                            <option value="2">2° Grado</option>
                                            <option value="3">3° Grado</option>
                                            <option value="4">4° Grado</option>
                                            <option value="5">5° Grado</option>
                                            <option value="6">6° Grado</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="matricula-turno" class="form-label">Turno *</label>
                                        <select class="form-select" id="matricula-turno" required>
                                            <!-- Se llena dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="matricula-ano" class="form-label">Año Escolar *</label>
                                        <select class="form-select" id="matricula-ano" required>
                                            <!-- Se llena dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Estado -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="matricula-estado" class="form-label">Estado</label>
                                        <select class="form-select" id="matricula-estado">
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Aprobada">Aprobada</option>
                                            <option value="Rechazada">Rechazada</option>
                                            <option value="Completada">Completada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="mb-3">
                                <label for="matricula-observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="matricula-observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveMatricula()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    loadMatriculasData();
    loadTurnos();
    loadAnosEscolares();
    loadEstudiantes();
    updateMatriculasStats();
}

// Función para cargar datos de matrículas
function loadMatriculasData() {
    try {
        const allMatriculas = db.read('matriculas');
        let filteredMatriculas = allMatriculas;

        // Aplicar búsqueda
        if (matriculasSearchQuery) {
            filteredMatriculas = filterByMultipleFields(
                filteredMatriculas, 
                matriculasSearchQuery, 
                ['codigo', 'estudiante_nombre']
            );
        }

        // Aplicar filtros
        filteredMatriculas = applyFilters(filteredMatriculas, matriculasFilters);

        // Actualizar contador
        document.getElementById('matriculas-count').textContent = filteredMatriculas.length;

        // Paginar resultados
        const paginatedData = paginate(filteredMatriculas, currentMatriculasPage, matriculasPerPage);
        
        // Renderizar tabla
        renderMatriculasTable(paginatedData.data);
        
        // Renderizar paginación
        renderMatriculasPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando matrículas:', error);
        showGlobalAlert('Error al cargar datos de matrículas', 'error');
    }
}

// Función para renderizar tabla de matrículas
function renderMatriculasTable(matriculas) {
    const tbody = document.getElementById('matriculas-tbody');
    
    if (matriculas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                        <h5>No hay matrículas registradas</h5>
                        <p class="text-muted">Comience agregando una nueva matrícula</p>
                        <button type="button" class="btn btn-primary" onclick="showMatriculaModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Matrícula
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const estudiantes = db.read('estudiantes');
    const turnos = db.read('turnos');
    
    tbody.innerHTML = matriculas.map(matricula => {
        const estudiante = estudiantes.find(e => e.id === matricula.estudiante_id);
        const turno = turnos.find(t => t.id === matricula.turno_id);
        
        return `
            <tr>
                <td>
                    <span class="badge bg-secondary">${matricula.codigo}</span>
                </td>
                <td>
                    ${estudiante ? 
                        `<div class="fw-bold">${estudiante.nombre} ${estudiante.apellido}</div>
                         <small class="text-muted">${estudiante.cedula || 'Sin cédula'}</small>` : 
                        '<span class="text-danger">Estudiante no encontrado</span>'
                    }
                </td>
                <td>
                    <span class="badge" style="background-color: ${getGradeColor(matricula.grado)}">
                        ${matricula.grado}° Grado
                    </span>
                </td>
                <td>${turno ? turno.nombre : 'No asignado'}</td>
                <td>
                    <span class="badge bg-info">${matricula.ano_escolar}</span>
                </td>
                <td>${formatDateShort(matricula.fecha_matricula)}</td>
                <td>${getStatusBadge(matricula.estado)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editMatricula('${matricula.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewMatricula('${matricula.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-success" 
                                onclick="imprimirMatricula('${matricula.id}')" title="Imprimir">
                            <i class="fas fa-print"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteMatricula('${matricula.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para renderizar paginación
function renderMatriculasPagination(paginatedData) {
    const pagination = document.getElementById('matriculas-pagination');
    
    if (paginatedData.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // Botón anterior
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasPrev ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeMatriculasPage(${currentMatriculasPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= paginatedData.totalPages; i++) {
        if (i === currentMatriculasPage || 
            i === 1 || 
            i === paginatedData.totalPages || 
            (i >= currentMatriculasPage - 1 && i <= currentMatriculasPage + 1)) {
            
            paginationHtml += `
                <li class="page-item ${i === currentMatriculasPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeMatriculasPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentMatriculasPage - 2 || i === currentMatriculasPage + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botón siguiente
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasNext ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeMatriculasPage(${currentMatriculasPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHtml;
}

// Función para cargar estudiantes
function loadEstudiantes() {
    const estudiantes = db.read('estudiantes').filter(e => e.estado === 'Activo');
    const estudianteSelect = document.getElementById('matricula-estudiante');
    
    if (estudianteSelect) {
        estudianteSelect.innerHTML = '<option value="">Seleccionar estudiante...</option>';
        
        estudiantes.forEach(estudiante => {
            const option = document.createElement('option');
            option.value = estudiante.id;
            option.textContent = `${estudiante.nombre} ${estudiante.apellido} - ${estudiante.cedula || 'Sin cédula'}`;
            estudianteSelect.appendChild(option);
        });
    }
}

// Función para cargar información del estudiante seleccionado
function loadEstudianteInfo() {
    const estudianteId = document.getElementById('matricula-estudiante').value;
    const infoContainer = document.getElementById('estudiante-info');
    
    if (!estudianteId) {
        infoContainer.style.display = 'none';
        return;
    }
    
    const estudiante = db.find('estudiantes', estudianteId);
    if (!estudiante) {
        infoContainer.style.display = 'none';
        return;
    }
    
    const tutores = db.read('tutores');
    const tutor = tutores.find(t => t.id === estudiante.tutor_id);
    const edad = calculateAge(estudiante.fecha_nacimiento);
    
    infoContainer.innerHTML = `
        <h6><i class="fas fa-info-circle me-2"></i>Información del Estudiante</h6>
        <div class="row">
            <div class="col-md-6">
                <strong>Nombre:</strong> ${estudiante.nombre} ${estudiante.apellido}<br>
                <strong>Edad:</strong> ${edad} años<br>
                <strong>Género:</strong> ${estudiante.genero || 'No especificado'}
            </div>
            <div class="col-md-6">
                <strong>Tutor:</strong> ${tutor ? `${tutor.nombre} ${tutor.apellido}` : 'Sin tutor'}<br>
                <strong>Teléfono:</strong> ${estudiante.telefono || 'No registrado'}<br>
                <strong>Email:</strong> ${estudiante.email || 'No registrado'}
            </div>
        </div>
    `;
    
    infoContainer.style.display = 'block';
    
    // Auto-llenar grado si está disponible
    if (estudiante.grado) {
        document.getElementById('matricula-grado').value = estudiante.grado;
    }
    
    // Auto-llenar turno si está disponible
    if (estudiante.turno_id) {
        document.getElementById('matricula-turno').value = estudiante.turno_id;
    }
}

// Función para cargar años escolares
function loadAnosEscolares() {
    const currentYear = new Date().getFullYear();
    const selectElements = [
        document.getElementById('matricula-ano'),
        document.getElementById('filter-ano')
    ];
    
    selectElements.forEach(select => {
        if (select) {
            const isFilter = select.id === 'filter-ano';
            if (!isFilter) {
                select.innerHTML = '<option value="">Seleccionar año...</option>';
            }
            
            // Generar años desde el año anterior hasta 2 años en el futuro
            for (let year = currentYear - 1; year <= currentYear + 2; year++) {
                const option = document.createElement('option');
                option.value = `${year}-${year + 1}`;
                option.textContent = `${year}-${year + 1}`;
                if (year === currentYear) {
                    option.selected = !isFilter;
                }
                select.appendChild(option);
            }
        }
    });
}

// Función para actualizar estadísticas de matrículas
function updateMatriculasStats() {
    try {
        const matriculas = db.read('matriculas');
        const currentYear = new Date().getFullYear();
        const currentAcademicYear = `${currentYear}-${currentYear + 1}`;
        
        // Total matrículas
        document.getElementById('total-matriculas').textContent = matriculas.length;
        
        // Matrículas aprobadas
        const aprobadas = matriculas.filter(m => m.estado === 'Aprobada' || m.estado === 'Completada');
        document.getElementById('matriculas-aprobadas').textContent = aprobadas.length;
        
        // Matrículas pendientes
        const pendientes = matriculas.filter(m => m.estado === 'Pendiente');
        document.getElementById('matriculas-pendientes').textContent = pendientes.length;
        
        // Matrículas del año actual
        const anoActual = matriculas.filter(m => m.ano_escolar === currentAcademicYear);
        document.getElementById('matriculas-ano-actual').textContent = anoActual.length;
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

// Función para generar código de matrícula
function generateMatriculaCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = db.read('matriculas').length + 1;
    return `MAT${year}${sequence.toString().padStart(4, '0')}`;
}

// Función para mostrar modal de matrícula
function showMatriculaModal(matriculaId = null) {
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    const title = document.getElementById('matriculaModalTitle');
    const form = document.getElementById('matriculaForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('matricula-id').value = '';
    document.getElementById('estudiante-info').style.display = 'none';
    
    if (matriculaId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-clipboard-list me-2"></i>Editar Matrícula';
        const matricula = db.find('matriculas', matriculaId);
        
        if (matricula) {
            document.getElementById('matricula-id').value = matricula.id;
            document.getElementById('matricula-codigo').value = matricula.codigo;
            document.getElementById('matricula-fecha').value = matricula.fecha_matricula;
            document.getElementById('matricula-estudiante').value = matricula.estudiante_id;
            document.getElementById('matricula-grado').value = matricula.grado;
            document.getElementById('matricula-turno').value = matricula.turno_id;
            document.getElementById('matricula-ano').value = matricula.ano_escolar;
            document.getElementById('matricula-estado').value = matricula.estado;
            document.getElementById('matricula-observaciones').value = matricula.observaciones || '';
            
            // Cargar información del estudiante
            loadEstudianteInfo();
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-clipboard-list me-2"></i>Nueva Matrícula';
        document.getElementById('matricula-codigo').value = generateMatriculaCode();
        document.getElementById('matricula-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('matricula-estado').value = 'Pendiente';
    }
    
    modal.show();
}

// Función para guardar matrícula
function saveMatricula() {
    try {
        const form = document.getElementById('matriculaForm');
        
        const matriculaData = {
            codigo: document.getElementById('matricula-codigo').value.trim(),
            estudiante_id: document.getElementById('matricula-estudiante').value,
            grado: document.getElementById('matricula-grado').value,
            turno_id: document.getElementById('matricula-turno').value,
            ano_escolar: document.getElementById('matricula-ano').value,
            fecha_matricula: document.getElementById('matricula-fecha').value,
            estado: document.getElementById('matricula-estado').value,
            observaciones: document.getElementById('matricula-observaciones').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            codigo: { required: true, label: 'Código' },
            estudiante_id: { required: true, label: 'Estudiante' },
            grado: { required: true, label: 'Grado' },
            turno_id: { required: true, label: 'Turno' },
            ano_escolar: { required: true, label: 'Año escolar' },
            fecha_matricula: { required: true, type: 'date', label: 'Fecha de matrícula' }
        };
        
        const errors = validateFormData(matriculaData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Verificar que el estudiante no tenga una matrícula activa para el mismo año
        const matriculaId = document.getElementById('matricula-id').value;
        const matriculasExistentes = db.read('matriculas');
        const matriculaConflicto = matriculasExistentes.find(m => 
            m.estudiante_id === matriculaData.estudiante_id && 
            m.ano_escolar === matriculaData.ano_escolar &&
            (m.estado === 'Aprobada' || m.estado === 'Completada' || m.estado === 'Pendiente') &&
            m.id !== matriculaId
        );
        
        if (matriculaConflicto) {
            showGlobalAlert('El estudiante ya tiene una matrícula activa para este año escolar', 'error');
            return;
        }
        
        if (matriculaId) {
            // Actualizar matrícula existente
            db.update('matriculas', matriculaId, matriculaData);
            showGlobalAlert('Matrícula actualizada correctamente', 'success');
        } else {
            // Crear nueva matrícula
            db.create('matriculas', matriculaData);
            showGlobalAlert('Matrícula creada correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('matriculaModal'));
        modal.hide();
        loadMatriculasData();
        updateMatriculasStats();
        
    } catch (error) {
        console.error('Error guardando matrícula:', error);
        showGlobalAlert('Error al guardar matrícula: ' + error.message, 'error');
    }
}

// Función para editar matrícula
function editMatricula(matriculaId) {
    showMatriculaModal(matriculaId);
}

// Función para ver detalles de matrícula
function viewMatricula(matriculaId) {
    const matricula = db.find('matriculas', matriculaId);
    if (!matricula) {
        showGlobalAlert('Matrícula no encontrada', 'error');
        return;
    }
    
    const estudiantes = db.read('estudiantes');
    const turnos = db.read('turnos');
    const tutores = db.read('tutores');
    
    const estudiante = estudiantes.find(e => e.id === matricula.estudiante_id);
    const turno = turnos.find(t => t.id === matricula.turno_id);
    const tutor = estudiante ? tutores.find(t => t.id === estudiante.tutor_id) : null;
    
    Swal.fire({
        title: `Matrícula ${matricula.codigo}`,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Código:</strong></div>
                    <div class="col-6">${matricula.codigo}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estudiante:</strong></div>
                    <div class="col-6">${estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Grado:</strong></div>
                    <div class="col-6">${matricula.grado}° Grado</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Turno:</strong></div>
                    <div class="col-6">${turno ? turno.nombre : 'No asignado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Año Escolar:</strong></div>
                    <div class="col-6">${matricula.ano_escolar}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Fecha:</strong></div>
                    <div class="col-6">${formatDate(matricula.fecha_matricula)}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estado:</strong></div>
                    <div class="col-6">${getStatusBadge(matricula.estado)}</div>
                </div>
                ${tutor ? `
                    <div class="row">
                        <div class="col-6"><strong>Tutor:</strong></div>
                        <div class="col-6">${tutor.nombre} ${tutor.apellido}</div>
                    </div>
                ` : ''}
                ${matricula.observaciones ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Observaciones:</strong></div>
                        <div class="col-12">${matricula.observaciones}</div>
                    </div>
                ` : ''}
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        showCancelButton: true,
        cancelButtonText: 'Editar',
        cancelButtonColor: '#007bff'
    }).then((result) => {
        if (result.isDismissed) {
            editMatricula(matriculaId);
        }
    });
}

// Función para imprimir matrícula
function imprimirMatricula(matriculaId) {
    const matricula = db.find('matriculas', matriculaId);
    if (!matricula) {
        showGlobalAlert('Matrícula no encontrada', 'error');
        return;
    }
    
    const estudiantes = db.read('estudiantes');
    const turnos = db.read('turnos');
    const tutores = db.read('tutores');
    const sistema = db.find('sistema', 'config');
    
    const estudiante = estudiantes.find(e => e.id === matricula.estudiante_id);
    const turno = turnos.find(t => t.id === matricula.turno_id);
    const tutor = estudiante ? tutores.find(t => t.id === estudiante.tutor_id) : null;
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Matrícula ${matricula.codigo}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .school-name { font-size: 24px; font-weight: bold; color: #007bff; }
                .document-title { font-size: 18px; margin: 10px 0; }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 8px; border: 1px solid #ddd; }
                .label { font-weight: bold; background-color: #f8f9fa; width: 30%; }
                .footer { margin-top: 40px; text-align: center; }
                .signature { margin: 40px 0; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="school-name">${sistema ? sistema.nombre : 'Escuela Jesús El Buen Maestro'}</div>
                <div class="document-title">CERTIFICADO DE MATRÍCULA</div>
                <div>Año Escolar: ${matricula.ano_escolar}</div>
            </div>
            
            <table class="info-table">
                <tr>
                    <td class="label">Código de Matrícula:</td>
                    <td>${matricula.codigo}</td>
                </tr>
                <tr>
                    <td class="label">Estudiante:</td>
                    <td>${estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado'}</td>
                </tr>
                <tr>
                    <td class="label">Cédula:</td>
                    <td>${estudiante ? (estudiante.cedula || 'No registrada') : '-'}</td>
                </tr>
                <tr>
                    <td class="label">Grado:</td>
                    <td>${matricula.grado}° Grado de Educación Primaria</td>
                </tr>
                <tr>
                    <td class="label">Turno:</td>
                    <td>${turno ? turno.nombre : 'No asignado'}</td>
                </tr>
                <tr>
                    <td class="label">Fecha de Matrícula:</td>
                    <td>${formatDate(matricula.fecha_matricula)}</td>
                </tr>
                <tr>
                    <td class="label">Estado:</td>
                    <td>${matricula.estado}</td>
                </tr>
                ${tutor ? `
                <tr>
                    <td class="label">Tutor/Representante:</td>
                    <td>${tutor.nombre} ${tutor.apellido}</td>
                </tr>
                <tr>
                    <td class="label">Parentesco:</td>
                    <td>${tutor.parentesco}</td>
                </tr>
                <tr>
                    <td class="label">Teléfono del Tutor:</td>
                    <td>${tutor.telefono}</td>
                </tr>
                ` : ''}
            </table>
            
            ${matricula.observaciones ? `
                <div style="margin: 20px 0;">
                    <strong>Observaciones:</strong><br>
                    ${matricula.observaciones}
                </div>
            ` : ''}
            
            <div class="footer">
                <div class="signature">
                    <div style="margin-bottom: 40px;">_________________________</div>
                    <div>Firma del Director(a)</div>
                </div>
                <div>Fecha de emisión: ${formatDate(new Date().toISOString())}</div>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Función para eliminar matrícula
function deleteMatricula(matriculaId) {
    const matricula = db.find('matriculas', matriculaId);
    if (!matricula) {
        showGlobalAlert('Matrícula no encontrada', 'error');
        return;
    }
    
    confirmAction(
        '¿Eliminar matrícula?',
        `¿Está seguro de eliminar la matrícula ${matricula.codigo}? Esta acción no se puede deshacer.`,
        'Sí, eliminar'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('matriculas', matriculaId);
                showGlobalAlert('Matrícula eliminada correctamente', 'success');
                loadMatriculasData();
                updateMatriculasStats();
            } catch (error) {
                console.error('Error eliminando matrícula:', error);
                showGlobalAlert('Error al eliminar matrícula', 'error');
            }
        }
    });
}

// Función de búsqueda
function searchMatriculas() {
    matriculasSearchQuery = document.getElementById('matriculas-search').value.trim();
    currentMatriculasPage = 1;
    loadMatriculasData();
}

// Función para filtrar matrículas
function filterMatriculas() {
    matriculasFilters = {
        grado: document.getElementById('filter-grado').value,
        turno_id: document.getElementById('filter-turno').value,
        estado: document.getElementById('filter-estado').value,
        ano_escolar: document.getElementById('filter-ano').value
    };
    
    // Remover filtros vacíos
    Object.keys(matriculasFilters).forEach(key => {
        if (!matriculasFilters[key]) {
            delete matriculasFilters[key];
        }
    });
    
    currentMatriculasPage = 1;
    loadMatriculasData();
}

// Función para limpiar filtros
function clearMatriculasFilters() {
    document.getElementById('matriculas-search').value = '';
    document.getElementById('filter-grado').value = '';
    document.getElementById('filter-turno').value = '';
    document.getElementById('filter-estado').value = '';
    document.getElementById('filter-ano').value = '';
    
    matriculasSearchQuery = '';
    matriculasFilters = {};
    currentMatriculasPage = 1;
    loadMatriculasData();
}

// Función para cambiar página
function changeMatriculasPage(page) {
    currentMatriculasPage = page;
    loadMatriculasData();
}

// Función para exportar matrículas
function exportMatriculas() {
    try {
        const matriculas = db.read('matriculas');
        const estudiantes = db.read('estudiantes');
        const turnos = db.read('turnos');
        const tutores = db.read('tutores');
        
        const exportData = matriculas.map(matricula => {
            const estudiante = estudiantes.find(e => e.id === matricula.estudiante_id);
            const turno = turnos.find(t => t.id === matricula.turno_id);
            const tutor = estudiante ? tutores.find(t => t.id === estudiante.tutor_id) : null;
            
            return {
                'Código': matricula.codigo,
                'Estudiante': estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado',
                'Cédula Estudiante': estudiante ? (estudiante.cedula || '') : '',
                'Grado': `${matricula.grado}° Grado`,
                'Turno': turno ? turno.nombre : '',
                'Año Escolar': matricula.ano_escolar,
                'Fecha de Matrícula': formatDateShort(matricula.fecha_matricula),
                'Estado': matricula.estado,
                'Tutor': tutor ? `${tutor.nombre} ${tutor.apellido}` : '',
                'Parentesco': tutor ? tutor.parentesco : '',
                'Teléfono Tutor': tutor ? tutor.telefono : '',
                'Observaciones': matricula.observaciones || '',
                'Fecha de Registro': formatDateShort(matricula.created_at)
            };
        });
        
        exportToExcel(exportData, 'matriculas', 'Lista de Matrículas');
        
    } catch (error) {
        console.error('Error exportando matrículas:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Función para generar reporte de matrículas
function generarReporteMatriculas() {
    const matriculas = db.read('matriculas');
    const currentYear = new Date().getFullYear();
    const currentAcademicYear = `${currentYear}-${currentYear + 1}`;
    
    // Estadísticas por grado
    const porGrado = {};
    for (let i = 1; i <= 6; i++) {
        porGrado[i] = matriculas.filter(m => m.grado === i.toString()).length;
    }
    
    // Estadísticas por estado
    const porEstado = {
        'Pendiente': matriculas.filter(m => m.estado === 'Pendiente').length,
        'Aprobada': matriculas.filter(m => m.estado === 'Aprobada').length,
        'Completada': matriculas.filter(m => m.estado === 'Completada').length,
        'Rechazada': matriculas.filter(m => m.estado === 'Rechazada').length
    };
    
    // Estadísticas por año
    const porAno = {};
    matriculas.forEach(m => {
        porAno[m.ano_escolar] = (porAno[m.ano_escolar] || 0) + 1;
    });
    
    Swal.fire({
        title: 'Reporte de Matrículas',
        html: `
            <div class="text-start">
                <h6>Resumen General</h6>
                <ul>
                    <li>Total de matrículas: ${matriculas.length}</li>
                    <li>Año actual (${currentAcademicYear}): ${matriculas.filter(m => m.ano_escolar === currentAcademicYear).length}</li>
                </ul>
                
                <h6>Por Grado</h6>
                <ul>
                    ${Object.entries(porGrado).map(([grado, count]) => 
                        `<li>${grado}° Grado: ${count} estudiantes</li>`
                    ).join('')}
                </ul>
                
                <h6>Por Estado</h6>
                <ul>
                    ${Object.entries(porEstado).map(([estado, count]) => 
                        `<li>${estado}: ${count} matrículas</li>`
                    ).join('')}
                </ul>
                
                <h6>Por Año Escolar</h6>
                <ul>
                    ${Object.entries(porAno).map(([ano, count]) => 
                        `<li>${ano}: ${count} matrículas</li>`
                    ).join('')}
                </ul>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        showCancelButton: true,
        cancelButtonText: 'Exportar Reporte',
        cancelButtonColor: '#28a745'
    }).then((result) => {
        if (result.isDismissed) {
            exportMatriculas();
        }
    });
}

// Exportar funciones
window.loadMatriculasSection = loadMatriculasSection;
window.showMatriculaModal = showMatriculaModal;
window.saveMatricula = saveMatricula;
window.editMatricula = editMatricula;
window.viewMatricula = viewMatricula;
window.imprimirMatricula = imprimirMatricula;
window.deleteMatricula = deleteMatricula;
window.searchMatriculas = searchMatriculas;
window.filterMatriculas = filterMatriculas;
window.clearMatriculasFilters = clearMatriculasFilters;
window.changeMatriculasPage = changeMatriculasPage;
window.exportMatriculas = exportMatriculas;
window.generarReporteMatriculas = generarReporteMatriculas;
window.loadEstudianteInfo = loadEstudianteInfo;

console.log('✅ Matriculas.js cargado correctamente');
