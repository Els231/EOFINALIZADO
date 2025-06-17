/**
 * Módulo de calendario escolar
 * Sistema completo de gestión de eventos y calendario académico
 */

let calendar;
let currentCalendarView = 'dayGridMonth';

// Función principal para cargar la sección de calendario
function loadCalendarioSection() {
    const section = document.getElementById('calendario-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-calendar me-2"></i>
                    Calendario Escolar
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showEventoModal()">
                            <i class="fas fa-plus me-1"></i> Nuevo Evento
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="exportarCalendario()">
                            <i class="fas fa-file-excel me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="syncCalendar()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros rápidos -->
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <select class="form-select" id="filter-tipo-evento" onchange="filterCalendarEvents()">
                                    <option value="">Todos los eventos</option>
                                    <option value="Académico">Académico</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Deportivo">Deportivo</option>
                                    <option value="Evaluación">Evaluación</option>
                                    <option value="Reunión">Reunión</option>
                                    <option value="Feriado">Feriado</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" id="filter-grado" onchange="filterCalendarEvents()">
                                    <option value="">Todos los grados</option>
                                    <option value="1">1° Grado</option>
                                    <option value="2">2° Grado</option>
                                    <option value="3">3° Grado</option>
                                    <option value="4">4° Grado</option>
                                    <option value="5">5° Grado</option>
                                    <option value="6">6° Grado</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="show-past-events" checked onchange="filterCalendarEvents()">
                                    <label class="form-check-label" for="show-past-events">
                                        Mostrar eventos pasados
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <button type="button" class="btn btn-outline-secondary w-100" onclick="clearCalendarFilters()">
                                    <i class="fas fa-times me-1"></i> Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="total-eventos">0</div>
                                <div class="small">Total Eventos</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-calendar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="eventos-mes">0</div>
                                <div class="small">Este Mes</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-calendar-day fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="eventos-proximos">0</div>
                                <div class="small">Próximos 7 días</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="h4 mb-0" id="evaluaciones-pendientes">0</div>
                                <div class="small">Evaluaciones Pendientes</div>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clipboard-check fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pestañas -->
        <ul class="nav nav-tabs mb-3" id="calendarioTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="calendario-tab" data-bs-toggle="tab" data-bs-target="#calendario" type="button" role="tab">
                    <i class="fas fa-calendar me-2"></i> Calendario
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="proximos-eventos-tab" data-bs-toggle="tab" data-bs-target="#proximos-eventos" type="button" role="tab">
                    <i class="fas fa-list me-2"></i> Próximos Eventos
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="plantillas-tab" data-bs-toggle="tab" data-bs-target="#plantillas" type="button" role="tab">
                    <i class="fas fa-copy me-2"></i> Plantillas
                </button>
            </li>
        </ul>

        <!-- Contenido de las pestañas -->
        <div class="tab-content" id="calendarioTabContent">
            <!-- Pestaña del calendario -->
            <div class="tab-pane fade show active" id="calendario" role="tabpanel">
                <div class="card">
                    <div class="card-body">
                        <div id="calendar-container">
                            <!-- El calendario se renderiza aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de próximos eventos -->
            <div class="tab-pane fade" id="proximos-eventos" role="tabpanel">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Próximos Eventos</h6>
                    </div>
                    <div class="card-body">
                        <div id="proximos-eventos-lista">
                            <!-- Lista de próximos eventos -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pestaña de plantillas -->
            <div class="tab-pane fade" id="plantillas" role="tabpanel">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">Plantillas de Eventos</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <div class="card border-primary">
                                    <div class="card-body text-center">
                                        <i class="fas fa-graduation-cap fa-2x text-primary mb-2"></i>
                                        <h6>Evaluación</h6>
                                        <button class="btn btn-sm btn-primary" onclick="createEventFromTemplate('evaluacion')">
                                            Crear Evento
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card border-success">
                                    <div class="card-body text-center">
                                        <i class="fas fa-users fa-2x text-success mb-2"></i>
                                        <h6>Reunión de Padres</h6>
                                        <button class="btn btn-sm btn-success" onclick="createEventFromTemplate('reunion')">
                                            Crear Evento
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <div class="card border-warning">
                                    <div class="card-body text-center">
                                        <i class="fas fa-music fa-2x text-warning mb-2"></i>
                                        <h6>Evento Cultural</h6>
                                        <button class="btn btn-sm btn-warning" onclick="createEventFromTemplate('cultural')">
                                            Crear Evento
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de evento -->
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
                            <input type="hidden" id="evento-id">
                            
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="evento-titulo" class="form-label">Título del Evento *</label>
                                        <input type="text" class="form-control" id="evento-titulo" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="evento-tipo" class="form-label">Tipo *</label>
                                        <select class="form-select" id="evento-tipo" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="Académico">Académico</option>
                                            <option value="Administrativo">Administrativo</option>
                                            <option value="Cultural">Cultural</option>
                                            <option value="Deportivo">Deportivo</option>
                                            <option value="Evaluación">Evaluación</option>
                                            <option value="Reunión">Reunión</option>
                                            <option value="Feriado">Feriado</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-fecha-inicio" class="form-label">Fecha de Inicio *</label>
                                        <input type="date" class="form-control" id="evento-fecha-inicio" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-fecha-fin" class="form-label">Fecha de Fin</label>
                                        <input type="date" class="form-control" id="evento-fecha-fin">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-hora-inicio" class="form-label">Hora de Inicio</label>
                                        <input type="time" class="form-control" id="evento-hora-inicio">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-hora-fin" class="form-label">Hora de Fin</label>
                                        <input type="time" class="form-control" id="evento-hora-fin">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-grado" class="form-label">Grado Involucrado</label>
                                        <select class="form-select" id="evento-grado">
                                            <option value="">Todos los grados</option>
                                            <option value="1">1° Grado</option>
                                            <option value="2">2° Grado</option>
                                            <option value="3">3° Grado</option>
                                            <option value="4">4° Grado</option>
                                            <option value="5">5° Grado</option>
                                            <option value="6">6° Grado</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="evento-responsable" class="form-label">Responsable</label>
                                        <select class="form-select" id="evento-responsable">
                                            <option value="">Seleccionar responsable...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="evento-lugar" class="form-label">Lugar</label>
                                <input type="text" class="form-control" id="evento-lugar" placeholder="Ej: Aula 101, Patio, Laboratorio...">
                            </div>

                            <div class="mb-3">
                                <label for="evento-descripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="evento-descripcion" rows="3"></textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="evento-todo-el-dia">
                                        <label class="form-check-label" for="evento-todo-el-dia">
                                            Evento de todo el día
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="evento-recordatorio">
                                        <label class="form-check-label" for="evento-recordatorio">
                                            Enviar recordatorio
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEvento()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar calendario
    initializeCalendar();
    loadCalendarResponsables();
    updateCalendarStats();
    loadProximosEventos();
}

// Función para inicializar FullCalendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar-container');
    
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                list: 'Lista'
            },
            events: getCalendarEvents(),
            selectable: true,
            selectMirror: true,
            select: function(selectInfo) {
                showEventoModal(null, selectInfo.startStr);
            },
            eventClick: function(clickInfo) {
                viewEvento(clickInfo.event.id);
            },
            eventDidMount: function(info) {
                // Personalizar la apariencia de los eventos
                const eventType = info.event.extendedProps.tipo;
                const color = getEventTypeColor(eventType);
                info.el.style.backgroundColor = color;
                info.el.style.borderColor = color;
            },
            dayMaxEvents: 3,
            moreLinkClick: 'popover',
            height: 'auto'
        });
        
        calendar.render();
    }
}

