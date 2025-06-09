// ===== GESTIÓN DE ESTADÍSTICAS =====

let gradesBySubjectChart;
let attendanceChart;

// Cargar estadísticas
function loadStatistics() {
    generateGradesBySubjectChart();
    generateAttendanceChart();
    generateStatisticsSummary();
}

// Generar gráfico de rendimiento por materia
function generateGradesBySubjectChart() {
    const ctx = document.getElementById('gradesBySubjectChart');
    if (!ctx) return;

    const grades = Storage.getGrades();
    const students = Storage.getStudents();

    if (grades.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Arial';
        context.fillStyle = '#666';
        context.textAlign = 'center';
        context.fillText('No hay datos de notas disponibles', ctx.width / 2, ctx.height / 2);
        return;
    }

    // Agrupar notas por materia
    const gradesBySubject = {};
    grades.forEach(grade => {
        if (!gradesBySubject[grade.subject]) {
            gradesBySubject[grade.subject] = [];
        }
        gradesBySubject[grade.subject].push(parseFloat(grade.value));
    });

    // Calcular promedios por materia
    const subjects = Object.keys(gradesBySubject);
    const averages = subjects.map(subject => {
        const subjectGrades = gradesBySubject[subject];
        return (subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length).toFixed(2);
    });

    // Destruir gráfico anterior si existe
    if (gradesBySubjectChart) {
        gradesBySubjectChart.destroy();
    }

    // Crear nuevo gráfico
    gradesBySubjectChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(subject => getSubjectName(subject)),
            datasets: [{
                label: 'Promedio de Notas',
                data: averages,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6',
                    '#1abc9c',
                    '#34495e',
                    '#e67e22'
                ],
                borderColor: [
                    '#2980b9',
                    '#27ae60',
                    '#e67e22',
                    '#c0392b',
                    '#8e44ad',
                    '#16a085',
                    '#2c3e50',
                    '#d35400'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Promedio de Calificaciones por Materia'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Promedio de Notas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Materias'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Generar gráfico de asistencia mensual
function generateAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;

    const attendance = Storage.getAttendance();

    if (attendance.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Arial';
        context.fillStyle = '#666';
        context.textAlign = 'center';
        context.fillText('No hay datos de asistencia disponibles', ctx.width / 2, ctx.height / 2);
        return;
    }

    // Agrupar asistencia por mes
    const attendanceByMonth = {};
    attendance.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!attendanceByMonth[monthKey]) {
            attendanceByMonth[monthKey] = {
                presente: 0,
                ausente: 0,
                tarde: 0,
                justificado: 0
            };
        }
        
        attendanceByMonth[monthKey][record.status]++;
    });

    // Preparar datos para el gráfico
    const months = Object.keys(attendanceByMonth).sort();
    const presentData = months.map(month => attendanceByMonth[month].presente);
    const absentData = months.map(month => attendanceByMonth[month].ausente);
    const lateData = months.map(month => attendanceByMonth[month].tarde);
    const justifiedData = months.map(month => attendanceByMonth[month].justificado);

    // Convertir claves de mes a nombres legibles
    const monthLabels = months.map(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    });

    // Destruir gráfico anterior si existe
    if (attendanceChart) {
        attendanceChart.destroy();
    }

    // Crear nuevo gráfico
    attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Presentes',
                    data: presentData,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Ausentes',
                    data: absentData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Tardes',
                    data: lateData,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Justificados',
                    data: justifiedData,
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tendencia de Asistencia Mensual'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Estudiantes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Generar resumen estadístico
function generateStatisticsSummary() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();

    const summaryContainer = document.getElementById('statisticsSummary');
    
    if (!summaryContainer) return;

    // Calcular estadísticas generales
    const stats = calculateGeneralStatistics(students, grades, attendance, enrollments);
    
    const html = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header">
                        <h6><i class="fas fa-chart-bar me-2"></i>Estadísticas Generales</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-primary">${stats.totalStudents}</h4>
                                    <small>Estudiantes Totales</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-success">${stats.activeStudents}</h4>
                                    <small>Estudiantes Activos</small>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-info">${stats.totalGrades}</h4>
                                    <small>Notas Registradas</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-warning">${stats.averageGrade}</h4>
                                    <small>Promedio General</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header">
                        <h6><i class="fas fa-calendar-check me-2"></i>Estadísticas de Asistencia</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-success">${stats.attendanceRate}%</h4>
                                    <small>Tasa de Asistencia</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-danger">${stats.absenteeismRate}%</h4>
                                    <small>Tasa de Ausentismo</small>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="text-center">
                            <h5>${stats.totalAttendanceRecords}</h5>
                            <small>Total de Registros</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-graduation-cap me-2"></i>Rendimiento por Grado</h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Grado</th>
                                        <th>Estudiantes</th>
                                        <th>Promedio</th>
                                        <th>Asistencia</th>
                                        <th>Matrículas Activas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${stats.gradeStats.map(stat => `
                                        <tr>
                                            <td>${getGradeName(stat.grade)}</td>
                                            <td>${stat.studentCount}</td>
                                            <td><span class="${getGradeClass(stat.averageGrade)}">${stat.averageGrade}</span></td>
                                            <td>${stat.attendanceRate}%</td>
                                            <td>${stat.activeEnrollments}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-trophy me-2"></i>Mejores Estudiantes</h6>
                    </div>
                    <div class="card-body">
                        ${stats.topStudents.length > 0 ? `
                            <div class="list-group">
                                ${stats.topStudents.map((student, index) => `
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>${student.name}</strong>
                                            <br>
                                            <small class="text-muted">${getGradeName(student.grade)}</small>
                                        </div>
                                        <div class="text-end">
                                            <span class="badge bg-success fs-6">${student.average}</span>
                                            <br>
                                            <small class="text-muted">${student.gradeCount} notas</small>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-muted text-center">No hay datos suficientes</p>'}
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-chart-line me-2"></i>Tendencias</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Estudiantes Nuevos (Este Mes)</span>
                                <strong class="text-success">${stats.newStudentsThisMonth}</strong>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Notas Registradas (Esta Semana)</span>
                                <strong class="text-info">${stats.gradesThisWeek}</strong>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Materias Activas</span>
                                <strong class="text-primary">${stats.activeSubjects}</strong>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Promedio Últimas 30 Notas</span>
                                <strong class="${getGradeClass(stats.recentAverageGrade)}">${stats.recentAverageGrade}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    summaryContainer.innerHTML = html;
}

// Calcular estadísticas generales
function calculateGeneralStatistics(students, grades, attendance, enrollments) {
    const activeStudents = students.filter(s => s.status === 'activo').length;
    
    // Estadísticas de notas
    const totalGrades = grades.length;
    const averageGrade = totalGrades > 0 ? 
        (grades.reduce((sum, g) => sum + parseFloat(g.value), 0) / totalGrades).toFixed(1) : '0.0';

    // Estadísticas de asistencia
    const totalAttendanceRecords = attendance.length;
    const presentRecords = attendance.filter(a => a.status === 'presente' || a.status === 'tarde' || a.status === 'justificado').length;
    const attendanceRate = totalAttendanceRecords > 0 ? 
        ((presentRecords / totalAttendanceRecords) * 100).toFixed(1) : '0.0';
    const absenteeismRate = totalAttendanceRecords > 0 ? 
        (100 - parseFloat(attendanceRate)).toFixed(1) : '0.0';

    // Estadísticas por grado
    const gradeStats = calculateGradeStatistics(students, grades, attendance, enrollments);

    // Mejores estudiantes
    const topStudents = calculateTopStudents(students, grades, 5);

    // Tendencias
    const trends = calculateTrends(students, grades);

    // Materias activas
    const activeSubjects = [...new Set(grades.map(g => g.subject))].length;

    // Promedio de últimas 30 notas
    const recentGrades = grades.slice(-30);
    const recentAverageGrade = recentGrades.length > 0 ? 
        (recentGrades.reduce((sum, g) => sum + parseFloat(g.value), 0) / recentGrades.length).toFixed(1) : '0.0';

    return {
        totalStudents: students.length,
        activeStudents,
        totalGrades,
        averageGrade,
        totalAttendanceRecords,
        attendanceRate,
        absenteeismRate,
        gradeStats,
        topStudents,
        activeSubjects,
        recentAverageGrade,
        ...trends
    };
}

// Calcular estadísticas por grado
function calculateGradeStatistics(students, grades, attendance, enrollments) {
    const gradeGroups = {};
    
    students.forEach(student => {
        if (!gradeGroups[student.grade]) {
            gradeGroups[student.grade] = {
                grade: student.grade,
                students: [],
                grades: [],
                attendance: [],
                enrollments: []
            };
        }
        
        gradeGroups[student.grade].students.push(student);
        gradeGroups[student.grade].grades.push(...grades.filter(g => g.studentId === student.id));
        gradeGroups[student.grade].attendance.push(...attendance.filter(a => a.studentId === student.id));
        gradeGroups[student.grade].enrollments.push(...enrollments.filter(e => e.studentId === student.id));
    });

    return Object.values(gradeGroups).map(group => {
        const averageGrade = group.grades.length > 0 ? 
            (group.grades.reduce((sum, g) => sum + parseFloat(g.value), 0) / group.grades.length).toFixed(1) : '0.0';
        
        const presentRecords = group.attendance.filter(a => 
            a.status === 'presente' || a.status === 'tarde' || a.status === 'justificado'
        ).length;
        const attendanceRate = group.attendance.length > 0 ? 
            ((presentRecords / group.attendance.length) * 100).toFixed(1) : '0.0';
        
        const activeEnrollments = group.enrollments.filter(e => e.status === 'activa').length;

        return {
            grade: group.grade,
            studentCount: group.students.length,
            averageGrade,
            attendanceRate,
            activeEnrollments
        };
    }).sort((a, b) => parseInt(a.grade) - parseInt(b.grade));
}

// Calcular mejores estudiantes
function calculateTopStudents(students, grades, limit = 5) {
    const studentAverages = students
        .map(student => {
            const studentGrades = grades.filter(g => g.studentId === student.id);
            if (studentGrades.length === 0) return null;
            
            const average = (studentGrades.reduce((sum, g) => sum + parseFloat(g.value), 0) / studentGrades.length).toFixed(1);
            
            return {
                id: student.id,
                name: student.name,
                grade: student.grade,
                average: parseFloat(average),
                gradeCount: studentGrades.length
            };
        })
        .filter(student => student !== null)
        .sort((a, b) => b.average - a.average)
        .slice(0, limit);

    return studentAverages.map(student => ({
        ...student,
        average: student.average.toFixed(1)
    }));
}

// Calcular tendencias
function calculateTrends(students, grades) {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Estudiantes nuevos este mes
    const newStudentsThisMonth = students.filter(student => {
        if (!student.createdAt) return false;
        return new Date(student.createdAt) > oneMonthAgo;
    }).length;

    // Notas registradas esta semana
    const gradesThisWeek = grades.filter(grade => {
        if (!grade.createdAt) return false;
        return new Date(grade.createdAt) > oneWeekAgo;
    }).length;

    return {
        newStudentsThisMonth,
        gradesThisWeek
    };
}

// Exportar estadísticas
function exportStatistics() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();

    const stats = calculateGeneralStatistics(students, grades, attendance, enrollments);

    // Preparar datos para exportación
    const generalStats = {
        'Fecha del Reporte': new Date().toLocaleDateString('es-ES'),
        'Total de Estudiantes': stats.totalStudents,
        'Estudiantes Activos': stats.activeStudents,
        'Total de Notas': stats.totalGrades,
        'Promedio General': stats.averageGrade,
        'Tasa de Asistencia': `${stats.attendanceRate}%`,
        'Tasa de Ausentismo': `${stats.absenteeismRate}%`,
        'Materias Activas': stats.activeSubjects,
        'Estudiantes Nuevos (Este Mes)': stats.newStudentsThisMonth,
        'Notas Esta Semana': stats.gradesThisWeek
    };

    // Crear archivo Excel con múltiples hojas
    const wb = XLSX.utils.book_new();

    // Hoja de estadísticas generales
    const wsGeneral = XLSX.utils.json_to_sheet([generalStats]);
    XLSX.utils.book_append_sheet(wb, wsGeneral, "Estadísticas Generales");

    // Hoja de estadísticas por grado
    if (stats.gradeStats.length > 0) {
        const gradeStatsFormatted = stats.gradeStats.map(stat => ({
            'Grado': getGradeName(stat.grade),
            'Estudiantes': stat.studentCount,
            'Promedio': stat.averageGrade,
            'Asistencia': `${stat.attendanceRate}%`,
            'Matrículas Activas': stat.activeEnrollments
        }));
        const wsGrades = XLSX.utils.json_to_sheet(gradeStatsFormatted);
        XLSX.utils.book_append_sheet(wb, wsGrades, "Por Grado");
    }

    // Hoja de mejores estudiantes
    if (stats.topStudents.length > 0) {
        const topStudentsFormatted = stats.topStudents.map((student, index) => ({
            'Posición': index + 1,
            'Nombre': student.name,
            'Grado': getGradeName(student.grade),
            'Promedio': student.average,
            'Total de Notas': student.gradeCount
        }));
        const wsTop = XLSX.utils.json_to_sheet(topStudentsFormatted);
        XLSX.utils.book_append_sheet(wb, wsTop, "Mejores Estudiantes");
    }

    // Descargar archivo
    XLSX.writeFile(wb, `estadisticas_${new Date().toISOString().split('T')[0]}.xlsx`);

    Storage.addActivity({
        title: 'Estadísticas Exportadas',
        description: 'Se exportó el reporte completo de estadísticas',
        icon: '📊'
    });

    alert('Estadísticas exportadas correctamente');
}

// Imprimir estadísticas
function printStatistics() {
    const printWindow = window.open('', '_blank');
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();

    const stats = calculateGeneralStatistics(students, grades, attendance, enrollments);

    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Estadísticas</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2 { color: #3498db; }
                table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .stat-card { 
                    display: inline-block; 
                    margin: 10px; 
                    padding: 15px; 
                    border: 1px solid #ddd; 
                    border-radius: 5px; 
                    width: 200px; 
                    text-align: center; 
                }
                .stat-number { font-size: 24px; font-weight: bold; color: #3498db; }
            </style>
        </head>
        <body>
            <h1>Reporte de Estadísticas - Escuela Jesús El Buen Maestro</h1>
            <p><strong>Fecha del Reporte:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            
            <h2>Estadísticas Generales</h2>
            <div class="stat-card">
                <div class="stat-number">${stats.totalStudents}</div>
                <div>Estudiantes Totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.activeStudents}</div>
                <div>Estudiantes Activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalGrades}</div>
                <div>Notas Registradas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.averageGrade}</div>
                <div>Promedio General</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.attendanceRate}%</div>
                <div>Tasa de Asistencia</div>
            </div>
            
            <h2>Estadísticas por Grado</h2>
            <table>
                <thead>
                    <tr>
                        <th>Grado</th>
                        <th>Estudiantes</th>
                        <th>Promedio</th>
                        <th>Asistencia</th>
                        <th>Matrículas Activas</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.gradeStats.map(stat => `
                        <tr>
                            <td>${getGradeName(stat.grade)}</td>
                            <td>${stat.studentCount}</td>
                            <td>${stat.averageGrade}</td>
                            <td>${stat.attendanceRate}%</td>
                            <td>${stat.activeEnrollments}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            ${stats.topStudents.length > 0 ? `
            <h2>Mejores Estudiantes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Promedio</th>
                        <th>Total de Notas</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.topStudents.map((student, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${student.name}</td>
                            <td>${getGradeName(student.grade)}</td>
                            <td>${student.average}</td>
                            <td>${student.gradeCount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    Storage.addActivity({
        title: 'Estadísticas Impresas',
        description: 'Se imprimió el reporte de estadísticas',
        icon: '🖨️'
    });
}

// Actualizar gráficos cuando cambian los datos
function refreshStatistics() {
    if (currentSection === 'estadisticas') {
        loadStatistics();
    }
}

// Configurar actualización automática de estadísticas
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar estadísticas cada vez que se guarden datos
    const originalSetStudents = Storage.setStudents;
    const originalSetGrades = Storage.setGrades;
    const originalSetAttendance = Storage.setAttendance;
    const originalSetEnrollments = Storage.setEnrollments;

    Storage.setStudents = function(data) {
        const result = originalSetStudents.call(this, data);
        setTimeout(refreshStatistics, 100);
        return result;
    };

    Storage.setGrades = function(data) {
        const result = originalSetGrades.call(this, data);
        setTimeout(refreshStatistics, 100);
        return result;
    };

    Storage.setAttendance = function(data) {
        const result = originalSetAttendance.call(this, data);
        setTimeout(refreshStatistics, 100);
        return result;
    };

    Storage.setEnrollments = function(data) {
        const result = originalSetEnrollments.call(this, data);
        setTimeout(refreshStatistics, 100);
        return result;
    };
});
