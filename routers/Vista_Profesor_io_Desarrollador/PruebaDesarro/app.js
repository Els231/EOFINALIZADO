/**
 * Aplicación principal del sistema escolar
 * Controla la navegación y inicialización general con sincronización automática
 */

// Variables globales
let currentSection = 'dashboard';
let dashboardCharts = {};

// Registrar módulo principal en el sistema de sincronización
window.registerModule('dashboard', handleDashboardSync);

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función de inicialización
function initializeApp() {
    console.log('Inicializando sistema escolar...');
    
    // Verificar que la base de datos esté disponible
    if (typeof window.db !== 'undefined') {
        console.log('Base de datos inicializada correctamente');
    } else {
        console.error('Error: Base de datos no disponible');
        return;
    }
    
    // Verificar que el gestor de sincronización esté disponible
    if (typeof window.syncManager !== 'undefined') {
        console.log('Gestor de sincronización inicializado correctamente');
    } else {
        console.error('Error: Gestor de sincronización no disponible');
        return;
    }
    
    // Cargar dashboard por defecto
    showSection('dashboard');
    
    // Actualizar estadísticas del dashboard
    updateDashboardStats();
    
    // Configurar alertas globales
    setupGlobalAlerts();
    
    // Configurar listeners para estadísticas
    setupStatsListeners();
    
    console.log('Sistema escolar inicializado correctamente');
}

// Función de sincronización para el dashboard
function handleDashboardSync(changeData) {
    const { collection, action, data } = changeData;
    
    // Actualizar estadísticas cuando hay cambios en cualquier colección principal
    if (['estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas'].includes(collection)) {
        updateDashboardStats();
        loadActivityFeed();
    }
    
    // Actualizar estado del sistema
    updateSystemStatus();
}

// Función para mostrar secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.remove('active');
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
        targetSection.classList.add('active');
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
            loadActivityFeed();
            updateSystemStatus();
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
        case 'inscripciones':
            if (typeof loadInscripcionesSection === 'function') {
                loadInscripcionesSection();
            }
            break;
        case 'tutores':
            if (typeof loadTutoresSection === 'function') {
                loadTutoresSection();
            }
            break;
        case 'calendario':
            if (typeof loadCalendarioSection === 'function') {
                loadCalendarioSection();
            }
            break;
        case 'analytics':
            if (typeof loadAnalyticsSection === 'function') {
                loadAnalyticsSection();
            }
            break;
        case 'reportes':
            if (typeof loadReportesSection === 'function') {
                loadReportesSection();
            }
            break;
        case 'sistema':
            if (typeof loadSistemaSection === 'function') {
                loadSistemaSection();
            }
            break;
    }
}

// Actualizar estadísticas del dashboard
function updateDashboardStats() {
    try {
        const stats = window.syncManager.getCrossModuleStats();
        
        // Actualizar contadores principales
        document.getElementById('dashboard-estudiantes').textContent = stats.estudiantes.total || 0;
        document.getElementById('dashboard-profesores').textContent = stats.profesores.total || 0;
        document.getElementById('dashboard-tutores').textContent = stats.tutores.total || 0;
        document.getElementById('dashboard-matriculas').textContent = stats.matriculas.total || 0;
        
    } catch (error) {
        console.error('Error al actualizar estadísticas del dashboard:', error);
        // Mostrar valores por defecto
        document.getElementById('dashboard-estudiantes').textContent = '0';
        document.getElementById('dashboard-profesores').textContent = '0';
        document.getElementById('dashboard-tutores').textContent = '0';
        document.getElementById('dashboard-matriculas').textContent = '0';
    }
}

// Cargar feed de actividad
function loadActivityFeed() {
    try {
        const activityContainer = document.getElementById('activity-feed');
        if (!activityContainer) return;

        const logs = window.db.read('system_logs')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        if (logs.length === 0) {
            activityContainer.innerHTML = '<p class="text-muted">No hay actividad reciente</p>';
            return;
        }

        const activityHtml = logs.map(log => {
            const timeAgo = getTimeAgo(log.timestamp);
            const actionIcon = getActionIcon(log.action);
            const actionText = getActionText(log.action, log.collection);
            
            return `
                <div class="d-flex align-items-center mb-3">
                    <div class="icon-circle ${getActionColor(log.action)} me-3" style="width: 35px; height: 35px; font-size: 0.8rem;">
                        <i class="${actionIcon}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-medium">${actionText}</div>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
            `;
        }).join('');

        activityContainer.innerHTML = activityHtml;
        
    } catch (error) {
        console.error('Error al cargar feed de actividad:', error);
        const activityContainer = document.getElementById('activity-feed');
        if (activityContainer) {
            activityContainer.innerHTML = '<p class="text-danger">Error al cargar actividad</p>';
        }
    }
}

