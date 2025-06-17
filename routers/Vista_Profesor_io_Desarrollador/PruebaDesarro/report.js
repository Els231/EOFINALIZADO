/**
 * Módulo de reportes y exportación
 * Sistema completo de exportación e impresión
 */

let reportesCharts = {};
let currentReportData = null;

// Función principal para cargar la sección de reportes
function loadReportesSection() {
    const section = document.getElementById('reportes-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-file-export me-2"></i>
                    Reportes y Exportación
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-success" onclick="exportAllData()">
                            <i class="fas fa-download me-1"></i> Backup Completo
                        </button>
                        <button type="button" class="btn btn-outline-primary" onclick="showImportModal()">
                            <i class="fas fa-upload me-1"></i> Importar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas generales -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Total de Registros
                                </div>
                                <div class="h5 mb-0 font-weight-bold" id="total-registros">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-database fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Último Backup
                                </div>
                                <div class="h6 mb-0 font-weight-bold" id="ultimo-backup">Nunca</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-save fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Tamaño de Datos
                                </div>
                                <div class="h6 mb-0 font-weight-bold" id="tamano-datos">0 KB</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-hdd fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Reportes Generados
                                </div>
                                <div class="h5 mb-0 font-weight-bold" id="reportes-generados">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-chart-bar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reportes por módulo -->
        <div class="row">
            <!-- Reportes de estudiantes -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-primary">
                            <i class="fas fa-user-graduate me-2"></i>
                            Reportes de Estudiantes
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Lista completa de estudiantes
                                <button class="btn btn-sm btn-outline-primary" onclick="exportEstudiantesCompleto()">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Estudiantes por grado
                                <button class="btn btn-sm btn-outline-primary" onclick="showReporteEstudiantesPorGrado()">
                                    <i class="fas fa-chart-bar"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Estudiantes por turno
                                <button class="btn btn-sm btn-outline-primary" onclick="exportEstudiantesPorTurno()">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Reporte de edades
                                <button class="btn btn-sm btn-outline-primary" onclick="generateEdadesReport()">
                                    <i class="fas fa-birthday-cake"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes de profesores -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-success">
                            <i class="fas fa-chalkboard-teacher me-2"></i>
                            Reportes de Profesores
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Lista de profesores activos
                                <button class="btn btn-sm btn-outline-success" onclick="exportProfesoresActivos()">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Profesores por especialidad
                                <button class="btn btn-sm btn-outline-success" onclick="reporteProfesoresPorEspecialidad()">
                                    <i class="fas fa-chart-pie"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Asignaciones de materias
                                <button class="btn btn-sm btn-outline-success" onclick="reporteAsignacionesMaterias()">
                                    <i class="fas fa-clipboard-list"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Directorio completo
                                <button class="btn btn-sm btn-outline-success" onclick="generateDirectorioProfesores()">
                                    <i class="fas fa-address-book"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Reportes académicos -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-warning">
                            <i class="fas fa-star me-2"></i>
                            Reportes Académicos
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Registro de notas completo
                                <button class="btn btn-sm btn-outline-warning" onclick="exportNotasCompleto()">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Promedios por estudiante
                                <button class="btn btn-sm btn-outline-warning" onclick="reportePromediosPorEstudiante()">
                                    <i class="fas fa-calculator"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Estadísticas por materia
                                <button class="btn btn-sm btn-outline-warning" onclick="reporteEstadisticasPorMateria()">
                                    <i class="fas fa-chart-line"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Boletines masivos
                                <button class="btn btn-sm btn-outline-warning" onclick="generateBoletinesMasivos()">
                                    <i class="fas fa-file-pdf"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes administrativos -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-info">
                            <i class="fas fa-clipboard-check me-2"></i>
                            Reportes Administrativos
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Estado de matrículas
                                <button class="btn btn-sm btn-outline-info" onclick="reporteEstadoMatriculas()">
                                    <i class="fas fa-chart-donut"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Inscripciones pendientes
                                <button class="btn btn-sm btn-outline-info" onclick="reporteInscripcionesPendientes()">
                                    <i class="fas fa-clock"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Directorio de tutores
                                <button class="btn btn-sm btn-outline-info" onclick="exportTutoresDirectorio()">
                                    <i class="fas fa-users"></i>
                                </button>
                            </div>
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                Calendario de eventos
                                <button class="btn btn-sm btn-outline-info" onclick="exportCalendarioEventos()">
                                    <i class="fas fa-calendar"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Generador de reportes personalizado -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-danger">
                            <i class="fas fa-cog me-2"></i>
                            Generador de Reportes Personalizado
                        </h6>
                    </div>
                    <div class="card-body">
                        <form id="reportePersonalizadoForm">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="reporte-modulo" class="form-label">Módulo</label>
                                        <select class="form-select" id="reporte-modulo" onchange="updateReporteFields()">
                                            <option value="">Seleccionar módulo...</option>
                                            <option value="estudiantes">Estudiantes</option>
                                            <option value="profesores">Profesores</option>
                                            <option value="tutores">Tutores</option>
                                            <option value="matriculas">Matrículas</option>
                                            <option value="inscripciones">Inscripciones</option>
                                            <option value="notas">Notas</option>
                                            <option value="eventos">Eventos</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="reporte-formato" class="form-label">Formato</label>
                                        <select class="form-select" id="reporte-formato">
                                            <option value="excel">Excel (.xlsx)</option>
                                            <option value="csv">CSV</option>
                                            <option value="json">JSON</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="reporte-fecha-desde" class="form-label">Desde</label>
                                        <input type="date" class="form-control" id="reporte-fecha-desde">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="reporte-fecha-hasta" class="form-label">Hasta</label>
                                        <input type="date" class="form-control" id="reporte-fecha-hasta">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label class="form-label">Campos a incluir</label>
                                        <div id="reporte-campos" class="row">
                                            <!-- Los campos se cargan dinámicamente -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label for="reporte-filtros" class="form-label">Filtros adicionales</label>
                                        <div id="reporte-filtros-container">
                                            <!-- Filtros se cargan dinámicamente -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <button type="button" class="btn btn-danger" onclick="generateReportePersonalizado()">
                                    <i class="fas fa-file-export me-1"></i> Generar Reporte
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vista previa de reportes -->
        <div id="reporte-preview" class="mt-4" style="display: none;">
            <div class="card">
                <div class="card-header">
                    <h6 class="m-0 font-weight-bold">Vista Previa del Reporte</h6>
                </div>
                <div class="card-body">
                    <div id="reporte-content">
                        <!-- Contenido del reporte -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar estadísticas
    updateReportesStats();
}

// Función para actualizar estadísticas de reportes
function updateReportesStats() {
    try {
        const collections = ['estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas', 'eventos'];
        const totalRegistros = collections.reduce((total, collection) => total + db.count(collection), 0);
        
        document.getElementById('total-registros').textContent = formatNumber(totalRegistros);
        
        // Tamaño de datos
        const storageStats = db.getStorageStats();
        if (storageStats) {
            document.getElementById('tamano-datos').textContent = storageStats.totalSizeFormatted;
        }
        
        // Último backup (simulado)
        const logs = db.getLogs(100);
        const lastBackup = logs.find(log => log.action === 'export' || log.action === 'backup');
        if (lastBackup) {
            document.getElementById('ultimo-backup').textContent = formatDateShort(lastBackup.timestamp);
        }
        
        // Reportes generados (simulado)
        const reportesGenerados = logs.filter(log => log.action === 'export').length;
        document.getElementById('reportes-generados').textContent = reportesGenerados;
        
    } catch (error) {
        console.error('Error actualizando estadísticas de reportes:', error);
    }
}

// ===== REPORTES DE ESTUDIANTES =====

function exportEstudiantesCompleto() {
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
                'Cédula': estudiante.cedula || '',
                'Fecha de Nacimiento': formatDateShort(estudiante.fecha_nacimiento),
                'Edad': edad,
                'Género': estudiante.genero || '',
                'Grado': `${estudiante.grado}° Grado`,
                'Turno': turno ? turno.nombre : '',
                'Teléfono': estudiante.telefono || '',
                'Email': estudiante.email || '',
                'Dirección': estudiante.direccion || '',
                'Tutor': tutor ? `${tutor.nombre} ${tutor.apellido}` : '',
                'Teléfono Tutor': tutor ? tutor.telefono : '',
                'Estado': estudiante.estado || 'Activo',
                'Fecha de Registro': formatDateShort(estudiante.created_at)
            };
        });
        
        exportToExcel(exportData, 'estudiantes_completo', 'Estudiantes');
        showGlobalAlert('Reporte de estudiantes exportado correctamente', 'success');
        
    } catch (error) {
        console.error('Error exportando estudiantes:', error);
        showGlobalAlert('Error al exportar reporte', 'error');
    }
}

