// ===== GESTIÓN DEL CALENDARIO =====

let calendar;

// Inicializar calendario
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) {
        console.error('Elemento del calendario no encontrado');
        return;
    }

    // Destruir calendario existente si existe
    if (calendar) {
        calendar.destroy();
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: loadCalendarEvents(),
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: function(selectInfo) {
            openEventModal(null, selectInfo.startStr, selectInfo.endStr);
        },
        eventClick: function(clickInfo) {
            viewEventDetails(clickInfo.event.id);
        },
        eventDrop: function(dropInfo) {
            updateEventDates(dropInfo.event.id, dropInfo.event.startStr, dropInfo.event.endStr);
        },
        eventResize: function(resizeInfo) {
            updateEventDates(resizeInfo.event.id, resizeInfo.event.startStr, resizeInfo.event.endStr);
        },
        eventDidMount: function(info) {
            // Agregar tooltip a los eventos
            info.el.setAttribute('title', info.event.extendedProps.description || info.event.title);
        }
    });

    calendar.render();
}

// Cargar eventos del calendario
function loadCalendarEvents() {
    const events = Storage.getEvents();
    
    return events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.color || '#3498db',
        borderColor: event.color || '#3498db',
        description: event.description,
        type: event.type
    }));
}

// Abrir modal de evento
function openEventModal(eventId = null, startDate = null, endDate = null) {
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const form = document.getElementById('eventForm');
    const title = document.getElementById('eventModalTitle');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('eventId').value = '';
    
    if (eventId) {
        // Modo edición
        title.textContent = 'Editar Evento';
        const events = Storage.getEvents();
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventStart').value = formatDateTimeForInput(event.start);
            document.getElementById('eventEnd').value = event.end ? formatDateTimeForInput(event.end) : '';
            document.getElementById('eventType').value = event.type || 'evento';
            document.getElementById('eventColor').value = event.color || '#3498db';
        }
    } else {
        // Modo creación
        title.textContent = 'Agregar Evento';
        document.getElementById('eventType').value = 'evento';
        document.getElementById('eventColor').value = '#3498db';
        
        // Si se seleccionó una fecha en el calendario
        if (startDate) {
            document.getElementById('eventStart').value = formatDateTimeForInput(startDate);
            if (endDate && endDate !== startDate) {
                document.getElementById('eventEnd').value = formatDateTimeForInput(endDate);
            }
        } else {
            // Fecha y hora actual como default
            const now = new Date();
            document.getElementById('eventStart').value = formatDateTimeForInput(now.toISOString());
        }
    }
    
    modal.show();
}

