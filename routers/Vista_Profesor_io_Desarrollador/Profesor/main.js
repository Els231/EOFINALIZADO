// ===== FUNCIONES PRINCIPALES =====

// Variables globales
let currentSection = 'dashboard';

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateDashboardStats();
    loadRecentActivities();
    
    // Establecer fecha actual en campos de fecha
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
});

// Inicializar la aplicación
function initializeApp() {
    // Configurar año actual para matrículas
    const currentYear = new Date().getFullYear();
    const yearFilter = document.getElementById('enrollmentYearFilter');
    if (yearFilter) {
        for (let i = currentYear - 2; i <= currentYear + 2; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === currentYear) option.selected = true;
            yearFilter.appendChild(option);
        }
    }

    // Configurar filtros de búsqueda
    setupSearchFilters();
    
    // Mostrar sección inicial
    showSection('dashboard');
}

// Mostrar sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Actualizar navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Marcar enlace activo
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    currentSection = sectionName;

    // Cargar datos específicos de la sección
    switch (sectionName) {
        case 'dashboard':
            updateDashboardStats();
            loadRecentActivities();
            break;
        case 'mis-estudiantes':
            loadStudents();
            break;
        case 'notas':
            loadGrades();
            populateGradeFilters();
            break;
        case 'asistencia':
            loadAttendanceData();
            break;
        case 'matriculas':
            loadEnrollments();
            break;
        case 'calendario':
            initializeCalendar();
            break;
        case 'estadisticas':
            loadStatistics();
            break;
    }
}

// Actualizar estadísticas del dashboard
function updateDashboardStats() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();

    // Total de estudiantes
    document.getElementById('totalEstudiantes').textContent = students.length;

    // Estudiantes presentes hoy
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today && a.status === 'presente');
    document.getElementById('presentesHoy').textContent = todayAttendance.length;

    // Promedio general
    if (grades.length > 0) {
        const avgGrade = grades.reduce((sum, grade) => sum + parseFloat(grade.value), 0) / grades.length;
        document.getElementById('promedioGeneral').textContent = avgGrade.toFixed(1);
    } else {
        document.getElementById('promedioGeneral').textContent = '0.0';
    }

    // Matrículas activas
    const activeEnrollments = enrollments.filter(e => e.status === 'activa');
    document.getElementById('matriculasActivas').textContent = activeEnrollments.length;

    // Actualizar notificaciones
    updateNotifications();
}

// Actualizar notificaciones
function updateNotifications() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    let notifications = 0;

    // Verificar estudiantes sin notas recientes
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    students.forEach(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        const recentGrades = studentGrades.filter(g => new Date(g.date) > thirtyDaysAgo);
        
        if (recentGrades.length === 0) {
            notifications++;
        }
    });

    document.getElementById('notificationCount').textContent = notifications;
}

// Cargar actividades recientes
function loadRecentActivities() {
    const activities = Storage.getActivities();
    const container = document.getElementById('actividadesRecientes');

    if (activities.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay actividades recientes</p>';
        return;
    }

    const html = activities.slice(0, 10).map(activity => {
        const date = new Date(activity.timestamp).toLocaleString('es-ES');
        return `
            <div class="d-flex align-items-center mb-2 p-2 border-bottom">
                <div class="avatar me-3">${activity.icon || '📝'}</div>
                <div class="flex-grow-1">
                    <div class="fw-bold">${activity.title}</div>
                    <small class="text-muted">${activity.description} - ${date}</small>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// Configurar filtros de búsqueda
function setupSearchFilters() {
    // Filtro de estudiantes
    const searchStudent = document.getElementById('searchStudent');
    if (searchStudent) {
        searchStudent.addEventListener('input', function() {
            filterStudents();
        });
    }

    // Filtros adicionales
    const filters = ['gradeFilter', 'statusFilter', 'gradeStudentFilter', 'gradeSubjectFilter', 'gradePeriodFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', function() {
                if (filterId.includes('grade')) {
                    filterGrades();
                } else {
                    filterStudents();
                }
            });
        }
    });
}

// Función de logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Aquí podrías limpiar datos sensibles si fuera necesario
        alert('Sesión cerrada correctamente');
        // En una aplicación real, redirigirías a la página de login
        window.location.reload();
    }
}

// Exportar datos generales
function exportData(type) {
    try {
        switch (type) {
            case 'general':
                exportGeneralReport();
                break;
            default:
                alert('Tipo de exportación no válido');
        }
    } catch (error) {
        console.error('Error al exportar datos:', error);
        alert('Error al exportar los datos. Por favor, inténtalo de nuevo.');
    }
}

// Exportar reporte general
function exportGeneralReport() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();

    const reportData = {
        fecha: new Date().toLocaleString('es-ES'),
        resumen: {
            totalEstudiantes: students.length,
            totalNotas: grades.length,
            totalAsistencias: attendance.length,
            totalMatriculas: enrollments.length
        },
        estudiantes: students,
        notas: grades,
        asistencias: attendance,
        matriculas: enrollments
    };

    // Exportar como Excel
    const ws = XLSX.utils.json_to_sheet([reportData.resumen]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    
    if (students.length > 0) {
        const wsStudents = XLSX.utils.json_to_sheet(students);
        XLSX.utils.book_append_sheet(wb, wsStudents, "Estudiantes");
    }
    
    if (grades.length > 0) {
        const wsGrades = XLSX.utils.json_to_sheet(grades);
        XLSX.utils.book_append_sheet(wb, wsGrades, "Notas");
    }

    XLSX.writeFile(wb, `reporte_general_${new Date().toISOString().split('T')[0]}.xlsx`);

    // Registrar actividad
    Storage.addActivity({
        title: 'Reporte General Exportado',
        description: 'Se exportó el reporte general del sistema',
        icon: '📊'
    });

    alert('Reporte exportado correctamente');
}

// Función auxiliar para obtener el nombre del grado
function getGradeName(gradeNumber) {
    const grades = {
        '1': 'Primer Grado',
        '2': 'Segundo Grado',
        '3': 'Tercer Grado',
        '4': 'Cuarto Grado',
        '5': 'Quinto Grado',
        '6': 'Sexto Grado'
    };
    return grades[gradeNumber] || `Grado ${gradeNumber}`;
}

// Función auxiliar para obtener el nombre de la materia
function getSubjectName(subjectCode) {
    const subjects = {
        'matematicas': 'Matemáticas',
        'espanol': 'Español',
        'ciencias': 'Ciencias Naturales',
        'sociales': 'Ciencias Sociales',
        'ingles': 'Inglés',
        'educacion-fisica': 'Educación Física',
        'arte': 'Arte',
        'religion': 'Religión'
    };
    return subjects[subjectCode] || subjectCode;
}

// Función auxiliar para obtener clase CSS de nota
function getGradeClass(grade) {
    const value = parseFloat(grade);
    if (value >= 9) return 'nota-excelente';
    if (value >= 7) return 'nota-buena';
    if (value >= 5) return 'nota-regular';
    return 'nota-mala';
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}
