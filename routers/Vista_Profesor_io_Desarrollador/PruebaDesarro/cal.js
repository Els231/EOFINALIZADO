/**
 * Módulo de gestión del calendario escolar
 * Basado en el código proporcionado con FullCalendar
 */

let calendar;
let eventosData = [];

// Función principal para cargar la sección del calendario
function loadCalendarioSection() {
    const section = document.getElementById('calendario-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-calendar-alt me-2"></i>
                    Calendario Escolar
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="openEventModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Evento
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportCalendar()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshCalendar()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas del calendario -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total Eventos
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-eventos">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Eventos Hoy
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="eventos-hoy">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-day fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Esta Semana
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="eventos-semana">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-week fa-2x text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Este Mes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="eventos-mes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-alt fa-2x text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros del calendario -->
        <div class="row mb-4">
            <div class="col-md-3">
                <label for="filterTipoEvento" class="form-label">Tipo de Evento:</label>
                <select class="form-select" id="filterTipoEvento" onchange="filterCalendarEvents()">
                    <option value="">Todos los tipos</option>
                    <option value="clase">Clase</option>
                    <option value="examen">Examen</option>
                    <option value="reunion">Reunión</option>
                    <option value="evento">Evento Especial</option>
                    <option value="feriado">Feriado</option>
                    <option value="actividad">Actividad Escolar</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="searchEventos" class="form-label">Buscar Eventos:</label>
                <input type="text" class="form-control" id="searchEventos" 
                       placeholder="Título o descripción..." 
                       oninput="filterCalendarEvents()">
            </div>
            <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearCalendarFilters()">
                    <i class="fas fa-times me-1"></i> Limpiar
                </button>
            </div>
        </div>

        <!-- Calendario -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Calendario Escolar</h6>
            </div>
            <div class="card-body">
                <div id="calendar"></div>
            </div>
        </div>

        <!-- Modal para agregar/editar evento -->
        <div class="modal fade" id="eventModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="eventModalTitle">
                            <i class="fas fa-calendar-plus me-2"></i>
                            Nuevo Evento
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="eventForm">
                            <input type="hidden" id="eventId">
                            
                            <div class="row mb-3">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="eventTitle" class="form-label">Título del Evento *</label>
                                        <input type="text" class="form-control" id="eventTitle" name="title" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="eventType" class="form-label">Tipo de Evento *</label>
                                        <select class="form-select" id="eventType" name="type" required>
                                            <option value="">Seleccionar tipo</option>
                                            <option value="clase">Clase</option>
                                            <option value="examen">Examen</option>
                                            <option value="reunion">Reunión</option>
                                            <option value="evento">Evento Especial</option>
                                            <option value="feriado">Feriado</option>
                                            <option value="actividad">Actividad Escolar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="eventDescription" class="form-label">Descripción</label>
                                <textarea class="form-control" id="eventDescription" name="description" rows="3"></textarea>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="eventStart" class="form-label">Fecha y Hora de Inicio *</label>
                                        <input type="datetime-local" class="form-control" id="eventStart" name="start" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="eventEnd" class="form-label">Fecha y Hora de Fin</label>
                                        <input type="datetime-local" class="form-control" id="eventEnd" name="end">
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="eventColor" class="form-label">Color del Evento</label>
                                        <select class="form-select" id="eventColor" name="color">
                                            <option value="#3498db">Azul (Clases)</option>
                                            <option value="#e74c3c">Rojo (Exámenes)</option>
                                            <option value="#2ecc71">Verde (Actividades)</option>
                                            <option value="#f39c12">Naranja (Reuniones)</option>
                                            <option value="#9b59b6">Morado (Eventos Especiales)</option>
                                            <option value="#34495e">Gris (Feriados)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="eventLocation" class="form-label">Ubicación</label>
                                        <input type="text" class="form-control" id="eventLocation" name="location" 
                                               placeholder="Aula, patio, etc.">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="eventAllDay" name="allDay">
                                    <label class="form-check-label" for="eventAllDay">
                                        Evento de todo el día
                                    </label>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="eventReminder" class="form-label">Recordatorio</label>
                                <select class="form-select" id="eventReminder" name="reminder">
                                    <option value="">Sin recordatorio</option>
                                    <option value="15">15 minutos antes</option>
                                    <option value="30">30 minutos antes</option>
                                    <option value="60">1 hora antes</option>
                                    <option value="1440">1 día antes</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="eventNotes" class="form-label">Notas Adicionales</label>
                                <textarea class="form-control" id="eventNotes" name="notes" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEvent()">
                            <i class="fas fa-save me-1"></i> Guardar Evento
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para ver detalles del evento -->
        <div class="modal fade" id="eventDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" id="eventDetailsHeader">
                        <h5 class="modal-title" id="eventDetailsTitle"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="eventDetailsBody">
                        <!-- El contenido se cargará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary me-2" id="editEventBtn">
                            <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger" id="deleteEventBtn">
                            <i class="fas fa-trash me-1"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar calendario después de cargar el HTML
    setTimeout(() => {
        loadEventosData();
        initializeCalendar();
        updateCalendarStats();
    }, 100);
}

// Cargar datos de eventos
function loadEventosData() {
    eventosData = db.getAll('eventos') || [];
}

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
        editable: true,
        height: 'auto',
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
    const filterType = document.getElementById('filterTipoEvento')?.value || '';
    const searchTerm = document.getElementById('searchEventos')?.value?.toLowerCase() || '';
    
    let filteredEvents = [...eventosData];
    
    if (filterType) {
        filteredEvents = filteredEvents.filter(event => event.type === filterType);
    }
    
    if (searchTerm) {
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            (event.description && event.description.toLowerCase().includes(searchTerm))
        );
    }
    
    return filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.color || getEventTypeColor(event.type),
        borderColor: event.color || getEventTypeColor(event.type),
        description: event.description,
        type: event.type,
        location: event.location,
        notes: event.notes,
        allDay: event.allDay || false
    }));
}

