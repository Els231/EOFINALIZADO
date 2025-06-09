/**
 * Utilidades generales para el sistema escolar
 */

// Función para mostrar alertas con SweetAlert2
const showAlert = {
    success: (title, text = '') => {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 1500
        });
    },
    error: (title, text = '') => {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text
        });
    },
    warning: (title, text = '') => {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: text
        });
    },
    info: (title, text = '') => {
        Swal.fire({
            icon: 'info',
            title: title,
            text: text
        });
    },
    confirm: (title, text = '') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });
    }
};

// Función para formatear fechas
function formatDate(dateString, includeTime = false) {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('es-ES', options);
}

// Función para formatear fecha corta
function formatDateShort(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    return date.toLocaleDateString('es-ES');
}

// Función para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para validar teléfono dominicano
function validatePhone(phone) {
    // Acepta formatos: 809-000-0000, 8090000000, (809) 000-0000
    const re = /^(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    return re.test(phone) && phone.length >= 10;
}

// Función para validar cédula dominicana
function validateCedula(cedula) {
    // Formato: 000-0000000-0 o 00000000000
    const re = /^\d{3}-?\d{7}-?\d{1}$/;
    return re.test(cedula.replace(/\s/g, ''));
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Función para calcular edad
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Función para obtener clase CSS según calificación
function getGradeClass(grade) {
    const nota = parseFloat(grade);
    if (isNaN(nota)) return 'nota-pendiente';
    if (nota >= 90) return 'bg-success';
    if (nota >= 80) return 'bg-info';
    if (nota >= 70) return 'bg-warning';
    return 'bg-danger';
}

// Función para obtener texto según calificación
function getGradeText(grade) {
    const nota = parseFloat(grade);
    if (isNaN(nota)) return 'Sin Calificar';
    if (nota >= 90) return 'Excelente';
    if (nota >= 80) return 'Muy Bueno';
    if (nota >= 70) return 'Bueno';
    return 'Debe Mejorar';
}

// Función para obtener texto del grado
function getGradoText(grado) {
    const grados = {
        '1': '1er Grado',
        '2': '2do Grado',
        '3': '3er Grado',
        '4': '4to Grado',
        '5': '5to Grado',
        '6': '6to Grado'
    };
    return grados[grado] || `Grado ${grado}`;
}

// Función para exportar a PDF
function exportToPDF(title, data, columns) {
    try {
        if (typeof window.jsPDF === 'undefined') {
            showAlert.error('Error', 'La librería jsPDF no está disponible');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(16);
        doc.text(title, 20, 20);
        
        // Fecha de generación
        doc.setFontSize(10);
        doc.text(`Generado el: ${formatDate(new Date().toISOString(), true)}`, 20, 30);
        
        let yPosition = 50;
        const lineHeight = 8;
        
        // Encabezados
        doc.setFontSize(12);
        let xPosition = 20;
        columns.forEach(col => {
            doc.text(col.header, xPosition, yPosition);
            xPosition += col.width || 40;
        });
        
        yPosition += lineHeight;
        
        // Datos
        doc.setFontSize(10);
        data.forEach(row => {
            xPosition = 20;
            columns.forEach(col => {
                const value = row[col.key] ? row[col.key].toString() : '';
                doc.text(value.substring(0, 25), xPosition, yPosition); // Limitar texto
                xPosition += col.width || 40;
            });
            yPosition += lineHeight;
            
            // Nueva página si es necesario
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
        });
        
        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
        showAlert.success('¡Exportado!', 'El archivo PDF se ha generado correctamente');
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showAlert.error('Error', 'No se pudo generar el archivo PDF');
    }
}

// Función para exportar a Excel
function exportToExcel(title, data, filename) {
    try {
        if (typeof XLSX === 'undefined') {
            showAlert.error('Error', 'La librería XLSX no está disponible');
            return;
        }
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);
        XLSX.writeFile(wb, `${filename || title.replace(/\s+/g, '_')}.xlsx`);
        showAlert.success('¡Exportado!', 'El archivo Excel se ha generado correctamente');
    } catch (error) {
        console.error('Error al exportar Excel:', error);
        showAlert.error('Error', 'No se pudo generar el archivo Excel');
    }
}

// Función para filtrar datos
function filterData(data, searchTerm, fields) {
    if (!searchTerm) return data;
    
    return data.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
    });
}

// Función para ordenar datos
function sortData(data, field, direction = 'asc') {
    return [...data].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        // Manejar valores nulos/undefined
        if (!aVal && !bVal) return 0;
        if (!aVal) return direction === 'asc' ? 1 : -1;
        if (!bVal) return direction === 'asc' ? -1 : 1;
        
        // Manejar números
        if (!isNaN(aVal) && !isNaN(bVal)) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        
        // Manejar fechas
        if (aVal instanceof Date || (typeof aVal === 'string' && aVal.includes('-'))) {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        
        // Manejar strings
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
}

// Función para paginar datos
function paginateData(data, page = 1, itemsPerPage = 10) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
        data: data.slice(startIndex, endIndex),
        totalPages: Math.ceil(data.length / itemsPerPage),
        currentPage: page,
        totalItems: data.length
    };
}

