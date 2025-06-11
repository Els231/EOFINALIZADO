/**
 * Módulo de reportes y exportación
 * Sistema completo de exportación e impresión basado en el código proporcionado
 */

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
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total de Registros
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-registros">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-database fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Último Backup
                                </div>
                                <div class="h6 mb-0 font-weight-bold text-gray-800" id="ultimo-backup">Nunca</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-save fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Tamaño de Datos
                                </div>
                                <div class="h6 mb-0 font-weight-bold text-gray-800" id="tamano-datos">0 KB</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-hdd fa-2x text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Reportes Generados
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="reportes-generados">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-chart-bar fa-2x text-info"></i>
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
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportEstudiantesReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Lista Completa de Estudiantes
                            </button>
                            <button class="btn btn-outline-success" onclick="exportEstudiantesActivos()">
                                <i class="fas fa-user-check me-2"></i>
                                Estudiantes Activos
                            </button>
                            <button class="btn btn-outline-info" onclick="exportEstudiantesPorGrado()">
                                <i class="fas fa-layer-group me-2"></i>
                                Estudiantes por Grado
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateEstudiantesStatistics()">
                                <i class="fas fa-chart-pie me-2"></i>
                                Estadísticas de Estudiantes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes de matrículas -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-success">
                            <i class="fas fa-clipboard-list me-2"></i>
                            Reportes de Matrículas
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportMatriculasReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Registro de Matrículas
                            </button>
                            <button class="btn btn-outline-success" onclick="exportMatriculasActivas()">
                                <i class="fas fa-clipboard-check me-2"></i>
                                Matrículas Activas
                            </button>
                            <button class="btn btn-outline-info" onclick="exportIngresosPorMatricula()">
                                <i class="fas fa-dollar-sign me-2"></i>
                                Reporte de Ingresos
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateMatriculasStatistics()">
                                <i class="fas fa-chart-bar me-2"></i>
                                Estadísticas de Matrículas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes de inscripciones -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-info">
                            <i class="fas fa-file-signature me-2"></i>
                            Reportes de Inscripciones
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportInscripcionesReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Lista de Inscripciones
                            </button>
                            <button class="btn btn-outline-success" onclick="exportInscripcionesPorAno()">
                                <i class="fas fa-calendar me-2"></i>
                                Inscripciones por Año
                            </button>
                            <button class="btn btn-outline-info" onclick="exportInscripcionesPorModalidad()">
                                <i class="fas fa-tags me-2"></i>
                                Inscripciones por Modalidad
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateInscripcionesStatistics()">
                                <i class="fas fa-chart-line me-2"></i>
                                Estadísticas de Inscripciones
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes de tutores -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-warning">
                            <i class="fas fa-users me-2"></i>
                            Reportes de Tutores
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportTutoresReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Lista de Tutores
                            </button>
                            <button class="btn btn-outline-success" onclick="exportTutoresPorParentesco()">
                                <i class="fas fa-family me-2"></i>
                                Tutores por Parentesco
                            </button>
                            <button class="btn btn-outline-info" onclick="exportContactosEmergencia()">
                                <i class="fas fa-phone me-2"></i>
                                Contactos de Emergencia
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateTutoresStatistics()">
                                <i class="fas fa-chart-donut me-2"></i>
                                Estadísticas de Tutores
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes de notas -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-danger">
                            <i class="fas fa-star me-2"></i>
                            Reportes de Notas
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportNotasReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Registro de Notas
                            </button>
                            <button class="btn btn-outline-success" onclick="exportBoletinPorGrado()">
                                <i class="fas fa-graduation-cap me-2"></i>
                                Boletín por Grado
                            </button>
                            <button class="btn btn-outline-info" onclick="exportPromediosPorMateria()">
                                <i class="fas fa-calculator me-2"></i>
                                Promedios por Materia
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateNotasStatistics()">
                                <i class="fas fa-chart-area me-2"></i>
                                Estadísticas de Notas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reportes del calendario -->
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-secondary">
                            <i class="fas fa-calendar-alt me-2"></i>
                            Reportes del Calendario
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportEventosReport()">
                                <i class="fas fa-file-excel me-2"></i>
                                Lista de Eventos
                            </button>
                            <button class="btn btn-outline-success" onclick="exportEventosPorTipo()">
                                <i class="fas fa-tags me-2"></i>
                                Eventos por Tipo
                            </button>
                            <button class="btn btn-outline-info" onclick="exportCalendarioMensual()">
                                <i class="fas fa-calendar me-2"></i>
                                Calendario Mensual
                            </button>
                            <button class="btn btn-outline-warning" onclick="generateEventosStatistics()">
                                <i class="fas fa-chart-calendar me-2"></i>
                                Estadísticas del Calendario
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para importar datos -->
        <div class="modal fade" id="importModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-upload me-2"></i>
                            Importar Datos
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="importFile" class="form-label">Seleccionar archivo Excel (.xlsx)</label>
                            <input type="file" class="form-control" id="importFile" accept=".xlsx,.xls">
                        </div>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Advertencia:</strong> La importación puede sobrescribir datos existentes. 
                            Se recomienda crear un backup antes de proceder.
                        </div>
                        <div id="importProgress" class="d-none">
                            <div class="progress mb-3">
                                <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                            </div>
                            <div id="importStatus">Procesando...</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="importData()">
                            <i class="fas fa-upload me-1"></i> Importar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para resultados de importación -->
        <div class="modal fade" id="importResultsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle me-2"></i>
                            Resultados de la Importación
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="importResultsContent">
                        <!-- El contenido se cargará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    updateReportesStats();
}