// Actualizar estado del sistema
function updateSystemStatus() {
    try {
        const syncReport = window.syncManager.getSyncReport();
        
        // Estado de sincronización
        const syncStatus = document.getElementById('sync-status');
        if (syncStatus) {
            if (syncReport.pendingChanges === 0) {
                syncStatus.textContent = 'OK';
                syncStatus.className = 'badge bg-success';
            } else {
                syncStatus.textContent = `${syncReport.pendingChanges} pendientes`;
                syncStatus.className = 'badge bg-warning';
            }
        }
        
        // Módulos activos
        const modulesStatus = document.getElementById('modules-status');
        if (modulesStatus) {
            modulesStatus.textContent = `${syncReport.activeModules}/${syncReport.totalModules}`;
            modulesStatus.className = syncReport.activeModules === syncReport.totalModules 
                ? 'badge bg-success' 
                : 'badge bg-warning';
        }
        
    } catch (error) {
        console.error('Error al actualizar estado del sistema:', error);
    }
}

// Configurar listeners para estadísticas
function setupStatsListeners() {
    window.addEventListener('statsUpdated', (event) => {
        const { module, stats } = event.detail;
        
        // Actualizar estadísticas del dashboard si es necesario
        if (currentSection === 'dashboard') {
            updateDashboardStats();
        }
    });
}

// Configurar alertas globales
function setupGlobalAlerts() {
    // Listener para errores globales
    window.addEventListener('error', (event) => {
        console.error('Error global:', event.error);
        showGlobalAlert('Ha ocurrido un error en el sistema', 'error');
    });

    // Listener para promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesa rechazada:', event.reason);
        showGlobalAlert('Error de conexión o procesamiento', 'warning');
    });

    // Verificar integridad de datos periódicamente
    setInterval(() => {
        const issues = window.syncManager.validateDataIntegrity();
        if (issues.length > 0) {
            console.warn('Problemas de integridad de datos detectados:', issues);
            // Solo mostrar alerta si hay muchos problemas
            if (issues.length > 5) {
                showGlobalAlert(`Se detectaron ${issues.length} problemas de integridad de datos`, 'warning');
            }
        }
    }, 300000); // Cada 5 minutos
}

// Mostrar alerta global
function showGlobalAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertElement.style.cssText = `
        top: 90px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertElement.innerHTML = `
        <i class="${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertElement);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

// Funciones auxiliares
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}

function getActionIcon(action) {
    const icons = {
        created: 'fas fa-plus',
        updated: 'fas fa-edit',
        deleted: 'fas fa-trash',
        import: 'fas fa-upload',
        export: 'fas fa-download',
        clear: 'fas fa-broom'
    };
    return icons[action] || 'fas fa-info';
}

function getActionColor(action) {
    const colors = {
        created: 'success',
        updated: 'primary',
        deleted: 'danger',
        import: 'info',
        export: 'warning',
        clear: 'danger'
    };
    return colors[action] || 'primary';
}

function getActionText(action, collection) {
    const actions = {
        created: 'Creado',
        updated: 'Actualizado',
        deleted: 'Eliminado',
        import: 'Importado',
        export: 'Exportado',
        clear: 'Limpiado'
    };
    
    const collections = {
        estudiantes: 'estudiante',
        profesores: 'profesor',
        tutores: 'tutor',
        matriculas: 'matrícula',
        inscripciones: 'inscripción',
        notas: 'nota',
        eventos: 'evento',
        system: 'sistema'
    };

    const actionText = actions[action] || action;
    const collectionText = collections[collection] || collection;
    
    return `${actionText} ${collectionText}`;
}

function getAlertIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Funciones globales para uso en otros módulos
window.showGlobalAlert = showGlobalAlert;
window.updateDashboardStats = updateDashboardStats;

// Función para refrescar toda la aplicación
function refreshApplication() {
    try {
        // Forzar sincronización completa
        window.syncManager.forceSyncAll();
        
        // Recargar sección actual
        loadSectionContent(currentSection);
        
        showGlobalAlert('Sistema actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error al refrescar aplicación:', error);
        showGlobalAlert('Error al actualizar el sistema', 'error');
    }
}

// Función para obtener información del sistema
function getSystemInfo() {
    return {
        currentSection,
        totalModules: window.syncManager.getSyncReport().totalModules,
        activeModules: window.syncManager.getSyncReport().activeModules,
        databaseStatus: 'OK',
        lastUpdate: new Date().toISOString()
    };
}

// Exportar funciones principales
window.showSection = showSection;
window.refreshApplication = refreshApplication;
window.getSystemInfo = getSystemInfo;

