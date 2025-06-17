/**
 * Utilidades generales para el sistema escolar
 * Funciones auxiliares, validaciones y formateo
 */

// ===== FORMATEO DE FECHAS =====

function formatDate(dateString, includeTime = false) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
    }
}

function formatDateShort(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error al formatear fecha corta:', error);
        return dateString;
    }
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error al formatear fecha y hora:', error);
        return dateString;
    }
}

// ===== VALIDACIONES =====

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Formato dominicano: 809-000-0000 o variaciones
    const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
}

function validateCedula(cedula) {
    // Formato dominicano: 000-0000000-0
    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
    return cedulaRegex.test(cedula);
}

function validateRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

function validateNumeric(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

function validateDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

function validateGrade(grade) {
    const validGrades = ['1', '2', '3', '4', '5', '6'];
    return validGrades.includes(grade.toString());
}

function validateAge(birthDate, minAge = 5, maxAge = 18) {
    const age = calculateAge(birthDate);
    return age >= minAge && age <= maxAge;
}

// ===== GENERADORES =====

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateCode(prefix = '', length = 6) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = prefix;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateStudentCode(grado, turno) {
    const year = new Date().getFullYear().toString().slice(-2);
    const gradeCode = grado.toString().padStart(2, '0');
    const turnoCode = turno === 'Matutino' ? 'M' : 'V';
    const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${year}${gradeCode}${turnoCode}${randomNum}`;
}

// ===== CÁLCULOS =====

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    
    try {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    } catch (error) {
        console.error('Error al calcular edad:', error);
        return 0;
    }
}

function calculateGPA(notas) {
    if (!Array.isArray(notas) || notas.length === 0) return 0;
    
    const validNotas = notas.filter(nota => 
        typeof nota === 'number' && nota >= 0 && nota <= 100
    );
    
    if (validNotas.length === 0) return 0;
    
    const suma = validNotas.reduce((acc, nota) => acc + nota, 0);
    return Math.round((suma / validNotas.length) * 100) / 100;
}

function calculateAttendancePercentage(presente, total) {
    if (total === 0) return 0;
    return Math.round((presente / total) * 100);
}

// ===== FORMATEO DE DATOS =====

function formatCurrency(amount, currency = 'DOP') {
    try {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: currency
        }).format(amount);
    } catch (error) {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

function formatNumber(number, decimals = 0) {
    try {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    } catch (error) {
        return number.toFixed(decimals);
    }
}

function formatPercentage(value) {
    return `${Math.round(value)}%`;
}

function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remover caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formato dominicano
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
}

function formatCedula(cedula) {
    if (!cedula) return '';
    
    // Remover caracteres no numéricos
    const cleaned = cedula.replace(/\D/g, '');
    
    // Formato dominicano: 000-0000000-0
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 10)}-${cleaned.slice(10)}`;
    }
    
    return cedula;
}

// ===== MANEJO DE ARRAYS Y OBJETOS =====

