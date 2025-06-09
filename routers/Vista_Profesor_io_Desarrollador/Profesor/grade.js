// ===== GESTIÓN DE NOTAS =====

// Cargar lista de notas
function loadGrades() {
    const grades = Storage.getGrades();
    const tbody = document.getElementById('gradesTableBody');
    
    if (grades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay notas registradas</td></tr>';
        return;
    }

    const students = Storage.getStudents();
    
    const html = grades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const studentName = student ? student.name : 'Estudiante no encontrado';
        
        return `
            <tr>
                <td>${studentName}</td>
                <td>${getSubjectName(grade.subject)}</td>
                <td>Período ${grade.period}</td>
                <td><span class="${getGradeClass(grade.value)}">${grade.value}</span></td>
                <td>${formatDate(grade.date)}</td>
                <td>${grade.observations || '-'}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editGrade('${grade.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteGrade('${grade.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
    populateStudentSelectors();
}

// Poblar filtros de notas
function populateGradeFilters() {
    const grades = Storage.getGrades();
    const subjectFilter = document.getElementById('gradeSubjectFilter');
    
    // Limpiar filtro de materias
    subjectFilter.innerHTML = '<option value="">Todas las materias</option>';
    
    // Obtener materias únicas
    const uniqueSubjects = [...new Set(grades.map(g => g.subject))];
    uniqueSubjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = getSubjectName(subject);
        subjectFilter.appendChild(option);
    });
}

// Filtrar notas
function filterGrades() {
    const studentFilter = document.getElementById('gradeStudentFilter').value;
    const subjectFilter = document.getElementById('gradeSubjectFilter').value;
    const periodFilter = document.getElementById('gradePeriodFilter').value;
    
    const grades = Storage.getGrades();
    const students = Storage.getStudents();
    
    const filteredGrades = grades.filter(grade => {
        const matchesStudent = !studentFilter || grade.studentId === studentFilter;
        const matchesSubject = !subjectFilter || grade.subject === subjectFilter;
        const matchesPeriod = !periodFilter || grade.period === periodFilter;
        
        return matchesStudent && matchesSubject && matchesPeriod;
    });

    const tbody = document.getElementById('gradesTableBody');
    
    if (filteredGrades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron notas</td></tr>';
        return;
    }

    const html = filteredGrades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const studentName = student ? student.name : 'Estudiante no encontrado';
        
        return `
            <tr>
                <td>${studentName}</td>
                <td>${getSubjectName(grade.subject)}</td>
                <td>Período ${grade.period}</td>
                <td><span class="${getGradeClass(grade.value)}">${grade.value}</span></td>
                <td>${formatDate(grade.date)}</td>
                <td>${grade.observations || '-'}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editGrade('${grade.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteGrade('${grade.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

// Abrir modal de nota
function openGradeModal(gradeId = null) {
    const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
    const form = document.getElementById('gradeForm');
    const title = document.getElementById('gradeModalTitle');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('gradeId').value = '';
    
    // Poblar selector de estudiantes
    populateStudentSelectors();
    
    if (gradeId) {
        // Modo edición
        title.textContent = 'Editar Nota';
        const grades = Storage.getGrades();
        const grade = grades.find(g => g.id === gradeId);
        
        if (grade) {
            document.getElementById('gradeId').value = grade.id;
            document.getElementById('gradeStudent').value = grade.studentId;
            document.getElementById('gradeSubject').value = grade.subject;
            document.getElementById('gradePeriod').value = grade.period;
            document.getElementById('gradeValue').value = grade.value;
            document.getElementById('gradeDate').value = grade.date;
            document.getElementById('gradeObservations').value = grade.observations || '';
        }
    } else {
        // Modo creación
        title.textContent = 'Agregar Nota';
        document.getElementById('gradeDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.show();
}

// Guardar nota
function saveGrade() {
    const form = document.getElementById('gradeForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const gradeId = document.getElementById('gradeId').value;
    const gradeData = {
        studentId: document.getElementById('gradeStudent').value,
        subject: document.getElementById('gradeSubject').value,
        period: document.getElementById('gradePeriod').value,
        value: parseFloat(document.getElementById('gradeValue').value),
        date: document.getElementById('gradeDate').value,
        observations: document.getElementById('gradeObservations').value.trim()
    };

    // Validaciones adicionales
    if (!gradeData.studentId) {
        alert('Debe seleccionar un estudiante');
        return;
    }

    if (!gradeData.subject) {
        alert('Debe seleccionar una materia');
        return;
    }

    if (!gradeData.period) {
        alert('Debe seleccionar un período');
        return;
    }

    if (gradeData.value < 0 || gradeData.value > 10) {
        alert('La nota debe estar entre 0 y 10');
        return;
    }

    if (!gradeData.date) {
        alert('Debe seleccionar una fecha');
        return;
    }

    let grades = Storage.getGrades();
    const students = Storage.getStudents();
    const student = students.find(s => s.id === gradeData.studentId);
    
    if (gradeId) {
        // Actualizar nota existente
        const index = grades.findIndex(g => g.id === gradeId);
        if (index !== -1) {
            grades[index] = { ...grades[index], ...gradeData };
            Storage.addActivity({
                title: 'Nota Actualizada',
                description: `Se actualizó la nota de ${student?.name || 'estudiante'} en ${getSubjectName(gradeData.subject)}`,
                icon: '📝'
            });
        }
    } else {
        // Crear nueva nota
        const newGrade = {
            id: Storage.generateId(),
            ...gradeData,
            createdAt: new Date().toISOString()
        };
        grades.push(newGrade);
        Storage.addActivity({
            title: 'Nueva Nota Registrada',
            description: `Se registró nota ${gradeData.value} para ${student?.name || 'estudiante'} en ${getSubjectName(gradeData.subject)}`,
            icon: '📊'
        });
    }

    Storage.setGrades(grades);
    
    // Cerrar modal y recargar datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('gradeModal'));
    modal.hide();
    
    loadGrades();
    updateDashboardStats();
    
    alert(gradeId ? 'Nota actualizada correctamente' : 'Nota agregada correctamente');
}

// Editar nota
function editGrade(gradeId) {
    openGradeModal(gradeId);
}

// Eliminar nota
function deleteGrade(gradeId) {
    const grades = Storage.getGrades();
    const grade = grades.find(g => g.id === gradeId);
    
    if (!grade) {
        alert('Nota no encontrada');
        return;
    }

    const students = Storage.getStudents();
    const student = students.find(s => s.id === grade.studentId);
    const studentName = student ? student.name : 'Estudiante';

    if (!confirm(`¿Estás seguro de que quieres eliminar la nota de ${studentName} en ${getSubjectName(grade.subject)}?`)) {
        return;
    }

    // Eliminar nota
    const updatedGrades = grades.filter(g => g.id !== gradeId);
    Storage.setGrades(updatedGrades);

    Storage.addActivity({
        title: 'Nota Eliminada',
        description: `Se eliminó una nota de ${studentName} en ${getSubjectName(grade.subject)}`,
        icon: '🗑️'
    });

    loadGrades();
    updateDashboardStats();
    
    alert('Nota eliminada correctamente');
}

// Exportar notas
function exportGrades() {
    const grades = Storage.getGrades();
    const students = Storage.getStudents();
    
    if (grades.length === 0) {
        alert('No hay notas para exportar');
        return;
    }

    // Preparar datos para exportación
    const exportData = grades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        return {
            'Estudiante': student ? student.name : 'No encontrado',
            'Grado del Estudiante': student ? getGradeName(student.grade) : 'N/A',
            'Materia': getSubjectName(grade.subject),
            'Período': `Período ${grade.period}`,
            'Nota': grade.value,
            'Fecha': formatDate(grade.date),
            'Observaciones': grade.observations || '',
            'Fecha de Registro': grade.createdAt ? formatDate(grade.createdAt) : ''
        };
    });

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas");
    
    // Agregar hoja de estadísticas
    const stats = calculateGradeStatistics(grades, students);
    const wsStats = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, wsStats, "Estadísticas");
    
    // Descargar archivo
    XLSX.writeFile(wb, `notas_${new Date().toISOString().split('T')[0]}.xlsx`);

    Storage.addActivity({
        title: 'Notas Exportadas',
        description: `Se exportaron ${grades.length} notas`,
        icon: '📄'
    });

    alert('Notas exportadas correctamente');
}

// Calcular estadísticas de notas
function calculateGradeStatistics(grades, students) {
    if (grades.length === 0) {
        return {
            'Total de Notas': 0,
            'Promedio General': 0,
            'Nota Más Alta': 0,
            'Nota Más Baja': 0,
            'Estudiantes con Notas': 0
        };
    }

    const values = grades.map(g => parseFloat(g.value));
    const uniqueStudents = [...new Set(grades.map(g => g.studentId))];
    
    return {
        'Total de Notas': grades.length,
        'Promedio General': (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
        'Nota Más Alta': Math.max(...values),
        'Nota Más Baja': Math.min(...values),
        'Estudiantes con Notas': uniqueStudents.length,
        'Notas Excelentes (9-10)': values.filter(v => v >= 9).length,
        'Notas Buenas (7-8.9)': values.filter(v => v >= 7 && v < 9).length,
        'Notas Regulares (5-6.9)': values.filter(v => v >= 5 && v < 7).length,
        'Notas Deficientes (0-4.9)': values.filter(v => v < 5).length
    };
}

// Generar reporte de notas por estudiante
function generateStudentGradeReport(studentId) {
    const grades = Storage.getGrades().filter(g => g.studentId === studentId);
    const students = Storage.getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Estudiante no encontrado');
        return;
    }

    if (grades.length === 0) {
        alert(`${student.name} no tiene notas registradas`);
        return;
    }

    // Agrupar notas por materia y período
    const gradesBySubject = {};
    grades.forEach(grade => {
        if (!gradesBySubject[grade.subject]) {
            gradesBySubject[grade.subject] = {};
        }
        gradesBySubject[grade.subject][grade.period] = grade;
    });

    // Preparar datos para exportación
    const exportData = [];
    Object.keys(gradesBySubject).forEach(subject => {
        const subjectData = {
            'Materia': getSubjectName(subject),
            'Período 1': gradesBySubject[subject]['1']?.value || '',
            'Período 2': gradesBySubject[subject]['2']?.value || '',
            'Período 3': gradesBySubject[subject]['3']?.value || '',
            'Período 4': gradesBySubject[subject]['4']?.value || ''
        };
        
        // Calcular promedio de la materia
        const subjectGrades = Object.values(gradesBySubject[subject]).map(g => parseFloat(g.value));
        if (subjectGrades.length > 0) {
            subjectData['Promedio'] = (subjectGrades.reduce((a, b) => a + b, 0) / subjectGrades.length).toFixed(2);
        }
        
        exportData.push(subjectData);
    });

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas por Materia");
    
    // Descargar archivo
    XLSX.writeFile(wb, `notas_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);

    alert(`Reporte de notas de ${student.name} exportado correctamente`);
}

// Función para importar notas masivamente (opcional)
function importGrades() {
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
                
                // Procesar datos importados
                processImportedGrades(jsonData);
            } catch (error) {
                console.error('Error al importar archivo:', error);
                alert('Error al procesar el archivo. Verifique el formato.');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    
    input.click();
}

// Procesar notas importadas
function processImportedGrades(data) {
    if (!data || data.length === 0) {
        alert('El archivo está vacío o no tiene el formato correcto');
        return;
    }

    const students = Storage.getStudents();
    const grades = Storage.getGrades();
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
            if (!row.Materia || !row.Período || !row.Nota) {
                errors.push(`Fila ${index + 1}: Faltan datos requeridos`);
                return;
            }

            const grade = parseFloat(row.Nota);
            if (isNaN(grade) || grade < 0 || grade > 10) {
                errors.push(`Fila ${index + 1}: Nota inválida (${row.Nota})`);
                return;
            }

            // Crear nueva nota
            const newGrade = {
                id: Storage.generateId(),
                studentId: student.id,
                subject: findSubjectCode(row.Materia),
                period: row.Período.toString(),
                value: grade,
                date: row.Fecha || new Date().toISOString().split('T')[0],
                observations: row.Observaciones || '',
                createdAt: new Date().toISOString()
            };

            grades.push(newGrade);
            importedCount++;

        } catch (error) {
            errors.push(`Fila ${index + 1}: Error al procesar datos`);
        }
    });

    // Guardar notas actualizadas
    Storage.setGrades(grades);

    // Mostrar resultados
    let message = `Se importaron ${importedCount} notas correctamente.`;
    if (errors.length > 0) {
        message += `\n\nErrores encontrados:\n${errors.slice(0, 10).join('\n')}`;
        if (errors.length > 10) {
            message += `\n... y ${errors.length - 10} errores más.`;
        }
    }

    alert(message);
    
    if (importedCount > 0) {
        loadGrades();
        updateDashboardStats();
        
        Storage.addActivity({
            title: 'Notas Importadas',
            description: `Se importaron ${importedCount} notas desde archivo Excel`,
            icon: '📥'
        });
    }
}

// Encontrar código de materia por nombre
function findSubjectCode(subjectName) {
    const subjects = {
        'matemáticas': 'matematicas',
        'matematicas': 'matematicas',
        'español': 'espanol',
        'espanol': 'espanol',
        'ciencias naturales': 'ciencias',
        'ciencias': 'ciencias',
        'ciencias sociales': 'sociales',
        'sociales': 'sociales',
        'inglés': 'ingles',
        'ingles': 'ingles',
        'educación física': 'educacion-fisica',
        'educacion fisica': 'educacion-fisica',
        'arte': 'arte',
        'religión': 'religion',
        'religion': 'religion'
    };

    return subjects[subjectName.toLowerCase()] || 'matematicas';
}
