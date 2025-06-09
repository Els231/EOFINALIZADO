/**
 * Módulo de analytics y reportes
 * Funcionalidades para análisis de datos y generación de reportes
 */

let analyticsCharts = {};
let analyticsData = {};

// Función principal para cargar la sección de analytics
function loadAnalyticsSection() {
    const section = document.getElementById('analytics-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-chart-line me-2"></i>
                    Analytics y Reportes
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="generateFullReport()">
                            <i class="fas fa-file-pdf me-1"></i> Reporte Completo
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportAnalytics()">
                            <i class="fas fa-download me-1"></i> Exportar Datos
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshAnalytics()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros de período -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-3">
                    <label for="periodoAnalisis" class="form-label">Período de Análisis:</label>
                    <select class="form-select" id="periodoAnalisis" onchange="updateAnalyticsPeriod()">
                        <option value="mes">Este Mes</option>
                        <option value="trimestre">Este Trimestre</option>
                        <option value="ano" selected>Este Año</option>
                        <option value="todo">Todo el Tiempo</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="tipoReporte" class="form-label">Tipo de Reporte:</label>
                    <select class="form-select" id="tipoReporte" onchange="updateReportType()">
                        <option value="general" selected>General</option>
                        <option value="academico">Académico</option>
                        <option value="financiero">Financiero</option>
                        <option value="asistencia">Asistencia</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filtroGrado" class="form-label">Filtrar por Grado:</label>
                    <select class="form-select" id="filtroGrado" onchange="updateGradeFilter()">
                        <option value="">Todos los Grados</option>
                        <option value="1">Primer Grado</option>
                        <option value="2">Segundo Grado</option>
                        <option value="3">Tercer Grado</option>
                        <option value="4">Cuarto Grado</option>
                        <option value="5">Quinto Grado</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="fechaDesde" class="form-label">Desde:</label>
                    <input type="date" class="form-control" id="fechaDesde" onchange="updateDateRange()">
                </div>
            </div>
        </div>

        <!-- Métricas principales -->
        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Promedio General
                                </div>
                                <div class="card-number" id="analytics-promedio-general">0</div>
                            </div>
                            <div class="col-auto">
                                <div class="icon-circle">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Tasa de Aprobación
                                </div>
                                <div class="card-number" id="analytics-tasa-aprobacion">0%</div>
                            </div>
                            <div class="col-auto">
                                <div class="icon-circle">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Ingresos Totales
                                </div>
                                <div class="card-number" id="analytics-ingresos">$0</div>
                            </div>
                            <div class="col-auto">
                                <div class="icon-circle">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card card-info">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-uppercase mb-1">
                                    Asistencia Promedio
                                </div>
                                <div class="card-number" id="analytics-asistencia">0%</div>
                            </div>
                            <div class="col-auto">
                                <div class="icon-circle">
                                    <i class="fas fa-user-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficos principales -->
        <div class="row mb-4">
            <!-- Rendimiento académico por mes -->
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Tendencia de Rendimiento Académico</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="rendimientoChart" width="100%" height="40"></canvas>
                    </div>
                </div>
            </div>

            <!-- Distribución de calificaciones -->
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Distribución de Calificaciones</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="calificacionesChart" width="100%" height="100"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Segunda fila de gráficos -->
        <div class="row mb-4">
            <!-- Matriculas por mes -->
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Matrículas por Mes</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="matriculasChart" width="100%" height="60"></canvas>
                    </div>
                </div>
            </div>

            <!-- Rendimiento por materia -->
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Rendimiento por Materia</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="materiasChart" width="100%" height="60"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tablas de análisis detallado -->
        <div class="row">
            <!-- Top estudiantes -->
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Top 10 Estudiantes</h6>
                    </div>
                    <div class="card-body">
                        <div id="topEstudiantesTable">
                            <!-- Tabla se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estadísticas por grado -->
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Estadísticas por Grado</h6>
                    </div>
                    <div class="card-body">
                        <div id="estadisticasGradoTable">
                            <!-- Tabla se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Alertas y recomendaciones -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            Alertas y Recomendaciones
                        </h6>
                    </div>
                    <div class="card-body">
                        <div id="alertasRecomendaciones">
                            <!-- Alertas se cargarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Establecer fecha por defecto (inicio del año actual)
    const inicioAno = new Date(new Date().getFullYear(), 0, 1);
    document.getElementById('fechaDesde').value = inicioAno.toISOString().split('T')[0];
    
    // Cargar datos y gráficos
    loadAnalyticsData();
    initializeAnalyticsCharts();
}

// Función para cargar datos de analytics
function loadAnalyticsData() {
    try {
        analyticsData = {
            estudiantes: db.getEstudiantes(),
            profesores: db.getProfesores(),
            notas: db.getNotas(),
            matriculas: db.getMatriculas(),
            eventos: db.getEventos(),
            cursos: db.getCursos()
        };
        
        updateAnalyticsMetrics();
        updateAnalyticsCharts();
        updateAnalyticsTables();
        generateAlertas();
        
    } catch (error) {
        console.error('Error al cargar datos de analytics:', error);
        showAlert.error('Error', 'No se pudieron cargar los datos para análisis');
    }
}

// Función para actualizar métricas principales
function updateAnalyticsMetrics() {
    const { estudiantes, notas, matriculas } = analyticsData;
    
    // Promedio general
    const promedioGeneral = notas.length > 0 
        ? (notas.reduce((sum, nota) => sum + parseFloat(nota.calificacion), 0) / notas.length).toFixed(1)
        : 0;
    
    // Tasa de aprobación
    const notasAprobadas = notas.filter(nota => parseFloat(nota.calificacion) >= 70).length;
    const tasaAprobacion = notas.length > 0 ? ((notasAprobadas / notas.length) * 100).toFixed(1) : 0;
    
    // Ingresos totales
    const ingresosTotales = matriculas
        .filter(m => m.estado === 'Activa')
        .reduce((total, m) => {
            const costo = parseFloat(m.costoMatricula) || 0;
            const descuento = parseFloat(m.descuento) || 0;
            return total + (costo * (1 - descuento / 100));
        }, 0);
    
    // Asistencia promedio (simulada)
    const asistenciaPromedio = 85; // Simulado
    
    // Actualizar UI
    document.getElementById('analytics-promedio-general').textContent = promedioGeneral;
    document.getElementById('analytics-tasa-aprobacion').textContent = tasaAprobacion + '%';
    document.getElementById('analytics-ingresos').textContent = formatCurrency(ingresosTotales);
    document.getElementById('analytics-asistencia').textContent = asistenciaPromedio + '%';
}

// Función para inicializar gráficos de analytics
function initializeAnalyticsCharts() {
    initializeRendimientoChart();
    initializeCalificacionesChart();
    initializeMatriculasChart();
    initializeMateriasChart();
}

// Gráfico de rendimiento académico
function initializeRendimientoChart() {
    const ctx = document.getElementById('rendimientoChart');
    if (!ctx) return;
    
    const { notas } = analyticsData;
    
    // Agrupar notas por mes
    const notasPorMes = {};
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Inicializar meses
    meses.forEach((mes, index) => {
        notasPorMes[index] = [];
    });
    
    // Agrupar notas reales
    notas.forEach(nota => {
        const fecha = new Date(nota.fechaRegistro || nota.fechaEvaluacion);
        const mes = fecha.getMonth();
        notasPorMes[mes].push(parseFloat(nota.calificacion));
    });
    
    // Calcular promedios
    const promediosPorMes = meses.map((mes, index) => {
        const notasDelMes = notasPorMes[index];
        return notasDelMes.length > 0 
            ? notasDelMes.reduce((a, b) => a + b, 0) / notasDelMes.length 
            : null;
    });
    
    analyticsCharts.rendimientoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Promedio de Calificaciones',
                data: promediosPorMes,
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                spanGaps: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de distribución de calificaciones
function initializeCalificacionesChart() {
    const ctx = document.getElementById('calificacionesChart');
    if (!ctx) return;
    
    const { notas } = analyticsData;
    
    // Categorizar calificaciones
    const categorias = {
        'Excelente (90-100)': 0,
        'Muy Bueno (80-89)': 0,
        'Bueno (70-79)': 0,
        'Debe Mejorar (0-69)': 0
    };
    
    notas.forEach(nota => {
        const calificacion = parseFloat(nota.calificacion);
        if (calificacion >= 90) categorias['Excelente (90-100)']++;
        else if (calificacion >= 80) categorias['Muy Bueno (80-89)']++;
        else if (calificacion >= 70) categorias['Bueno (70-79)']++;
        else categorias['Debe Mejorar (0-69)']++;
    });
    
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c'];
    
    analyticsCharts.calificacionesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de matrículas por mes
function initializeMatriculasChart() {
    const ctx = document.getElementById('matriculasChart');
    if (!ctx) return;
    
    const { matriculas } = analyticsData;
    
    // Agrupar matrículas por mes
    const matriculasPorMes = {};
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Inicializar meses
    meses.forEach((mes, index) => {
        matriculasPorMes[index] = 0;
    });
    
    // Contar matrículas reales
    matriculas.forEach(matricula => {
        const fecha = new Date(matricula.fechaMatricula);
        const mes = fecha.getMonth();
        matriculasPorMes[mes]++;
    });
    
    const data = meses.map((mes, index) => matriculasPorMes[index]);
    
    analyticsCharts.matriculasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Matrículas',
                data: data,
                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico de rendimiento por materia
function initializeMateriasChart() {
    const ctx = document.getElementById('materiasChart');
    if (!ctx) return;
    
    const { notas, cursos } = analyticsData;
    
    // Agrupar notas por curso
    const notasPorCurso = {};
    
    cursos.forEach(curso => {
        notasPorCurso[curso.nombre] = [];
    });
    
    notas.forEach(nota => {
        const curso = cursos.find(c => c.id == nota.cursoId);
        if (curso && notasPorCurso[curso.nombre]) {
            notasPorCurso[curso.nombre].push(parseFloat(nota.calificacion));
        }
    });
    
    // Calcular promedios
    const materias = [];
    const promedios = [];
    
    Object.keys(notasPorCurso).forEach(materia => {
        const notas = notasPorCurso[materia];
        if (notas.length > 0) {
            materias.push(materia);
            promedios.push(notas.reduce((a, b) => a + b, 0) / notas.length);
        }
    });
    
    const colors = generateColors(materias.length);
    
    analyticsCharts.materiasChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: materias,
            datasets: [{
                label: 'Promedio',
                data: promedios,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Función para actualizar gráficos
function updateAnalyticsCharts() {
    Object.values(analyticsCharts).forEach(chart => {
        if (chart && typeof chart.update === 'function') {
            chart.update();
        }
    });
}

// Función para actualizar tablas de análisis
function updateAnalyticsTables() {
    updateTopEstudiantesTable();
    updateEstadisticasGradoTable();
}

// Tabla de top estudiantes
function updateTopEstudiantesTable() {
    const { estudiantes, notas } = analyticsData;
    
    // Calcular promedio por estudiante
    const promediosPorEstudiante = {};
    
    estudiantes.forEach(estudiante => {
        const notasEstudiante = notas.filter(n => n.estudianteId === estudiante.id);
        if (notasEstudiante.length > 0) {
            const promedio = notasEstudiante.reduce((sum, n) => sum + parseFloat(n.calificacion), 0) / notasEstudiante.length;
            promediosPorEstudiante[estudiante.id] = {
                estudiante: estudiante,
                promedio: promedio,
                totalNotas: notasEstudiante.length
            };
        }
    });
    
    // Ordenar por promedio
    const topEstudiantes = Object.values(promediosPorEstudiante)
        .sort((a, b) => b.promedio - a.promedio)
        .slice(0, 10);
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Promedio</th>
                        <th>Notas</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    topEstudiantes.forEach((item, index) => {
        const estudiante = item.estudiante;
        const gradeClass = getGradeClass(item.promedio);
        
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div>
                        <strong>${estudiante.nombres} ${estudiante.apellidos}</strong>
                    </div>
                </td>
                <td>${getGradoText(estudiante.grado)}</td>
                <td>
                    <span class="fw-bold ${gradeClass}">${item.promedio.toFixed(1)}</span>
                </td>
                <td>${item.totalNotas}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table></div>';
    
    document.getElementById('topEstudiantesTable').innerHTML = tableHTML;
}

// Tabla de estadísticas por grado
function updateEstadisticasGradoTable() {
    const { estudiantes, notas } = analyticsData;
    
    const estadisticasPorGrado = {};
    
    // Inicializar estadísticas
    for (let grado = 1; grado <= 5; grado++) {
        estadisticasPorGrado[grado] = {
            totalEstudiantes: 0,
            totalNotas: 0,
            sumaNotas: 0,
            aprobados: 0
        };
    }
    
    // Contar estudiantes por grado
    estudiantes.forEach(estudiante => {
        const grado = estudiante.grado;
        if (estadisticasPorGrado[grado]) {
            estadisticasPorGrado[grado].totalEstudiantes++;
        }
    });
    
    // Procesar notas por grado
    notas.forEach(nota => {
        const estudiante = estudiantes.find(e => e.id === nota.estudianteId);
        if (estudiante && estadisticasPorGrado[estudiante.grado]) {
            const grado = estudiante.grado;
            const calificacion = parseFloat(nota.calificacion);
            
            estadisticasPorGrado[grado].totalNotas++;
            estadisticasPorGrado[grado].sumaNotas += calificacion;
            
            if (calificacion >= 70) {
                estadisticasPorGrado[grado].aprobados++;
            }
        }
    });
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Grado</th>
                        <th>Estudiantes</th>
                        <th>Promedio</th>
                        <th>Aprobación</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(estadisticasPorGrado).forEach(grado => {
        const stats = estadisticasPorGrado[grado];
        const promedio = stats.totalNotas > 0 ? (stats.sumaNotas / stats.totalNotas) : 0;
        const tasaAprobacion = stats.totalNotas > 0 ? ((stats.aprobados / stats.totalNotas) * 100) : 0;
        const gradeClass = getGradeClass(promedio);
        
        tableHTML += `
            <tr>
                <td><strong>${getGradoText(grado)}</strong></td>
                <td>${stats.totalEstudiantes}</td>
                <td>
                    <span class="fw-bold ${gradeClass}">${promedio.toFixed(1)}</span>
                </td>
                <td>
                    <span class="badge ${tasaAprobacion >= 80 ? 'bg-success' : tasaAprobacion >= 70 ? 'bg-warning' : 'bg-danger'}">
                        ${tasaAprobacion.toFixed(1)}%
                    </span>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table></div>';
    
    document.getElementById('estadisticasGradoTable').innerHTML = tableHTML;
}

// Función para generar alertas y recomendaciones
function generateAlertas() {
    const { estudiantes, notas, profesores, matriculas } = analyticsData;
    const alertas = [];
    
    // Verificar estudiantes con bajo rendimiento
    const estudiantesBajoRendimiento = [];
    estudiantes.forEach(estudiante => {
        const notasEstudiante = notas.filter(n => n.estudianteId === estudiante.id);
        if (notasEstudiante.length > 0) {
            const promedio = notasEstudiante.reduce((sum, n) => sum + parseFloat(n.calificacion), 0) / notasEstudiante.length;
            if (promedio < 70) {
                estudiantesBajoRendimiento.push({
                    estudiante: estudiante,
                    promedio: promedio
                });
            }
        }
    });
    
    if (estudiantesBajoRendimiento.length > 0) {
        alertas.push({
            tipo: 'warning',
            titulo: 'Estudiantes con Bajo Rendimiento',
            descripcion: `${estudiantesBajoRendimiento.length} estudiantes tienen un promedio menor a 70. Se recomienda atención especial.`,
            accion: 'Ver estudiantes',
            onClick: 'showBajoRendimientoDetails()'
        });
    }
    
    // Verificar matrículas pendientes
    const matriculasPendientes = matriculas.filter(m => m.estado === 'Pendiente').length;
    if (matriculasPendientes > 0) {
        alertas.push({
            tipo: 'info',
            titulo: 'Matrículas Pendientes',
            descripcion: `Hay ${matriculasPendientes} matrículas pendientes de confirmación.`,
            accion: 'Revisar matrículas',
            onClick: 'showSection("matriculas")'
        });
    }
    
    // Verificar tendencia de calificaciones
    const notasRecientes = notas.filter(nota => {
        const fecha = new Date(nota.fechaRegistro || nota.fechaEvaluacion);
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1);
        return fecha >= haceUnMes;
    });
    
    if (notasRecientes.length > 0) {
        const promedioReciente = notasRecientes.reduce((sum, n) => sum + parseFloat(n.calificacion), 0) / notasRecientes.length;
        if (promedioReciente < 75) {
            alertas.push({
                tipo: 'warning',
                titulo: 'Tendencia Descendente',
                descripcion: `El promedio del último mes (${promedioReciente.toFixed(1)}) está por debajo del objetivo. Se recomienda revisar metodologías.`,
                accion: 'Analizar tendencia',
                onClick: 'analyzeGradeTrend()'
            });
        }
    }
    
    // Recomendaciones generales
    alertas.push({
        tipo: 'success',
        titulo: 'Recomendación: Reconocimiento',
        descripcion: 'Considera implementar un programa de reconocimiento para los estudiantes con mejor rendimiento.',
        accion: 'Ver top estudiantes',
        onClick: 'focusTopStudents()'
    });
    
    // Renderizar alertas
    renderAlertas(alertas);
}

// Función para renderizar alertas
function renderAlertas(alertas) {
    const container = document.getElementById('alertasRecomendaciones');
    
    if (alertas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay alertas en este momento.</p>';
        return;
    }
    
    let alertasHTML = '';
    
    alertas.forEach(alerta => {
        const iconClass = alerta.tipo === 'warning' ? 'fas fa-exclamation-triangle' :
                         alerta.tipo === 'info' ? 'fas fa-info-circle' :
                         alerta.tipo === 'success' ? 'fas fa-lightbulb' : 'fas fa-bell';
        
        const alertClass = alerta.tipo === 'warning' ? 'alert-warning' :
                          alerta.tipo === 'info' ? 'alert-info' :
                          alerta.tipo === 'success' ? 'alert-success' : 'alert-primary';
        
        alertasHTML += `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-start">
                    <i class="${iconClass} me-3 mt-1"></i>
                    <div class="flex-grow-1">
                        <h6 class="alert-heading mb-1">${alerta.titulo}</h6>
                        <p class="mb-2">${alerta.descripcion}</p>
                        ${alerta.accion ? `
                            <button type="button" class="btn btn-sm btn-outline-${alerta.tipo === 'warning' ? 'warning' : alerta.tipo === 'info' ? 'info' : 'success'}" 
                                    onclick="${alerta.onClick}">
                                ${alerta.accion}
                            </button>
                        ` : ''}
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    });
    
    container.innerHTML = alertasHTML;
}

// Funciones auxiliares para acciones de alertas
function showBajoRendimientoDetails() {
    showAlert.info('Estudiantes con Bajo Rendimiento', 'Revisa la sección de Estudiantes para ver detalles específicos y contactar a los tutores.');
}

function analyzeGradeTrend() {
    showAlert.info('Análisis de Tendencia', 'Se recomienda:\n• Revisar metodologías de enseñanza\n• Incrementar actividades de refuerzo\n• Capacitar profesores en nuevas técnicas');
}

function focusTopStudents() {
    const topTable = document.getElementById('topEstudiantesTable');
    topTable.scrollIntoView({ behavior: 'smooth', block: 'center' });
    topTable.style.border = '2px solid #007bff';
    setTimeout(() => {
        topTable.style.border = '';
    }, 3000);
}

// Funciones de filtrado y actualización
function updateAnalyticsPeriod() {
    // Recargar datos según el período seleccionado
    loadAnalyticsData();
}

function updateReportType() {
    const tipo = document.getElementById('tipoReporte').value;
    // Aquí se podrían mostrar/ocultar gráficos específicos según el tipo
    showAlert.info('Tipo de Reporte', `Mostrando datos del tipo: ${tipo}`);
}

function updateGradeFilter() {
    // Filtrar datos por grado seleccionado
    loadAnalyticsData();
}

function updateDateRange() {
    // Actualizar según rango de fechas
    loadAnalyticsData();
}

// Función para generar reporte completo
function generateFullReport() {
    const reportData = [];
    
    // Estadísticas generales
    reportData.push({
        seccion: 'Resumen Ejecutivo',
        contenido: `
            • Total de Estudiantes: ${analyticsData.estudiantes.length}
            • Total de Profesores: ${analyticsData.profesores.length}
            • Promedio General: ${document.getElementById('analytics-promedio-general').textContent}
            • Tasa de Aprobación: ${document.getElementById('analytics-tasa-aprobacion').textContent}
            • Ingresos Totales: ${document.getElementById('analytics-ingresos').textContent}
        `
    });
    
    try {
        // Generar PDF con estadísticas
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Reporte Académico Completo', 20, 30);
        
        doc.setFontSize(16);
        doc.text('Escuela Jesús El Buen Maestro', 20, 45);
        
        doc.setFontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 60);
        
        let yPosition = 80;
        const lineHeight = 8;
        
        reportData.forEach(seccion => {
            doc.setFontSize(14);
            doc.text(seccion.seccion, 20, yPosition);
            yPosition += lineHeight * 1.5;
            
            doc.setFontSize(10);
            const lineas = seccion.contenido.split('\n').filter(linea => linea.trim());
            lineas.forEach(linea => {
                doc.text(linea.trim(), 25, yPosition);
                yPosition += lineHeight;
            });
            
            yPosition += lineHeight;
        });
        
        doc.save('Reporte_Academico_Completo.pdf');
        showAlert.success('¡Generado!', 'Reporte completo generado correctamente');
        
    } catch (error) {
        console.error('Error al generar reporte:', error);
        showAlert.error('Error', 'No se pudo generar el reporte completo');
    }
}

// Función para exportar datos de analytics
function exportAnalytics() {
    const { estudiantes, notas, matriculas, profesores } = analyticsData;
    
    // Resumen para exportar
    const resumenData = [{
        'Métrica': 'Total Estudiantes',
        'Valor': estudiantes.length
    }, {
        'Métrica': 'Total Profesores',
        'Valor': profesores.length
    }, {
        'Métrica': 'Total Notas Registradas',
        'Valor': notas.length
    }, {
        'Métrica': 'Total Matrículas',
        'Valor': matriculas.length
    }, {
        'Métrica': 'Promedio General',
        'Valor': document.getElementById('analytics-promedio-general').textContent
    }, {
        'Métrica': 'Tasa de Aprobación',
        'Valor': document.getElementById('analytics-tasa-aprobacion').textContent
    }];
    
    exportToExcel('Resumen Analytics', resumenData, 'analytics_resumen');
}

// Función para refrescar analytics
function refreshAnalytics() {
    // Destruir gráficos existentes
    Object.values(analyticsCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    analyticsCharts = {};
    
    // Recargar todo
    loadAnalyticsData();
    initializeAnalyticsCharts();
    
    showAlert.success('¡Actualizado!', 'Analytics actualizado correctamente');
}

// Exponer funciones globalmente
window.loadAnalyticsSection = loadAnalyticsSection;
window.generateFullReport = generateFullReport;
window.exportAnalytics = exportAnalytics;
window.refreshAnalytics = refreshAnalytics;
window.updateAnalyticsPeriod = updateAnalyticsPeriod;
window.updateReportType = updateReportType;
window.updateGradeFilter = updateGradeFilter;
window.updateDateRange = updateDateRange;
window.showBajoRendimientoDetails = showBajoRendimientoDetails;
window.analyzeGradeTrend = analyzeGradeTrend;
window.focusTopStudents = focusTopStudents;
