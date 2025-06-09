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
                        <option value="6">Sexto Grado</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterMateria" class="form-label">Materia:</label>
                    <select class="form-select" id="filterMateria" onchange="filterNotas()">
                        <option value="">Todas</option>
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
                        <option value="Quiz">Quiz</option>
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
                                        <label for="materiaSelect" class="form-label">Materia *</label>
                                        <select class="form-select" id="materiaSelect" name="materiaId" required>
                                            <option value="">Seleccionar materia</option>
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
                                <textarea class="form-control" id="observaciones" name="observaciones" rows="2"
                                          placeholder="Observaciones adicionales sobre la evaluación"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveNota()">
                            <i class="fas fa-save me-1"></i> Guardar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadNotasData();
    updateNotasStats();
    loadEstudiantesForNotas();
    loadMateriasForNotas();
}

// Función para cargar datos de notas
function loadNotasData() {
    const savedData = localStorage.getItem('notasData');
    if (savedData) {
        notasData = JSON.parse(savedData);
    } else {
        // Inicializar con datos vacíos
        notasData = [];
    }
    displayNotas();
}

// Función para cargar estudiantes en el selector
function loadEstudiantesForNotas() {
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const matriculasData = JSON.parse(localStorage.getItem('matriculasData')) || [];
    
    // Solo estudiantes con matrícula activa
    const estudiantesActivos = estudiantesData.filter(estudiante => {
        const tieneMatriculaActiva = matriculasData.some(matricula => 
            matricula.estudianteId === estudiante.id && matricula.estado === 'Activa'
        );
        return estudiante.estado === 'Activo' && tieneMatriculaActiva;
    });
    
    const select = document.getElementById('estudianteSelect');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar estudiante</option>';
        estudiantesActivos.forEach(estudiante => {
            select.innerHTML += `
                <option value="${estudiante.id}">
                    ${estudiante.nombres} ${estudiante.apellidos} - ${getGradoFromMatricula(estudiante.id)}
                </option>
            `;
        });
    }
}

// Función para obtener el grado del estudiante desde la matrícula
function getGradoFromMatricula(estudianteId) {
    const matriculasData = JSON.parse(localStorage.getItem('matriculasData')) || [];
    const matricula = matriculasData.find(m => m.estudianteId === estudianteId && m.estado === 'Activa');
    return matricula ? getGradoText(matricula.grado) : '';
}

// Función para cargar materias
function loadMateriasForNotas() {
    // Materias estándar para educación primaria
    const materias = [
        { id: 'MAT', nombre: 'Matemáticas' },
        { id: 'ESP', nombre: 'Lengua Española' },
        { id: 'CN', nombre: 'Ciencias Naturales' },
        { id: 'CS', nombre: 'Ciencias Sociales' },
        { id: 'EF', nombre: 'Educación Física' },
        { id: 'EA', nombre: 'Educación Artística' },
        { id: 'ING', nombre: 'Inglés' },
        { id: 'FM', nombre: 'Formación Humana y Religiosa' },
        { id: 'INF', nombre: 'Informática' }
    ];
    
    const select = document.getElementById('materiaSelect');
    const filterSelect = document.getElementById('filterMateria');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar materia</option>';
        materias.forEach(materia => {
            select.innerHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
        });
    }
    
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">Todas</option>';
        materias.forEach(materia => {
            filterSelect.innerHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
        });
    }
}

// Función para obtener nombre de materia
function getMateriaName(materiaId) {
    const materias = {
        'MAT': 'Matemáticas',
        'ESP': 'Lengua Española',
        'CN': 'Ciencias Naturales',
        'CS': 'Ciencias Sociales',
        'EF': 'Educación Física',
        'EA': 'Educación Artística',
        'ING': 'Inglés',
        'FM': 'Formación Humana y Religiosa',
        'INF': 'Informática'
    };
    return materias[materiaId] || materiaId;
}

