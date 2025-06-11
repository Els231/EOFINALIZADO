/**
 * Módulo de gestión de estudiantes
 * Funcionalidades CRUD para estudiantes con sincronización automática
 */

let estudiantesData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Registrar módulo en el sistema de sincronización
window.registerModule('estudiantes', handleDataSync);

// Función de sincronización con otros módulos
function handleDataSync(changeData) {
    const { collection, action, data } = changeData;
    
    // Actualizar datos locales cuando hay cambios en estudiantes o datos relacionados
    if (collection === 'estudiantes' || collection === 'tutores' || collection === 'matriculas') {
        refreshEstudiantesData();
        if (typeof updateEstudiantesTable === 'function') {
            updateEstudiantesTable();
        }
        if (typeof updateEstudiantesStats === 'function') {
            updateEstudiantesStats();
        }
    }
}

// Función principal para cargar la sección de estudiantes
function loadEstudiantesSection() {
    const section = document.getElementById('estudiantes-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-user-graduate me-2"></i>
                    Gestión de Estudiantes
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showAddEstudianteModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Estudiante
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportEstudiantes()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshEstudiantes()">
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
                                    Total Estudiantes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-estudiantes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-user-graduate fa-2x text-primary"></i>
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
                                    Estudiantes Activos
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="estudiantes-activos">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-check-circle fa-2x text-success"></i>
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
                                    Nuevos Este Mes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="estudiantes-mes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-user-plus fa-2x text-warning"></i>
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
                                    Promedio de Edad
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="promedio-edad">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-birthday-cake fa-2x text-info"></i>
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
                    <label for="searchEstudiantes" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchEstudiantes" 
                           placeholder="Nombre, apellido o cédula..." 
                           oninput="filterEstudiantes()">
                </div>
                <div class="col-md-3">
                    <label for="filterGrado" class="form-label">Grado:</label>
                    <select class="form-select" id="filterGrado" onchange="filterEstudiantes()">
                        <option value="">Todos los grados</option>
                        <option value="1">Primer Grado</option>
                        <option value="2">Segundo Grado</option>
                        <option value="3">Tercer Grado</option>
                        <option value="4">Cuarto Grado</option>
                        <option value="5">Quinto Grado</option>
                        <option value="6">Sexto Grado</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filterEstado" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstado" onchange="filterEstudiantes()">
                        <option value="">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de estudiantes -->
        <div class="table-section">
            <div class="table-responsive">
                <table class="table table-striped" id="estudiantesTable">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nombre Completo</th>
                            <th>Cédula</th>
                            <th>Grado</th>
                            <th>Tutor</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="estudiantesTableBody">
                        <!-- Contenido dinámico -->
                    </tbody>
                </table>
            </div>
            
            <!-- Paginación -->
            <nav aria-label="Paginación de estudiantes">
                <ul class="pagination justify-content-center" id="estudiantesPagination">
                    <!-- Contenido dinámico -->
                </ul>
            </nav>
        </div>

        <!-- Modal para agregar/editar estudiante -->
        <div class="modal fade" id="estudianteModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="estudianteModalTitle">Nuevo Estudiante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="estudianteForm">
                            <input type="hidden" id="estudianteId">
                            
                            <!-- Datos personales -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="apellido" class="form-label">Apellido *</label>
                                        <input type="text" class="form-control" id="apellido" name="apellido" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="cedula" class="form-label">Cédula</label>
                                        <input type="text" class="form-control" id="cedula" name="cedula" 
                                               placeholder="000-0000000-0">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento *</label>
                                        <input type="date" class="form-control" id="fecha_nacimiento" name="fecha_nacimiento" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="genero" class="form-label">Género *</label>
                                        <select class="form-select" id="genero" name="genero" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información académica -->
                            <h6 class="mt-4 mb-3">Información Académica</h6>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="grado" class="form-label">Grado *</label>
                                        <select class="form-select" id="grado" name="grado" required>
                                            <option value="">Seleccionar...</option>
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
                                        <label for="turno_id" class="form-label">Turno *</label>
                                        <select class="form-select" id="turno_id" name="turno_id" required>
                                            <!-- Opciones cargadas dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estado" class="form-label">Estado *</label>
                                        <select class="form-select" id="estado" name="estado" required>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de contacto -->
                            <h6 class="mt-4 mb-3">Información de Contacto</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefono" class="form-label">Teléfono</label>
                                        <input type="tel" class="form-control" id="telefono" name="telefono" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="direccion" class="form-label">Dirección</label>
                                <textarea class="form-control" id="direccion" name="direccion" rows="2"></textarea>
                            </div>

                            <!-- Tutor -->
                            <h6 class="mt-4 mb-3">Información del Tutor</h6>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="tutor_id" class="form-label">Tutor Responsable</label>
                                        <select class="form-select" id="tutor_id" name="tutor_id">
                                            <option value="">Seleccionar tutor...</option>
                                            <!-- Opciones cargadas dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div class="mb-3">
                                <label for="observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEstudiante()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar datos y tabla
    refreshEstudiantesData();
    loadTurnosOptions();
    loadTutoresOptions();
    updateEstudiantesTable();
    updateEstudiantesStats();
}

// Refrescar datos de estudiantes desde la base de datos
function refreshEstudiantesData() {
    estudiantesData = window.db.read('estudiantes');
}

// Cargar opciones de turnos
function loadTurnosOptions() {
    const turnos = window.db.read('turnos').filter(t => t.activo);
    const select = document.getElementById('turno_id');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar turno...</option>';
        turnos.forEach(turno => {
            const option = document.createElement('option');
            option.value = turno.id;
            option.textContent = `${turno.nombre} (${turno.hora_inicio} - ${turno.hora_fin})`;
            select.appendChild(option);
        });
    }
}

