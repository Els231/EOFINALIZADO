/**
 * Módulo de gestión de estudiantes
 * Funcionalidades CRUD para estudiantes
 */

let estudiantesData = [];
let currentPage = 1;
const itemsPerPage = 10;

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
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Lista de Estudiantes</h6>
            </div>
            <div class="card-body">
                <div id="estudiantesTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="estudiantesPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar estudiante -->
        <div class="modal fade" id="estudianteModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="estudianteModalTitle">
                            <i class="fas fa-user-graduate me-2"></i>
                            Nuevo Estudiante
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="estudianteForm">
                            <input type="hidden" id="estudianteId">
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombres" class="form-label">Nombres *</label>
                                        <input type="text" class="form-control" id="nombres" name="nombres" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="apellidos" class="form-label">Apellidos *</label>
                                        <input type="text" class="form-control" id="apellidos" name="apellidos" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="cedula" class="form-label">Cédula</label>
                                        <input type="text" class="form-control" id="cedula" name="cedula" 
                                               placeholder="000-0000000-0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento *</label>
                                        <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="grado" class="form-label">Grado *</label>
                                        <select class="form-select" id="grado" name="grado" required>
                                            <option value="">Seleccionar grado</option>
                                            <option value="1">Primer Grado</option>
                                            <option value="2">Segundo Grado</option>
                                            <option value="3">Tercer Grado</option>
                                            <option value="4">Cuarto Grado</option>
                                            <option value="5">Quinto Grado</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="genero" class="form-label">Género *</label>
                                        <select class="form-select" id="genero" name="genero" required>
                                            <option value="">Seleccionar género</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
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

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefono" class="form-label">Teléfono</label>
                                        <input type="tel" class="form-control" id="telefono" name="telefono">
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

                            <h6 class="mt-4 mb-3">Información del Tutor/Acudiente</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nombreTutor" class="form-label">Nombre del Tutor</label>
                                        <input type="text" class="form-control" id="nombreTutor" name="nombreTutor">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoTutor" class="form-label">Teléfono del Tutor</label>
                                        <input type="tel" class="form-control" id="telefonoTutor" name="telefonoTutor">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEstudiante()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    loadEstudiantesData();
}

// Función para cargar datos de estudiantes
function loadEstudiantesData() {
    try {
        estudiantesData = db.getEstudiantes();
        renderEstudiantesTable();
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        showAlert.error('Error', 'No se pudieron cargar los datos de estudiantes');
    }
}

