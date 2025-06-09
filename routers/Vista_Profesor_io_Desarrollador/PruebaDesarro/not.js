/**
 * Módulo de gestión de notas
 * Funcionalidades CRUD para el sistema de calificaciones
 */

let notasData = [];
let currentNotasPage = 1;
const notasPerPage = 15;

// Función principal para cargar la sección de notas
function loadNotasSection() {
    const section = document.getElementById('notas-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-book me-2"></i>
                    Sistema de Notas
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showAddNotaModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Nota
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportNotas()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="generateReporteNotas()">
                            <i class="fas fa-chart-bar me-1"></i> Reporte
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshNotas()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-3">
                    <label for="searchNotas" class="form-label">Buscar Estudiante:</label>
                    <input type="text" class="form-control" id="searchNotas" 
                           placeholder="Nombre del estudiante..." 
                           oninput="filterNotas()">
                </div>
                <div class="col-md-2">
                    <label for="filterGradoNotas" class="form-label">Grado:</label>
                    <select class="form-select" id="filterGradoNotas" onchange="filterNotas()">
                        <option value="">Todos</option>
                        <option value="1">Primer Grado</option>
                        <option value="2">Segundo Grado</option>
                        <option value="3">Tercer Grado</option>
                        <option value="4">Cuarto Grado</option>
                        <option value="5">Quinto Grado</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterCurso" class="form-label">Curso:</label>
                    <select class="form-select" id="filterCurso" onchange="filterNotas()">
                        <option value="">Todos</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterPeriodo" class="form-label">Período:</label>
                    <select class="form-select" id="filterPeriodo" onchange="filterNotas()">
                        <option value="">Todos</option>
                        <option value="1er Trimestre">1er Trimestre</option>
                        <option value="2do Trimestre">2do Trimestre</option>
                        <option value="3er Trimestre">3er Trimestre</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterTipoNota" class="form-label">Tipo:</label>
                    <select class="form-select" id="filterTipoNota" onchange="filterNotas()">
                        <option value="">Todos</option>
                        <option value="Examen">Examen</option>
                        <option value="Tarea">Tarea</option>
                        <option value="Proyecto">Proyecto</option>
                        <option value="Participación">Participación</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearNotasFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="promedio-general">0</h3>
                        <p class="mb-0">Promedio General</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="total-notas">0</h3>
                        <p class="mb-0">Total Notas</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="estudiantes-bajo-promedio">0</h3>
                        <p class="mb-0">Bajo Promedio</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body text-center">
                        <h3 class="card-number" id="notas-mes">0</h3>
                        <p class="mb-0">Notas Este Mes</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de notas -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Registro de Calificaciones</h6>
            </div>
            <div class="card-body">
                <div id="notasTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="notasPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar nota -->
        <div class="modal fade" id="notaModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="notaModalTitle">
                            <i class="fas fa-star me-2"></i>
                            Nueva Calificación
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="notaForm">
                            <input type="hidden" id="notaId">
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="estudianteSelect" class="form-label">Estudiante *</label>
                                        <select class="form-select" id="estudianteSelect" name="estudianteId" required>
                                            <option value="">Seleccionar estudiante</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="cursoSelect" class="form-label">Curso *</label>
                                        <select class="form-select" id="cursoSelect" name="cursoId" required>
                                            <option value="">Seleccionar curso</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="calificacion" class="form-label">Calificación *</label>
                                        <input type="number" class="form-control" id="calificacion" name="calificacion" 
                                               min="0" max="100" step="0.1" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tipoEvaluacion" class="form-label">Tipo de Evaluación *</label>
                                        <select class="form-select" id="tipoEvaluacion" name="tipoEvaluacion" required>
                                            <option value="">Seleccionar tipo</option>
                                            <option value="Examen">Examen</option>
                                            <option value="Tarea">Tarea</option>
                                            <option value="Proyecto">Proyecto</option>
                                            <option value="Participación">Participación</option>
                                            <option value="Quiz">Quiz</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="periodo" class="form-label">Período *</label>
                                        <select class="form-select" id="periodo" name="periodo" required>
                                            <option value="">Seleccionar período</option>
                                            <option value="1er Trimestre">1er Trimestre</option>
                                            <option value="2do Trimestre">2do Trimestre</option>
                                            <option value="3er Trimestre">3er Trimestre</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaEvaluacion" class="form-label">Fecha de Evaluación *</label>
                                        <input type="date" class="form-control" id="fechaEvaluacion" name="fechaEvaluacion" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="peso" class="form-label">Peso (%) *</label>
                                        <input type="number" class="form-control" id="peso" name="peso" 
                                               min="1" max="100" value="100" required>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="descripcion" name="descripcion" 
                                       placeholder="Ej: Examen de matemáticas - Capítulo 3">
                            </div>

                            <div class="mb-3">
                                <label for="observaciones" class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
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
    `;
    
    // Cargar datos
    loadNotasData();
    loadCursosSelect();
    loadEstudiantesSelect();
}

// Función para cargar datos de notas
function loadNotasData() {
    try {
        notasData = db.getNotas();
        renderNotasTable();
        updateNotasStats();
    } catch (error) {
        console.error('Error al cargar notas:', error);
        showAlert.error('Error', 'No se pudieron cargar los datos de notas');
    }
}

// Función para cargar estudiantes en el select
function loadEstudiantesSelect() {
    const estudiantesSelect = document.getElementById('estudianteSelect');
    if (!estudiantesSelect) return;
    
    const estudiantes = db.getEstudiantes().filter(e => e.estado === 'Activo');
    estudiantesSelect.innerHTML = '<option value="">Seleccionar estudiante</option>';
    
    estudiantes.forEach(estudiante => {
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${estudiante.nombres} ${estudiante.apellidos} - ${getGradoText(estudiante.grado)}`;
        estudiantesSelect.appendChild(option);
    });
}

