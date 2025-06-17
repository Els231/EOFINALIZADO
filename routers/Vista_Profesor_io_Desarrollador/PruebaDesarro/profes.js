/**
 * Módulo de gestión de profesores
 * Sistema completo de CRUD para profesores con especialidades y asignaciones
 */

let currentProfesoresPage = 1;
const profesoresPerPage = 10;
let profesoresFilters = {};
let profesoresSearchQuery = '';

// Función principal para cargar la sección de profesores
function loadProfesoresSection() {
    const section = document.getElementById('profesores-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-chalkboard-teacher me-2"></i>
                    Gestión de Profesores
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showProfesorModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Profesor
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportProfesores()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="showAsignacionesModal()">
                            <i class="fas fa-users-cog me-1"></i> Asignaciones
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="search-filters">
            <div class="row">
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-search"></i>
                        </span>
                        <input type="text" class="form-control" id="profesores-search" 
                               placeholder="Buscar por nombre, apellido o cédula..."
                               onkeyup="debounce(searchProfesores, 300)()">
                    </div>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filter-especialidad" onchange="filterProfesores()">
                        <option value="">Todas las especialidades</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-estado" onchange="filterProfesores()">
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Licencia">En Licencia</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearProfesoresFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar Filtros
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
                                <div class="h4 mb-0" id="total-profesores-activos">0</div>
                                <div class="small">Profesores Activos</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-user-check fa-2x"></i>
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
                                <div class="h4 mb-0" id="especialidades-cubiertas">0</div>
                                <div class="small">Especialidades Cubiertas</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-graduation-cap fa-2x"></i>
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
                                <div class="h4 mb-0" id="profesores-con-asignaciones">0</div>
                                <div class="small">Con Asignaciones</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clipboard-list fa-2x"></i>
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
                                <div class="h4 mb-0" id="carga-promedio">0</div>
                                <div class="small">Carga Promedio</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-chart-bar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de profesores -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">
                    Lista de Profesores
                    <span class="badge bg-primary ms-2" id="profesores-count">0</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Profesor</th>
                                <th>Cédula</th>
                                <th>Especialidad</th>
                                <th>Contacto</th>
                                <th>Asignaciones</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="profesores-tbody">
                            <!-- Datos se cargan aquí -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de profesores">
                    <ul class="pagination justify-content-center" id="profesores-pagination">
                        <!-- Paginación se genera aquí -->
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal de profesor -->
        <div class="modal fade" id="profesorModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="profesorModalTitle">
                            <i class="fas fa-chalkboard-teacher me-2"></i>
                            Nuevo Profesor
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="profesorForm">
                            <input type="hidden" id="profesor-id">
                            
                            <!-- Información personal -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-nombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="profesor-nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-apellido" class="form-label">Apellido *</label>
                                        <input type="text" class="form-control" id="profesor-apellido" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-cedula" class="form-label">Cédula *</label>
                                        <input type="text" class="form-control" id="profesor-cedula" 
                                               placeholder="000-0000000-0" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-telefono" class="form-label">Teléfono *</label>
                                        <input type="tel" class="form-control" id="profesor-telefono" 
                                               placeholder="809-000-0000" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="profesor-email" class="form-label">Email *</label>
                                        <input type="email" class="form-control" id="profesor-email" required>
                                    </div>
                                </div>
                            </div>

                            <!-- Información académica -->
                            <h6 class="border-bottom pb-2 mb-3">Información Académica</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-especialidad" class="form-label">Especialidad Principal *</label>
                                        <select class="form-select" id="profesor-especialidad" required>
                                            <!-- Se llena dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-especialidades-secundarias" class="form-label">Especialidades Secundarias</label>
                                        <select class="form-select" id="profesor-especialidades-secundarias" multiple>
                                            <!-- Se llena dinámicamente -->
                                        </select>
                                        <div class="form-text">Mantén Ctrl presionado para seleccionar múltiples opciones</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-titulo" class="form-label">Título Académico</label>
                                        <input type="text" class="form-control" id="profesor-titulo" 
                                               placeholder="Ej: Licenciatura en Educación Básica">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-experiencia" class="form-label">Años de Experiencia</label>
                                        <input type="number" class="form-control" id="profesor-experiencia" 
                                               min="0" max="50">
                                    </div>
                                </div>
                            </div>

                            <!-- Dirección -->
                            <h6 class="border-bottom pb-2 mb-3">Dirección</h6>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="profesor-provincia" class="form-label">Provincia</label>
                                        <select class="form-select" id="profesor-provincia" onchange="loadMunicipios('profesor')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="profesor-municipio" class="form-label">Municipio</label>
                                        <select class="form-select" id="profesor-municipio" onchange="loadSectores('profesor')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="profesor-sector" class="form-label">Sector</label>
                                        <select class="form-select" id="profesor-sector">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="profesor-direccion" class="form-label">Dirección Completa</label>
                                <textarea class="form-control" id="profesor-direccion" rows="2"></textarea>
                            </div>

                            <!-- Estado y observaciones -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-estado" class="form-label">Estado</label>
                                        <select class="form-select" id="profesor-estado">
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                            <option value="Licencia">En Licencia</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="profesor-fecha-ingreso" class="form-label">Fecha de Ingreso</label>
                                        <input type="date" class="form-control" id="profesor-fecha-ingreso">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="profesor-observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="profesor-observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveProfesor()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de asignaciones -->
        <div class="modal fade" id="asignacionesModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-users-cog me-2"></i>
                            Asignaciones de Profesores
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="asignaciones-content">
                            <!-- Contenido de asignaciones se carga aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    loadProfesoresData();
    loadEspecialidades();
    loadProvincias('profesor');
    updateProfesoresStats();
}

// Función para cargar datos de profesores
function loadProfesoresData() {
    try {
        const allProfesores = db.read('profesores');
        let filteredProfesores = allProfesores;

        // Aplicar búsqueda
        if (profesoresSearchQuery) {
            filteredProfesores = filterByMultipleFields(
                filteredProfesores, 
                profesoresSearchQuery, 
                ['nombre', 'apellido', 'cedula', 'email']
            );
        }

        // Aplicar filtros
        filteredProfesores = applyFilters(filteredProfesores, profesoresFilters);

        // Actualizar contador
        document.getElementById('profesores-count').textContent = filteredProfesores.length;

        // Paginar resultados
        const paginatedData = paginate(filteredProfesores, currentProfesoresPage, profesoresPerPage);
        
        // Renderizar tabla
        renderProfesoresTable(paginatedData.data);
        
        // Renderizar paginación
        renderProfesoresPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando profesores:', error);
        showGlobalAlert('Error al cargar datos de profesores', 'error');
    }
}

// Función para renderizar tabla de profesores
function renderProfesoresTable(profesores) {
    const tbody = document.getElementById('profesores-tbody');
    
    if (profesores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-chalkboard-teacher fa-3x text-muted mb-3"></i>
                        <h5>No hay profesores registrados</h5>
                        <p class="text-muted">Comience agregando un nuevo profesor</p>
                        <button type="button" class="btn btn-primary" onclick="showProfesorModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Profesor
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = profesores.map(profesor => {
        const asignaciones = getProfesorAsignaciones(profesor.id);
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-3" style="background-color: #667eea;">
                            ${profesor.nombre.charAt(0)}${profesor.apellido.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${profesor.nombre} ${profesor.apellido}</div>
                            <small class="text-muted">${profesor.titulo || 'Sin título especificado'}</small>
                        </div>
                    </div>
                </td>
                <td>${profesor.cedula}</td>
                <td>
                    <span class="badge bg-primary">${profesor.especialidad}</span>
                    ${profesor.especialidades_secundarias ? 
                        profesor.especialidades_secundarias.map(esp => 
                            `<span class="badge bg-secondary ms-1">${esp}</span>`
                        ).join('') : ''
                    }
                </td>
                <td>
                    <div>${profesor.telefono}</div>
                    <small class="text-muted">${profesor.email}</small>
                </td>
                <td>
                    <span class="badge bg-info">${asignaciones.length} materias</span>
                </td>
                <td>${getStatusBadge(profesor.estado || 'Activo')}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editProfesor('${profesor.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewProfesor('${profesor.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-warning" 
                                onclick="manageAsignaciones('${profesor.id}')" title="Asignaciones">
                            <i class="fas fa-clipboard-list"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteProfesor('${profesor.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para renderizar paginación
function renderProfesoresPagination(paginatedData) {
    const pagination = document.getElementById('profesores-pagination');
    
    if (paginatedData.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // Botón anterior
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasPrev ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeProfesoresPage(${currentProfesoresPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= paginatedData.totalPages; i++) {
        if (i === currentProfesoresPage || 
            i === 1 || 
            i === paginatedData.totalPages || 
            (i >= currentProfesoresPage - 1 && i <= currentProfesoresPage + 1)) {
            
            paginationHtml += `
                <li class="page-item ${i === currentProfesoresPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeProfesoresPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentProfesoresPage - 2 || i === currentProfesoresPage + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botón siguiente
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasNext ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeProfesoresPage(${currentProfesoresPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHtml;
}

// Función para cargar especialidades
function loadEspecialidades() {
    const especialidades = dominicanData.getTeacherSpecialties();
    const selectElements = [
        document.getElementById('profesor-especialidad'),
        document.getElementById('profesor-especialidades-secundarias'),
        document.getElementById('filter-especialidad')
    ];
    
    selectElements.forEach(select => {
        if (select) {
            const isFilter = select.id === 'filter-especialidad';
            const isMultiple = select.multiple;
            
            if (!isFilter && !isMultiple) {
                select.innerHTML = '<option value="">Seleccionar especialidad...</option>';
            }
            
            especialidades.forEach(especialidad => {
                const option = document.createElement('option');
                option.value = especialidad;
                option.textContent = especialidad;
                select.appendChild(option);
            });
        }
    });
}

// Función para actualizar estadísticas de profesores
function updateProfesoresStats() {
    try {
        const profesores = db.read('profesores');
        const profesoresActivos = profesores.filter(p => p.estado === 'Activo');
        
        // Total profesores activos
        document.getElementById('total-profesores-activos').textContent = profesoresActivos.length;
        
        // Especialidades cubiertas
        const especialidadesCubiertas = new Set();
        profesoresActivos.forEach(profesor => {
            if (profesor.especialidad) {
                especialidadesCubiertas.add(profesor.especialidad);
            }
            if (profesor.especialidades_secundarias) {
                profesor.especialidades_secundarias.forEach(esp => especialidadesCubiertas.add(esp));
            }
        });
        document.getElementById('especialidades-cubiertas').textContent = especialidadesCubiertas.size;
        
        // Profesores con asignaciones
        const profesoresConAsignaciones = profesoresActivos.filter(profesor => {
            const asignaciones = getProfesorAsignaciones(profesor.id);
            return asignaciones.length > 0;
        });
        document.getElementById('profesores-con-asignaciones').textContent = profesoresConAsignaciones.length;
        
        // Carga promedio (simulada - en un sistema real se calcularía con horarios)
        const cargaPromedio = profesoresConAsignaciones.length > 0 ? 
            Math.round(profesoresConAsignaciones.reduce((acc, profesor) => {
                return acc + getProfesorAsignaciones(profesor.id).length;
            }, 0) / profesoresConAsignaciones.length) : 0;
        document.getElementById('carga-promedio').textContent = cargaPromedio;
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

// Función para obtener asignaciones de un profesor (simulada)
function getProfesorAsignaciones(profesorId) {
    // En un sistema real, esto vendría de una tabla de asignaciones
    const materias = db.read('materias');
    const profesor = db.find('profesores', profesorId);
    
    if (!profesor) return [];
    
    // Simular asignaciones basadas en especialidad
    return materias.filter(materia => {
        if (profesor.especialidad === 'Educación Básica') return true;
        if (profesor.especialidad === 'Lengua Española' && materia.codigo === 'ESP') return true;
        if (profesor.especialidad === 'Matemáticas' && materia.codigo === 'MAT') return true;
        if (profesor.especialidad === 'Ciencias Naturales' && materia.codigo === 'CN') return true;
        if (profesor.especialidad === 'Ciencias Sociales' && materia.codigo === 'CS') return true;
        if (profesor.especialidad === 'Inglés' && materia.codigo === 'ING') return true;
        if (profesor.especialidad === 'Educación Física' && materia.codigo === 'EF') return true;
        return false;
    }).slice(0, Math.floor(Math.random() * 4) + 1); // 1-4 materias aleatoriamente
}

// Función para mostrar modal de profesor
function showProfesorModal(profesorId = null) {
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    const title = document.getElementById('profesorModalTitle');
    const form = document.getElementById('profesorForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('profesor-id').value = '';
    
    if (profesorId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-chalkboard-teacher me-2"></i>Editar Profesor';
        const profesor = db.find('profesores', profesorId);
        
        if (profesor) {
            document.getElementById('profesor-id').value = profesor.id;
            document.getElementById('profesor-nombre').value = profesor.nombre || '';
            document.getElementById('profesor-apellido').value = profesor.apellido || '';
            document.getElementById('profesor-cedula').value = profesor.cedula || '';
            document.getElementById('profesor-telefono').value = profesor.telefono || '';
            document.getElementById('profesor-email').value = profesor.email || '';
            document.getElementById('profesor-especialidad').value = profesor.especialidad || '';
            
            // Especialidades secundarias
            if (profesor.especialidades_secundarias) {
                const select = document.getElementById('profesor-especialidades-secundarias');
                Array.from(select.options).forEach(option => {
                    option.selected = profesor.especialidades_secundarias.includes(option.value);
                });
            }
            
            document.getElementById('profesor-titulo').value = profesor.titulo || '';
            document.getElementById('profesor-experiencia').value = profesor.experiencia || '';
            document.getElementById('profesor-provincia').value = profesor.provincia || '';
            
            // Cargar municipios y sectores si hay provincia
            if (profesor.provincia) {
                loadMunicipios('profesor');
                setTimeout(() => {
                    document.getElementById('profesor-municipio').value = profesor.municipio || '';
                    if (profesor.municipio) {
                        loadSectores('profesor');
                        setTimeout(() => {
                            document.getElementById('profesor-sector').value = profesor.sector || '';
                        }, 100);
                    }
                }, 100);
            }
            
            document.getElementById('profesor-direccion').value = profesor.direccion || '';
            document.getElementById('profesor-estado').value = profesor.estado || 'Activo';
            document.getElementById('profesor-fecha-ingreso').value = profesor.fecha_ingreso || '';
            document.getElementById('profesor-observaciones').value = profesor.observaciones || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-chalkboard-teacher me-2"></i>Nuevo Profesor';
        document.getElementById('profesor-estado').value = 'Activo';
        document.getElementById('profesor-fecha-ingreso').value = new Date().toISOString().split('T')[0];
    }
    
    modal.show();
}

// Función para guardar profesor
function saveProfesor() {
    try {
        const form = document.getElementById('profesorForm');
        
        // Obtener especialidades secundarias seleccionadas
        const especialidadesSecundarias = Array.from(
            document.getElementById('profesor-especialidades-secundarias').selectedOptions
        ).map(option => option.value);
        
        const profesorData = {
            nombre: document.getElementById('profesor-nombre').value.trim(),
            apellido: document.getElementById('profesor-apellido').value.trim(),
            cedula: document.getElementById('profesor-cedula').value.trim(),
            telefono: document.getElementById('profesor-telefono').value.trim(),
            email: document.getElementById('profesor-email').value.trim(),
            especialidad: document.getElementById('profesor-especialidad').value,
            especialidades_secundarias: especialidadesSecundarias,
            titulo: document.getElementById('profesor-titulo').value.trim(),
            experiencia: document.getElementById('profesor-experiencia').value,
            provincia: document.getElementById('profesor-provincia').value,
            municipio: document.getElementById('profesor-municipio').value,
            sector: document.getElementById('profesor-sector').value,
            direccion: document.getElementById('profesor-direccion').value.trim(),
            estado: document.getElementById('profesor-estado').value,
            fecha_ingreso: document.getElementById('profesor-fecha-ingreso').value,
            observaciones: document.getElementById('profesor-observaciones').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            nombre: { required: true, label: 'Nombre' },
            apellido: { required: true, label: 'Apellido' },
            cedula: { required: true, type: 'cedula', label: 'Cédula' },
            telefono: { required: true, type: 'phone', label: 'Teléfono' },
            email: { required: true, type: 'email', label: 'Email' },
            especialidad: { required: true, label: 'Especialidad' }
        };
        
        const errors = validateFormData(profesorData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Formatear datos
        profesorData.telefono = formatPhoneNumber(profesorData.telefono);
        profesorData.cedula = formatCedula(profesorData.cedula);
        
        // Convertir experiencia a número
        if (profesorData.experiencia) {
            profesorData.experiencia = parseInt(profesorData.experiencia);
        }
        
        const profesorId = document.getElementById('profesor-id').value;
        
        if (profesorId) {
            // Actualizar profesor existente
            db.update('profesores', profesorId, profesorData);
            showGlobalAlert('Profesor actualizado correctamente', 'success');
        } else {
            // Crear nuevo profesor
            db.create('profesores', profesorData);
            showGlobalAlert('Profesor creado correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('profesorModal'));
        modal.hide();
        loadProfesoresData();
        updateProfesoresStats();
        
    } catch (error) {
        console.error('Error guardando profesor:', error);
        showGlobalAlert('Error al guardar profesor: ' + error.message, 'error');
    }
}

// Función para editar profesor
function editProfesor(profesorId) {
    showProfesorModal(profesorId);
}

// Función para ver detalles de profesor
function viewProfesor(profesorId) {
    const profesor = db.find('profesores', profesorId);
    if (!profesor) {
        showGlobalAlert('Profesor no encontrado', 'error');
        return;
    }
    
    const asignaciones = getProfesorAsignaciones(profesor.id);
    
    Swal.fire({
        title: `${profesor.nombre} ${profesor.apellido}`,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Cédula:</strong></div>
                    <div class="col-6">${profesor.cedula}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Teléfono:</strong></div>
                    <div class="col-6">${profesor.telefono}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Email:</strong></div>
                    <div class="col-6">${profesor.email}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Especialidad:</strong></div>
                    <div class="col-6">${profesor.especialidad}</div>
                </div>
                ${profesor.titulo ? `
                    <div class="row">
                        <div class="col-6"><strong>Título:</strong></div>
                        <div class="col-6">${profesor.titulo}</div>
                    </div>
                ` : ''}
                ${profesor.experiencia ? `
                    <div class="row">
                        <div class="col-6"><strong>Experiencia:</strong></div>
                        <div class="col-6">${profesor.experiencia} años</div>
                    </div>
                ` : ''}
                <div class="row">
                    <div class="col-6"><strong>Estado:</strong></div>
                    <div class="col-6">${getStatusBadge(profesor.estado)}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Asignaciones:</strong></div>
                    <div class="col-6">${asignaciones.length} materias</div>
                </div>
                ${profesor.fecha_ingreso ? `
                    <div class="row">
                        <div class="col-6"><strong>Fecha de Ingreso:</strong></div>
                        <div class="col-6">${formatDateShort(profesor.fecha_ingreso)}</div>
                    </div>
                ` : ''}
                ${profesor.observaciones ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Observaciones:</strong></div>
                        <div class="col-12">${profesor.observaciones}</div>
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
            editProfesor(profesorId);
        }
    });
}

// Función para eliminar profesor
function deleteProfesor(profesorId) {
    const profesor = db.find('profesores', profesorId);
    if (!profesor) {
        showGlobalAlert('Profesor no encontrado', 'error');
        return;
    }
    
    confirmAction(
        '¿Eliminar profesor?',
        `¿Está seguro de eliminar a ${profesor.nombre} ${profesor.apellido}? Esta acción no se puede deshacer.`,
        'Sí, eliminar'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('profesores', profesorId);
                showGlobalAlert('Profesor eliminado correctamente', 'success');
                loadProfesoresData();
                updateProfesoresStats();
            } catch (error) {
                console.error('Error eliminando profesor:', error);
                showGlobalAlert('Error al eliminar profesor', 'error');
            }
        }
    });
}

// Función para gestionar asignaciones de un profesor
function manageAsignaciones(profesorId) {
    const profesor = db.find('profesores', profesorId);
    if (!profesor) {
        showGlobalAlert('Profesor no encontrado', 'error');
        return;
    }
    
    const asignaciones = getProfesorAsignaciones(profesorId);
    const materias = db.read('materias');
    
    Swal.fire({
        title: `Asignaciones de ${profesor.nombre} ${profesor.apellido}`,
        html: `
            <div class="text-start">
                <p><strong>Especialidad Principal:</strong> ${profesor.especialidad}</p>
                <h6>Materias Asignadas:</h6>
                ${asignaciones.length > 0 ? 
                    asignaciones.map(materia => 
                        `<span class="badge bg-primary me-1">${materia.nombre}</span>`
                    ).join('') : 
                    '<p class="text-muted">Sin asignaciones actuales</p>'
                }
                <hr>
                <small class="text-muted">
                    En un sistema completo, aquí se gestionarían las asignaciones de materias y horarios.
                </small>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    });
}

// Función para mostrar modal de todas las asignaciones
function showAsignacionesModal() {
    const modal = new bootstrap.Modal(document.getElementById('asignacionesModal'));
    const container = document.getElementById('asignaciones-content');
    
    const profesores = db.read('profesores').filter(p => p.estado === 'Activo');
    const materias = db.read('materias');
    
    let asignacionesHtml = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Esta es una vista general de las asignaciones de profesores. En un sistema completo,
            aquí se gestionarían horarios, grupos y cargas académicas.
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Profesor</th>
                        <th>Especialidad</th>
                        <th>Materias Asignadas</th>
                        <th>Carga</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    profesores.forEach(profesor => {
        const asignaciones = getProfesorAsignaciones(profesor.id);
        
        asignacionesHtml += `
            <tr>
                <td>
                    <div class="fw-bold">${profesor.nombre} ${profesor.apellido}</div>
                    <small class="text-muted">${profesor.titulo || 'Sin título'}</small>
                </td>
                <td>${profesor.especialidad}</td>
                <td>
                    ${asignaciones.map(materia => 
                        `<span class="badge bg-primary me-1">${materia.nombre}</span>`
                    ).join('')}
                </td>
                <td>
                    <span class="badge bg-info">${asignaciones.length} materias</span>
                </td>
                <td>${getStatusBadge(profesor.estado)}</td>
            </tr>
        `;
    });
    
    asignacionesHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = asignacionesHtml;
    modal.show();
}

// Función de búsqueda
function searchProfesores() {
    profesoresSearchQuery = document.getElementById('profesores-search').value.trim();
    currentProfesoresPage = 1;
    loadProfesoresData();
}

// Función para filtrar profesores
function filterProfesores() {
    profesoresFilters = {
        especialidad: document.getElementById('filter-especialidad').value,
        estado: document.getElementById('filter-estado').value
    };
    
    // Remover filtros vacíos
    Object.keys(profesoresFilters).forEach(key => {
        if (!profesoresFilters[key]) {
            delete profesoresFilters[key];
        }
    });
    
    currentProfesoresPage = 1;
    loadProfesoresData();
}

// Función para limpiar filtros
function clearProfesoresFilters() {
    document.getElementById('profesores-search').value = '';
    document.getElementById('filter-especialidad').value = '';
    document.getElementById('filter-estado').value = '';
    
    profesoresSearchQuery = '';
    profesoresFilters = {};
    currentProfesoresPage = 1;
    loadProfesoresData();
}

// Función para cambiar página
function changeProfesoresPage(page) {
    currentProfesoresPage = page;
    loadProfesoresData();
}

// Función para exportar profesores
function exportProfesores() {
    try {
        const profesores = db.read('profesores');
        
        const exportData = profesores.map(profesor => {
            const asignaciones = getProfesorAsignaciones(profesor.id);
            
            return {
                'Nombre': profesor.nombre,
                'Apellido': profesor.apellido,
                'Cédula': profesor.cedula,
                'Teléfono': profesor.telefono,
                'Email': profesor.email,
                'Especialidad Principal': profesor.especialidad,
                'Especialidades Secundarias': profesor.especialidades_secundarias ? 
                    profesor.especialidades_secundarias.join(', ') : '',
                'Título Académico': profesor.titulo || '',
                'Años de Experiencia': profesor.experiencia || '',
                'Provincia': profesor.provincia || '',
                'Municipio': profesor.municipio || '',
                'Sector': profesor.sector || '',
                'Dirección': profesor.direccion || '',
                'Estado': profesor.estado,
                'Fecha de Ingreso': profesor.fecha_ingreso ? formatDateShort(profesor.fecha_ingreso) : '',
                'Materias Asignadas': asignaciones.map(m => m.nombre).join(', '),
                'Carga de Trabajo': asignaciones.length,
                'Observaciones': profesor.observaciones || '',
                'Fecha de Registro': formatDateShort(profesor.created_at)
            };
        });
        
        exportToExcel(exportData, 'profesores', 'Lista de Profesores');
        
    } catch (error) {
        console.error('Error exportando profesores:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Exportar funciones
window.loadProfesoresSection = loadProfesoresSection;
window.showProfesorModal = showProfesorModal;
window.saveProfesor = saveProfesor;
window.editProfesor = editProfesor;
window.viewProfesor = viewProfesor;
window.deleteProfesor = deleteProfesor;
window.manageAsignaciones = manageAsignaciones;
window.showAsignacionesModal = showAsignacionesModal;
window.searchProfesores = searchProfesores;
window.filterProfesores = filterProfesores;
window.clearProfesoresFilters = clearProfesoresFilters;
window.changeProfesoresPage = changeProfesoresPage;
window.exportProfesores = exportProfesores;

console.log('✅ Profesores.js cargado correctamente');
