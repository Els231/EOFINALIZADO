/**
 * Módulo de calendario escolar
 * Funcionalidades para gestión de eventos académicos
 */

let calendar;
let eventosData = [];

// Función principal para cargar la sección de calendario
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
                        <button type="button" class="btn btn-primary" onclick="showAddEventoModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Evento
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportEventos()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="printCalendario()">
                            <i class="fas fa-print me-1"></i> Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros rápidos -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-2">
                    <label for="filterTipoEvento" class="form-label">Tipo de Evento:</label>
                    <select class="form-select" id="filterTipoEvento" onchange="filterEventos()">
                        <option value="">Todos</option>
                        <option value="Académico">Académico</option>
                        <option value="Examen">Examen</option>
                        <option value="Festivo">Festivo</option>
                        <option value="Reunión">Reunión</option>
                        <option value="Actividad">Actividad</option>
                        <option value="Capacitación">Capacitación</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterMes" class="form-label">Mes:</label>
                    <select class="form-select" id="filterMes" onchange="goToMonth()">
                        <option value="">Mes actual</option>
                        <option value="0">Enero</option>
                        <option value="1">Febrero</option>
                        <option value="2">Marzo</option>
                        <option value="3">Abril</option>
                        <option value="4">Mayo</option>
                        <option value="5">Junio</option>
                        <option value="6">Julio</option>
                        <option value="7">Agosto</option>
                        <option value="8">Septiembre</option>
                        <option value="9">Octubre</option>
                        <option value="10">Noviembre</option>
                        <option value="11">Diciembre</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterAno" class="form-label">Año:</label>
                    <select class="form-select" id="filterAno" onchange="goToMonth()">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="searchEventos" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchEventos" 
                           placeholder="Buscar eventos..." 
                           oninput="filterEventos()">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Vista:</label>
                    <div class="btn-group w-100">
                        <button type="button" class="btn btn-outline-secondary active" onclick="changeCalendarView('dayGridMonth')">Mes</button>
                        <button type="button" class="btn btn-outline-secondary" onclick="changeCalendarView('timeGridWeek')">Semana</button>
                        <button type="button" class="btn btn-outline-secondary" onclick="changeCalendarView('listMonth')">Lista</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body text-center">
                        <h4 class="card-number" id="eventos-hoy-cal">0</h4>
                        <p class="mb-0">Eventos Hoy</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body text-center">
                        <h4 class="card-number" id="eventos-semana">0</h4>
                        <p class="mb-0">Esta Semana</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body text-center">
                        <h4 class="card-number" id="eventos-mes-cal">0</h4>
                        <p class="mb-0">Este Mes</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body text-center">
                        <h4 class="card-number" id="proximos-examenes">0</h4>
                        <p class="mb-0">Próximos Exámenes</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendario -->
        <div class="card">
            <div class="card-body">
                <div id="calendar"></div>
            </div>
        </div>

        <!-- Modal para agregar/editar evento -->
        <div class="modal fade" id="eventoModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="eventoModalTitle">
                            <i class="fas fa-calendar-plus me-2"></i>
                            Nuevo Evento
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="eventoForm">
                            <input type="hidden" id="eventoId">
                            
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="tituloEvento" class="form-label">Título del Evento *</label>
                                        <input type="text" class="form-control" id="tituloEvento" name="title" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="tipoEvento" class="form-label">Tipo *</label>
                                        <select class="form-select" id="tipoEvento" name="tipo" required>
                                            <option value="">Seleccionar tipo</option>
                                            <option value="Académico">Académico</option>
                                            <option value="Examen">Examen</option>
                                            <option value="Festivo">Festivo</option>
                                            <option value="Reunión">Reunión</option>
                                            <option value="Actividad">Actividad</option>
                                            <option value="Capacitación">Capacitación</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaInicio" class="form-label">Fecha de Inicio *</label>
                                        <input type="datetime-local" class="form-control" id="fechaInicio" name="start" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="fechaFin" class="form-label">Fecha de Fin</label>
                                        <input type="datetime-local" class="form-control" id="fechaFin" name="end">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="ubicacion" class="form-label">Ubicación</label>
                                        <input type="text" class="form-control" id="ubicacion" name="ubicacion" 
                                               placeholder="Ej: Aula 1, Laboratorio, Patio">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="responsable" class="form-label">Responsable</label>
                                        <input type="text" class="form-control" id="responsable" name="responsable">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="descripcionEvento" class="form-label">Descripción</label>
                                <textarea class="form-control" id="descripcionEvento" name="descripcion" rows="3"></textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="colorEvento" class="form-label">Color del Evento</label>
                                        <select class="form-select" id="colorEvento" name="backgroundColor">
                                            <option value="#3498db">Azul (Por defecto)</option>
                                            <option value="#2ecc71">Verde (Académico)</option>
                                            <option value="#e74c3c">Rojo (Examen)</option>
                                            <option value="#f39c12">Naranja (Festivo)</option>
                                            <option value="#9b59b6">Morado (Reunión)</option>
                                            <option value="#1abc9c">Turquesa (Actividad)</option>
                                            <option value="#34495e">Gris (Capacitación)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="prioridad" class="form-label">Prioridad</label>
                                        <select class="form-select" id="prioridad" name="prioridad">
                                            <option value="Baja">Baja</option>
                                            <option value="Media" selected>Media</option>
                                            <option value="Alta">Alta</option>
                                            <option value="Crítica">Crítica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="todoElDia" name="allDay">
                                        <label class="form-check-label" for="todoElDia">
                                            Evento de todo el día
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="recordatorio" name="recordatorio">
                                        <label class="form-check-label" for="recordatorio">
                                            Enviar recordatorio
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="participantes" class="form-label">Participantes</label>
                                <textarea class="form-control" id="participantes" name="participantes" rows="2" 
                                          placeholder="Lista de participantes (separados por comas)"></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="notasEvento" class="form-label">Notas Adicionales</label>
                                <textarea class="form-control" id="notasEvento" name="notas" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEvento()">
                            <i class="fas fa-save me-1"></i> Guardar Evento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Establecer año actual por defecto
    document.getElementById('filterAno').value = new Date().getFullYear().toString();
    
    // Cargar datos y inicializar calendario
    loadEventosData();
    initializeCalendar();
}