// Función para cargar cursos en el select
function loadCursosSelect() {
    const cursosSelect = document.getElementById('cursoSelect');
    const filterCurso = document.getElementById('filterCurso');
    
    const cursos = db.getCursos();
    
    if (cursosSelect) {
        cursosSelect.innerHTML = '<option value="">Seleccionar curso</option>';
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = `${curso.nombre} - ${getGradoText(curso.grado)}`;
            cursosSelect.appendChild(option);
        });
    }
    
    if (filterCurso) {
        filterCurso.innerHTML = '<option value="">Todos</option>';
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = `${curso.nombre} - ${getGradoText(curso.grado)}`;
            filterCurso.appendChild(option);
        });
    }
}

// Función para actualizar estadísticas de notas
function updateNotasStats() {
    const notas = db.getNotas();
    const estudiantes = db.getEstudiantes();
    
    // Promedio general
    const promedioGeneral = notas.length > 0 
        ? (notas.reduce((sum, nota) => sum + parseFloat(nota.calificacion), 0) / notas.length).toFixed(1)
        : 0;
    
    // Total de notas
    const totalNotas = notas.length;
    
    // Estudiantes bajo promedio (menos de 70)
    const estudiantesBajoPromedio = calcularEstudiantesBajoPromedio(notas, estudiantes);
    
    // Notas este mes
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const notasMes = notas.filter(nota => new Date(nota.fechaEvaluacion) >= inicioMes).length;
    
    // Actualizar UI
    document.getElementById('promedio-general').textContent = promedioGeneral;
    document.getElementById('total-notas').textContent = totalNotas;
    document.getElementById('estudiantes-bajo-promedio').textContent = estudiantesBajoPromedio;
    document.getElementById('notas-mes').textContent = notasMes;
}

// Función para calcular estudiantes bajo promedio
function calcularEstudiantesBajoPromedio(notas, estudiantes) {
    const promediosPorEstudiante = {};
    
    // Calcular promedio por estudiante
    notas.forEach(nota => {
        if (!promediosPorEstudiante[nota.estudianteId]) {
            promediosPorEstudiante[nota.estudianteId] = [];
        }
        promediosPorEstudiante[nota.estudianteId].push(parseFloat(nota.calificacion));
    });
    
    let estudiantesBajoPromedio = 0;
    Object.keys(promediosPorEstudiante).forEach(estudianteId => {
        const calificaciones = promediosPorEstudiante[estudianteId];
        const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
        if (promedio < 70) {
            estudiantesBajoPromedio++;
        }
    });
    
    return estudiantesBajoPromedio;
}