function sortArray(array, key, ascending = true) {
    return [...array].sort((a, b) => {
        const aVal = getNestedValue(a, key);
        const bVal = getNestedValue(b, key);
        
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
}

function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const group = getNestedValue(item, key);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

function uniqueBy(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const value = getNestedValue(item, key);
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

// ===== EXPORTACIÓN DE DATOS =====

function exportToExcel(data, filename, sheetName = 'Datos') {
    try {
        if (!window.XLSX) {
            throw new Error('Librería XLSX no disponible');
        }
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `${filename}_${today}.xlsx`);
        
        // Registrar exportación en logs
        if (window.db) {
            window.db.logAction('export', 'excel', filename, `${data.length} registros`);
        }
        
        return true;
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        if (window.showGlobalAlert) {
            window.showGlobalAlert('Error al exportar archivo Excel', 'error');
        }
        return false;
    }
}

function exportToCSV(data, filename) {
    try {
        if (data.length === 0) {
            throw new Error('No hay datos para exportar');
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => 
                    `"${(row[header] || '').toString().replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Registrar exportación en logs
        if (window.db) {
            window.db.logAction('export', 'csv', filename, `${data.length} registros`);
        }
        
        return true;
    } catch (error) {
        console.error('Error al exportar a CSV:', error);
        if (window.showGlobalAlert) {
            window.showGlobalAlert('Error al exportar archivo CSV', 'error');
        }
        return false;
    }
}

// ===== BÚSQUEDA Y FILTRADO =====

function searchInText(text, query) {
    if (!text || !query) return false;
    return text.toString().toLowerCase().includes(query.toLowerCase());
}

function filterByMultipleFields(data, query, fields) {
    if (!query) return data;
    
    return data.filter(item => 
        fields.some(field => 
            searchInText(getNestedValue(item, field), query)
        )
    );
}

function applyFilters(data, filters) {
    return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === '' || value === null || value === undefined) return true;
            
            const itemValue = getNestedValue(item, key);
            
            // Filtro exacto para la mayoría de casos
            if (typeof value === 'string' && typeof itemValue === 'string') {
                return itemValue.toLowerCase().includes(value.toLowerCase());
            }
            
            return itemValue === value;
        });
    });
}

// ===== PAGINACIÓN =====

function paginate(data, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
        data: data.slice(startIndex, endIndex),
        totalPages: Math.ceil(data.length / itemsPerPage),
        currentPage: page,
        totalItems: data.length,
        hasNext: endIndex < data.length,
        hasPrev: page > 1
    };
}

// ===== VALIDACIÓN DE FORMULARIOS =====

function validateFormData(formData, rules) {
    const errors = [];
    
    Object.entries(rules).forEach(([field, rule]) => {
        const value = formData[field];
        
        // Campo requerido
        if (rule.required && !validateRequired(value)) {
            errors.push(`${rule.label || field} es requerido`);
            return;
        }
        
        // Validar solo si hay valor
        if (value) {
            // Validar email
            if (rule.type === 'email' && !validateEmail(value)) {
                errors.push(`${rule.label || field} debe ser un email válido`);
            }
            
            // Validar teléfono
            if (rule.type === 'phone' && !validatePhone(value)) {
                errors.push(`${rule.label || field} debe ser un teléfono válido`);
            }
            
            // Validar cédula
            if (rule.type === 'cedula' && !validateCedula(value)) {
                errors.push(`${rule.label || field} debe ser una cédula válida (000-0000000-0)`);
            }
            
            // Validar número
            if (rule.type === 'number' && !validateNumeric(value, rule.min, rule.max)) {
                errors.push(`${rule.label || field} debe ser un número válido`);
            }
            
            // Validar fecha
            if (rule.type === 'date' && !validateDate(value)) {
                errors.push(`${rule.label || field} debe ser una fecha válida`);
            }
            
            // Validar longitud mínima
            if (rule.minLength && value.toString().length < rule.minLength) {
                errors.push(`${rule.label || field} debe tener al menos ${rule.minLength} caracteres`);
            }
            
            // Validar longitud máxima
            if (rule.maxLength && value.toString().length > rule.maxLength) {
                errors.push(`${rule.label || field} no debe superar ${rule.maxLength} caracteres`);
            }
        }
    });
    
    return errors;
}

// ===== UTILIDADES DE ESTADO =====

function getStatusBadge(status) {
    const statusMap = {
        'Activo': 'success',
        'Inactivo': 'secondary',
        'Pendiente': 'warning',
        'Aprobado': 'success',
        'Rechazado': 'danger',
        'En Proceso': 'info',
        'Completado': 'success',
        'Cancelado': 'danger'
    };
    
    const badgeClass = statusMap[status] || 'secondary';
    return `<span class="badge bg-${badgeClass}">${status}</span>`;
}

function getGradeColor(grade) {
    const gradeColors = {
        '1': '#FF6B6B',
        '2': '#4ECDC4', 
        '3': '#45B7D1',
        '4': '#96CEB4',
        '5': '#FFEAA7',
        '6': '#DDA0DD'
    };
    
    return gradeColors[grade.toString()] || '#6C757D';
}

// ===== DEBOUNCE Y THROTTLE =====

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exportar todas las funciones
window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.formatDateTime = formatDateTime;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateCedula = validateCedula;
window.validateRequired = validateRequired;
window.validateNumeric = validateNumeric;
window.validateDate = validateDate;
window.validateGrade = validateGrade;
window.validateAge = validateAge;
window.generateId = generateId;
window.generateCode = generateCode;
window.generateStudentCode = generateStudentCode;
window.calculateAge = calculateAge;
window.calculateGPA = calculateGPA;
window.calculateAttendancePercentage = calculateAttendancePercentage;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.formatPhoneNumber = formatPhoneNumber;
window.formatCedula = formatCedula;
window.sortArray = sortArray;
window.getNestedValue = getNestedValue;
window.groupBy = groupBy;
window.uniqueBy = uniqueBy;
window.exportToExcel = exportToExcel;
window.exportToCSV = exportToCSV;
window.searchInText = searchInText;
window.filterByMultipleFields = filterByMultipleFields;
window.applyFilters = applyFilters;
window.paginate = paginate;
window.validateFormData = validateFormData;
window.getStatusBadge = getStatusBadge;
window.getGradeColor = getGradeColor;
window.debounce = debounce;
window.throttle = throttle;

console.log('✅ Utils.js cargado correctamente');
