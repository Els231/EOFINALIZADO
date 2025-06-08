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
                        <option value="Español">Español</option>
                        <option value="Ciencias">Ciencias</option>
                        <option value="Historia">Historia</option>
                        <option value="Inglés">Inglés</option>
                        <option value="Educación Física">Educación Física</option>
                        <option value="Arte">Arte</option>
                        <option value="Música">Música</option>
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
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="especialidad" class="form-label">Especialidad *</label>
                                        <select class="form-select" id="especialidad" name="especialidad" required>
                                            <option value="">Seleccionar especialidad</option>
                                            <option value="Matemáticas">Matemáticas</option>
                                            <option value="Español">Español</option>
                                            <option value="Ciencias">Ciencias</option>
                                            <option value="Historia">Historia</option>
                                            <option value="Inglés">Inglés</option>
                                            <option value="Educación Física">Educación Física</option>
                                            <option value="Arte">Arte</option>
                                            <option value="Música">Música</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nivelEducativo" class="form-label">Nivel Educativo *</label>
                                        <select class="form-select" id="nivelEducativo" name="nivelEducativo" required>
                                            <option value="">Seleccionar nivel</option>
                                            <option value="Bachiller">Bachiller</option>
                                            <option value="Técnico">Técnico</option>
                                            <option value="Licenciatura">Licenciatura</option>
                                            <option value="Maestría">Maestría</option>
                                            <option value="Doctorado">Doctorado</option>
                                        </select>
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
                                        <label for="estadoPr" class="form-label">Estado *</label>
                                        <select class="form-select" id="estadoPr" name="estado" required>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                            <option value="Licencia">En Licencia</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="fechaIngreso" class="form-label">Fecha de Ingreso *</label>
                                        <input type="date" class="form-control" id="fechaIngreso" name="fechaIngreso" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefonoPr" class="form-label">Teléfono *</label>
                                        <input type="tel" class="form-control" id="telefonoPr" name="telefono" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="emailPr" class="form-label">Email *</label>
                                        <input type="email" class="form-control" id="emailPr" name="email" required>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="direccionPr" class="form-label">Dirección</label>
                                <textarea class="form-control" id="direccionPr" name="direccion" rows="2"></textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="salario" class="form-label">Salario</label>
                                        <input type="number" class="form-control" id="salario" name="salario" 
                                               step="0.01" min="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="horasSemanales" class="form-label">Horas Semanales</label>
                                        <input type="number" class="form-control" id="horasSemanales" name="horasSemanales" 
                                               min="1" max="40">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="observacionesPr" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observacionesPr" name="observaciones" rows="3"></textarea>
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
    `;
    
    // Cargar datos
    loadProfesoresData();
}

// Función para cargar datos de profesores
function loadProfesoresData() {
    try {
        profesoresData = db.getProfesores();
        renderProfesoresTable();
    } catch (error) {
        console.error('Error al cargar profesores:', error);
        showAlert.error('Error', 'No se pudieron cargar los datos de profesores');
    }
}

// Función para renderizar la tabla de profesores
function renderProfesoresTable() {
    const container = document.getElementById('profesoresTableContainer');
    
    if (profesoresData.length === 0) {
        showEmptyState(container, 'No hay profesores registrados', 'fas fa-chalkboard-teacher');
        return;
    }
    
    // Aplicar filtros
    let filteredData = [...profesoresData];
    
    const searchTerm = document.getElementById('searchProfesores')?.value;
    const especialidadFilter = document.getElementById('filterEspecialidad')?.value;
    const estadoFilter = document.getElementById('filterEstadoProfesor')?.value;
    
    if (searchTerm) {
        filteredData = filterData(filteredData, searchTerm, ['nombres', 'apellidos', 'especialidad', 'cedula']);
    }
    
    if (especialidadFilter) {
        filteredData = filteredData.filter(p => p.especialidad === especialidadFilter);
    }
    
    if (estadoFilter) {
        filteredData = filteredData.filter(p => p.estado === estadoFilter);
    }
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentProfesoresPage, profesoresPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th onclick="sortProfesores('nombres')" style="cursor: pointer;">
                            Nombre <i class="fas fa-sort"></i>
                        </th>
                        <th onclick="sortProfesores('especialidad')" style="cursor: pointer;">
                            Especialidad <i class="fas fa-sort"></i>
                        </th>
                        <th>Nivel Educativo</th>
                        <th onclick="sortProfesores('estado')" style="cursor: pointer;">
                            Estado <i class="fas fa-sort"></i>
                        </th>
                        <th>Contacto</th>
                        <th>Fecha Ingreso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(profesor => {
        const estadoBadge = getEstadoBadge(profesor.estado);
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">
                            ${profesor.nombres.charAt(0)}${profesor.apellidos.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${profesor.nombres} ${profesor.apellidos}</div>
                            <small class="text-muted">${profesor.cedula}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${profesor.especialidad}</span>
                </td>
                <td>${profesor.nivelEducativo}</td>
                <td>${estadoBadge}</td>
                <td>
                    <div>
                        <small class="d-block"><i class="fas fa-phone me-1"></i>${profesor.telefono}</small>
                        <small class="text-muted"><i class="fas fa-envelope me-1"></i>${profesor.email}</small>
                    </div>
                </td>
                <td>${formatDateShort(profesor.fechaIngreso)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewProfesor(${profesor.id})" 
                                title="Ver Detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="editProfesor(${profesor.id})" 
                                title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteProfesor(${profesor.id})" 
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
    const paginationContainer = document.getElementById('profesoresPagination');
    paginationContainer.innerHTML = createPagination(
        paginatedData.totalPages, 
        currentProfesoresPage, 
        'changeProfesoresPage'
    );
}

// Función para obtener badge de estado
function getEstadoBadge(estado) {
    switch (estado) {
        case 'Activo':
            return '<span class="badge bg-success">Activo</span>';
        case 'Inactivo':
            return '<span class="badge bg-secondary">Inactivo</span>';
        case 'Licencia':
            return '<span class="badge bg-warning">En Licencia</span>';
        default:
            return '<span class="badge bg-secondary">Desconocido</span>';
    }
}

// Función para mostrar modal de nuevo profesor
function showAddProfesorModal() {
    document.getElementById('profesorModalTitle').innerHTML = 
        '<i class="fas fa-chalkboard-teacher me-2"></i>Nuevo Profesor';
    document.getElementById('profesorId').value = '';
    clearForm(document.getElementById('profesorForm'));
    
    // Establecer fecha actual como fecha de ingreso por defecto
    document.getElementById('fechaIngreso').value = new Date().toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    modal.show();
}

// Función para editar profesor
function editProfesor(id) {
    const profesor = db.getProfesorById(id);
    if (!profesor) {
        showAlert.error('Error', 'Profesor no encontrado');
        return;
    }
    
    document.getElementById('profesorModalTitle').innerHTML = 
        '<i class="fas fa-edit me-2"></i>Editar Profesor';
    
    // Llenar formulario
    document.getElementById('profesorId').value = profesor.id;
    document.getElementById('nombresPr').value = profesor.nombres || '';
    document.getElementById('apellidosPr').value = profesor.apellidos || '';
    document.getElementById('cedulaPr').value = profesor.cedula || '';
    document.getElementById('fechaNacimientoPr').value = profesor.fechaNacimiento || '';
    document.getElementById('especialidad').value = profesor.especialidad || '';
    document.getElementById('nivelEducativo').value = profesor.nivelEducativo || '';
    document.getElementById('generoPr').value = profesor.genero || '';
    document.getElementById('estadoPr').value = profesor.estado || 'Activo';
    document.getElementById('fechaIngreso').value = profesor.fechaIngreso || '';
    document.getElementById('telefonoPr').value = profesor.telefono || '';
    document.getElementById('emailPr').value = profesor.email || '';
    document.getElementById('direccionPr').value = profesor.direccion || '';
    document.getElementById('salario').value = profesor.salario || '';
    document.getElementById('horasSemanales').value = profesor.horasSemanales || '';
    document.getElementById('observacionesPr').value = profesor.observaciones || '';
    
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    modal.show();
}

// Función para ver detalles del profesor
function viewProfesor(id) {
    const profesor = db.getProfesorById(id);
    if (!profesor) {
        showAlert.error('Error', 'Profesor no encontrado');
        return;
    }
    
    const edad = calculateAge(profesor.fechaNacimiento);
    const yearsWorking = Math.floor((new Date() - new Date(profesor.fechaIngreso)) / (365.25 * 24 * 60 * 60 * 1000));
    
    Swal.fire({
        title: `${profesor.nombres} ${profesor.apellidos}`,
        html: `
            <div class="text-start">
                <p><strong>Cédula:</strong> ${profesor.cedula}</p>
                <p><strong>Edad:</strong> ${edad} años</p>
                <p><strong>Especialidad:</strong> ${profesor.especialidad}</p>
                <p><strong>Nivel Educativo:</strong> ${profesor.nivelEducativo}</p>
                <p><strong>Género:</strong> ${profesor.genero}</p>
                <p><strong>Estado:</strong> ${profesor.estado}</p>
                <p><strong>Teléfono:</strong> ${profesor.telefono}</p>
                <p><strong>Email:</strong> ${profesor.email}</p>
                <p><strong>Dirección:</strong> ${profesor.direccion || 'No registrada'}</p>
                <hr>
                <p><strong>Fecha de Ingreso:</strong> ${formatDate(profesor.fechaIngreso)}</p>
                <p><strong>Años en la institución:</strong> ${yearsWorking} años</p>
                <p><strong>Salario:</strong> ${profesor.salario ? formatCurrency(profesor.salario) : 'No especificado'}</p>
                <p><strong>Horas Semanales:</strong> ${profesor.horasSemanales || 'No especificado'}</p>
                <p><strong>Observaciones:</strong> ${profesor.observaciones || 'Ninguna'}</p>
                <p><strong>Fecha de Registro:</strong> ${formatDate(profesor.fechaRegistro)}</p>
            </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showConfirmButton: false,
        width: '600px'
    });
}