// Función para crear paginación HTML
function createPagination(totalPages, currentPage, onPageClick) {
    if (totalPages <= 1) return '';
    
    let paginationHTML = '<nav aria-label="Navegación de páginas"><ul class="pagination justify-content-center">';
    
    // Botón anterior
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="${onPageClick}(${currentPage - 1}); return false;">Anterior</a>
        </li>`;
    }
    
    // Páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="${onPageClick}(1); return false;">1</a>
        </li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item active">
                <span class="page-link">${i}</span>
            </li>`;
        } else {
            paginationHTML += `<li class="page-item">
                <a class="page-link" href="#" onclick="${onPageClick}(${i}); return false;">${i}</a>
            </li>`;
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="${onPageClick}(${totalPages}); return false;">${totalPages}</a>
        </li>`;
    }
    
    // Botón siguiente
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="${onPageClick}(${currentPage + 1}); return false;">Siguiente</a>
        </li>`;
    }
    
    paginationHTML += '</ul></nav>';
    return paginationHTML;
}

// Función para mostrar loading
function showLoading(element) {
    if (!element) return;
    
    element.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando...</p>
        </div>
    `;
}

// Función para mostrar estado vacío
function showEmptyState(element, message, icon = 'fas fa-inbox') {
    if (!element) return;
    
    element.innerHTML = `
        <div class="text-center py-5">
            <i class="${icon} fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">${message}</h5>
        </div>
    `;
}

// Función para validar formulario
function validateForm(formElement) {
    if (!formElement) return false;
    
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Limpiar estilos previos
        input.classList.remove('is-invalid');
        
        // Validar campo requerido
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
            return;
        }
        
        // Validaciones específicas
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            input.classList.add('is-invalid');
            isValid = false;
        }
        
        if (input.name === 'telefono' && input.value && !validatePhone(input.value)) {
            input.classList.add('is-invalid');
            isValid = false;
        }
        
        if (input.name === 'cedula' && input.value && !validateCedula(input.value)) {
            input.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validar números
        if (input.type === 'number' && input.value) {
            const min = parseFloat(input.getAttribute('min'));
            const max = parseFloat(input.getAttribute('max'));
            const value = parseFloat(input.value);
            
            if (!isNaN(min) && value < min) {
                input.classList.add('is-invalid');
                isValid = false;
            }
            
            if (!isNaN(max) && value > max) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
        
        // Validar fechas
        if (input.type === 'date' && input.value) {
            const date = new Date(input.value);
            if (isNaN(date.getTime())) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Función para limpiar formulario
function clearForm(formElement) {
    if (!formElement) return;
    
    formElement.reset();
    const inputs = formElement.querySelectorAll('.is-invalid');
    inputs.forEach(input => input.classList.remove('is-invalid'));
}

// Función para formatear moneda dominicana
function formatCurrency(amount) {
    if (isNaN(amount)) return 'RD$ 0.00';
    
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 2
    }).format(amount);
}

// Función para debounce (útil para búsquedas)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para capitalizar texto
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función para capitalizar cada palabra
function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ').map(word => capitalize(word)).join(' ');
}

// Función para generar colores aleatorios para gráficos
function generateColors(count) {
    const colors = [
        '#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    
    return result;
}

// Función para formatear número con separadores de miles
function formatNumber(num) {
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('es-DO').format(num);
}

// Función para obtener el año académico actual
function getCurrentAcademicYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    
    // El año escolar en RD generalmente inicia en agosto/septiembre
    if (currentMonth >= 8) {
        return currentYear;
    } else {
        return currentYear - 1;
    }
}

// Función para validar si una fecha está en el futuro
function isFutureDate(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    return inputDate > today;
}

// Función para calcular días entre fechas
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// Función para obtener el período académico actual
function getCurrentAcademicPeriod() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    if (currentMonth >= 8 && currentMonth <= 12) {
        return '1er Trimestre';
    } else if (currentMonth >= 1 && currentMonth <= 4) {
        return '2do Trimestre';
    } else {
        return '3er Trimestre';
    }
}

// Función para mostrar notificaciones tipo toast
function showToast(message, type = 'info') {
    // Si existe una librería de toast, usarla
    if (typeof Toastify !== 'undefined') {
        const backgroundColor = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        
        Toastify({
            text: message,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: backgroundColor[type] || backgroundColor.info
        }).showToast();
    } else {
        // Fallback a console log
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Función para sanitizar HTML (prevenir XSS)
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Función para truncar texto
function truncateText(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Función para obtener initiales de un nombre
function getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
}

// Función para verificar si el dispositivo es móvil
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Función para scroll suave a un elemento
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.schoolUtils = {
        showAlert,
        formatDate,
        formatDateShort,
        validateEmail,
        validatePhone,
        validateCedula,
        generateId,
        calculateAge,
        getGradeClass,
        getGradeText,
        getGradoText,
        exportToPDF,
        exportToExcel,
        filterData,
        sortData,
        paginateData,
        createPagination,
        showLoading,
        showEmptyState,
        validateForm,
        clearForm,
        formatCurrency,
        debounce,
        capitalize,
        capitalizeWords,
        generateColors,
        formatNumber,
        getCurrentAcademicYear,
        isFutureDate,
        daysBetween,
        getCurrentAcademicPeriod,
        showToast,
        sanitizeHTML,
        truncateText,
        getInitials,
        isMobileDevice,
        scrollToElement
    };
}
