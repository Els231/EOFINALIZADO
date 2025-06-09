/**
 * Módulo de gestión de profesores
 * Funcionalidades CRUD para profesores
 */

let profesoresData = [];
let currentProfesoresPage = 1;
const profesoresPerPage = 10;

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
                        <button type="button" class="btn btn-primary" onclick="showAddProfesorModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Profesor
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportProfesores()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshProfesores()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-4">
                    <label for="searchProfesores" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchProfesores" 
                           placeholder="Nombre, apellido o especialidad..." 
                           oninput="filterProfesores()">
                </div>
                <div class="col-md-3">
                    <label for="filterEspecialidad" class="form-label">Especialidad:</label>
                    <select class="form-select" id="filterEspecialidad" onchange="filterProfesores()">
                        <option value="">Todas las especialidades</option>
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Lengua Española">Lengua Española</option>
                        <option value="Ciencias Naturales">Ciencias Naturales</option>
                        <option value="Ciencias Sociales">Ciencias Sociales</option>
                        <option value="Inglés">Inglés</option>
                        <option value="Educación Física">Educación Física</option>
                        <option value="Educación Artística">Educación Artística</option>
                        <option value="Formación Humana">Formación Humana</option>
                        <option value="Informática">Informática</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filterEstadoProfesor" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstadoProfesor" onchange="filterProfesores()">
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Licencia">En Licencia</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearProfesoresFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="total-profesores">0</h3>
                        <p class="mb-0">Total Profesores</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="profesores-activos">0</h3>
                        <p class="mb-0">Activos</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="profesores-licencia">0</h3>
                        <p class="mb-0">En Licencia</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="especialidades-cubiertas">0</h3>
                        <p class="mb-0">Especialidades</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de profesores -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Lista de Profesores</h6>
            </div>
            <div class="card-body">
                <div id="profesoresTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="profesoresPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar profesor -->
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
                            <input type="hidden" id="profesorId">
                            
                            <!-- Información Personal -->
                            <h6 class="text-primary mb-3">
                                <i class="fas fa-user me-2"></i>
                                Información Personal
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombresPr" class="form-label">Nombres *</label>
                                        <input type="text" class="form-control" id="nombresPr" name="nombres" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="apellidosPr" class="form-label">Apellidos *</label>
                                        <input type="text" class="form-control" id="apellidosPr" name="apellidos" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="cedulaPr" class="form-label">Cédula *</label>
                                        <input type="text" class="form-control" id="cedulaPr" name="cedula" 
                                               placeholder="000-0000000-0" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaNacimientoPr" class="form-label">Fecha de Nacimiento *</label>
                                        <input type="date" class="form-control" id="fechaNacimientoPr" name="fechaNacimiento" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="generoPr" class="form-label">Género *</label>
                                        <select class="form-select" id="generoPr" name="genero" required>
                                            <option value="">Seleccionar género</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estadoCivil" class="form-label">Estado Civil</label>
                                        <select class="form-select" id="estadoCivil" name="estadoCivil">
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
                                        <label for="nacionalidad" class="form-label">Nacionalidad</label>
                                        <input type="text" class="form-control" id="nacionalidad" name="nacionalidad" 
                                               value="Dominicana">
                                    </div>
                                </div>
                            </div>

                            <!-- Información de Contacto -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-phone me-2"></i>
                                Información de Contacto
                            </h6>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoPr" class="form-label">Teléfono *</label>
                                        <input type="tel" class="form-control" id="telefonoPr" name="telefono" 
                                               placeholder="809-000-0000" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="celular" class="form-label">Celular</label>
                                        <input type="tel" class="form-control" id="celular" name="celular" 
                                               placeholder="849-000-0000">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="emailPr" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="emailPr" name="email" required>
                            </div>

                            <div class="mb-3">
                                <label for="direccionPr" class="form-label">Dirección *</label>
                                <textarea class="form-control" id="direccionPr" name="direccion" rows="2" required></textarea>
                            </div>

                            <!-- Información Académica y Profesional -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-graduation-cap me-2"></i>
                                Información Académica y Profesional
                            </h6>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="especialidad" class="form-label">Especialidad Principal *</label>
                                        <select class="form-select" id="especialidad" name="especialidad" required>
                                            <option value="">Seleccionar especialidad</option>
                                            <option value="Matemáticas">Matemáticas</option>
                                            <option value="Lengua Española">Lengua Española</option>
                                            <option value="Ciencias Naturales">Ciencias Naturales</option>
                                            <option value="Ciencias Sociales">Ciencias Sociales</option>
                                            <option value="Inglés">Inglés</option>
                                            <option value="Educación Física">Educación Física</option>
                                            <option value="Educación Artística">Educación Artística</option>
                                            <option value="Formación Humana">Formación Humana y Religiosa</option>
                                            <option value="Informática">Informática</option>
                                            <option value="Educación Inicial">Educación Inicial</option>
                                            <option value="Educación Especial">Educación Especial</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nivelEducativo" class="form-label">Nivel Educativo *</label>
                                        <select class="form-select" id="nivelEducativo" name="nivelEducativo" required>
                                            <option value="">Seleccionar nivel</option>
                                            <option value="Bachiller">Bachiller</option>
                                            <option value="Técnico Superior">Técnico Superior</option>
                                            <option value="Licenciatura">Licenciatura</option>
                                            <option value="Especialidad">Especialidad</option>
                                            <option value="Maestría">Maestría</option>
                                            <option value="Doctorado">Doctorado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tituloObtenido" class="form-label">Título Obtenido</label>
                                        <input type="text" class="form-control" id="tituloObtenido" name="tituloObtenido">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="institucionFormacion" class="form-label">Institución de Formación</label>
                                        <input type="text" class="form-control" id="institucionFormacion" name="institucionFormacion">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="anoGraduacion" class="form-label">Año de Graduación</label>
                                        <input type="number" class="form-control" id="anoGraduacion" name="anoGraduacion" 
                                               min="1980" max="2024">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="experienciaAnos" class="form-label">Años de Experiencia</label>
                                        <input type="number" class="form-control" id="experienciaAnos" name="experienciaAnos" 
                                               min="0" max="50">
                                    </div>
                                </div>
                            </div>

                            <!-- Información Laboral -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-briefcase me-2"></i>
                                Información Laboral
                            </h6>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="fechaIngreso" class="form-label">Fecha de Ingreso *</label>
                                        <input type="date" class="form-control" id="fechaIngreso" name="fechaIngreso" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tipoContrato" class="form-label">Tipo de Contrato</label>
                                        <select class="form-select" id="tipoContrato" name="tipoContrato">
                                            <option value="">Seleccionar</option>
                                            <option value="Tiempo Completo">Tiempo Completo</option>
                                            <option value="Medio Tiempo">Medio Tiempo</option>
                                            <option value="Por Horas">Por Horas</option>
                                            <option value="Temporal">Temporal</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estadoPr" class="form-label">Estado Laboral *</label>
                                        <select class="form-select" id="estadoPr" name="estado" required>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                            <option value="Licencia">En Licencia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="salario" class="form-label">Salario</label>
                                        <input type="number" class="form-control" id="salario" name="salario" 
                                               min="0" step="0.01">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="horarioTrabajo" class="form-label">Horario de Trabajo</label>
                                        <select class="form-select" id="horarioTrabajo" name="horarioTrabajo">
                                            <option value="">Seleccionar</option>
                                            <option value="Matutino">Matutino (7:00 AM - 12:00 PM)</option>
                                            <option value="Vespertino">Vespertino (1:00 PM - 6:00 PM)</option>
                                            <option value="Completo">Horario Completo (7:00 AM - 5:00 PM)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="observacionesPr" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observacionesPr" name="observaciones" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveProfesor()">
                            <i class="fas fa-save me-1"></i> Guardar Profesor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadProfesoresData();
    updateProfesoresStats();
}