// Función para renderizar tabla de notas
function renderNotasTable() {
    const container = document.getElementById('notasTableContainer');
    
    if (notasData.length === 0) {
        showEmptyState(container, 'No hay calificaciones registradas', 'fas fa-star');
        return;
    }
    
    // Aplicar filtros
    let filteredData = [...notasData];
    
    const searchTerm = document.getElementById('searchNotas')?.value;
    const gradoFilter = document.getElementById('filterGradoNotas')?.value;
    const cursoFilter = document.getElementById('filterCurso')?.value;
    const periodoFilter = document.getElementById('filterPeriodo')?.value;
    const tipoFilter = document.getElementById('filterTipoNota')?.value;
    
    // Filtrar por búsqueda de estudiante
    if (searchTerm) {
        const estudiantes = db.getEstudiantes();
        const estudiantesIds = estudiantes
            .filter(e => 
                e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(e => e.id);
        filteredData = filteredData.filter(nota => estudiantesIds.includes(nota.estudianteId));
    }
    
    // Filtrar por grado
    if (gradoFilter) {
        const estudiantes = db.getEstudiantes().filter(e => e.grado == gradoFilter);
        const estudiantesIds = estudiantes.map(e => e.id);
        filteredData = filteredData.filter(nota => estudiantesIds.includes(nota.estudianteId));
    }
    
    // Otros filtros
    if (cursoFilter) filteredData = filteredData.filter(n => n.cursoId == cursoFilter);
    if (periodoFilter) filteredData = filteredData.filter(n => n.periodo === periodoFilter);
    if (tipoFilter) filteredData = filteredData.filter(n => n.tipoEvaluacion === tipoFilter);
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentNotasPage, notasPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th onclick="sortNotas('fechaEvaluacion')" style="cursor: pointer;">
                            Fecha <i class="fas fa-sort"></i>
                        </th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th onclick="sortNotas('calificacion')" style="cursor: pointer;">
                            Calificación <i class="fas fa-sort"></i>
                        </th>
                        <th>Tipo</th>
                        <th>Período</th>
                        <th>Peso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(nota => {
        const estudiante = db.getEstudianteById(nota.estudianteId);
        const curso = db.getCursos().find(c => c.id == nota.cursoId);
        const gradeClass = getGradeClass(nota.calificacion);
        
        tableHTML += `
            <tr>
                <td>${formatDateShort(nota.fechaEvaluacion)}</td>
                <td>
                    <div>
                        <div class="fw-bold">${estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante no encontrado'}</div>
                        <small class="text-muted">${estudiante ? getGradoText(estudiante.grado) : ''}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${curso ? curso.nombre : 'Curso no encontrado'}</span>
                </td>
                <td>
                    <span class="fw-bold ${gradeClass}">${nota.calificacion}</span>
                    <small class="d-block text-muted">${getGradeText(nota.calificacion)}</small>
                </td>
                <td>
                    <span class="badge bg-secondary">${nota.tipoEvaluacion}</span>
                </td>
                <td>${nota.periodo}</td>
                <td>${nota.peso}%</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewNota(${nota.id})" 
                                title="Ver Detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="editNota(${nota.id})" 
                                title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteNota(${nota.id})" 
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
    const paginationContainer = document.getElementById('notasPagination');
    paginationContainer.innerHTML = createPagination(
        paginatedData.totalPages, 
        currentNotasPage, 
        'changeNotasPage'
    );
}

// Función para mostrar modal de nueva nota
function showAddNotaModal() {
    document.getElementById('notaModalTitle').innerHTML = 
        '<i class="fas fa-star me-2"></i>Nueva Calificación';
    document.getElementById('notaId').value = '';
    clearForm(document.getElementById('notaForm'));
    
    // Establecer fecha actual
    document.getElementById('fechaEvaluacion').value = new Date().toISOString().split('T')[0];
    document.getElementById('peso').value = '100';
    
    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    modal.show();
}

// Función para editar nota
function editNota(id) {
    const nota = db.getNotaById(id);
    if (!nota) {
        showAlert.error('Error', 'Nota no encontrada');
        return;
    }
    
    document.getElementById('notaModalTitle').innerHTML = 
        '<i class="fas fa-edit me-2"></i>Editar Calificación';
    
    // Llenar formulario
    document.getElementById('notaId').value = nota.id;
    document.getElementById('estudianteSelect').value = nota.estudianteId;
    document.getElementById('cursoSelect').value = nota.cursoId;
    document.getElementById('calificacion').value = nota.calificacion;
    document.getElementById('tipoEvaluacion').value = nota.tipoEvaluacion;
    document.getElementById('periodo').value = nota.periodo;
    document.getElementById('fechaEvaluacion').value = nota.fechaEvaluacion;
    document.getElementById('peso').value = nota.peso || 100;
    document.getElementById('descripcion').value = nota.descripcion || '';
    document.getElementById('observaciones').value = nota.observaciones || '';
    
    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    modal.show();
}

// Función para ver detalles de la nota
function viewNota(id) {
    const nota = db.getNotaById(id);
    if (!nota) {
        showAlert.error('Error', 'Nota no encontrada');
        return;
    }
    
    const estudiante = db.getEstudianteById(nota.estudianteId);
    const curso = db.getCursos().find(c => c.id == nota.cursoId);
    
    Swal.fire({
        title: `Calificación: ${nota.calificacion}`,
        html: `
            <div class="text-start">
                <p><strong>Estudiante:</strong> ${estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado'}</p>
                <p><strong>Curso:</strong> ${curso ? curso.nombre : 'No encontrado'}</p>
                <p><strong>Tipo de Evaluación:</strong> ${nota.tipoEvaluacion}</p>
                <p><strong>Período:</strong> ${nota.periodo}</p>
                <p><strong>Fecha de Evaluación:</strong> ${formatDate(nota.fechaEvaluacion)}</p>
                <p><strong>Peso:</strong> ${nota.peso}%</p>
                <p><strong>Descripción:</strong> ${nota.descripcion || 'No especificada'}</p>
                <p><strong>Observaciones:</strong> ${nota.observaciones || 'Ninguna'}</p>
                <p><strong>Calificación Literaria:</strong> ${getGradeText(nota.calificacion)}</p>
                <p><strong>Fecha de Registro:</strong> ${formatDate(nota.fechaRegistro)}</p>
            </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showConfirmButton: false,
        width: '600px'
    });
}

// Función para guardar nota
function saveNota() {
    const form = document.getElementById('notaForm');
    
    if (!validateForm(form)) {
        showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const notaData = {};
    
    for (let [key, value] of formData.entries()) {
        notaData[key] = value;
    }
    
    // Validar calificación
    const calificacion = parseFloat(notaData.calificacion);
    if (calificacion < 0 || calificacion > 100) {
        showAlert.warning('Calificación Inválida', 'La calificación debe estar entre 0 y 100');
        return;
    }
    
    const notaId = document.getElementById('notaId').value;
    
    try {
        if (notaId) {
            // Actualizar nota existente
            db.updateNota(notaId, notaData);
            showAlert.success('¡Actualizada!', 'Calificación actualizada correctamente');
        } else {
            // Crear nueva nota
            db.insertNota(notaData);
            showAlert.success('¡Guardada!', 'Calificación registrada correctamente');
        }
        
        // Cerrar modal y actualizar tabla
        const modal = bootstrap.Modal.getInstance(document.getElementById('notaModal'));
        modal.hide();
        
        loadNotasData();
        
    } catch (error) {
        console.error('Error al guardar nota:', error);
        showAlert.error('Error', 'No se pudo guardar la calificación');
    }
}

// Función para eliminar nota
function deleteNota(id) {
    const nota = db.getNotaById(id);
    if (!nota) {
        showAlert.error('Error', 'Nota no encontrada');
        return;
    }
    
    const estudiante = db.getEstudianteById(nota.estudianteId);
    const estudianteNombre = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante';
    
    showAlert.confirm(
        '¿Eliminar Calificación?',
        `¿Estás seguro de que deseas eliminar la calificación de ${estudianteNombre}?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.deleteNota(id);
                showAlert.success('¡Eliminada!', 'Calificación eliminada correctamente');
                loadNotasData();
            } catch (error) {
                console.error('Error al eliminar nota:', error);
                showAlert.error('Error', 'No se pudo eliminar la calificación');
            }
        }
    });
}

// Funciones de filtrado y navegación
function filterNotas() {
    currentNotasPage = 1;
    renderNotasTable();
}

function clearNotasFilters() {
    document.getElementById('searchNotas').value = '';
    document.getElementById('filterGradoNotas').value = '';
    document.getElementById('filterCurso').value = '';
    document.getElementById('filterPeriodo').value = '';
    document.getElementById('filterTipoNota').value = '';
    filterNotas();
}

function sortNotas(field) {
    notasData = sortData(notasData, field);
    renderNotasTable();
}

function changeNotasPage(page) {
    currentNotasPage = page;
    renderNotasTable();
}

// Función para exportar notas
function exportNotas() {
    if (notasData.length === 0) {
        showAlert.warning('Sin Datos', 'No hay calificaciones para exportar');
        return;
    }
    
    const dataToExport = notasData.map(nota => {
        const estudiante = db.getEstudianteById(nota.estudianteId);
        const curso = db.getCursos().find(c => c.id == nota.cursoId);
        
        return {
            'Fecha': formatDateShort(nota.fechaEvaluacion),
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            'Grado': estudiante ? getGradoText(estudiante.grado) : '',
            'Curso': curso ? curso.nombre : 'No encontrado',
            'Tipo de Evaluación': nota.tipoEvaluacion,
            'Período': nota.periodo,
            'Calificación': nota.calificacion,
            'Peso (%)': nota.peso,
            'Descripción': nota.descripcion || '',
            'Observaciones': nota.observaciones || '',
            'Fecha de Registro': formatDateShort(nota.fechaRegistro)
        };
    });
    
    exportToExcel('Registro de Calificaciones', dataToExport, 'calificaciones');
}

// Función para generar reporte de notas
function generateReporteNotas() {
    const notas = db.getNotas();
    const estudiantes = db.getEstudiantes();
    const cursos = db.getCursos();
    
    if (notas.length === 0) {
        showAlert.warning('Sin Datos', 'No hay calificaciones para generar reporte');
        return;
    }
    
    // Generar reporte por estudiante
    const reportePorEstudiante = estudiantes.map(estudiante => {
        const notasEstudiante = notas.filter(n => n.estudianteId === estudiante.id);
        const promedio = notasEstudiante.length > 0 
            ? (notasEstudiante.reduce((sum, n) => sum + parseFloat(n.calificacion), 0) / notasEstudiante.length).toFixed(2)
            : 0;
        
        return {
            'Estudiante': `${estudiante.nombres} ${estudiante.apellidos}`,
            'Grado': getGradoText(estudiante.grado),
            'Total Notas': notasEstudiante.length,
            'Promedio': promedio,
            'Estado': promedio >= 70 ? 'Aprobado' : 'Reprobado'
        };
    }).filter(r => r['Total Notas'] > 0);
    
    exportToExcel('Reporte de Calificaciones por Estudiante', reportePorEstudiante, 'reporte_notas_estudiantes');
}

// Función para refrescar notas
function refreshNotas() {
    loadNotasData();
    loadCursosSelect();
    loadEstudiantesSelect();
    showAlert.success('¡Actualizado!', 'Sistema de notas actualizado');
}

// Exponer funciones globalmente
window.loadNotasSection = loadNotasSection;
window.showAddNotaModal = showAddNotaModal;
window.editNota = editNota;
window.viewNota = viewNota;
window.saveNota = saveNota;
window.deleteNota = deleteNota;
window.filterNotas = filterNotas;
window.clearNotasFilters = clearNotasFilters;
window.sortNotas = sortNotas;
window.changeNotasPage = changeNotasPage;
window.exportNotas = exportNotas;
window.generateReporteNotas = generateReporteNotas;
window.refreshNotas = refreshNotas;
