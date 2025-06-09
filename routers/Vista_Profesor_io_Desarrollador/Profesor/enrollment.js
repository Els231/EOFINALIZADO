// ===== GESTIÓN DE MATRÍCULAS =====

// Cargar lista de matrículas
function loadEnrollments() {
    const enrollments = Storage.getEnrollments();
    const tbody = document.getElementById('enrollmentsTableBody');
    
    if (enrollments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay matrículas registradas</td></tr>';
        return;
    }

    const students = Storage.getStudents();
    
    const html = enrollments.map(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        const studentName = student ? student.name : 'Estudiante no encontrado';
        
        return `
            <tr>
                <td><strong>${enrollment.code}</strong></td>
                <td>${studentName}</td>
                <td>${getGradeName(enrollment.grade)}</td>
                <td>${enrollment.schoolYear}</td>
                <td>${formatDate(enrollment.enrollmentDate)}</td>
                <td>
                    <span class="badge ${getEnrollmentStatusClass(enrollment.status)}">
                        ${getEnrollmentStatusText(enrollment.status)}
                    </span>
                </td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editEnrollment('${enrollment.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info me-1" onclick="viewEnrollmentDetails('${enrollment.id}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="printEnrollmentCertificate('${enrollment.id}')" title="Imprimir certificado">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEnrollment('${enrollment.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
    populateEnrollmentFilters();
}

// Poblar filtros de matrículas
function populateEnrollmentFilters() {
    const enrollments = Storage.getEnrollments();
    const yearFilter = document.getElementById('enrollmentYearFilter');
    
    // Obtener años únicos de las matrículas existentes
    const existingYears = [...new Set(enrollments.map(e => e.schoolYear))];
    const currentYear = new Date().getFullYear();
    
    // Combinar años existentes con rango alrededor del año actual
    const allYears = new Set([
        ...existingYears,
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
        currentYear + 2
    ]);
    
    // Limpiar y repoblar filtro de años
    const currentValue = yearFilter.value;
    yearFilter.innerHTML = '<option value="">Todos los años</option>';
    
    [...allYears].sort((a, b) => b - a).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Restaurar valor seleccionado
    if (currentValue) {
        yearFilter.value = currentValue;
    }
}

// Obtener clase CSS para estado de matrícula
function getEnrollmentStatusClass(status) {
    const classes = {
        'activa': 'bg-success',
        'inactiva': 'bg-secondary',
        'pendiente': 'bg-warning'
    };
    return classes[status] || 'bg-secondary';
}

// Obtener texto para estado de matrícula
function getEnrollmentStatusText(status) {
    const texts = {
        'activa': 'Activa',
        'inactiva': 'Inactiva',
        'pendiente': 'Pendiente'
    };
    return texts[status] || status;
}

// Filtrar matrículas
function filterEnrollments() {
    const searchTerm = document.getElementById('searchEnrollment').value.toLowerCase();
    const statusFilter = document.getElementById('enrollmentStatusFilter').value;
    const yearFilter = document.getElementById('enrollmentYearFilter').value;
    
    const enrollments = Storage.getEnrollments();
    const students = Storage.getStudents();
    
    const filteredEnrollments = enrollments.filter(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        const studentName = student ? student.name.toLowerCase() : '';
        
        const matchesSearch = enrollment.code.toLowerCase().includes(searchTerm) ||
                            studentName.includes(searchTerm) ||
                            enrollment.schoolYear.toString().includes(searchTerm);
        const matchesStatus = !statusFilter || enrollment.status === statusFilter;
        const matchesYear = !yearFilter || enrollment.schoolYear.toString() === yearFilter;
        
        return matchesSearch && matchesStatus && matchesYear;
    });

    const tbody = document.getElementById('enrollmentsTableBody');
    
    if (filteredEnrollments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron matrículas</td></tr>';
        return;
    }

    const html = filteredEnrollments.map(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        const studentName = student ? student.name : 'Estudiante no encontrado';
        
        return `
            <tr>
                <td><strong>${enrollment.code}</strong></td>
                <td>${studentName}</td>
                <td>${getGradeName(enrollment.grade)}</td>
                <td>${enrollment.schoolYear}</td>
                <td>${formatDate(enrollment.enrollmentDate)}</td>
                <td>
                    <span class="badge ${getEnrollmentStatusClass(enrollment.status)}">
                        ${getEnrollmentStatusText(enrollment.status)}
                    </span>
                </td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editEnrollment('${enrollment.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info me-1" onclick="viewEnrollmentDetails('${enrollment.id}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="printEnrollmentCertificate('${enrollment.id}')" title="Imprimir certificado">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEnrollment('${enrollment.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}

// Configurar filtros de búsqueda para matrículas
function setupEnrollmentFilters() {
    const searchEnrollment = document.getElementById('searchEnrollment');
    const statusFilter = document.getElementById('enrollmentStatusFilter');
    const yearFilter = document.getElementById('enrollmentYearFilter');
    
    if (searchEnrollment) {
        searchEnrollment.addEventListener('input', filterEnrollments);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEnrollments);
    }
    
    if (yearFilter) {
        yearFilter.addEventListener('change', filterEnrollments);
    }
}

// Abrir modal de matrícula
function openEnrollmentModal(enrollmentId = null) {
    const modal = new bootstrap.Modal(document.getElementById('enrollmentModal'));
    const form = document.getElementById('enrollmentForm');
    const title = document.getElementById('enrollmentModalTitle');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('enrollmentId').value = '';
    
    // Poblar selector de estudiantes
    populateStudentSelectors();
    
    if (enrollmentId) {
        // Modo edición
        title.textContent = 'Editar Matrícula';
        const enrollments = Storage.getEnrollments();
        const enrollment = enrollments.find(e => e.id === enrollmentId);
        
        if (enrollment) {
            document.getElementById('enrollmentId').value = enrollment.id;
            document.getElementById('enrollmentStudent').value = enrollment.studentId;
            document.getElementById('enrollmentGrade').value = enrollment.grade;
            document.getElementById('enrollmentYear').value = enrollment.schoolYear;
            document.getElementById('enrollmentDate').value = enrollment.enrollmentDate;
            document.getElementById('enrollmentStatus').value = enrollment.status;
            document.getElementById('enrollmentNotes').value = enrollment.notes || '';
        }
    } else {
        // Modo creación
        title.textContent = 'Nueva Matrícula';
        const currentYear = new Date().getFullYear();
        document.getElementById('enrollmentYear').value = currentYear;
        document.getElementById('enrollmentDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('enrollmentStatus').value = 'activa';
    }
    
    modal.show();
}

// Generar código único para matrícula
function generateEnrollmentCode(year, grade) {
    const enrollments = Storage.getEnrollments();
    const existingCodes = enrollments
        .filter(e => e.schoolYear.toString() === year.toString() && e.grade === grade)
        .map(e => e.code);
    
    let counter = 1;
    let code;
    
    do {
        code = `${year}-${grade}-${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingCodes.includes(code));
    
    return code;
}

// Guardar matrícula
function saveEnrollment() {
    const form = document.getElementById('enrollmentForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const enrollmentId = document.getElementById('enrollmentId').value;
    const enrollmentData = {
        studentId: document.getElementById('enrollmentStudent').value,
        grade: document.getElementById('enrollmentGrade').value,
        schoolYear: parseInt(document.getElementById('enrollmentYear').value),
        enrollmentDate: document.getElementById('enrollmentDate').value,
        status: document.getElementById('enrollmentStatus').value,
        notes: document.getElementById('enrollmentNotes').value.trim()
    };

    // Validaciones adicionales
    if (!enrollmentData.studentId) {
        alert('Debe seleccionar un estudiante');
        return;
    }

    if (!enrollmentData.grade) {
        alert('Debe seleccionar un grado');
        return;
    }

    if (!enrollmentData.schoolYear) {
        alert('Debe especificar el año escolar');
        return;
    }

    if (!enrollmentData.enrollmentDate) {
        alert('Debe seleccionar la fecha de matrícula');
        return;
    }

    let enrollments = Storage.getEnrollments();
    const students = Storage.getStudents();
    const student = students.find(s => s.id === enrollmentData.studentId);
    
    if (enrollmentId) {
        // Actualizar matrícula existente
        const index = enrollments.findIndex(e => e.id === enrollmentId);
        if (index !== -1) {
            enrollments[index] = { ...enrollments[index], ...enrollmentData };
            Storage.addActivity({
                title: 'Matrícula Actualizada',
                description: `Se actualizó la matrícula de ${student?.name || 'estudiante'}`,
                icon: '📝'
            });
        }
    } else {
        // Crear nueva matrícula
        
        // Verificar si el estudiante ya tiene una matrícula activa para el mismo año
        const existingEnrollment = enrollments.find(e => 
            e.studentId === enrollmentData.studentId && 
            e.schoolYear === enrollmentData.schoolYear && 
            e.status === 'activa'
        );
        
        if (existingEnrollment) {
            alert(`${student?.name || 'El estudiante'} ya tiene una matrícula activa para el año ${enrollmentData.schoolYear}`);
            return;
        }
        
        const newEnrollment = {
            id: Storage.generateId(),
            code: generateEnrollmentCode(enrollmentData.schoolYear, enrollmentData.grade),
            ...enrollmentData,
            createdAt: new Date().toISOString()
        };
        
        enrollments.push(newEnrollment);
        Storage.addActivity({
            title: 'Nueva Matrícula',
            description: `Se registró la matrícula de ${student?.name || 'estudiante'} en ${getGradeName(enrollmentData.grade)} (${enrollmentData.schoolYear})`,
            icon: '📋'
        });
    }

    Storage.setEnrollments(enrollments);
    
    // Cerrar modal y recargar datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('enrollmentModal'));
    modal.hide();
    
    loadEnrollments();
    updateDashboardStats();
    
    alert(enrollmentId ? 'Matrícula actualizada correctamente' : 'Matrícula registrada correctamente');
}

// Editar matrícula
function editEnrollment(enrollmentId) {
    openEnrollmentModal(enrollmentId);
}

// Ver detalles de la matrícula
function viewEnrollmentDetails(enrollmentId) {
    const enrollments = Storage.getEnrollments();
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
        alert('Matrícula no encontrada');
        return;
    }

    const students = Storage.getStudents();
    const student = students.find(s => s.id === enrollment.studentId);
    
    if (!student) {
        alert('Estudiante asociado no encontrado');
        return;
    }

    const grades = Storage.getGrades().filter(g => g.studentId === enrollment.studentId);
    const attendance = Storage.getAttendance().filter(a => a.studentId === enrollment.studentId);
    
    const detailsHtml = `
        <div class="modal fade" id="enrollmentDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de Matrícula - ${enrollment.code}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>Información de la Matrícula</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Código:</strong> ${enrollment.code}</p>
                                        <p><strong>Estudiante:</strong> ${student.name}</p>
                                        <p><strong>Grado:</strong> ${getGradeName(enrollment.grade)}</p>
                                        <p><strong>Año Escolar:</strong> ${enrollment.schoolYear}</p>
                                        <p><strong>Fecha de Matrícula:</strong> ${formatDate(enrollment.enrollmentDate)}</p>
                                        <p><strong>Estado:</strong> 
                                            <span class="badge ${getEnrollmentStatusClass(enrollment.status)}">
                                                ${getEnrollmentStatusText(enrollment.status)}
                                            </span>
                                        </p>
                                        <p><strong>Observaciones:</strong> ${enrollment.notes || 'Ninguna'}</p>
                                        <p><strong>Fecha de Registro:</strong> ${enrollment.createdAt ? formatDate(enrollment.createdAt) : 'No disponible'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>Información del Estudiante</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Email:</strong> ${student.email || 'No registrado'}</p>
                                        <p><strong>Teléfono:</strong> ${student.phone || 'No registrado'}</p>
                                        <p><strong>Fecha de Nacimiento:</strong> ${student.birthDate ? formatDate(student.birthDate) : 'No registrada'}</p>
                                        <p><strong>Dirección:</strong> ${student.address || 'No registrada'}</p>
                                        <p><strong>Total de Notas:</strong> ${grades.length}</p>
                                        <p><strong>Registros de Asistencia:</strong> ${attendance.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-info me-2" onclick="printEnrollmentCertificate('${enrollment.id}')">
                            <i class="fas fa-print me-1"></i> Imprimir Certificado
                        </button>
                        <button type="button" class="btn btn-primary" onclick="editEnrollment('${enrollment.id}'); bootstrap.Modal.getInstance(document.getElementById('enrollmentDetailsModal')).hide();">
                            <i class="fas fa-edit me-1"></i> Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal anterior si existe
    const existingModal = document.getElementById('enrollmentDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', detailsHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('enrollmentDetailsModal'));
    modal.show();
}

// Eliminar matrícula
function deleteEnrollment(enrollmentId) {
    const enrollments = Storage.getEnrollments();
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
        alert('Matrícula no encontrada');
        return;
    }

    const students = Storage.getStudents();
    const student = students.find(s => s.id === enrollment.studentId);
    const studentName = student ? student.name : 'Estudiante';

    if (!confirm(`¿Estás seguro de que quieres eliminar la matrícula ${enrollment.code} de ${studentName}? Esta acción no se puede deshacer.`)) {
        return;
    }

    // Eliminar matrícula
    const updatedEnrollments = enrollments.filter(e => e.id !== enrollmentId);
    Storage.setEnrollments(updatedEnrollments);

    Storage.addActivity({
        title: 'Matrícula Eliminada',
        description: `Se eliminó la matrícula ${enrollment.code} de ${studentName}`,
        icon: '🗑️'
    });

    loadEnrollments();
    updateDashboardStats();
    
    alert('Matrícula eliminada correctamente');
}

// Exportar matrículas
function exportEnrollments() {
    const enrollments = Storage.getEnrollments();
    const students = Storage.getStudents();
    
    if (enrollments.length === 0) {
        alert('No hay matrículas para exportar');
        return;
    }

    // Preparar datos para exportación
    const exportData = enrollments.map(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        return {
            'Código': enrollment.code,
            'Estudiante': student ? student.name : 'No encontrado',
            'Grado': getGradeName(enrollment.grade),
            'Año Escolar': enrollment.schoolYear,
            'Fecha de Matrícula': formatDate(enrollment.enrollmentDate),
            'Estado': getEnrollmentStatusText(enrollment.status),
            'Observaciones': enrollment.notes || '',
            'Email Estudiante': student?.email || '',
            'Teléfono Estudiante': student?.phone || '',
            'Fecha de Registro': enrollment.createdAt ? formatDate(enrollment.createdAt) : ''
        };
    });

    // Crear estadísticas
    const stats = calculateEnrollmentStatistics(enrollments);

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matrículas");
    
    // Agregar hoja de estadísticas
    const wsStats = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, wsStats, "Estadísticas");
    
    // Descargar archivo
    XLSX.writeFile(wb, `matriculas_${new Date().toISOString().split('T')[0]}.xlsx`);

    Storage.addActivity({
        title: 'Matrículas Exportadas',
        description: `Se exportaron ${enrollments.length} matrículas`,
        icon: '📄'
    });

    alert('Matrículas exportadas correctamente');
}

// Calcular estadísticas de matrículas
function calculateEnrollmentStatistics(enrollments) {
    if (enrollments.length === 0) {
        return {
            'Total de Matrículas': 0,
            'Matrículas Activas': 0,
            'Matrículas Inactivas': 0,
            'Matrículas Pendientes': 0,
            'Año Escolar Más Común': 'N/A'
        };
    }

    const activeCount = enrollments.filter(e => e.status === 'activa').length;
    const inactiveCount = enrollments.filter(e => e.status === 'inactiva').length;
    const pendingCount = enrollments.filter(e => e.status === 'pendiente').length;

    // Encontrar el año escolar más común
    const yearCounts = {};
    enrollments.forEach(e => {
        yearCounts[e.schoolYear] = (yearCounts[e.schoolYear] || 0) + 1;
    });
    
    const mostCommonYear = Object.keys(yearCounts).reduce((a, b) => 
        yearCounts[a] > yearCounts[b] ? a : b
    );

    return {
        'Total de Matrículas': enrollments.length,
        'Matrículas Activas': activeCount,
        'Matrículas Inactivas': inactiveCount,
        'Matrículas Pendientes': pendingCount,
        'Año Escolar Más Común': mostCommonYear,
        'Porcentaje Activas': `${((activeCount / enrollments.length) * 100).toFixed(1)}%`
    };
}

// Imprimir certificado de matrícula
function printEnrollmentCertificate(enrollmentId) {
    const enrollments = Storage.getEnrollments();
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
        alert('Matrícula no encontrada');
        return;
    }

    const students = Storage.getStudents();
    const student = students.find(s => s.id === enrollment.studentId);
    
    if (!student) {
        alert('Estudiante no encontrado');
        return;
    }

    // Crear PDF del certificado
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurar fuente
    doc.setFont('helvetica');
    
    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text('ESCUELA JESÚS EL BUEN MAESTRO', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICADO DE MATRÍCULA', 105, 50, { align: 'center' });
    
    // Línea decorativa
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    
    // Información del certificado
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('es-ES');
    
    doc.text('CERTIFICAMOS QUE:', 20, 80);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Estudiante: ${student.name}`, 20, 100);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Código de Matrícula: ${enrollment.code}`, 20, 120);
    doc.text(`Grado: ${getGradeName(enrollment.grade)}`, 20, 135);
    doc.text(`Año Escolar: ${enrollment.schoolYear}`, 20, 150);
    doc.text(`Fecha de Matrícula: ${formatDate(enrollment.enrollmentDate)}`, 20, 165);
    doc.text(`Estado: ${getEnrollmentStatusText(enrollment.status)}`, 20, 180);
    
    if (enrollment.notes) {
        doc.text(`Observaciones: ${enrollment.notes}`, 20, 195);
    }
    
    // Información adicional del estudiante
    doc.text('INFORMACIÓN DEL ESTUDIANTE:', 20, 220);
    if (student.birthDate) {
        doc.text(`Fecha de Nacimiento: ${formatDate(student.birthDate)}`, 20, 235);
    }
    if (student.address) {
        doc.text(`Dirección: ${student.address}`, 20, 250);
    }
    
    // Pie del certificado
    doc.setFontSize(10);
    doc.text(`Expedido el: ${currentDate}`, 20, 270);
    doc.text('Portal del Profesor - Sistema de Gestión Escolar', 20, 280);
    
    // Línea de firma
    doc.line(120, 250, 180, 250);
    doc.text('Firma y Sello', 140, 260, { align: 'center' });
    
    // Guardar o imprimir
    doc.save(`certificado_matricula_${enrollment.code}.pdf`);
    
    Storage.addActivity({
        title: 'Certificado Generado',
        description: `Se generó certificado de matrícula para ${student.name}`,
        icon: '📄'
    });
    
    alert('Certificado de matrícula generado correctamente');
}

// Configurar filtros al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    setupEnrollmentFilters();
});
