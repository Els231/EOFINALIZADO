/**
 * Aplicación principal del Sistema de Gestión Escolar
 * Escuela Jesús El Buen Maestro
 */

// Variables globales
let currentSection = 'dashboard';
let globalAlertCounter = 0;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Sistema de Gestión Escolar');
    
    // Inicializar base de datos
    initializeDatabase();
    
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardSection();
});
    
    // Inicializar reloj
    updateClock();
    setInterval(updateClock, 1000);
    
    // Registrar event listeners
    registerEventListeners();
    
    console.log('✅ Sistema iniciado correctamente');
});
// Función para mostrar secciones
function showSection(sectionName) {
    // Validar entrada
    if (!sectionName || typeof sectionName !== 'string') {
        console.error('Nombre de sección no válido:', sectionName);
        return;
    }

    // Ocultar todas las secciones con transición suave
    document.querySelectorAll('.content-section').forEach(section => {
        if (section.classList.contains('active')) {
            section.style.opacity = '0';
            setTimeout(() => {
                section.classList.remove('active');
                section.style.display = 'none';
            }, 300); // Coincide con la duración de la transición CSS
        }
    });
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        // Preparar la sección antes de mostrarla
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
        }, 10);
        
        currentSection = sectionName;
        
        // Activar enlace de navegación correspondiente
        const navLink = document.querySelector(`.nav-link[onclick*="${sectionName}"]`);
        if (navLink) {
            navLink.classList.add('active');
            navLink.setAttribute('aria-current', 'page');
        }
        
        // Cargar contenido de la sección solo si es necesario
        if (!targetSection.dataset.loaded) {
            loadSectionContent(sectionName);
            targetSection.dataset.loaded = 'true';
        }
        
        // Actualizar título de la página
        updatePageTitle(sectionName);
        
        // Desplazamiento suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        console.error(`Sección ${sectionName} no encontrada`);
        // Fallback: mostrar dashboard si la sección no existe
        if (sectionName !== 'dashboard') {
            showSection('dashboard');
        }
    }
}

// Función auxiliar para actualizar el título de la página
function updatePageTitle(sectionName) {
    const sectionTitles = {
        'dashboard': 'Dashboard',
        'estudiantes': 'Estudiantes',
        'profesores': 'Profesores',
        'tutores': 'Tutores',
        'matriculas': 'Matrículas',
        'inscripciones': 'Inscripciones',
        'notas': 'Notas',
        'calendario': 'Calendario',
        'reportes': 'Reportes',
        'sistema': 'Sistema'
    };
    
    const title = sectionTitles[sectionName] || 'Sistema de Gestión Escolar';
    document.title = `${title} | Escuela Jesús El Buen Maestro`;
}

// Función para cargar contenido dinámico
function loadSectionContent(sectionName) {
    const loader = {
        'dashboard': loadDashboardSection,
        'estudiantes': loadEstudiantesSection,
        'profesores': loadProfesoresSection,
        'tutores': loadTutoresSection,
        'matriculas': loadMatriculasSection,
        'inscripciones': loadInscripcionesSection,
        'notas': loadNotasSection,
        'calendario': loadCalendarioSection,
        'reportes': loadReportesSection,
        'sistema': loadSistemaSection
    };
    
    if (loader[sectionName]) {
        try {
            loader[sectionName]();
        } catch (error) {
            console.error(`Error al cargar la sección ${sectionName}:`, error);
            showGlobalAlert(`Error al cargar ${sectionName}`, 'error');
        }
    }
}