function showReporteEstudiantesPorGrado() {
    const estudiantes = db.read('estudiantes');
    const estudiantesPorGrado = {};
    
    // Inicializar contadores
    for (let i = 1; i <= 6; i++) {
        estudiantesPorGrado[i] = {
            total: 0,
            masculino: 0,
            femenino: 0,
            estudiantes: []
        };
    }
    
    // Contar estudiantes
    estudiantes.forEach(estudiante => {
        const grado = parseInt(estudiante.grado);
        if (grado >= 1 && grado <= 6) {
            estudiantesPorGrado[grado].total++;
            if (estudiante.genero === 'Masculino') {
                estudiantesPorGrado[grado].masculino++;
            } else if (estudiante.genero === 'Femenino') {
                estudiantesPorGrado[grado].femenino++;
            }
            estudiantesPorGrado[grado].estudiantes.push(estudiante);
        }
    });
    
    // Crear reporte detallado
    let reporteHtml = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Grado</th>
                        <th>Total</th>
                        <th>Masculino</th>
                        <th>Femenino</th>
                        <th>Promedio de Edad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.entries(estudiantesPorGrado).forEach(([grado, data]) => {
        const promedioEdad = data.estudiantes.length > 0 ? 
            data.estudiantes.reduce((sum, e) => sum + calculateAge(e.fecha_nacimiento), 0) / data.estudiantes.length : 0;
        
        reporteHtml += `
            <tr>
                <td>${grado}° Grado</td>
                <td><strong>${data.total}</strong></td>
                <td>${data.masculino}</td>
                <td>${data.femenino}</td>
                <td>${promedioEdad.toFixed(1)} años</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="exportGradoDetallado('${grado}')">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </td>
            </tr>
        `;
    });
    
    reporteHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    showReportePreview('Estudiantes por Grado', reporteHtml);
}

