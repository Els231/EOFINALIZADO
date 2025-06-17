/**
 * Módulo de Dashboard para el Sistema de Gestión Escolar
 * Muestra estadísticas, gráficos y resumen general del sistema
 */

if (typeof db === 'undefined') {
    console.error('La base de datos no está definida');
    return;
}
let dashboardCharts = {};

// Función principal para cargar el dashboard
function loadDashboardSection() {
    const section = document.getElementById('dashboard-section');
    if (!section) {
        console.error('No se encontró el contenedor del dashboard');
        return;
    }
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="refreshDashboard()">
                            <i class="fas fa-sync-alt me-1"></i> Actualizar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportDashboardReport()">
                            <i class="fas fa-download me-1"></i> Exportar Reporte
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas principales -->
        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="stats-card primary">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="stats-number" id="total-estudiantes">0</div>
                            <div class="stats-label">
                                <i class="fas fa-user-graduate me-1"></i>
                                Estudiantes Registrados
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="stats-card success">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="stats-number" id="total-profesores">0</div>
                            <div class="stats-label">
                                <i class="fas fa-chalkboard-teacher me-1"></i>
                                Profesores Activos
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="stats-card warning">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="stats-number" id="total-matriculas">0</div>
                            <div class="stats-label">
                                <i class="fas fa-clipboard-list me-1"></i>
                                Matrículas Activas
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="stats-card info">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="stats-number" id="promedio-general">0.0</div>
                            <div class="stats-label">
                                <i class="fas fa-star me-1"></i>
                                Promedio General
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficos y análisis -->
        <div class="row">
            <!-- Gráfico de estudiantes por grado -->
            <div class="col-lg-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-chart-bar me-2"></i>
                            Estudiantes por Grado
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="estudiantesPorGradoChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfico de distribución por turno -->
            <div class="col-lg-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-chart-pie me-2"></i>
                            Distribución por Turno
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="estudiantesPorTurnoChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Actividad reciente -->
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-clock me-2"></i>
                            Actividad Reciente
                        </h6>
                    </div>
                    <div class="card-body">
                        <div id="actividad-reciente" class="list-group list-group-flush">
                            <!-- Actividades se cargan aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resumen rápido -->
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-info-circle me-2"></i>
                            Resumen Rápido
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6 mb-3">
                                <div class="small text-muted">Inscripciones Pendientes</div>
                                <div class="fw-bold" id="inscripciones-pendientes">0</div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="small text-muted">Notas Registradas</div>
                                <div class="fw-bold" id="total-notas">0</div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="small text-muted">Eventos Este Mes</div>
                                <div class="fw-bold" id="eventos-mes">0</div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="small text-muted">Tutores Registrados</div>
                                <div class="fw-bold" id="total-tutores">0</div>
                            </div>
                        </div>
                        <hr>
                        <div class="small text-muted text-center">
                            <i class="fas fa-calendar me-1"></i>
                            Último respaldo: <span id="ultimo-respaldo">Nunca</span>
                        </div>
                    </div>
                </div>

                <!-- Estado del sistema -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-server me-2"></i>
                            Estado del Sistema
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small">Almacenamiento</span>
                            <span class="badge bg-success" id="storage-status">Disponible</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small">Registros Totales</span>
                            <span class="fw-bold" id="total-registros">0</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="small">Tamaño de Datos</span>
                            <span class="text-muted" id="tamano-datos">0 KB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Alertas y notificaciones -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-bell me-2"></i>
                            Alertas y Notificaciones
                        </h6>
                    </div>
                    <div class="card-body" id="dashboard-alerts">
                        <!-- Alertas se cargan aquí -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos del dashboard
    loadDashboardData();
}

// Función para cargar datos del dashboard
function loadDashboardData() {
    try {
        // Obtener estadísticas
        const stats = getSystemStats();
        
        // Actualizar contadores principales
        document.getElementById('total-estudiantes').textContent = formatNumber(stats.estudiantes);
        document.getElementById('total-profesores').textContent = formatNumber(stats.profesores);
        document.getElementById('total-matriculas').textContent = formatNumber(stats.matriculas);
        document.getElementById('total-notas').textContent = formatNumber(stats.notas);
        document.getElementById('total-tutores').textContent = formatNumber(stats.tutores);
        document.getElementById('inscripciones-pendientes').textContent = getInscripcionesPendientes();
        document.getElementById('eventos-mes').textContent = getEventosDelMes();
        document.getElementById('total-registros').textContent = formatNumber(getTotalRecords());
        
        // Calcular promedio general
        const promedioGeneral = calculatePromedioGeneral();
        document.getElementById('promedio-general').textContent = promedioGeneral.toFixed(1);
        
        // Actualizar información del sistema
        updateSystemInfo();
        
        // Cargar gráficos
        loadDashboardCharts();
        
        // Cargar actividad reciente
        loadRecentActivity();
        
        // Cargar alertas
        loadDashboardAlerts();
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        showGlobalAlert('Error al cargar datos del dashboard', 'error');
    }
}