// Función para cargar contenido de secciones
function loadSectionContent(sectionName) {
    try {
        switch(sectionName) {
            case 'dashboard':
                loadDashboardSection();
                break;
            case 'estudiantes':
                loadEstudiantesSection();
                break;
            case 'profesores':
                loadProfesoresSection();
                break;
            case 'tutores':
                loadTutoresSection();
                break;
            case 'matriculas':
                loadMatriculasSection();
                break;
            case 'inscripciones':
                loadInscripcionesSection();
                break;
            case 'notas':
                loadNotasSection();
                break;
            case 'calendario':
                loadCalendarioSection();
                break;
            case 'reportes':
                loadReportesSection();
                break;
            case 'sistema':
                loadSistemaSection();
                break;
            default:
                console.warn(`Sección no encontrada: ${sectionName}`);
        }
    } catch (error) {
        console.error(`Error cargando sección ${sectionName}:`, error);
        showGlobalAlert(`Error cargando la sección ${sectionName}`, 'error');
    }
}
function updateActiveMenu(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${activeSection}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Función para actualizar el título de la página
function updatePageTitle(sectionName) {
    const titles = {
        dashboard: 'Dashboard',
        estudiantes: 'Gestión de Estudiantes',
        profesores: 'Gestión de Profesores',
        tutores: 'Gestión de Tutores',
        matriculas: 'Gestión de Matrículas',
        inscripciones: 'Gestión de Inscripciones',
        notas: 'Sistema de Notas',
        calendario: 'Calendario Escolar',
        reportes: 'Reportes y Exportación',
        sistema: 'Configuración del Sistema'
    };
    
    const title = titles[sectionName] || 'Sistema Escolar';
    document.title = `${title} - Escuela Jesús El Buen Maestro`;
}

// Función para actualizar el reloj
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Función para mostrar alertas globales
function showGlobalAlert(message, type = 'info', duration = 5000) {
    const alertId = `alert-${++globalAlertCounter}`;
    const alertContainer = document.getElementById('global-alerts');
    
    if (!alertContainer) return;
    
    const alertTypes = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    };
    
    const alertClass = alertTypes[type] || alertTypes.info;
    
    const alertHtml = `
        <div id="${alertId}" class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-remover después del tiempo especificado
    if (duration > 0) {
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }
        }, duration);
    }
}

// Función para obtener el icono de alerta
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons.info;
}

// Función para registrar event listeners
function registerEventListeners() {
    // Listener para teclas de acceso rápido
    document.addEventListener('keydown', function(e) {
        // Ctrl + teclas numéricas para cambiar secciones
        if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const sections = ['dashboard', 'estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas', 'calendario', 'reportes'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                showSection(sections[sectionIndex]);
            }
        }
        
        // ESC para cerrar modales
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const bsModal = bootstrap.Modal.getInstance(openModal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        }
    });
    
    // Listener para cambios en localStorage (sincronización entre pestañas)
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.startsWith('escuela_')) {
            // Recargar datos si han cambiado en otra pestaña
            loadSectionContent(currentSection);
        }
    });
    
    // Listener para detectar cambios de conectividad
    window.addEventListener('online', function() {
        showGlobalAlert('Conexión a internet restaurada', 'success');
    });
    
    window.addEventListener('offline', function() {
        showGlobalAlert('Sin conexión a internet. Trabajando en modo local.', 'warning');
    });
}

// Función para crear respaldo
function createBackup() {
    try {
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
                sistema: db.read('sistema')
            }
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_escuela_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Registrar en logs
        db.logAction('backup', 'export', 'sistema', 'Backup completo creado');
        
        showGlobalAlert('Respaldo creado correctamente', 'success');
        
    } catch (error) {
        console.error('Error creando respaldo:', error);
        showGlobalAlert('Error al crear respaldo', 'error');
    }
}

// Función para mostrar modal de importación
function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Función para importar datos
function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showGlobalAlert('Por favor seleccione un archivo', 'warning');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let importedData;
            
            if (file.name.endsWith('.json')) {
                importedData = JSON.parse(e.target.result);
                
                if (importedData.data) {
                    // Confirmar importación
                    Swal.fire({
                        title: '¿Confirmar importación?',
                        text: 'Esta acción sobrescribirá todos los datos existentes',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, importar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Importar datos
                            Object.entries(importedData.data).forEach(([collection, data]) => {
                                if (Array.isArray(data)) {
                                    // Limpiar colección existente
                                    const existing = db.read(collection);
                                    existing.forEach(item => db.delete(collection, item.id));
                                    
                                    // Importar nuevos datos
                                    data.forEach(item => db.create(collection, item));
                                }
                            });
                            
                            // Cerrar modal
                            const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
                            modal.hide();
                            
                            // Recargar sección actual
                            loadSectionContent(currentSection);
                            
                            showGlobalAlert('Datos importados correctamente', 'success');
                            
                            // Registrar en logs
                            db.logAction('import', 'restore', 'sistema', 'Datos importados desde backup');
                        }
                    });
                } else {
                    throw new Error('Formato de archivo inválido');
                }
            } else {
                throw new Error('Tipo de archivo no soportado');
            }
            
        } catch (error) {
            console.error('Error importando datos:', error);
            showGlobalAlert('Error al importar datos: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Función para confirmar acciones peligrosas
function confirmAction(title, text, confirmText = 'Confirmar') {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    });
}

// Función para mostrar loading
function showLoading(message = 'Cargando...') {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// Función para ocultar loading
function hideLoading() {
    Swal.close();
}

// Función para formatear números
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Función para obtener estadísticas generales
function getSystemStats() {
    return {
        estudiantes: db.count('estudiantes'),
        profesores: db.count('profesores'),
        tutores: db.count('tutores'),
        matriculas: db.count('matriculas'),
        inscripciones: db.count('inscripciones'),
        notas: db.count('notas'),
        eventos: db.count('eventos')
    };
}

// Función para filtrar datos por fecha
function filterByDateRange(data, dateField, startDate, endDate) {
    if (!startDate && !endDate) return data;
    
    return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        if (!itemDate || isNaN(itemDate)) return false;
        
        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;
        
        return true;
    });
}

// Exportar funciones globales
window.showSection = showSection;
window.showGlobalAlert = showGlobalAlert;
window.createBackup = createBackup;
window.showImportModal = showImportModal;
window.importData = importData;
window.confirmAction = confirmAction;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.formatNumber = formatNumber;
window.getSystemStats = getSystemStats;
window.filterByDateRange = filterByDateRange;

console.log('✅ App.js cargado correctamente');
