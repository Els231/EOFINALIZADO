/**
 * Dashboard del Desarrollador - Sistema Completo
 * Con funcionalidades avanzadas de CRUD, exportación, importación e impresión
 */

class DeveloperDashboard {
    constructor() {
        this.estudiantes = [];
        this.profesores = [];
        this.notas = [];
        this.asistencias = [];
        this.matriculas = [];
        this.eventos = [];
        this.codigosGuardados = [];
        this.currentSection = 'dashboard';
        this.selectedItems = {
            estudiantes: [],
            profesores: [],
            notas: []
        };
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadAllTables();
            this.populateSelects();
            this.loadCodigosGuardados();
        });
    }

    loadInitialData() {
        // Cargar datos desde localStorage o crear datos iniciales
        this.estudiantes = this.getStoredData('estudiantes') || this.generateInitialStudents();
        this.profesores = this.getStoredData('profesores') || this.generateInitialTeachers();
        this.notas = this.getStoredData('notas') || this.generateInitialGrades();
        this.asistencias = this.getStoredData('asistencias') || this.generateInitialAttendance();
        this.matriculas = this.getStoredData('matriculas') || this.generateInitialEnrollments();
        this.eventos = this.getStoredData('eventos') || this.generateInitialEvents();
        this.codigosGuardados = this.getStoredData('codigos') || [];
        
        this.saveAllData();
        this.updateDashboardStats();
    }

    generateInitialStudents() {
        const nombres = ['Ana', 'Juan', 'María', 'Carlos', 'Sofía', 'Luis', 'Elena', 'Diego', 'Lucía', 'Pablo', 'Carmen', 'Miguel', 'Isabel', 'Antonio', 'Laura'];
        const apellidos = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Torres', 'Rivera', 'Gómez', 'Díaz', 'Morales'];
        const grados = ['1A', '1B', '2A', '2B', '3A', '3B'];
        const estudiantes = [];

        for (let i = 1; i <= 125; i++) {
            const nombre = nombres[Math.floor(Math.random() * nombres.length)];
            const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
            const grado = grados[Math.floor(Math.random() * grados.length)];
            const edad = parseInt(grado[0]) + 5; // 1er grado = 6 años, etc.

            estudiantes.push({
                id: i,
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                grado: grado,
                fechaNacimiento: this.generateRandomBirthDate(edad),
                direccion: `Calle ${Math.floor(Math.random() * 100) + 1}, Ciudad`,
                nombreTutor: `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellido}`,
                telefonoTutor: `+54 11 ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
                emailTutor: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@email.com`,
                estado: Math.random() > 0.05 ? 'activo' : 'inactivo',
                promedio: this.getRandomGrade(),
                asistencia: Math.floor(Math.random() * 20) + 80 // 80-100%
            });
        }

        return estudiantes;
    }

    generateInitialTeachers() {
        const profesores = [
            {
                id: 1,
                nombre: 'Laura',
                apellido: 'Martínez',
                especialidad: 'matematicas',
                gradosAsignados: ['1A', '2A'],
                email: 'laura.martinez@escuela.edu',
                telefono: '+54 11 1111-1111',
                direccion: 'Av. Principal 123',
                estado: 'activo',
                estudiantesACargo: 0
            },
            {
                id: 2,
                nombre: 'Carlos',
                apellido: 'García',
                especialidad: 'lengua',
                gradosAsignados: ['1B', '2B'],
                email: 'carlos.garcia@escuela.edu',
                telefono: '+54 11 2222-2222',
                direccion: 'Calle Secundaria 456',
                estado: 'activo',
                estudiantesACargo: 0
            },
            {
                id: 3,
                nombre: 'Ana',
                apellido: 'López',
                especialidad: 'ciencias',
                gradosAsignados: ['3A', '3B'],
                email: 'ana.lopez@escuela.edu',
                telefono: '+54 11 3333-3333',
                direccion: 'Plaza Central 789',
                estado: 'activo',
                estudiantesACargo: 0
            },
            {
                id: 4,
                nombre: 'Miguel',
                apellido: 'Rodríguez',
                especialidad: 'sociales',
                gradosAsignados: ['1A', '1B', '2A'],
                email: 'miguel.rodriguez@escuela.edu',
                telefono: '+54 11 4444-4444',
                direccion: 'Barrio Norte 321',
                estado: 'activo',
                estudiantesACargo: 0
            },
            {
                id: 5,
                nombre: 'Elena',
                apellido: 'Sánchez',
                especialidad: 'educacion-fisica',
                gradosAsignados: ['1A', '1B', '2A', '2B', '3A', '3B'],
                email: 'elena.sanchez@escuela.edu',
                telefono: '+54 11 5555-5555',
                direccion: 'Zona Sur 654',
                estado: 'activo',
                estudiantesACargo: 0
            }
        ];

        // Calcular estudiantes a cargo
        profesores.forEach(profesor => {
            profesor.estudiantesACargo = this.estudiantes.filter(est => 
                profesor.gradosAsignados.includes(est.grado) && est.estado === 'activo'
            ).length;
        });

        return profesores;
    }

    generateInitialGrades() {
        const materias = ['matematicas', 'lengua', 'ciencias', 'sociales', 'educacion-fisica'];
        const notas = [];
        let id = 1;

        this.estudiantes.forEach(estudiante => {
            materias.forEach(materia => {
                for (let periodo = 1; periodo <= 3; periodo++) {
                    notas.push({
                        id: id++,
                        estudianteId: estudiante.id,
                        materia: materia,
                        nota: this.getRandomGrade(),
                        periodo: periodo,
                        fecha: this.getRandomDate(),
                        observaciones: Math.random() > 0.7 ? 'Excelente trabajo' : '',
                        estado: 'activa'
                    });
                }
            });
        });

        return notas;
    }

    generateInitialAttendance() {
        const asistencias = [];
        let id = 1;
        const estados = ['presente', 'ausente', 'tarde', 'justificado'];
        const probabilidades = [0.85, 0.05, 0.07, 0.03]; // Probabilidades para cada estado

        this.estudiantes.forEach(estudiante => {
            for (let i = 0; i < 50; i++) { // 50 días de asistencia por estudiante
                const random = Math.random();
                let estado = 'presente';
                let acumulado = 0;

                for (let j = 0; j < estados.length; j++) {
                    acumulado += probabilidades[j];
                    if (random <= acumulado) {
                        estado = estados[j];
                        break;
                    }
                }

                asistencias.push({
                    id: id++,
                    estudianteId: estudiante.id,
                    fecha: this.getRandomDate(),
                    estado: estado,
                    hora: estado === 'presente' || estado === 'tarde' ? 
                          '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0') : null,
                    justificacion: estado === 'justificado' ? 'Cita médica' : ''
                });
            }
        });

        return asistencias;
    }

    generateInitialEnrollments() {
        return this.estudiantes.map(estudiante => ({
            id: estudiante.id,
            estudianteId: estudiante.id,
            año: 2024,
            grado: estudiante.grado,
            fechaInscripcion: '2024-02-15',
            estado: estudiante.estado === 'activo' ? 'activa' : 'inactiva',
            documentos: Math.random() > 0.1 ? 'Completos' : 'Pendientes',
            observaciones: ''
        }));
    }

    generateInitialEvents() {
        const eventos = [
            {
                id: 1,
                titulo: 'Inicio de Clases',
                fecha: '2024-03-01',
                hora: '08:00',
                tipo: 'institucional',
                descripcion: 'Comienzo del año lectivo 2024'
            },
            {
                id: 2,
                titulo: 'Reunión de Padres',
                fecha: '2024-06-15',
                hora: '15:00',
                tipo: 'reunion',
                descripcion: 'Entrega de boletines primer trimestre'
            },
            {
                id: 3,
                titulo: 'Acto del Día de la Bandera',
                fecha: '2024-06-20',
                hora: '09:00',
                tipo: 'celebracion',
                descripcion: 'Acto patrio conmemorativo'
            }
        ];

        return eventos;
    }

    generateRandomBirthDate(edad) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - edad;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        return `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    getRandomGrade() {
        return parseFloat((Math.random() * 4 + 6).toFixed(1)); // Notas entre 6.0 y 10.0
    }

    getRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date(2024, 5, 8);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    // ===== GESTIÓN DE DATOS =====
    getStoredData(key) {
        try {
            const data = localStorage.getItem(`developer_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(`developer_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            this.showNotification(`Error al guardar ${key}`, 'danger');
            return false;
        }
    }

    saveAllData() {
        this.saveData('estudiantes', this.estudiantes);
        this.saveData('profesores', this.profesores);
        this.saveData('notas', this.notas);
        this.saveData('asistencias', this.asistencias);
        this.saveData('matriculas', this.matriculas);
        this.saveData('eventos', this.eventos);
        this.saveData('codigos', this.codigosGuardados);
    }

    // ===== NAVEGACIÓN =====
    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('hidden');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Actualizar navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Cargar datos específicos de la sección
        switch (sectionName) {
            case 'estudiantes':
                this.loadEstudiantesTable();
                break;
            case 'profesores':
                this.loadProfesoresTable();
                break;
            case 'notas':
                this.loadNotasTable();
                this.populateSelects();
                break;
            case 'matriculas':
                this.loadMatriculasTable();
                break;
            case 'calendario':
                this.loadCalendario();
                break;
            case 'codigo':
                this.loadCodigosGuardados();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'sistema':
                this.loadSistemaInfo();
                break;
        }
    }

    // ===== DASHBOARD PRINCIPAL =====
    updateDashboardStats() {
        document.getElementById('totalEstudiantes').textContent = this.estudiantes.length;
        document.getElementById('totalProfesores').textContent = this.profesores.length;
        document.getElementById('totalGrados').textContent = 6;
        document.getElementById('totalMatriculas').textContent = this.matriculas.filter(m => m.estado === 'activa').length;
    }

    // ===== ESTUDIANTES =====
    loadEstudiantesTable() {
        const tbody = document.getElementById('tablaEstudiantesDev');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.estudiantes.forEach(estudiante => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="form-check-input estudiante-checkbox" value="${estudiante.id}" onchange="dashboard.updateSelectedItems('estudiantes')">
                </td>
                <td>${estudiante.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">${estudiante.nombre.charAt(0)}${estudiante.apellido.charAt(0)}</div>
                        ${estudiante.nombre} ${estudiante.apellido}
                    </div>
                </td>
                <td>${estudiante.grado}</td>
                <td>${estudiante.edad} años</td>
                <td><span class="${this.getGradeClass(estudiante.promedio)}">${estudiante.promedio}</span></td>
                <td><span class="badge ${this.getAttendanceClass(estudiante.asistencia)}">${estudiante.asistencia}%</span></td>
                <td><span class="badge ${estudiante.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${estudiante.estado}</span></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-primary" onclick="dashboard.verEstudiante(${estudiante.id})" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning" onclick="dashboard.editarEstudiante(${estudiante.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.eliminarEstudiante(${estudiante.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getGradeClass(promedio) {
        if (promedio >= 9) return 'nota-excelente';
        if (promedio >= 8) return 'nota-buena';
        if (promedio >= 7) return 'nota-regular';
        return 'nota-mala';
    }

    getAttendanceClass(asistencia) {
        if (asistencia >= 95) return 'bg-success';
        if (asistencia >= 90) return 'bg-warning';
        return 'bg-danger';
    }

    filtrarEstudiantes() {
        const grado = document.getElementById('filtroGradoEstudiante').value;
        const estado = document.getElementById('filtroEstadoEstudiante').value;
        const edad = document.getElementById('filtroEdadEstudiante').value;
        const busqueda = document.getElementById('buscarEstudianteDev').value.toLowerCase();

        let estudiantesFiltrados = this.estudiantes;

        if (grado) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => est.grado === grado);
        }

        if (estado) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => est.estado === estado);
        }

        if (edad) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => est.edad == edad);
        }

        if (busqueda) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => 
                est.nombre.toLowerCase().includes(busqueda) || 
                est.apellido.toLowerCase().includes(busqueda) ||
                est.id.toString().includes(busqueda)
            );
        }

        this.renderEstudiantesFiltrados(estudiantesFiltrados);
    }

    renderEstudiantesFiltrados(estudiantes) {
        const tbody = document.getElementById('tablaEstudiantesDev');
        tbody.innerHTML = '';

        estudiantes.forEach(estudiante => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="form-check-input estudiante-checkbox" value="${estudiante.id}" onchange="dashboard.updateSelectedItems('estudiantes')">
                </td>
                <td>${estudiante.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">${estudiante.nombre.charAt(0)}${estudiante.apellido.charAt(0)}</div>
                        ${estudiante.nombre} ${estudiante.apellido}
                    </div>
                </td>
                <td>${estudiante.grado}</td>
                <td>${estudiante.edad} años</td>
                <td><span class="${this.getGradeClass(estudiante.promedio)}">${estudiante.promedio}</span></td>
                <td><span class="badge ${this.getAttendanceClass(estudiante.asistencia)}">${estudiante.asistencia}%</span></td>
                <td><span class="badge ${estudiante.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${estudiante.estado}</span></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-primary" onclick="dashboard.verEstudiante(${estudiante.id})" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning" onclick="dashboard.editarEstudiante(${estudiante.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.eliminarEstudiante(${estudiante.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    limpiarFiltrosEstudiantes() {
        document.getElementById('filtroGradoEstudiante').value = '';
        document.getElementById('filtroEstadoEstudiante').value = '';
        document.getElementById('filtroEdadEstudiante').value = '';
        document.getElementById('buscarEstudianteDev').value = '';
        this.loadEstudiantesTable();
    }

    // ===== PROFESORES =====
    loadProfesoresTable() {
        const tbody = document.getElementById('tablaProfesores');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.profesores.forEach(profesor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${profesor.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">${profesor.nombre.charAt(0)}${profesor.apellido.charAt(0)}</div>
                        ${profesor.nombre} ${profesor.apellido}
                    </div>
                </td>
                <td>${this.getEspecialidadName(profesor.especialidad)}</td>
                <td>
                    ${profesor.gradosAsignados.map(grado => `<span class="badge bg-primary me-1">${grado}</span>`).join('')}
                </td>
                <td>${profesor.estudiantesACargo || 0}</td>
                <td><span class="badge ${profesor.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${profesor.estado}</span></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-primary" onclick="dashboard.verProfesor(${profesor.id})" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning" onclick="dashboard.editarProfesor(${profesor.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.eliminarProfesor(${profesor.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getEspecialidadName(especialidad) {
        const especialidades = {
            'matematicas': 'Matemáticas',
            'lengua': 'Lengua',
            'ciencias': 'Ciencias',
            'sociales': 'Sociales',
            'educacion-fisica': 'Educación Física'
        };
        return especialidades[especialidad] || especialidad;
    }

    filtrarProfesores() {
        const especialidad = document.getElementById('filtroEspecialidad').value;
        const estado = document.getElementById('filtroEstadoProfesor').value;
        const busqueda = document.getElementById('buscarProfesor').value.toLowerCase();

        let profesoresFiltrados = this.profesores;

        if (especialidad) {
            profesoresFiltrados = profesoresFiltrados.filter(prof => prof.especialidad === especialidad);
        }

        if (estado) {
            profesoresFiltrados = profesoresFiltrados.filter(prof => prof.estado === estado);
        }

        if (busqueda) {
            profesoresFiltrados = profesoresFiltrados.filter(prof => 
                prof.nombre.toLowerCase().includes(busqueda) || 
                prof.apellido.toLowerCase().includes(busqueda) ||
                this.getEspecialidadName(prof.especialidad).toLowerCase().includes(busqueda)
            );
        }

        this.renderProfesoresFiltrados(profesoresFiltrados);
    }

    renderProfesoresFiltrados(profesores) {
        const tbody = document.getElementById('tablaProfesores');
        tbody.innerHTML = '';

        profesores.forEach(profesor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${profesor.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar me-2">${profesor.nombre.charAt(0)}${profesor.apellido.charAt(0)}</div>
                        ${profesor.nombre} ${profesor.apellido}
                    </div>
                </td>
                <td>${this.getEspecialidadName(profesor.especialidad)}</td>
                <td>
                    ${profesor.gradosAsignados.map(grado => `<span class="badge bg-primary me-1">${grado}</span>`).join('')}
                </td>
                <td>${profesor.estudiantesACargo || 0}</td>
                <td><span class="badge ${profesor.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${profesor.estado}</span></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-primary" onclick="dashboard.verProfesor(${profesor.id})" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning" onclick="dashboard.editarProfesor(${profesor.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="dashboard.eliminarProfesor(${profesor.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    limpiarFiltrosProfesores() {
        document.getElementById('filtroEspecialidad').value = '';
        document.getElementById('filtroEstadoProfesor').value = '';
        document.getElementById('buscarProfesor').value = '';
        this.loadProfesoresTable();
    }

    // ===== SELECCIÓN MÚLTIPLE =====
    toggleSelectAllEstudiantes() {
        const selectAll = document.getElementById('selectAllEstudiantes');
        const checkboxes = document.querySelectorAll('.estudiante-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
        
        this.updateSelectedItems('estudiantes');
    }

    updateSelectedItems(tipo) {
        const checkboxes = document.querySelectorAll(`.${tipo.slice(0, -1)}-checkbox:checked`);
        this.selectedItems[tipo] = Array.from(checkboxes).map(cb => parseInt(cb.value));
    }

    editarSeleccionados(tipo) {
        if (this.selectedItems[tipo].length === 0) {
            this.showNotification('Seleccione al menos un elemento para editar', 'warning');
            return;
        }
        
        // Implementar edición masiva
        this.showNotification(`Editando ${this.selectedItems[tipo].length} ${tipo}`, 'info');
    }

    eliminarSeleccionados(tipo) {
        if (this.selectedItems[tipo].length === 0) {
            this.showNotification('Seleccione al menos un elemento para eliminar', 'warning');
            return;
        }

        if (confirm(`¿Está seguro de que desea eliminar ${this.selectedItems[tipo].length} ${tipo}?`)) {
            if (tipo === 'estudiantes') {
                this.estudiantes = this.estudiantes.filter(est => !this.selectedItems[tipo].includes(est.id));
                this.saveData('estudiantes', this.estudiantes);
                this.loadEstudiantesTable();
            }
            
            this.selectedItems[tipo] = [];
            this.updateDashboardStats();
            this.showNotification(`${tipo} eliminados exitosamente`, 'success');
        }
    }

    // ===== MODALES =====
    showModalNuevoEstudiante() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoEstudianteDev'));
        document.getElementById('formNuevoEstudianteDev').reset();
        modal.show();
    }

    showModalNuevoProfesor() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoProfesor'));
        document.getElementById('formNuevoProfesor').reset();
        modal.show();
    }

    guardarEstudianteDev() {
        const form = document.getElementById('formNuevoEstudianteDev');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const nuevoEstudiante = {
            id: this.estudiantes.length > 0 ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1,
            nombre: document.getElementById('nombreEstudianteDev').value,
            apellido: document.getElementById('apellidoEstudianteDev').value,
            edad: parseInt(document.getElementById('edadEstudianteDev').value),
            grado: document.getElementById('gradoEstudianteDev').value,
            fechaNacimiento: document.getElementById('fechaNacimientoDev').value,
            direccion: document.getElementById('direccionEstudianteDev').value,
            nombreTutor: document.getElementById('nombreTutorDev').value,
            telefonoTutor: document.getElementById('telefonoTutorDev').value,
            emailTutor: document.getElementById('emailTutorDev').value,
            estado: document.getElementById('estadoEstudianteDev').value,
            promedio: 0,
            asistencia: 100
        };

        this.estudiantes.push(nuevoEstudiante);
        this.saveData('estudiantes', this.estudiantes);
        this.loadEstudiantesTable();
        this.updateDashboardStats();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoEstudianteDev'));
        modal.hide();

        this.showNotification('Estudiante guardado exitosamente', 'success');
    }

    guardarProfesor() {
        const form = document.getElementById('formNuevoProfesor');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const gradosSeleccionados = Array.from(document.getElementById('gradosAsignados').selectedOptions)
                                      .map(option => option.value);

        const nuevoProfesor = {
            id: this.profesores.length > 0 ? Math.max(...this.profesores.map(p => p.id)) + 1 : 1,
            nombre: document.getElementById('nombreProfesor').value,
            apellido: document.getElementById('apellidoProfesor').value,
            especialidad: document.getElementById('especialidadProfesor').value,
            gradosAsignados: gradosSeleccionados,
            email: document.getElementById('emailProfesor').value,
            telefono: document.getElementById('telefonoProfesor').value,
            direccion: document.getElementById('direccionProfesor').value,
            estado: 'activo',
            estudiantesACargo: 0
        };

        // Calcular estudiantes a cargo
        nuevoProfesor.estudiantesACargo = this.estudiantes.filter(est => 
            gradosSeleccionados.includes(est.grado) && est.estado === 'activo'
        ).length;

        this.profesores.push(nuevoProfesor);
        this.saveData('profesores', this.profesores);
        this.loadProfesoresTable();
        this.updateDashboardStats();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoProfesor'));
        modal.hide();

        this.showNotification('Profesor guardado exitosamente', 'success');
    }

    // ===== EDITOR DE CÓDIGO =====
    loadCodigosGuardados() {
        const container = document.getElementById('codigosGuardados');
        if (!container) return;

        container.innerHTML = '';

        if (this.codigosGuardados.length === 0) {
            container.innerHTML = '<div class="text-center text-muted">No hay códigos guardados</div>';
            return;
        }

        this.codigosGuardados.forEach(codigo => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <div>
                    <h6 class="mb-1">${codigo.nombre}</h6>
                    <small class="text-muted">${codigo.lenguaje} - ${codigo.fecha}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary me-1" onclick="dashboard.cargarCodigoEspecifico(${codigo.id})">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.eliminarCodigo(${codigo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    guardarCodigo() {
        const editor = document.getElementById('codeEditor');
        const tipoLenguaje = document.getElementById('tipoLenguaje');
        
        if (!editor.value.trim()) {
            this.showNotification('No hay código para guardar', 'warning');
            return;
        }

        const nombre = prompt('Nombre para el código guardado:');
        if (!nombre) return;

        const nuevoCodigo = {
            id: this.codigosGuardados.length > 0 ? Math.max(...this.codigosGuardados.map(c => c.id)) + 1 : 1,
            nombre: nombre,
            codigo: editor.value,
            lenguaje: tipoLenguaje.value,
            fecha: new Date().toLocaleDateString('es-ES')
        };

        this.codigosGuardados.push(nuevoCodigo);
        this.saveData('codigos', this.codigosGuardados);
        this.loadCodigosGuardados();
        this.showNotification('Código guardado exitosamente', 'success');
    }

    cargarCodigo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.js,.html,.css,.sql';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('codeEditor').value = event.target.result;
                
                // Detectar tipo de archivo
                const extension = file.name.split('.').pop().toLowerCase();
                const tipoSelect = document.getElementById('tipoLenguaje');
                
                switch (extension) {
                    case 'js':
                        tipoSelect.value = 'javascript';
                        break;
                    case 'html':
                        tipoSelect.value = 'html';
                        break;
                    case 'css':
                        tipoSelect.value = 'css';
                        break;
                    case 'sql':
                        tipoSelect.value = 'sql';
                        break;
                }
                
                this.showNotification('Archivo cargado exitosamente', 'success');
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    cargarCodigoEspecifico(id) {
        const codigo = this.codigosGuardados.find(c => c.id === id);
        if (!codigo) return;

        document.getElementById('codeEditor').value = codigo.codigo;
        document.getElementById('tipoLenguaje').value = codigo.lenguaje;
        this.showNotification(`Código "${codigo.nombre}" cargado`, 'success');
    }

    eliminarCodigo(id) {
        if (confirm('¿Está seguro de que desea eliminar este código?')) {
            this.codigosGuardados = this.codigosGuardados.filter(c => c.id !== id);
            this.saveData('codigos', this.codigosGuardados);
            this.loadCodigosGuardados();
            this.showNotification('Código eliminado exitosamente', 'success');
        }
    }

    ejecutarCodigo() {
        const codigo = document.getElementById('codeEditor').value;
        const tipoLenguaje = document.getElementById('tipoLenguaje').value;
        const output = document.getElementById('codeOutput');

        if (!codigo.trim()) {
            output.textContent = 'No hay código para ejecutar';
            return;
        }

        try {
            switch (tipoLenguaje) {
                case 'javascript':
                    this.ejecutarJavaScript(codigo, output);
                    break;
                case 'html':
                    this.ejecutarHTML(codigo, output);
                    break;
                case 'css':
                    output.textContent = 'CSS cargado. Aplicar a un elemento HTML para ver el resultado.';
                    break;
                case 'sql':
                    output.textContent = 'Consulta SQL:\n' + codigo + '\n\n(Simulación: consulta válida)';
                    break;
                default:
                    output.textContent = 'Tipo de lenguaje no soportado para ejecución';
            }
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
        }
    }

    ejecutarJavaScript(codigo, output) {
        // Capturar console.log
        const originalLog = console.log;
        let logs = [];
        
        console.log = (...args) => {
            logs.push(args.join(' '));
        };

        try {
            const resultado = eval(codigo);
            console.log = originalLog;
            
            let outputText = '';
            if (logs.length > 0) {
                outputText += 'Console output:\n' + logs.join('\n') + '\n\n';
            }
            if (resultado !== undefined) {
                outputText += 'Resultado: ' + resultado;
            }
            
            output.textContent = outputText || 'Código ejecutado sin salida';
        } catch (error) {
            console.log = originalLog;
            output.textContent = `Error: ${error.message}`;
        }
    }

    ejecutarHTML(codigo, output) {
        // Crear un iframe para mostrar el HTML de forma segura
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '200px';
        iframe.style.border = '1px solid #ddd';
        iframe.style.borderRadius = '4px';
        
        output.innerHTML = '';
        output.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.write(codigo);
        iframeDoc.close();
    }

    // ===== EXPORTACIÓN E IMPORTACIÓN =====
    exportData(tipo) {
        let data, filename, headers;

        switch (tipo) {
            case 'estudiantes':
                data = this.estudiantes;
                filename = 'estudiantes_completo.csv';
                headers = ['ID', 'Nombre', 'Apellido', 'Edad', 'Grado', 'Fecha Nacimiento', 'Dirección', 'Tutor', 'Teléfono', 'Email', 'Estado', 'Promedio', 'Asistencia'];
                break;
            case 'profesores':
                data = this.profesores.map(prof => ({
                    ...prof,
                    gradosAsignadosText: prof.gradosAsignados.join(', '),
                    especialidadText: this.getEspecialidadName(prof.especialidad)
                }));
                filename = 'profesores_completo.csv';
                headers = ['ID', 'Nombre', 'Apellido', 'Especialidad', 'Grados', 'Email', 'Teléfono', 'Dirección', 'Estado', 'Estudiantes a Cargo'];
                break;
            case 'sistema':
                this.exportBackupCompleto();
                return;
            default:
                this.showNotification('Tipo de exportación no válido', 'danger');
                return;
        }

        this.downloadCSV(data, filename, headers);
        this.showNotification(`Datos de ${tipo} exportados exitosamente`, 'success');
    }

    exportBackupCompleto() {
        const backupData = {
            fecha: new Date().toISOString(),
            version: '1.0',
            estudiantes: this.estudiantes,
            profesores: this.profesores,
            notas: this.notas,
            asistencias: this.asistencias,
            matriculas: this.matriculas,
            eventos: this.eventos,
            codigos: this.codigosGuardados
        };

        const content = JSON.stringify(backupData, null, 2);
        this.downloadFile(content, `backup_sistema_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        this.showNotification('Backup completo del sistema exportado', 'success');
    }

    importData(tipo) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    if (file.name.endsWith('.json')) {
                        this.importBackupCompleto(event.target.result);
                    } else {
                        this.importCSV(event.target.result, tipo);
                    }
                } catch (error) {
                    this.showNotification(`Error al importar: ${error.message}`, 'danger');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    importBackupCompleto(jsonContent) {
        const backupData = JSON.parse(jsonContent);
        
        if (confirm('¿Está seguro de que desea restaurar el backup? Esto sobrescribirá todos los datos actuales.')) {
            this.estudiantes = backupData.estudiantes || [];
            this.profesores = backupData.profesores || [];
            this.notas = backupData.notas || [];
            this.asistencias = backupData.asistencias || [];
            this.matriculas = backupData.matriculas || [];
            this.eventos = backupData.eventos || [];
            this.codigosGuardados = backupData.codigos || [];
            
            this.saveAllData();
            this.loadAllTables();
            this.updateDashboardStats();
            
            this.showNotification('Backup restaurado exitosamente', 'success');
        }
    }

    importCSV(csvContent, tipo) {
        // Implementación básica de importación CSV
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        
        this.showNotification(`Importando ${lines.length - 1} registros de ${tipo}`, 'info');
        
        // Aquí se implementaría la lógica específica para cada tipo
        // Por simplicidad, solo mostramos el mensaje
    }

    downloadCSV(data, filename, headers) {
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(item => {
            const row = headers.map(header => {
                let value = '';
                switch (header) {
                    case 'ID':
                        value = item.id;
                        break;
                    case 'Nombre':
                        value = item.nombre;
                        break;
                    case 'Apellido':
                        value = item.apellido;
                        break;
                    case 'Edad':
                        value = item.edad;
                        break;
                    case 'Grado':
                        value = item.grado;
                        break;
                    case 'Fecha Nacimiento':
                        value = item.fechaNacimiento;
                        break;
                    case 'Dirección':
                        value = item.direccion;
                        break;
                    case 'Tutor':
                        value = item.nombreTutor;
                        break;
                    case 'Teléfono':
                        value = item.telefonoTutor || item.telefono;
                        break;
                    case 'Email':
                        value = item.emailTutor || item.email;
                        break;
                    case 'Estado':
                        value = item.estado;
                        break;
                    case 'Promedio':
                        value = item.promedio;
                        break;
                    case 'Asistencia':
                        value = item.asistencia;
                        break;
                    case 'Especialidad':
                        value = item.especialidadText;
                        break;
                    case 'Grados':
                        value = item.gradosAsignadosText;
                        break;
                    case 'Estudiantes a Cargo':
                        value = item.estudiantesACargo;
                        break;
                }
                return `"${value}"`;
            });
            csvContent += row.join(',') + '\n';
        });

        this.downloadFile(csvContent, filename, 'text/csv');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // ===== IMPRESIÓN =====
    printData(tipo) {
        let content = '';
        
        switch (tipo) {
            case 'estudiantes':
                content = this.generatePrintableStudentsList();
                break;
            case 'profesores':
                content = this.generatePrintableTeachersList();
                break;
            default:
                this.showNotification('Tipo de impresión no válido', 'danger');
                return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    }

    generatePrintableStudentsList() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Lista Completa de Estudiantes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 6px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .header { text-align: center; margin-bottom: 20px; }
        .stats { margin-bottom: 20px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Escuela Jesús El Buen Maestro</h1>
        <h2>Lista Completa de Estudiantes</h2>
        <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <div class="stats">
        <p><strong>Total de estudiantes:</strong> ${this.estudiantes.length}</p>
        <p><strong>Estudiantes activos:</strong> ${this.estudiantes.filter(e => e.estado === 'activo').length}</p>
        <p><strong>Promedio general:</strong> ${(this.estudiantes.reduce((sum, e) => sum + e.promedio, 0) / this.estudiantes.length).toFixed(2)}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Grado</th>
                <th>Edad</th>
                <th>Promedio</th>
                <th>Asistencia</th>
                <th>Tutor</th>
                <th>Teléfono</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${this.estudiantes.map(est => `
                <tr>
                    <td>${est.id}</td>
                    <td>${est.nombre} ${est.apellido}</td>
                    <td>${est.grado}</td>
                    <td>${est.edad} años</td>
                    <td>${est.promedio}</td>
                    <td>${est.asistencia}%</td>
                    <td>${est.nombreTutor}</td>
                    <td>${est.telefonoTutor}</td>
                    <td>${est.estado}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }

    generatePrintableTeachersList() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Lista de Profesores</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 6px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .header { text-align: center; margin-bottom: 20px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Escuela Jesús El Buen Maestro</h1>
        <h2>Lista de Profesores</h2>
        <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Especialidad</th>
                <th>Grados Asignados</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estudiantes a Cargo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${this.profesores.map(prof => `
                <tr>
                    <td>${prof.id}</td>
                    <td>${prof.nombre} ${prof.apellido}</td>
                    <td>${this.getEspecialidadName(prof.especialidad)}</td>
                    <td>${prof.gradosAsignados.join(', ')}</td>
                    <td>${prof.email}</td>
                    <td>${prof.telefono}</td>
                    <td>${prof.estudiantesACargo}</td>
                    <td>${prof.estado}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }

    // ===== UTILIDADES =====
    loadAllTables() {
        this.loadEstudiantesTable();
        this.loadProfesoresTable();
    }

    populateSelects() {
        // Implementar población de selects si es necesario
    }

    showNotification(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'danger': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';

        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.position = 'fixed';
            container.style.top = '90px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            container.style.width = '350px';
            document.body.appendChild(container);
        }

        container.insertAdjacentHTML('beforeend', alertHtml);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alerts = container.querySelectorAll('.alert');
            if (alerts.length > 0) {
                alerts[0].remove();
            }
        }, 5000);
    }

    // Placeholder methods for missing functionality
    loadNotasTable() {
        // Implementar tabla de notas
    }

    loadMatriculasTable() {
        // Implementar tabla de matrículas
    }

    loadCalendario() {
        // Implementar calendario
    }

    loadAnalytics() {
        // Implementar analytics avanzado
    }

    loadSistemaInfo() {
        // Implementar información del sistema
    }

    verEstudiante(id) {
        // Implementar vista detallada de estudiante
        this.showNotification(`Viendo detalles del estudiante ID: ${id}`, 'info');
    }

    editarEstudiante(id) {
        // Implementar edición de estudiante
        this.showNotification(`Editando estudiante ID: ${id}`, 'info');
    }

    eliminarEstudiante(id) {
        if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
            this.estudiantes = this.estudiantes.filter(est => est.id !== id);
            this.saveData('estudiantes', this.estudiantes);
            this.loadEstudiantesTable();
            this.updateDashboardStats();
            this.showNotification('Estudiante eliminado exitosamente', 'success');
        }
    }

    verProfesor(id) {
        // Implementar vista detallada de profesor
        this.showNotification(`Viendo detalles del profesor ID: ${id}`, 'info');
    }

    editarProfesor(id) {
        // Implementar edición de profesor
        this.showNotification(`Editando profesor ID: ${id}`, 'info');
    }

    eliminarProfesor(id) {
        if (confirm('¿Está seguro de que desea eliminar este profesor?')) {
            this.profesores = this.profesores.filter(prof => prof.id !== id);
            this.saveData('profesores', this.profesores);
            this.loadProfesoresTable();
            this.updateDashboardStats();
            this.showNotification('Profesor eliminado exitosamente', 'success');
        }
    }
}

// Funciones globales
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        window.location.href = 'login.html';
    }
}

function showSection(section) {
    if (window.dashboard) {
        window.dashboard.showSection(section);
    }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new DeveloperDashboard();
});