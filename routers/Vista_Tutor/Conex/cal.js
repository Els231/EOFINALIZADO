 document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendario');
        
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Entrega de boletines',
                    start: '2023-03-27T14:00:00',
                    end: '2023-03-27T16:00:00',
                    className: 'evento-importante'
                },
                {
                    title: 'Suspensión de clases',
                    start: '2023-03-25',
                    className: 'evento-general'
                },
                {
                    title: 'Día del Libro',
                    start: '2023-04-02',
                    className: 'evento-escolar'
                },
                {
                    title: 'Cumpleaños de María',
                    start: '2023-04-05',
                    className: 'evento-familiar'
                },
                {
                    title: 'Reunión de padres 3°A',
                    start: '2023-04-10T16:00:00',
                    end: '2023-04-10T17:30:00',
                    className: 'evento-escolar'
                },
                {
                    title: 'Cambio de uniforme',
                    start: '2023-04-01',
                    className: 'evento-general'
                }
            ],
            eventClick: function(info) {
                alert('Evento: ' + info.event.title + '\nFecha: ' + info.event.start.toLocaleString());
            }
        });
        
        calendar.render();
        
        // Botón "Hoy"
        document.getElementById('btnHoy').addEventListener('click', function() {
            calendar.today();
        });
        
        // Botón para agregar evento
        var modalEvento = new bootstrap.Modal(document.getElementById('modalEvento'));
        
        document.getElementById('btnAgregarEvento').addEventListener('click', function() {
            modalEvento.show();
        });
        
        document.getElementById('btnGuardarEvento').addEventListener('click', function() {
            var titulo = document.getElementById('tituloEvento').value;
            var tipo = document.getElementById('tipoEvento').value;
            var fecha = document.getElementById('fechaEvento').value;
            var horaInicio = document.getElementById('horaInicio').value;
            var horaFin = document.getElementById('horaFin').value;
            var descripcion = document.getElementById('descripcionEvento').value;
            
            if (!titulo || !fecha) {
                alert('Por favor complete los campos obligatorios');
                return;
            }
            
            var evento = {
                title: titulo,
                start: fecha + (horaInicio ? 'T' + horaInicio : ''),
                end: horaFin ? (fecha + 'T' + horaFin) : null,
                className: tipo === 'personal' ? 'evento-familiar' : 
                          tipo === 'escolar' ? 'evento-escolar' : 'evento-importante',
                extendedProps: {
                    description: descripcion
                }
            };
            
            calendar.addEvent(evento);
            modalEvento.hide();
            document.getElementById('formEvento').reset();
            
            // Agregar también a la lista de próximos eventos
            agregarProximoEvento(evento);
        });
        
        function agregarProximoEvento(evento) {
            var eventosContainer = document.querySelector('.proximos-eventos');
            var eventoCard = document.createElement('div');
            eventoCard.className = 'card evento-card ' + 
                (evento.className === 'evento-familiar' ? 'evento-familiar-card' :
                 evento.className === 'evento-escolar' ? 'evento-escolar-card' : 'evento-importante-card') + ' mb-2';
            
            var fechaEvento = new Date(evento.start);
            var fechaFormateada = fechaEvento.toLocaleDateString('es-ES', { 
                day: 'numeric', month: 'short', year: 'numeric' 
            });
            
            var horaFormateada = '';
            if (evento.start.includes('T')) {
                horaFormateada = fechaEvento.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', minute: '2-digit' 
                });
            }
            
            eventoCard.innerHTML = `
                <div class="card-body p-2">
                    <h6 class="card-title mb-1">${evento.title}</h6>
                    <p class="card-text mb-1"><small class="text-muted"><i class="fas fa-calendar-day me-1"></i> ${fechaFormateada}</small></p>
                    ${horaFormateada ? `<p class="card-text mb-0"><small><i class="fas fa-clock me-1"></i> ${horaFormateada}</small></p>` : 
                      '<p class="card-text mb-0"><small><i class="fas fa-info-circle me-1"></i> Todo el día</small></p>'}
                </div>
            `;
            
            eventosContainer.prepend(eventoCard);
        }
    });