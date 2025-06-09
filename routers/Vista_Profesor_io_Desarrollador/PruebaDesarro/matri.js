/**
 * Módulo de gestión de matrículas
 * Funcionalidades para el proceso de inscripción
 */

let matriculasData = [];
let currentMatriculasPage = 1;
const matriculasPerPage = 12;

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
                        <button type="button" class="btn btn-primary" onclick="showAddMatriculaModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Matrícula
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportMatriculas()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="generateReporteMatriculas()">
                            <i class="fas fa-chart-bar me-1"></i> Reporte
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshMatriculas()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas de matrículas -->
        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-primary">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="total-matriculas-activas">0</h3>
                        <p class="mb-0">Matrículas Activas</p>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-success">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="matriculas-este-mes">0</h3>
                        <p class="mb-0">Este Mes</p>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-warning">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="matriculas-pendientes">0</h3>
                        <p class="mb-0">Pendientes</p>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-info">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="ingresos-matriculas">$0</h3>
                        <p class="mb-0">Ingresos</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-3">
                    <label for="searchMatriculas" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchMatriculas" 
                           placeholder="Nombre del estudiante..." 
                           oninput="filterMatriculas()">
                </div>
                <div class="col-md-2">
                    <label for="filterGradoMatricula" class="form-label">Grado:</label>
                    <select class="form-select" id="filterGradoMatricula" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="1">Primer Grado</option>
                        <option value="2">Segundo Grado</option>
                        <option value="3">Tercer Grado</option>
                        <option value="4">Cuarto Grado</option>
                        <option value="5">Quinto Grado</option>
                        <option value="6">Sexto Grado</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterEstadoMatricula" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstadoMatricula" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="Activa">Activa</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Retirada">Retirada</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterAnoLectivo" class="form-label">Año Lectivo:</label>
                    <select class="form-select" id="filterAnoLectivo" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterModalidad" class="form-label">Modalidad:</label>
                    <select class="form-select" id="filterModalidad" onchange="filterMatriculas()">
                        <option value="">Todas</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Semi-presencial">Semi-presencial</option>
                        <option value="Virtual">Virtual</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearMatriculasFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Lista de matrículas -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Registro de Matrículas</h6>
            </div>
            <div class="card-body">
                <div id="matriculasTableContainer">
                    <!-- El contenido se cargará aquí -->
                </div>
                <div id="matriculasPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar matrícula -->
        <div class="modal fade" id="matriculaModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
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
                            <input type="hidden" id="matriculaId">
                            
                            <!-- Información del estudiante -->
                            <h6 class="text-primary mb-3">
                                <i class="fas fa-user-graduate me-2"></i>
                                Información del Estudiante
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudianteMatricula" class="form-label">Estudiante *</label>
                                        <select class="form-select" id="estudianteMatricula" name="estudianteId" required>
                                            <option value="">Seleccionar estudiante</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="gradoMatricula" class="form-label">Grado *</label>
                                        <select class="form-select" id="gradoMatricula" name="grado" required>
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
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="anoLectivo" class="form-label">Año Lectivo *</label>
                                        <select class="form-select" id="anoLectivo" name="anoLectivo" required>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información académica -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-graduation-cap me-2"></i>
                                Información Académica
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="modalidad" class="form-label">Modalidad *</label>
                                        <select class="form-select" id="modalidad" name="modalidad" required>
                                            <option value="">Seleccionar modalidad</option>
                                            <option value="Presencial">Presencial</option>
                                            <option value="Semi-presencial">Semi-presencial</option>
                                            <option value="Virtual">Virtual</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="jornada" class="form-label">Jornada *</label>
                                        <select class="form-select" id="jornada" name="jornada" required>
                                            <option value="">Seleccionar jornada</option>
                                            <option value="Matutina">Matutina (7:00 AM - 12:00 PM)</option>
                                            <option value="Vespertina">Vespertina (1:00 PM - 6:00 PM)</option>
                                            <option value="Completa">Jornada Completa</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tipoEstudiante" class="form-label">Tipo de Estudiante *</label>
                                        <select class="form-select" id="tipoEstudiante" name="tipoEstudiante" required>
                                            <option value="">Seleccionar tipo</option>
                                            <option value="Nuevo">Nuevo Ingreso</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Repitente">Repitente</option>
                                            <option value="Traslado">Traslado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de pago -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-dollar-sign me-2"></i>
                                Información de Pago
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="montoMatricula" class="form-label">Monto de Matrícula *</label>
                                        <input type="number" class="form-control" id="montoMatricula" name="montoMatricula" 
                                               min="0" step="0.01" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="fechaPago" class="form-label">Fecha de Pago</label>
                                        <input type="date" class="form-control" id="fechaPago" name="fechaPago">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="metodoPago" class="form-label">Método de Pago</label>
                                        <select class="form-select" id="metodoPago" name="metodoPago">
                                            <option value="">Seleccionar método</option>
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia Bancaria</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Tarjeta">Tarjeta de Crédito</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información adicional -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-info-circle me-2"></i>
                                Información Adicional
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaMatricula" class="form-label">Fecha de Matrícula *</label>
                                        <input type="date" class="form-control" id="fechaMatricula" name="fechaMatricula" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estadoMatricula" class="form-label">Estado *</label>
                                        <select class="form-select" id="estadoMatricula" name="estado" required>
                                            <option value="Activa">Activa</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Cancelada">Cancelada</option>
                                            <option value="Retirada">Retirada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="observacionesMatricula" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observacionesMatricula" name="observaciones" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveMatricula()">
                            <i class="fas fa-save me-1"></i> Guardar Matrícula
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadMatriculasData();
    updateMatriculasStats();
    loadEstudiantesOptions();
}

