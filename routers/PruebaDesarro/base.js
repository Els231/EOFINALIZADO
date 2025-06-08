/**
 * Sistema de base de datos en memoria usando localStorage
 * Proporciona funcionalidades CRUD para todas las entidades del sistema
 */

class Database {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar colecciones si no existen
        if (!localStorage.getItem('estudiantes')) {
            localStorage.setItem('estudiantes', JSON.stringify([]));
        }
        if (!localStorage.getItem('profesores')) {
            localStorage.setItem('profesores', JSON.stringify([]));
        }
        if (!localStorage.getItem('notas')) {
            localStorage.setItem('notas', JSON.stringify([]));
        }
        if (!localStorage.getItem('matriculas')) {
            localStorage.setItem('matriculas', JSON.stringify([]));
        }
        if (!localStorage.getItem('eventos')) {
            localStorage.setItem('eventos', JSON.stringify([]));
        }
        if (!localStorage.getItem('cursos')) {
            localStorage.setItem('cursos', JSON.stringify([
                { id: 1, nombre: 'Matemáticas', grado: 1 },
                { id: 2, nombre: 'Español', grado: 1 },
                { id: 3, nombre: 'Ciencias', grado: 1 },
                { id: 4, nombre: 'Matemáticas', grado: 2 },
                { id: 5, nombre: 'Español', grado: 2 },
                { id: 6, nombre: 'Ciencias', grado: 2 },
                { id: 7, nombre: 'Matemáticas', grado: 3 },
                { id: 8, nombre: 'Español', grado: 3 },
                { id: 9, nombre: 'Ciencias', grado: 3 },
                { id: 10, nombre: 'Historia', grado: 3 },
                { id: 11, nombre: 'Matemáticas', grado: 4 },
                { id: 12, nombre: 'Español', grado: 4 },
                { id: 13, nombre: 'Ciencias', grado: 4 },
                { id: 14, nombre: 'Historia', grado: 4 },
                { id: 15, nombre: 'Inglés', grado: 4 },
                { id: 16, nombre: 'Matemáticas', grado: 5 },
                { id: 17, nombre: 'Español', grado: 5 },
                { id: 18, nombre: 'Ciencias', grado: 5 },
                { id: 19, nombre: 'Historia', grado: 5 },
                { id: 20, nombre: 'Inglés', grado: 5 }
            ]));
        }
        if (!localStorage.getItem('grados')) {
            localStorage.setItem('grados', JSON.stringify([
                { id: 1, nombre: 'Primer Grado', nivel: 'Primaria' },
                { id: 2, nombre: 'Segundo Grado', nivel: 'Primaria' },
                { id: 3, nombre: 'Tercer Grado', nivel: 'Primaria' },
                { id: 4, nombre: 'Cuarto Grado', nivel: 'Primaria' },
                { id: 5, nombre: 'Quinto Grado', nivel: 'Primaria' }
            ]));
        }
    }

    // Métodos genéricos para cualquier colección
    getAll(collection) {
        try {
            return JSON.parse(localStorage.getItem(collection) || '[]');
        } catch (error) {
            console.error(`Error al obtener ${collection}:`, error);
            return [];
        }
    }

    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === parseInt(id));
    }

    insert(collection, item) {
        try {
            const items = this.getAll(collection);
            const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
            const newItem = { ...item, id: newId };
            items.push(newItem);
            localStorage.setItem(collection, JSON.stringify(items));
            return newItem;
        } catch (error) {
            console.error(`Error al insertar en ${collection}:`, error);
            throw error;
        }
    }

    update(collection, id, updatedItem) {
        try {
            const items = this.getAll(collection);
            const index = items.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                items[index] = { ...items[index], ...updatedItem };
                localStorage.setItem(collection, JSON.stringify(items));
                return items[index];
            }
            throw new Error(`Item con ID ${id} no encontrado en ${collection}`);
        } catch (error) {
            console.error(`Error al actualizar en ${collection}:`, error);
            throw error;
        }
    }

    delete(collection, id) {
        try {
            const items = this.getAll(collection);
            const filteredItems = items.filter(item => item.id !== parseInt(id));
            if (filteredItems.length === items.length) {
                throw new Error(`Item con ID ${id} no encontrado en ${collection}`);
            }
            localStorage.setItem(collection, JSON.stringify(filteredItems));
            return true;
        } catch (error) {
            console.error(`Error al eliminar de ${collection}:`, error);
            throw error;
        }
    }

    // Métodos específicos para estudiantes
    getEstudiantes() {
        return this.getAll('estudiantes');
    }

    getEstudianteById(id) {
        return this.getById('estudiantes', id);
    }

    insertEstudiante(estudiante) {
        return this.insert('estudiantes', {
            ...estudiante,
            fechaRegistro: new Date().toISOString()
        });
    }

    updateEstudiante(id, estudiante) {
        return this.update('estudiantes', id, estudiante);
    }

    deleteEstudiante(id) {
        return this.delete('estudiantes', id);
    }

    // Métodos específicos para profesores
    getProfesores() {
        return this.getAll('profesores');
    }

    getProfesorById(id) {
        return this.getById('profesores', id);
    }

    insertProfesor(profesor) {
        return this.insert('profesores', {
            ...profesor,
            fechaRegistro: new Date().toISOString()
        });
    }

    updateProfesor(id, profesor) {
        return this.update('profesores', id, profesor);
    }

    deleteProfesor(id) {
        return this.delete('profesores', id);
    }

    // Métodos específicos para notas
    getNotas() {
        return this.getAll('notas');
    }

    getNotaById(id) {
        return this.getById('notas', id);
    }

    getNotasByEstudiante(estudianteId) {
        return this.getAll('notas').filter(nota => nota.estudianteId === parseInt(estudianteId));
    }

    insertNota(nota) {
        return this.insert('notas', {
            ...nota,
            fechaRegistro: new Date().toISOString()
        });
    }

    updateNota(id, nota) {
        return this.update('notas', id, nota);
    }

    deleteNota(id) {
        return this.delete('notas', id);
    }

    // Métodos específicos para matrículas
    getMatriculas() {
        return this.getAll('matriculas');
    }

    getMatriculaById(id) {
        return this.getById('matriculas', id);
    }

    insertMatricula(matricula) {
        return this.insert('matriculas', {
            ...matricula,
            fechaMatricula: new Date().toISOString(),
            estado: 'Activa'
        });
    }

    updateMatricula(id, matricula) {
        return this.update('matriculas', id, matricula);
    }

    deleteMatricula(id) {
        return this.delete('matriculas', id);
    }

    // Métodos específicos para eventos
    getEventos() {
        return this.getAll('eventos');
    }

    getEventoById(id) {
        return this.getById('eventos', id);
    }

    insertEvento(evento) {
        return this.insert('eventos', evento);
    }

    updateEvento(id, evento) {
        return this.update('eventos', id, evento);
    }

    deleteEvento(id) {
        return this.delete('eventos', id);
    }

    // Métodos para obtener datos de referencia
    getCursos() {
        return this.getAll('cursos');
    }

    getGrados() {
        return this.getAll('grados');
    }

    getCursosByGrado(grado) {
        return this.getAll('cursos').filter(curso => curso.grado === parseInt(grado));
    }

    // Métodos para estadísticas y analytics
    getEstadisticas() {
        const estudiantes = this.getEstudiantes();
        const profesores = this.getProfesores();
        const matriculas = this.getMatriculas();
        const eventos = this.getEventos();
        const notas = this.getNotas();

        const hoy = new Date().toDateString();
        const eventosHoy = eventos.filter(evento => 
            new Date(evento.start).toDateString() === hoy
        ).length;

        return {
            totalEstudiantes: estudiantes.length,
            totalProfesores: profesores.length,
            totalMatriculas: matriculas.filter(m => m.estado === 'Activa').length,
            eventosHoy: eventosHoy,
            promedioGeneral: this.calcularPromedioGeneral(notas),
            distribucionGrados: this.getDistribucionGrados(estudiantes)
        };
    }

    calcularPromedioGeneral(notas) {
        if (notas.length === 0) return 0;
        const suma = notas.reduce((acc, nota) => acc + parseFloat(nota.calificacion), 0);
        return (suma / notas.length).toFixed(2);
    }

    getDistribucionGrados(estudiantes) {
        const distribucion = {};
        estudiantes.forEach(estudiante => {
            const grado = estudiante.grado || 'Sin asignar';
            distribucion[grado] = (distribucion[grado] || 0) + 1;
        });
        return distribucion;
    }

    // Método para exportar datos
    exportarDatos() {
        return {
            estudiantes: this.getEstudiantes(),
            profesores: this.getProfesores(),
            notas: this.getNotas(),
            matriculas: this.getMatriculas(),
            eventos: this.getEventos(),
            cursos: this.getCursos(),
            grados: this.getGrados(),
            exportDate: new Date().toISOString()
        };
    }

    // Método para importar datos
    importarDatos(data) {
        try {
            Object.keys(data).forEach(key => {
                if (key !== 'exportDate' && Array.isArray(data[key])) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            });
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }

    // Método para limpiar datos (útil para testing)
    limpiarDatos() {
        const colecciones = ['estudiantes', 'profesores', 'notas', 'matriculas', 'eventos'];
        colecciones.forEach(coleccion => {
            localStorage.setItem(coleccion, JSON.stringify([]));
        });
    }
}

// Crear instancia global de la base de datos
const db = new Database();
