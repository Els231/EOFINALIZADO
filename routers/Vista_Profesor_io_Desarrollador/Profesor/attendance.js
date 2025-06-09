// ===== GESTIÓN DE ASISTENCIA =====

// Cargar datos de asistencia
function loadAttendanceData() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    populateAttendanceGradeFilter();
    loadAttendanceForDate();
}

// Poblar filtro de grados para asistencia
function populateAttendanceGradeFilter() {
    const students = Storage.getStudents();
    const gradeFilter = document.getElementById('attendanceGrade');
    
    // Limpiar filtro
    gradeFilter.innerHTML = '<option value="">Todos los grados</option>';
    
    // Obtener grados únicos
    const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();
    uniqueGrades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = getGradeName(grade);
        gradeFilter.appendChild(option);
    });
}

// Cargar asistencia para una fecha específica
function loadAttendanceForDate() {
    const selectedDate = document.getElementById('attendanceDate').value;
    const selectedGrade = document.getElementById('attendanceGrade').value;
    
    if (!selectedDate) {
        alert('Por favor selecciona una fecha');
        return;
    }

    const students = Storage.getStudents().filter(s => s.status === 'activo');
    const filteredStudents = selectedGrade ? 
        students.filter(s => s.grade === selectedGrade) : students;

    if (filteredStudents.length === 0) {
        document.getElementById('attendanceList').innerHTML = 
            '<p class="text-center text-muted">No hay estudiantes activos para mostrar</p>';
        return;
    }

    const attendance = Storage.getAttendance();
    
    const html = `
        <div class="row">
            ${filteredStudents.map(student => {
                const studentAttendance = attendance.find(a => 
                    a.studentId === student.id && a.date === selectedDate
                );
                const currentStatus = studentAttendance ? studentAttendance.status : 'presente';
                
                return `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="avatar me-3">${student.name.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <h6 class="mb-0">${student.name}</h6>
                                        <small class="text-muted">${getGradeName(student.grade)}</small>
                                    </div>
                                </div>
                                <div class="attendance-buttons" data-student-id="${student.id}">
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" class="btn-check" name="attendance_${student.id}" 
                                               id="presente_${student.id}" value="presente" 
                                               ${currentStatus === 'presente' ? 'checked' : ''}>
                                        <label class="btn btn-outline-success btn-sm" for="presente_${student.id}">
                                            <i class="fas fa-check"></i> Presente
                                        </label>
                                        
                                        <input type="radio" class="btn-check" name="attendance_${student.id}" 
                                               id="ausente_${student.id}" value="ausente"
                                               ${currentStatus === 'ausente' ? 'checked' : ''}>
                                        <label class="btn btn-outline-danger btn-sm" for="ausente_${student.id}">
                                            <i class="fas fa-times"></i> Ausente
                                        </label>
                                        
                                        <input type="radio" class="btn-check" name="attendance_${student.id}" 
                                               id="tarde_${student.id}" value="tarde"
                                               ${currentStatus === 'tarde' ? 'checked' : ''}>
                                        <label class="btn btn-outline-warning btn-sm" for="tarde_${student.id}">
                                            <i class="fas fa-clock"></i> Tarde
                                        </label>
                                        
                                        <input type="radio" class="btn-check" name="attendance_${student.id}" 
                                               id="justificado_${student.id}" value="justificado"
                                               ${currentStatus === 'justificado' ? 'checked' : ''}>
                                        <label class="btn btn-outline-info btn-sm" for="justificado_${student.id}">
                                            <i class="fas fa-file-alt"></i> Just.
                                        </label>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <input type="text" class="form-control form-control-sm" 
                                           placeholder="Observaciones..." 
                                           id="obs_${student.id}"
                                           value="${studentAttendance ? studentAttendance.observations || '' : ''}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    document.getElementById('attendanceList').innerHTML = html;
}

// Marcar todos como presentes
function markAllPresent() {
    const attendanceButtons = document.querySelectorAll('.attendance-buttons');
    
    attendanceButtons.forEach(buttonGroup => {
        const studentId = buttonGroup.dataset.studentId;
        const presenteRadio = document.getElementById(`presente_${studentId}`);
        if (presenteRadio) {
            presenteRadio.checked = true;
        }
    });

    alert('Todos los estudiantes han sido marcados como presentes');
}

// Guardar asistencia
function saveAttendance() {
    const selectedDate = document.getElementById('attendanceDate').value;
    
    if (!selectedDate) {
        alert('Por favor selecciona una fecha');
        return;
    }

    const attendanceButtons = document.querySelectorAll('.attendance-buttons');
    let attendance = Storage.getAttendance();
    let savedCount = 0;
    let updatedCount = 0;

    attendanceButtons.forEach(buttonGroup => {
        const studentId = buttonGroup.dataset.studentId;
        const selectedStatus = document.querySelector(`input[name="attendance_${studentId}"]:checked`);
        const observations = document.getElementById(`obs_${studentId}`).value.trim();
        
        if (selectedStatus) {
            const status = selectedStatus.value;
            
            // Buscar si ya existe un registro para este estudiante en esta fecha
            const existingIndex = attendance.findIndex(a => 
                a.studentId === studentId && a.date === selectedDate
            );

            const attendanceData = {
                studentId: studentId,
                date: selectedDate,
                status: status,
                observations: observations,
                timestamp: new Date().toISOString()
            };

            if (existingIndex !== -1) {
                // Actualizar registro existente
                attendance[existingIndex] = { ...attendance[existingIndex], ...attendanceData };
                updatedCount++;
            } else {
                // Crear nuevo registro
                attendance.push({
                    id: Storage.generateId(),
                    ...attendanceData
                });
                savedCount++;
            }
        }
    });

    // Guardar asistencia actualizada
    Storage.setAttendance(attendance);

    // Registrar actividad
    const totalProcessed = savedCount + updatedCount;
    if (totalProcessed > 0) {
        Storage.addActivity({
            title: 'Asistencia Guardada',
            description: `Se registró la asistencia de ${totalProcessed} estudiantes para ${formatDate(selectedDate)}`,
            icon: '✅'
        });
    }

    updateDashboardStats();
    
    alert(`Asistencia guardada correctamente (${savedCount} nuevos, ${updatedCount} actualizados)`);
}

// Exportar asistencia
function exportAttendance() {
    const selectedDate = document.getElementById('attendanceDate').value;
    const selectedGrade = document.getElementById('attendanceGrade').value;
    
    let attendance = Storage.getAttendance();
    const students = Storage.getStudents();

    // Filtrar por fecha si se seleccionó una
    if (selectedDate) {
        attendance = attendance.filter(a => a.date === selectedDate);
    }

    // Filtrar por grado si se seleccionó uno
    if (selectedGrade) {
        const studentsInGrade = students.filter(s => s.grade === selectedGrade).map(s => s.id);
        attendance = attendance.filter(a => studentsInGrade.includes(a.studentId));
    }

    if (attendance.length === 0) {
        alert('No hay datos de asistencia para exportar con los filtros seleccionados');
        return;
    }

    // Preparar datos para exportación
    const exportData = attendance.map(record => {
        const student = students.find(s => s.id === record.studentId);
        return {
            'Fecha': formatDate(record.date),
            'Estudiante': student ? student.name : 'No encontrado',
            'Grado': student ? getGradeName(student.grade) : 'N/A',
            'Estado': getAttendanceStatusText(record.status),
            'Observaciones': record.observations || '',
            'Hora de Registro': record.timestamp ? new Date(record.timestamp).toLocaleString('es-ES') : ''
        };
    });

    // Crear estadísticas de asistencia
    const stats = calculateAttendanceStatistics(attendance, students);

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    
    // Agregar hoja de estadísticas
    const wsStats = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, wsStats, "Estadísticas");
    
    // Descargar archivo
    const filename = selectedDate ? 
        `asistencia_${selectedDate}.xlsx` : 
        `asistencia_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, filename);

    Storage.addActivity({
        title: 'Asistencia Exportada',
        description: `Se exportaron ${attendance.length} registros de asistencia`,
        icon: '📄'
    });

    alert('Asistencia exportada correctamente');
}

// Obtener texto del estado de asistencia
function getAttendanceStatusText(status) {
    const statusTexts = {
        'presente': 'Presente',
        'ausente': 'Ausente',
        'tarde': 'Tarde',
        'justificado': 'Justificado'
    };
    return statusTexts[status] || status;
}

// Calcular estadísticas de asistencia
function calculateAttendanceStatistics(attendance, students) {
    if (attendance.length === 0) {
        return {
            'Total de Registros': 0,
            'Estudiantes Únicos': 0,
            'Presentes': 0,
            'Ausentes': 0,
            'Tardes': 0,
            'Justificados': 0,
            'Porcentaje de Asistencia': '0%'
        };
    }

    const uniqueStudents = [...new Set(attendance.map(a => a.studentId))];
    const presentes = attendance.filter(a => a.status === 'presente').length;
    const ausentes = attendance.filter(a => a.status === 'ausente').length;
    const tardes = attendance.filter(a => a.status === 'tarde').length;
    const justificados = attendance.filter(a => a.status === 'justificado').length;
    
    const attendanceRate = attendance.length > 0 ? 
        ((presentes + tardes + justificados) / attendance.length * 100).toFixed(1) : 0;

    return {
        'Total de Registros': attendance.length,
        'Estudiantes Únicos': uniqueStudents.length,
        'Presentes': presentes,
        'Ausentes': ausentes,
        'Tardes': tardes,
        'Justificados': justificados,
        'Porcentaje de Asistencia': `${attendanceRate}%`
    };
}

// Generar reporte de asistencia por estudiante
function generateStudentAttendanceReport(studentId) {
    const attendance = Storage.getAttendance().filter(a => a.studentId === studentId);
    const students = Storage.getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Estudiante no encontrado');
        return;
    }

    if (attendance.length === 0) {
        alert(`${student.name} no tiene registros de asistencia`);
        return;
    }

    // Preparar datos para exportación
    const exportData = attendance.map(record => ({
        'Fecha': formatDate(record.date),
        'Estado': getAttendanceStatusText(record.status),
        'Observaciones': record.observations || '',
        'Hora de Registro': record.timestamp ? new Date(record.timestamp).toLocaleString('es-ES') : ''
    }));

    // Calcular estadísticas del estudiante
    const stats = {
        'Estudiante': student.name,
        'Grado': getGradeName(student.grade),
        'Total de Días': attendance.length,
        'Días Presente': attendance.filter(a => a.status === 'presente').length,
        'Días Ausente': attendance.filter(a => a.status === 'ausente').length,
        'Días Tarde': attendance.filter(a => a.status === 'tarde').length,
        'Días Justificado': attendance.filter(a => a.status === 'justificado').length
    };

    const attendanceRate = attendance.length > 0 ? 
        ((stats['Días Presente'] + stats['Días Tarde'] + stats['Días Justificado']) / attendance.length * 100).toFixed(1) : 0;
    stats['Porcentaje de Asistencia'] = `${attendanceRate}%`;

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia Detallada");
    
    const wsStats = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, wsStats, "Resumen");
    
    // Descargar archivo
    XLSX.writeFile(wb, `asistencia_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);

    alert(`Reporte de asistencia de ${student.name} exportado correctamente`);
}

