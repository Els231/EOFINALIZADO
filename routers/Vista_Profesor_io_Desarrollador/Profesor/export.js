// ===== SISTEMA DE EXPORTACIÓN E IMPRESIÓN =====

// Exportar todos los datos del sistema
function exportAllData() {
    const students = Storage.getStudents();
    const grades = Storage.getGrades();
    const attendance = Storage.getAttendance();
    const enrollments = Storage.getEnrollments();
    const events = Storage.getEvents();
    const activities = Storage.getActivities();

    if (students.length === 0 && grades.length === 0 && attendance.length === 0 && enrollments.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear libro de Excel con múltiples hojas
    const wb = XLSX.utils.book_new();

    // Hoja de resumen
    const summary = {
        'Fecha de Exportación': new Date().toLocaleString('es-ES'),
        'Total de Estudiantes': students.length,
        'Total de Notas': grades.length,
        'Total de Asistencias': attendance.length,
        'Total de Matrículas': enrollments.length,
        'Total de Eventos': events.length,
        'Total de Actividades': activities.length
    };
    const wsSummary = XLSX.utils.json_to_sheet([summary]);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

    // Exportar estudiantes
    if (students.length > 0) {
        const studentsData = students.map(student => ({
            'ID': student.id,
            'Nombre': student.name,
            'Email': student.email || '',
            'Teléfono': student.phone || '',
            'Grado': getGradeName(student.grade),
            'Fecha de Nacimiento': student.birthDate || '',
            'Dirección': student.address || '',
            'Estado': student.status === 'activo' ? 'Activo' : 'Inactivo',
            'Fecha de Registro': student.createdAt ? formatDate(student.createdAt) : ''
        }));
        const wsStudents = XLSX.utils.json_to_sheet(studentsData);
        XLSX.utils.book_append_sheet(wb, wsStudents, "Estudiantes");
    }

    // Exportar notas
    if (grades.length > 0) {
        const gradesData = grades.map(grade => {
            const student = students.find(s => s.id === grade.studentId);
            return {
                'ID': grade.id,
                'Estudiante': student ? student.name : 'No encontrado',
                'Materia': getSubjectName(grade.subject),
                'Período': `Período ${grade.period}`,
                'Nota': grade.value,
                'Fecha': formatDate(grade.date),
                'Observaciones': grade.observations || '',
                'Fecha de Registro': grade.createdAt ? formatDate(grade.createdAt) : ''
            };
        });
        const wsGrades = XLSX.utils.json_to_sheet(gradesData);
        XLSX.utils.book_append_sheet(wb, wsGrades, "Notas");
    }

    // Exportar asistencia
    if (attendance.length > 0) {
        const attendanceData = attendance.map(record => {
            const student = students.find(s => s.id === record.studentId);
            return {
                'ID': record.id,
                'Estudiante': student ? student.name : 'No encontrado',
                'Fecha': formatDate(record.date),
                'Estado': getAttendanceStatusText(record.status),
                'Observaciones': record.observations || '',
                'Hora de Registro': record.timestamp ? new Date(record.timestamp).toLocaleString('es-ES') : ''
            };
        });
        const wsAttendance = XLSX.utils.json_to_sheet(attendanceData);
        XLSX.utils.book_append_sheet(wb, wsAttendance, "Asistencia");
    }

    // Exportar matrículas
    if (enrollments.length > 0) {
        const enrollmentsData = enrollments.map(enrollment => {
            const student = students.find(s => s.id === enrollment.studentId);
            return {
                'ID': enrollment.id,
                'Código': enrollment.code,
                'Estudiante': student ? student.name : 'No encontrado',
                'Grado': getGradeName(enrollment.grade),
                'Año Escolar': enrollment.schoolYear,
                'Fecha de Matrícula': formatDate(enrollment.enrollmentDate),
                'Estado': getEnrollmentStatusText(enrollment.status),
                'Observaciones': enrollment.notes || '',
                'Fecha de Registro': enrollment.createdAt ? formatDate(enrollment.createdAt) : ''
            };
        });
        const wsEnrollments = XLSX.utils.json_to_sheet(enrollmentsData);
        XLSX.utils.book_append_sheet(wb, wsEnrollments, "Matrículas");
    }

    // Exportar eventos
    if (events.length > 0) {
        const eventsData = events.map(event => ({
            'ID': event.id,
            'Título': event.title,
            'Descripción': event.description || '',
            'Tipo': getEventTypeText(event.type),
            'Fecha de Inicio': formatDateTime(event.start),
            'Fecha de Fin': event.end ? formatDateTime(event.end) : '',
            'Color': event.color,
            'Fecha de Creación': event.createdAt ? formatDateTime(event.createdAt) : ''
        }));
        const wsEvents = XLSX.utils.json_to_sheet(eventsData);
        XLSX.utils.book_append_sheet(wb, wsEvents, "Eventos");
    }

    // Descargar archivo
    const filename = `backup_completo_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);

    Storage.addActivity({
        title: 'Backup Completo Exportado',
        description: 'Se exportó un backup completo de todos los datos del sistema',
        icon: '💾'
    });

    alert('Backup completo exportado correctamente');
}

// Importar datos desde archivo Excel
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!confirm('¿Está seguro de que desea importar datos? Esto puede sobrescribir información existente.')) {
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                processImportedData(workbook);
            } catch (error) {
                console.error('Error al importar archivo:', error);
                alert('Error al procesar el archivo. Verifique el formato.');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    
    input.click();
}

// Procesar datos importados
function processImportedData(workbook) {
    let importResults = {
        students: 0,
        grades: 0,
        attendance: 0,
        enrollments: 0,
        events: 0,
        errors: []
    };

    // Importar estudiantes
    if (workbook.SheetNames.includes('Estudiantes')) {
        try {
            const studentsSheet = workbook.Sheets['Estudiantes'];
            const studentsData = XLSX.utils.sheet_to_json(studentsSheet);
            importResults.students = importStudentsData(studentsData, importResults.errors);
        } catch (error) {
            importResults.errors.push('Error al importar estudiantes: ' + error.message);
        }
    }

    // Importar notas
    if (workbook.SheetNames.includes('Notas')) {
        try {
            const gradesSheet = workbook.Sheets['Notas'];
            const gradesData = XLSX.utils.sheet_to_json(gradesSheet);
            importResults.grades = importGradesData(gradesData, importResults.errors);
        } catch (error) {
            importResults.errors.push('Error al importar notas: ' + error.message);
        }
    }

    // Importar asistencia
    if (workbook.SheetNames.includes('Asistencia')) {
        try {
            const attendanceSheet = workbook.Sheets['Asistencia'];
            const attendanceData = XLSX.utils.sheet_to_json(attendanceSheet);
            importResults.attendance = importAttendanceData(attendanceData, importResults.errors);
        } catch (error) {
            importResults.errors.push('Error al importar asistencia: ' + error.message);
        }
    }

    // Importar matrículas
    if (workbook.SheetNames.includes('Matrículas')) {
        try {
            const enrollmentsSheet = workbook.Sheets['Matrículas'];
            const enrollmentsData = XLSX.utils.sheet_to_json(enrollmentsSheet);
            importResults.enrollments = importEnrollmentsData(enrollmentsData, importResults.errors);
        } catch (error) {
            importResults.errors.push('Error al importar matrículas: ' + error.message);
        }
    }

    // Importar eventos
    if (workbook.SheetNames.includes('Eventos')) {
        try {
            const eventsSheet = workbook.Sheets['Eventos'];
            const eventsData = XLSX.utils.sheet_to_json(eventsSheet);
            importResults.events = importEventsData(eventsData, importResults.errors);
        } catch (error) {
            importResults.errors.push('Error al importar eventos: ' + error.message);
        }
    }

    // Mostrar resultados
    showImportResults(importResults);
    
    // Actualizar interfaz
    if (importResults.students > 0 || importResults.grades > 0 || importResults.attendance > 0 || 
        importResults.enrollments > 0 || importResults.events > 0) {
        
        updateDashboardStats();
        
        // Recargar sección actual
        showSection(currentSection);
        
        Storage.addActivity({
            title: 'Datos Importados',
            description: `Se importaron datos desde archivo Excel: ${importResults.students} estudiantes, ${importResults.grades} notas, ${importResults.attendance} asistencias, ${importResults.enrollments} matrículas, ${importResults.events} eventos`,
            icon: '📥'
        });
    }
}

// Importar datos de estudiantes
function importStudentsData(data, errors) {
    const students = Storage.getStudents();
    let importedCount = 0;

    data.forEach((row, index) => {
        try {
            if (!row.Nombre) {
                errors.push(`Estudiantes fila ${index + 1}: Nombre requerido`);
                return;
            }

            // Buscar si el estudiante ya existe
            const existingStudent = students.find(s => 
                s.name.toLowerCase() === row.Nombre.toLowerCase()
            );

            const studentData = {
                name: row.Nombre.trim(),
                email: row.Email || '',
                phone: row.Teléfono || '',
                grade: findGradeNumber(row.Grado),
                birthDate: row['Fecha de Nacimiento'] || '',
                address: row.Dirección || '',
                status: row.Estado === 'Activo' ? 'activo' : 'inactivo'
            };

            if (existingStudent) {
                // Actualizar estudiante existente
                Object.assign(existingStudent, studentData);
            } else {
                // Crear nuevo estudiante
                students.push({
                    id: Storage.generateId(),
                    ...studentData,
                    createdAt: new Date().toISOString()
                });
            }

            importedCount++;
        } catch (error) {
            errors.push(`Estudiantes fila ${index + 1}: Error al procesar datos`);
        }
    });

    Storage.setStudents(students);
    return importedCount;
}

// Importar datos de notas
function importGradesData(data, errors) {
    const grades = Storage.getGrades();
    const students = Storage.getStudents();
    let importedCount = 0;

    data.forEach((row, index) => {
        try {
            const student = students.find(s => s.name === row.Estudiante);
            if (!student) {
                errors.push(`Notas fila ${index + 1}: Estudiante no encontrado (${row.Estudiante})`);
                return;
            }

            if (!row.Nota || isNaN(parseFloat(row.Nota))) {
                errors.push(`Notas fila ${index + 1}: Nota inválida`);
                return;
            }

            const gradeData = {
                id: Storage.generateId(),
                studentId: student.id,
                subject: findSubjectCode(row.Materia),
                period: row.Período.replace('Período ', ''),
                value: parseFloat(row.Nota),
                date: row.Fecha || new Date().toISOString().split('T')[0],
                observations: row.Observaciones || '',
                createdAt: new Date().toISOString()
            };

            grades.push(gradeData);
            importedCount++;
        } catch (error) {
            errors.push(`Notas fila ${index + 1}: Error al procesar datos`);
        }
    });

    Storage.setGrades(grades);
    return importedCount;
}

// Importar datos de asistencia
function importAttendanceData(data, errors) {
    const attendance = Storage.getAttendance();
    const students = Storage.getStudents();
    let importedCount = 0;

    data.forEach((row, index) => {
        try {
            const student = students.find(s => s.name === row.Estudiante);
            if (!student) {
                errors.push(`Asistencia fila ${index + 1}: Estudiante no encontrado (${row.Estudiante})`);
                return;
            }

            const statusMap = {
                'Presente': 'presente',
                'Ausente': 'ausente',
                'Tarde': 'tarde',
                'Justificado': 'justificado'
            };

            const status = statusMap[row.Estado];
            if (!status) {
                errors.push(`Asistencia fila ${index + 1}: Estado inválido (${row.Estado})`);
                return;
            }

            const attendanceData = {
                id: Storage.generateId(),
                studentId: student.id,
                date: row.Fecha || new Date().toISOString().split('T')[0],
                status: status,
                observations: row.Observaciones || '',
                timestamp: new Date().toISOString()
            };

            attendance.push(attendanceData);
            importedCount++;
        } catch (error) {
            errors.push(`Asistencia fila ${index + 1}: Error al procesar datos`);
        }
    });

    Storage.setAttendance(attendance);
    return importedCount;
}

// Importar datos de matrículas
function importEnrollmentsData(data, errors) {
    const enrollments = Storage.getEnrollments();
    const students = Storage.getStudents();
    let importedCount = 0;

    data.forEach((row, index) => {
        try {
            const student = students.find(s => s.name === row.Estudiante);
            if (!student) {
                errors.push(`Matrículas fila ${index + 1}: Estudiante no encontrado (${row.Estudiante})`);
                return;
            }

            const statusMap = {
                'Activa': 'activa',
                'Inactiva': 'inactiva',
                'Pendiente': 'pendiente'
            };

            const status = statusMap[row.Estado] || 'activa';

            const enrollmentData = {
                id: Storage.generateId(),
                code: row.Código || generateEnrollmentCode(row['Año Escolar'], findGradeNumber(row.Grado)),
                studentId: student.id,
                grade: findGradeNumber(row.Grado),
                schoolYear: parseInt(row['Año Escolar']),
                enrollmentDate: row['Fecha de Matrícula'] || new Date().toISOString().split('T')[0],
                status: status,
                notes: row.Observaciones || '',
                createdAt: new Date().toISOString()
            };

            enrollments.push(enrollmentData);
            importedCount++;
        } catch (error) {
            errors.push(`Matrículas fila ${index + 1}: Error al procesar datos`);
        }
    });

    Storage.setEnrollments(enrollments);
    return importedCount;
}

// Importar datos de eventos
function importEventsData(data, errors) {
    const events = Storage.getEvents();
    let importedCount = 0;

    data.forEach((row, index) => {
        try {
            if (!row.Título) {
                errors.push(`Eventos fila ${index + 1}: Título requerido`);
                return;
            }

            const typeMap = {
                'Clase': 'clase',
                'Examen': 'examen',
                'Reunión': 'reunion',
                'Evento Especial': 'evento',
                'Feriado': 'feriado'
            };

            const eventData = {
                id: Storage.generateId(),
                title: row.Título.trim(),
                description: row.Descripción || '',
                start: row['Fecha de Inicio'],
                end: row['Fecha de Fin'] || '',
                type: typeMap[row.Tipo] || 'evento',
                color: row.Color || '#3498db',
                createdAt: new Date().toISOString()
            };

            events.push(eventData);
            importedCount++;
        } catch (error) {
            errors.push(`Eventos fila ${index + 1}: Error al procesar datos`);
        }
    });

    Storage.setEvents(events);
    return importedCount;
}

// Mostrar resultados de importación
function showImportResults(results) {
    let message = 'Importación completada:\n\n';
    message += `✅ Estudiantes: ${results.students}\n`;
    message += `✅ Notas: ${results.grades}\n`;
    message += `✅ Asistencias: ${results.attendance}\n`;
    message += `✅ Matrículas: ${results.enrollments}\n`;
    message += `✅ Eventos: ${results.events}\n`;

    if (results.errors.length > 0) {
        message += `\n⚠️ Errores encontrados:\n`;
        message += results.errors.slice(0, 10).join('\n');
        if (results.errors.length > 10) {
            message += `\n... y ${results.errors.length - 10} errores más.`;
        }
    }

    alert(message);
}

// Encontrar número de grado a partir del nombre
function findGradeNumber(gradeName) {
    if (!gradeName) return '1';
    
    const gradeMap = {
        'primer grado': '1',
        'segundo grado': '2',
        'tercer grado': '3',
        'cuarto grado': '4',
        'quinto grado': '5',
        'sexto grado': '6'
    };

    const lowerName = gradeName.toLowerCase();
    return gradeMap[lowerName] || '1';
}

// Generar reporte PDF personalizado
function generateCustomPDFReport(type, data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de fuente
    doc.setFont('helvetica');
    
    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(52, 152, 219);
    doc.text('ESCUELA JESÚS EL BUEN MAESTRO', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`REPORTE DE ${type.toUpperCase()}`, 105, 35, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Información del reporte
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 55);
    doc.text(`Total de registros: ${data.length}`, 20, 65);

    let yPosition = 80;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Contenido específico según el tipo
    switch (type) {
        case 'estudiantes':
            generateStudentsPDFContent(doc, data, yPosition, pageHeight, margin);
            break;
        case 'notas':
            generateGradesPDFContent(doc, data, yPosition, pageHeight, margin);
            break;
        case 'asistencia':
            generateAttendancePDFContent(doc, data, yPosition, pageHeight, margin);
            break;
        default:
            doc.text('Tipo de reporte no soportado', 20, yPosition);
    }

    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPages}`, 190, pageHeight - 10, { align: 'right' });
        doc.text('Portal del Profesor - Sistema de Gestión Escolar', 20, pageHeight - 10);
    }

    // Guardar archivo
    doc.save(`reporte_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Generar contenido PDF para estudiantes
function generateStudentsPDFContent(doc, students, yPosition, pageHeight, margin) {
    doc.setFontSize(12);
    
    students.forEach((student, index) => {
        if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${student.name}`, margin, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition += 10;
        
        doc.text(`Grado: ${getGradeName(student.grade)}`, margin + 10, yPosition);
        yPosition += 8;
        
        if (student.email) {
            doc.text(`Email: ${student.email}`, margin + 10, yPosition);
            yPosition += 8;
        }
        
        if (student.phone) {
            doc.text(`Teléfono: ${student.phone}`, margin + 10, yPosition);
            yPosition += 8;
        }
        
        doc.text(`Estado: ${student.status === 'activo' ? 'Activo' : 'Inactivo'}`, margin + 10, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
    });
}