// Función para cargar datos de eventos
function loadEventosData() {
    try {
        eventosData = db.getEventos();
        updateEventosStats();
        if (calendar) {
            calendar.refetchEvents();
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        showAlert.error('Error', 'No se pudieron cargar los eventos');
    }
}

// Función para actualizar estadísticas de eventos
function updateEventosStats() {
    const eventos = db.getEventos();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    // Eventos hoy
    const eventosHoy = eventos.filter(evento => {
        const fechaEvento = new Date(evento.start);
        fechaEvento.setHours(0, 0, 0, 0);
        return fechaEvento.getTime() === hoy.getTime();
    }).length;
    
    // Eventos esta semana
    const eventosSemana = eventos.filter(evento => {
        const fechaEvento = new Date(evento.start);
        return fechaEvento >= inicioSemana && fechaEvento <= finSemana;
    }).length;
    
    // Eventos este mes
    const eventosMes = eventos.filter(evento => {
        const fechaEvento = new Date(evento.start);
        return fechaEvento >= inicioMes && fechaEvento <= finMes;
    }).length;
    
    // Próximos exámenes (próximos 30 días)
    const proximosMes = new Date(hoy);
    proximosMes.setDate(hoy.getDate() + 30);
    
    const proximosExamenes = eventos.filter(evento => {
        const fechaEvento = new Date(evento.start);
        return evento.tipo === 'Examen' && fechaEvento >= hoy && fechaEvento <= proximosMes;
    }).length;
    
    // Actualizar UI
    document.getElementById('eventos-hoy-cal').textContent = eventosHoy;
    document.getElementById('eventos-semana').textContent = eventosSemana;
    document.getElementById('eventos-mes-cal').textContent = eventosMes;
    document.getElementById('proximos-examenes').textContent = proximosExamenes;
}

// Función para inicializar el calendario
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            list: 'Lista'
        },
        dayHeaderFormat: { weekday: 'long' },
        events: function(info, successCallback) {
            const eventos = getFilteredEventos();
            successCallback(eventos);
        },
        eventClick: function(info) {
            viewEvento(info.event.id);
        },
        dateClick: function(info) {
            showAddEventoModal(info.dateStr);
        },
        eventMouseEnter: function(info) {
            // Mostrar tooltip con información del evento
            info.el.title = `${info.event.title}\nTipo: ${info.event.extendedProps.tipo || 'Sin tipo'}\nHora: ${info.event.start.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
        },
        eventDidMount: function(info) {
            // Personalizar la apariencia de los eventos según su tipo
            const tipo = info.event.extendedProps.tipo;
            if (tipo) {
                info.el.classList.add(`evento-${tipo.toLowerCase()}`);
            }
        }
    });
    
    calendar.render();
}

// Función para obtener eventos filtrados
function getFilteredEventos() {
    let eventos = [...eventosData];
    
    const tipoFilter = document.getElementById('filterTipoEvento')?.value;
    const searchTerm = document.getElementById('searchEventos')?.value;
    
    if (tipoFilter) {
        eventos = eventos.filter(evento => evento.tipo === tipoFilter);
    }
    
    if (searchTerm) {
        eventos = eventos.filter(evento => 
            evento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (evento.descripcion && evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    return eventos;
}

// Función para mostrar modal de nuevo evento
function showAddEventoModal(fechaSeleccionada = null) {
    document.getElementById('eventoModalTitle').innerHTML = 
        '<i class="fas fa-calendar-plus me-2"></i>Nuevo Evento';
    document.getElementById('eventoId').value = '';
    clearForm(document.getElementById('eventoForm'));
    
    // Si se seleccionó una fecha, usarla como fecha de inicio
    if (fechaSeleccionada) {
        const fecha = new Date(fechaSeleccionada);
        fecha.setHours(9, 0); // 9:00 AM por defecto
        document.getElementById('fechaInicio').value = fecha.toISOString().slice(0, 16);
        
        const fechaFin = new Date(fecha);
        fechaFin.setHours(10, 0); // 10:00 AM por defecto
        document.getElementById('fechaFin').value = fechaFin.toISOString().slice(0, 16);
    } else {
        // Fecha actual + 1 hora
        const ahora = new Date();
        ahora.setMinutes(0, 0, 0);
        document.getElementById('fechaInicio').value = ahora.toISOString().slice(0, 16);
        
        ahora.setHours(ahora.getHours() + 1);
        document.getElementById('fechaFin').value = ahora.toISOString().slice(0, 16);
    }
    
    const modal = new bootstrap.Modal(document.getElementById('eventoModal'));
    modal.show();
}

// Función para editar evento
function editEvento(id) {
    const evento = db.getEventoById(id);
    if (!evento) {
        showAlert.error('Error', 'Evento no encontrado');
        return;
    }
    
    document.getElementById('eventoModalTitle').innerHTML = 
        '<i class="fas fa-edit me-2"></i>Editar Evento';
    
    // Llenar formulario
    document.getElementById('eventoId').value = evento.id;
    document.getElementById('tituloEvento').value = evento.title || '';
    document.getElementById('tipoEvento').value = evento.tipo || '';
    document.getElementById('fechaInicio').value = new Date(evento.start).toISOString().slice(0, 16);
    
    if (evento.end) {
        document.getElementById('fechaFin').value = new Date(evento.end).toISOString().slice(0, 16);
    }
    
    document.getElementById('ubicacion').value = evento.ubicacion || '';
    document.getElementById('responsable').value = evento.responsable || '';
    document.getElementById('descripcionEvento').value = evento.descripcion || '';
    document.getElementById('colorEvento').value = evento.backgroundColor || '#3498db';
    document.getElementById('prioridad').value = evento.prioridad || 'Media';
    document.getElementById('todoElDia').checked = evento.allDay || false;
    document.getElementById('recordatorio').checked = evento.recordatorio || false;
    document.getElementById('participantes').value = evento.participantes || '';
    document.getElementById('notasEvento').value = evento.notas || '';
    
    const modal = new bootstrap.Modal(document.getElementById('eventoModal'));
    modal.show();
}

// Función para ver detalles del evento
function viewEvento(id) {
    const evento = db.getEventoById(id);
    if (!evento) {
        showAlert.error('Error', 'Evento no encontrado');
        return;
    }
    
    const fechaInicio = new Date(evento.start);
    const fechaFin = evento.end ? new Date(evento.end) : null;
    
    Swal.fire({
        title: evento.title,
        html: `
            <div class="text-start">
                <p><strong>Tipo:</strong> <span class="badge bg-primary">${evento.tipo || 'Sin tipo'}</span></p>
                <p><strong>Fecha de Inicio:</strong> ${fechaInicio.toLocaleString('es-ES')}</p>
                ${fechaFin ? `<p><strong>Fecha de Fin:</strong> ${fechaFin.toLocaleString('es-ES')}</p>` : ''}
                ${evento.allDay ? '<p><span class="badge bg-info">Evento de todo el día</span></p>' : ''}
                ${evento.ubicacion ? `<p><strong>Ubicación:</strong> ${evento.ubicacion}</p>` : ''}
                ${evento.responsable ? `<p><strong>Responsable:</strong> ${evento.responsable}</p>` : ''}
                ${evento.descripcion ? `<p><strong>Descripción:</strong> ${evento.descripcion}</p>` : ''}
                <p><strong>Prioridad:</strong> <span class="badge ${getPrioridadClass(evento.prioridad)}">${evento.prioridad || 'Media'}</span></p>
                ${evento.participantes ? `<p><strong>Participantes:</strong> ${evento.participantes}</p>` : ''}
                ${evento.notas ? `<p><strong>Notas:</strong> ${evento.notas}</p>` : ''}
            </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: '<i class="fas fa-edit"></i> Editar',
        cancelButtonText: '<i class="fas fa-trash"></i> Eliminar',
        cancelButtonColor: '#dc3545',
        width: '600px'
    }).then((result) => {
        if (result.isDenied) {
            editEvento(id);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            deleteEvento(id);
        }
    });
}