// Función para mostrar notas
function displayNotas() {
    const container = document.getElementById('notasTableContainer');
    if (!container) return;

    if (notasData.length === 0) {
        showEmptyState(container, 'No hay notas registradas', 'fas fa-book');
        document.getElementById('notasPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyNotasFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentNotasPage, notasPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Estudiante</th>
                        <th>Materia</th>
                        <th>Calificación</th>
                        <th>Tipo</th>
                        <th>Período</th>
                        <th>Fecha</th>
                        <th>Peso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    
    paginatedData.data.forEach(nota => {
        const estudiante = estudiantesData.find(e => e.id === nota.estudianteId);
        const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado';
        const gradeClass = getGradeClass(nota.calificacion);
        const gradeText = getGradeText(nota.calificacion);
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                            <i class="fas fa-user-graduate text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${nombreCompleto}</div>
                            <small class="text-muted">${getGradoFromMatricula(nota.estudianteId)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">${getMateriaName(nota.materiaId)}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="badge ${gradeClass} me-2">${nota.calificacion}</span>
                        <small class="text-muted">${gradeText}</small>
                    </div>
                </td>
                <td>${nota.tipoEvaluacion}</td>
                <td>${nota.periodo}</td>
                <td>${formatDateShort(nota.fechaEvaluacion)}</td>
                <td>${nota.peso}%</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editNota('${nota.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewNota('${nota.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteNota('${nota.id}')" title="Eliminar">
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
    document.getElementById('notasPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentNotasPage, 'goToNotasPage');
}

// Función para aplicar filtros
function applyNotasFilters() {
    let filtered = [...notasData];
    
    const searchTerm = document.getElementById('searchNotas')?.value?.toLowerCase() || '';
    const gradoFilter = document.getElementById('filterGradoNotas')?.value || '';
    const materiaFilter = document.getElementById('filterMateria')?.value || '';
    const periodoFilter = document.getElementById('filterPeriodo')?.value || '';
    const tipoFilter = document.getElementById('filterTipoNota')?.value || '';
    
    if (searchTerm) {
        const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
        filtered = filtered.filter(nota => {
            const estudiante = estudiantesData.find(e => e.id === nota.estudianteId);
            if (estudiante) {
                const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase();
                return nombreCompleto.includes(searchTerm);
            }
            return false;
        });
    }
    
    if (gradoFilter) {
        const matriculasData = JSON.parse(localStorage.getItem('matriculasData')) || [];
        filtered = filtered.filter(nota => {
            const matricula = matriculasData.find(m => m.estudianteId === nota.estudianteId && m.estado === 'Activa');
            return matricula && matricula.grado === gradoFilter;
        });
    }
    
    if (materiaFilter) {
        filtered = filtered.filter(n => n.materiaId === materiaFilter);
    }
    
    if (periodoFilter) {
        filtered = filtered.filter(n => n.periodo === periodoFilter);
    }
    
    if (tipoFilter) {
        filtered = filtered.filter(n => n.tipoEvaluacion === tipoFilter);
    }
    
    return filtered;
}

// Función para limpiar filtros
function clearNotasFilters() {
    document.getElementById('searchNotas').value = '';
    document.getElementById('filterGradoNotas').value = '';
    document.getElementById('filterMateria').value = '';
    document.getElementById('filterPeriodo').value = '';
    document.getElementById('filterTipoNota').value = '';
    filterNotas();
}

// Función para filtrar notas
function filterNotas() {
    currentNotasPage = 1;
    displayNotas();
}

// Función para cambiar página
function goToNotasPage(page) {
    currentNotasPage = page;
    displayNotas();
}

// Función para mostrar modal de nueva nota
function showAddNotaModal() {
    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    document.getElementById('notaModalTitle').innerHTML = '<i class="fas fa-star me-2"></i>Nueva Calificación';
    document.getElementById('notaId').value = '';
    clearForm(document.getElementById('notaForm'));
    
    // Establecer fecha actual
    document.getElementById('fechaEvaluacion').value = new Date().toISOString().split('T')[0];
    
    loadEstudiantesForNotas();
    loadMateriasForNotas();
    modal.show();
}

// Función para editar nota
function editNota(id) {
    const nota = notasData.find(n => n.id === id);
    if (!nota) return;
    
    const modal = new bootstrap.Modal(document.getElementById('notaModal'));
    document.getElementById('notaModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Calificación';
    
    // Llenar formulario
    document.getElementById('notaId').value = nota.id;
    document.getElementById('estudianteSelect').value = nota.estudianteId || '';
    document.getElementById('materiaSelect').value = nota.materiaId || '';
    document.getElementById('calificacion').value = nota.calificacion || '';
    document.getElementById('tipoEvaluacion').value = nota.tipoEvaluacion || '';
    document.getElementById('periodo').value = nota.periodo || '';
    document.getElementById('fechaEvaluacion').value = nota.fechaEvaluacion || '';
    document.getElementById('peso').value = nota.peso || '';
    document.getElementById('descripcion').value = nota.descripcion || '';
    document.getElementById('observaciones').value = nota.observaciones || '';
    
    loadEstudiantesForNotas();
    loadMateriasForNotas();
    modal.show();
}

// Función para guardar nota
function saveNota() {
    const form = document.getElementById('notaForm');
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const notaData = {
        id: document.getElementById('notaId').value || generateId(),
        estudianteId: formData.get('estudianteId'),
        materiaId: formData.get('materiaId'),
        calificacion: parseFloat(formData.get('calificacion')),
        tipoEvaluacion: formData.get('tipoEvaluacion'),
        periodo: formData.get('periodo'),
        fechaEvaluacion: formData.get('fechaEvaluacion'),
        peso: parseInt(formData.get('peso')),
        descripcion: formData.get('descripcion'),
        observaciones: formData.get('observaciones'),
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
    };
    
    const existingIndex = notasData.findIndex(n => n.id === notaData.id);
    
    if (existingIndex >= 0) {
        notasData[existingIndex] = { ...notasData[existingIndex], ...notaData };
        showAlert.success('¡Actualizada!', 'La calificación ha sido actualizada correctamente');
    } else {
        notasData.push(notaData);
        showAlert.success('¡Registrada!', 'La calificación ha sido registrada correctamente');
    }
    
    // Guardar en localStorage
    localStorage.setItem('notasData', JSON.stringify(notasData));
    
    // Cerrar modal y actualizar tabla
    bootstrap.Modal.getInstance(document.getElementById('notaModal')).hide();
    displayNotas();
    updateNotasStats();
}

// Función para eliminar nota
function deleteNota(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer'
    ).then((result) => {
        if (result.isConfirmed) {
            notasData = notasData.filter(n => n.id !== id);
            localStorage.setItem('notasData', JSON.stringify(notasData));
            displayNotas();
            updateNotasStats();
            showAlert.success('¡Eliminada!', 'La calificación ha sido eliminada correctamente');
        }
    });
}

// Función para ver detalles de nota
function viewNota(id) {
    const nota = notasData.find(n => n.id === id);
    if (!nota) return;
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const estudiante = estudiantesData.find(e => e.id === nota.estudianteId);
    const nombreCompleto = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado';
    
    const detalles = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Estudiante:</strong> ${nombreCompleto}</p>
                <p><strong>Materia:</strong> ${getMateriaName(nota.materiaId)}</p>
                <p><strong>Calificación:</strong> <span class="badge ${getGradeClass(nota.calificacion)}">${nota.calificacion}</span> (${getGradeText(nota.calificacion)})</p>
                <p><strong>Tipo:</strong> ${nota.tipoEvaluacion}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Período:</strong> ${nota.periodo}</p>
                <p><strong>Fecha:</strong> ${formatDate(nota.fechaEvaluacion)}</p>
                <p><strong>Peso:</strong> ${nota.peso}%</p>
                <p><strong>Descripción:</strong> ${nota.descripcion || 'No especificada'}</p>
            </div>
        </div>
        ${nota.observaciones ? `<p><strong>Observaciones:</strong> ${nota.observaciones}</p>` : ''}
    `;
    
    Swal.fire({
        title: 'Detalles de Calificación',
        html: detalles,
        icon: 'info',
        width: '600px'
    });
}

// Función para actualizar estadísticas
function updateNotasStats() {
    const totalNotas = notasData.length;
    const promedioGeneral = totalNotas > 0 ? 
        (notasData.reduce((sum, nota) => sum + nota.calificacion, 0) / totalNotas).toFixed(1) : 0;
    
    // Estudiantes con promedio bajo (menos de 70)
    const estudiantesConNotas = {};
    notasData.forEach(nota => {
        if (!estudiantesConNotas[nota.estudianteId]) {
            estudiantesConNotas[nota.estudianteId] = [];
        }
        estudiantesConNotas[nota.estudianteId].push(nota.calificacion);
    });
    
    let estudiantesBajoPromedio = 0;
    Object.keys(estudiantesConNotas).forEach(estudianteId => {
        const notas = estudiantesConNotas[estudianteId];
        const promedio = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
        if (promedio < 70) {
            estudiantesBajoPromedio++;
        }
    });
    
    // Notas de este mes
    const notasEsteMes = notasData.filter(nota => {
        const fecha = new Date(nota.fechaEvaluacion);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;
    
    document.getElementById('promedio-general').textContent = promedioGeneral;
    document.getElementById('total-notas').textContent = totalNotas;
    document.getElementById('estudiantes-bajo-promedio').textContent = estudiantesBajoPromedio;
    document.getElementById('notas-mes').textContent = notasEsteMes;
}

// Función para exportar notas
function exportNotas() {
    if (notasData.length === 0) {
        showAlert.warning('Sin datos', 'No hay notas para exportar');
        return;
    }
    
    const estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];
    const dataToExport = notasData.map(nota => {
        const estudiante = estudiantesData.find(e => e.id === nota.estudianteId);
        return {
            Estudiante: estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            Grado: getGradoFromMatricula(nota.estudianteId),
            Materia: getMateriaName(nota.materiaId),
            Calificación: nota.calificacion,
            'Tipo Evaluación': nota.tipoEvaluacion,
            Período: nota.periodo,
            'Fecha Evaluación': formatDateShort(nota.fechaEvaluacion),
            'Peso (%)': nota.peso,
            Descripción: nota.descripcion || '',
            Observaciones: nota.observaciones || '',
            'Nivel de Desempeño': getGradeText(nota.calificacion)
        };
    });
    
    exportToExcel('Notas y Calificaciones', dataToExport, 'notas_' + new Date().toISOString().split('T')[0]);
}

// Función para generar reporte
function generateReporteNotas() {
    if (notasData.length === 0) {
        showAlert.warning('Sin datos', 'No hay notas para generar reporte');
        return;
    }
    
    // Estadísticas por materia
    const estatisticasPorMateria = {};
    notasData.forEach(nota => {
        if (!estatisticasPorMateria[nota.materiaId]) {
            estatisticasPorMateria[nota.materiaId] = [];
        }
        estatisticasPorMateria[nota.materiaId].push(nota.calificacion);
    });
    
    let reporteHTML = `
        <div class="text-start">
            <h5>Estadísticas Generales</h5>
            <ul>
                <li>Total de calificaciones: ${notasData.length}</li>
                <li>Promedio general: ${(notasData.reduce((sum, nota) => sum + nota.calificacion, 0) / notasData.length).toFixed(1)}</li>
            </ul>
            
            <h5>Promedios por Materia</h5>
            <ul>
    `;
    
    Object.entries(estatisticasPorMateria).forEach(([materiaId, calificaciones]) => {
        const promedio = (calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length).toFixed(1);
        reporteHTML += `<li>${getMateriaName(materiaId)}: ${promedio} (${calificaciones.length} evaluaciones)</li>`;
    });
    
    reporteHTML += `
            </ul>
        </div>
    `;
    
    Swal.fire({
        title: 'Reporte de Calificaciones',
        html: reporteHTML,
        icon: 'info',
        width: '500px'
    });
}

// Función para refrescar datos
function refreshNotas() {
    loadNotasData();
    updateNotasStats();
    showAlert.success('¡Actualizado!', 'Los datos han sido actualizados');
}

// Inicializar cuando se carga la sección
document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadNotasSection === 'function') {
        // La función está disponible pero no la ejecutamos automáticamente
        // Se ejecutará cuando el usuario navegue a la sección
    }
});