// Obtener color por tipo de evento
function getEventTypeColor(type) {
    const colors = {
        'clase': '#3498db',
        'examen': '#e74c3c',
        'reunion': '#f39c12',
        'evento': '#9b59b6',
        'feriado': '#34495e',
        'actividad': '#2ecc71'
    };
    return colors[type] || '#3498db';
}

// Filtrar eventos del calendario
function filterCalendarEvents() {
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(loadCalendarEvents());
    }
    updateCalendarStats();
}

// Limpiar filtros del calendario
function clearCalendarFilters() {
    document.getElementById('filterTipoEvento').value = '';
    document.getElementById('searchEventos').value = '';
    filterCalendarEvents();
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
        title.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Evento';
        const event = eventosData.find(e => e.id === eventId);
        
        if (event) {
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventStart').value = formatDateTimeForInput(event.start);
            document.getElementById('eventEnd').value = event.end ? formatDateTimeForInput(event.end) : '';
            document.getElementById('eventType').value = event.type || 'evento';
            document.getElementById('eventColor').value = event.color || getEventTypeColor(event.type);
            document.getElementById('eventLocation').value = event.location || '';
            document.getElementById('eventAllDay').checked = event.allDay || false;
            document.getElementById('eventReminder').value = event.reminder || '';
            document.getElementById('eventNotes').value = event.notes || '';
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-calendar-plus me-2"></i>Nuevo Evento';
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
    
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }

    const eventId = document.getElementById('eventId').value;
    const eventData = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        start: document.getElementById('eventStart').value,
        end: document.getElementById('eventEnd').value,
        type: document.getElementById('eventType').value,
        color: document.getElementById('eventColor').value,
        location: document.getElementById('eventLocation').value.trim(),
        allDay: document.getElementById('eventAllDay').checked,
        reminder: document.getElementById('eventReminder').value,
        notes: document.getElementById('eventNotes').value.trim()
    };

    // Validaciones adicionales
    if (!eventData.title) {
        showAlert.error('Error', 'El título es requerido');
        return;
    }

    if (!eventData.start) {
        showAlert.error('Error', 'La fecha de inicio es requerida');
        return;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (eventData.end && new Date(eventData.end) <= new Date(eventData.start)) {
        showAlert.error('Error', 'La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }

    try {
        if (eventId) {
            // Actualizar evento existente
            const updatedEvent = db.update('eventos', eventId, eventData);
            const index = eventosData.findIndex(e => e.id === parseInt(eventId));
            if (index !== -1) {
                eventosData[index] = updatedEvent;
            }
            showAlert.success('¡Éxito!', 'Evento actualizado correctamente');
        } else {
            // Crear nuevo evento
            const newEvent = db.insert('eventos', eventData);
            eventosData.push(newEvent);
            showAlert.success('¡Éxito!', 'Evento creado correctamente');
        }

        // Cerrar modal y actualizar calendario
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
        modal.hide();
        
        // Actualizar calendario
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(loadCalendarEvents());
        }
        
        updateCalendarStats();
        
    } catch (error) {
        console.error('Error al guardar evento:', error);
        showAlert.error('Error', 'No se pudo guardar el evento');
    }
}

// Ver detalles del evento
function viewEventDetails(eventId) {
    const event = eventosData.find(e => e.id == eventId);
    
    if (!event) {
        showAlert.error('Error', 'Evento no encontrado');
        return;
    }

    const header = document.getElementById('eventDetailsHeader');
    const title = document.getElementById('eventDetailsTitle');
    const body = document.getElementById('eventDetailsBody');
    
    // Configurar header con color del evento
    header.style.backgroundColor = event.color || getEventTypeColor(event.type);
    title.textContent = event.title;
    
    // Generar contenido del modal
    const detailsHtml = `
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
        ${event.location ? `
        <div class="mb-3">
            <strong>Ubicación:</strong> ${event.location}
        </div>
        ` : ''}
        ${event.description ? `
        <div class="mb-3">
            <strong>Descripción:</strong><br>
            ${event.description}
        </div>
        ` : ''}
        ${event.notes ? `
        <div class="mb-3">
            <strong>Notas:</strong><br>
            ${event.notes}
        </div>
        ` : ''}
        <div class="mb-3">
            <strong>Evento de todo el día:</strong> ${event.allDay ? 'Sí' : 'No'}
        </div>
        ${event.reminder ? `
        <div class="mb-3">
            <strong>Recordatorio:</strong> ${getReminderText(event.reminder)}
        </div>
        ` : ''}
        <div class="mb-3">
            <strong>Creado:</strong> ${event.fechaRegistro ? formatDateTime(event.fechaRegistro) : 'No disponible'}
        </div>
    `;

    body.innerHTML = detailsHtml;
    
    // Configurar botones
    document.getElementById('editEventBtn').onclick = () => {
        bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();
        openEventModal(event.id);
    };
    
    document.getElementById('deleteEventBtn').onclick = () => {
        bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();
        deleteEvent(event.id);
    };
    
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
        'feriado': 'Feriado',
        'actividad': 'Actividad Escolar'
    };
    return types[type] || type;
}