// Formatear fecha para input datetime-local
function formatDateTimeForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Guardar evento
function saveEvent() {
    const form = document.getElementById('eventForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const eventId = document.getElementById('eventId').value;
    const eventData = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        start: document.getElementById('eventStart').value,
        end: document.getElementById('eventEnd').value,
        type: document.getElementById('eventType').value,
        color: document.getElementById('eventColor').value
    };

    // Validaciones adicionales
    if (!eventData.title) {
        alert('El título es requerido');
        return;
    }

    if (!eventData.start) {
        alert('La fecha de inicio es requerida');
        return;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (eventData.end && new Date(eventData.end) <= new Date(eventData.start)) {
        alert('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }

    let events = Storage.getEvents();
    
    if (eventId) {
        // Actualizar evento existente
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events[index] = { ...events[index], ...eventData };
            Storage.addActivity({
                title: 'Evento Actualizado',
                description: `Se actualizó el evento "${eventData.title}"`,
                icon: '📅'
            });
        }
    } else {
        // Crear nuevo evento
        const newEvent = {
            id: Storage.generateId(),
            ...eventData,
            createdAt: new Date().toISOString()
        };
        events.push(newEvent);
        Storage.addActivity({
            title: 'Nuevo Evento',
            description: `Se creó el evento "${eventData.title}" para ${formatDate(eventData.start)}`,
            icon: '📅'
        });
    }

    Storage.setEvents(events);
    
    // Cerrar modal y actualizar calendario
    const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
    
    // Actualizar calendario
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(loadCalendarEvents());
    }
    
    alert(eventId ? 'Evento actualizado correctamente' : 'Evento agregado correctamente');
}

// Ver detalles del evento
function viewEventDetails(eventId) {
    const events = Storage.getEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert('Evento no encontrado');
        return;
    }

    const detailsHtml = `
        <div class="modal fade" id="eventDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: ${event.color}; color: white;">
                        <h5 class="modal-title">${event.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <strong>Tipo:</strong> ${getEventTypeText(event.type)}
                        </div>
                        <div class="mb-3">
                            <strong>Fecha de Inicio:</strong> ${formatDateTime(event.start)}
                        </div>
                        ${event.end ? `
                        <div class="mb-3">
                            <strong>Fecha de Fin:</strong> ${formatDateTime(event.end)}
                        </div>
                        ` : ''}
                        ${event.description ? `
                        <div class="mb-3">
                            <strong>Descripción:</strong><br>
                            ${event.description}
                        </div>
                        ` : ''}
                        <div class="mb-3">
                            <strong>Creado:</strong> ${event.createdAt ? formatDateTime(event.createdAt) : 'No disponible'}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary me-2" onclick="editEvent('${event.id}'); bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();">
                            <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger" onclick="deleteEvent('${event.id}'); bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();">
                            <i class="fas fa-trash me-1"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal anterior si existe
    const existingModal = document.getElementById('eventDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', detailsHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    modal.show();
}

// Obtener texto del tipo de evento
function getEventTypeText(type) {
    const types = {
        'clase': 'Clase',
        'examen': 'Examen',
        'reunion': 'Reunión',
        'evento': 'Evento Especial',
        'feriado': 'Feriado'
    };
    return types[type] || type;
}

// Formatear fecha y hora para mostrar
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Editar evento
function editEvent(eventId) {
    openEventModal(eventId);
}

// Eliminar evento
function deleteEvent(eventId) {
    const events = Storage.getEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert('Evento no encontrado');
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar el evento "${event.title}"?`)) {
        return;
    }

    // Eliminar evento
    const updatedEvents = events.filter(e => e.id !== eventId);
    Storage.setEvents(updatedEvents);

    Storage.addActivity({
        title: 'Evento Eliminado',
        description: `Se eliminó el evento "${event.title}"`,
        icon: '🗑️'
    });

    // Actualizar calendario
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(loadCalendarEvents());
    }
    
    alert('Evento eliminado correctamente');
}

// Actualizar fechas de evento (para drag & drop)
function updateEventDates(eventId, newStart, newEnd) {
    const events = Storage.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex !== -1) {
        events[eventIndex].start = newStart;
        if (newEnd) {
            events[eventIndex].end = newEnd;
        }
        
        Storage.setEvents(events);
        
        Storage.addActivity({
            title: 'Evento Movido',
            description: `Se cambió la fecha del evento "${events[eventIndex].title}"`,
            icon: '📅'
        });
    }
}

// Exportar calendario
function exportCalendar() {
    const events = Storage.getEvents();
    
    if (events.length === 0) {
        alert('No hay eventos para exportar');
        return;
    }

    // Preparar datos para exportación
    const exportData = events.map(event => ({
        'Título': event.title,
        'Descripción': event.description || '',
        'Tipo': getEventTypeText(event.type),
        'Fecha de Inicio': formatDateTime(event.start),
        'Fecha de Fin': event.end ? formatDateTime(event.end) : '',
        'Color': event.color,
        'Fecha de Creación': event.createdAt ? formatDateTime(event.createdAt) : ''
    }));

    // Crear archivo Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    
    // Descargar archivo
    XLSX.writeFile(wb, `calendario_${new Date().toISOString().split('T')[0]}.xlsx`);

    Storage.addActivity({
        title: 'Calendario Exportado',
        description: `Se exportaron ${events.length} eventos del calendario`,
        icon: '📄'
    });

    alert('Calendario exportado correctamente');
}

