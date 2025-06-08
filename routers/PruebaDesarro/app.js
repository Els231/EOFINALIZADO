/**
 * Aplicación principal del sistema escolar
 * Controla la navegación y inicialización general
 */

// Variables globales
let currentSection = 'dashboard';
let dashboardCharts = {};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función de inicialización
function initializeApp() {
    console.log('Inicializando sistema escolar...');
    
    // Cargar dashboard por defecto
    showSection('dashboard');
    
    // Actualizar estadísticas del dashboard
    updateDashboardStats();
    
    // Inicializar gráficos del dashboard
    initializeDashboardCharts();
    
    console.log('Sistema escolar inicializado correctamente');
}

// Función para mostrar secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar enlace actual
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentSection = sectionName;
        
        // Cargar contenido específico de la sección
        loadSectionContent(sectionName);
    }
}

// Función para cargar contenido específico de cada sección
function loadSectionContent(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            updateDashboardStats();
            if (Object.keys(dashboardCharts).length === 0) {
                setTimeout(() => initializeDashboardCharts(), 100);
            }
            break;
        case 'estudiantes':
            if (typeof loadEstudiantesSection === 'function') {
                loadEstudiantesSection();
            }
            break;
        case 'profesores':
            if (typeof loadProfesoresSection === 'function') {
                loadProfesoresSection();
            }
            break;
        case 'notas':
            if (typeof loadNotasSection === 'function') {
                loadNotasSection();
            }
            break;
        case 'matriculas':
            if (typeof loadMatriculasSection === 'function') {
                loadMatriculasSection();
            }
            break;
        case 'calendario':
            if (typeof loadCalendarioSection === 'function') {
                loadCalendarioSection();
            }
            break;
        case 'codigo':
            if (typeof loadCodigoSection === 'function') {
                loadCodigoSection();
            }
            break;
        case 'analytics':
            if (typeof loadAnalyticsSection === 'function') {
                loadAnalyticsSection();
            }
            break;
        case 'sistema':
            if (typeof loadSistemaSection === 'function') {
                loadSistemaSection();
            }
            break;
    }
}

