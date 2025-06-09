// ===== GESTIÓN DE ESTUDIANTES =====

// Cargar lista de estudiantes
function loadStudents() {
    const students = Storage.getStudents();
    const tbody = document.getElementById('studentsTableBody');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay estudiantes registrados</td></tr>';
        return;
    }

    const html = students.map(student => `
        <tr>
            <td>
                <div class="avatar">${student.name.charAt(0).toUpperCase()}</div>
            </td>
            <td>${student.name}</td>
            <td>${getGradeName(student.grade)}</td>
            <td>${student.email || '-'}</td>
            <td>${student.phone || '-'}</td>
            <td>
                <span class="badge ${student.status === 'activo' ? 'bg-success' : 'bg-secondary'}">
                    ${student.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStudent('${student.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-info me-1" onclick="viewStudentDetails('${student.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = html;
    
    // Poblar filtros
    populateStudentFilters();
}

// Poblar filtros de estudiantes
function populateStudentFilters() {
    const students = Storage.getStudents();
    const gradeFilter = document.getElementById('gradeFilter');
    
    // Limpiar filtro de grados
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

// Filtrar estudiantes
function filterStudents() {
    const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
    const gradeFilter = document.getElementById('gradeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const students = Storage.getStudents();
    
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                            (student.email && student.email.toLowerCase().includes(searchTerm));
        const matchesGrade = !gradeFilter || student.grade === gradeFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;
        
        return matchesSearch && matchesGrade && matchesStatus;
    });

    const tbody = document.getElementById('studentsTableBody');
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron estudiantes</td></tr>';
        return;
    }

    const html = filteredStudents.map(student => `
        <tr>
            <td>
                <div class="avatar">${student.name.charAt(0).toUpperCase()}</div>
            </td>
            <td>${student.name}</td>
            <td>${getGradeName(student.grade)}</td>
            <td>${student.email || '-'}</td>
            <td>${student.phone || '-'}</td>
            <td>
                <span class="badge ${student.status === 'activo' ? 'bg-success' : 'bg-secondary'}">
                    ${student.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStudent('${student.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-info me-1" onclick="viewStudentDetails('${student.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = html;
}

// Abrir modal de estudiante
function openStudentModal(studentId = null) {
    const modal = new bootstrap.Modal(document.getElementById('studentModal'));
    const form = document.getElementById('studentForm');
    const title = document.getElementById('studentModalTitle');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('studentId').value = '';
    
    if (studentId) {
        // Modo edición
        title.textContent = 'Editar Estudiante';
        const students = Storage.getStudents();
        const student = students.find(s => s.id === studentId);
        
        if (student) {
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email || '';
            document.getElementById('studentPhone').value = student.phone || '';
            document.getElementById('studentGrade').value = student.grade;
            document.getElementById('studentBirthDate').value = student.birthDate || '';
            document.getElementById('studentAddress').value = student.address || '';
            document.getElementById('studentStatus').value = student.status;
        }
    } else {
        // Modo creación
        title.textContent = 'Agregar Estudiante';
        document.getElementById('studentStatus').value = 'activo';
    }
    
    modal.show();
}

// Guardar estudiante
function saveStudent() {
    const form = document.getElementById('studentForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const studentId = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        phone: document.getElementById('studentPhone').value.trim(),
        grade: document.getElementById('studentGrade').value,
        birthDate: document.getElementById('studentBirthDate').value,
        address: document.getElementById('studentAddress').value.trim(),
        status: document.getElementById('studentStatus').value
    };

    // Validaciones adicionales
    if (!studentData.name) {
        alert('El nombre es requerido');
        return;
    }

    if (!studentData.grade) {
        alert('Debe seleccionar un grado');
        return;
    }

    let students = Storage.getStudents();
    
    if (studentId) {
        // Actualizar estudiante existente
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students[index] = { ...students[index], ...studentData };
            Storage.addActivity({
                title: 'Estudiante Actualizado',
                description: `Se actualizó la información de ${studentData.name}`,
                icon: '✏️'
            });
        }
    } else {
        // Crear nuevo estudiante
        const newStudent = {
            id: Storage.generateId(),
            ...studentData,
            createdAt: new Date().toISOString()
        };
        students.push(newStudent);
        Storage.addActivity({
            title: 'Nuevo Estudiante',
            description: `Se registró a ${studentData.name} en ${getGradeName(studentData.grade)}`,
            icon: '👤'
        });
    }

    Storage.setStudents(students);
    
    // Cerrar modal y recargar datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
    modal.hide();
    
    loadStudents();
    updateDashboardStats();
    
    alert(studentId ? 'Estudiante actualizado correctamente' : 'Estudiante agregado correctamente');
}

// Editar estudiante
function editStudent(studentId) {
    openStudentModal(studentId);
}

// Ver detalles del estudiante
function viewStudentDetails(studentId) {
    const students = Storage.getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Estudiante no encontrado');
        return;
    }

    const grades = Storage.getGrades().filter(g => g.studentId === studentId);
    const attendance = Storage.getAttendance().filter(a => a.studentId === studentId);
    
    const avgGrade = grades.length > 0 ? 
        (grades.reduce((sum, g) => sum + parseFloat(g.value), 0) / grades.length).toFixed(1) : 'N/A';
    
    const presentDays = attendance.filter(a => a.status === 'presente').length;
    const totalDays = attendance.length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 'N/A';

    const detailsHtml = `
        <div class="modal fade" id="studentDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de ${student.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>Información Personal</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Nombre:</strong> ${student.name}</p>
                                        <p><strong>Grado:</strong> ${getGradeName(student.grade)}</p>
                                        <p><strong>Email:</strong> ${student.email || 'No registrado'}</p>
                                        <p><strong>Teléfono:</strong> ${student.phone || 'No registrado'}</p>
                                        <p><strong>Fecha de Nacimiento:</strong> ${student.birthDate ? formatDate(student.birthDate) : 'No registrada'}</p>
                                        <p><strong>Dirección:</strong> ${student.address || 'No registrada'}</p>
                                        <p><strong>Estado:</strong> 
                                            <span class="badge ${student.status === 'activo' ? 'bg-success' : 'bg-secondary'}">
                                                ${student.status === 'activo' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>Estadísticas Académicas</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Promedio General:</strong> ${avgGrade}</p>
                                        <p><strong>Total de Notas:</strong> ${grades.length}</p>
                                        <p><strong>Porcentaje de Asistencia:</strong> ${attendanceRate}%</p>
                                        <p><strong>Días Presente:</strong> ${presentDays}</p>
                                        <p><strong>Total de Días:</strong> ${totalDays}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        ${grades.length > 0 ? `
                        <div class="mt-3">
                            <h6>Últimas Notas</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Materia</th>
                                            <th>Período</th>
                                            <th>Nota</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${grades.slice(-5).map(grade => `
                                            <tr>
                                                <td>${getSubjectName(grade.subject)}</td>
                                                <td>Período ${grade.period}</td>
                                                <td><span class="${getGradeClass(grade.value)}">${grade.value}</span></td>
                                                <td>${formatDate(grade.date)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="editStudent('${student.id}'); bootstrap.Modal.getInstance(document.getElementById('studentDetailsModal')).hide();">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal anterior si existe
    const existingModal = document.getElementById('studentDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', detailsHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('studentDetailsModal'));
    modal.show();
}

// Eliminar estudiante
function deleteStudent(studentId) {
    const students = Storage.getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Estudiante no encontrado');
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar a ${student.name}? Esta acción no se puede deshacer.`)) {
        return;
    }

    // Eliminar estudiante
    const updatedStudents = students.filter(s => s.id !== studentId);
    Storage.setStudents(updatedStudents);

    // Eliminar datos relacionados
    const grades = Storage.getGrades().filter(g => g.studentId !== studentId);
    Storage.setGrades(grades);

    const attendance = Storage.getAttendance().filter(a => a.studentId !== studentId);
    Storage.setAttendance(attendance);

    const enrollments = Storage.getEnrollments().filter(e => e.studentId !== studentId);
    Storage.setEnrollments(enrollments);

    Storage.addActivity({
        title: 'Estudiante Eliminado',
        description: `Se eliminó a ${student.name} del sistema`,
        icon: '🗑️'
    });

    loadStudents();
    updateDashboardStats();
    
    alert('Estudiante eliminado correctamente');
}

// Exportar estudiantes
function exportStudents() {
    const students = Storage.getStudents();
    
    if (students.length === 0) {
        alert('No hay estudiantes para exportar');
        return;
    }

    // Preparar datos para exportación
    const exportData = students.map(student => ({
        'Nombre': student.name,
        'Grado': getGradeName(student.grade),
        'Email': student.email || '',
        'Teléfono': student.phone || '',
        'Fecha de Nacimiento': student.birthDate ? formatDate(student.birthDate) : '',
        'Dirección': student.address || '',
        'Estado': student.status === 'activo' ? 'Activo' : 'Inactivo',
        'Fecha de Registro': student.createdAt ? formatDate(student.createdAt) : ''
    }));

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    
    // Descargar archivo
    XLSX.writeFile(wb, `estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`);

    Storage.addActivity({
        title: 'Estudiantes Exportados',
        description: `Se exportaron ${students.length} estudiantes`,
        icon: '📄'
    });

    alert('Lista de estudiantes exportada correctamente');
}

// Poblar selectores de estudiantes en otros formularios
function populateStudentSelectors() {
    const students = Storage.getStudents().filter(s => s.status === 'activo');
    const selectors = ['gradeStudent', 'gradeStudentFilter', 'enrollmentStudent', 'attendanceStudent'];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            const currentValue = selector.value;
            selector.innerHTML = '<option value="">Seleccionar estudiante</option>';
            
            if (selectorId.includes('Filter')) {
                selector.innerHTML = '<option value="">Todos los estudiantes</option>';
            }
            
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} - ${getGradeName(student.grade)}`;
                selector.appendChild(option);
            });
            
            // Restaurar valor seleccionado
            if (currentValue) {
                selector.value = currentValue;
            }
        }
    });
}

// Llamar a esta función cuando se carguen los estudiantes
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar selectores cuando cambie la sección
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (!target.classList.contains('hidden')) {
                    populateStudentSelectors();
                }
            }
        });
    });

    // Observar cambios en las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        observer.observe(section, { attributes: true });
    });
});