// Importar eventos al calendario
function importCalendar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.ics';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'ics') {
            // Manejar archivos ICS (formato de calendario estándar)
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    processICSData(e.target.result);
                } catch (error) {
                    console.error('Error al importar archivo ICS:', error);
                    alert('Error al procesar el archivo ICS. Verifique el formato.');
                }
            };
            reader.readAsText(file);
        } else {
            // Manejar archivos Excel
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    
                    processImportedEvents(jsonData);
                } catch (error) {
                    console.error('Error al importar archivo:', error);
                    alert('Error al procesar el archivo. Verifique el formato.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };
    
    input.click();
}

// Procesar datos de archivo ICS
function processICSData(icsContent) {
    // Implementación básica de parser ICS
    const events = [];
    const lines = icsContent.split('\n');
    let currentEvent = null;
    
    for (let line of lines) {
        line = line.trim();
        
        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (currentEvent.title && currentEvent.start) {
                events.push({
                    id: Storage.generateId(),
                    title: currentEvent.title,
                    description: currentEvent.description || '',
                    start: currentEvent.start,
                    end: currentEvent.end || '',
                    type: 'evento',
                    color: '#3498db',
                    createdAt: new Date().toISOString()
                });
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith('SUMMARY:')) {
                currentEvent.title = line.substring(8);
            } else if (line.startsWith('DESCRIPTION:')) {
                currentEvent.description = line.substring(12);
            } else if (line.startsWith('DTSTART:')) {
                currentEvent.start = parseICSDate(line.substring(8));
            } else if (line.startsWith('DTEND:')) {
                currentEvent.end = parseICSDate(line.substring(6));
            }
        }
    }
    
    if (events.length > 0) {
        const existingEvents = Storage.getEvents();
        const allEvents = [...existingEvents, ...events];
        Storage.setEvents(allEvents);
        
        // Actualizar calendario
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(loadCalendarEvents());
        }
        
        Storage.addActivity({
            title: 'Eventos Importados',
            description: `Se importaron ${events.length} eventos desde archivo ICS`,
            icon: '📥'
        });
        
        alert(`Se importaron ${events.length} eventos correctamente`);
    } else {
        alert('No se encontraron eventos válidos en el archivo');
    }
}

// Parsear fecha de formato ICS
function parseICSDate(dateString) {
    // Formato básico: YYYYMMDDTHHMMSS
    if (dateString.length >= 8) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        
        if (dateString.length >= 15 && dateString.charAt(8) === 'T') {
            const hour = dateString.substring(9, 11);
            const minute = dateString.substring(11, 13);
            return `${year}-${month}-${day}T${hour}:${minute}:00`;
        } else {
            return `${year}-${month}-${day}`;
        }
    }
    return dateString;
}

// Procesar eventos importados desde Excel
function processImportedEvents(data) {
    if (!data || data.length === 0) {
        alert('El archivo está vacío o no tiene el formato correcto');
        return;
    }

    const events = Storage.getEvents();
    let importedCount = 0;
    let errors = [];

    data.forEach((row, index) => {
        try {
            // Validar datos requeridos
            if (!row.Título || !row['Fecha de Inicio']) {
                errors.push(`Fila ${index + 1}: Faltan datos requeridos (Título y Fecha de Inicio)`);
                return;
            }

            // Procesar fechas
            let startDate, endDate;
            try {
                startDate = new Date(row['Fecha de Inicio']).toISOString();
                if (row['Fecha de Fin']) {
                    endDate = new Date(row['Fecha de Fin']).toISOString();
                }
            } catch {
                errors.push(`Fila ${index + 1}: Formato de fecha inválido`);
                return;
            }

            // Determinar tipo de evento
            let eventType = 'evento';
            if (row.Tipo) {
                const typeMap = {
                    'clase': 'clase',
                    'examen': 'examen',
                    'reunión': 'reunion',
                    'reunion': 'reunion',
                    'evento especial': 'evento',
                    'evento': 'evento',
                    'feriado': 'feriado'
                };
                eventType = typeMap[row.Tipo.toLowerCase()] || 'evento';
            }

            // Crear nuevo evento
            const newEvent = {
                id: Storage.generateId(),
                title: row.Título.trim(),
                description: row.Descripción?.trim() || '',
                start: startDate,
                end: endDate || '',
                type: eventType,
                color: row.Color || '#3498db',
                createdAt: new Date().toISOString()
            };

            events.push(newEvent);
            importedCount++;

        } catch (error) {
            errors.push(`Fila ${index + 1}: Error al procesar datos`);
        }
    });

    // Guardar eventos actualizados
    Storage.setEvents(events);

    // Mostrar resultados
    let message = `Se importaron ${importedCount} eventos correctamente.`;
    if (errors.length > 0) {
        message += `\n\nErrores encontrados:\n${errors.slice(0, 10).join('\n')}`;
        if (errors.length > 10) {
            message += `\n... y ${errors.length - 10} errores más.`;
        }
    }

    alert(message);
    
    if (importedCount > 0) {
        // Actualizar calendario
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(loadCalendarEvents());
        }
        
        Storage.addActivity({
            title: 'Eventos Importados',
            description: `Se importaron ${importedCount} eventos desde archivo Excel`,
            icon: '📥'
        });
    }
}

