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
                                            <option value="Nuevo">Nuevo</option>
                                            <option value="Repitente">Repitente</option>
                                            <option value="Transferido">Transferido</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Información de la matrícula -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-file-invoice-dollar me-2"></i>
                                Información de Matrícula
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="fechaMatricula" class="form-label">Fecha de Matrícula *</label>
                                        <input type="date" class="form-control" id="fechaMatricula" name="fechaMatricula" required>
                                    </div>
                                </div>
                                <div class="col-md-3">
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
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="costoMatricula" class="form-label">Costo de Matrícula</label>
                                        <input type="number" class="form-control" id="costoMatricula" name="costoMatricula" 
                                               step="0.01" min="0">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="descuento" class="form-label">Descuento (%)</label>
                                        <input type="number" class="form-control" id="descuento" name="descuento" 
                                               min="0" max="100" value="0">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="metodoPago" class="form-label">Método de Pago</label>
                                        <select class="form-select" id="metodoPago" name="metodoPago">
                                            <option value="">Seleccionar método</option>
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia Bancaria</option>
                                            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                                            <option value="Cheque">Cheque</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="numeroRecibo" class="form-label">Número de Recibo</label>
                                        <input type="text" class="form-control" id="numeroRecibo" name="numeroRecibo">
                                    </div>
                                </div>
                            </div>

                            <!-- Documentos requeridos -->
                            <h6 class="text-primary mb-3 mt-4">
                                <i class="fas fa-folder-open me-2"></i>
                                Documentos Requeridos
                            </h6>
                            
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="actaNacimiento" name="documentos" value="Acta de Nacimiento">
                                        <label class="form-check-label" for="actaNacimiento">
                                            Acta de Nacimiento
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="cedulaEstudiante" name="documentos" value="Cédula del Estudiante">
                                        <label class="form-check-label" for="cedulaEstudiante">
                                            Cédula del Estudiante
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="cedulaPadre" name="documentos" value="Cédula del Padre/Tutor">
                                        <label class="form-check-label" for="cedulaPadre">
                                            Cédula del Padre/Tutor
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="recordNotas" name="documentos" value="Record de Notas">
                                        <label class="form-check-label" for="recordNotas">
                                            Record de Notas
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="fotoCarnet" name="documentos" value="Fotos Carnet">
                                        <label class="form-check-label" for="fotoCarnet">
                                            Fotos Carnet (2x2)
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="certificadoMedico" name="documentos" value="Certificado Médico">
                                        <label class="form-check-label" for="certificadoMedico">
                                            Certificado Médico
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="cartaRetiro" name="documentos" value="Carta de Retiro">
                                        <label class="form-check-label" for="cartaRetiro">
                                            Carta de Retiro (Transferidos)
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="certificadoBuenaConducta" name="documentos" value="Certificado de Buena Conducta">
                                        <label class="form-check-label" for="certificadoBuenaConducta">
                                            Certificado Buena Conducta
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3 mt-3">
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
    
    // Cargar datos
    loadMatriculasData();
    loadEstudiantesMatriculaSelect();
}

// Función para cargar datos de matrículas
function loadMatriculasData() {
    try {
        matriculasData = db.getMatriculas();
        renderMatriculasGrid();
        updateMatriculasStats();
    } catch (error) {
        console.error('Error al cargar matrículas:', error);
        showAlert.error('Error', 'No se pudieron cargar los datos de matrículas');
    }
}