// Función para obtener clase CSS según prioridad
function getPrioridadClass(prioridad) {
    switch (prioridad) {
        case 'Baja': return 'bg-secondary';
        case 'Media': return 'bg-primary';
        case 'Alta': return 'bg-warning';
        case 'Crítica': return 'bg-danger';
        default: return 'bg-primary';
    }
}

// Función para guardar evento
function saveEvento() {
    const form = document.getElementById('eventoForm');
    
    if (!validateForm(form)) {
        showAlert.warning('Datos Incompletos', 'Por favor complete todos los campos requeridos');
        return;
    }
    
    const formData = new FormData(form);
    const eventoData = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'allDay' || key === 'recordatorio') {
            eventoData[key] = true;
        } else {
            eventoData[key] = value;
        }
    }
    
    // Validar fechas
    const fechaInicio = new Date(eventoData.start);
    const fechaFin = eventoData.end ? new Date(eventoData.end) : null;
    
    if (fechaFin && fechaFin <= fechaInicio) {
        showAlert.warning('Fechas Inválidas', 'La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }
    
    const eventoId = document.getElementById('eventoId').value;
    
    try {
        if (eventoId) {
            // Actualizar evento existente
            db.updateEvento(eventoId, eventoData);
            showAlert.success('¡Actualizado!', 'Evento actualizado correctamente');
        } else {
            // Crear nuevo evento
            db.insertEvento(eventoData);
            showAlert.success('¡Guardado!', 'Evento creado correctamente');
        }
        
        // Cerrar modal y actualizar calendario
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventoModal'));
        modal.hide();
        
        loadEventosData();
        
    } catch (error) {
        console.error('Error al guardar evento:', error);
        showAlert.error('Error', 'No se pudo guardar el evento');
    }
}

// Función para eliminar evento
function deleteEvento(id) {
    const evento = db.getEventoById(id);
    if (!evento) {
        showAlert.error('Error', 'Evento no encontrado');
        return;
    }
    
    showAlert.confirm(
        '¿Eliminar Evento?',
        `¿Estás seguro de que deseas eliminar el evento "${evento.title}"?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.deleteEvento(id);
                showAlert.success('¡Eliminado!', 'Evento eliminado correctamente');
                loadEventosData();
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                showAlert.error('Error', 'No se pudo eliminar el evento');
            }
        }
    });
}

// Función para filtrar eventos
function filterEventos() {
    if (calendar) {
        calendar.refetchEvents();
    }
}

// Función para cambiar vista del calendario
function changeCalendarView(view) {
    if (calendar) {
        calendar.changeView(view);
        
        // Actualizar botones activos
        document.querySelectorAll('.btn-group button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

// Función para ir a un mes específico
function goToMonth() {
    const mes = document.getElementById('filterMes').value;
    const ano = document.getElementById('filterAno').value;
    
    if (calendar && mes !== '') {
        const fecha = new Date(parseInt(ano), parseInt(mes), 1);
        calendar.gotoDate(fecha);
    }
}

// Función para exportar eventos
function exportEventos() {
    if (eventosData.length === 0) {
        showAlert.warning('Sin Datos', 'No hay eventos para exportar');
        return;
    }
    
    const dataToExport = eventosData.map(evento => ({
        'Título': evento.title,
        'Tipo': evento.tipo || '',
        'Fecha de Inicio': formatDate(evento.start, true),
        'Fecha de Fin': evento.end ? formatDate(evento.end, true) : '',
        'Todo el Día': evento.allDay ? 'Sí' : 'No',
        'Ubicación': evento.ubicacion || '',
        'Responsable': evento.responsable || '',
        'Prioridad': evento.prioridad || 'Media',
        'Descripción': evento.descripcion || '',
        'Participantes': evento.participantes || '',
        'Notas': evento.notas || ''
    }));
    
    exportToExcel('Calendario de Eventos', dataToExport, 'calendario_eventos');
}

// Función para imprimir calendario
function printCalendario() {
    const currentDate = calendar.getDate();
    const currentView = calendar.view.type;
    
    let titulo = '';
    let eventos = [];
    
    if (currentView === 'dayGridMonth') {
        titulo = `Calendario - ${currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
        // Obtener eventos del mes actual
        const inicioMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const finMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        eventos = eventosData.filter(evento => {
            const fechaEvento = new Date(evento.start);
            return fechaEvento >= inicioMes && fechaEvento <= finMes;
        });
    } else {
        eventos = getFilteredEventos();
        titulo = 'Calendario de Eventos';
    }
    
    if (eventos.length === 0) {
        showAlert.warning('Sin Eventos', 'No hay eventos para imprimir en el período seleccionado');
        return;
    }
    
    const printData = eventos.map(evento => ({
        'Fecha': formatDateShort(evento.start),
        'Hora': evento.allDay ? 'Todo el día' : new Date(evento.start).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}),
        'Evento': evento.title,
        'Tipo': evento.tipo || '',
        'Ubicación': evento.ubicacion || ''
    }));
    
    exportToPDF(titulo, printData, [
        { key: 'Fecha', header: 'Fecha', width: 25 },
        { key: 'Hora', header: 'Hora', width: 20 },
        { key: 'Evento', header: 'Evento', width: 60 },
        { key: 'Tipo', header: 'Tipo', width: 25 },
        { key: 'Ubicación', header: 'Ubicación', width: 40 }
    ]);
}

// Exponer funciones globalmente
window.loadCalendarioSection = loadCalendarioSection;
window.showAddEventoModal = showAddEventoModal;
window.editEvento = editEvento;
window.viewEvento = viewEvento;
window.saveEvento = saveEvento;
window.deleteEvento = deleteEvento;
window.filterEventos = filterEventos;
window.changeCalendarView = changeCalendarView;
window.goToMonth = goToMonth;
window.exportEventos = exportEventos;
window.printCalendario = printCalendario;
