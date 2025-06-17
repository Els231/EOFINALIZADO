/**
 * Módulo de gestión de tutores/representantes
 * Sistema completo de CRUD para tutores con validaciones
 */

let currentTutoresPage = 1;
const tutoresPerPage = 10;
let tutoresFilters = {};
let tutoresSearchQuery = '';

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
                        <button type="button" class="btn btn-primary" onclick="showTutorModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Tutor
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportTutores()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
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
                        <input type="text" class="form-control" id="tutores-search" 
                               placeholder="Buscar por nombre, apellido o cédula..."
                               onkeyup="debounce(searchTutores, 300)()">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-parentesco" onchange="filterTutores()">
                        <option value="">Todos los parentescos</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-genero" onchange="filterTutores()">
                        <option value="">Todos los géneros</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-estado" onchange="filterTutores()">
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearTutoresFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar
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
                                <div class="h4 mb-0" id="total-tutores-activos">0</div>
                                <div class="small">Tutores Activos</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-users fa-2x"></i>
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
                                <div class="h4 mb-0" id="tutores-con-estudiantes">0</div>
                                <div class="small">Con Estudiantes</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-user-graduate fa-2x"></i>
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
                                <div class="h4 mb-0" id="padres-registrados">0</div>
                                <div class="small">Padres/Madres</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-heart fa-2x"></i>
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
                                <div class="h4 mb-0" id="tutores-legales">0</div>
                                <div class="small">Tutores Legales</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-gavel fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de tutores -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">
                    Lista de Tutores
                    <span class="badge bg-primary ms-2" id="tutores-count">0</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Cédula</th>
                                <th>Parentesco</th>
                                <th>Contacto</th>
                                <th>Ocupación</th>
                                <th>Estudiantes</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tutores-tbody">
                            <!-- Datos se cargan aquí -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de tutores">
                    <ul class="pagination justify-content-center" id="tutores-pagination">
                        <!-- Paginación se genera aquí -->
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal de tutor -->
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
                            <input type="hidden" id="tutor-id">
                            
                            <!-- Información personal -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-nombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="tutor-nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-apellido" class="form-label">Apellido *</label>
                                        <input type="text" class="form-control" id="tutor-apellido" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-cedula" class="form-label">Cédula *</label>
                                        <input type="text" class="form-control" id="tutor-cedula" 
                                               placeholder="000-0000000-0" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-parentesco" class="form-label">Parentesco *</label>
                                        <select class="form-select" id="tutor-parentesco" required>
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-genero" class="form-label">Género</label>
                                        <select class="form-select" id="tutor-genero">
                                            <option value="">Seleccionar...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-telefono" class="form-label">Teléfono *</label>
                                        <input type="tel" class="form-control" id="tutor-telefono" 
                                               placeholder="809-000-0000" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="tutor-email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="tutor-email">
                                    </div>
                                </div>
                            </div>

                            <!-- Información laboral -->
                            <h6 class="border-bottom pb-2 mb-3">Información Laboral</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-ocupacion" class="form-label">Ocupación</label>
                                        <select class="form-select" id="tutor-ocupacion">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-lugar-trabajo" class="form-label">Lugar de Trabajo</label>
                                        <input type="text" class="form-control" id="tutor-lugar-trabajo">
                                    </div>
                                </div>
                            </div>

                            <!-- Dirección -->
                            <h6 class="border-bottom pb-2 mb-3">Dirección</h6>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tutor-provincia" class="form-label">Provincia</label>
                                        <select class="form-select" id="tutor-provincia" onchange="loadMunicipios('tutor')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tutor-municipio" class="form-label">Municipio</label>
                                        <select class="form-select" id="tutor-municipio" onchange="loadSectores('tutor')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tutor-sector" class="form-label">Sector</label>
                                        <select class="form-select" id="tutor-sector">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="tutor-direccion" class="form-label">Dirección Completa *</label>
                                <textarea class="form-control" id="tutor-direccion" rows="2" required></textarea>
                            </div>

                            <!-- Estado y observaciones -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tutor-estado" class="form-label">Estado</label>
                                        <select class="form-select" id="tutor-estado">
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="tutor-observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="tutor-observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveTutor()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    loadTutoresData();
    loadParentescos();
    loadOcupaciones();
    loadProvincias('tutor');
    updateTutoresStats();
}