// Función para guardar profesor
function saveProfesor() {
    const form = document.getElementById('profesorForm');
    
    if (!validateForm(form)) {
        showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const profesorData = {};
    
    for (let [key, value] of formData.entries()) {
        profesorData[key] = value;
    }
    
    const profesorId = document.getElementById('profesorId').value;
    
    try {
        if (profesorId) {
            // Actualizar profesor existente
            db.updateProfesor(profesorId, profesorData);
            showAlert.success('¡Actualizado!', 'Profesor actualizado correctamente');
        } else {
            // Crear nuevo profesor
            db.insertProfesor(profesorData);
            showAlert.success('¡Guardado!', 'Profesor registrado correctamente');
        }
        
        // Cerrar modal y actualizar tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('profesorModal'));
        modal.hide();
        
        loadProfesoresData();
        
    } catch (error) {
        console.error('Error al guardar profesor:', error);
        showAlert.error('Error', 'No se pudo guardar el profesor');
    }
}

// Función para eliminar profesor
function deleteProfesor(id) {
    const profesor = db.getProfesorById(id);
    if (!profesor) {
        showAlert.error('Error', 'Profesor no encontrado');
        return;
    }
    
    showAlert.confirm(
        '¿Eliminar Profesor?',
        `¿Estás seguro de que deseas eliminar a ${profesor.nombres} ${profesor.apellidos}?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.deleteProfesor(id);
                showAlert.success('¡Eliminado!', 'Profesor eliminado correctamente');
                loadProfesoresData();
            } catch (error) {
                console.error('Error al eliminar profesor:', error);
                showAlert.error('Error', 'No se pudo eliminar el profesor');
            }
        }
    });
}

// Función para filtrar profesores
function filterProfesores() {
    currentProfesoresPage = 1;
    renderProfesoresTable();
}

// Función para limpiar filtros
function clearProfesoresFilters() {
    document.getElementById('searchProfesores').value = '';
    document.getElementById('filterEspecialidad').value = '';
    document.getElementById('filterEstadoProfesor').value = '';
    filterProfesores();
}

// Función para ordenar profesores
function sortProfesores(field) {
    profesoresData = sortData(profesoresData, field);
    renderProfesoresTable();
}

// Función para cambiar página
function changeProfesoresPage(page) {
    currentProfesoresPage = page;
    renderProfesoresTable();
}

// Función para exportar profesores
function exportProfesores() {
    if (profesoresData.length === 0) {
        showAlert.warning('Sin Datos', 'No hay profesores para exportar');
        return;
    }
    
    // Preparar datos para exportación
    const dataToExport = profesoresData.map(profesor => ({
        'Nombres': profesor.nombres,
        'Apellidos': profesor.apellidos,
        'Cédula': profesor.cedula,
        'Fecha de Nacimiento': formatDateShort(profesor.fechaNacimiento),
        'Edad': calculateAge(profesor.fechaNacimiento),
        'Especialidad': profesor.especialidad,
        'Nivel Educativo': profesor.nivelEducativo,
        'Género': profesor.genero,
        'Estado': profesor.estado,
        'Fecha de Ingreso': formatDateShort(profesor.fechaIngreso),
        'Teléfono': profesor.telefono,
        'Email': profesor.email,
        'Dirección': profesor.direccion || '',
        'Salario': profesor.salario || '',
        'Horas Semanales': profesor.horasSemanales || '',
        'Fecha de Registro': formatDateShort(profesor.fechaRegistro)
    }));
    
    exportToExcel('Lista de Profesores', dataToExport, 'profesores');
}

// Función para refrescar profesores
function refreshProfesores() {
    loadProfesoresData();
    showAlert.success('¡Actualizado!', 'Lista de profesores actualizada');
}

// Exponer funciones globalmente
window.loadProfesoresSection = loadProfesoresSection;
window.showAddProfesorModal = showAddProfesorModal;
window.editProfesor = editProfesor;
window.viewProfesor = viewProfesor;
window.saveProfesor = saveProfesor;
window.deleteProfesor = deleteProfesor;
window.filterProfesores = filterProfesores;
window.clearProfesoresFilters = clearProfesoresFilters;
window.sortProfesores = sortProfesores;
window.changeProfesoresPage = changeProfesoresPage;
window.exportProfesores = exportProfesores;
window.refreshProfesores = refreshProfesores;