// Función para obtener inscripciones pendientes
function getInscripcionesPendientes() {
    const inscripciones = db.read('inscripciones');
    return inscripciones.filter(i => i.estado === 'En Proceso' || i.estado === 'Pendiente').length;
}

// Función para obtener eventos del mes actual
function getEventosDelMes() {
    const eventos = db.read('eventos');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return eventos.filter(evento => {
        const eventDate = new Date(evento.fecha);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    }).length;
}

// Función para obtener total de registros
function getTotalRecords() {
    const collections = ['estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas', 'eventos'];
    return collections.reduce((total, collection) => total + db.count(collection), 0);
}

// Función para calcular promedio general
function calculatePromedioGeneral() {
    const notas = db.read('notas');
    if (notas.length === 0) return 0;
    
    const suma = notas.reduce((acc, nota) => acc + parseFloat(nota.nota || 0), 0);
    return suma / notas.length;
}

// Función para actualizar información del sistema
function updateSystemInfo() {
    const storageStats = db.getStorageStats();
    
    if (storageStats) {
        document.getElementById('tamano-datos').textContent = storageStats.totalSizeFormatted;
    }
    
    // Verificar estado del almacenamiento
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        document.getElementById('storage-status').textContent = 'Disponible';
        document.getElementById('storage-status').className = 'badge bg-success';
    } catch (e) {
        document.getElementById('storage-status').textContent = 'Limitado';
        document.getElementById('storage-status').className = 'badge bg-warning';
    }
}

// Función para cargar gráficos del dashboard
function loadDashboardCharts() {
    // Destruir gráficos existentes
    Object.values(dashboardCharts).forEach(chart => {
        if (chart) chart.destroy();
    });
    dashboardCharts = {};
    
    // Gráfico de estudiantes por grado
    loadEstudiantesPorGradoChart();
    
    // Gráfico de estudiantes por turno
    loadEstudiantesPorTurnoChart();
}

// Función para cargar gráfico de estudiantes por grado
function loadEstudiantesPorGradoChart() {
    const ctx = document.getElementById('estudiantesPorGradoChart');
    if (!ctx) return;
    
    const estudiantes = db.read('estudiantes');
    const gradeCounts = {};
    
    // Inicializar contadores para todos los grados
    for (let i = 1; i <= 6; i++) {
        gradeCounts[i] = 0;
    }
    
    // Contar estudiantes por grado
    estudiantes.forEach(estudiante => {
        const grado = parseInt(estudiante.grado);
        if (grado >= 1 && grado <= 6) {
            gradeCounts[grado]++;
        }
    });
    
    const labels = Object.keys(gradeCounts).map(grado => `${grado}° Grado`);
    const data = Object.values(gradeCounts);
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    dashboardCharts.estudiantesPorGrado = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estudiantes',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color + '80'),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#6c757d'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#6c757d'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Función para cargar gráfico de estudiantes por turno
function loadEstudiantesPorTurnoChart() {
    const ctx = document.getElementById('estudiantesPorTurnoChart');
    if (!ctx) return;
    
    const estudiantes = db.read('estudiantes');
    const turnos = db.read('turnos');
    const turnoCounts = {};
    
    // Inicializar contadores
    turnos.forEach(turno => {
        turnoCounts[turno.nombre] = 0;
    });
    
    // Contar estudiantes por turno
    estudiantes.forEach(estudiante => {
        const turno = turnos.find(t => t.id === estudiante.turno_id);
        if (turno) {
            turnoCounts[turno.nombre]++;
        }
    });
    
    const labels = Object.keys(turnoCounts);
    const data = Object.values(turnoCounts);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    
    dashboardCharts.estudiantesPorTurno = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#6c757d',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }
            }
        }
    });
}