// Función para cargar datos de matrículas
function loadMatriculasData() {
    const savedData = localStorage.getItem('matriculasData');
    if (savedData) {
        matriculasData = JSON.parse(savedData);
    } else {
        // Datos iniciales de ejemplo para desarrollo
        matriculasData = [];
    }
    displayMatriculas();
}

// Función para cargar opciones de estudiantes
function loadEstudiantesOptions() {
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const select = document.getElementById('estudianteMatricula');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar estudiante</option>';
        estudiantesData.forEach(estudiante => {
            if (estudiante.estado === 'Activo') {
                select.innerHTML += `
                    <option value="${estudiante.id}">
                        ${estudiante.nombres} ${estudiante.apellidos} - ${estudiante.cedula}
                    </option>
                `;
            }
        });
    }
}

// Función para mostrar matrículas
function displayMatriculas() {
    const container = document.getElementById('matriculasTableContainer');
    if (!container) return;

    if (matriculasData.length === 0) {
        showEmptyState(container, 'No hay matrículas registradas', 'fas fa-clipboard-list');
        document.getElementById('matriculasPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyMatriculasFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentMatriculasPage, matriculasPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Año Lectivo</th>
                        <th>Estado</th>
                        <th>Fecha Matrícula</th>
                        <th>Monto</th>
                        <th>Modalidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    
    paginatedData.data.forEach(matricula => {
        const estudiante = estudiantesData.find(e => e.id === matricula.estudianteId);
        const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante no encontrado';
        
        const estadoBadge = getEstadoBadge(matricula.estado);
        const montoFormateado = formatCurrency(matricula.montoMatricula || 0);
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                            <i class="fas fa-user-graduate text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${nombreCompleto}</div>
                            <small class="text-muted">${estudiante ? estudiante.cedula : ''}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${getGradoText(matricula.grado)}</span>
                </td>
                <td>${matricula.anoLectivo}</td>
                <td>${estadoBadge}</td>
                <td>${formatDateShort(matricula.fechaMatricula)}</td>
                <td>${montoFormateado}</td>
                <td>
                    <small class="text-muted">${matricula.modalidad}</small><br>
                    <small class="text-muted">${matricula.jornada}</small>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editMatricula('${matricula.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewMatricula('${matricula.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteMatricula('${matricula.id}')" title="Eliminar">
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
    document.getElementById('matriculasPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentMatriculasPage, 'goToMatriculasPage');
}

// Función para obtener texto del grado
function getGradoText(grado) {
    const grados = {
        '1': '1ro',
        '2': '2do', 
        '3': '3ro',
        '4': '4to',
        '5': '5to',
        '6': '6to'
    };
    return grados[grado] || grado;
}

// Función para obtener badge del estado
function getEstadoBadge(estado) {
    const badges = {
        'Activa': '<span class="badge bg-success">Activa</span>',
        'Pendiente': '<span class="badge bg-warning">Pendiente</span>',
        'Cancelada': '<span class="badge bg-danger">Cancelada</span>',
        'Retirada': '<span class="badge bg-secondary">Retirada</span>'
    };
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

// Función para aplicar filtros
function applyMatriculasFilters() {
    let filtered = [...matriculasData];
    
    const searchTerm = document.getElementById('searchMatriculas')?.value?.toLowerCase() || '';
    const gradoFilter = document.getElementById('filterGradoMatricula')?.value || '';
    const estadoFilter = document.getElementById('filterEstadoMatricula')?.value || '';
    const anoFilter = document.getElementById('filterAnoLectivo')?.value || '';
    const modalidadFilter = document.getElementById('filterModalidad')?.value || '';
    
    if (searchTerm) {
        const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
        filtered = filtered.filter(matricula => {
            const estudiante = estudiantesData.find(e => e.id === matricula.estudianteId);
            if (estudiante) {
                const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase();
                return nombreCompleto.includes(searchTerm) || estudiante.cedula.includes(searchTerm);
            }
            return false;
        });
    }
    
    if (gradoFilter) {
        filtered = filtered.filter(m => m.grado === gradoFilter);
    }
    
    if (estadoFilter) {
        filtered = filtered.filter(m => m.estado === estadoFilter);
    }
    
    if (anoFilter) {
        filtered = filtered.filter(m => m.anoLectivo === anoFilter);
    }
    
    if (modalidadFilter) {
        filtered = filtered.filter(m => m.modalidad === modalidadFilter);
    }
    
    return filtered;
}

// Función para limpiar filtros
function clearMatriculasFilters() {
    document.getElementById('searchMatriculas').value = '';
    document.getElementById('filterGradoMatricula').value = '';
    document.getElementById('filterEstadoMatricula').value = '';
    document.getElementById('filterAnoLectivo').value = '';
    document.getElementById('filterModalidad').value = '';
    filterMatriculas();
}

// Función para filtrar matrículas
function filterMatriculas() {
    currentMatriculasPage = 1;
    displayMatriculas();
}

// Función para cambiar página
function goToMatriculasPage(page) {
    currentMatriculasPage = page;
    displayMatriculas();
}

// Función para mostrar modal de nueva matrícula
function showAddMatriculaModal() {
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    document.getElementById('matriculaModalTitle').innerHTML = '<i class="fas fa-clipboard-list me-2"></i>Nueva Matrícula';
    document.getElementById('matriculaId').value = '';
    clearForm(document.getElementById('matriculaForm'));
    
    // Establecer fecha actual
    document.getElementById('fechaMatricula').value = new Date().toISOString().split('T')[0];
    
    loadEstudiantesOptions();
    modal.show();
}

// Función para editar matrícula
function editMatricula(id) {
    const matricula = matriculasData.find(m => m.id === id);
    if (!matricula) return;
    
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    document.getElementById('matriculaModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Matrícula';
    
    // Llenar formulario
    document.getElementById('matriculaId').value = matricula.id;
    document.getElementById('estudianteMatricula').value = matricula.estudianteId || '';
    document.getElementById('gradoMatricula').value = matricula.grado || '';
    document.getElementById('anoLectivo').value = matricula.anoLectivo || '';
    document.getElementById('modalidad').value = matricula.modalidad || '';
    document.getElementById('jornada').value = matricula.jornada || '';
    document.getElementById('tipoEstudiante').value = matricula.tipoEstudiante || '';
    document.getElementById('montoMatricula').value = matricula.montoMatricula || '';
    document.getElementById('fechaPago').value = matricula.fechaPago || '';
    document.getElementById('metodoPago').value = matricula.metodoPago || '';
    document.getElementById('fechaMatricula').value = matricula.fechaMatricula || '';
    document.getElementById('estadoMatricula').value = matricula.estado || '';
    document.getElementById('observacionesMatricula').value = matricula.observaciones || '';
    
    loadEstudiantesOptions();
    modal.show();
}

// Función para guardar matrícula
function saveMatricula() {
    const form = document.getElementById('matriculaForm');
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const matriculaData = {
        id: document.getElementById('matriculaId').value || generateId(),
        estudianteId: formData.get('estudianteId'),
        grado: formData.get('grado'),
        anoLectivo: formData.get('anoLectivo'),
        modalidad: formData.get('modalidad'),
        jornada: formData.get('jornada'),
        tipoEstudiante: formData.get('tipoEstudiante'),
        montoMatricula: parseFloat(formData.get('montoMatricula')) || 0,
        fechaPago: formData.get('fechaPago'),
        metodoPago: formData.get('metodoPago'),
        fechaMatricula: formData.get('fechaMatricula'),
        estado: formData.get('estado'),
        observaciones: formData.get('observaciones'),
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
    };
    
    const existingIndex = matriculasData.findIndex(m => m.id === matriculaData.id);
    
    if (existingIndex >= 0) {
        matriculasData[existingIndex] = { ...matriculasData[existingIndex], ...matriculaData };
        showAlert.success('¡Actualizada!', 'La matrícula ha sido actualizada correctamente');
    } else {
        matriculasData.push(matriculaData);
        showAlert.success('¡Registrada!', 'La matrícula ha sido registrada correctamente');
    }
    
    // Guardar en localStorage
    localStorage.setItem('matriculasData', JSON.stringify(matriculasData));
    
    // Cerrar modal y actualizar tabla
    bootstrap.Modal.getInstance(document.getElementById('matriculaModal')).hide();
    displayMatriculas();
    updateMatriculasStats();
}

// Función para eliminar matrícula
function deleteMatricula(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer'
    ).then((result) => {
        if (result.isConfirmed) {
            matriculasData = matriculasData.filter(m => m.id !== id);
            localStorage.setItem('matriculasData', JSON.stringify(matriculasData));
            displayMatriculas();
            updateMatriculasStats();
            showAlert.success('¡Eliminada!', 'La matrícula ha sido eliminada correctamente');
        }
    });
}

// Función para ver detalles de matrícula
function viewMatricula(id) {
    const matricula = matriculasData.find(m => m.id === id);
    if (!matricula) return;
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const estudiante = estudiantesData.find(e => e.id === matricula.estudianteId);
    const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado';
    
    const detalles = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Estudiante:</strong> ${nombreCompleto}</p>
                <p><strong>Grado:</strong> ${getGradoText(matricula.grado)}</p>
                <p><strong>Año Lectivo:</strong> ${matricula.anoLectivo}</p>
                <p><strong>Modalidad:</strong> ${matricula.modalidad}</p>
                <p><strong>Jornada:</strong> ${matricula.jornada}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Estado:</strong> ${matricula.estado}</p>
                <p><strong>Monto:</strong> ${formatCurrency(matricula.montoMatricula || 0)}</p>
                <p><strong>Fecha Matrícula:</strong> ${formatDate(matricula.fechaMatricula)}</p>
                <p><strong>Tipo:</strong> ${matricula.tipoEstudiante}</p>
                <p><strong>Método de Pago:</strong> ${matricula.metodoPago || 'No especificado'}</p>
            </div>
        </div>
        ${matricula.observaciones ? `<p><strong>Observaciones:</strong> ${matricula.observaciones}</p>` : ''}
    `;
    
    Swal.fire({
        title: 'Detalles de Matrícula',
        html: detalles,
        icon: 'info',
        width: '600px'
    });
}

// Función para actualizar estadísticas
function updateMatriculasStats() {
    const activas = matriculasData.filter(m => m.estado === 'Activa').length;
    const pendientes = matriculasData.filter(m => m.estado === 'Pendiente').length;
    const esteMes = matriculasData.filter(m => {
        const fecha = new Date(m.fechaMatricula);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;
    
    const ingresos = matriculasData
        .filter(m => m.estado === 'Activa')
        .reduce((total, m) => total + (m.montoMatricula || 0), 0);
    
    document.getElementById('total-matriculas-activas').textContent = activas;
    document.getElementById('matriculas-pendientes').textContent = pendientes;
    document.getElementById('matriculas-este-mes').textContent = esteMes;
    document.getElementById('ingresos-matriculas').textContent = formatCurrency(ingresos);
}

// Función para exportar matrículas
function exportMatriculas() {
    if (matriculasData.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para exportar');
        return;
    }
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const dataToExport = matriculasData.map(matricula => {
        const estudiante = estudiantesData.find(e => e.id === matricula.estudianteId);
        return {
            Estudiante: estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            Cedula: estudiante ? estudiante.cedula : '',
            Grado: getGradoText(matricula.grado),
            'Año Lectivo': matricula.anoLectivo,
            Modalidad: matricula.modalidad,
            Jornada: matricula.jornada,
            Estado: matricula.estado,
            'Monto Matrícula': matricula.montoMatricula || 0,
            'Fecha Matrícula': formatDateShort(matricula.fechaMatricula),
            'Tipo Estudiante': matricula.tipoEstudiante,
            Observaciones: matricula.observaciones || ''
        };
    });
    
    exportToExcel('Matrículas', dataToExport, 'matriculas_' + new Date().toISOString().split('T')[0]);
}

// Función para generar reporte
function generateReporteMatriculas() {
    if (matriculasData.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para generar reporte');
        return;
    }
    
    // Estadísticas para el reporte
    const stats = {
        total: matriculasData.length,
        activas: matriculasData.filter(m => m.estado === 'Activa').length,
        pendientes: matriculasData.filter(m => m.estado === 'Pendiente').length,
        canceladas: matriculasData.filter(m => m.estado === 'Cancelada').length,
        ingresos: matriculasData.filter(m => m.estado === 'Activa').reduce((total, m) => total + (m.montoMatricula || 0), 0)
    };
    
    // Por grado
    const porGrado = {};
    matriculasData.forEach(m => {
        porGrado[m.grado] = (porGrado[m.grado] || 0) + 1;
    });
    
    let reporteHTML = `
        <div class="text-start">
            <h5>Estadísticas Generales</h5>
            <ul>
                <li>Total de matrículas: ${stats.total}</li>
                <li>Matrículas activas: ${stats.activas}</li>
                <li>Matrículas pendientes: ${stats.pendientes}</li>
                <li>Matrículas canceladas: ${stats.canceladas}</li>
                <li>Ingresos totales: ${formatCurrency(stats.ingresos)}</li>
            </ul>
            
            <h5>Distribución por Grado</h5>
            <ul>
    `;
    
    Object.entries(porGrado).forEach(([grado, cantidad]) => {
        reporteHTML += `<li>${getGradoText(grado)}: ${cantidad} estudiantes</li>`;
    });
    
    reporteHTML += `
            </ul>
        </div>
    `;
    
    Swal.fire({
        title: 'Reporte de Matrículas',
        html: reporteHTML,
        icon: 'info',
        width: '500px'
    });
}

// Función para refrescar datos
function refreshMatriculas() {
    loadMatriculasData();
    updateMatriculasStats();
    showAlert.success('¡Actualizado!', 'Los datos han sido actualizados');
}

// Inicializar cuando se carga la sección
document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadMatriculasSection === 'function') {
        // La función está disponible pero no la ejecutamos automáticamente
        // Se ejecutará cuando el usuario navegue a la sección
    }
});