function exportGradoDetallado(grado) {
    const estudiantes = db.read('estudiantes').filter(e => e.grado === grado);
    const turnos = db.read('turnos');
    const tutores = db.read('tutores');
    
    const exportData = estudiantes.map(estudiante => {
        const turno = turnos.find(t => t.id === estudiante.turno_id);
        const tutor = tutores.find(t => t.id === estudiante.tutor_id);
        const edad = calculateAge(estudiante.fecha_nacimiento);
        
        return {
            'Nombre Completo': `${estudiante.nombre} ${estudiante.apellido}`,
            'Edad': edad,
            'Género': estudiante.genero,
            'Turno': turno ? turno.nombre : '',
            'Tutor': tutor ? `${tutor.nombre} ${tutor.apellido}` : '',
            'Teléfono': estudiante.telefono || '',
            'Estado': estudiante.estado
        };
    });
    
    exportToExcel(exportData, `estudiantes_${grado}_grado`, `${grado}° Grado`);
}

function exportEstudiantesPorTurno() {
    const estudiantes = db.read('estudiantes');
    const turnos = db.read('turnos');
    
    const exportData = [];
    
    turnos.forEach(turno => {
        const estudiantesTurno = estudiantes.filter(e => e.turno_id === turno.id);
        
        estudiantesTurno.forEach(estudiante => {
            const edad = calculateAge(estudiante.fecha_nacimiento);
            exportData.push({
                'Turno': turno.nombre,
                'Horario': `${turno.hora_inicio} - ${turno.hora_fin}`,
                'Nombre': estudiante.nombre,
                'Apellido': estudiante.apellido,
                'Grado': `${estudiante.grado}° Grado`,
                'Edad': edad,
                'Género': estudiante.genero
            });
        });
    });
    
    exportToExcel(exportData, 'estudiantes_por_turno', 'Estudiantes por Turno');
}

function generateEdadesReport() {
    const estudiantes = db.read('estudiantes');
    const rangoEdades = {
        '5-6': 0,
        '7-8': 0,
        '9-10': 0,
        '11-12': 0,
        '13-14': 0,
        '15+': 0
    };
    
    estudiantes.forEach(estudiante => {
        const edad = calculateAge(estudiante.fecha_nacimiento);
        if (edad <= 6) rangoEdades['5-6']++;
        else if (edad <= 8) rangoEdades['7-8']++;
        else if (edad <= 10) rangoEdades['9-10']++;
        else if (edad <= 12) rangoEdades['11-12']++;
        else if (edad <= 14) rangoEdades['13-14']++;
        else rangoEdades['15+']++;
    });
    
    const exportData = Object.entries(rangoEdades).map(([rango, cantidad]) => ({
        'Rango de Edad': rango + ' años',
        'Cantidad de Estudiantes': cantidad,
        'Porcentaje': ((cantidad / estudiantes.length) * 100).toFixed(1) + '%'
    }));
    
    exportToExcel(exportData, 'reporte_edades', 'Distribución de Edades');
}

// ===== REPORTES DE PROFESORES =====