// Generar eventos académicos predefinidos
function generateAcademicEvents() {
    if (!confirm('¿Desea generar eventos académicos predefinidos para el año escolar actual? Esto incluirá fechas de períodos, exámenes y vacaciones.')) {
        return;
    }

    const currentYear = new Date().getFullYear();
    const academicEvents = [
        {
            title: 'Inicio del Año Escolar',
            start: `${currentYear}-02-01`,
            type: 'evento',
            color: '#2ecc71',
            description: 'Inicio oficial del año escolar'
        },
        {
            title: 'Primer Período',
            start: `${currentYear}-02-01`,
            end: `${currentYear}-04-30`,
            type: 'clase',
            color: '#3498db',
            description: 'Primer período académico'
        },
        {
            title: 'Exámenes Primer Período',
            start: `${currentYear}-04-15`,
            end: `${currentYear}-04-30`,
            type: 'examen',
            color: '#e74c3c',
            description: 'Período de exámenes del primer período'
        },
        {
            title: 'Segundo Período',
            start: `${currentYear}-05-01`,
            end: `${currentYear}-07-15`,
            type: 'clase',
            color: '#3498db',
            description: 'Segundo período académico'
        },
        {
            title: 'Vacaciones de Mitad de Año',
            start: `${currentYear}-07-16`,
            end: `${currentYear}-08-15`,
            type: 'feriado',
            color: '#f39c12',
            description: 'Vacaciones de mitad de año'
        },
        {
            title: 'Tercer Período',
            start: `${currentYear}-08-16`,
            end: `${currentYear}-10-31`,
            type: 'clase',
            color: '#3498db',
            description: 'Tercer período académico'
        },
        {
            title: 'Cuarto Período',
            start: `${currentYear}-11-01`,
            end: `${currentYear}-12-15`,
            type: 'clase',
            color: '#3498db',
            description: 'Cuarto período académico'
        },
        {
            title: 'Exámenes Finales',
            start: `${currentYear}-12-01`,
            end: `${currentYear}-12-15`,
            type: 'examen',
            color: '#e74c3c',
            description: 'Período de exámenes finales'
        },
        {
            title: 'Fin del Año Escolar',
            start: `${currentYear}-12-15`,
            type: 'evento',
            color: '#2ecc71',
            description: 'Fin oficial del año escolar'
        }
    ];

    const events = Storage.getEvents();
    const newEvents = academicEvents.map(event => ({
        id: Storage.generateId(),
        ...event,
        createdAt: new Date().toISOString()
    }));

    const allEvents = [...events, ...newEvents];
    Storage.setEvents(allEvents);

    // Actualizar calendario
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(loadCalendarEvents());
    }

    Storage.addActivity({
        title: 'Eventos Académicos Generados',
        description: `Se generaron ${newEvents.length} eventos académicos para el año ${currentYear}`,
        icon: '📚'
    });

    alert(`Se generaron ${newEvents.length} eventos académicos predefinidos`);
}