// Función para actualizar estadísticas del dashboard
function updateDashboardStats() {
    try {
        const stats = db.getEstadisticas();
        
        // Actualizar contadores
        document.getElementById('total-estudiantes').textContent = stats.totalEstudiantes;
        document.getElementById('total-profesores').textContent = stats.totalProfesores;
        document.getElementById('total-matriculas').textContent = stats.totalMatriculas;
        document.getElementById('eventos-hoy').textContent = stats.eventosHoy;
        
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}

// Función para inicializar gráficos del dashboard
function initializeDashboardCharts() {
    try {
        // Gráfico de notas por mes
        initializeNotasChart();
        
        // Gráfico de distribución por grados
        initializeGradosChart();
        
    } catch (error) {
        console.error('Error al inicializar gráficos:', error);
    }
}

// Inicializar gráfico de notas
function initializeNotasChart() {
    const ctx = document.getElementById('notasChart');
    if (!ctx) return;
    
    // Obtener datos de notas
    const notas = db.getNotas();
    const notasPorMes = {};
    
    // Agrupar notas por mes
    notas.forEach(nota => {
        const fecha = new Date(nota.fechaRegistro);
        const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
        
        if (!notasPorMes[mes]) {
            notasPorMes[mes] = [];
        }
        notasPorMes[mes].push(parseFloat(nota.calificacion));
    });
    
    // Calcular promedios
    const meses = Object.keys(notasPorMes);
    const promedios = meses.map(mes => {
        const notasDelMes = notasPorMes[mes];
        return notasDelMes.reduce((a, b) => a + b, 0) / notasDelMes.length;
    });
    
    // Si no hay datos, mostrar datos de ejemplo
    const labels = meses.length > 0 ? meses : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
    const data = promedios.length > 0 ? promedios : [85, 88, 82, 90, 87];
    
    dashboardCharts.notasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Promedio de Notas',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
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

// Inicializar gráfico de grados
function initializeGradosChart() {
    const ctx = document.getElementById('gradosChart');
    if (!ctx) return;
    
    const stats = db.getEstadisticas();
    const distribucion = stats.distribucionGrados;
    
    const labels = Object.keys(distribucion);
    const data = Object.values(distribucion);
    const colors = generateColors(labels.length);
    
    // Si no hay datos, mostrar estado vacío
    if (labels.length === 0) {
        labels.push('Sin datos');
        data.push(1);
        colors.push('#95a5a6');
    }
    
    dashboardCharts.gradosChart = new Chart(ctx, {
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
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Función para cerrar sesión
function logout() {
    showAlert.confirm(
        '¿Cerrar Sesión?',
        '¿Estás seguro de que deseas cerrar la sesión?'
    ).then((result) => {
        if (result.isConfirmed) {
            // Aquí podrías agregar lógica de logout real
            showAlert.success('¡Hasta luego!', 'Sesión cerrada correctamente');
            // Simular redirección o limpiar datos de sesión
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}

// Función para exportar datos del dashboard
function exportDashboard() {
    try {
        const stats = db.getEstadisticas();
        const data = [
            {
                'Métrica': 'Estudiantes Activos',
                'Valor': stats.totalEstudiantes
            },
            {
                'Métrica': 'Profesores',
                'Valor': stats.totalProfesores
            },
            {
                'Métrica': 'Matrículas Activas',
                'Valor': stats.totalMatriculas
            },
            {
                'Métrica': 'Eventos Hoy',
                'Valor': stats.eventosHoy
            },
            {
                'Métrica': 'Promedio General',
                'Valor': stats.promedioGeneral
            }
        ];
        
        exportToExcel('Estadísticas Dashboard', data, 'dashboard_estadisticas');
    } catch (error) {
        console.error('Error al exportar dashboard:', error);
        showAlert.error('Error', 'No se pudo exportar las estadísticas');
    }
}

// Función para refrescar dashboard
function refreshDashboard() {
    updateDashboardStats();
    
    // Destruir gráficos existentes
    Object.values(dashboardCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    dashboardCharts = {};
    
    // Reinicializar gráficos
    setTimeout(() => initializeDashboardCharts(), 100);
    
    showAlert.success('¡Actualizado!', 'Dashboard actualizado correctamente');
}

// Event listeners para funcionalidades globales
document.addEventListener('keydown', function(e) {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                showSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                showSection('estudiantes');
                break;
            case '3':
                e.preventDefault();
                showSection('profesores');
                break;
            case '4':
                e.preventDefault();
                showSection('notas');
                break;
            case '5':
                e.preventDefault();
                showSection('matriculas');
                break;
            case '6':
                e.preventDefault();
                showSection('calendario');
                break;
            case '7':
                e.preventDefault();
                showSection('codigo');
                break;
        }
    }
});

// Manejar redimensionamiento de ventana
window.addEventListener('resize', debounce(() => {
    Object.values(dashboardCharts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}, 300));

// Funciones utilitarias específicas para el dashboard
function getRecentActivity() {
    const actividades = [];
    
    // Obtener estudiantes recientes
    const estudiantes = db.getEstudiantes()
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
        .slice(0, 3);
    
    estudiantes.forEach(estudiante => {
        actividades.push({
            tipo: 'estudiante',
            descripcion: `Nuevo estudiante registrado: ${estudiante.nombres} ${estudiante.apellidos}`,
            fecha: estudiante.fechaRegistro,
            icono: 'fas fa-user-graduate text-primary'
        });
    });
    
    // Obtener notas recientes
    const notas = db.getNotas()
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
        .slice(0, 3);
    
    notas.forEach(nota => {
        const estudiante = db.getEstudianteById(nota.estudianteId);
        if (estudiante) {
            actividades.push({
                tipo: 'nota',
                descripcion: `Nueva calificación: ${estudiante.nombres} - ${nota.calificacion}`,
                fecha: nota.fechaRegistro,
                icono: 'fas fa-star text-warning'
            });
        }
    });
    
    return actividades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
}

// Exponer funciones globalmente si es necesario
window.showSection = showSection;
window.logout = logout;
window.exportDashboard = exportDashboard;
window.refreshDashboard = refreshDashboard;