function exportProfesoresActivos() {
    const profesores = db.read('profesores').filter(p => p.estado === 'Activo');
    
    const exportData = profesores.map(profesor => ({
        'Nombre Completo': `${profesor.nombre} ${profesor.apellido}`,
        'Cédula': profesor.cedula,
        'Teléfono': profesor.telefono,
        'Email': profesor.email,
        'Especialidad': profesor.especialidad,
        'Título': profesor.titulo || '',
        'Experiencia': profesor.experiencia ? `${profesor.experiencia} años` : '',
        'Fecha de Ingreso': profesor.fecha_ingreso ? formatDateShort(profesor.fecha_ingreso) : '',
        'Estado': profesor.estado
    }));
    
    exportToExcel(exportData, 'profesores_activos', 'Profesores Activos');
}

function reporteProfesoresPorEspecialidad() {
    const profesores = db.read('profesores');
    const especialidades = {};
    
    profesores.forEach(profesor => {
        if (profesor.especialidad) {
            especialidades[profesor.especialidad] = (especialidades[profesor.especialidad] || 0) + 1;
        }
    });
    
    const exportData = Object.entries(especialidades).map(([especialidad, cantidad]) => ({
        'Especialidad': especialidad,
        'Cantidad de Profesores': cantidad,
        'Porcentaje': ((cantidad / profesores.length) * 100).toFixed(1) + '%'
    }));
    
    exportToExcel(exportData, 'profesores_por_especialidad', 'Profesores por Especialidad');
}

function reporteAsignacionesMaterias() {
    const profesores = db.read('profesores');
    const materias = db.read('materias');
    
    const exportData = profesores.map(profesor => {
        // Simular asignaciones basadas en especialidad
        const materiasAsignadas = materias.filter(materia => {
            if (profesor.especialidad === 'Educación Básica') return true;
            if (profesor.especialidad === 'Lengua Española' && materia.codigo === 'ESP') return true;
            if (profesor.especialidad === 'Matemáticas' && materia.codigo === 'MAT') return true;
            if (profesor.especialidad === 'Ciencias Naturales' && materia.codigo === 'CN') return true;
            if (profesor.especialidad === 'Ciencias Sociales' && materia.codigo === 'CS') return true;
            if (profesor.especialidad === 'Inglés' && materia.codigo === 'ING') return true;
            if (profesor.especialidad === 'Educación Física' && materia.codigo === 'EF') return true;
            return false;
        });
        
        return {
            'Profesor': `${profesor.nombre} ${profesor.apellido}`,
            'Especialidad': profesor.especialidad,
            'Materias Asignadas': materiasAsignadas.map(m => m.nombre).join(', '),
            'Cantidad de Materias': materiasAsignadas.length,
            'Estado': profesor.estado
        };
    });
    
    exportToExcel(exportData, 'asignaciones_materias', 'Asignaciones de Materias');
}

function generateDirectorioProfesores() {
    const profesores = db.read('profesores').filter(p => p.estado === 'Activo');
    
    const exportData = profesores.map(profesor => ({
        'Nombre': profesor.nombre,
        'Apellido': profesor.apellido,
        'Teléfono': profesor.telefono,
        'Email': profesor.email,
        'Especialidad': profesor.especialidad,
        'Dirección': profesor.direccion || '',
        'Provincia': profesor.provincia || '',
        'Municipio': profesor.municipio || ''
    }));
    
    exportToExcel(exportData, 'directorio_profesores', 'Directorio de Profesores');
}

// ===== REPORTES ACADÉMICOS =====

function exportNotasCompleto() {
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
            'Comentarios': nota.comentarios || ''
        };
    });
    
    exportToExcel(exportData, 'notas_completo', 'Registro de Notas');
}

function reportePromediosPorEstudiante() {
    const notas = db.read('notas');
    const estudiantes = db.read('estudiantes');
    const materias = db.read('materias');
    
    const promediosPorEstudiante = {};
    
    // Calcular promedios por estudiante
    notas.forEach(nota => {
        if (!promediosPorEstudiante[nota.estudiante_id]) {
            promediosPorEstudiante[nota.estudiante_id] = {
                notas: [],
                materiasCount: new Set()
            };
        }
        promediosPorEstudiante[nota.estudiante_id].notas.push(parseFloat(nota.nota));
        promediosPorEstudiante[nota.estudiante_id].materiasCount.add(nota.materia_id);
    });
    
    const exportData = Object.entries(promediosPorEstudiante).map(([estudianteId, data]) => {
        const estudiante = estudiantes.find(e => e.id === estudianteId);
        const promedio = data.notas.reduce((sum, nota) => sum + nota, 0) / data.notas.length;
        
        return {
            'Estudiante': estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'No encontrado',
            'Grado': estudiante ? `${estudiante.grado}° Grado` : '',
            'Cantidad de Notas': data.notas.length,
            'Materias Evaluadas': data.materiasCount.size,
            'Promedio General': promedio.toFixed(1),
            'Literal': getNotaLiteral(promedio),
            'Nota Más Alta': Math.max(...data.notas).toFixed(1),
            'Nota Más Baja': Math.min(...data.notas).toFixed(1)
        };
    });
    
    exportToExcel(exportData, 'promedios_por_estudiante', 'Promedios por Estudiante');
}