// Generar contenido PDF para notas
function generateGradesPDFContent(doc, grades, yPosition, pageHeight, margin) {
    const students = Storage.getStudents();
    doc.setFontSize(10);
    
    // Agrupar notas por estudiante
    const gradesByStudent = {};
    grades.forEach(grade => {
        if (!gradesByStudent[grade.studentId]) {
            gradesByStudent[grade.studentId] = [];
        }
        gradesByStudent[grade.studentId].push(grade);
    });

    Object.keys(gradesByStudent).forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        const studentGrades = gradesByStudent[studentId];

        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`${student ? student.name : 'Estudiante no encontrado'}`, margin, yPosition);
        yPosition += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        studentGrades.forEach(grade => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 30;
            }
            
            doc.text(`${getSubjectName(grade.subject)} - Período ${grade.period}: ${grade.value}`, margin + 10, yPosition);
            yPosition += 7;
        });
        
        yPosition += 10;
    });
}

// Generar contenido PDF para asistencia
function generateAttendancePDFContent(doc, attendance, yPosition, pageHeight, margin) {
    const students = Storage.getStudents();
    doc.setFontSize(10);
    
    // Agrupar asistencia por fecha
    const attendanceByDate = {};
    attendance.forEach(record => {
        if (!attendanceByDate[record.date]) {
            attendanceByDate[record.date] = [];
        }
        attendanceByDate[record.date].push(record);
    });

    Object.keys(attendanceByDate).sort().forEach(date => {
        const dateAttendance = attendanceByDate[date];

        if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Fecha: ${formatDate(date)}`, margin, yPosition);
        yPosition += 15;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        dateAttendance.forEach(record => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 30;
            }
            
            const student = students.find(s => s.id === record.studentId);
            const statusText = getAttendanceStatusText(record.status);
            doc.text(`${student ? student.name : 'Estudiante no encontrado'}: ${statusText}`, margin + 10, yPosition);
            yPosition += 7;
        });
        
        yPosition += 10;
    });
}

// Imprimir lista de estudiantes
function printStudentsList() {
    const students = Storage.getStudents();
    
    if (students.length === 0) {
        alert('No hay estudiantes para imprimir');
        return;
    }

    const printWindow = window.open('', '_blank');
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lista de Estudiantes</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #3498db; text-align: center; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .active { color: green; font-weight: bold; }
                .inactive { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Lista de Estudiantes - Escuela Jesús El Buen Maestro</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Total de estudiantes:</strong> ${students.length}</p>
            
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map((student, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${student.name}</td>
                            <td>${getGradeName(student.grade)}</td>
                            <td>${student.email || '-'}</td>
                            <td>${student.phone || '-'}</td>
                            <td class="${student.status}">${student.status === 'activo' ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    Storage.addActivity({
        title: 'Lista de Estudiantes Impresa',
        description: `Se imprimió la lista de ${students.length} estudiantes`,
        icon: '🖨️'
    });
}

// Configurar funciones de exportación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Agregar botones de exportación adicionales si no existen
    const exportButtons = document.querySelectorAll('[onclick*="export"]');
    
    // Configurar eventos de teclado para accesos rápidos
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch(e.key) {
                case 'e':
                    e.preventDefault();
                    exportAllData();
                    break;
                case 'i':
                    e.preventDefault();
                    importData();
                    break;
                case 'p':
                    e.preventDefault();
                    printStudentsList();
                    break;
            }
        }
    });
});