// Función para cargar estudiantes en el select
function loadEstudiantesMatriculaSelect() {
    const estudiantesSelect = document.getElementById('estudianteMatricula');
    if (!estudiantesSelect) return;
    
    const estudiantes = db.getEstudiantes();
    estudiantesSelect.innerHTML = '<option value="">Seleccionar estudiante</option>';
    
    estudiantes.forEach(estudiante => {
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${estudiante.nombres} ${estudiante.apellidos} - ${estudiante.cedula || 'Sin cédula'}`;
        estudiantesSelect.appendChild(option);
    });
}

// Función para actualizar estadísticas de matrículas
function updateMatriculasStats() {
    const matriculas = db.getMatriculas();
    
    // Matrículas activas
    const activas = matriculas.filter(m => m.estado === 'Activa').length;
    
    // Matrículas este mes
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const esteMes = matriculas.filter(m => new Date(m.fechaMatricula) >= inicioMes).length;
    
    // Matrículas pendientes
    const pendientes = matriculas.filter(m => m.estado === 'Pendiente').length;
    
    // Ingresos por matrículas
    const ingresos = matriculas
        .filter(m => m.estado === 'Activa')
        .reduce((total, m) => {
            const costo = parseFloat(m.costoMatricula) || 0;
            const descuento = parseFloat(m.descuento) || 0;
            return total + (costo * (1 - descuento / 100));
        }, 0);
    
    // Actualizar UI
    document.getElementById('total-matriculas-activas').textContent = activas;
    document.getElementById('matriculas-este-mes').textContent = esteMes;
    document.getElementById('matriculas-pendientes').textContent = pendientes;
    document.getElementById('ingresos-matriculas').textContent = formatCurrency(ingresos);
}

// Función para renderizar grid de matrículas
function renderMatriculasGrid() {
    const container = document.getElementById('matriculasTableContainer');
    
    if (matriculasData.length === 0) {
        showEmptyState(container, 'No hay matrículas registradas', 'fas fa-clipboard-list');
        return;
    }
    
    // Aplicar filtros
    let filteredData = [...matriculasData];
    
    const searchTerm = document.getElementById('searchMatriculas')?.value;
    const gradoFilter = document.getElementById('filterGradoMatricula')?.value;
    const estadoFilter = document.getElementById('filterEstadoMatricula')?.value;
    const anoFilter = document.getElementById('filterAnoLectivo')?.value;
    const modalidadFilter = document.getElementById('filterModalidad')?.value;
    
    // Aplicar filtros
    if (searchTerm) {
        const estudiantes = db.getEstudiantes();
        const estudiantesIds = estudiantes
            .filter(e => 
                e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(e => e.id);
        filteredData = filteredData.filter(m => estudiantesIds.includes(m.estudianteId));
    }
    
    if (gradoFilter) filteredData = filteredData.filter(m => m.grado == gradoFilter);
    if (estadoFilter) filteredData = filteredData.filter(m => m.estado === estadoFilter);
    if (anoFilter) filteredData = filteredData.filter(m => m.anoLectivo === anoFilter);
    if (modalidadFilter) filteredData = filteredData.filter(m => m.modalidad === modalidadFilter);
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentMatriculasPage, matriculasPerPage);
    
    // Crear grid de cards
    let gridHTML = '<div class="row">';
    
    paginatedData.data.forEach(matricula => {
        const estudiante = db.getEstudianteById(matricula.estudianteId);
        const estadoBadge = getMatriculaEstadoBadge(matricula.estado);
        const costo = parseFloat(matricula.costoMatricula) || 0;
        const descuento = parseFloat(matricula.descuento) || 0;
        const costoFinal = costo * (1 - descuento / 100);
        
        gridHTML += `
            <div class="col-xl-4 col-lg-6 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="fw-bold">Matrícula #${matricula.id}</span>
                        ${estadoBadge}
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar me-3">
                                ${estudiante ? estudiante.nombres.charAt(0) + estudiante.apellidos.charAt(0) : '??'}
                            </div>
                            <div>
                                <h6 class="mb-0">${estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante no encontrado'}</h6>
                                <small class="text-muted">${getGradoText(matricula.grado)} - ${matricula.anoLectivo}</small>
                            </div>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted d-block">Modalidad:</small>
                            <span class="badge bg-primary">${matricula.modalidad}</span>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted d-block">Jornada:</small>
                            <span>${matricula.jornada}</span>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted d-block">Fecha de Matrícula:</small>
                            <span>${formatDateShort(matricula.fechaMatricula)}</span>
                        </div>
                        
                        ${costo > 0 ? `
                            <div class="mb-2">
                                <small class="text-muted d-block">Costo:</small>
                                <span class="fw-bold ${descuento > 0 ? 'text-decoration-line-through' : ''}">${formatCurrency(costo)}</span>
                                ${descuento > 0 ? `<span class="text-success fw-bold ms-2">${formatCurrency(costoFinal)}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewMatricula(${matricula.id})" 
                                    title="Ver Detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="editMatricula(${matricula.id})" 
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="printMatricula(${matricula.id})" 
                                    title="Imprimir">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteMatricula(${matricula.id})" 
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    gridHTML += '</div>';
    container.innerHTML = gridHTML;
    
    // Crear paginación
    const paginationContainer = document.getElementById('matriculasPagination');
    paginationContainer.innerHTML = createPagination(
        paginatedData.totalPages, 
        currentMatriculasPage, 
        'changeMatriculasPage'
    );
}

// Función para obtener badge de estado de matrícula
function getMatriculaEstadoBadge(estado) {
    switch (estado) {
        case 'Activa':
            return '<span class="badge bg-success">Activa</span>';
        case 'Pendiente':
            return '<span class="badge bg-warning">Pendiente</span>';
        case 'Cancelada':
            return '<span class="badge bg-danger">Cancelada</span>';
        case 'Retirada':
            return '<span class="badge bg-secondary">Retirada</span>';
        default:
            return '<span class="badge bg-secondary">Desconocido</span>';
    }
}

// Función para mostrar modal de nueva matrícula
function showAddMatriculaModal() {
    document.getElementById('matriculaModalTitle').innerHTML = 
        '<i class="fas fa-clipboard-list me-2"></i>Nueva Matrícula';
    document.getElementById('matriculaId').value = '';
    clearForm(document.getElementById('matriculaForm'));
    
    // Establecer valores por defecto
    document.getElementById('fechaMatricula').value = new Date().toISOString().split('T')[0];
    document.getElementById('anoLectivo').value = new Date().getFullYear().toString();
    document.getElementById('estadoMatricula').value = 'Pendiente';
    document.getElementById('descuento').value = '0';
    
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    modal.show();
}

// Función para editar matrícula
function editMatricula(id) {
    const matricula = db.getMatriculaById(id);
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    document.getElementById('matriculaModalTitle').innerHTML = 
        '<i class="fas fa-edit me-2"></i>Editar Matrícula';
    
    // Llenar formulario
    document.getElementById('matriculaId').value = matricula.id;
    document.getElementById('estudianteMatricula').value = matricula.estudianteId;
    document.getElementById('gradoMatricula').value = matricula.grado;
    document.getElementById('anoLectivo').value = matricula.anoLectivo;
    document.getElementById('modalidad').value = matricula.modalidad || '';
    document.getElementById('jornada').value = matricula.jornada || '';
    document.getElementById('tipoEstudiante').value = matricula.tipoEstudiante || '';
    document.getElementById('fechaMatricula').value = matricula.fechaMatricula;
    document.getElementById('estadoMatricula').value = matricula.estado;
    document.getElementById('costoMatricula').value = matricula.costoMatricula || '';
    document.getElementById('descuento').value = matricula.descuento || '0';
    document.getElementById('metodoPago').value = matricula.metodoPago || '';
    document.getElementById('numeroRecibo').value = matricula.numeroRecibo || '';
    document.getElementById('observacionesMatricula').value = matricula.observaciones || '';
    
    // Marcar documentos
    if (matricula.documentos) {
        const documentos = Array.isArray(matricula.documentos) ? matricula.documentos : matricula.documentos.split(',');
        const checkboxes = document.querySelectorAll('input[name="documentos"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = documentos.includes(checkbox.value);
        });
    }
    
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    modal.show();
}

// Función para ver detalles de la matrícula
function viewMatricula(id) {
    const matricula = db.getMatriculaById(id);
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    const estudiante = db.getEstudianteById(matricula.estudianteId);
    const costo = parseFloat(matricula.costoMatricula) || 0;
    const descuento = parseFloat(matricula.descuento) || 0;
    const costoFinal = costo * (1 - descuento / 100);
    
    const documentos = matricula.documentos 
        ? (Array.isArray(matricula.documentos) ? matricula.documentos : matricula.documentos.split(','))
        : [];
    
    Swal.fire({
        title: `Matrícula #${matricula.id}`,
        html: `
            <div class="text-start">
                <h6 class="text-primary mb-2">Información del Estudiante</h6>
                <p><strong>Estudiante:</strong> ${estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado'}</p>
                <p><strong>Grado:</strong> ${getGradoText(matricula.grado)}</p>
                <p><strong>Año Lectivo:</strong> ${matricula.anoLectivo}</p>
                
                <h6 class="text-primary mb-2 mt-3">Información Académica</h6>
                <p><strong>Modalidad:</strong> ${matricula.modalidad || 'No especificada'}</p>
                <p><strong>Jornada:</strong> ${matricula.jornada || 'No especificada'}</p>
                <p><strong>Tipo de Estudiante:</strong> ${matricula.tipoEstudiante || 'No especificado'}</p>
                
                <h6 class="text-primary mb-2 mt-3">Información de Matrícula</h6>
                <p><strong>Fecha de Matrícula:</strong> ${formatDate(matricula.fechaMatricula)}</p>
                <p><strong>Estado:</strong> ${matricula.estado}</p>
                ${costo > 0 ? `
                    <p><strong>Costo:</strong> ${formatCurrency(costo)}</p>
                    ${descuento > 0 ? `<p><strong>Descuento:</strong> ${descuento}%</p>` : ''}
                    <p><strong>Costo Final:</strong> ${formatCurrency(costoFinal)}</p>
                ` : ''}
                ${matricula.metodoPago ? `<p><strong>Método de Pago:</strong> ${matricula.metodoPago}</p>` : ''}
                ${matricula.numeroRecibo ? `<p><strong>Recibo:</strong> ${matricula.numeroRecibo}</p>` : ''}
                
                ${documentos.length > 0 ? `
                    <h6 class="text-primary mb-2 mt-3">Documentos Entregados</h6>
                    <ul class="list-unstyled">
                        ${documentos.map(doc => `<li><i class="fas fa-check text-success me-2"></i>${doc}</li>`).join('')}
                    </ul>
                ` : ''}
                
                ${matricula.observaciones ? `
                    <h6 class="text-primary mb-2 mt-3">Observaciones</h6>
                    <p>${matricula.observaciones}</p>
                ` : ''}
                
                <p class="mt-3"><strong>Fecha de Registro:</strong> ${formatDate(matricula.fechaMatricula)}</p>
            </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showConfirmButton: false,
        width: '700px'
    });
}

// Función para guardar matrícula
function saveMatricula() {
    const form = document.getElementById('matriculaForm');
    
    if (!validateForm(form)) {
        showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const matriculaData = {};
    
    // Procesar datos del formulario
    for (let [key, value] of formData.entries()) {
        if (key === 'documentos') {
            if (!matriculaData.documentos) matriculaData.documentos = [];
            matriculaData.documentos.push(value);
        } else {
            matriculaData[key] = value;
        }
    }
    
    // Si no hay documentos seleccionados, establecer array vacío
    if (!matriculaData.documentos) {
        matriculaData.documentos = [];
    }
    
    const matriculaId = document.getElementById('matriculaId').value;
    
    try {
        if (matriculaId) {
            // Actualizar matrícula existente
            db.updateMatricula(matriculaId, matriculaData);
            showAlert.success('¡Actualizada!', 'Matrícula actualizada correctamente');
        } else {
            // Crear nueva matrícula
            db.insertMatricula(matriculaData);
            showAlert.success('¡Guardada!', 'Matrícula registrada correctamente');
        }
        
        // Cerrar modal y actualizar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('matriculaModal'));
        modal.hide();
        
        loadMatriculasData();
        
    } catch (error) {
        console.error('Error al guardar matrícula:', error);
        showAlert.error('Error', 'No se pudo guardar la matrícula');
    }
}

// Función para eliminar matrícula
function deleteMatricula(id) {
    const matricula = db.getMatriculaById(id);
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    const estudiante = db.getEstudianteById(matricula.estudianteId);
    const estudianteNombre = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante';
    
    showAlert.confirm(
        '¿Eliminar Matrícula?',
        `¿Estás seguro de que deseas eliminar la matrícula de ${estudianteNombre}?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.deleteMatricula(id);
                showAlert.success('¡Eliminada!', 'Matrícula eliminada correctamente');
                loadMatriculasData();
            } catch (error) {
                console.error('Error al eliminar matrícula:', error);
                showAlert.error('Error', 'No se pudo eliminar la matrícula');
            }
        }
    });
}

// Función para imprimir matrícula
function printMatricula(id) {
    const matricula = db.getMatriculaById(id);
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    const estudiante = db.getEstudianteById(matricula.estudianteId);
    const costo = parseFloat(matricula.costoMatricula) || 0;
    const descuento = parseFloat(matricula.descuento) || 0;
    const costoFinal = costo * (1 - descuento / 100);
    
    const printData = [{
        'Número de Matrícula': matricula.id,
        'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
        'Grado': getGradoText(matricula.grado),
        'Año Lectivo': matricula.anoLectivo,
        'Modalidad': matricula.modalidad || '',
        'Jornada': matricula.jornada || '',
        'Estado': matricula.estado,
        'Fecha de Matrícula': formatDateShort(matricula.fechaMatricula),
        'Costo': costo > 0 ? formatCurrency(costoFinal) : 'N/A'
    }];
    
    exportToPDF(`Matrícula #${matricula.id}`, printData, [
        { key: 'Número de Matrícula', header: 'Matrícula', width: 30 },
        { key: 'Estudiante', header: 'Estudiante', width: 60 },
        { key: 'Grado', header: 'Grado', width: 30 },
        { key: 'Estado', header: 'Estado', width: 30 }
    ]);
}

// Funciones de filtrado y navegación
function filterMatriculas() {
    currentMatriculasPage = 1;
    renderMatriculasGrid();
}

function clearMatriculasFilters() {
    document.getElementById('searchMatriculas').value = '';
    document.getElementById('filterGradoMatricula').value = '';
    document.getElementById('filterEstadoMatricula').value = '';
    document.getElementById('filterAnoLectivo').value = '';
    document.getElementById('filterModalidad').value = '';
    filterMatriculas();
}

function changeMatriculasPage(page) {
    currentMatriculasPage = page;
    renderMatriculasGrid();
}

// Función para exportar matrículas
function exportMatriculas() {
    if (matriculasData.length === 0) {
        showAlert.warning('Sin Datos', 'No hay matrículas para exportar');
        return;
    }
    
    const dataToExport = matriculasData.map(matricula => {
        const estudiante = db.getEstudianteById(matricula.estudianteId);
        const costo = parseFloat(matricula.costoMatricula) || 0;
        const descuento = parseFloat(matricula.descuento) || 0;
        const costoFinal = costo * (1 - descuento / 100);
        
        return {
            'ID': matricula.id,
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            'Grado': getGradoText(matricula.grado),
            'Año Lectivo': matricula.anoLectivo,
            'Modalidad': matricula.modalidad || '',
            'Jornada': matricula.jornada || '',
            'Tipo de Estudiante': matricula.tipoEstudiante || '',
            'Estado': matricula.estado,
            'Fecha de Matrícula': formatDateShort(matricula.fechaMatricula),
            'Costo Original': costo > 0 ? costo : '',
            'Descuento (%)': matricula.descuento || '0',
            'Costo Final': costo > 0 ? costoFinal : '',
            'Método de Pago': matricula.metodoPago || '',
            'Número de Recibo': matricula.numeroRecibo || '',
            'Observaciones': matricula.observaciones || ''
        };
    });
    
    exportToExcel('Registro de Matrículas', dataToExport, 'matriculas');
}

// Función para generar reporte de matrículas
function generateReporteMatriculas() {
    const matriculas = db.getMatriculas();
    
    if (matriculas.length === 0) {
        showAlert.warning('Sin Datos', 'No hay matrículas para generar reporte');
        return;
    }
    
    // Reporte por estado
    const reportePorEstado = {};
    matriculas.forEach(m => {
        reportePorEstado[m.estado] = (reportePorEstado[m.estado] || 0) + 1;
    });
    
    const estadosData = Object.keys(reportePorEstado).map(estado => ({
        'Estado': estado,
        'Cantidad': reportePorEstado[estado],
        'Porcentaje': ((reportePorEstado[estado] / matriculas.length) * 100).toFixed(2) + '%'
    }));
    
    exportToExcel('Reporte de Matrículas por Estado', estadosData, 'reporte_matriculas_estado');
}

// Función para refrescar matrículas
function refreshMatriculas() {
    loadMatriculasData();
    loadEstudiantesMatriculaSelect();
    showAlert.success('¡Actualizado!', 'Sistema de matrículas actualizado');
}

// Exponer funciones globalmente
window.loadMatriculasSection = loadMatriculasSection;
window.showAddMatriculaModal = showAddMatriculaModal;
window.editMatricula = editMatricula;
window.viewMatricula = viewMatricula;
window.saveMatricula = saveMatricula;
window.deleteMatricula = deleteMatricula;
window.printMatricula = printMatricula;
window.filterMatriculas = filterMatriculas;
window.clearMatriculasFilters = clearMatriculasFilters;
window.changeMatriculasPage = changeMatriculasPage;
window.exportMatriculas = exportMatriculas;
window.generateReporteMatriculas = generateReporteMatriculas;
window.refreshMatriculas = refreshMatriculas;