function reporteEstadisticasPorMateria() {
    const notas = db.read('notas');
    const materias = db.read('materias');
    
    const estadisticasPorMateria = {};
    
    // Agrupar notas por materia
    notas.forEach(nota => {
        if (!estadisticasPorMateria[nota.materia_id]) {
            estadisticasPorMateria[nota.materia_id] = [];
        }
        estadisticasPorMateria[nota.materia_id].push(parseFloat(nota.nota));
    });
    
    const exportData = Object.entries(estadisticasPorMateria).map(([materiaId, notasMateria]) => {
        const materia = materias.find(m => m.id === materiaId);
        const promedio = notasMateria.reduce((sum, nota) => sum + nota, 0) / notasMateria.length;
        const notaMaxima = Math.max(...notasMateria);
        const notaMinima = Math.min(...notasMateria);
        const aprobados = notasMateria.filter(nota => nota >= 70).length;
        
        return {
            'Materia': materia ? materia.nombre : 'No encontrada',
            'Total de Notas': notasMateria.length,
            'Promedio': promedio.toFixed(1),
            'Nota Máxima': notaMaxima.toFixed(1),
            'Nota Mínima': notaMinima.toFixed(1),
            'Estudiantes Aprobados': aprobados,
            'Porcentaje de Aprobación': ((aprobados / notasMateria.length) * 100).toFixed(1) + '%',
            'Notas A (90-100)': notasMateria.filter(n => n >= 90).length,
            'Notas B (80-89)': notasMateria.filter(n => n >= 80 && n < 90).length,
            'Notas C (70-79)': notasMateria.filter(n => n >= 70 && n < 80).length,
            'Notas D (60-69)': notasMateria.filter(n => n >= 60 && n < 70).length,
            'Notas F (0-59)': notasMateria.filter(n => n < 60).length
        };
    });
    
    exportToExcel(exportData, 'estadisticas_por_materia', 'Estadísticas por Materia');
}

function generateBoletinesMasivos() {
    Swal.fire({
        title: 'Generar Boletines Masivos',
        html: `
            <div class="text-start">
                <div class="mb-3">
                    <label for="boletines-grado" class="form-label">Seleccionar Grado</label>
                    <select class="form-select" id="boletines-grado">
                        <option value="">Todos los grados</option>
                        <option value="1">1° Grado</option>
                        <option value="2">2° Grado</option>
                        <option value="3">3° Grado</option>
                        <option value="4">4° Grado</option>
                        <option value="5">5° Grado</option>
                        <option value="6">6° Grado</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="boletines-periodo" class="form-label">Período</label>
                    <select class="form-select" id="boletines-periodo">
                        <option value="1er Bimestre">1er Bimestre</option>
                        <option value="2do Bimestre">2do Bimestre</option>
                        <option value="3er Bimestre">3er Bimestre</option>
                        <option value="4to Bimestre">4to Bimestre</option>
                        <option value="Final">Notas Finales</option>
                    </select>
                </div>
            </div>
        `,
        confirmButtonText: 'Generar Boletines',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const grado = document.getElementById('boletines-grado').value;
            const periodo = document.getElementById('boletines-periodo').value;
            
            showGlobalAlert('Función de boletines masivos en desarrollo', 'info');
            // Aquí se implementaría la generación masiva de boletines
        }
    });
}

// ===== REPORTES ADMINISTRATIVOS =====

function reporteEstadoMatriculas() {
    const matriculas = db.read('matriculas');
    const estadosCount = {};
    
    matriculas.forEach(matricula => {
        estadosCount[matricula.estado] = (estadosCount[matricula.estado] || 0) + 1;
    });
    
    const exportData = Object.entries(estadosCount).map(([estado, cantidad]) => ({
        'Estado': estado,
        'Cantidad': cantidad,
        'Porcentaje': ((cantidad / matriculas.length) * 100).toFixed(1) + '%'
    }));
    
    exportToExcel(exportData, 'estado_matriculas', 'Estado de Matrículas');
}