// Función para obtener eventos del calendario
function getCalendarEvents() {
    const eventos = db.read('eventos');
    const filters = getActiveFilters();
    
    return eventos
        .filter(evento => applyEventFilters(evento, filters))
        .map(evento => ({
            id: evento.id,
            title: evento.titulo,
            start: evento.fecha_inicio + (evento.hora_inicio ? 'T' + evento.hora_inicio : ''),
            end: evento.fecha_fin ? 
                (evento.fecha_fin + (evento.hora_fin ? 'T' + evento.hora_fin : '')) : 
                null,
            allDay: evento.todo_el_dia || !evento.hora_inicio,
            extendedProps: {
                tipo: evento.tipo,
                descripcion: evento.descripcion,
                lugar: evento.lugar,
                grado: evento.grado,
                responsable: evento.responsable
            }
        }));
}

// Función para obtener filtros activos
function getActiveFilters() {
    return {
        tipo: document.getElementById('filter-tipo-evento')?.value || '',
        grado: document.getElementById('filter-grado')?.value || '',
        showPast: document.getElementById('show-past-events')?.checked !== false
    };
}

// Función para aplicar filtros a eventos
function applyEventFilters(evento, filters) {
    // Filtro por tipo
    if (filters.tipo && evento.tipo !== filters.tipo) {
        return false;
    }
    
    // Filtro por grado
    if (filters.grado && evento.grado && evento.grado !== filters.grado) {
        return false;
    }
    
    // Filtro por eventos pasados
    if (!filters.showPast) {
        const today = new Date().toISOString().split('T')[0];
        if (evento.fecha_inicio < today) {
            return false;
        }
    }
    
    return true;
}