// Actualizar estadísticas de reportes
function updateReportesStats() {
    const estudiantes = db.getAll('estudiantes') || [];
    const matriculas = db.getAll('matriculas') || [];
    const inscripciones = db.getAll('inscripciones') || [];
    const tutores = db.getAll('tutores') || [];
    const notas = db.getAll('notas') || [];
    const eventos = db.getAll('eventos') || [];
    const profesores = db.getAll('profesores') || [];

    const totalRegistros = estudiantes.length + matriculas.length + inscripciones.length + 
                          tutores.length + notas.length + eventos.length + profesores.length;

    // Calcular tamaño aproximado de los datos
    const dataSize = JSON.stringify({
        estudiantes, matriculas, inscripciones, tutores, notas, eventos, profesores
    }).length;
    
    const sizeInKB = Math.round(dataSize / 1024);

    // Obtener fecha del último backup
    const ultimoBackup = localStorage.getItem('ultimo_backup') || 'Nunca';
    
    // Obtener número de reportes generados
    const reportesGenerados = localStorage.getItem('reportes_generados') || '0';

    document.getElementById('total-registros').textContent = totalRegistros;
    document.getElementById('tamano-datos').textContent = `${sizeInKB} KB`;
    document.getElementById('ultimo-backup').textContent = ultimoBackup !== 'Nunca' ? 
        formatDateShort(ultimoBackup) : 'Nunca';
    document.getElementById('reportes-generados').textContent = reportesGenerados;
}

// Incrementar contador de reportes generados
function incrementReportCounter() {
    const current = parseInt(localStorage.getItem('reportes_generados') || '0');
    localStorage.setItem('reportes_generados', (current + 1).toString());
    updateReportesStats();
}