// Cargar opciones de tutores
function loadTutoresOptions() {
    const tutores = window.db.read('tutores').filter(t => t.estado === 'Activo');
    const select = document.getElementById('tutor_id');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar tutor...</option>';
        tutores.forEach(tutor => {
            const option = document.createElement('option');
            option.value = tutor.id;
            option.textContent = `${tutor.nombre} ${tutor.apellido} - ${tutor.parentesco}`;
            select.appendChild(option);
        });
    }
}

// Actualizar estadísticas
function updateEstudiantesStats() {
    const stats = window.db.getStats('estudiantes');
    const edades = estudiantesData.map(e => calculateAge(e.fecha_nacimiento)).filter(edad => edad > 0);
    const promedioEdad = edades.length > 0 ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : 0;

    document.getElementById('total-estudiantes').textContent = stats.total;
    document.getElementById('estudiantes-activos').textContent = stats.active;
    document.getElementById('estudiantes-mes').textContent = stats.created_this_month;
    document.getElementById('promedio-edad').textContent = promedioEdad;

    // Actualizar estadísticas del módulo
    window.updateModuleStats('estudiantes', {
        ...stats,
        promedio_edad: promedioEdad
    });
}

// Actualizar tabla de estudiantes
function updateEstudiantesTable() {
    const tbody = document.getElementById('estudiantesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Aplicar filtros
    let filteredData = [...estudiantesData];
    
    const searchTerm = document.getElementById('searchEstudiantes')?.value.toLowerCase() || '';
    const gradoFilter = document.getElementById('filterGrado')?.value || '';
    const estadoFilter = document.getElementById('filterEstado')?.value || '';

    if (searchTerm) {
        filteredData = filteredData.filter(estudiante =>
            estudiante.nombre.toLowerCase().includes(searchTerm) ||
            estudiante.apellido.toLowerCase().includes(searchTerm) ||
            (estudiante.cedula && estudiante.cedula.includes(searchTerm))
        );
    }

    if (gradoFilter) {
        filteredData = filteredData.filter(estudiante => estudiante.grado === gradoFilter);
    }

    if (estadoFilter) {
        filteredData = filteredData.filter(estudiante => estudiante.estado === estadoFilter);
    }

    // Paginación
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Obtener datos relacionados
    const tutores = window.db.read('tutores');
    const turnos = window.db.read('turnos');

    // Generar filas de la tabla
    paginatedData.forEach(estudiante => {
        const tutor = tutores.find(t => t.id === estudiante.tutor_id);
        const turno = turnos.find(t => t.id === estudiante.turno_id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="avatar-circle">
                    ${estudiante.nombre.charAt(0)}${estudiante.apellido.charAt(0)}
                </div>
            </td>
            <td>
                <strong>${estudiante.nombre} ${estudiante.apellido}</strong><br>
                <small class="text-muted">Edad: ${calculateAge(estudiante.fecha_nacimiento)} años</small>
            </td>
            <td>${estudiante.cedula || 'N/A'}</td>
            <td>
                <span class="badge bg-primary">${getGradoName(estudiante.grado)}</span><br>
                <small class="text-muted">${turno ? turno.nombre : 'N/A'}</small>
            </td>
            <td>${tutor ? `${tutor.nombre} ${tutor.apellido}` : 'Sin asignar'}</td>
            <td>${estudiante.telefono || 'N/A'}</td>
            <td>
                <span class="badge ${estudiante.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">
                    ${estudiante.estado}
                </span>
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewEstudiante('${estudiante.id}')" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="editEstudiante('${estudiante.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteEstudiante('${estudiante.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Actualizar paginación
    updatePagination(totalPages, filteredData.length);
}

// Actualizar paginación
function updatePagination(totalPages, totalItems) {
    const pagination = document.getElementById('estudiantesPagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Botón anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePageEstudiantes(${currentPage - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="changePageEstudiantes(${i})">${i}</a>`;
            pagination.appendChild(li);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(li);
        }
    }

    // Botón siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePageEstudiantes(${currentPage + 1})">Siguiente</a>`;
    pagination.appendChild(nextLi);
}

// Cambiar página
function changePageEstudiantes(page) {
    const totalPages = Math.ceil(estudiantesData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateEstudiantesTable();
    }
}

// Mostrar modal para agregar estudiante
function showAddEstudianteModal() {
    document.getElementById('estudianteModalTitle').textContent = 'Nuevo Estudiante';
    document.getElementById('estudianteForm').reset();
    document.getElementById('estudianteId').value = '';
    document.getElementById('estado').value = 'Activo';
    
    const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
    modal.show();
}

// Editar estudiante
function editEstudiante(id) {
    const estudiante = estudiantesData.find(e => e.id === id);
    if (!estudiante) return;

    document.getElementById('estudianteModalTitle').textContent = 'Editar Estudiante';
    document.getElementById('estudianteId').value = estudiante.id;
    
    // Llenar formulario
    Object.keys(estudiante).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = estudiante[key] || '';
        }
    });

    const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
    modal.show();
}

// Guardar estudiante
function saveEstudiante() {
    const form = document.getElementById('estudianteForm');
    const formData = new FormData(form);
    const id = document.getElementById('estudianteId').value;

    // Validar campos requeridos
    if (!formData.get('nombre') || !formData.get('apellido') || !formData.get('fecha_nacimiento')) {
        alert('Por favor complete todos los campos requeridos.');
        return;
    }

    // Validar email si se proporciona
    const email = formData.get('email');
    if (email && !validateEmail(email)) {
        alert('Por favor ingrese un email válido.');
        return;
    }

    // Validar cédula si se proporciona
    const cedula = formData.get('cedula');
    if (cedula && !validateCedula(cedula)) {
        alert('Por favor ingrese una cédula válida (formato: 000-0000000-0).');
        return;
    }

    const estudianteData = {};
    for (let [key, value] of formData.entries()) {
        estudianteData[key] = value;
    }

    try {
        if (id) {
            // Actualizar estudiante existente
            window.db.update('estudiantes', id, estudianteData);
        } else {
            // Crear nuevo estudiante
            window.db.create('estudiantes', estudianteData);
        }

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('estudianteModal'));
        modal.hide();

        // Los datos se actualizarán automáticamente por sincronización
        
    } catch (error) {
        console.error('Error al guardar estudiante:', error);
        alert('Error al guardar el estudiante. Por favor intente nuevamente.');
    }
}

// Ver detalles del estudiante
function viewEstudiante(id) {
    const estudiante = estudiantesData.find(e => e.id === id);
    if (!estudiante) return;

    const tutores = window.db.read('tutores');
    const tutor = tutores.find(t => t.id === estudiante.tutor_id);
    const turnos = window.db.read('turnos');
    const turno = turnos.find(t => t.id === estudiante.turno_id);

    const modalContent = `
        <div class="modal fade" id="viewEstudianteModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Información del Estudiante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <div class="avatar-circle-large mx-auto mb-3">
                                    ${estudiante.nombre.charAt(0)}${estudiante.apellido.charAt(0)}
                                </div>
                                <h5>${estudiante.nombre} ${estudiante.apellido}</h5>
                                <span class="badge ${estudiante.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">
                                    ${estudiante.estado}
                                </span>
                            </div>
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <strong>Cédula:</strong><br>
                                        ${estudiante.cedula || 'N/A'}
                                    </div>
                                    <div class="col-sm-6">
                                        <strong>Fecha de Nacimiento:</strong><br>
                                        ${formatDate(estudiante.fecha_nacimiento)}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-sm-6">
                                        <strong>Edad:</strong><br>
                                        ${calculateAge(estudiante.fecha_nacimiento)} años
                                    </div>
                                    <div class="col-sm-6">
                                        <strong>Género:</strong><br>
                                        ${estudiante.genero}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-sm-6">
                                        <strong>Grado:</strong><br>
                                        ${getGradoName(estudiante.grado)}
                                    </div>
                                    <div class="col-sm-6">
                                        <strong>Turno:</strong><br>
                                        ${turno ? turno.nombre : 'N/A'}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-sm-6">
                                        <strong>Teléfono:</strong><br>
                                        ${estudiante.telefono || 'N/A'}
                                    </div>
                                    <div class="col-sm-6">
                                        <strong>Email:</strong><br>
                                        ${estudiante.email || 'N/A'}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <strong>Dirección:</strong><br>
                                        ${estudiante.direccion || 'N/A'}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <strong>Tutor:</strong><br>
                                        ${tutor ? `${tutor.nombre} ${tutor.apellido} (${tutor.parentesco})` : 'Sin asignar'}
                                    </div>
                                </div>
                                ${estudiante.observaciones ? `
                                <div class="row mt-2">
                                    <div class="col-12">
                                        <strong>Observaciones:</strong><br>
                                        ${estudiante.observaciones}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="editEstudiante('${estudiante.id}')" data-bs-dismiss="modal">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente si existe
    const existingModal = document.getElementById('viewEstudianteModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = new bootstrap.Modal(document.getElementById('viewEstudianteModal'));
    modal.show();
}

// Eliminar estudiante
function deleteEstudiante(id) {
    const estudiante = estudiantesData.find(e => e.id === id);
    if (!estudiante) return;

    // Verificar si el estudiante tiene registros relacionados
    if (!window.db.validateReferences('estudiantes', id)) {
        alert('No se puede eliminar este estudiante porque tiene registros relacionados (notas, matrículas, etc.).');
        return;
    }

    if (confirm(`¿Está seguro de que desea eliminar a ${estudiante.nombre} ${estudiante.apellido}?`)) {
        try {
            window.db.delete('estudiantes', id);
            // Los datos se actualizarán automáticamente por sincronización
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            alert('Error al eliminar el estudiante. Por favor intente nuevamente.');
        }
    }
}

// Filtrar estudiantes
function filterEstudiantes() {
    currentPage = 1;
    updateEstudiantesTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('searchEstudiantes').value = '';
    document.getElementById('filterGrado').value = '';
    document.getElementById('filterEstado').value = '';
    filterEstudiantes();
}

// Exportar estudiantes
function exportEstudiantes() {
    try {
        const data = estudiantesData.map(estudiante => {
            const tutores = window.db.read('tutores');
            const tutor = tutores.find(t => t.id === estudiante.tutor_id);
            
            return {
                'Nombre': estudiante.nombre,
                'Apellido': estudiante.apellido,
                'Cédula': estudiante.cedula || '',
                'Fecha de Nacimiento': estudiante.fecha_nacimiento,
                'Edad': calculateAge(estudiante.fecha_nacimiento),
                'Género': estudiante.genero,
                'Grado': getGradoName(estudiante.grado),
                'Estado': estudiante.estado,
                'Teléfono': estudiante.telefono || '',
                'Email': estudiante.email || '',
                'Dirección': estudiante.direccion || '',
                'Tutor': tutor ? `${tutor.nombre} ${tutor.apellido}` : '',
                'Observaciones': estudiante.observaciones || ''
            };
        });

        exportToExcel(data, 'estudiantes');
    } catch (error) {
        console.error('Error al exportar estudiantes:', error);
        alert('Error al exportar los datos.');
    }
}

// Refrescar datos
function refreshEstudiantes() {
    refreshEstudiantesData();
    updateEstudiantesTable();
    updateEstudiantesStats();
}

// Funciones auxiliares
function getGradoName(grado) {
    const grados = {
        '1': 'Primer Grado',
        '2': 'Segundo Grado',
        '3': 'Tercer Grado',
        '4': 'Cuarto Grado',
        '5': 'Quinto Grado',
        '6': 'Sexto Grado'
    };
    return grados[grado] || grado;
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateCedula(cedula) {
    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
    return cedulaRegex.test(cedula);
}

function exportToExcel(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}