// Función para obtener color por tipo de evento
function getEventTypeColor(tipo) {
    const colors = {
        'Académico': '#007bff',
        'Administrativo': '#6c757d',
        'Cultural': '#17a2b8',
        'Deportivo': '#28a745',
        'Evaluación': '#dc3545',
        'Reunión': '#ffc107',
        'Feriado': '#fd7e14',
        'Otro': '#6f42c1'
    };
    return colors[tipo] || '#6c757d';
}

// Función para cargar responsables
function loadCalendarResponsables() {
    const profesores = db.read('profesores').filter(p => p.estado === 'Activo');
    const responsableSelect = document.getElementById('evento-responsable');
    
    if (responsableSelect) {
        responsableSelect.innerHTML = '<option value="">Seleccionar responsable...</option>';
        
        profesores.forEach(profesor => {
            const option = document.createElement('option');
            option.value = profesor.id;
            option.textContent = `${profesor.nombre} ${profesor.apellido}`;
            responsableSelect.appendChild(option);
        });
    }
}

// Función para actualizar estadísticas del calendario
function updateCalendarStats() {
    try {
        const eventos = db.read('eventos');
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Total eventos
        document.getElementById('total-eventos').textContent = eventos.length;
        
        // Eventos este mes
        const eventosMes = eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_inicio);
            return fechaEvento.getMonth() === currentMonth && fechaEvento.getFullYear() === currentYear;
        });
        document.getElementById('eventos-mes').textContent = eventosMes.length;
        
        // Eventos próximos 7 días
        const proximosSieteDias = new Date();
        proximosSieteDias.setDate(proximosSieteDias.getDate() + 7);
        
        const eventosProximos = eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_inicio);
            return fechaEvento >= currentDate && fechaEvento <= proximosSieteDias;
        });
        document.getElementById('eventos-proximos').textContent = eventosProximos.length;
        
        // Evaluaciones pendientes
        const evaluacionesPendientes = eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha_inicio);
            return evento.tipo === 'Evaluación' && fechaEvento >= currentDate;
        });
        document.getElementById('evaluaciones-pendientes').textContent = evaluacionesPendientes.length;
        
    } catch (error) {
        console.error('Error actualizando estadísticas del calendario:', error);
    }
}