function reporteInscripcionesPendientes() {
    const inscripciones = db.read('inscripciones').filter(i => i.estado === 'En Proceso' || i.estado === 'Pendiente');
    
    const exportData = inscripciones.map(inscripcion => {
        const diasPendientes = Math.ceil((new Date() - new Date(inscripcion.fecha_solicitud)) / (1000 * 60 * 60 * 24));
        
        return {
            'Código': inscripcion.codigo,
            'Solicitante': inscripcion.solicitante_nombre,
            'Estudiante': `${inscripcion.estudiante_nombre} ${inscripcion.estudiante_apellido}`,
            'Grado Solicitado': `${inscripcion.grado_solicitado}° Grado`,
            'Fecha de Solicitud': formatDateShort(inscripcion.fecha_solicitud),
            'Días Pendientes': diasPendientes,
            'Estado': inscripcion.estado,
            'Teléfono': inscripcion.solicitante_telefono
        };
    });
    
    exportToExcel(exportData, 'inscripciones_pendientes', 'Inscripciones Pendientes');
}

function exportTutoresDirectorio() {
    const tutores = db.read('tutores');
    const estudiantes = db.read('estudiantes');
    const ocupaciones = db.read('ocupaciones');
    
    const exportData = tutores.map(tutor => {
        const estudiantesAsignados = estudiantes.filter(e => e.tutor_id === tutor.id);
        const ocupacion = ocupaciones.find(o => o.id === tutor.ocupacion_id);
        
        return {
            'Nombre Completo': `${tutor.nombre} ${tutor.apellido}`,
            'Cédula': tutor.cedula,
            'Parentesco': tutor.parentesco,
            'Teléfono': tutor.telefono,
            'Email': tutor.email || '',
            'Ocupación': ocupacion ? ocupacion.nombre : '',
            'Lugar de Trabajo': tutor.lugar_trabajo || '',
            'Dirección': tutor.direccion,
            'Estudiantes a Cargo': estudiantesAsignados.map(e => `${e.nombre} ${e.apellido}`).join(', '),
            'Cantidad de Estudiantes': estudiantesAsignados.length,
            'Estado': tutor.estado
        };
    });
    
    exportToExcel(exportData, 'directorio_tutores', 'Directorio de Tutores');
}

function exportCalendarioEventos() {
    const eventos = db.read('eventos');
    const profesores = db.read('profesores');
    
    const exportData = eventos.map(evento => {
        const responsable = profesores.find(p => p.id === evento.responsable);
        
        return {
            'Título': evento.titulo,
            'Tipo': evento.tipo,
            'Fecha de Inicio': formatDateShort(evento.fecha_inicio),
            'Fecha de Fin': evento.fecha_fin ? formatDateShort(evento.fecha_fin) : '',
            'Hora de Inicio': evento.hora_inicio || '',
            'Hora de Fin': evento.hora_fin || '',
            'Lugar': evento.lugar || '',
            'Grado': evento.grado || 'General',
            'Responsable': responsable ? `${responsable.nombre} ${responsable.apellido}` : '',
            'Descripción': evento.descripcion || '',
            'Todo el Día': evento.todo_el_dia ? 'Sí' : 'No'
        };
    });
    
    exportToExcel(exportData, 'calendario_eventos', 'Calendario de Eventos');
}

// ===== GENERADOR DE REPORTES PERSONALIZADO =====

