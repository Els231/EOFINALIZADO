/**
 * Módulo de gestión de notas
 * Sistema completo de CRUD para notas con cálculo de promedios
 */

let currentNotasPage = 1;
const notasPerPage = 15;
let notasFilters = {};
let notasSearchQuery = '';

// Función principal para cargar la sección de notas
function loadNotasSection() {
    const section = document.getElementById('notas-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-star me-2"></i>
                    Sistema de Notas
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showNotaModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Nota
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportNotas()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="showCalculadoraPromedio()">
                            <i class="fas fa-calculator me-1"></i> Calculadora
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
                        <input type="text" class="form-control" id="notas-search" 
                               placeholder="Buscar estudiante..."
                               onkeyup="debounce(searchNotas, 300)()">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-grado" onchange="filterNotas()">
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
                    <select class="form-select" id="filter-materia" onchange="filterNotas()">
                        <option value="">Todas las materias</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-periodo" onchange="filterNotas()">
                        <option value="">Todos los períodos</option>
                        <option value="1er Bimestre">1er Bimestre</option>
                        <option value="2do Bimestre">2do Bimestre</option>
                        <option value="3er Bimestre">3er Bimestre</option>
                        <option value="4to Bimestre">4to Bimestre</option>
                        <option value="Primer Parcial">Primer Parcial</option>
                        <option value="Segundo Parcial">Segundo Parcial</option>
                        <option value="Examen Final">Examen Final</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filter-profesor" onchange="filterNotas()">
                        <option value="">Todos los profesores</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-outline-secondary w-100" onclick="clearNotasFilters()">
                        <i class="fas fa-times"></i>
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
                                <div class="h4 mb-0" id="total-notas">0</div>
                                <div class="small">Total de Notas</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-star fa-2x"></i>
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
                                <div class="h4 mb-0" id="promedio-general">0.0</div>
                                <div class="small">Promedio General</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-chart-line fa-2x"></i>
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
                                <div class="h4 mb-0" id="estudiantes-evaluados">0</div>
                                <div class="small">Estudiantes Evaluados</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-user-graduate fa-2x"></i>
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
                                <div class="h4 mb-0" id="notas-excelencia">0</div>
                                <div class="small">Notas de Excelencia (90+)</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-trophy fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pestañas de vista -->
        <ul class="nav nav-tabs mb-3" id="notasTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="notas-lista-tab" data-bs-toggle="tab" data-bs-target="#notas-lista" type="button" role="tab">
                    <i class="fas fa-list me-2"></i> Lista de Notas
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="notas-boletines-tab" data-bs-toggle="tab" data-bs-target="#notas-boletines" type="button" role="tab">
                    <i class="fas fa-file-alt me-2"></i> Boletines
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="notas-estadisticas-tab" data-bs-toggle="tab" data-bs-target="#notas-estadisticas" type="button" role="tab">
                    <i class="fas fa-chart-bar me-2"></i> Estadísticas
                </button>
            </li>
        </ul>

        <!-- Contenido de las pestañas -->
        <div class="tab-content" id="notasTabContent">
            <!-- Lista de notas -->
            <div class="tab-pane fade show active" id="notas-lista" role="tabpanel">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            Registro de Notas
                            <span class="badge bg-primary ms-2" id="notas-count">0</span>
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Estudiante</th>
                                        <th>Materia</th>
                                        <th>Período</th>
                                        <th>Nota</th>
                                        <th>Literal</th>
                                        <th>Profesor</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="notas-tbody">
                                    <!-- Datos se cargan aquí -->
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Paginación -->
                        <nav aria-label="Paginación de notas">
                            <ul class="pagination justify-content-center" id="notas-pagination">
                                <!-- Paginación se genera aquí -->
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- Boletines -->
            <div class="tab-pane fade" id="notas-boletines" role="tabpanel">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Generación de Boletines</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="boletin-estudiante" class="form-label">Seleccionar Estudiante</label>
                                    <select class="form-select" id="boletin-estudiante">
                                        <option value="">Seleccionar estudiante...</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="boletin-periodo" class="form-label">Período</label>
                                    <select class="form-select" id="boletin-periodo">
                                        <option value="">Seleccionar período...</option>
                                        <option value="1er Bimestre">1er Bimestre</option>
                                        <option value="2do Bimestre">2do Bimestre</option>
                                        <option value="3er Bimestre">3er Bimestre</option>
                                        <option value="4to Bimestre">4to Bimestre</option>
                                        <option value="Final">Notas Finales</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">&nbsp;</label>
                                    <button type="button" class="btn btn-primary w-100" onclick="generarBoletin()">
                                        <i class="fas fa-file-pdf me-1"></i> Generar Boletín
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="boletin-preview" class="mt-4" style="display: none;">
                            <!-- Vista previa del boletín -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="tab-pane fade" id="notas-estadisticas" role="tabpanel">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Distribución de Notas</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="notasDistribucionChart" style="height: 300px;"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="m-0 font-weight-bold">Promedios por Materia</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="promedioPorMateriaChart" style="height: 300px;"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de nota -->
        <div class="modal fade" id="notaModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="notaModalTitle">
                            <i class="fas fa-star me-2"></i>
                            Nueva Nota
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="notaForm">
                            <input type="hidden" id="nota-id">
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="nota-estudiante" class="form-label">Estudiante *</label>
                                        <select class="form-select" id="nota-estudiante" required>
                                            <option value="">Seleccionar estudiante...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-materia" class="form-label">Materia *</label>
                                        <select class="form-select" id="nota-materia" required>
                                            <option value="">Seleccionar materia...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-profesor" class="form-label">Profesor *</label>
                                        <select class="form-select" id="nota-profesor" required>
                                            <option value="">Seleccionar profesor...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-periodo" class="form-label">Período *</label>
                                        <select class="form-select" id="nota-periodo" required>
                                            <option value="">Seleccionar período...</option>
                                            <option value="1er Bimestre">1er Bimestre</option>
                                            <option value="2do Bimestre">2do Bimestre</option>
                                            <option value="3er Bimestre">3er Bimestre</option>
                                            <option value="4to Bimestre">4to Bimestre</option>
                                            <option value="Primer Parcial">Primer Parcial</option>
                                            <option value="Segundo Parcial">Segundo Parcial</option>
                                            <option value="Examen Final">Examen Final</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-fecha" class="form-label">Fecha de Registro *</label>
                                        <input type="date" class="form-control" id="nota-fecha" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-valor" class="form-label">Nota (0-100) *</label>
                                        <input type="number" class="form-control" id="nota-valor" 
                                               min="0" max="100" step="0.01" required onchange="updateNotaLiteral()">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nota-literal" class="form-label">Literal</label>
                                        <input type="text" class="form-control" id="nota-literal" readonly>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="nota-comentarios" class="form-label">Comentarios</label>
                                <textarea class="form-control" id="nota-comentarios" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveNota()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de calculadora de promedio -->
        <div class="modal fade" id="calculadoraModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calculator me-2"></i>
                            Calculadora de Promedios
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="calc-estudiante" class="form-label">Estudiante</label>
                                    <select class="form-select" id="calc-estudiante" onchange="calcularPromedio()">
                                        <option value="">Seleccionar estudiante...</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="calc-periodo" class="form-label">Período</label>
                                    <select class="form-select" id="calc-periodo" onchange="calcularPromedio()">
                                        <option value="">Todos los períodos</option>
                                        <option value="1er Bimestre">1er Bimestre</option>
                                        <option value="2do Bimestre">2do Bimestre</option>
                                        <option value="3er Bimestre">3er Bimestre</option>
                                        <option value="4to Bimestre">4to Bimestre</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div id="calculadora-resultados">
                            <!-- Resultados se muestran aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    loadNotasData();
    loadSelectOptions();
    updateNotasStats();
    loadNotasCharts();
}

// Función para cargar datos de notas
function loadNotasData() {
    try {
        const allNotas = db.read('notas');
        let filteredNotas = allNotas;

        // Aplicar búsqueda
        if (notasSearchQuery) {
            const estudiantes = db.read('estudiantes');
            const estudiantesIds = estudiantes
                .filter(e => searchInText(`${e.nombre} ${e.apellido}`, notasSearchQuery))
                .map(e => e.id);
            
            filteredNotas = filteredNotas.filter(nota => 
                estudiantesIds.includes(nota.estudiante_id)
            );
        }

        // Aplicar filtros
        if (notasFilters.grado) {
            const estudiantes = db.read('estudiantes');
            const estudiantesGrado = estudiantes
                .filter(e => e.grado === notasFilters.grado)
                .map(e => e.id);
            
            filteredNotas = filteredNotas.filter(nota => 
                estudiantesGrado.includes(nota.estudiante_id)
            );
        }

        ['materia_id', 'periodo', 'profesor_id'].forEach(field => {
            if (notasFilters[field]) {
                filteredNotas = filteredNotas.filter(nota => nota[field] === notasFilters[field]);
            }
        });

        // Actualizar contador
        document.getElementById('notas-count').textContent = filteredNotas.length;

        // Paginar resultados
        const paginatedData = paginate(filteredNotas, currentNotasPage, notasPerPage);
        
        // Renderizar tabla
        renderNotasTable(paginatedData.data);
        
        // Renderizar paginación
        renderNotasPagination(paginatedData);

    } catch (error) {
        console.error('Error cargando notas:', error);
        showGlobalAlert('Error al cargar datos de notas', 'error');
    }
}

// Función para renderizar tabla de notas
function renderNotasTable(notas) {
    const tbody = document.getElementById('notas-tbody');
    
    if (notas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="empty-state">
                        <i class="fas fa-star fa-3x text-muted mb-3"></i>
                        <h5>No hay notas registradas</h5>
                        <p class="text-muted">Comience agregando una nueva nota</p>
                        <button type="button" class="btn btn-primary" onclick="showNotaModal()">
                            <i class="fas fa-plus me-1"></i> Agregar Nota
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const estudiantes = db.read('estudiantes');
    const materias = db.read('materias');
    const profesores = db.read('profesores');
    
    tbody.innerHTML = notas.map(nota => {
        const estudiante = estudiantes.find(e => e.id === nota.estudiante_id);
        const materia = materias.find(m => m.id === nota.materia_id);
        const profesor = profesores.find(p => p.id === nota.profesor_id);
        const literal = getNotaLiteral(nota.nota);
        const colorNota = getNotaColor(nota.nota);
        
        return `
            <tr>
                <td>
                    ${estudiante ? 
                        `<div class="fw-bold">${estudiante.nombre} ${estudiante.apellido}</div>
                         <small class="text-muted">${estudiante.grado}° Grado</small>` : 
                        '<span class="text-danger">Estudiante no encontrado</span>'
                    }
                </td>
                <td>
                    <span class="badge bg-primary">${materia ? materia.nombre : 'No encontrada'}</span>
                </td>
                <td>${nota.periodo}</td>
                <td>
                    <span class="badge" style="background-color: ${colorNota}; color: white;">
                        ${parseFloat(nota.nota).toFixed(1)}
                    </span>
                </td>
                <td>
                    <span class="fw-bold" style="color: ${colorNota};">${literal}</span>
                </td>
                <td>${profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No asignado'}</td>
                <td>${formatDateShort(nota.fecha_registro)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editNota('${nota.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="viewNota('${nota.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="deleteNota('${nota.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Función para renderizar paginación
function renderNotasPagination(paginatedData) {
    const pagination = document.getElementById('notas-pagination');
    
    if (paginatedData.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // Botón anterior
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasPrev ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeNotasPage(${currentNotasPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = 1; i <= paginatedData.totalPages; i++) {
        if (i === currentNotasPage || 
            i === 1 || 
            i === paginatedData.totalPages || 
            (i >= currentNotasPage - 1 && i <= currentNotasPage + 1)) {
            
            paginationHtml += `
                <li class="page-item ${i === currentNotasPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeNotasPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentNotasPage - 2 || i === currentNotasPage + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botón siguiente
    paginationHtml += `
        <li class="page-item ${!paginatedData.hasNext ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeNotasPage(${currentNotasPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHtml;
}

// Función para cargar opciones de selects
function loadSelectOptions() {
    const estudiantes = db.read('estudiantes').filter(e => e.estado === 'Activo');
    const materias = db.read('materias').filter(m => m.activa);
    const profesores = db.read('profesores').filter(p => p.estado === 'Activo');
    
    // Cargar estudiantes
    const estudianteSelects = [
        document.getElementById('nota-estudiante'),
        document.getElementById('boletin-estudiante'),
        document.getElementById('calc-estudiante')
    ];
    
    estudianteSelects.forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Seleccionar estudiante...</option>';
            estudiantes.forEach(estudiante => {
                const option = document.createElement('option');
                option.value = estudiante.id;
                option.textContent = `${estudiante.nombre} ${estudiante.apellido} - ${estudiante.grado}° Grado`;
                select.appendChild(option);
            });
        }
    });
    
    // Cargar materias
    const materiaSelects = [
        document.getElementById('nota-materia'),
        document.getElementById('filter-materia')
    ];
    
    materiaSelects.forEach(select => {
        if (select) {
            const isFilter = select.id === 'filter-materia';
            if (!isFilter) {
                select.innerHTML = '<option value="">Seleccionar materia...</option>';
            }
            
            materias.forEach(materia => {
                const option = document.createElement('option');
                option.value = materia.id;
                option.textContent = materia.nombre;
                select.appendChild(option);
            });
        }
    });
    
    // Cargar profesores
    const profesorSelects = [
        document.getElementById('nota-profesor'),
        document.getElementById('filter-profesor')
    ];
    
    profesorSelects.forEach(select => {
        if (select) {
            const isFilter = select.id === 'filter-profesor';
            if (!isFilter) {
                select.innerHTML = '<option value="">Seleccionar profesor...</option>';
            }
            
            profesores.forEach(profesor => {
                const option = document.createElement('option');
                option.value = profesor.id;
                option.textContent = `${profesor.nombre} ${profesor.apellido}`;
                select.appendChild(option);
            });
        }
    });
}

// Función para actualizar estadísticas de notas
function updateNotasStats() {
    try {
        const notas = db.read('notas');
        const estudiantes = db.read('estudiantes');
        
        // Total notas
        document.getElementById('total-notas').textContent = notas.length;
        
        // Promedio general
        const promedio = notas.length > 0 ? 
            notas.reduce((sum, nota) => sum + parseFloat(nota.nota), 0) / notas.length : 0;
        document.getElementById('promedio-general').textContent = promedio.toFixed(1);
        
        // Estudiantes evaluados
        const estudiantesEvaluados = new Set(notas.map(n => n.estudiante_id));
        document.getElementById('estudiantes-evaluados').textContent = estudiantesEvaluados.size;
        
        // Notas de excelencia
        const notasExcelencia = notas.filter(n => parseFloat(n.nota) >= 90);
        document.getElementById('notas-excelencia').textContent = notasExcelencia.length;
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

// Función para obtener literal de nota
function getNotaLiteral(nota) {
    const valor = parseFloat(nota);
    if (valor >= 90) return 'A';
    if (valor >= 80) return 'B';
    if (valor >= 70) return 'C';
    if (valor >= 60) return 'D';
    return 'F';
}

// Función para obtener color de nota
function getNotaColor(nota) {
    const valor = parseFloat(nota);
    if (valor >= 90) return '#28a745'; // Verde
    if (valor >= 80) return '#17a2b8'; // Azul
    if (valor >= 70) return '#ffc107'; // Amarillo
    if (valor >= 60) return '#fd7e14'; // Naranja
    return '#dc3545'; // Rojo
}

// Función para actualizar literal automáticamente
function updateNotaLiteral() {
    const nota = document.getElementById('nota-valor').value;
    const literal = document.getElementById('nota-literal');
    
    if (nota) {
        literal.value = getNotaLiteral(nota);
    } else {
        literal.value = '';
    }
}

// Función para mostrar modal de nota
function showNotaModal(notaId = null) {
    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    const title = document.getElementById('notaModalTitle');
    const form = document.getElementById('notaForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('nota-id').value = '';
    document.getElementById('nota-literal').value = '';
    
    if (notaId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-star me-2"></i>Editar Nota';
        const nota = db.find('notas', notaId);
        
        if (nota) {
            document.getElementById('nota-id').value = nota.id;
            document.getElementById('nota-estudiante').value = nota.estudiante_id;
            document.getElementById('nota-materia').value = nota.materia_id;
            document.getElementById('nota-profesor').value = nota.profesor_id;
            document.getElementById('nota-periodo').value = nota.periodo;
            document.getElementById('nota-fecha').value = nota.fecha_registro;
            document.getElementById('nota-valor').value = nota.nota;
            document.getElementById('nota-literal').value = getNotaLiteral(nota.nota);
            document.getElementById('nota-comentarios').value = nota.comentarios || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-star me-2"></i>Nueva Nota';
        document.getElementById('nota-fecha').value = new Date().toISOString().split('T')[0];
    }
    
    modal.show();
}

// Función para guardar nota
function saveNota() {
    try {
        const form = document.getElementById('notaForm');
        
        const notaData = {
            estudiante_id: document.getElementById('nota-estudiante').value,
            materia_id: document.getElementById('nota-materia').value,
            profesor_id: document.getElementById('nota-profesor').value,
            periodo: document.getElementById('nota-periodo').value,
            nota: parseFloat(document.getElementById('nota-valor').value),
            fecha_registro: document.getElementById('nota-fecha').value,
            comentarios: document.getElementById('nota-comentarios').value.trim()
        };
        
        // Validaciones
        const validationRules = {
            estudiante_id: { required: true, label: 'Estudiante' },
            materia_id: { required: true, label: 'Materia' },
            profesor_id: { required: true, label: 'Profesor' },
            periodo: { required: true, label: 'Período' },
            nota: { required: true, type: 'number', min: 0, max: 100, label: 'Nota' },
            fecha_registro: { required: true, type: 'date', label: 'Fecha de registro' }
        };
        
        const errors = validateFormData(notaData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        const notaId = document.getElementById('nota-id').value;
        
        if (notaId) {
            // Actualizar nota existente
            db.update('notas', notaId, notaData);
            showGlobalAlert('Nota actualizada correctamente', 'success');
        } else {
            // Crear nueva nota
            db.create('notas', notaData);
            showGlobalAlert('Nota registrada correctamente', 'success');
        }
        
        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(document.getElementById('notaModal'));
        modal.hide();
        loadNotasData();
        updateNotasStats();
        loadNotasCharts();
        
    } catch (error) {
        console.error('Error guardando nota:', error);
        showGlobalAlert('Error al guardar nota: ' + error.message, 'error');
    }
}

// Función para editar nota
function editNota(notaId) {
    showNotaModal(notaId);
}

// Función para ver detalles de nota
function viewNota(notaId) {
    const nota = db.find('notas', notaId);
    if (!nota) {
        showGlobalAlert('Nota no encontrada', 'error');
        return;
    }
    
    const estudiantes = db.read('estudiantes');
    const materias = db.read('materias');
    const profesores = db.read('profesores');
    
    const estudiante = estudiantes.find(e => e.id === nota.estudiante_id);
    const materia = materias.find(m => m.id === nota.materia_id);
    const profesor = profesores.find(p => p.id === nota.profesor_id);
    const literal = getNotaLiteral(nota.nota);
    
    Swal.fire({
        title: `Detalles de la Nota`,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Estudiante:</strong></div>
                    <div class="col-6">${estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Materia:</strong></div>
                    <div class="col-6">${materia ? materia.nombre : 'No encontrada'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Profesor:</strong></div>
                    <div class="col-6">${profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No asignado'}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Período:</strong></div>
                    <div class="col-6">${nota.periodo}</div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Nota:</strong></div>
                    <div class="col-6">
                        <span style="color: ${getNotaColor(nota.nota)}; font-weight: bold;">
                            ${parseFloat(nota.nota).toFixed(1)} (${literal})
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Fecha de Registro:</strong></div>
                    <div class="col-6">${formatDate(nota.fecha_registro)}</div>
                </div>
                ${nota.comentarios ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Comentarios:</strong></div>
                        <div class="col-12">${nota.comentarios}</div>
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
            editNota(notaId);
        }
    });
}

// Función para eliminar nota
function deleteNota(notaId) {
    const nota = db.find('notas', notaId);
    if (!nota) {
        showGlobalAlert('Nota no encontrada', 'error');
        return;
    }
    
    confirmAction(
        '¿Eliminar nota?',
        `¿Está seguro de eliminar esta nota? Esta acción no se puede deshacer.`,
        'Sí, eliminar'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('notas', notaId);
                showGlobalAlert('Nota eliminada correctamente', 'success');
                loadNotasData();
                updateNotasStats();
                loadNotasCharts();
            } catch (error) {
                console.error('Error eliminando nota:', error);
                showGlobalAlert('Error al eliminar nota', 'error');
            }
        }
    });
}

// Función para generar boletín
function generarBoletin() {
    const estudianteId = document.getElementById('boletin-estudiante').value;
    const periodo = document.getElementById('boletin-periodo').value;
    
    if (!estudianteId) {
        showGlobalAlert('Debe seleccionar un estudiante', 'warning');
        return;
    }
    
    const estudiante = db.find('estudiantes', estudianteId);
    const notas = db.read('notas');
    const materias = db.read('materias');
    const profesores = db.read('profesores');
    const tutores = db.read('tutores');
    
    const tutor = tutores.find(t => t.id === estudiante.tutor_id);
    
    // Filtrar notas del estudiante
    let notasEstudiante = notas.filter(n => n.estudiante_id === estudianteId);
    
    if (periodo && periodo !== 'Final') {
        notasEstudiante = notasEstudiante.filter(n => n.periodo === periodo);
    }
    
    // Agrupar por materia
    const notasPorMateria = {};
    notasEstudiante.forEach(nota => {
        if (!notasPorMateria[nota.materia_id]) {
            notasPorMateria[nota.materia_id] = [];
        }
        notasPorMateria[nota.materia_id].push(nota);
    });
    
    // Crear vista previa del boletín
    const preview = document.getElementById('boletin-preview');
    let boletinHtml = `
        <div class="border p-4" style="background: white;">
            <div class="text-center mb-4">
                <h4 class="text-primary">Escuela Jesús El Buen Maestro</h4>
                <h5>Boletín de Notas</h5>
                <p class="mb-1"><strong>Período:</strong> ${periodo || 'Consolidado'}</p>
                <p><strong>Año Escolar:</strong> ${new Date().getFullYear()}-${new Date().getFullYear() + 1}</p>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <p><strong>Estudiante:</strong> ${estudiante.nombre} ${estudiante.apellido}</p>
                    <p><strong>Grado:</strong> ${estudiante.grado}° Grado</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Tutor:</strong> ${tutor ? `${tutor.nombre} ${tutor.apellido}` : 'No asignado'}</p>
                    <p><strong>Fecha:</strong> ${formatDate(new Date().toISOString())}</p>
                </div>
            </div>
            
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>Materia</th>
                        <th>Profesor</th>
                        <th>Nota</th>
                        <th>Literal</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let sumaNotas = 0;
    let cantidadMaterias = 0;
    
    Object.entries(notasPorMateria).forEach(([materiaId, notasMateria]) => {
        const materia = materias.find(m => m.id === materiaId);
        const notaPromedio = notasMateria.reduce((sum, n) => sum + parseFloat(n.nota), 0) / notasMateria.length;
        const profesor = profesores.find(p => p.id === notasMateria[0].profesor_id);
        
        sumaNotas += notaPromedio;
        cantidadMaterias++;
        
        boletinHtml += `
            <tr>
                <td>${materia ? materia.nombre : 'Materia no encontrada'}</td>
                <td>${profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No asignado'}</td>
                <td style="color: ${getNotaColor(notaPromedio)}; font-weight: bold;">
                    ${notaPromedio.toFixed(1)}
                </td>
                <td style="color: ${getNotaColor(notaPromedio)}; font-weight: bold;">
                    ${getNotaLiteral(notaPromedio)}
                </td>
                <td>${notasMateria[0].comentarios || ''}</td>
            </tr>
        `;
    });
    
    const promedioGeneral = cantidadMaterias > 0 ? sumaNotas / cantidadMaterias : 0;
    
    boletinHtml += `
                </tbody>
                <tfoot class="table-info">
                    <tr>
                        <th colspan="2">PROMEDIO GENERAL</th>
                        <th style="color: ${getNotaColor(promedioGeneral)}; font-weight: bold;">
                            ${promedioGeneral.toFixed(1)}
                        </th>
                        <th style="color: ${getNotaColor(promedioGeneral)}; font-weight: bold;">
                            ${getNotaLiteral(promedioGeneral)}
                        </th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="text-center">
                        <hr style="width: 200px; margin: 40px auto 5px;">
                        <small>Firma del Profesor</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="text-center">
                        <hr style="width: 200px; margin: 40px auto 5px;">
                        <small>Firma del Tutor</small>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <button type="button" class="btn btn-primary" onclick="imprimirBoletin()">
                    <i class="fas fa-print me-1"></i> Imprimir Boletín
                </button>
                <button type="button" class="btn btn-success" onclick="descargarBoletinPDF()">
                    <i class="fas fa-file-pdf me-1"></i> Descargar PDF
                </button>
            </div>
        </div>
    `;
    
    preview.innerHTML = boletinHtml;
    preview.style.display = 'block';
}

// Función para imprimir boletín
function imprimirBoletin() {
    const boletinContent = document.getElementById('boletin-preview').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Boletín de Notas</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: Arial, sans-serif; }
                @media print { 
                    body { margin: 0; }
                    .btn { display: none !important; }
                }
            </style>
        </head>
        <body>
            ${boletinContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Función para mostrar calculadora de promedio
function showCalculadoraPromedio() {
    const modal = new bootstrap.Modal(document.getElementById('calculadoraModal'));
    modal.show();
}

// Función para calcular promedio
function calcularPromedio() {
    const estudianteId = document.getElementById('calc-estudiante').value;
    const periodo = document.getElementById('calc-periodo').value;
    const resultados = document.getElementById('calculadora-resultados');
    
    if (!estudianteId) {
        resultados.innerHTML = '<p class="text-muted">Seleccione un estudiante para ver sus promedios.</p>';
        return;
    }
    
    const estudiante = db.find('estudiantes', estudianteId);
    const notas = db.read('notas');
    const materias = db.read('materias');
    
    let notasEstudiante = notas.filter(n => n.estudiante_id === estudianteId);
    
    if (periodo) {
        notasEstudiante = notasEstudiante.filter(n => n.periodo === periodo);
    }
    
    // Agrupar por materia
    const promediosPorMateria = {};
    notasEstudiante.forEach(nota => {
        if (!promediosPorMateria[nota.materia_id]) {
            promediosPorMateria[nota.materia_id] = [];
        }
        promediosPorMateria[nota.materia_id].push(parseFloat(nota.nota));
    });
    
    let html = `
        <h6>${estudiante.nombre} ${estudiante.apellido} - ${estudiante.grado}° Grado</h6>
        <p class="text-muted">${periodo || 'Todos los períodos'}</p>
        
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Materia</th>
                        <th>Notas</th>
                        <th>Promedio</th>
                        <th>Literal</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let sumaPromedios = 0;
    let cantidadMaterias = 0;
    
    Object.entries(promediosPorMateria).forEach(([materiaId, notasMateria]) => {
        const materia = materias.find(m => m.id === materiaId);
        const promedio = notasMateria.reduce((sum, nota) => sum + nota, 0) / notasMateria.length;
        
        sumaPromedios += promedio;
        cantidadMaterias++;
        
        html += `
            <tr>
                <td>${materia ? materia.nombre : 'Materia no encontrada'}</td>
                <td>${notasMateria.map(n => n.toFixed(1)).join(', ')}</td>
                <td style="color: ${getNotaColor(promedio)}; font-weight: bold;">
                    ${promedio.toFixed(1)}
                </td>
                <td style="color: ${getNotaColor(promedio)}; font-weight: bold;">
                    ${getNotaLiteral(promedio)}
                </td>
            </tr>
        `;
    });
    
    const promedioGeneral = cantidadMaterias > 0 ? sumaPromedios / cantidadMaterias : 0;
    
    html += `
                </tbody>
                <tfoot class="table-info">
                    <tr>
                        <th>PROMEDIO GENERAL</th>
                        <th>-</th>
                        <th style="color: ${getNotaColor(promedioGeneral)}; font-weight: bold;">
                            ${promedioGeneral.toFixed(1)}
                        </th>
                        <th style="color: ${getNotaColor(promedioGeneral)}; font-weight: bold;">
                            ${getNotaLiteral(promedioGeneral)}
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    resultados.innerHTML = html;
}

// Función para cargar gráficos de notas
function loadNotasCharts() {
    // Gráfico de distribución de notas
    const ctx1 = document.getElementById('notasDistribucionChart');
    if (ctx1) {
        const notas = db.read('notas');
        const rangos = {
            'A (90-100)': 0,
            'B (80-89)': 0,
            'C (70-79)': 0,
            'D (60-69)': 0,
            'F (0-59)': 0
        };
        
        notas.forEach(nota => {
            const valor = parseFloat(nota.nota);
            if (valor >= 90) rangos['A (90-100)']++;
            else if (valor >= 80) rangos['B (80-89)']++;
            else if (valor >= 70) rangos['C (70-79)']++;
            else if (valor >= 60) rangos['D (60-69)']++;
            else rangos['F (0-59)']++;
        });
        
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(rangos),
                datasets: [{
                    data: Object.values(rangos),
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de promedios por materia
    const ctx2 = document.getElementById('promedioPorMateriaChart');
    if (ctx2) {
        const notas = db.read('notas');
        const materias = db.read('materias');
        
        const promediosPorMateria = {};
        materias.forEach(materia => {
            const notasMateria = notas.filter(n => n.materia_id === materia.id);
            if (notasMateria.length > 0) {
                const promedio = notasMateria.reduce((sum, n) => sum + parseFloat(n.nota), 0) / notasMateria.length;
                promediosPorMateria[materia.nombre] = promedio;
            }
        });
        
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(promediosPorMateria),
                datasets: [{
                    label: 'Promedio',
                    data: Object.values(promediosPorMateria),
                    backgroundColor: '#667eea',
                    borderColor: '#5a6fd8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Función de búsqueda
function searchNotas() {
    notasSearchQuery = document.getElementById('notas-search').value.trim();
    currentNotasPage = 1;
    loadNotasData();
}

// Función para filtrar notas
function filterNotas() {
    notasFilters = {
        grado: document.getElementById('filter-grado').value,
        materia_id: document.getElementById('filter-materia').value,
        periodo: document.getElementById('filter-periodo').value,
        profesor_id: document.getElementById('filter-profesor').value
    };
    
    // Remover filtros vacíos
    Object.keys(notasFilters).forEach(key => {
        if (!notasFilters[key]) {
            delete notasFilters[key];
        }
    });
    
    currentNotasPage = 1;
    loadNotasData();
}

// Función para limpiar filtros
function clearNotasFilters() {
    document.getElementById('notas-search').value = '';
    document.getElementById('filter-grado').value = '';
    document.getElementById('filter-materia').value = '';
    document.getElementById('filter-periodo').value = '';
    document.getElementById('filter-profesor').value = '';
    
    notasSearchQuery = '';
    notasFilters = {};
    currentNotasPage = 1;
    loadNotasData();
}

// Función para cambiar página
function changeNotasPage(page) {
    currentNotasPage = page;
    loadNotasData();
}

// Función para exportar notas
function exportNotas() {
    try {
        const notas = db.read('notas');
        const estudiantes = db.read('estudiantes');
        const materias = db.read('materias');
        const profesores = db.read('profesores');
        
        const exportData = notas.map(nota => {
            const estudiante = estudiantes.find(e => e.id === nota.estudiante_id);
            const materia = materias.find(m => m.id === nota.materia_id);
            const profesor = profesores.find(p => p.id === nota.profesor_id);
            
            return {
                'Estudiante': estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado',
                'Grado': estudiante ? `${estudiante.grado}° Grado` : '',
                'Materia': materia ? materia.nombre : 'No encontrada',
                'Profesor': profesor ? `${profesor.nombre} ${profesor.apellido}` : 'No asignado',
                'Período': nota.periodo,
                'Nota': parseFloat(nota.nota).toFixed(1),
                'Literal': getNotaLiteral(nota.nota),
                'Fecha de Registro': formatDateShort(nota.fecha_registro),
                'Comentarios': nota.comentarios || '',
                'Fecha de Creación': formatDateShort(nota.created_at)
            };
        });
        
        exportToExcel(exportData, 'notas', 'Registro de Notas');
        
    } catch (error) {
        console.error('Error exportando notas:', error);
        showGlobalAlert('Error al exportar datos', 'error');
    }
}

// Exportar funciones
window.loadNotasSection = loadNotasSection;
window.showNotaModal = showNotaModal;
window.saveNota = saveNota;
window.editNota = editNota;
window.viewNota = viewNota;
window.deleteNota = deleteNota;
window.generarBoletin = generarBoletin;
window.imprimirBoletin = imprimirBoletin;
window.showCalculadoraPromedio = showCalculadoraPromedio;
window.calcularPromedio = calcularPromedio;
window.updateNotaLiteral = updateNotaLiteral;
window.searchNotas = searchNotas;
window.filterNotas = filterNotas;
window.clearNotasFilters = clearNotasFilters;
window.changeNotasPage = changeNotasPage;
window.exportNotas = exportNotas;

console.log('✅ Notas.js cargado correctamente');