// Obtener resumen de asistencia por período
function getAttendanceSummaryByPeriod(startDate, endDate) {
    const attendance = Storage.getAttendance().filter(a => {
        const recordDate = new Date(a.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
    });

    const students = Storage.getStudents();
    const summary = {};

    attendance.forEach(record => {
        const student = students.find(s => s.id === record.studentId);
        if (student) {
            if (!summary[student.id]) {
                summary[student.id] = {
                    name: student.name,
                    grade: student.grade,
                    presente: 0,
                    ausente: 0,
                    tarde: 0,
                    justificado: 0,
                    total: 0
                };
            }
            summary[student.id][record.status]++;
            summary[student.id].total++;
        }
    });

    return Object.values(summary);
}

// Importar asistencia desde archivo Excel
function importAttendance() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                processImportedAttendance(jsonData);
            } catch (error) {
                console.error('Error al importar archivo:', error);
                alert('Error al procesar el archivo. Verifique el formato.');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    
    input.click();
}

// Procesar asistencia importada
function processImportedAttendance(data) {
    if (!data || data.length === 0) {
        alert('El archivo está vacío o no tiene el formato correcto');
        return;
    }

    const students = Storage.getStudents();
    const attendance = Storage.getAttendance();
    let importedCount = 0;
    let errors = [];

    data.forEach((row, index) => {
        try {
            // Buscar estudiante por nombre
            const student = students.find(s => 
                s.name.toLowerCase() === row.Estudiante?.toLowerCase()
            );

            if (!student) {
                errors.push(`Fila ${index + 1}: Estudiante "${row.Estudiante}" no encontrado`);
                return;
            }

            // Validar datos requeridos
            if (!row.Fecha || !row.Estado) {
                errors.push(`Fila ${index + 1}: Faltan datos requeridos`);
                return;
            }

            // Validar estado
            const validStates = ['presente', 'ausente', 'tarde', 'justificado'];
            const status = row.Estado.toLowerCase();
            if (!validStates.includes(status)) {
                errors.push(`Fila ${index + 1}: Estado inválido (${row.Estado})`);
                return;
            }

            // Convertir fecha
            let date;
            try {
                date = new Date(row.Fecha).toISOString().split('T')[0];
            } catch {
                errors.push(`Fila ${index + 1}: Fecha inválida (${row.Fecha})`);
                return;
            }

            // Verificar si ya existe el registro
            const existingIndex = attendance.findIndex(a => 
                a.studentId === student.id && a.date === date
            );

            const attendanceData = {
                studentId: student.id,
                date: date,
                status: status,
                observations: row.Observaciones || '',
                timestamp: new Date().toISOString()
            };

            if (existingIndex !== -1) {
                // Actualizar registro existente
                attendance[existingIndex] = { ...attendance[existingIndex], ...attendanceData };
            } else {
                // Crear nuevo registro
                attendance.push({
                    id: Storage.generateId(),
                    ...attendanceData
                });
            }

            importedCount++;

        } catch (error) {
            errors.push(`Fila ${index + 1}: Error al procesar datos`);
        }
    });

    // Guardar asistencia actualizada
    Storage.setAttendance(attendance);

    // Mostrar resultados
    let message = `Se importaron ${importedCount} registros de asistencia correctamente.`;
    if (errors.length > 0) {
        message += `\n\nErrores encontrados:\n${errors.slice(0, 10).join('\n')}`;
        if (errors.length > 10) {
            message += `\n... y ${errors.length - 10} errores más.`;
        }
    }

    alert(message);
    
    if (importedCount > 0) {
        loadAttendanceForDate();
        updateDashboardStats();
        
        Storage.addActivity({
            title: 'Asistencia Importada',
            description: `Se importaron ${importedCount} registros de asistencia desde archivo Excel`,
            icon: '📥'
        });
    }
}
