/**
 * Módulo de gestión de inscripciones
 * Sistema completo de CRUD para inscripciones con validaciones
 */

let currentInscripcionesPage = 1;
const inscripcionesPerPage = 10;
let inscripcionesFilters = {};
let inscripcionesSearchQuery = '';

// Función principal para cargar la sección de inscripciones
function loadInscripcionesSection() {
    const section = document.getElementById('inscripciones-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-edit me-2"></i>
                    Gestión de Inscripciones
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showInscripcionModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Inscripción
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportInscripciones()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="procesarInscripcionesPendientes()">
                            <i class="fas fa-cogs me-1"></i> Procesar Pendientes
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
                        <input type="text" class="form-control" id="inscripciones-search" 
                               placeholder="Buscar por código o nombre..."
                               onkeyup="debounce(searchInscripciones, 300)()">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-grado" onchange="filterInscripciones()">
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
                    <select class="form-select" id="filter-estado" onchange="filterInscripciones()">
                        <option value="">Todos los estados</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>
                        <option value="Completada">Completada</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text">Desde:</span>
                        <input type="date" class="form-control" id="filter-fecha-desde" onchange="filterInscripciones()">
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearInscripcionesFilters()">
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
                                <div class="h4 mb-0" id="total-inscripciones">0</div>
                                <div class="small">Total Inscripciones</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-edit fa-2x"></i>
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
                                <div class="h4 mb-0" id="inscripciones-proceso">0</div>
                                <div class="small">En Proceso</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
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
                                <div class="h4 mb-0" id="inscripciones-aprobadas">0</div>
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
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="inscripciones-mes">0</div>
                                <div class="small">Este Mes</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-calendar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de inscripciones -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">
                    Lista de Inscripciones
                    <span class="badge bg-primary ms-2" id="inscripciones-count">0</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Solicitante</th>
                                <th>Estudiante</th>
                                <th>Grado Solicitado</th>
                                <th>Fecha Solicitud</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="inscripciones-tbody">
                            <!-- Datos se cargan aquí -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de inscripciones">
                    <ul class="pagination justify-content-center" id="inscripciones-pagination">
                        <!-- Paginación se genera aquí -->
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal de inscripción -->
        <div class="modal fade" id="inscripcionModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="inscripcionModalTitle">
                            <i class="fas fa-edit me-2"></i>
                            Nueva Inscripción
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="inscripcionForm">
                            <input type="hidden" id="inscripcion-id">
                            
                            <!-- Información del solicitante -->
                            <h6 class="border-bottom pb-2 mb-3">Información del Solicitante</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-codigo" class="form-label">Código de Inscripción</label>
                                        <input type="text" class="form-control" id="inscripcion-codigo" readonly>
                                        <div class="form-text">Se genera automáticamente</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-fecha" class="form-label">Fecha de Solicitud *</label>
                                        <input type="date" class="form-control" id="inscripcion-fecha" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="inscripcion-solicitante-nombre" class="form-label">Nombre del Solicitante *</label>
                                        <input type="text" class="form-control" id="inscripcion-solicitante-nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="inscripcion-solicitante-telefono" class="form-label">Teléfono *</label>
                                        <input type="tel" class="form-control" id="inscripcion-solicitante-telefono" 
                                               placeholder="809-000-0000" required>
                                    </div>
                                </div>
                            </div>

                            <!-- Información del estudiante -->
                            <h6 class="border-bottom pb-2 mb-3">Información del Estudiante</h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-estudiante-nombre" class="form-label">Nombre del Estudiante *</label>
                                        <input type="text" class="form-control" id="inscripcion-estudiante-nombre" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-estudiante-apellido" class="form-label">Apellido del Estudiante *</label>
                                        <input type="text" class="form-control" id="inscripcion-estudiante-apellido" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-estudiante-fecha-nacimiento" class="form-label">Fecha de Nacimiento *</label>
                                        <input type="date" class="form-control" id="inscripcion-estudiante-fecha-nacimiento" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-estudiante-genero" class="form-label">Género *</label>
                                        <select class="form-select" id="inscripcion-estudiante-genero" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-grado-solicitado" class="form-label">Grado Solicitado *</label>
                                        <select class="form-select" id="inscripcion-grado-solicitado" required>
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
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="inscripcion-estado" class="form-label">Estado</label>
                                        <select class="form-select" id="inscripcion-estado">
                                            <option value="En Proceso">En Proceso</option>
                                            <option value="Aprobada">Aprobada</option>
                                            <option value="Rechazada">Rechazada</option>
                                            <option value="Completada">Completada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Documentos y observaciones -->
                            <div class="mb-3">
                                <label for="inscripcion-documentos" class="form-label">Documentos Presentados</label>
                                <textarea class="form-control" id="inscripcion-documentos" rows="2" 
                                          placeholder="Ej: Acta de nacimiento, certificado de notas..."></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="inscripcion-observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="inscripcion-observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveInscripcion()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    loadInscripcionesData();
    updateInscripcionesStats();
}

// Función para cargar datos de inscripciones
function loadInscripcionesData() {
    try {
        const allInscripciones = db.read('inscripciones');
        let filteredInscripciones = allInscripciones;

        // Aplicar búsqueda
        if (inscripcionesSearchQuery) {
            filteredInscripciones = filterByMultipleFields(
                filteredInscripciones, 
                inscripcionesSearchQuery, 
                ['codigo', 'solicitante_nombre', 'estudiante_nombre', 'estudiante_apellido']
            );
        }

        // Aplicar filtros
        filteredInscripciones = applyFilters(filteredInscripciones, inscripcionesFilters);

        // Filtro especial de fecha
        if (inscripcionesFilters.fecha_desde) {
            filteredInscripciones = filteredInscripciones.filter(inscripcion => {
                return new Date(inscripcion.fecha_solicitud) >= new Date(inscripcionesFilters.fecha_desde);
            });
        }

        // Actualizar contador
        document.getElementById('inscripciones-count').textContent = filteredInscripciones.length;

        // Paginar resultados
        const paginatedData = paginate(filteredInscripciones, currentInscripcionesPage, inscripcionesPerPage);
        
        // Renderizar tabla
        renderInscripcionesTable(paginatedData.data);
        
        // Renderizar paginación
        renderInscripcionesPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando inscripciones:', error);
        showGlobalAlert('Error al cargar datos de inscripciones', 'error');
    }
}

// Función para renderizar tabla de inscripciones
function renderInscripcionesTable(inscripciones) {
    const tbody = document.getElementById('inscripciones-tbody');
    
    if (inscripciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-edit fa-3x text-muted mb-3"></i>
                        <h5>No hay inscripciones registradas</h5>
                        <p class="text-muted">Comience agregando una nueva inscripción</p>
                        <button type="button" class="btn btn-primary" onclick="showInscripcionModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Inscripción
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = inscripciones.map(inscripcion => {
        const edad = calculateAge(inscripcion.estudiante_fecha_nacimiento);
        
        return `
            <tr>
                <td>
                    <span class="badge bg-secondary">${inscripcion.codigo}</span>
                </td>
                <td>
                    <div class="fw-bold">${inscripcion.solicitante_nombre}</div>
                    <small class="text-muted">${inscripcion.solicitante_telefono}</small>
                </td>
                <td>
                    <div class="fw-bold">${inscripcion.estudiante_nombre} ${inscripcion.estudiante_apellido}</div>
                    <small class="text-muted">${edad} años - ${inscripcion.estudiante_genero}</small>
                </td>
                <td>
                    <span class="badge" style="background-color: ${getGradeColor(inscripcion.grado_solicitado)}">
                        ${inscripcion.grado_solicitado}° Grado
                    </span>
                </td>
                <td>${formatDateShort(inscripcion.fecha_solicitud)}</td>
                <td>${getStatusBadge(inscripcion.estado)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editInscripcion('${inscripcion.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewInscripcion('${inscripcion.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${inscripcion.estado === 'Aprobada' ? 
                            `<button type="button" class="btn btn-sm btn-outline-success" 
                                    onclick="crearMatriculaDesdeInscripcion('${inscripcion.id}')" title="Crear matrícula">
                                <i class="fas fa-clipboard-check"></i>
                            </button>` : ''
                        }
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteInscripcion('${inscripcion.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para renderizar paginación
function renderInscripcionesPagination(paginatedData) {
    const pagination = document.getElementById('inscripciones-pagination');
    
    if (paginatedData.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // Botón anterior
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasPrev ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeInscripcionesPage(${currentInscripcionesPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= paginatedData.totalPages; i++) {
        if (i === currentInscripcionesPage || 
            i === 1 || 
            i === paginatedData.totalPages || 
            (i >= currentInscripcionesPage - 1 && i <= currentInscripcionesPage + 1)) {
            
            paginationHtml += `
                <li class="page-item ${i === currentInscripcionesPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeInscripcionesPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentInscripcionesPage - 2 || i === currentInscripcionesPage + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botón siguiente
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasNext ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeInscripcionesPage(${currentInscripcionesPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHtml;
}

// Función para actualizar estadísticas de inscripciones
function updateInscripcionesStats() {
    try {
        const inscripciones = db.read('inscripciones');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Total inscripciones
        document.getElementById('total-inscripciones').textContent = inscripciones.length;
        
        // En proceso
        const enProceso = inscripciones.filter(i => i.estado === 'En Proceso');
        document.getElementById('inscripciones-proceso').textContent = enProceso.length;
        
        // Aprobadas
        const aprobadas = inscripciones.filter(i => i.estado === 'Aprobada' || i.estado === 'Completada');
        document.getElementById('inscripciones-aprobadas').textContent = aprobadas.length;
        
        // Este mes
        const esteMes = inscripciones.filter(i => {
            const fecha = new Date(i.fecha_solicitud);
            return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
        });
        document.getElementById('inscripciones-mes').textContent = esteMes.length;
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

// Función para generar código de inscripción
function generateInscripcionCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = db.read('inscripciones').length + 1;
    return `INS${year}${sequence.toString().padStart(4, '0')}`;
}

// Función para mostrar modal de inscripción
function showInscripcionModal(inscripcionId = null) {
    const modal = new bootstrap.Modal(document.getElementById('inscripcionModal'));
    const title = document.getElementById('inscripcionModalTitle');
    const form = document.getElementById('inscripcionForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('inscripcion-id').value = '';
    
    if (inscripcionId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Inscripción';
        const inscripcion = db.find('inscripciones', inscripcionId);
        
        if (inscripcion) {
            document.getElementById('inscripcion-id').value = inscripcion.id;
            document.getElementById('inscripcion-codigo').value = inscripcion.codigo;
            document.getElementById('inscripcion-fecha').value = inscripcion.fecha_solicitud;
            document.getElementById('inscripcion-solicitante-nombre').value = inscripcion.solicitante_nombre;
            document.getElementById('inscripcion-solicitante-telefono').value = inscripcion.solicitante_telefono;
            document.getElementById('inscripcion-estudiante-nombre').value = inscripcion.estudiante_nombre;
            document.getElementById('inscripcion-estudiante-apellido').value = inscripcion.estudiante_apellido;
            document.getElementById('inscripcion-estudiante-fecha-nacimiento').value = inscripcion.estudiante_fecha_nacimiento;
            document.getElementById('inscripcion-estudiante-genero').value = inscripcion.estudiante_genero;
            document.getElementById('inscripcion-grado-solicitado').value = inscripcion.grado_solicitado;
            document.getElementById('inscripcion-estado').value = inscripcion.estado;
            document.getElementById('inscripcion-documentos').value = inscripcion.documentos || '';
            document.getElementById('inscripcion-observaciones').value = inscripcion.observaciones || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-edit me-2"></i>Nueva Inscripción';
        document.getElementById('inscripcion-codigo').value = generateInscripcionCode();
        document.getElementById('inscripcion-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('inscripcion-estado').value = 'En Proceso';
    }
    
    modal.show();
}

// Función para guardar inscripción
function saveInscripcion() {
    try {
        const form = document.getElementById('inscripcionForm');
        
        const inscripcionData = {
            codigo: document.getElementById('inscripcion-codigo').value.trim(),
            solicitante_nombre: document.getElementById('inscripcion-solicitante-nombre').value.trim(),
            solicitante_telefono: document.getElementById('inscripcion-solicitante-telefono').value.trim(),
            estudiante_nombre: document.getElementById('inscripcion-estudiante-nombre').value.trim(),
            estudiante_apellido: document.getElementById('inscripcion-estudiante-apellido').value.trim(),
            estudiante_fecha_nacimiento: document.getElementById('inscripcion-estudiante-fecha-nacimiento').value,
            estudiante_genero: document.getElementById('inscripcion-estudiante-genero').value,
            grado_solicitado: document.getElementById('inscripcion-grado-solicitado').value,
            fecha_solicitud: document.getElementById('inscripcion-fecha').value,
            estado: document.getElementById('inscripcion-estado').value,
            documentos: document.getElementById('inscripcion-documentos').value.trim(),
            observaciones: document.getElementById('inscripcion-observaciones').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            codigo: { required: true, label: 'Código' },
            solicitante_nombre: { required: true, label: 'Nombre del solicitante' },
            solicitante_telefono: { required: true, type: 'phone', label: 'Teléfono del solicitante' },
            estudiante_nombre: { required: true, label: 'Nombre del estudiante' },
            estudiante_apellido: { required: true, label: 'Apellido del estudiante' },
            estudiante_fecha_nacimiento: { required: true, type: 'date', label: 'Fecha de nacimiento' },
            estudiante_genero: { required: true, label: 'Género' },
            grado_solicitado: { required: true, label: 'Grado solicitado' },
            fecha_solicitud: { required: true, type: 'date', label: 'Fecha de solicitud' }
        };
        
        const errors = validateFormData(inscripcionData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Validar edad
        if (!validateAge(inscripcionData.estudiante_fecha_nacimiento, 5, 18)) {
            showGlobalAlert('La edad del estudiante debe estar entre 5 y 18 años', 'error');
            return;
        }
        
        // Formatear teléfono
        inscripcionData.solicitante_telefono = formatPhoneNumber(inscripcionData.solicitante_telefono);
        
        const inscripcionId = document.getElementById('inscripcion-id').value;
        
        if (inscripcionId) {
            // Actualizar inscripción existente
            db.update('inscripciones', inscripcionId, inscripcionData);
            showGlobalAlert('Inscripción actualizada correctamente', 'success');
        } else {
            // Crear nueva inscripción
            db.create('inscripciones', inscripcionData);
            showGlobalAlert('Inscripción creada correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('inscripcionModal'));
        modal.hide();
        loadInscripcionesData();
        updateInscripcionesStats();
        
    } catch (error) {
        console.error('Error guardando inscripción:', error);
        showGlobalAlert('Error al guardar inscripción: ' + error.message, 'error');
    }
}

// Función para editar inscripción
function editInscripcion(inscripcionId) {
    showInscripcionModal(inscripcionId);
}

// Función para ver detalles de inscripción
function viewInscripcion(inscripcionId) {
    const inscripcion = db.find('inscripciones', inscripcionId);
    if (!inscripcion) {
        showGlobalAlert('Inscripción no encontrada', 'error');
        return;
    }
    
    const edad = calculateAge(inscripcion.estudiante_fecha_nacimiento);
    
    Swal.fire({
        title: `Inscripción ${inscripcion.codigo}`,
        html: `
            <div class="text-start">
                <h6>Información del Solicitante</h6>
                <div class="row">
                    <div class="col-6"><strong>Nombre:</strong></div>
                    <div class="col-6">${inscripcion.solicitante_nombre}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Teléfono:</strong></div>
                    <div class="col-6">${inscripcion.solicitante_telefono}</div>
                </div>
                
                <h6 class="mt-3">Información del Estudiante</h6>
                <div class="row">
                    <div class="col-6"><strong>Nombre:</strong></div>
                    <div class="col-6">${inscripcion.estudiante_nombre} ${inscripcion.estudiante_apellido}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Fecha de Nacimiento:</strong></div>
                    <div class="col-6">${formatDate(inscripcion.estudiante_fecha_nacimiento)} (${edad} años)</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Género:</strong></div>
                    <div class="col-6">${inscripcion.estudiante_genero}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Grado Solicitado:</strong></div>
                    <div class="col-6">${inscripcion.grado_solicitado}° Grado</div>
                </div>
                
                <h6 class="mt-3">Información de la Solicitud</h6>
                <div class="row">
                    <div class="col-6"><strong>Fecha de Solicitud:</strong></div>
                    <div class="col-6">${formatDate(inscripcion.fecha_solicitud)}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Estado:</strong></div>
                    <div class="col-6">${getStatusBadge(inscripcion.estado)}</div>
                </div>
                
                ${inscripcion.documentos ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Documentos:</strong></div>
                        <div class="col-12">${inscripcion.documentos}</div>
                    </div>
                ` : ''}
                
                ${inscripcion.observaciones ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Observaciones:</strong></div>
                        <div class="col-12">${inscripcion.observaciones}</div>
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
            editInscripcion(inscripcionId);
        }
    });
}

// Función para crear matrícula desde inscripción
function crearMatriculaDesdeInscripcion(inscripcionId) {
    const inscripcion = db.find('inscripciones', inscripcionId);
    if (!inscripcion || inscripcion.estado !== 'Aprobada') {
        showGlobalAlert('Solo se pueden crear matrículas desde inscripciones aprobadas', 'error');
        return;
    }
    
    confirmAction(
        'Crear Matrícula',
        `¿Desea crear una matrícula para ${inscripcion.estudiante_nombre} ${inscripcion.estudiante_apellido}?`,
        'Sí, crear matrícula'
    ).then((result) => {
        if (result.isConfirmed) {
            // Crear estudiante primero
            const estudianteData = {
                nombre: inscripcion.estudiante_nombre,
                apellido: inscripcion.estudiante_apellido,
                fecha_nacimiento: inscripcion.estudiante_fecha_nacimiento,
                genero: inscripcion.estudiante_genero,
                grado: inscripcion.grado_solicitado,
                estado: 'Activo'
            };
            
            const estudiante = db.create('estudiantes', estudianteData);
            
            // Crear matrícula
            const currentYear = new Date().getFullYear();
            const matriculaData = {
                codigo: `MAT${currentYear.toString().slice(-2)}${(db.read('matriculas').length + 1).toString().padStart(4, '0')}`,
                estudiante_id: estudiante.id,
                grado: inscripcion.grado_solicitado,
                ano_escolar: `${currentYear}-${currentYear + 1}`,
                fecha_matricula: new Date().toISOString().split('T')[0],
                estado: 'Aprobada',
                observaciones: `Creada desde inscripción ${inscripcion.codigo}`
            };
            
            db.create('matriculas', matriculaData);
            
            // Actualizar estado de inscripción
            db.update('inscripciones', inscripcionId, { estado: 'Completada' });
            
            showGlobalAlert('Matrícula y estudiante creados correctamente', 'success');
            loadInscripcionesData();
            updateInscripcionesStats();
        }
    });
}

// Función para eliminar inscripción
function deleteInscripcion(inscripcionId) {
    const inscripcion = db.find('inscripciones', inscripcionId);
    if (!inscripcion) {
        showGlobalAlert('Inscripción no encontrada', 'error');
        return;
    }
    
    confirmAction(
        '¿Eliminar inscripción?',
        `¿Está seguro de eliminar la inscripción ${inscripcion.codigo}? Esta acción no se puede deshacer.`,
        'Sí, eliminar'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('inscripciones', inscripcionId);
                showGlobalAlert('Inscripción eliminada correctamente', 'success');
                loadInscripcionesData();
                updateInscripcionesStats();
            } catch (error) {
                console.error('Error eliminando inscripción:', error);
                showGlobalAlert('Error al eliminar inscripción', 'error');
            }
        }
    });
}

// Función para procesar inscripciones pendientes
function procesarInscripcionesPendientes() {
    const inscripciones = db.read('inscripciones');
    const pendientes = inscripciones.filter(i => i.estado === 'En Proceso');
    
    if (pendientes.length === 0) {
        showGlobalAlert('No hay inscripciones pendientes de procesar', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Procesar Inscripciones Pendientes',
        html: `
            <div class="text-start">
                <p>Se encontraron <strong>${pendientes.length}</strong> inscripciones pendientes:</p>
                <div class="list-group">
                    ${pendientes.slice(0, 5).map(i => 
                        `<div class="list-group-item">
                            <strong>${i.codigo}</strong> - ${i.estudiante_nombre} ${i.estudiante_apellido}
                            <br><small class="text-muted">${i.grado_solicitado}° Grado - ${formatDateShort(i.fecha_solicitud)}</small>
                        </div>`
                    ).join('')}
                    ${pendientes.length > 5 ? `<div class="list-group-item text-muted">Y ${pendientes.length - 5} más...</div>` : ''}
                </div>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Procesar Todas',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí se implementaría la lógica de procesamiento automático
            showGlobalAlert('Función de procesamiento automático en desarrollo', 'info');
        }
    });
}

// Función de búsqueda
function searchInscripciones() {
    inscripcionesSearchQuery = document.getElementById('inscripciones-search').value.trim();
    currentInscripcionesPage = 1;
    loadInscripcionesData();
}

// Función para filtrar inscripciones
function filterInscripciones() {
    inscripcionesFilters = {
        grado_solicitado: document.getElementById('filter-grado').value,
        estado: document.getElementById('filter-estado').value,
        fecha_desde: document.getElementById('filter-fecha-desde').value
    };
    
    // Remover filtros vacíos
    Object.keys(inscripcionesFilters).forEach(key => {
        if (!inscripcionesFilters[key]) {
            delete inscripcionesFilters[key];
        }
    });
    
    currentInscripcionesPage = 1;
    loadInscripcionesData();
}

// Función para limpiar filtros
function clearInscripcionesFilters() {
    document.getElementById('inscripciones-search').value = '';
    document.getElementById('filter-grado').value = '';
    document.getElementById('filter-estado').value = '';
    document.getElementById('filter-fecha-desde').value = '';
    
    inscripcionesSearchQuery = '';
    inscripcionesFilters = {};
    currentInscripcionesPage = 1;
    loadInscripcionesData();
}

// Función para cambiar página
function changeInscripcionesPage(page) {
    currentInscripcionesPage = page;
    loadInscripcionesData();
}

// Función para exportar inscripciones
function exportInscripciones() {
    try {
        const inscripciones = db.read('inscripciones');
        
        const exportData = inscripciones.map(inscripcion => {
            const edad = calculateAge(inscripcion.estudiante_fecha_nacimiento);
            
            return {
                'Código': inscripcion.codigo,
                'Solicitante': inscripcion.solicitante_nombre,
                'Teléfono Solicitante': inscripcion.solicitante_telefono,
                'Nombre Estudiante': inscripcion.estudiante_nombre,
                'Apellido Estudiante': inscripcion.estudiante_apellido,
                'Fecha Nacimiento': formatDateShort(inscripcion.estudiante_fecha_nacimiento),
                'Edad': edad,
                'Género': inscripcion.estudiante_genero,
                'Grado Solicitado': `${inscripcion.grado_solicitado}° Grado`,
                'Fecha Solicitud': formatDateShort(inscripcion.fecha_solicitud),
                'Estado': inscripcion.estado,
                'Documentos': inscripcion.documentos || '',
                'Observaciones': inscripcion.observaciones || '',
                'Fecha de Registro': formatDateShort(inscripcion.created_at)
            };
        });
        
        exportToExcel(exportData, 'inscripciones', 'Lista de Inscripciones');
        
    } catch (error) {
        console.error('Error exportando inscripciones:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Exportar funciones
window.loadInscripcionesSection = loadInscripcionesSection;
window.showInscripcionModal = showInscripcionModal;
window.saveInscripcion = saveInscripcion;
window.editInscripcion = editInscripcion;
window.viewInscripcion = viewInscripcion;
window.crearMatriculaDesdeInscripcion = crearMatriculaDesdeInscripcion;
window.deleteInscripcion = deleteInscripcion;
window.procesarInscripcionesPendientes = procesarInscripcionesPendientes;
window.searchInscripciones = searchInscripciones;
window.filterInscripciones = filterInscripciones;
window.clearInscripcionesFilters = clearInscripcionesFilters;
window.changeInscripcionesPage = changeInscripcionesPage;
window.exportInscripciones = exportInscripciones;

console.log('✅ Inscripciones.js cargado correctamente');
