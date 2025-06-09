// ===== SISTEMA DE ALMACENAMIENTO LOCAL =====

class Storage {
    static get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error al obtener datos del localStorage:', error);
            return null;
        }
    }

    static set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error al guardar datos en localStorage:', error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar datos del localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
            return false;
        }
    }

    // Métodos específicos para cada entidad
    static getStudents() {
        return this.get('students') || [];
    }

    static setStudents(students) {
        return this.set('students', students);
    }

    static getGrades() {
        return this.get('grades') || [];
    }

    static setGrades(grades) {
        return this.set('grades', grades);
    }

    static getAttendance() {
        return this.get('attendance') || [];
    }

    static setAttendance(attendance) {
        return this.set('attendance', attendance);
    }

    static getEnrollments() {
        return this.get('enrollments') || [];
    }

    static setEnrollments(enrollments) {
        return this.set('enrollments', enrollments);
    }

    static getEvents() {
        return this.get('events') || [];
    }

    static setEvents(events) {
        return this.set('events', events);
    }

    static getActivities() {
        return this.get('activities') || [];
    }

    static setActivities(activities) {
        return this.set('activities', activities);
    }

    // Método para generar IDs únicos
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Método para agregar actividad reciente
    static addActivity(activity) {
        const activities = this.getActivities();
        activities.unshift({
            id: this.generateId(),
            ...activity,
            timestamp: new Date().toISOString()
        });
        
        // Mantener solo las últimas 50 actividades
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        this.setActivities(activities);
    }
}