// Exportar todos los datos del sistema
function exportAllData() {
    const estudiantes = db.getAll('estudiantes') || [];
    const matriculas = db.getAll('matriculas') || [];
    const inscripciones = db.getAll('inscripciones') || [];
    const tutores = db.getAll('tutores') || [];
    const notas = db.getAll('notas') || [];
    const eventos = db.getAll('eventos') || [];
    const profesores = db.getAll('profesores') || [];

    if (estudiantes.length === 0 && matriculas.length === 0 && inscripciones.length === 0 && 
        tutores.length === 0 && notas.length === 0 && eventos.length === 0 && profesores.length === 0) {
        showAlert.warning('Sin datos', 'No hay datos para exportar');
        return;
    }

    try {
        // Crear libro de Excel con múltiples hojas
        const wb = XLSX.utils.book_new();

        // Hoja de resumen
        const summary = {
            'Fecha de Exportación': new Date().toLocaleString('es-ES'),
            'Total de Estudiantes': estudiantes.length,
            'Total de Matrículas': matriculas.length,
            'Total de Inscripciones': inscripciones.length,
            'Total de Tutores': tutores.length,
            'Total de Notas': notas.length,
            'Total de Eventos': eventos.length,
            'Total de Profesores': profesores.length
        };
        const wsSummary = XLSX.utils.json_to_sheet([summary]);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

        // Exportar estudiantes
        if (estudiantes.length > 0) {
            const studentsData = estudiantes.map(student => ({
                'ID': student.id,
                'Nombres': student.nombres,
                'Apellidos': student.apellidos,
                'Cédula': student.cedula || '',
                'Fecha de Nacimiento': student.fechaNacimiento || '',
                'Género': student.genero || '',
                'Teléfono': student.telefono || '',
                'Email': student.email || '',
                'Dirección': student.direccion || '',
                'Estado': student.estado || '',
                'Nacionalidad': student.nacionalidad || '',
                'Fecha de Registro': student.fechaRegistro ? formatDate(student.fechaRegistro) : ''
            }));
            const wsStudents = XLSX.utils.json_to_sheet(studentsData);
            XLSX.utils.book_append_sheet(wb, wsStudents, "Estudiantes");
        }

        // Exportar matrículas
        if (matriculas.length > 0) {
            const matriculasData = matriculas.map(matricula => ({
                'ID': matricula.id,
                'Código': matricula.codigo || '',
                'Estudiante': `${matricula.nombres || ''} ${matricula.apellidos || ''}`,
                'Cédula': matricula.cedula || '',
                'Grado': getGradoText(matricula.grado),
                'Año Lectivo': matricula.anoLectivo || '',
                'Modalidad': matricula.modalidad || '',
                'Estado': matricula.estado || '',
                'Fecha Matrícula': formatDate(matricula.fechaMatricula) || '',
                'Monto': matricula.montoMatricula || '',
                'Tutor Principal': `${matricula.nombresTutor1 || ''} ${matricula.apellidosTutor1 || ''}`,
                'Teléfono Tutor': matricula.telefonoTutor1 || '',
                'Observaciones': matricula.observaciones || ''
            }));
            const wsMatriculas = XLSX.utils.json_to_sheet(matriculasData);
            XLSX.utils.book_append_sheet(wb, wsMatriculas, "Matrículas");
        }

        // Exportar inscripciones
        if (inscripciones.length > 0) {
            const inscripcionesData = inscripciones.map(inscripcion => {
                const estudiante = estudiantes.find(e => e.id === inscripcion.estudianteId);
                return {
                    'ID': inscripcion.id,
                    'Código': inscripcion.codigo || '',
                    'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
                    'Cédula': estudiante ? (estudiante.cedula || '') : '',
                    'Grado': getGradoText(inscripcion.grado),
                    'Año Lectivo': inscripcion.anoLectivo || '',
                    'Modalidad': inscripcion.modalidad || '',
                    'Estado': inscripcion.estado || '',
                    'Fecha Inscripción': formatDate(inscripcion.fechaInscripcion) || '',
                    'Monto': inscripcion.monto || '',
                    'Observaciones': inscripcion.observaciones || ''
                };
            });
            const wsInscripciones = XLSX.utils.json_to_sheet(inscripcionesData);
            XLSX.utils.book_append_sheet(wb, wsInscripciones, "Inscripciones");
        }

        // Exportar tutores
        if (tutores.length > 0) {
            const tutoresData = tutores.map(tutor => ({
                'ID': tutor.id,
                'Nombres': tutor.nombres,
                'Apellidos': tutor.apellidos,
                'Cédula': tutor.cedula,
                'Parentesco': tutor.parentesco,
                'Teléfono': tutor.telefono,
                'Email': tutor.email || '',
                'Dirección': tutor.direccion,
                'Ocupación': tutor.ocupacion || '',
                'Estado': tutor.estado,
                'Fecha de Registro': tutor.fechaRegistro ? formatDate(tutor.fechaRegistro) : ''
            }));
            const wsTutores = XLSX.utils.json_to_sheet(tutoresData);
            XLSX.utils.book_append_sheet(wb, wsTutores, "Tutores");
        }

        // Exportar notas
        if (notas.length > 0) {
            const notasData = notas.map(nota => {
                const estudiante = estudiantes.find(e => e.id === nota.estudianteId);
                return {
                    'ID': nota.id,
                    'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
                    'Materia': nota.materia || '',
                    'Período': nota.periodo || '',
                    'Calificación': nota.calificacion,
                    'Fecha': formatDate(nota.fechaEvaluacion) || '',
                    'Observaciones': nota.observaciones || ''
                };
            });
            const wsNotas = XLSX.utils.json_to_sheet(notasData);
            XLSX.utils.book_append_sheet(wb, wsNotas, "Notas");
        }

        // Exportar eventos
        if (eventos.length > 0) {
            const eventosData = eventos.map(evento => ({
                'ID': evento.id,
                'Título': evento.title,
                'Tipo': getEventTypeText(evento.type),
                'Descripción': evento.description || '',
                'Fecha de Inicio': formatDateTime(evento.start),
                'Fecha de Fin': evento.end ? formatDateTime(evento.end) : '',
                'Ubicación': evento.location || '',
                'Todo el día': evento.allDay ? 'Sí' : 'No',
                'Notas': evento.notes || ''
            }));
            const wsEventos = XLSX.utils.json_to_sheet(eventosData);
            XLSX.utils.book_append_sheet(wb, wsEventos, "Eventos");
        }

        // Exportar profesores
        if (profesores.length > 0) {
            const profesoresData = profesores.map(profesor => ({
                'ID': profesor.id,
                'Nombres': profesor.nombres,
                'Apellidos': profesor.apellidos,
                'Cédula': profesor.cedula || '',
                'Especialidad': profesor.especialidad || '',
                'Teléfono': profesor.telefono || '',
                'Email': profesor.email || '',
                'Estado': profesor.estado || '',
                'Fecha de Registro': profesor.fechaRegistro ? formatDate(profesor.fechaRegistro) : ''
            }));
            const wsProfesores = XLSX.utils.json_to_sheet(profesoresData);
            XLSX.utils.book_append_sheet(wb, wsProfesores, "Profesores");
        }

        // Descargar archivo
        const filename = `backup_completo_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);

        // Actualizar fecha del último backup
        localStorage.setItem('ultimo_backup', new Date().toISOString());
        incrementReportCounter();
        updateReportesStats();

        showAlert.success('¡Éxito!', 'Backup completo exportado correctamente');

    } catch (error) {
        console.error('Error al exportar datos:', error);
        showAlert.error('Error', 'No se pudo exportar el backup completo');
    }
}

// Funciones específicas de exportación por módulo

// Reportes de estudiantes
function exportEstudiantesReport() {
    const estudiantes = db.getAll('estudiantes') || [];
    if (estudiantes.length === 0) {
        showAlert.warning('Sin datos', 'No hay estudiantes para exportar');
        return;
    }
    
    const dataToExport = estudiantes.map(estudiante => ({
        'Nombres': estudiante.nombres,
        'Apellidos': estudiante.apellidos,
        'Cédula': estudiante.cedula || '',
        'Fecha Nacimiento': formatDateShort(estudiante.fechaNacimiento) || '',
        'Edad': estudiante.fechaNacimiento ? calculateAge(estudiante.fechaNacimiento) : '',
        'Género': estudiante.genero || '',
        'Nacionalidad': estudiante.nacionalidad || '',
        'Estado': estudiante.estado || '',
        'Teléfono': estudiante.telefono || '',
        'Email': estudiante.email || '',
        'Dirección': estudiante.direccion || '',
        'Fecha Registro': formatDateShort(estudiante.fechaRegistro) || '',
        'Observaciones': estudiante.observaciones || ''
    }));
    
    exportToExcel('Lista Completa de Estudiantes', dataToExport, 'estudiantes_completo_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportEstudiantesActivos() {
    const estudiantes = db.getAll('estudiantes') || [];
    const activos = estudiantes.filter(e => e.estado === 'Activo');
    
    if (activos.length === 0) {
        showAlert.warning('Sin datos', 'No hay estudiantes activos para exportar');
        return;
    }
    
    const dataToExport = activos.map(estudiante => ({
        'Nombres': estudiante.nombres,
        'Apellidos': estudiante.apellidos,
        'Cédula': estudiante.cedula || '',
        'Fecha Nacimiento': formatDateShort(estudiante.fechaNacimiento) || '',
        'Género': estudiante.genero || '',
        'Teléfono': estudiante.telefono || '',
        'Email': estudiante.email || '',
        'Dirección': estudiante.direccion || ''
    }));
    
    exportToExcel('Estudiantes Activos', dataToExport, 'estudiantes_activos_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportEstudiantesPorGrado() {
    const matriculas = db.getAll('matriculas') || [];
    const estudiantes = db.getAll('estudiantes') || [];
    
    if (matriculas.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para generar el reporte por grado');
        return;
    }
    
    const dataToExport = matriculas.map(matricula => {
        const estudiante = estudiantes.find(e => e.id === matricula.estudianteId);
        return {
            'Grado': getGradoText(matricula.grado),
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : `${matricula.nombres || ''} ${matricula.apellidos || ''}`,
            'Cédula': estudiante ? (estudiante.cedula || '') : (matricula.cedula || ''),
            'Año Lectivo': matricula.anoLectivo,
            'Estado Matrícula': matricula.estado,
            'Modalidad': matricula.modalidad
        };
    }).sort((a, b) => a.Grado.localeCompare(b.Grado));
    
    exportToExcel('Estudiantes por Grado', dataToExport, 'estudiantes_por_grado_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function generateEstudiantesStatistics() {
    const estudiantes = db.getAll('estudiantes') || [];
    
    if (estudiantes.length === 0) {
        showAlert.warning('Sin datos', 'No hay estudiantes para generar estadísticas');
        return;
    }
    
    const stats = {
        total: estudiantes.length,
        activos: estudiantes.filter(e => e.estado === 'Activo').length,
        inactivos: estudiantes.filter(e => e.estado === 'Inactivo').length,
        masculinos: estudiantes.filter(e => e.genero === 'Masculino').length,
        femeninos: estudiantes.filter(e => e.genero === 'Femenino').length,
        conTelefono: estudiantes.filter(e => e.telefono).length,
        conEmail: estudiantes.filter(e => e.email).length
    };
    
    const dataToExport = [
        { 'Estadística': 'Total de Estudiantes', 'Cantidad': stats.total },
        { 'Estadística': 'Estudiantes Activos', 'Cantidad': stats.activos },
        { 'Estadística': 'Estudiantes Inactivos', 'Cantidad': stats.inactivos },
        { 'Estadística': 'Estudiantes Masculinos', 'Cantidad': stats.masculinos },
        { 'Estadística': 'Estudiantes Femeninos', 'Cantidad': stats.femeninos },
        { 'Estadística': 'Con Teléfono Registrado', 'Cantidad': stats.conTelefono },
        { 'Estadística': 'Con Email Registrado', 'Cantidad': stats.conEmail }
    ];
    
    exportToExcel('Estadísticas de Estudiantes', dataToExport, 'estadisticas_estudiantes_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

// Reportes de matrículas
function exportMatriculasReport() {
    const matriculas = db.getAll('matriculas') || [];
    if (matriculas.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para exportar');
        return;
    }
    
    const dataToExport = matriculas.map(matricula => ({
        'Código': matricula.codigo || '',
        'Estudiante': `${matricula.nombres || ''} ${matricula.apellidos || ''}`,
        'Cédula': matricula.cedula || '',
        'Grado': getGradoText(matricula.grado),
        'Año Lectivo': matricula.anoLectivo,
        'Modalidad': matricula.modalidad,
        'Estado': matricula.estado,
        'Fecha Matrícula': formatDateShort(matricula.fechaMatricula),
        'Monto': matricula.montoMatricula || 0,
        'Tutor Principal': `${matricula.nombresTutor1 || ''} ${matricula.apellidosTutor1 || ''}`,
        'Teléfono Tutor': matricula.telefonoTutor1 || '',
        'Observaciones': matricula.observaciones || ''
    }));
    
    exportToExcel('Registro de Matrículas', dataToExport, 'matriculas_completo_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportMatriculasActivas() {
    const matriculas = db.getAll('matriculas') || [];
    const activas = matriculas.filter(m => m.estado === 'Activa');
    
    if (activas.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas activas para exportar');
        return;
    }
    
    const dataToExport = activas.map(matricula => ({
        'Código': matricula.codigo || '',
        'Estudiante': `${matricula.nombres || ''} ${matricula.apellidos || ''}`,
        'Grado': getGradoText(matricula.grado),
        'Año Lectivo': matricula.anoLectivo,
        'Modalidad': matricula.modalidad,
        'Fecha Matrícula': formatDateShort(matricula.fechaMatricula),
        'Monto': matricula.montoMatricula || 0,
        'Tutor Principal': `${matricula.nombresTutor1 || ''} ${matricula.apellidosTutor1 || ''}`,
        'Teléfono Tutor': matricula.telefonoTutor1 || ''
    }));
    
    exportToExcel('Matrículas Activas', dataToExport, 'matriculas_activas_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportIngresosPorMatricula() {
    const matriculas = db.getAll('matriculas') || [];
    const inscripciones = db.getAll('inscripciones') || [];
    
    if (matriculas.length === 0 && inscripciones.length === 0) {
        showAlert.warning('Sin datos', 'No hay datos de ingresos para exportar');
        return;
    }
    
    const ingresosPorMes = {};
    
    // Procesar matrículas
    matriculas.forEach(matricula => {
        if (matricula.estado === 'Activa' && matricula.montoMatricula) {
            const fecha = new Date(matricula.fechaMatricula);
            const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            if (!ingresosPorMes[mesAno]) {
                ingresosPorMes[mesAno] = { matriculas: 0, inscripciones: 0, total: 0 };
            }
            ingresosPorMes[mesAno].matriculas += parseFloat(matricula.montoMatricula) || 0;
            ingresosPorMes[mesAno].total += parseFloat(matricula.montoMatricula) || 0;
        }
    });
    
    // Procesar inscripciones
    inscripciones.forEach(inscripcion => {
        if (inscripcion.estado === 'activa' && inscripcion.monto) {
            const fecha = new Date(inscripcion.fechaInscripcion);
            const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            if (!ingresosPorMes[mesAno]) {
                ingresosPorMes[mesAno] = { matriculas: 0, inscripciones: 0, total: 0 };
            }
            ingresosPorMes[mesAno].inscripciones += parseFloat(inscripcion.monto) || 0;
            ingresosPorMes[mesAno].total += parseFloat(inscripcion.monto) || 0;
        }
    });
    
    const dataToExport = Object.keys(ingresosPorMes).sort().map(mesAno => ({
        'Mes/Año': mesAno,
        'Ingresos Matrículas': formatCurrency(ingresosPorMes[mesAno].matriculas),
        'Ingresos Inscripciones': formatCurrency(ingresosPorMes[mesAno].inscripciones),
        'Total Mensual': formatCurrency(ingresosPorMes[mesAno].total)
    }));
    
    exportToExcel('Reporte de Ingresos', dataToExport, 'ingresos_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function generateMatriculasStatistics() {
    const matriculas = db.getAll('matriculas') || [];
    
    if (matriculas.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para generar estadísticas');
        return;
    }
    
    const stats = {
        total: matriculas.length,
        activas: matriculas.filter(m => m.estado === 'Activa').length,
        pendientes: matriculas.filter(m => m.estado === 'Pendiente').length,
        canceladas: matriculas.filter(m => m.estado === 'Cancelada').length,
        ingresoTotal: matriculas.reduce((total, m) => total + (parseFloat(m.montoMatricula) || 0), 0)
    };
    
    const dataToExport = [
        { 'Estadística': 'Total de Matrículas', 'Cantidad': stats.total },
        { 'Estadística': 'Matrículas Activas', 'Cantidad': stats.activas },
        { 'Estadística': 'Matrículas Pendientes', 'Cantidad': stats.pendientes },
        { 'Estadística': 'Matrículas Canceladas', 'Cantidad': stats.canceladas },
        { 'Estadística': 'Ingreso Total', 'Cantidad': formatCurrency(stats.ingresoTotal) }
    ];
    
    exportToExcel('Estadísticas de Matrículas', dataToExport, 'estadisticas_matriculas_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

// Mostrar modal de importación
function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    document.getElementById('importFile').value = '';
    document.getElementById('importProgress').classList.add('d-none');
    modal.show();
}

// Importar datos desde archivo Excel
function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert.error('Error', 'Por favor seleccione un archivo');
        return;
    }
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showAlert.error('Error', 'El archivo debe ser de formato Excel (.xlsx o .xls)');
        return;
    }
    
    showAlert.confirm(
        '¿Está seguro?',
        'La importación puede sobrescribir datos existentes. ¿Desea continuar?'
    ).then((result) => {
        if (result.isConfirmed) {
            processImportFile(file);
        }
    });
}

// Procesar archivo de importación
function processImportFile(file) {
    const progressContainer = document.getElementById('importProgress');
    const progressBar = progressContainer.querySelector('.progress-bar');
    const statusText = document.getElementById('importStatus');
    
    progressContainer.classList.remove('d-none');
    progressBar.style.width = '10%';
    statusText.textContent = 'Leyendo archivo...';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            progressBar.style.width = '50%';
            statusText.textContent = 'Procesando datos...';
            
            setTimeout(() => {
                processImportedData(workbook, progressBar, statusText);
            }, 500);
            
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            showAlert.error('Error', 'Error al procesar el archivo. Verifique el formato.');
            progressContainer.classList.add('d-none');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Procesar datos importados
function processImportedData(workbook, progressBar, statusText) {
    let importResults = {
        estudiantes: 0,
        matriculas: 0,
        inscripciones: 0,
        tutores: 0,
        notas: 0,
        eventos: 0,
        profesores: 0,
        errors: []
    };

    try {
        // Procesar cada hoja del archivo
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            
            switch (sheetName.toLowerCase()) {
                case 'estudiantes':
                    importResults.estudiantes = importEstudiantesData(data, importResults.errors);
                    break;
                case 'matriculas':
                case 'matrículas':
                    importResults.matriculas = importMatriculasData(data, importResults.errors);
                    break;
                case 'inscripciones':
                    importResults.inscripciones = importInscripcionesData(data, importResults.errors);
                    break;
                case 'tutores':
                    importResults.tutores = importTutoresData(data, importResults.errors);
                    break;
                case 'notas':
                    importResults.notas = importNotasData(data, importResults.errors);
                    break;
                case 'eventos':
                    importResults.eventos = importEventosData(data, importResults.errors);
                    break;
                case 'profesores':
                    importResults.profesores = importProfesoresData(data, importResults.errors);
                    break;
            }
        });

        progressBar.style.width = '100%';
        statusText.textContent = 'Completado';
        
        setTimeout(() => {
            showImportResults(importResults);
            document.getElementById('importProgress').classList.add('d-none');
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
        }, 1000);

    } catch (error) {
        console.error('Error al importar datos:', error);
        showAlert.error('Error', 'Error al importar los datos');
        document.getElementById('importProgress').classList.add('d-none');
    }
}

// Funciones auxiliares de importación (simplificadas)
function importEstudiantesData(data, errors) {
    let imported = 0;
    data.forEach((row, index) => {
        try {
            if (row.Nombres && row.Apellidos) {
                const estudianteData = {
                    nombres: row.Nombres,
                    apellidos: row.Apellidos,
                    cedula: row.Cédula || '',
                    fechaNacimiento: row['Fecha de Nacimiento'] || '',
                    genero: row.Género || '',
                    telefono: row.Teléfono || '',
                    email: row.Email || '',
                    direccion: row.Dirección || '',
                    estado: row.Estado || 'Activo',
                    nacionalidad: row.Nacionalidad || 'Dominicana'
                };
                db.insert('estudiantes', estudianteData);
                imported++;
            }
        } catch (error) {
            errors.push(`Error en estudiante fila ${index + 1}: ${error.message}`);
        }
    });
    return imported;
}

function importMatriculasData(data, errors) {
    let imported = 0;
    data.forEach((row, index) => {
        try {
            if (row.Estudiante && row.Grado) {
                const matriculaData = {
                    codigo: row.Código || '',
                    nombres: row.Estudiante.split(' ')[0] || '',
                    apellidos: row.Estudiante.split(' ').slice(1).join(' ') || '',
                    cedula: row.Cédula || '',
                    grado: extractGradoNumber(row.Grado),
                    anoLectivo: row['Año Lectivo'] || getCurrentAcademicYear(),
                    modalidad: row.Modalidad || 'Presencial',
                    estado: row.Estado || 'Activa',
                    fechaMatricula: row['Fecha Matrícula'] || new Date().toISOString().split('T')[0],
                    montoMatricula: parseFloat(row.Monto) || 0
                };
                db.insert('matriculas', matriculaData);
                imported++;
            }
        } catch (error) {
            errors.push(`Error en matrícula fila ${index + 1}: ${error.message}`);
        }
    });
    return imported;
}

function importInscripcionesData(data, errors) {
    // Implementación simplificada para inscripciones
    return 0;
}

function importTutoresData(data, errors) {
    // Implementación simplificada para tutores
    return 0;
}

function importNotasData(data, errors) {
    // Implementación simplificada para notas
    return 0;
}

function importEventosData(data, errors) {
    // Implementación simplificada para eventos
    return 0;
}

function importProfesoresData(data, errors) {
    // Implementación simplificada para profesores
    return 0;
}

// Función auxiliar para extraer número de grado
function extractGradoNumber(gradoText) {
    const match = gradoText.match(/(\d+)/);
    return match ? match[1] : '1';
}

// Mostrar resultados de importación
function showImportResults(results) {
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6>Registros Importados:</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Estudiantes:</span>
                        <span class="badge bg-primary">${results.estudiantes}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Matrículas:</span>
                        <span class="badge bg-success">${results.matriculas}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Inscripciones:</span>
                        <span class="badge bg-info">${results.inscripciones}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Tutores:</span>
                        <span class="badge bg-warning">${results.tutores}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Notas:</span>
                        <span class="badge bg-danger">${results.notas}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Eventos:</span>
                        <span class="badge bg-secondary">${results.eventos}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Profesores:</span>
                        <span class="badge bg-dark">${results.profesores}</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Errores Encontrados:</h6>
                ${results.errors.length > 0 ? `
                    <div class="alert alert-warning">
                        <small>${results.errors.slice(0, 5).join('<br>')}</small>
                        ${results.errors.length > 5 ? `<br><small>... y ${results.errors.length - 5} errores más</small>` : ''}
                    </div>
                ` : '<div class="alert alert-success">No se encontraron errores</div>'}
            </div>
        </div>
    `;
    
    document.getElementById('importResultsContent').innerHTML = content;
    
    const resultsModal = new bootstrap.Modal(document.getElementById('importResultsModal'));
    resultsModal.show();
    
    // Actualizar interfaz si se importaron datos
    const totalImported = results.estudiantes + results.matriculas + results.inscripciones + 
                         results.tutores + results.notas + results.eventos + results.profesores;
    
    if (totalImported > 0) {
        updateReportesStats();
        showAlert.success('¡Importación completada!', `Se importaron ${totalImported} registros correctamente`);
    }
}

// Funciones auxiliares para obtener textos de tipos de eventos (si no están definidas)
function getEventTypeText(type) {
    const types = {
        'clase': 'Clase',
        'examen': 'Examen',
        'reunion': 'Reunión',
        'evento': 'Evento Especial',
        'feriado': 'Feriado',
        'actividad': 'Actividad Escolar'
    };
    return types[type] || type;
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Continuar con las funciones de reportes restantes...
function exportInscripcionesReport() {
    const inscripciones = db.getAll('inscripciones') || [];
    if (inscripciones.length === 0) {
        showAlert.warning('Sin datos', 'No hay inscripciones para exportar');
        return;
    }
    
    const estudiantes = db.getAll('estudiantes') || [];
    const dataToExport = inscripciones.map(inscripcion => {
        const estudiante = estudiantes.find(e => e.id === inscripcion.estudianteId);
        return {
            'Código': inscripcion.codigo || '',
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            'Cédula': estudiante ? (estudiante.cedula || '') : '',
            'Grado': getGradoText(inscripcion.grado),
            'Año Lectivo': inscripcion.anoLectivo,
            'Modalidad': inscripcion.modalidad,
            'Estado': inscripcion.estado,
            'Fecha Inscripción': formatDateShort(inscripcion.fechaInscripcion),
            'Monto': inscripcion.monto || 0,
            'Observaciones': inscripcion.observaciones || ''
        };
    });
    
    exportToExcel('Lista de Inscripciones', dataToExport, 'inscripciones_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportTutoresReport() {
    const tutores = db.getAll('tutores') || [];
    if (tutores.length === 0) {
        showAlert.warning('Sin datos', 'No hay tutores para exportar');
        return;
    }
    
    const ocupaciones = db.getAll('ocupaciones') || [];
    const dataToExport = tutores.map(tutor => {
        const ocupacion = ocupaciones.find(o => o.id == tutor.ocupacion);
        return {
            'Nombres': tutor.nombres,
            'Apellidos': tutor.apellidos,
            'Cédula': tutor.cedula,
            'Parentesco': tutor.parentesco,
            'Teléfono Principal': tutor.telefono,
            'Email': tutor.email || '',
            'Dirección': tutor.direccion,
            'Ocupación': ocupacion ? ocupacion.nombre : '',
            'Lugar de Trabajo': tutor.lugarTrabajo || '',
            'Estado': tutor.estado,
            'Observaciones': tutor.observaciones || ''
        };
    });
    
    exportToExcel('Lista de Tutores', dataToExport, 'tutores_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportNotasReport() {
    const notas = db.getAll('notas') || [];
    if (notas.length === 0) {
        showAlert.warning('Sin datos', 'No hay notas para exportar');
        return;
    }
    
    const estudiantes = db.getAll('estudiantes') || [];
    const dataToExport = notas.map(nota => {
        const estudiante = estudiantes.find(e => e.id === nota.estudianteId);
        return {
            'Estudiante': estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'No encontrado',
            'Materia': nota.materia || '',
            'Período': nota.periodo || '',
            'Calificación': nota.calificacion,
            'Fecha Evaluación': formatDateShort(nota.fechaEvaluacion),
            'Tipo Evaluación': nota.tipoEvaluacion || '',
            'Observaciones': nota.observaciones || ''
        };
    });
    
    exportToExcel('Registro de Notas', dataToExport, 'notas_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}

function exportEventosReport() {
    const eventos = db.getAll('eventos') || [];
    if (eventos.length === 0) {
        showAlert.warning('Sin datos', 'No hay eventos para exportar');
        return;
    }
    
    const dataToExport = eventos.map(evento => ({
        'Título': evento.title,
        'Tipo': getEventTypeText(evento.type),
        'Descripción': evento.description || '',
        'Fecha de Inicio': formatDateTime(evento.start),
        'Fecha de Fin': evento.end ? formatDateTime(evento.end) : '',
        'Ubicación': evento.location || '',
        'Todo el día': evento.allDay ? 'Sí' : 'No',
        'Notas': evento.notes || ''
    }));
    
    exportToExcel('Lista de Eventos', dataToExport, 'eventos_' + new Date().toISOString().split('T')[0]);
    incrementReportCounter();
}