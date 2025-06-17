/**
 * Módulo de gestión de estudiantes
 * Sistema completo de CRUD para estudiantes con validaciones
 */

let currentEstudiantesPage = 1;
const estudiantesPerPage = 10;
let estudiantesFilters = {};
let estudiantesSearchQuery = '';

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
                        <button type="button" class="btn btn-primary" onclick="showEstudianteModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Estudiante
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportEstudiantes()">
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
                        <input type="text" class="form-control" id="estudiantes-search" 
                               placeholder="Buscar por nombre, apellido o código estudiantil..."
                               onkeyup="debounce(searchEstudiantes, 300)()">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-grado" onchange="filterEstudiantes()">
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
                    <select class="form-select" id="filter-turno" onchange="filterEstudiantes()">
                        <option value="">Todos los turnos</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-estado" onchange="filterEstudiantes()">
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearEstudiantesFilters()">
                        <i class="fas fa-times me-1"></i> Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de estudiantes -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">
                    Lista de Estudiantes
                    <span class="badge bg-primary ms-2" id="estudiantes-count">0</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Código Estudiantil</th>
                                <th>Edad</th>
                                <th>Grado</th>
                                <th>Turno</th>
                                <th>Tutor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="estudiantes-tbody">
                            <!-- Datos se cargan aquí -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de estudiantes">
                    <ul class="pagination justify-content-center" id="estudiantes-pagination">
                        <!-- Paginación se genera aquí -->
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal de estudiante -->
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
                            <input type="hidden" id="estudiante-id">
                            
                            <!-- Información personal -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-nombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="estudiante-nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-apellido" class="form-label">Apellido *</label>
                                        <input type="text" class="form-control" id="estudiante-apellido" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-codigo" class="form-label">Código Estudiantil</label>
                                        <input type="text" class="form-control" id="estudiante-codigo" 
                                               placeholder="Ej: EST-2023-001">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-fecha-nacimiento" class="form-label">Fecha de Nacimiento *</label>
                                        <input type="date" class="form-control" id="estudiante-fecha-nacimiento" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estudiante-genero" class="form-label">Género *</label>
                                        <select class="form-select" id="estudiante-genero" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estudiante-grado" class="form-label">Grado *</label>
                                        <select class="form-select" id="estudiante-grado" required>
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
                                        <label for="estudiante-turno" class="form-label">Turno *</label>
                                        <select class="form-select" id="estudiante-turno" required>
                                            <!-- Se llena dinámicamente -->
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de contacto -->
                            <h6 class="border-bottom pb-2 mb-3">Información de Contacto</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-telefono" class="form-label">Teléfono</label>
                                        <input type="tel" class="form-control" id="estudiante-telefono" 
                                               placeholder="809-000-0000">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="estudiante-email">
                                    </div>
                                </div>
                            </div>

                            <!-- Dirección -->
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estudiante-departamento" class="form-label">Departamento</label>
                                        <select class="form-select" id="estudiante-departamento" onchange="loadMunicipios('estudiante')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estudiante-municipio" class="form-label">Municipio</label>
                                        <select class="form-select" id="estudiante-municipio" onchange="loadSectores('estudiante')">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="estudiante-sector" class="form-label">Sector</label>
                                        <select class="form-select" id="estudiante-sector">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="estudiante-direccion" class="form-label">Dirección Completa</label>
                                <textarea class="form-control" id="estudiante-direccion" rows="2"></textarea>
                            </div>

                            <!-- Tutor -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="estudiante-tutor" class="form-label">Tutor/Representante</label>
                                        <select class="form-select" id="estudiante-tutor">
                                            <option value="">Seleccionar tutor...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Estado y observaciones -->
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudiante-estado" class="form-label">Estado</label>
                                        <select class="form-select" id="estudiante-estado">
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="estudiante-observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="estudiante-observaciones" rows="3"></textarea>
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

    // Cargar datos iniciales
    loadEstudiantesData();
    loadTurnos();
    loadDepartamentos('estudiante');
    loadTutores();
}

