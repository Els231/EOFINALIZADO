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
    const date = new Date(dateString);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

// Función para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para validar teléfono
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.length >= 8;
}

// Función para validar cédula dominicana
function validateCedula(cedula) {
    const re = /^\d{3}-?\d{7}-?\d{1}$/;
    return re.test(cedula);
}

// Función para generar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Función para calcular edad
function calculateAge(birthDate) {
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
    if (nota >= 90) return 'nota-excelente';
    if (nota >= 80) return 'nota-buena';
    if (nota >= 70) return 'nota-regular';
    return 'nota-mala';
}

// Función para obtener texto según calificación
function getGradeText(grade) {
    const nota = parseFloat(grade);
    if (nota >= 90) return 'Excelente';
    if (nota >= 80) return 'Muy Bueno';
    if (nota >= 70) return 'Bueno';
    return 'Debe Mejorar';
}

// Función para exportar a PDF
function exportToPDF(title, data, columns) {
    try {
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
                doc.text(value, xPosition, yPosition);
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
            <a class="page-link" href="#" onclick="${onPageClick}(${currentPage - 1})">Anterior</a>
        </li>`;
    }
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item active">
                <span class="page-link">${i}</span>
            </li>`;
        } else {
            paginationHTML += `<li class="page-item">
                <a class="page-link" href="#" onclick="${onPageClick}(${i})">${i}</a>
            </li>`;
        }
    }
    
    // Botón siguiente
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="${onPageClick}(${currentPage + 1})">Siguiente</a>
        </li>`;
    }
    
    paginationHTML += '</ul></nav>';
    return paginationHTML;
}

// Función para mostrar loading
function showLoading(element) {
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
    element.innerHTML = `
        <div class="text-center py-5">
            <i class="${icon} fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">${message}</h5>
        </div>
    `;
}

// Función para validar formulario
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
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
    });
    
    return isValid;
}

// Función para limpiar formulario
function clearForm(formElement) {
    formElement.reset();
    const inputs = formElement.querySelectorAll('.is-invalid');
    inputs.forEach(input => input.classList.remove('is-invalid'));
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP'
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
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
