/**
 * Dashboard del Profesor - Sistema Completo
 * Con funcionalidades de guardado, exportación e impresión
 */

class ProfessorDashboard {
    constructor() {
        this.estudiantes = [];
        this.notas = [];
        this.asistencias = [];
        this.matriculas = [];
        this.eventos = [];
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Event listeners para navegación y funcionalidades
        document.addEventListener('DOMContentLoaded', () => {
            this.loadEstudiantesTable();
            this.loadNotasTable();
            this.populateSelects();
        });
    }

    loadInitialData() {
        // Cargar datos desde localStorage o crear datos iniciales
        this.estudiantes = this.getStoredData('estudiantes') || this.generateInitialStudents();
        this.notas = this.getStoredData('notas') || this.generateInitialGrades();
        this.asistencias = this.getStoredData('asistencias') || this.generateInitialAttendance();
        this.matriculas = this.getStoredData('matriculas') || this.generateInitialEnrollments();
        this.eventos = this.getStoredData('eventos') || this.generateInitialEvents();
        
        this.saveAllData();
        this.updateDashboardStats();
    }

    generateInitialStudents() {
        return [
            {
                id: 1,
                nombre: 'María',
                apellido: 'Pérez',
                edad: 8,
                grado: '3A',
                fechaNacimiento: '2015-03-15',
                direccion: 'Calle Falsa 123',
                nombreTutor: 'Jorge Pérez',
                telefonoTutor: '+54 11 1234-5678',
                estado: 'activo',
                promedio: 9.2,
                asistencia: 96
            },
            {
                id: 2,
                nombre: 'Juan',
                apellido: 'García',
                edad: 8,
                grado: '3A',
                fechaNacimiento: '2015-05-22',
                direccion: 'Avenida Principal 456',
                nombreTutor: 'Ana García',
                telefonoTutor: '+54 11 2345-6789',
                estado: 'activo',
                promedio: 8.5,
                asistencia: 88
            },
            {
                id: 3,
                nombre: 'Ana',
                apellido: 'Rodríguez',
                edad: 8,
                grado: '3A',
                fechaNacimiento: '2015-01-10',
                direccion: 'Calle Secundaria 789',
                nombreTutor: 'Carlos Rodríguez',
                telefonoTutor: '+54 11 3456-7890',
                estado: 'activo',
                promedio: 9.0,
                asistencia: 94
            },
            {
                id: 4,
                nombre: 'Luis',
                apellido: 'Martínez',
                edad: 8,
                grado: '3A',
                fechaNacimiento: '2015-07-08',
                direccion: 'Plaza Central 321',
                nombreTutor: 'María Martínez',
                telefonoTutor: '+54 11 4567-8901',
                estado: 'activo',
                promedio: 7.8,
                asistencia: 90
            },
            {
                id: 5,
                nombre: 'Sofia',
                apellido: 'López',
                edad: 8,
                grado: '3A',
                fechaNacimiento: '2015-09-12',
                direccion: 'Barrio Norte 654',
                nombreTutor: 'Pedro López',
                telefonoTutor: '+54 11 5678-9012',
                estado: 'activo',
                promedio: 8.9,
                asistencia: 92
            }
        ];
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
                        observaciones: '',
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

        this.estudiantes.forEach(estudiante => {
            for (let i = 0; i < 30; i++) {
                asistencias.push({
                    id: id++,
                    estudianteId: estudiante.id,
                    fecha: this.getRandomDate(),
                    estado: estados[Math.floor(Math.random() * 4)],
                    hora: '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0'),
                    justificacion: ''
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
            estado: 'activa',
            documentos: 'Completos'
        }));
    }

    generateInitialEvents() {
        return [
            {
                id: 1,
                titulo: 'Examen de Matemáticas',
                fecha: '2024-06-15',
                hora: '09:00',
                tipo: 'examen',
                descripcion: 'Examen del segundo trimestre'
            },
            {
                id: 2,
                titulo: 'Reunión de Padres',
                fecha: '2024-06-20',
                hora: '15:00',
                tipo: 'reunion',
                descripcion: 'Entrega de boletines'
            }
        ];
    }

    getRandomGrade() {
        return (Math.random() * 4 + 6).toFixed(1); // Notas entre 6.0 y 10.0
    }

    getRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date(2024, 5, 8);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    // ===== GESTIÓN DE DATOS =====
    getStoredData(key) {
        try {
            const data = localStorage.getItem(`professor_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(`professor_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            this.showNotification(`Error al guardar ${key}`, 'danger');
            return false;
        }
    }

    saveAllData() {
        this.saveData('estudiantes', this.estudiantes);
        this.saveData('notas', this.notas);
        this.saveData('asistencias', this.asistencias);
        this.saveData('matriculas', this.matriculas);
        this.saveData('eventos', this.eventos);
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
            case 'mis-estudiantes':
                this.loadEstudiantesTable();
                break;
            case 'notas':
                this.loadNotasTable();
                this.populateSelects();
                break;
            case 'asistencia':
                this.loadAsistenciaData();
                break;
            case 'matriculas':
                this.loadMatriculasData();
                break;
            case 'calendario':
                this.loadCalendario();
                break;
            case 'estadisticas':
                this.loadEstadisticas();
                break;
        }
    }

    // ===== DASHBOARD PRINCIPAL =====
    updateDashboardStats() {
        document.getElementById('totalEstudiantes').textContent = this.estudiantes.length;
        
        const promedioGeneral = this.estudiantes.reduce((sum, est) => sum + est.promedio, 0) / this.estudiantes.length;
        document.getElementById('promedioGeneral').textContent = promedioGeneral.toFixed(1);
        
        const asistenciaPromedio = this.estudiantes.reduce((sum, est) => sum + est.asistencia, 0) / this.estudiantes.length;
        document.getElementById('asistenciaPromedio').textContent = Math.round(asistenciaPromedio) + '%';
        
        const tareasPendientes = this.notas.filter(nota => nota.estado === 'pendiente').length;
        document.getElementById('tareasPendientes').textContent = tareasPendientes;
    }

    // ===== ESTUDIANTES =====
    loadEstudiantesTable() {
        const tbody = document.getElementById('tablaEstudiantes');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.estudiantes.forEach(estudiante => {
            const row = document.createElement('tr');
            row.innerHTML = `
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
                    <button class="btn btn-sm btn-primary me-1" onclick="dashboard.verEstudiante(${estudiante.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-1" onclick="dashboard.editarEstudiante(${estudiante.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.eliminarEstudiante(${estudiante.id})">
                        <i class="fas fa-trash"></i>
                    </button>
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
        const grado = document.getElementById('filtroGrado').value;
        const estado = document.getElementById('filtroEstado').value;
        const busqueda = document.getElementById('buscarEstudiante').value.toLowerCase();

        let estudiantesFiltrados = this.estudiantes;

        if (grado) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => est.grado === grado);
        }

        if (estado) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => est.estado === estado);
        }

        if (busqueda) {
            estudiantesFiltrados = estudiantesFiltrados.filter(est => 
                est.nombre.toLowerCase().includes(busqueda) || 
                est.apellido.toLowerCase().includes(busqueda)
            );
        }

        this.renderEstudiantesFiltrados(estudiantesFiltrados);
    }

    renderEstudiantesFiltrados(estudiantes) {
        const tbody = document.getElementById('tablaEstudiantes');
        tbody.innerHTML = '';

        estudiantes.forEach(estudiante => {
            const row = document.createElement('tr');
            row.innerHTML = `
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
                    <button class="btn btn-sm btn-primary me-1" onclick="dashboard.verEstudiante(${estudiante.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-1" onclick="dashboard.editarEstudiante(${estudiante.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.eliminarEstudiante(${estudiante.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    limpiarFiltros() {
        document.getElementById('filtroGrado').value = '';
        document.getElementById('filtroEstado').value = '';
        document.getElementById('buscarEstudiante').value = '';
        this.loadEstudiantesTable();
    }

    // ===== NOTAS =====
    loadNotasTable() {
        const tbody = document.getElementById('tablaNotas');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.notas.forEach(nota => {
            const estudiante = this.estudiantes.find(est => est.id === nota.estudianteId);
            if (!estudiante) return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${estudiante.nombre} ${estudiante.apellido}</td>
                <td>${this.getMateriaName(nota.materia)}</td>
                <td><span class="${this.getGradeClass(parseFloat(nota.nota))}">${nota.nota}</span></td>
                <td>${nota.periodo}° Trimestre</td>
                <td>${this.formatDate(nota.fecha)}</td>
                <td><span class="badge ${nota.estado === 'activa' ? 'bg-success' : 'bg-warning'}">${nota.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="dashboard.editarNota(${nota.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.eliminarNota(${nota.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getMateriaName(materia) {
        const materias = {
            'matematicas': 'Matemáticas',
            'lengua': 'Lengua',
            'ciencias': 'Ciencias',
            'sociales': 'Sociales',
            'educacion-fisica': 'Educación Física'
        };
        return materias[materia] || materia;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    populateSelects() {
        // Poblar select de estudiantes en modal de notas
        const selectEstudiante = document.getElementById('estudianteNota');
        const filtroEstudiante = document.getElementById('filtroEstudianteNota');
        
        if (selectEstudiante) {
            selectEstudiante.innerHTML = '<option value="">Seleccionar estudiante</option>';
            this.estudiantes.forEach(estudiante => {
                selectEstudiante.innerHTML += `<option value="${estudiante.id}">${estudiante.nombre} ${estudiante.apellido}</option>`;
            });
        }

        if (filtroEstudiante) {
            filtroEstudiante.innerHTML = '<option value="">Todos los estudiantes</option>';
            this.estudiantes.forEach(estudiante => {
                filtroEstudiante.innerHTML += `<option value="${estudiante.id}">${estudiante.nombre} ${estudiante.apellido}</option>`;
            });
        }
    }

    filtrarNotas() {
        const estudianteId = document.getElementById('filtroEstudianteNota').value;
        const materia = document.getElementById('filtroMateria').value;
        const periodo = document.getElementById('filtroPeriodo').value;

        let notasFiltradas = this.notas;

        if (estudianteId) {
            notasFiltradas = notasFiltradas.filter(nota => nota.estudianteId == estudianteId);
        }

        if (materia) {
            notasFiltradas = notasFiltradas.filter(nota => nota.materia === materia);
        }

        if (periodo) {
            notasFiltradas = notasFiltradas.filter(nota => nota.periodo == periodo);
        }

        this.renderNotasFiltradas(notasFiltradas);
    }

    renderNotasFiltradas(notas) {
        const tbody = document.getElementById('tablaNotas');
        tbody.innerHTML = '';

        notas.forEach(nota => {
            const estudiante = this.estudiantes.find(est => est.id === nota.estudianteId);
            if (!estudiante) return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${estudiante.nombre} ${estudiante.apellido}</td>
                <td>${this.getMateriaName(nota.materia)}</td>
                <td><span class="${this.getGradeClass(parseFloat(nota.nota))}">${nota.nota}</span></td>
                <td>${nota.periodo}° Trimestre</td>
                <td>${this.formatDate(nota.fecha)}</td>
                <td><span class="badge ${nota.estado === 'activa' ? 'bg-success' : 'bg-warning'}">${nota.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="dashboard.editarNota(${nota.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.eliminarNota(${nota.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    limpiarFiltrosNotas() {
        document.getElementById('filtroEstudianteNota').value = '';
        document.getElementById('filtroMateria').value = '';
        document.getElementById('filtroPeriodo').value = '';
        this.loadNotasTable();
    }

    // ===== MODALES =====
    showModalNuevoEstudiante() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoEstudiante'));
        document.getElementById('formNuevoEstudiante').reset();
        modal.show();
    }

    showModalNuevaNota() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevaNota'));
        document.getElementById('formNuevaNota').reset();
        this.populateSelects();
        modal.show();
    }

    guardarEstudiante() {
        const form = document.getElementById('formNuevoEstudiante');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const nuevoEstudiante = {
            id: this.estudiantes.length > 0 ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1,
            nombre: document.getElementById('nombreEstudiante').value,
            apellido: document.getElementById('apellidoEstudiante').value,
            edad: parseInt(document.getElementById('edadEstudiante').value),
            grado: document.getElementById('gradoEstudiante').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            direccion: document.getElementById('direccionEstudiante').value,
            nombreTutor: document.getElementById('nombreTutor').value,
            telefonoTutor: document.getElementById('telefonoTutor').value,
            estado: 'activo',
            promedio: 0,
            asistencia: 100
        };

        this.estudiantes.push(nuevoEstudiante);
        this.saveData('estudiantes', this.estudiantes);
        this.loadEstudiantesTable();
        this.updateDashboardStats();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoEstudiante'));
        modal.hide();

        this.showNotification('Estudiante guardado exitosamente', 'success');
    }

    guardarNota() {
        const form = document.getElementById('formNuevaNota');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const nuevaNota = {
            id: this.notas.length > 0 ? Math.max(...this.notas.map(n => n.id)) + 1 : 1,
            estudianteId: parseInt(document.getElementById('estudianteNota').value),
            materia: document.getElementById('materiaNota').value,
            nota: parseFloat(document.getElementById('valorNota').value),
            periodo: parseInt(document.getElementById('periodoNota').value),
            fecha: new Date().toISOString().split('T')[0],
            observaciones: document.getElementById('observacionesNota').value,
            estado: 'activa'
        };

        this.notas.push(nuevaNota);
        this.saveData('notas', this.notas);
        this.loadNotasTable();
        this.updateStudentAverages();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaNota'));
        modal.hide();

        this.showNotification('Nota guardada exitosamente', 'success');
    }

    updateStudentAverages() {
        this.estudiantes.forEach(estudiante => {
            const notasEstudiante = this.notas.filter(nota => nota.estudianteId === estudiante.id);
            if (notasEstudiante.length > 0) {
                const promedio = notasEstudiante.reduce((sum, nota) => sum + nota.nota, 0) / notasEstudiante.length;
                estudiante.promedio = parseFloat(promedio.toFixed(1));
            }
        });
        this.saveData('estudiantes', this.estudiantes);
        this.updateDashboardStats();
    }

    // ===== EXPORTACIÓN E IMPRESIÓN =====
    exportData(tipo) {
        let data, filename, headers;

        switch (tipo) {
            case 'estudiantes':
                data = this.estudiantes;
                filename = 'estudiantes.csv';
                headers = ['ID', 'Nombre', 'Apellido', 'Edad', 'Grado', 'Promedio', 'Asistencia', 'Estado'];
                break;
            case 'notas':
                data = this.notas.map(nota => {
                    const estudiante = this.estudiantes.find(est => est.id === nota.estudianteId);
                    return {
                        ...nota,
                        nombreEstudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'N/A',
                        materiaNombre: this.getMateriaName(nota.materia)
                    };
                });
                filename = 'notas.csv';
                headers = ['ID', 'Estudiante', 'Materia', 'Nota', 'Período', 'Fecha', 'Estado'];
                break;
            case 'general':
                this.exportGeneralReport();
                return;
            default:
                this.showNotification('Tipo de exportación no válido', 'danger');
                return;
        }

        this.downloadCSV(data, filename, headers);
        this.showNotification(`Datos de ${tipo} exportados exitosamente`, 'success');
    }

    exportGeneralReport() {
        const reportData = {
            fecha: new Date().toLocaleDateString('es-ES'),
            totalEstudiantes: this.estudiantes.length,
            promedioGeneral: (this.estudiantes.reduce((sum, est) => sum + est.promedio, 0) / this.estudiantes.length).toFixed(2),
            asistenciaPromedio: Math.round(this.estudiantes.reduce((sum, est) => sum + est.asistencia, 0) / this.estudiantes.length),
            estudiantes: this.estudiantes,
            notasRecientes: this.notas.slice(-10)
        };

        const content = this.generateReportHTML(reportData);
        this.downloadFile(content, 'reporte-general.html', 'text/html');
        this.showNotification('Reporte general exportado exitosamente', 'success');
    }

    generateReportHTML(data) {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte General - Profesor</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
        .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte General del Profesor</h1>
        <p>Fecha: ${data.fecha}</p>
    </div>
    <div class="stats">
        <div class="stat-card">
            <h3>${data.totalEstudiantes}</h3>
            <p>Total Estudiantes</p>
        </div>
        <div class="stat-card">
            <h3>${data.promedioGeneral}</h3>
            <p>Promedio General</p>
        </div>
        <div class="stat-card">
            <h3>${data.asistenciaPromedio}%</h3>
            <p>Asistencia Promedio</p>
        </div>
    </div>
    <h2>Lista de Estudiantes</h2>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Grado</th>
                <th>Promedio</th>
                <th>Asistencia</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${data.estudiantes.map(est => `
                <tr>
                    <td>${est.nombre} ${est.apellido}</td>
                    <td>${est.grado}</td>
                    <td>${est.promedio}</td>
                    <td>${est.asistencia}%</td>
                    <td>${est.estado}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
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
                    case 'Promedio':
                        value = item.promedio;
                        break;
                    case 'Asistencia':
                        value = item.asistencia;
                        break;
                    case 'Estado':
                        value = item.estado;
                        break;
                    case 'Estudiante':
                        value = item.nombreEstudiante;
                        break;
                    case 'Materia':
                        value = item.materiaNombre;
                        break;
                    case 'Nota':
                        value = item.nota;
                        break;
                    case 'Período':
                        value = item.periodo;
                        break;
                    case 'Fecha':
                        value = item.fecha;
                        break;
                }
                return value;
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

    printData(tipo) {
        let content = '';
        
        switch (tipo) {
            case 'estudiantes':
                content = this.generatePrintableStudentsList();
                break;
            case 'notas':
                content = this.generatePrintableGradesList();
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
    <title>Lista de Estudiantes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lista de Estudiantes</h1>
        <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Grado</th>
                <th>Edad</th>
                <th>Promedio</th>
                <th>Asistencia</th>
            </tr>
        </thead>
        <tbody>
            ${this.estudiantes.map(est => `
                <tr>
                    <td>${est.nombre} ${est.apellido}</td>
                    <td>${est.grado}</td>
                    <td>${est.edad} años</td>
                    <td>${est.promedio}</td>
                    <td>${est.asistencia}%</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }

    generatePrintableGradesList() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Registro de Notas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Registro de Notas</h1>
        <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Estudiante</th>
                <th>Materia</th>
                <th>Nota</th>
                <th>Período</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            ${this.notas.map(nota => {
                const estudiante = this.estudiantes.find(est => est.id === nota.estudianteId);
                return `
                    <tr>
                        <td>${estudiante ? estudiante.nombre + ' ' + estudiante.apellido : 'N/A'}</td>
                        <td>${this.getMateriaName(nota.materia)}</td>
                        <td>${nota.nota}</td>
                        <td>${nota.periodo}° Trimestre</td>
                        <td>${this.formatDate(nota.fecha)}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }

    // ===== UTILIDADES =====
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
    loadAsistenciaData() {
        // Implementar carga de datos de asistencia
    }

    loadMatriculasData() {
        // Implementar carga de datos de matrículas
    }

    loadCalendario() {
        // Implementar calendario
    }

    loadEstadisticas() {
        // Implementar estadísticas
    }

    verEstudiante(id) {
        // Implementar vista de estudiante
    }

    editarEstudiante(id) {
        // Implementar edición de estudiante
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

    editarNota(id) {
        // Implementar edición de nota
    }

    eliminarNota(id) {
        if (confirm('¿Está seguro de que desea eliminar esta nota?')) {
            this.notas = this.notas.filter(nota => nota.id !== id);
            this.saveData('notas', this.notas);
            this.loadNotasTable();
            this.updateStudentAverages();
            this.showNotification('Nota eliminada exitosamente', 'success');
        }
    }
}
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        // Limpiar datos de sesión (localStorage, cookies, etc.)
        localStorage.removeItem('token'); // Ejemplo: Elimina un token guardado
        sessionStorage.clear(); // Limpia toda la sessionStorage
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Borra cookies

        // Redirigir al login (con retraso opcional para mejor experiencia)
        setTimeout(() => {
            window.location.href = './login.html'; // Cambia a la URL de tu página de login
        }, 500); // Medio segundo antes de redirigir (opcional)
    }
}

// Función global para navegación
function showSection(section) {
    if (window.dashboard) {
        window.dashboard.showSection(section);
    }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new ProfessorDashboard();
});