// Función para cargar datos de profesores
function loadProfesoresData() {
    const savedData = localStorage.getItem('profesoresData');
    if (savedData) {
        profesoresData = JSON.parse(savedData);
    } else {
        // Datos iniciales vacíos
        profesoresData = [];
    }
    displayProfesores();
}

// Función para mostrar profesores
function displayProfesores() {
    const container = document.getElementById('profesoresTableContainer');
    if (!container) return;

    if (profesoresData.length === 0) {
        showEmptyState(container, 'No hay profesores registrados', 'fas fa-chalkboard-teacher');
        document.getElementById('profesoresPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyProfesoresFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentProfesoresPage, profesoresPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Profesor</th>
                        <th>Especialidad</th>
                        <th>Nivel Educativo</th>
                        <th>Estado</th>
                        <th>Fecha Ingreso</th>
                        <th>Contacto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(profesor => {
        const estadoBadge = getProfesorEstadoBadge(profesor.estado);
        const edad = profesor.fechaNacimiento ? calculateAge(profesor.fechaNacimiento) : 'N/A';
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                            <i class="fas fa-user text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${profesor.nombres} ${profesor.apellidos}</div>
                            <small class="text-muted">${profesor.cedula}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-info">${profesor.especialidad}</span>
                </td>
                <td>${profesor.nivelEducativo}</td>
                <td>${estadoBadge}</td>
                <td>${formatDateShort(profesor.fechaIngreso)}</td>
                <td>
                    <div>
                        <small class="text-muted">
                            <i class="fas fa-phone me-1"></i>${profesor.telefono}
                        </small><br>
                        <small class="text-muted">
                            <i class="fas fa-envelope me-1"></i>${profesor.email}
                        </small>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editProfesor('${profesor.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewProfesor('${profesor.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteProfesor('${profesor.id}')" title="Eliminar">
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
    document.getElementById('profesoresPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentProfesoresPage, 'goToProfesoresPage');
}

// Función para obtener badge del estado del profesor
function getProfesorEstadoBadge(estado) {
    const badges = {
        'Activo': '<span class="badge bg-success">Activo</span>',
        'Inactivo': '<span class="badge bg-danger">Inactivo</span>',
        'Licencia': '<span class="badge bg-warning">En Licencia</span>'
    };
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

// Función para aplicar filtros
function applyProfesoresFilters() {
    let filtered = [...profesoresData];
    
    const searchTerm = document.getElementById('searchProfesores')?.value?.toLowerCase() || '';
    const especialidadFilter = document.getElementById('filterEspecialidad')?.value || '';
    const estadoFilter = document.getElementById('filterEstadoProfesor')?.value || '';
    
    if (searchTerm) {
        filtered = filtered.filter(profesor => {
            const nombreCompleto = `${profesor.nombres} ${profesor.apellidos}`.toLowerCase();
            const especialidad = profesor.especialidad?.toLowerCase() || '';
            return nombreCompleto.includes(searchTerm) || 
                   especialidad.includes(searchTerm) ||
                   profesor.cedula.includes(searchTerm);
        });
    }
    
    if (especialidadFilter) {
        filtered = filtered.filter(p => p.especialidad === especialidadFilter);
    }
    
    if (estadoFilter) {
        filtered = filtered.filter(p => p.estado === estadoFilter);
    }
    
    return filtered;
}

// Función para limpiar filtros
function clearProfesoresFilters() {
    document.getElementById('searchProfesores').value = '';
    document.getElementById('filterEspecialidad').value = '';
    document.getElementById('filterEstadoProfesor').value = '';
    filterProfesores();
}

// Función para filtrar profesores
function filterProfesores() {
    currentProfesoresPage = 1;
    displayProfesores();
}

// Función para cambiar página
function goToProfesoresPage(page) {
    currentProfesoresPage = page;
    displayProfesores();
}

// Función para mostrar modal de nuevo profesor
function showAddProfesorModal() {
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    document.getElementById('profesorModalTitle').innerHTML = '<i class="fas fa-chalkboard-teacher me-2"></i>Nuevo Profesor';
    document.getElementById('profesorId').value = '';
    clearForm(document.getElementById('profesorForm'));
    
    // Establecer fecha actual para fecha de ingreso
    document.getElementById('fechaIngreso').value = new Date().toISOString().split('T')[0];
    
    modal.show();
}

// Función para editar profesor
function editProfesor(id) {
    const profesor = profesoresData.find(p => p.id === id);
    if (!profesor) return;
    
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    document.getElementById('profesorModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Profesor';
    
    // Llenar formulario
    document.getElementById('profesorId').value = profesor.id;
    document.getElementById('nombresPr').value = profesor.nombres || '';
    document.getElementById('apellidosPr').value = profesor.apellidos || '';
    document.getElementById('cedulaPr').value = profesor.cedula || '';
    document.getElementById('fechaNacimientoPr').value = profesor.fechaNacimiento || '';
    document.getElementById('generoPr').value = profesor.genero || '';
    document.getElementById('estadoCivil').value = profesor.estadoCivil || '';
    document.getElementById('nacionalidad').value = profesor.nacionalidad || '';
    document.getElementById('telefonoPr').value = profesor.telefono || '';
    document.getElementById('celular').value = profesor.celular || '';
    document.getElementById('emailPr').value = profesor.email || '';
    document.getElementById('direccionPr').value = profesor.direccion || '';
    document.getElementById('especialidad').value = profesor.especialidad || '';
    document.getElementById('nivelEducativo').value = profesor.nivelEducativo || '';
    document.getElementById('tituloObtenido').value = profesor.tituloObtenido || '';
    document.getElementById('institucionFormacion').value = profesor.institucionFormacion || '';
    document.getElementById('anoGraduacion').value = profesor.anoGraduacion || '';
    document.getElementById('experienciaAnos').value = profesor.experienciaAnos || '';
    document.getElementById('fechaIngreso').value = profesor.fechaIngreso || '';
    document.getElementById('tipoContrato').value = profesor.tipoContrato || '';
    document.getElementById('estadoPr').value = profesor.estado || '';
    document.getElementById('salario').value = profesor.salario || '';
    document.getElementById('horarioTrabajo').value = profesor.horarioTrabajo || '';
    document.getElementById('observacionesPr').value = profesor.observaciones || '';
    
    modal.show();
}

// Función para guardar profesor
function saveProfesor() {
    const form = document.getElementById('profesorForm');
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const profesorData = {
        id: document.getElementById('profesorId').value || generateId(),
        nombres: formData.get('nombres'),
        apellidos: formData.get('apellidos'),
        cedula: formData.get('cedula'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        genero: formData.get('genero'),
        estadoCivil: formData.get('estadoCivil'),
        nacionalidad: formData.get('nacionalidad') || 'Dominicana',
        telefono: formData.get('telefono'),
        celular: formData.get('celular'),
        email: formData.get('email'),
        direccion: formData.get('direccion'),
        especialidad: formData.get('especialidad'),
        nivelEducativo: formData.get('nivelEducativo'),
        tituloObtenido: formData.get('tituloObtenido'),
        institucionFormacion: formData.get('institucionFormacion'),
        anoGraduacion: formData.get('anoGraduacion') ? parseInt(formData.get('anoGraduacion')) : null,
        experienciaAnos: formData.get('experienciaAnos') ? parseInt(formData.get('experienciaAnos')) : null,
        fechaIngreso: formData.get('fechaIngreso'),
        tipoContrato: formData.get('tipoContrato'),
        estado: formData.get('estado'),
        salario: formData.get('salario') ? parseFloat(formData.get('salario')) : null,
        horarioTrabajo: formData.get('horarioTrabajo'),
        observaciones: formData.get('observaciones'),
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
    };
    
    const existingIndex = profesoresData.findIndex(p => p.id === profesorData.id);
    
    if (existingIndex >= 0) {
        profesoresData[existingIndex] = { ...profesoresData[existingIndex], ...profesorData };
        showAlert.success('¡Actualizado!', 'El profesor ha sido actualizado correctamente');
    } else {
        profesoresData.push(profesorData);
        showAlert.success('¡Registrado!', 'El profesor ha sido registrado correctamente');
    }
    
    // Guardar en localStorage
    localStorage.setItem('profesoresData', JSON.stringify(profesoresData));
    
    // Cerrar modal y actualizar tabla
    bootstrap.Modal.getInstance(document.getElementById('profesorModal')).hide();
    displayProfesores();
    updateProfesoresStats();
}

// Función para eliminar profesor
function deleteProfesor(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer'
    ).then((result) => {
        if (result.isConfirmed) {
            profesoresData = profesoresData.filter(p => p.id !== id);
            localStorage.setItem('profesoresData', JSON.stringify(profesoresData));
            displayProfesores();
            updateProfesoresStats();
            showAlert.success('¡Eliminado!', 'El profesor ha sido eliminado correctamente');
        }
    });
}

// Función para ver detalles de profesor
function viewProfesor(id) {
    const profesor = profesoresData.find(p => p.id === id);
    if (!profesor) return;
    
    const edad = profesor.fechaNacimiento ? calculateAge(profesor.fechaNacimiento) : 'No especificada';
    const experiencia = profesor.experienciaAnos ? `${profesor.experienciaAnos} años` : 'No especificada';
    
    const detalles = `
        <div class="row">
            <div class="col-md-6">
                <h6>Información Personal</h6>
                <p><strong>Nombre:</strong> ${profesor.nombres} ${profesor.apellidos}</p>
                <p><strong>Cédula:</strong> ${profesor.cedula}</p>
                <p><strong>Edad:</strong> ${edad}</p>
                <p><strong>Género:</strong> ${profesor.genero}</p>
                <p><strong>Estado Civil:</strong> ${profesor.estadoCivil || 'No especificado'}</p>
                <p><strong>Nacionalidad:</strong> ${profesor.nacionalidad}</p>
                
                <h6>Contacto</h6>
                <p><strong>Teléfono:</strong> ${profesor.telefono}</p>
                <p><strong>Celular:</strong> ${profesor.celular || 'No especificado'}</p>
                <p><strong>Email:</strong> ${profesor.email}</p>
                <p><strong>Dirección:</strong> ${profesor.direccion}</p>
            </div>
            <div class="col-md-6">
                <h6>Información Académica</h6>
                <p><strong>Especialidad:</strong> ${profesor.especialidad}</p>
                <p><strong>Nivel Educativo:</strong> ${profesor.nivelEducativo}</p>
                <p><strong>Título:</strong> ${profesor.tituloObtenido || 'No especificado'}</p>
                <p><strong>Institución:</strong> ${profesor.institucionFormacion || 'No especificada'}</p>
                <p><strong>Año Graduación:</strong> ${profesor.anoGraduacion || 'No especificado'}</p>
                <p><strong>Experiencia:</strong> ${experiencia}</p>
                
                <h6>Información Laboral</h6>
                <p><strong>Fecha Ingreso:</strong> ${formatDate(profesor.fechaIngreso)}</p>
                <p><strong>Tipo Contrato:</strong> ${profesor.tipoContrato || 'No especificado'}</p>
                <p><strong>Estado:</strong> ${profesor.estado}</p>
                <p><strong>Horario:</strong> ${profesor.horarioTrabajo || 'No especificado'}</p>
                ${profesor.salario ? `<p><strong>Salario:</strong> ${formatCurrency(profesor.salario)}</p>` : ''}
            </div>
        </div>
        ${profesor.observaciones ? `<p><strong>Observaciones:</strong> ${profesor.observaciones}</p>` : ''}
    `;
    
    Swal.fire({
        title: 'Detalles del Profesor',
        html: detalles,
        icon: 'info',
        width: '800px'
    });
}

// Función para actualizar estadísticas
function updateProfesoresStats() {
    const total = profesoresData.length;
    const activos = profesoresData.filter(p => p.estado === 'Activo').length;
    const enLicencia = profesoresData.filter(p => p.estado === 'Licencia').length;
    
    // Contar especialidades únicas
    const especialidades = new Set(profesoresData.map(p => p.especialidad).filter(e => e));
    
    document.getElementById('total-profesores').textContent = total;
    document.getElementById('profesores-activos').textContent = activos;
    document.getElementById('profesores-licencia').textContent = enLicencia;
    document.getElementById('especialidades-cubiertas').textContent = especialidades.size;
}

// Función para exportar profesores
function exportProfesores() {
    if (profesoresData.length === 0) {
        showAlert.warning('Sin datos', 'No hay profesores para exportar');
        return;
    }
    
    const dataToExport = profesoresData.map(profesor => ({
        Nombres: profesor.nombres,
        Apellidos: profesor.apellidos,
        Cédula: profesor.cedula,
        'Fecha Nacimiento': formatDateShort(profesor.fechaNacimiento),
        Género: profesor.genero,
        'Estado Civil': profesor.estadoCivil || '',
        Nacionalidad: profesor.nacionalidad,
        Teléfono: profesor.telefono,
        Celular: profesor.celular || '',
        Email: profesor.email,
        Dirección: profesor.direccion,
        Especialidad: profesor.especialidad,
        'Nivel Educativo': profesor.nivelEducativo,
        'Título Obtenido': profesor.tituloObtenido || '',
        'Institución Formación': profesor.institucionFormacion || '',
        'Año Graduación': profesor.anoGraduacion || '',
        'Años Experiencia': profesor.experienciaAnos || '',
        'Fecha Ingreso': formatDateShort(profesor.fechaIngreso),
        'Tipo Contrato': profesor.tipoContrato || '',
        Estado: profesor.estado,
        Salario: profesor.salario || '',
        'Horario Trabajo': profesor.horarioTrabajo || '',
        Observaciones: profesor.observaciones || ''
    }));
    
    exportToExcel('Profesores', dataToExport, 'profesores_' + new Date().toISOString().split('T')[0]);
}

// Función para refrescar datos
function refreshProfesores() {
    loadProfesoresData();
    updateProfesoresStats();
    showAlert.success('¡Actualizado!', 'Los datos han sido actualizados');
}

// Inicializar cuando se carga la sección
document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadProfesoresSection === 'function') {
        // La función está disponible pero no la ejecutamos automáticamente
        // Se ejecutará cuando el usuario navegue a la sección
    }
});