// Función para cargar próximos eventos
function loadProximosEventos() {
    try {
        const eventos = db.read('eventos');
        const profesores = db.read('profesores');
        const container = document.getElementById('proximos-eventos-lista');
        
        if (!container) return;
        
        const currentDate = new Date();
        const eventosProximos = eventos
            .filter(evento => new Date(evento.fecha_inicio) >= currentDate)
            .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
            .slice(0, 10);
        
        if (eventosProximos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h5>No hay eventos próximos</h5>
                    <p class="text-muted">Agregue eventos al calendario para verlos aquí</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = eventosProximos.map(evento => {
            const responsable = profesores.find(p => p.id === evento.responsable);
            const diasHasta = Math.ceil((new Date(evento.fecha_inicio) - currentDate) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-1">
                                <div class="text-center">
                                    <div class="badge" style="background-color: ${getEventTypeColor(evento.tipo)}">
                                        ${formatDateShort(evento.fecha_inicio).split('/')[0]}
                                    </div>
                                    <small class="text-muted d-block">
                                        ${formatDateShort(evento.fecha_inicio).split('/').slice(1).join('/')}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-7">
                                <h6 class="mb-1">${evento.titulo}</h6>
                                <p class="mb-1 text-muted">${evento.descripcion || 'Sin descripción'}</p>
                                <small class="text-muted">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    ${evento.lugar || 'Lugar no especificado'}
                                    ${evento.grado ? ` | ${evento.grado}° Grado` : ''}
                                </small>
                            </div>
                            <div class="col-md-2">
                                <span class="badge bg-${getEventTypeColor(evento.tipo)}">${evento.tipo}</span>
                                ${responsable ? `<div class="small text-muted mt-1">${responsable.nombre} ${responsable.apellido}</div>` : ''}
                            </div>
                            <div class="col-md-2 text-end">
                                <div class="small text-muted">
                                    ${diasHasta === 0 ? 'Hoy' : 
                                      diasHasta === 1 ? 'Mañana' : 
                                      `En ${diasHasta} días`}
                                </div>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary" onclick="editEvento('${evento.id}')" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline-info" onclick="viewEvento('${evento.id}')" title="Ver">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error cargando próximos eventos:', error);
    }
}

// Función para mostrar modal de evento
function showEventoModal(eventoId = null, fechaInicial = null) {
    const modal = new bootstrap.Modal(document.getElementById('eventoModal'));
    const title = document.getElementById('eventoModalTitle');
    const form = document.getElementById('eventoForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('evento-id').value = '';
    
    if (eventoId) {
        // Modo edición
        title.innerHTML = '<i class="fas fa-calendar-plus me-2"></i>Editar Evento';
        const evento = db.find('eventos', eventoId);
        
        if (evento) {
            document.getElementById('evento-id').value = evento.id;
            document.getElementById('evento-titulo').value = evento.titulo;
            document.getElementById('evento-tipo').value = evento.tipo;
            document.getElementById('evento-fecha-inicio').value = evento.fecha_inicio;
            document.getElementById('evento-fecha-fin').value = evento.fecha_fin || '';
            document.getElementById('evento-hora-inicio').value = evento.hora_inicio || '';
            document.getElementById('evento-hora-fin').value = evento.hora_fin || '';
            document.getElementById('evento-grado').value = evento.grado || '';
            document.getElementById('evento-responsable').value = evento.responsable || '';
            document.getElementById('evento-lugar').value = evento.lugar || '';
            document.getElementById('evento-descripcion').value = evento.descripcion || '';
            document.getElementById('evento-todo-el-dia').checked = evento.todo_el_dia || false;
            document.getElementById('evento-recordatorio').checked = evento.recordatorio || false;
        }
    } else {
        // Modo creación
        title.innerHTML = '<i class="fas fa-calendar-plus me-2"></i>Nuevo Evento';
        if (fechaInicial) {
            document.getElementById('evento-fecha-inicio').value = fechaInicial;
        } else {
            document.getElementById('evento-fecha-inicio').value = new Date().toISOString().split('T')[0];
        }
    }
    
    modal.show();
}

// Función para guardar evento
function saveEvento() {
    try {
        const form = document.getElementById('eventoForm');
        
        const eventoData = {
            titulo: document.getElementById('evento-titulo').value.trim(),
            tipo: document.getElementById('evento-tipo').value,
            fecha_inicio: document.getElementById('evento-fecha-inicio').value,
            fecha_fin: document.getElementById('evento-fecha-fin').value || null,
            hora_inicio: document.getElementById('evento-hora-inicio').value || null,
            hora_fin: document.getElementById('evento-hora-fin').value || null,
            grado: document.getElementById('evento-grado').value || null,
            responsable: document.getElementById('evento-responsable').value || null,
            lugar: document.getElementById('evento-lugar').value.trim() || null,
            descripcion: document.getElementById('evento-descripcion').value.trim() || null,
            todo_el_dia: document.getElementById('evento-todo-el-dia').checked,
            recordatorio: document.getElementById('evento-recordatorio').checked
        };
        
        // Validaciones
        const validationRules = {
            titulo: { required: true, label: 'Título' },
            tipo: { required: true, label: 'Tipo' },
            fecha_inicio: { required: true, type: 'date', label: 'Fecha de inicio' }
        };
        
        const errors = validateFormData(eventoData, validationRules);
        
        if (errors.length > 0) {
            showGlobalAlert('Errores de validación:<br>• ' + errors.join('<br>• '), 'error');
            return;
        }
        
        // Validar fechas
        if (eventoData.fecha_fin && eventoData.fecha_fin < eventoData.fecha_inicio) {
            showGlobalAlert('La fecha de fin no puede ser anterior a la fecha de inicio', 'error');
            return;
        }
        
        const eventoId = document.getElementById('evento-id').value;
        
        if (eventoId) {
            // Actualizar evento existente
            db.update('eventos', eventoId, eventoData);
            showGlobalAlert('Evento actualizado correctamente', 'success');
        } else {
            // Crear nuevo evento
            db.create('eventos', eventoData);
            showGlobalAlert('Evento creado correctamente', 'success');
        }
        
        // Cerrar modal y recargar calendario
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventoModal'));
        modal.hide();
        refreshCalendar();
        
    } catch (error) {
        console.error('Error guardando evento:', error);
        showGlobalAlert('Error al guardar evento: ' + error.message, 'error');
    }
}

// Función para editar evento
function editEvento(eventoId) {
    showEventoModal(eventoId);
}

// Función para ver detalles de evento
function viewEvento(eventoId) {
    const evento = db.find('eventos', eventoId);
    if (!evento) {
        showGlobalAlert('Evento no encontrado', 'error');
        return;
    }
    
    const profesores = db.read('profesores');
    const responsable = profesores.find(p => p.id === evento.responsable);
    
    Swal.fire({
        title: evento.titulo,
        html: `
            <div class="text-start">
                <div class="row">
                    <div class="col-6"><strong>Tipo:</strong></div>
                    <div class="col-6">
                        <span class="badge" style="background-color: ${getEventTypeColor(evento.tipo)}">
                            ${evento.tipo}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6"><strong>Fecha de Inicio:</strong></div>
                    <div class="col-6">${formatDate(evento.fecha_inicio)}</div>
                </div>
                ${evento.fecha_fin ? `
                    <div class="row">
                        <div class="col-6"><strong>Fecha de Fin:</strong></div>
                        <div class="col-6">${formatDate(evento.fecha_fin)}</div>
                    </div>
                ` : ''}
                ${evento.hora_inicio ? `
                    <div class="row">
                        <div class="col-6"><strong>Hora:</strong></div>
                        <div class="col-6">${evento.hora_inicio}${evento.hora_fin ? ' - ' + evento.hora_fin : ''}</div>
                    </div>
                ` : ''}
                ${evento.lugar ? `
                    <div class="row">
                        <div class="col-6"><strong>Lugar:</strong></div>
                        <div class="col-6">${evento.lugar}</div>
                    </div>
                ` : ''}
                ${evento.grado ? `
                    <div class="row">
                        <div class="col-6"><strong>Grado:</strong></div>
                        <div class="col-6">${evento.grado}° Grado</div>
                    </div>
                ` : ''}
                ${responsable ? `
                    <div class="row">
                        <div class="col-6"><strong>Responsable:</strong></div>
                        <div class="col-6">${responsable.nombre} ${responsable.apellido}</div>
                    </div>
                ` : ''}
                ${evento.descripcion ? `
                    <div class="row mt-2">
                        <div class="col-12"><strong>Descripción:</strong></div>
                        <div class="col-12">${evento.descripcion}</div>
                    </div>
                ` : ''}
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        showCancelButton: true,
        cancelButtonText: 'Editar',
        cancelButtonColor: '#007bff'
    }).then((result) => {
        if (result.isDismissed) {
            editEvento(eventoId);
        }
    });
}

// Función para crear evento desde plantilla
function createEventFromTemplate(tipo) {
    const plantillas = {
        evaluacion: {
            titulo: 'Evaluación de ',
            tipo: 'Evaluación',
            hora_inicio: '08:00',
            hora_fin: '10:00'
        },
        reunion: {
            titulo: 'Reunión de Padres de Familia',
            tipo: 'Reunión',
            hora_inicio: '14:00',
            hora_fin: '16:00',
            lugar: 'Aula Principal'
        },
        cultural: {
            titulo: 'Evento Cultural',
            tipo: 'Cultural',
            hora_inicio: '09:00',
            hora_fin: '11:00',
            lugar: 'Patio Central'
        }
    };
    
    const plantilla = plantillas[tipo];
    if (plantilla) {
        showEventoModal();
        
        // Aplicar plantilla después de que se abra el modal
        setTimeout(() => {
            Object.entries(plantilla).forEach(([key, value]) => {
                const elemento = document.getElementById(`evento-${key.replace('_', '-')}`);
                if (elemento) {
                    elemento.value = value;
                }
            });
        }, 100);
    }
}

// Función para filtrar eventos del calendario
function filterCalendarEvents() {
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(getCalendarEvents());
    }
    updateCalendarStats();
    loadProximosEventos();
}

// Función para limpiar filtros del calendario
function clearCalendarFilters() {
    document.getElementById('filter-tipo-evento').value = '';
    document.getElementById('filter-grado').value = '';
    document.getElementById('show-past-events').checked = true;
    filterCalendarEvents();
}

// Función para actualizar calendario
function refreshCalendar() {
    if (calendar) {
        calendar.refetchEvents();
    }
    updateCalendarStats();
    loadProximosEventos();
}

// Función para sincronizar calendario
function syncCalendar() {
    showLoading('Sincronizando calendario...');
    
    setTimeout(() => {
        refreshCalendar();
        hideLoading();
        showGlobalAlert('Calendario sincronizado correctamente', 'success');
    }, 1000);
}

// Función para exportar calendario
function exportarCalendario() {
    try {
        const eventos = db.read('eventos');
        const profesores = db.read('profesores');
        
        const exportData = eventos.map(evento => {
            const responsable = profesores.find(p => p.id === evento.responsable);
            
            return {
                'Título': evento.titulo,
                'Tipo': evento.tipo,
                'Fecha de Inicio': formatDateShort(evento.fecha_inicio),
                'Fecha de Fin': evento.fecha_fin ? formatDateShort(evento.fecha_fin) : '',
                'Hora de Inicio': evento.hora_inicio || '',
                'Hora de Fin': evento.hora_fin || '',
                'Todo el Día': evento.todo_el_dia ? 'Sí' : 'No',
                'Lugar': evento.lugar || '',
                'Grado': evento.grado || 'General',
                'Responsable': responsable ? `${responsable.nombre} ${responsable.apellido}` : '',
                'Descripción': evento.descripcion || '',
                'Recordatorio': evento.recordatorio ? 'Sí' : 'No',
                'Fecha de Creación': formatDateShort(evento.created_at)
            };
        });
        
        exportToExcel(exportData, 'calendario_escolar', 'Calendario Escolar');
        
    } catch (error) {
        console.error('Error exportando calendario:', error);
        showGlobalAlert('Error al exportar calendario', 'error');
    }
}

// Exportar funciones
window.loadCalendarioSection = loadCalendarioSection;
window.showEventoModal = showEventoModal;
window.saveEvento = saveEvento;
window.editEvento = editEvento;
window.viewEvento = viewEvento;
window.createEventFromTemplate = createEventFromTemplate;
window.filterCalendarEvents = filterCalendarEvents;
window.clearCalendarFilters = clearCalendarFilters;
window.syncCalendar = syncCalendar;
window.exportarCalendario = exportarCalendario;

console.log('✅ Calendario.js cargado correctamente');