// Obtener texto del recordatorio
function getReminderText(minutes) {
    if (minutes == 15) return '15 minutos antes';
    if (minutes == 30) return '30 minutos antes';
    if (minutes == 60) return '1 hora antes';
    if (minutes == 1440) return '1 día antes';
    return `${minutes} minutos antes`;
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

// Eliminar evento
function deleteEvent(eventId) {
    const event = eventosData.find(e => e.id == eventId);
    
    if (!event) {
        showAlert.error('Error', 'Evento no encontrado');
        return;
    }

    showAlert.confirm(
        '¿Está seguro?',
        `¿Desea eliminar el evento "${event.title}"?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('eventos', eventId);
                eventosData = eventosData.filter(e => e.id != eventId);

                // Actualizar calendario
                if (calendar) {
                    calendar.removeAllEvents();
                    calendar.addEventSource(loadCalendarEvents());
                }
                
                updateCalendarStats();
                showAlert.success('¡Eliminado!', 'El evento ha sido eliminado');
                
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                showAlert.error('Error', 'No se pudo eliminar el evento');
            }
        }
    });
}

// Actualizar fechas de evento (para drag & drop)
function updateEventDates(eventId, newStart, newEnd) {
    const eventIndex = eventosData.findIndex(e => e.id == eventId);
    
    if (eventIndex !== -1) {
        eventosData[eventIndex].start = newStart;
        if (newEnd) {
            eventosData[eventIndex].end = newEnd;
        }
        
        // Guardar en base de datos
        db.update('eventos', eventId, {
            start: newStart,
            end: newEnd
        });
        
        showAlert.success('Actualizado', `Se cambió la fecha del evento "${eventosData[eventIndex].title}"`);
    }
}

// Actualizar estadísticas del calendario
function updateCalendarStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const stats = {
        total: eventosData.length,
        hoy: eventosData.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate.toDateString() === today.toDateString();
        }).length,
        semana: eventosData.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }).length,
        mes: eventosData.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate >= startOfMonth && eventDate <= endOfMonth;
        }).length
    };

    document.getElementById('total-eventos').textContent = stats.total;
    document.getElementById('eventos-hoy').textContent = stats.hoy;
    document.getElementById('eventos-semana').textContent = stats.semana;
    document.getElementById('eventos-mes').textContent = stats.mes;
}

// Exportar calendario
function exportCalendar() {
    if (eventosData.length === 0) {
        showAlert.warning('Sin datos', 'No hay eventos para exportar');
        return;
    }

    const dataToExport = eventosData.map(event => ({
        'Título': event.title,
        'Tipo': getEventTypeText(event.type),
        'Descripción': event.description || '',
        'Fecha de Inicio': formatDateTime(event.start),
        'Fecha de Fin': event.end ? formatDateTime(event.end) : '',
        'Ubicación': event.location || '',
        'Todo el día': event.allDay ? 'Sí' : 'No',
        'Recordatorio': event.reminder ? getReminderText(event.reminder) : 'Sin recordatorio',
        'Notas': event.notes || '',
        'Color': event.color || ''
    }));

    exportToExcel('Calendario Escolar', dataToExport, 'calendario_' + new Date().toISOString().split('T')[0]);
}

// Refrescar calendario
function refreshCalendar() {
    loadEventosData();
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(loadCalendarEvents());
    }
    updateCalendarStats();
    showAlert.success('Actualizado', 'El calendario ha sido actualizado');
}