// Función para cargar datos de tutores
function loadTutoresData() {
    try {
        const allTutores = db.read('tutores');
        let filteredTutores = allTutores;

        // Aplicar búsqueda
        if (tutoresSearchQuery) {
            filteredTutores = filterByMultipleFields(
                filteredTutores, 
                tutoresSearchQuery, 
                ['nombre', 'apellido', 'cedula']
            );
        }

        // Aplicar filtros
        filteredTutores = applyFilters(filteredTutores, tutoresFilters);

        // Actualizar contador
        document.getElementById('tutores-count').textContent = filteredTutores.length;

        // Paginar resultados
        const paginatedData = paginate(filteredTutores, currentTutoresPage, tutoresPerPage);
        
        // Renderizar tabla
        renderTutoresTable(paginatedData.data);
        
        // Renderizar paginación
        renderTutoresPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando tutores:', error);
        showGlobalAlert('Error al cargar datos de tutores', 'error');
    }
}

// Función para renderizar tabla de tutores
function renderTutoresTable(tutores) {
    const tbody = document.getElementById('tutores-tbody');
    
    if (tutores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <h5>No hay tutores registrados</h5>
                        <p class="text-muted">Comience agregando un nuevo tutor</p>
                        <button type="button" class="btn btn-primary" onclick="showTutorModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Tutor
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const ocupaciones = db.read('ocupaciones');
    const estudiantes = db.read('estudiantes');
    
    tbody.innerHTML = tutores.map(tutor => {
        const ocupacion = ocupaciones.find(o => o.id === tutor.ocupacion_id);
        const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutor.id);
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-3" style="background-color: #28a745;">
                            ${tutor.nombre.charAt(0)}${tutor.apellido.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${tutor.nombre} ${tutor.apellido}</div>
                            <small class="text-muted">${tutor.email || 'Sin email'}</small>
                        </div>
                    </div>
                </td>
                <td>${tutor.cedula}</td>
                <td>
                    <span class="badge bg-info">${tutor.parentesco}</span>
                </td>
                <td>
                    <div>${tutor.telefono}</div>
                    <small class="text-muted">${tutor.email || 'Sin email'}</small>
                </td>
                <td>
                    ${ocupacion ? ocupacion.nombre : 'No especificada'}
                    ${tutor.lugar_trabajo ? `<br><small class="text-muted">${tutor.lugar_trabajo}</small>` : ''}
                </td>
                <td>
                    <span class="badge bg-success">${estudiantesAsignados.length} estudiante(s)</span>
                </td>
                <td>${getStatusBadge(tutor.estado || 'Activo')}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editTutor('${tutor.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewTutor('${tutor.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-warning" 
                                onclick="viewTutorEstudiantes('${tutor.id}')" title="Ver estudiantes">
                            <i class="fas fa-user-graduate"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteTutor('${tutor.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para renderizar paginación
function renderTutoresPagination(paginatedData) {
    const pagination = document.getElementById('tutores-pagination');
    
    if (paginatedData.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // Botón anterior
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasPrev ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeTutoresPage(${currentTutoresPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= paginatedData.totalPages; i++) {
        if (i === currentTutoresPage || 
            i === 1 || 
            i === paginatedData.totalPages || 
            (i >= currentTutoresPage - 1 && i <= currentTutoresPage + 1)) {
            
            paginationHtml += `
                <li class="page-item ${i === currentTutoresPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeTutoresPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentTutoresPage - 2 || i === currentTutoresPage + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botón siguiente
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasNext ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeTutoresPage(${currentTutoresPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHtml;
}

// Función para cargar parentescos
function loadParentescos() {
    const parentescos = dominicanData.getRelationshipTypes();
    const selectElements = [
        document.getElementById('tutor-parentesco'),
        document.getElementById('filter-parentesco')
    ];
    
    selectElements.forEach(select => {
        if (select) {
            const isFilter = select.id === 'filter-parentesco';
            if (!isFilter) {
                select.innerHTML = '<option value="">Seleccionar parentesco...</option>';
            }
            
            parentescos.forEach(parentesco => {
                const option = document.createElement('option');
                option.value = parentesco;
                option.textContent = parentesco;
                select.appendChild(option);
            });
        }
    });
}

// Función para cargar ocupaciones
function loadOcupaciones() {
    const ocupaciones = db.read('ocupaciones');
    const ocupacionSelect = document.getElementById('tutor-ocupacion');
    
    if (ocupacionSelect) {
        ocupacionSelect.innerHTML = '<option value="">Seleccionar ocupación...</option>';
        
        ocupaciones.forEach(ocupacion => {
            const option = document.createElement('option');
            option.value = ocupacion.id;
            option.textContent = ocupacion.nombre;
            ocupacionSelect.appendChild(option);
        });
    }
}

// Función para actualizar estadísticas de tutores
function updateTutoresStats() {
    try {
        const tutores = db.read('tutores');
        const estudiantes = db.read('estudiantes');
        const tutoresActivos = tutores.filter(t => t.estado === 'Activo');
        
        // Total tutores activos
        document.getElementById('total-tutores-activos').textContent = tutoresActivos.length;
        
        // Tutores con estudiantes
        const tutoresConEstudiantes = tutoresActivos.filter(tutor => {
            return estudiantes.some(e => e.tutor_id === tutor.id);
        });
        document.getElementById('tutores-con-estudiantes').textContent = tutoresConEstudiantes.length;
        
        // Padres/Madres
        const padresMadres = tutoresActivos.filter(t => 
            t.parentesco === 'Padre' || t.parentesco === 'Madre'
        );
        document.getElementById('padres-registrados').textContent = padresMadres.length;
        
        // Tutores legales
        const tutoresLegales = tutoresActivos.filter(t => t.parentesco === 'Tutor Legal');
        document.getElementById('tutores-legales').textContent = tutoresLegales.length;
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

// Función para mostrar modal de tutor
function showTutorModal(tutorId = null) {
    const modal = new bootstrap.Modal(document.getElementById('tutorModal'));
    const title = document.getElementById('tutorModalTitle');
    const form = document.getElementById('tutorForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('tutor-id').value = '';
    
    if (tutorId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-users me-2"></i>Editar Tutor';
        const tutor = db.find('tutores', tutorId);
        
        if (tutor) {
            document.getElementById('tutor-id').value = tutor.id;
            document.getElementById('tutor-nombre').value = tutor.nombre || '';
            document.getElementById('tutor-apellido').value = tutor.apellido || '';
            document.getElementById('tutor-cedula').value = tutor.cedula || '';
            document.getElementById('tutor-parentesco').value = tutor.parentesco || '';
            document.getElementById('tutor-genero').value = tutor.genero || '';
            document.getElementById('tutor-telefono').value = tutor.telefono || '';
            document.getElementById('tutor-email').value = tutor.email || '';
            document.getElementById('tutor-ocupacion').value = tutor.ocupacion_id || '';
            document.getElementById('tutor-lugar-trabajo').value = tutor.lugar_trabajo || '';
            document.getElementById('tutor-provincia').value = tutor.provincia || '';
            
            // Cargar municipios y sectores si hay provincia
            if (tutor.provincia) {
                loadMunicipios('tutor');
                setTimeout(() => {
                    document.getElementById('tutor-municipio').value = tutor.municipio || '';
                    if (tutor.municipio) {
                        loadSectores('tutor');
                        setTimeout(() => {
                            document.getElementById('tutor-sector').value = tutor.sector || '';
                        }, 100);
                    }
                }, 100);
            }
            
            document.getElementById('tutor-direccion').value = tutor.direccion || '';
            document.getElementById('tutor-estado').value = tutor.estado || 'Activo';
            document.getElementById('tutor-observaciones').value = tutor.observaciones || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-users me-2"></i>Nuevo Tutor';
        document.getElementById('tutor-estado').value = 'Activo';
    }
    
    modal.show();
}

// Función para guardar tutor
function saveTutor() {
    try {
        const form = document.getElementById('tutorForm');
        
        const tutorData = {
            nombre: document.getElementById('tutor-nombre').value.trim(),
            apellido: document.getElementById('tutor-apellido').value.trim(),
            cedula: document.getElementById('tutor-cedula').value.trim(),
            parentesco: document.getElementById('tutor-parentesco').value,
            genero: document.getElementById('tutor-genero').value,
            telefono: document.getElementById('tutor-telefono').value.trim(),
            email: document.getElementById('tutor-email').value.trim(),
            ocupacion_id: document.getElementById('tutor-ocupacion').value,
            lugar_trabajo: document.getElementById('tutor-lugar-trabajo').value.trim(),
            provincia: document.getElementById('tutor-provincia').value,
            municipio: document.getElementById('tutor-municipio').value,
            sector: document.getElementById('tutor-sector').value,
            direccion: document.getElementById('tutor-direccion').value.trim(),
            estado: document.getElementById('tutor-estado').value,
            observaciones: document.getElementById('tutor-observaciones').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            nombre: { required: true, label: 'Nombre' },
            apellido: { required: true, label: 'Apellido' },
            cedula: { required: true, type: 'cedula', label: 'Cédula' },
            parentesco: { required: true, label: 'Parentesco' },
            telefono: { required: true, type: 'phone', label: 'Teléfono' },
            direccion: { required: true, label: 'Dirección' }
        };
        
        if (tutorData.email) {
            validationRules.email = { type: 'email', label: 'Email' };
        }
        
        const errors = validateFormData(tutorData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Formatear datos
        tutorData.telefono = formatPhoneNumber(tutorData.telefono);
        tutorData.cedula = formatCedula(tutorData.cedula);
        
        const tutorId = document.getElementById('tutor-id').value;
        
        if (tutorId) {
            // Actualizar tutor existente
            db.update('tutores', tutorId, tutorData);
            showGlobalAlert('Tutor actualizado correctamente', 'success');
        } else {
            // Crear nuevo tutor
            db.create('tutores', tutorData);
            showGlobalAlert('Tutor creado correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('tutorModal'));
        modal.hide();
        loadTutoresData();
        updateTutoresStats();
        
    } catch (error) {
        console.error('Error guardando tutor:', error);
        showGlobalAlert('Error al guardar tutor: ' + error.message, 'error');
    }
}

// Función para editar tutor
function editTutor(tutorId) {
    showTutorModal(tutorId);
}

// Función para ver detalles de tutor
function viewTutor(tutorId) {
    const tutor = db.find('tutores', tutorId);
    if (!tutor) {
        showGlobalAlert('Tutor no encontrado', 'error');
        return;
    }
    
    const ocupaciones = db.read('ocupaciones');
    const estudiantes = db.read('estudiantes');
    const ocupacion = ocupaciones.find(o => o.id === tutor.ocupacion_id);
    const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutor.id);
    
    Swal.fire({
        title: `${tutor.nombre} ${tutor.apellido}`,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Cédula:</strong></div>
                    <div class="col-6">${tutor.cedula}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Parentesco:</strong></div>
                    <div class="col-6">${tutor.parentesco}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Género:</strong></div>
                    <div class="col-6">${tutor.genero || 'No especificado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Teléfono:</strong></div>
                    <div class="col-6">${tutor.telefono}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Email:</strong></div>
                    <div class="col-6">${tutor.email || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Ocupación:</strong></div>
                    <div class="col-6">${ocupacion ? ocupacion.nombre : 'No especificada'}</div>
                </div>
                ${tutor.lugar_trabajo ? `
                    <div class="row">
                        <div class="col-6"><strong>Lugar de Trabajo:</strong></div>
                        <div class="col-6">${tutor.lugar_trabajo}</div>
                    </div>
                ` : ''}
                <div class="row">
                    <div class="col-6"><strong>Dirección:</strong></div>
                    <div class="col-6">${tutor.direccion}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estado:</strong></div>
                    <div class="col-6">${getStatusBadge(tutor.estado)}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estudiantes:</strong></div>
                    <div class="col-6">${estudiantesAsignados.length} asignado(s)</div>
                </div>
                ${tutor.observaciones ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Observaciones:</strong></div>
                        <div class="col-12">${tutor.observaciones}</div>
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
            editTutor(tutorId);
        }
    });
}

// Función para ver estudiantes de un tutor
function viewTutorEstudiantes(tutorId) {
    const tutor = db.find('tutores', tutorId);
    const estudiantes = db.read('estudiantes');
    const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutorId);
    
    if (!tutor) {
        showGlobalAlert('Tutor no encontrado', 'error');
        return;
    }
    
    let estudiantesHtml = '';
    if (estudiantesAsignados.length > 0) {
        estudiantesHtml = estudiantesAsignados.map(estudiante => 
            `<div class="mb-2">
                <span class="badge bg-primary">${estudiante.nombre} ${estudiante.apellido}</span>
                <small class="text-muted ms-2">${estudiante.grado}° Grado</small>
            </div>`
        ).join('');
    } else {
        estudiantesHtml = '<p class="text-muted">No hay estudiantes asignados a este tutor.</p>';
    }
    
    Swal.fire({
        title: `Estudiantes de ${tutor.nombre} ${tutor.apellido}`,
        html: `
            <div class="text-start">
                <p><strong>Parentesco:</strong> ${tutor.parentesco}</p>
                <hr>
                <h6>Estudiantes Asignados (${estudiantesAsignados.length}):</h6>
                ${estudiantesHtml}
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    });
}

// Función para eliminar tutor
function deleteTutor(tutorId) {
    const tutor = db.find('tutores', tutorId);
    if (!tutor) {
        showGlobalAlert('Tutor no encontrado', 'error');
        return;
    }
    
    // Verificar si tiene estudiantes asignados
    const estudiantes = db.read('estudiantes');
    const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutorId);
    
    if (estudiantesAsignados.length > 0) {
        showGlobalAlert(
            `No se puede eliminar el tutor porque tiene ${estudiantesAsignados.length} estudiante(s) asignado(s). Primero debe reasignar o eliminar los estudiantes.`,
            'warning'
        );
        return;
    }
    
    confirmAction(
        '¿Eliminar tutor?',
        `¿Está seguro de eliminar a ${tutor.nombre} ${tutor.apellido}? Esta acción no se puede deshacer.`,
        'Sí, eliminar'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('tutores', tutorId);
                showGlobalAlert('Tutor eliminado correctamente', 'success');
                loadTutoresData();
                updateTutoresStats();
            } catch (error) {
                console.error('Error eliminando tutor:', error);
                showGlobalAlert('Error al eliminar tutor', 'error');
            }
        }
    });
}

// Función de búsqueda
function searchTutores() {
    tutoresSearchQuery = document.getElementById('tutores-search').value.trim();
    currentTutoresPage = 1;
    loadTutoresData();
}

// Función para filtrar tutores
function filterTutores() {
    tutoresFilters = {
        parentesco: document.getElementById('filter-parentesco').value,
        genero: document.getElementById('filter-genero').value,
        estado: document.getElementById('filter-estado').value
    };
    
    // Remover filtros vacíos
    Object.keys(tutoresFilters).forEach(key => {
        if (!tutoresFilters[key]) {
            delete tutoresFilters[key];
        }
    });
    
    currentTutoresPage = 1;
    loadTutoresData();
}

// Función para limpiar filtros
function clearTutoresFilters() {
    document.getElementById('tutores-search').value = '';
    document.getElementById('filter-parentesco').value = '';
    document.getElementById('filter-genero').value = '';
    document.getElementById('filter-estado').value = '';
    
    tutoresSearchQuery = '';
    tutoresFilters = {};
    currentTutoresPage = 1;
    loadTutoresData();
}

// Función para cambiar página
function changeTutoresPage(page) {
    currentTutoresPage = page;
    loadTutoresData();
}

// Función para exportar tutores
function exportTutores() {
    try {
        const tutores = db.read('tutores');
        const ocupaciones = db.read('ocupaciones');
        const estudiantes = db.read('estudiantes');
        
        const exportData = tutores.map(tutor => {
            const ocupacion = ocupaciones.find(o => o.id === tutor.ocupacion_id);
            const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutor.id);
            
            return {
                'Nombre': tutor.nombre,
                'Apellido': tutor.apellido,
                'Cédula': tutor.cedula,
                'Parentesco': tutor.parentesco,
                'Género': tutor.genero || '',
                'Teléfono': tutor.telefono,
                'Email': tutor.email || '',
                'Ocupación': ocupacion ? ocupacion.nombre : '',
                'Lugar de Trabajo': tutor.lugar_trabajo || '',
                'Provincia': tutor.provincia || '',
                'Municipio': tutor.municipio || '',
                'Sector': tutor.sector || '',
                'Dirección': tutor.direccion,
                'Estado': tutor.estado,
                'Estudiantes Asignados': estudiantesAsignados.length,
                'Nombres de Estudiantes': estudiantesAsignados.map(e => `${e.nombre} ${e.apellido}`).join(', '),
                'Observaciones': tutor.observaciones || '',
                'Fecha de Registro': formatDateShort(tutor.created_at)
            };
        });
        
        exportToExcel(exportData, 'tutores', 'Lista de Tutores');
        
    } catch (error) {
        console.error('Error exportando tutores:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Exportar funciones
window.loadTutoresSection = loadTutoresSection;
window.showTutorModal = showTutorModal;
window.saveTutor = saveTutor;
window.editTutor = editTutor;
window.viewTutor = viewTutor;
window.viewTutorEstudiantes = viewTutorEstudiantes;
window.deleteTutor = deleteTutor;
window.searchTutores = searchTutores;
window.filterTutores = filterTutores;
window.clearTutoresFilters = clearTutoresFilters;
window.changeTutoresPage = changeTutoresPage;
window.exportTutores = exportTutores;

console.log('✅ Tutores.js cargado correctamente');