// Función para renderizar la tabla de estudiantes
function renderEstudiantesTable() {
    const container = document.getElementById('estudiantesTableContainer');
    
    if (estudiantesData.length === 0) {
        showEmptyState(container, 'No hay estudiantes registrados', 'fas fa-user-graduate');
        return;
    }
    
    // Aplicar filtros
    let filteredData = [...estudiantesData];
    
    const searchTerm = document.getElementById('searchEstudiantes')?.value;
    const gradoFilter = document.getElementById('filterGrado')?.value;
    const estadoFilter = document.getElementById('filterEstado')?.value;
    
    if (searchTerm) {
        filteredData = filterData(filteredData, searchTerm, ['nombres', 'apellidos', 'cedula']);
    }
    
    if (gradoFilter) {
        filteredData = filteredData.filter(e => e.grado == gradoFilter);
    }
    
    if (estadoFilter) {
        filteredData = filteredData.filter(e => e.estado === estadoFilter);
    }
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentPage, itemsPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th onclick="sortEstudiantes('nombres')" style="cursor: pointer;">
                            Nombre <i class="fas fa-sort"></i>
                        </th>
                        <th onclick="sortEstudiantes('grado')" style="cursor: pointer;">
                            Grado <i class="fas fa-sort"></i>
                        </th>
                        <th>Edad</th>
                        <th>Género</th>
                        <th onclick="sortEstudiantes('estado')" style="cursor: pointer;">
                            Estado <i class="fas fa-sort"></i>
                        </th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(estudiante => {
        const edad = calculateAge(estudiante.fechaNacimiento);
        const gradoText = getGradoText(estudiante.grado);
        const estadoBadge = estudiante.estado === 'Activo' 
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Inactivo</span>';
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">
                            ${estudiante.nombres.charAt(0)}${estudiante.apellidos.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${estudiante.nombres} ${estudiante.apellidos}</div>
                            <small class="text-muted">${estudiante.cedula || 'Sin cédula'}</small>
                        </div>
                    </div>
                </td>
                <td>${gradoText}</td>
                <td>${edad} años</td>
                <td>${estudiante.genero}</td>
                <td>${estadoBadge}</td>
                <td>${estudiante.telefono || 'N/A'}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewEstudiante(${estudiante.id})" 
                                title="Ver Detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="editEstudiante(${estudiante.id})" 
                                title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteEstudiante(${estudiante.id})" 
                                title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table></div>';
    container.innerHTML = tableHTML;
    
    // Crear paginación
    const paginationContainer = document.getElementById('estudiantesPagination');
    paginationContainer.innerHTML = createPagination(
        paginatedData.totalPages, 
        currentPage, 
        'changeEstudiantesPage'
    );
}

// Función para obtener texto del grado
function getGradoText(grado) {
    const grados = {
        1: 'Primer Grado',
        2: 'Segundo Grado',
        3: 'Tercer Grado',
        4: 'Cuarto Grado',
        5: 'Quinto Grado'
    };
    return grados[grado] || 'Sin asignar';
}

// Función para mostrar modal de nuevo estudiante
function showAddEstudianteModal() {
    document.getElementById('estudianteModalTitle').innerHTML = 
        '<i class="fas fa-user-graduate me-2"></i>Nuevo Estudiante';
    document.getElementById('estudianteId').value = '';
    clearForm(document.getElementById('estudianteForm'));
    
    const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
    modal.show();
}

// Función para editar estudiante
function editEstudiante(id) {
    const estudiante = db.getEstudianteById(id);
    if (!estudiante) {
        showAlert.error('Error', 'Estudiante no encontrado');
        return;
    }
    
    document.getElementById('estudianteModalTitle').innerHTML = 
        '<i class="fas fa-edit me-2"></i>Editar Estudiante';
    
    // Llenar formulario
    document.getElementById('estudianteId').value = estudiante.id;
    document.getElementById('nombres').value = estudiante.nombres || '';
    document.getElementById('apellidos').value = estudiante.apellidos || '';
    document.getElementById('cedula').value = estudiante.cedula || '';
    document.getElementById('fechaNacimiento').value = estudiante.fechaNacimiento || '';
    document.getElementById('grado').value = estudiante.grado || '';
    document.getElementById('genero').value = estudiante.genero || '';
    document.getElementById('estado').value = estudiante.estado || 'Activo';
    document.getElementById('telefono').value = estudiante.telefono || '';
    document.getElementById('email').value = estudiante.email || '';
    document.getElementById('direccion').value = estudiante.direccion || '';
    document.getElementById('nombreTutor').value = estudiante.nombreTutor || '';
    document.getElementById('telefonoTutor').value = estudiante.telefonoTutor || '';
    document.getElementById('observaciones').value = estudiante.observaciones || '';
    
    const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
    modal.show();
}

// Función para ver detalles del estudiante
function viewEstudiante(id) {
    const estudiante = db.getEstudianteById(id);
    if (!estudiante) {
        showAlert.error('Error', 'Estudiante no encontrado');
        return;
    }
    
    const edad = calculateAge(estudiante.fechaNacimiento);
    const gradoText = getGradoText(estudiante.grado);
    
    Swal.fire({
        title: `${estudiante.nombres} ${estudiante.apellidos}`,
        html: `
            <div class="text-start">
                <p><strong>Cédula:</strong> ${estudiante.cedula || 'No registrada'}</p>
                <p><strong>Edad:</strong> ${edad} años</p>
                <p><strong>Grado:</strong> ${gradoText}</p>
                <p><strong>Género:</strong> ${estudiante.genero}</p>
                <p><strong>Estado:</strong> ${estudiante.estado}</p>
                <p><strong>Teléfono:</strong> ${estudiante.telefono || 'No registrado'}</p>
                <p><strong>Email:</strong> ${estudiante.email || 'No registrado'}</p>
                <p><strong>Dirección:</strong> ${estudiante.direccion || 'No registrada'}</p>
                <hr>
                <p><strong>Tutor:</strong> ${estudiante.nombreTutor || 'No registrado'}</p>
                <p><strong>Teléfono del Tutor:</strong> ${estudiante.telefonoTutor || 'No registrado'}</p>
                <p><strong>Observaciones:</strong> ${estudiante.observaciones || 'Ninguna'}</p>
                <p><strong>Fecha de Registro:</strong> ${formatDate(estudiante.fechaRegistro)}</p>
            </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showConfirmButton: false,
        width: '600px'
    });
}

// Función para guardar estudiante
function saveEstudiante() {
    const form = document.getElementById('estudianteForm');
    
    if (!validateForm(form)) {
        showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const estudianteData = {};
    
    for (let [key, value] of formData.entries()) {
        estudianteData[key] = value;
    }
    
    const estudianteId = document.getElementById('estudianteId').value;
    
    try {
        if (estudianteId) {
            // Actualizar estudiante existente
            db.updateEstudiante(estudianteId, estudianteData);
            showAlert.success('¡Actualizado!', 'Estudiante actualizado correctamente');
        } else {
            // Crear nuevo estudiante
            db.insertEstudiante(estudianteData);
            showAlert.success('¡Guardado!', 'Estudiante registrado correctamente');
        }
        
        // Cerrar modal y actualizar tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('estudianteModal'));
        modal.hide();
        
        loadEstudiantesData();
        
    } catch (error) {
        console.error('Error al guardar estudiante:', error);
        showAlert.error('Error', 'No se pudo guardar el estudiante');
    }
}

// Función para eliminar estudiante
function deleteEstudiante(id) {
    const estudiante = db.getEstudianteById(id);
    if (!estudiante) {
        showAlert.error('Error', 'Estudiante no encontrado');
        return;
    }
    
    showAlert.confirm(
        '¿Eliminar Estudiante?',
        `¿Estás seguro de que deseas eliminar a ${estudiante.nombres} ${estudiante.apellidos}?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.deleteEstudiante(id);
                showAlert.success('¡Eliminado!', 'Estudiante eliminado correctamente');
                loadEstudiantesData();
            } catch (error) {
                console.error('Error al eliminar estudiante:', error);
                showAlert.error('Error', 'No se pudo eliminar el estudiante');
            }
        }
    });
}

// Función para filtrar estudiantes
function filterEstudiantes() {
    currentPage = 1;
    renderEstudiantesTable();
}

// Función para limpiar filtros
function clearFilters() {
    document.getElementById('searchEstudiantes').value = '';
    document.getElementById('filterGrado').value = '';
    document.getElementById('filterEstado').value = '';
    filterEstudiantes();
}

// Función para ordenar estudiantes
function sortEstudiantes(field) {
    estudiantesData = sortData(estudiantesData, field);
    renderEstudiantesTable();
}

// Función para cambiar página
function changeEstudiantesPage(page) {
    currentPage = page;
    renderEstudiantesTable();
}

// Función para exportar estudiantes
function exportEstudiantes() {
    if (estudiantesData.length === 0) {
        showAlert.warning('Sin Datos', 'No hay estudiantes para exportar');
        return;
    }
    
    // Preparar datos para exportación
    const dataToExport = estudiantesData.map(estudiante => ({
        'Nombres': estudiante.nombres,
        'Apellidos': estudiante.apellidos,
        'Cédula': estudiante.cedula || '',
        'Fecha de Nacimiento': formatDateShort(estudiante.fechaNacimiento),
        'Edad': calculateAge(estudiante.fechaNacimiento),
        'Grado': getGradoText(estudiante.grado),
        'Género': estudiante.genero,
        'Estado': estudiante.estado,
        'Teléfono': estudiante.telefono || '',
        'Email': estudiante.email || '',
        'Dirección': estudiante.direccion || '',
        'Tutor': estudiante.nombreTutor || '',
        'Teléfono Tutor': estudiante.telefonoTutor || '',
        'Fecha de Registro': formatDateShort(estudiante.fechaRegistro)
    }));
    
    exportToExcel('Lista de Estudiantes', dataToExport, 'estudiantes');
}

// Función para refrescar estudiantes
function refreshEstudiantes() {
    loadEstudiantesData();
    showAlert.success('¡Actualizado!', 'Lista de estudiantes actualizada');
}

// Exponer funciones globalmente
window.loadEstudiantesSection = loadEstudiantesSection;
window.showAddEstudianteModal = showAddEstudianteModal;
window.editEstudiante = editEstudiante;
window.viewEstudiante = viewEstudiante;
window.saveEstudiante = saveEstudiante;
window.deleteEstudiante = deleteEstudiante;
window.filterEstudiantes = filterEstudiantes;
window.clearFilters = clearFilters;
window.sortEstudiantes = sortEstudiantes;
window.changeEstudiantesPage = changeEstudiantesPage;
window.exportEstudiantes = exportEstudiantes;
window.refreshEstudiantes = refreshEstudiantes;