// Función para cargar datos de estudiantes
function loadEstudiantesData() {
    try {
        const allEstudiantes = db.read('estudiantes');
        let filteredEstudiantes = allEstudiantes;

        // Aplicar búsqueda
        if (estudiantesSearchQuery) {
            filteredEstudiantes = filterByMultipleFields(
                filteredEstudiantes, 
                estudiantesSearchQuery, 
                ['nombre', 'apellido', 'codigo']
            );
        }

        // Aplicar filtros
        filteredEstudiantes = applyFilters(filteredEstudiantes, estudiantesFilters);

        // Actualizar contador
        document.getElementById('estudiantes-count').textContent = filteredEstudiantes.length;

        // Paginar resultados
        const paginatedData = paginate(filteredEstudiantes, currentEstudiantesPage, estudiantesPerPage);
        
        // Renderizar tabla
        renderEstudiantesTable(paginatedData.data);
        
        // Renderizar paginación
        renderEstudiantesPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        showGlobalAlert('Error al cargar datos de estudiantes', 'error');
    }
}

// Función para renderizar tabla de estudiantes
function renderEstudiantesTable(estudiantes) {
    const tbody = document.getElementById('estudiantes-tbody');
    
    if (estudiantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-user-graduate fa-3x text-muted mb-3"></i>
                        <h5>No hay estudiantes registrados</h5>
                        <p class="text-muted">Comience agregando un nuevo estudiante</p>
                        <button type="button" class="btn btn-primary" onclick="showEstudianteModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Estudiante
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const turnos = db.read('turnos');
    const tutores = db.read('tutores');
    
    tbody.innerHTML = estudiantes.map(estudiante => {
        const turno = turnos.find(t => t.id === estudiante.turno_id);
        const tutor = tutores.find(t => t.id === estudiante.tutor_id);
        const edad = calculateAge(estudiante.fecha_nacimiento);
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-3" style="background-color: ${getGradeColor(estudiante.grado)}">
                            ${estudiante.nombre.charAt(0)}${estudiante.apellido.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${estudiante.nombre} ${estudiante.apellido}</div>
                            <small class="text-muted">${estudiante.email || 'Sin email'}</small>
                        </div>
                    </div>
                </td>
                <td>${estudiante.codigo || 'No registrado'}</td>
                <td>${edad} años</td>
                <td>
                    <span class="badge" style="background-color: ${getGradeColor(estudiante.grado)}">
                        ${estudiante.grado}° Grado
                    </span>
                </td>
                <td>${turno ? turno.nombre : 'No asignado'}</td>
                <td>${tutor ? `${tutor.nombre} ${tutor.apellido}` : 'Sin tutor'}</td>
                <td>${getStatusBadge(estudiante.estado || 'Activo')}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editEstudiante('${estudiante.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewEstudiante('${estudiante.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteEstudiante('${estudiante.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para guardar estudiante
function saveEstudiante() {
    try {
        const form = document.getElementById('estudianteForm');
        const formData = new FormData(form);
        
        const estudianteData = {
            nombre: document.getElementById('estudiante-nombre').value.trim(),
            apellido: document.getElementById('estudiante-apellido').value.trim(),
            codigo: document.getElementById('estudiante-codigo').value.trim(),
            fecha_nacimiento: document.getElementById('estudiante-fecha-nacimiento').value,
            genero: document.getElementById('estudiante-genero').value,
            grado: document.getElementById('estudiante-grado').value,
            turno_id: document.getElementById('estudiante-turno').value,
            telefono: document.getElementById('estudiante-telefono').value.trim(),
            email: document.getElementById('estudiante-email').value.trim(),
            departamento: document.getElementById('estudiante-departamento').value,
            municipio: document.getElementById('estudiante-municipio').value,
            sector: document.getElementById('estudiante-sector').value,
            direccion: document.getElementById('estudiante-direccion').value.trim(),
            tutor_id: document.getElementById('estudiante-tutor').value,
            estado: document.getElementById('estudiante-estado').value,
            observaciones: document.getElementById('estudiante-observaciones').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            nombre: { required: true, label: 'Nombre' },
            apellido: { required: true, label: 'Apellido' },
            fecha_nacimiento: { required: true, type: 'date', label: 'Fecha de nacimiento' },
            genero: { required: true, label: 'Género' },
            grado: { required: true, label: 'Grado' },
            turno_id: { required: true, label: 'Turno' }
        };
        
        if (estudianteData.email) {
            validationRules.email = { type: 'email', label: 'Email' };
        }
        
        if (estudianteData.telefono) {
            validationRules.telefono = { type: 'phone', label: 'Teléfono' };
        }
        
        if (estudianteData.codigo) {
            validationRules.codigo = { type: 'codigo', label: 'Código Estudiantil' };
        }
        
        const errors = validateFormData(estudianteData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Validar edad
        if (!validateAge(estudianteData.fecha_nacimiento, 5, 18)) {
            showGlobalAlert('La edad del estudiante debe estar entre 5 y 18 años', 'error');
            return;
        }
        
        // Formatear datos
        if (estudianteData.telefono) {
            estudianteData.telefono = formatPhoneNumber(estudianteData.telefono);
        }
        
        const estudianteId = document.getElementById('estudiante-id').value;
        
        if (estudianteId) {
            // Actualizar estudiante existente
            db.update('estudiantes', estudianteId, estudianteData);
            showGlobalAlert('Estudiante actualizado correctamente', 'success');
        } else {
            // Crear nuevo estudiante
            db.create('estudiantes', estudianteData);
            showGlobalAlert('Estudiante creado correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('estudianteModal'));
        modal.hide();
        loadEstudiantesData();
        
    } catch (error) {
        console.error('Error guardando estudiante:', error);
        showGlobalAlert('Error al guardar estudiante: ' + error.message, 'error');
    }
}

// Función para cargar departamentos
function loadDepartamentos(prefix) {
    const departamentoSelect = document.getElementById(`${prefix}-departamento`);
    if (!departamentoSelect) return;
    
    const departamentos = nicaraguaData.getDepartments();
    departamentoSelect.innerHTML = '<option value="">Seleccionar departamento...</option>';
    
    departamentos.forEach(departamento => {
        const option = document.createElement('option');
        option.value = departamento;
        option.textContent = departamento;
        departamentoSelect.appendChild(option);
    });
}

// Función para exportar estudiantes
function exportEstudiantes() {
    try {
        const estudiantes = db.read('estudiantes');
        const turnos = db.read('turnos');
        const tutores = db.read('tutores');
        
        const exportData = estudiantes.map(estudiante => {
            const turno = turnos.find(t => t.id === estudiante.turno_id);
            const tutor = tutores.find(t => t.id === estudiante.tutor_id);
            const edad = calculateAge(estudiante.fecha_nacimiento);
            
            return {
                'Nombre': estudiante.nombre,
                'Apellido': estudiante.apellido,
                'Código Estudiantil': estudiante.codigo || '',
                'Fecha de Nacimiento': formatDateShort(estudiante.fecha_nacimiento),
                'Edad': edad,
                'Género': estudiante.genero || '',
                'Grado': `${estudiante.grado}° Grado`,
                'Turno': turno ? turno.nombre : '',
                'Teléfono': estudiante.telefono || '',
                'Email': estudiante.email || '',
                'Departamento': estudiante.departamento || '',
                'Municipio': estudiante.municipio || '',
                'Sector': estudiante.sector || '',
                'Dirección': estudiante.direccion || '',
                'Tutor': tutor ? `${tutor.nombre} ${tutor.apellido}` : '',
                'Estado': estudiante.estado || 'Activo',
                'Observaciones': estudiante.observaciones || '',
                'Fecha de Registro': formatDateShort(estudiante.created_at)
            };
        });
        
        exportToExcel(exportData, 'estudiantes', 'Lista de Estudiantes');
        
    } catch (error) {
        console.error('Error exportando estudiantes:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Actualiza las funciones relacionadas con provincias/municipios
function loadMunicipios(prefix) {
    const departamentoSelect = document.getElementById(`${prefix}-departamento`);
    const municipioSelect = document.getElementById(`${prefix}-municipio`);
    const sectorSelect = document.getElementById(`${prefix}-sector`);
    
    if (!departamentoSelect || !municipioSelect) return;
    
    const departamento = departamentoSelect.value;
    municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
    sectorSelect.innerHTML = '<option value="">Seleccionar sector...</option>';
    
    if (departamento) {
        const municipios = nicaraguaData.getMunicipalities(departamento);
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio;
            option.textContent = municipio;
            municipioSelect.appendChild(option);
        });
    }
}

// Función para mostrar modal de estudiante (actualizada)
function showEstudianteModal(estudianteId = null) {
    const modal = new bootstrap.Modal(document.getElementById('estudianteModal'));
    const title = document.getElementById('estudianteModalTitle');
    const form = document.getElementById('estudianteForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('estudiante-id').value = '';
    
    if (estudianteId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-user-graduate me-2"></i>Editar Estudiante';
        const estudiante = db.find('estudiantes', estudianteId);
        
        if (estudiante) {
            document.getElementById('estudiante-id').value = estudiante.id;
            document.getElementById('estudiante-nombre').value = estudiante.nombre || '';
            document.getElementById('estudiante-apellido').value = estudiante.apellido || '';
            document.getElementById('estudiante-codigo').value = estudiante.codigo || '';
            document.getElementById('estudiante-fecha-nacimiento').value = estudiante.fecha_nacimiento || '';
            document.getElementById('estudiante-genero').value = estudiante.genero || '';
            document.getElementById('estudiante-grado').value = estudiante.grado || '';
            document.getElementById('estudiante-turno').value = estudiante.turno_id || '';
            document.getElementById('estudiante-telefono').value = estudiante.telefono || '';
            document.getElementById('estudiante-email').value = estudiante.email || '';
            document.getElementById('estudiante-departamento').value = estudiante.departamento || '';
            
            // Cargar municipios y sectores si hay departamento
            if (estudiante.departamento) {
                loadMunicipios('estudiante');
                setTimeout(() => {
                    document.getElementById('estudiante-municipio').value = estudiante.municipio || '';
                    if (estudiante.municipio) {
                        loadSectores('estudiante');
                        setTimeout(() => {
                            document.getElementById('estudiante-sector').value = estudiante.sector || '';
                        }, 100);
                    }
                }, 100);
            }
            
            document.getElementById('estudiante-direccion').value = estudiante.direccion || '';
            document.getElementById('estudiante-tutor').value = estudiante.tutor_id || '';
            document.getElementById('estudiante-estado').value = estudiante.estado || 'Activo';
            document.getElementById('estudiante-observaciones').value = estudiante.observaciones || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-user-graduate me-2"></i>Nuevo Estudiante';
        document.getElementById('estudiante-estado').value = 'Activo';
    }
    
    modal.show();
}

// Función para ver detalles de estudiante (actualizada)
function viewEstudiante(estudianteId) {
    const estudiante = db.find('estudiantes', estudianteId);
    if (!estudiante) {
        showGlobalAlert('Estudiante no encontrado', 'error');
        return;
    }
    
    const turnos = db.read('turnos');
    const tutores = db.read('tutores');
    const turno = turnos.find(t => t.id === estudiante.turno_id);
    const tutor = tutores.find(t => t.id === estudiante.tutor_id);
    const edad = calculateAge(estudiante.fecha_nacimiento);
    
    Swal.fire({
        title: `${estudiante.nombre} ${estudiante.apellido}`,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Código Estudiantil:</strong></div>
                    <div class="col-6">${estudiante.codigo || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Edad:</strong></div>
                    <div class="col-6">${edad} años</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Género:</strong></div>
                    <div class="col-6">${estudiante.genero || 'No especificado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Grado:</strong></div>
                    <div class="col-6">${estudiante.grado}° Grado</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Turno:</strong></div>
                    <div class="col-6">${turno ? turno.nombre : 'No asignado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Teléfono:</strong></div>
                    <div class="col-6">${estudiante.telefono || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Email:</strong></div>
                    <div class="col-6">${estudiante.email || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Departamento:</strong></div>
                    <div class="col-6">${estudiante.departamento || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Municipio:</strong></div>
                    <div class="col-6">${estudiante.municipio || 'No registrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Tutor:</strong></div>
                    <div class="col-6">${tutor ? `${tutor.nombre} ${tutor.apellido}` : 'Sin tutor'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estado:</strong></div>
                    <div class="col-6">${getStatusBadge(estudiante.estado || 'Activo')}</div>
                </div>
                ${estudiante.observaciones ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Observaciones:</strong></div>
                        <div class="col-12">${estudiante.observaciones}</div>
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
            editEstudiante(estudianteId);
        }
    });
}

// Exportar funciones actualizadas
window.loadEstudiantesSection = loadEstudiantesSection;
window.showEstudianteModal = showEstudianteModal;
window.saveEstudiante = saveEstudiante;
window.editEstudiante = editEstudiante;
window.viewEstudiante = viewEstudiante;
window.deleteEstudiante = deleteEstudiante;
window.searchEstudiantes = searchEstudiantes;
window.filterEstudiantes = filterEstudiantes;
window.clearEstudiantesFilters = clearEstudiantesFilters;
window.changeEstudiantesPage = changeEstudiantesPage;
window.exportEstudiantes = exportEstudiantes;
window.loadMunicipios = loadMunicipios;
window.loadSectores = loadSectores;
window.loadDepartamentos = loadDepartamentos;

console.log('✅ Estudiantes.js cargado correctamente');