function updateReporteFields() {
    const modulo = document.getElementById('reporte-modulo').value;
    const camposContainer = document.getElementById('reporte-campos');
    const filtrosContainer = document.getElementById('reporte-filtros-container');
    
    if (!modulo) {
        camposContainer.innerHTML = '';
        filtrosContainer.innerHTML = '';
        return;
    }
    
    const campos = getFieldsForModule(modulo);
    const filtros = getFiltersForModule(modulo);
    
    // Renderizar campos
    camposContainer.innerHTML = campos.map(campo => `
        <div class="col-md-3">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="campo-${campo.key}" value="${campo.key}" checked>
                <label class="form-check-label" for="campo-${campo.key}">
                    ${campo.label}
                </label>
            </div>
        </div>
    `).join('');
    
    // Renderizar filtros
    filtrosContainer.innerHTML = filtros.map(filtro => `
        <div class="row mb-2">
            <div class="col-md-3">
                <label class="form-label">${filtro.label}</label>
            </div>
            <div class="col-md-9">
                ${filtro.type === 'select' ? 
                    `<select class="form-select" id="filtro-${filtro.key}">
                        <option value="">Todos</option>
                        ${filtro.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>` :
                    `<input type="${filtro.type}" class="form-control" id="filtro-${filtro.key}">`
                }
            </div>
        </div>
    `).join('');
}

function getFieldsForModule(modulo) {
    const fieldMaps = {
        estudiantes: [
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellido', label: 'Apellido' },
            { key: 'cedula', label: 'Cédula' },
            { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento' },
            { key: 'edad', label: 'Edad' },
            { key: 'genero', label: 'Género' },
            { key: 'grado', label: 'Grado' },
            { key: 'turno', label: 'Turno' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'email', label: 'Email' },
            { key: 'direccion', label: 'Dirección' },
            { key: 'tutor', label: 'Tutor' },
            { key: 'estado', label: 'Estado' }
        ],
        profesores: [
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellido', label: 'Apellido' },
            { key: 'cedula', label: 'Cédula' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'email', label: 'Email' },
            { key: 'especialidad', label: 'Especialidad' },
            { key: 'titulo', label: 'Título' },
            { key: 'experiencia', label: 'Experiencia' },
            { key: 'fecha_ingreso', label: 'Fecha de Ingreso' },
            { key: 'estado', label: 'Estado' }
        ],
        notas: [
            { key: 'estudiante', label: 'Estudiante' },
            { key: 'materia', label: 'Materia' },
            { key: 'profesor', label: 'Profesor' },
            { key: 'periodo', label: 'Período' },
            { key: 'nota', label: 'Nota' },
            { key: 'literal', label: 'Literal' },
            { key: 'fecha_registro', label: 'Fecha de Registro' },
            { key: 'comentarios', label: 'Comentarios' }
        ]
    };
    
    return fieldMaps[modulo] || [];
}

function getFiltersForModule(modulo) {
    const filterMaps = {
        estudiantes: [
            {
                key: 'grado',
                label: 'Grado',
                type: 'select',
                options: [
                    { value: '1', label: '1° Grado' },
                    { value: '2', label: '2° Grado' },
                    { value: '3', label: '3° Grado' },
                    { value: '4', label: '4° Grado' },
                    { value: '5', label: '5° Grado' },
                    { value: '6', label: '6° Grado' }
                ]
            },
            {
                key: 'genero',
                label: 'Género',
                type: 'select',
                options: [
                    { value: 'Masculino', label: 'Masculino' },
                    { value: 'Femenino', label: 'Femenino' }
                ]
            },
            {
                key: 'estado',
                label: 'Estado',
                type: 'select',
                options: [
                    { value: 'Activo', label: 'Activo' },
                    { value: 'Inactivo', label: 'Inactivo' }
                ]
            }
        ],
        profesores: [
            {
                key: 'especialidad',
                label: 'Especialidad',
                type: 'select',
                options: dominicanData.getTeacherSpecialties().map(esp => ({ value: esp, label: esp }))
            },
            {
                key: 'estado',
                label: 'Estado',
                type: 'select',
                options: [
                    { value: 'Activo', label: 'Activo' },
                    { value: 'Inactivo', label: 'Inactivo' },
                    { value: 'Licencia', label: 'En Licencia' }
                ]
            }
        ],
        notas: [
            {
                key: 'periodo',
                label: 'Período',
                type: 'select',
                options: [
                    { value: '1er Bimestre', label: '1er Bimestre' },
                    { value: '2do Bimestre', label: '2do Bimestre' },
                    { value: '3er Bimestre', label: '3er Bimestre' },
                    { value: '4to Bimestre', label: '4to Bimestre' }
                ]
            }
        ]
    };
    
    return filterMaps[modulo] || [];
}

function generateReportePersonalizado() {
    try {
        const modulo = document.getElementById('reporte-modulo').value;
        const formato = document.getElementById('reporte-formato').value;
        const fechaDesde = document.getElementById('reporte-fecha-desde').value;
        const fechaHasta = document.getElementById('reporte-fecha-hasta').value;
        
        if (!modulo) {
            showGlobalAlert('Debe seleccionar un módulo', 'warning');
            return;
        }
        
        // Obtener campos seleccionados
        const camposSeleccionados = [];
        document.querySelectorAll('#reporte-campos input[type="checkbox"]:checked').forEach(checkbox => {
            camposSeleccionados.push(checkbox.value);
        });
        
        if (camposSeleccionados.length === 0) {
            showGlobalAlert('Debe seleccionar al menos un campo', 'warning');
            return;
        }
        
        // Obtener datos y aplicar filtros
        let data = db.read(modulo);
        
        // Aplicar filtro de fechas
        if (fechaDesde || fechaHasta) {
            data = filterByDateRange(data, 'created_at', fechaDesde, fechaHasta);
        }
        
        // Aplicar filtros adicionales
        const filtrosAdicionales = getActiveCustomFilters(modulo);
        data = applyFilters(data, filtrosAdicionales);
        
        // Preparar datos para exportación
        const exportData = prepareCustomReportData(data, modulo, camposSeleccionados);
        
        // Exportar según formato
        const filename = `reporte_${modulo}_personalizado`;
        
        switch (formato) {
            case 'excel':
                exportToExcel(exportData, filename, `Reporte de ${modulo}`);
                break;
            case 'csv':
                exportToCSV(exportData, filename);
                break;
            case 'json':
                exportJSON(exportData, filename);
                break;
        }
        
        showGlobalAlert('Reporte personalizado generado correctamente', 'success');
        
    } catch (error) {
        console.error('Error generando reporte personalizado:', error);
        showGlobalAlert('Error al generar reporte personalizado', 'error');
    }
}

function getActiveCustomFilters(modulo) {
    const filtros = {};
    const filtrosContainer = document.getElementById('reporte-filtros-container');
    
    filtrosContainer.querySelectorAll('select, input').forEach(input => {
        if (input.value && input.id.startsWith('filtro-')) {
            const key = input.id.replace('filtro-', '');
            filtros[key] = input.value;
        }
    });
    
    return filtros;
}

function prepareCustomReportData(data, modulo, camposSeleccionados) {
    // Esta función prepararía los datos según el módulo y campos seleccionados
    // Para simplicidad, retornamos los datos tal como están
    return data.map(item => {
        const exportItem = {};
        camposSeleccionados.forEach(campo => {
            exportItem[campo] = item[campo] || '';
        });
        return exportItem;
    });
}

function exportJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== BACKUP Y RESTAURACIÓN =====

function exportAllData() {
    try {
        showLoading('Creando backup completo...');
        
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            school: 'Escuela Jesús El Buen Maestro',
            data: {
                estudiantes: db.read('estudiantes'),
                profesores: db.read('profesores'),
                tutores: db.read('tutores'),
                matriculas: db.read('matriculas'),
                inscripciones: db.read('inscripciones'),
                notas: db.read('notas'),
                eventos: db.read('eventos'),
                turnos: db.read('turnos'),
                materias: db.read('materias'),
                ocupaciones: db.read('ocupaciones'),
                sistema: db.read('sistema')
            },
            statistics: {
                totalRecords: Object.values(backupData.data).reduce((total, collection) => total + collection.length, 0),
                collections: Object.keys(backupData.data).length
            }
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_completo_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Registrar en logs
        db.logAction('backup', 'export', 'sistema', 'Backup completo creado');
        
        hideLoading();
        showGlobalAlert('Backup completo creado correctamente', 'success');
        updateReportesStats();
        
    } catch (error) {
        hideLoading();
        console.error('Error creando backup:', error);
        showGlobalAlert('Error al crear backup completo', 'error');
    }
}

// ===== UTILIDADES =====

function showReportePreview(titulo, contenido) {
    const preview = document.getElementById('reporte-preview');
    const content = document.getElementById('reporte-content');
    
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>${titulo}</h5>
            <button class="btn btn-primary" onclick="printReporte()">
                <i class="fas fa-print me-1"></i> Imprimir
            </button>
        </div>
        ${contenido}
    `;
    
    preview.style.display = 'block';
    preview.scrollIntoView({ behavior: 'smooth' });
}

function printReporte() {
    const content = document.getElementById('reporte-content').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                @media print { body { margin: 0; } .btn { display: none !important; } }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function getNotaLiteral(nota) {
    const valor = parseFloat(nota);
    if (valor >= 90) return 'A';
    if (valor >= 80) return 'B';
    if (valor >= 70) return 'C';
    if (valor >= 60) return 'D';
    return 'F';
}

// Exportar funciones
window.loadReportesSection = loadReportesSection;
window.exportEstudiantesCompleto = exportEstudiantesCompleto;
window.showReporteEstudiantesPorGrado = showReporteEstudiantesPorGrado;
window.exportGradoDetallado = exportGradoDetallado;
window.exportEstudiantesPorTurno = exportEstudiantesPorTurno;
window.generateEdadesReport = generateEdadesReport;
window.exportProfesoresActivos = exportProfesoresActivos;
window.reporteProfesoresPorEspecialidad = reporteProfesoresPorEspecialidad;
window.reporteAsignacionesMaterias = reporteAsignacionesMaterias;
window.generateDirectorioProfesores = generateDirectorioProfesores;
window.exportNotasCompleto = exportNotasCompleto;
window.reportePromediosPorEstudiante = reportePromediosPorEstudiante;
window.reporteEstadisticasPorMateria = reporteEstadisticasPorMateria;
window.generateBoletinesMasivos = generateBoletinesMasivos;
window.reporteEstadoMatriculas = reporteEstadoMatriculas;
window.reporteInscripcionesPendientes = reporteInscripcionesPendientes;
window.exportTutoresDirectorio = exportTutoresDirectorio;
window.exportCalendarioEventos = exportCalendarioEventos;
window.updateReporteFields = updateReporteFields;
window.generateReportePersonalizado = generateReportePersonalizado;
window.exportAllData = exportAllData;
window.printReporte = printReporte;

console.log('✅ Reportes.js cargado correctamente');