// Función para cargar actividad reciente
function loadRecentActivity() {
    const container = document.getElementById('actividad-reciente');
    if (!container) return;
    
    const logs = db.getLogs(10);
    
    if (logs.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-history fa-2x mb-2"></i>
                <div>No hay actividad reciente</div>
            </div>
        `;
        return;
    }
    
    const activityHtml = logs.map(log => {
        const icon = getActivityIcon(log.action);
        const color = getActivityColor(log.action);
        const time = formatDateTime(log.timestamp);
        
        return `
            <div class="list-group-item list-group-item-action border-0">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">
                        <i class="fas fa-${icon} me-2 text-${color}"></i>
                        ${getActivityDescription(log)}
                    </h6>
                    <small class="text-muted">${formatDateShort(log.timestamp)}</small>
                </div>
                <p class="mb-1 small text-muted">${log.details || ''}</p>
                <small class="text-muted">${time}</small>
            </div>
        `;
    }).join('');
    
    container.innerHTML = activityHtml;
}

// Función para obtener icono de actividad
function getActivityIcon(action) {
    const icons = {
        'create': 'plus',
        'update': 'edit',
        'delete': 'trash',
        'export': 'download',
        'import': 'upload',
        'backup': 'save',
        'restore': 'undo'
    };
    return icons[action] || 'circle';
}

// Función para obtener color de actividad
function getActivityColor(action) {
    const colors = {
        'create': 'success',
        'update': 'info',
        'delete': 'danger',
        'export': 'primary',
        'import': 'warning',
        'backup': 'secondary',
        'restore': 'primary'
    };
    return colors[action] || 'secondary';
}

// Función para obtener descripción de actividad
function getActivityDescription(log) {
    const descriptions = {
        'create': `Creado en ${log.collection}`,
        'update': `Actualizado en ${log.collection}`,
        'delete': `Eliminado de ${log.collection}`,
        'export': `Exportado ${log.collection}`,
        'import': `Importado a ${log.collection}`,
        'backup': 'Respaldo creado',
        'restore': 'Datos restaurados'
    };
    return descriptions[log.action] || log.action;
}

// Función para cargar alertas del dashboard
function loadDashboardAlerts() {
    const container = document.getElementById('dashboard-alerts');
    if (!container) return;
    
    const alerts = [];
    
    // Verificar inscripciones pendientes
    const inscripcionesPendientes = getInscripcionesPendientes();
    if (inscripcionesPendientes > 0) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            title: 'Inscripciones Pendientes',
            message: `Hay ${inscripcionesPendientes} inscripciones pendientes de procesar.`,
            action: 'showSection("inscripciones")'
        });
    }
    
    // Verificar espacio de almacenamiento
    const storageStats = db.getStorageStats();
    if (storageStats && storageStats.totalSize > 4 * 1024 * 1024) { // 4MB
        alerts.push({
            type: 'info',
            icon: 'info-circle',
            title: 'Espacio de Almacenamiento',
            message: `El sistema está utilizando ${storageStats.totalSizeFormatted}. Considere crear un respaldo.`,
            action: 'createBackup()'
        });
    }
    
    // Verificar si no hay respaldos recientes
    const logs = db.getLogs(100);
    const lastBackup = logs.find(log => log.action === 'backup');
    if (!lastBackup) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            title: 'Sin Respaldos',
            message: 'No se han encontrado respaldos recientes. Se recomienda crear uno.',
            action: 'createBackup()'
        });
    }
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-check-circle fa-2x mb-2 text-success"></i>
                <div>Todo está funcionando correctamente</div>
            </div>
        `;
        return;
    }
    
    const alertsHtml = alerts.map(alert => `
        <div class="alert alert-${alert.type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${alert.icon} me-2"></i>
            <strong>${alert.title}:</strong> ${alert.message}
            ${alert.action ? `<button type="button" class="btn btn-sm btn-outline-${alert.type} ms-2" onclick="${alert.action}">Ver</button>` : ''}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `).join('');
    
    container.innerHTML = alertsHtml;
}

// Función para actualizar dashboard
function refreshDashboard() {
    showLoading('Actualizando dashboard...');
    
    setTimeout(() => {
        loadDashboardData();
        hideLoading();
        showGlobalAlert('Dashboard actualizado', 'success');
    }, 1000);
}

// Función para exportar reporte del dashboard
function exportDashboardReport() {
    try {
        const stats = getSystemStats();
        const storageStats = db.getStorageStats();
        
        const reportData = {
            fecha_reporte: new Date().toISOString(),
            estadisticas: {
                estudiantes_registrados: stats.estudiantes,
                profesores_activos: stats.profesores,
                matriculas_activas: stats.matriculas,
                notas_registradas: stats.notas,
                tutores_registrados: stats.tutores,
                inscripciones_pendientes: getInscripcionesPendientes(),
                eventos_mes_actual: getEventosDelMes(),
                promedio_general: calculatePromedioGeneral()
            },
            almacenamiento: {
                total_registros: getTotalRecords(),
                tamano_datos: storageStats ? storageStats.totalSizeFormatted : 'N/A',
                estado: 'Disponible'
            }
        };
        
        // Exportar como Excel
        const ws = XLSX.utils.json_to_sheet([reportData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte Dashboard');
        
        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `reporte_dashboard_${today}.xlsx`);
        
        showGlobalAlert('Reporte exportado correctamente', 'success');
        
    } catch (error) {
        console.error('Error exportando reporte:', error);
        showGlobalAlert('Error al exportar reporte', 'error');
    }
}

// Exportar funciones
window.loadDashboardSection = loadDashboardSection;
window.refreshDashboard = refreshDashboard;
window.exportDashboardReport = exportDashboardReport;

console.log('✅ Dashboard.js cargado correctamente');
alert('Dashboard script cargado - Verificar consola para errores');