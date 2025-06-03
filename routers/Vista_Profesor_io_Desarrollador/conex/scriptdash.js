document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuración inicial del navbar
    const navbar = document.querySelector('.navbar-claro');
    const navbarHeight = navbar.offsetHeight;

    // Ajustar el padding del body para compensar el navbar fijo
    document.body.style.paddingTop = `${navbarHeight}px`;
    document.body.style.transition = 'padding-top 0.3s ease';

    // 2. Comportamiento al hacer scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Cerrar dropdowns al hacer scroll
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });

        // Efecto de contracción del navbar
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
            document.body.style.paddingTop = '60px'; // Altura contraída
        } else {
            navbar.classList.remove('scrolled');
            document.body.style.paddingTop = `${navbarHeight}px`;
        }
    });

    // 3. Cerrar menú en móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // 4. Efecto hover en las filas de la tabla
    const tableRows = document.querySelectorAll('.table-hover tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.2s ease';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // 5. Carrusel automático
    const carousel = document.querySelector('.carousel-auto');
    if (carousel) {
        let currentIndex = 0;
        const items = document.querySelectorAll('.carousel-auto img');
        const totalItems = items.length;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 3000);
    }

    // 6. Notificación de bienvenida
    setTimeout(() => {
        const alertPlaceholder = document.createElement('div');
        alertPlaceholder.className = 'alert alert-success alert-dismissible fade show';
        alertPlaceholder.style.position = 'fixed';
        alertPlaceholder.style.top = '20px';
        alertPlaceholder.style.right = '20px';
        alertPlaceholder.style.zIndex = '1060';
        alertPlaceholder.innerHTML = `
            <strong>¡Éxito!</strong> Bienvenido al Sistema de Gestión Escolar
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertPlaceholder);
    }, 1000);

    // 7. Datos de ejemplo para eventos
    const eventos = [
        {
            id: '1',
            title: 'Reunión de padres - 1er grado',
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 2)),
            description: 'Aula 101 - Todos los padres deben asistir',
            className: 'event-reunion',
            tipo: 'reunion',
            grado: ['1']
        },
        {
            id: '2',
            title: 'Examen de Matemáticas',
            start: new Date(new Date().setDate(new Date().getDate() + 2)),
            end: new Date(new Date().setDate(new Date().getDate() + 2)),
            description: 'Examen del segundo bimestre',
            className: 'event-examen',
            tipo: 'examen',
            grado: ['3', '4']
        },
        {
            id: '3',
            title: 'Excursión al museo',
            start: new Date(new Date().setDate(new Date().getDate() + 5)),
            end: new Date(new Date().setDate(new Date().getDate() + 5)),
            description: '4to grado - Llevar permiso firmado',
            className: 'event-actividad',
            tipo: 'actividad',
            grado: ['4']
        }
    ];

    // 8. Inicializar el calendario
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: eventos,
            eventClick: function(info) {
                mostrarDetallesEvento(info.event);
            },
            eventContent: function(arg) {
                let eventHtml = document.createElement('div');
                eventHtml.className = 'fc-event-main-frame';

                let timeHtml = '';
                if (!arg.event.allDay) {
                    timeHtml = `<div class="fc-event-time">${arg.timeText}</div>`;
                }

                eventHtml.innerHTML = `
                    <div class="fc-event-main">
                        ${timeHtml}
                        <div class="fc-event-title">${arg.event.title}</div>
                    </div>
                `;

                return { domNodes: [eventHtml] };
            }
        });

        calendar.render();

        // Botón "Hoy"
        document.getElementById('btnToday')?.addEventListener('click', function() {
            calendar.today();
        });

        // Botón "Imprimir"
        document.getElementById('btnPrint')?.addEventListener('click', function() {
            window.print();
        });

        // Botón "Filtrar"
        document.getElementById('btnFiltrar')?.addEventListener('click', function() {
            const tipo = document.getElementById('tipoEvento').value;
            const grado = document.getElementById('gradoEvento').value;

            let eventosFiltrados = eventos;

            if (tipo !== 'Todos') {
                eventosFiltrados = eventosFiltrados.filter(evento => {
                    if (tipo === 'Clases') return evento.tipo === 'clase';
                    if (tipo === 'Exámenes') return evento.tipo === 'examen';
                    if (tipo === 'Reuniones') return evento.tipo === 'reunion';
                    if (tipo === 'Actividades') return evento.tipo === 'actividad';
                    if (tipo === 'Feriados') return evento.tipo === 'feriado';
                    return true;
                });
            }

            if (grado !== 'Todos') {
                const gradoNum = grado.charAt(0);
                eventosFiltrados = eventosFiltrados.filter(evento =>
                    evento.grado.includes(gradoNum)
                );
            }

            calendar.removeAllEvents();
            calendar.addEventSource(eventosFiltrados);
        });

        // Guardar nuevo evento
        document.getElementById('btnGuardarEvento')?.addEventListener('click', function() {
            const title = document.getElementById('eventoTitle').value;
            const start = document.getElementById('eventoStart').value;
            const end = document.getElementById('eventoEnd').value;
            const tipo = document.getElementById('eventoType').value;
            const description = document.getElementById('eventoDescription').value;

            if (!title || !start || !tipo) {
                alert('Por favor complete los campos requeridos');
                return;
            }

            const grados = Array.from(document.getElementById('eventoGrado').selectedOptions)
                .map(option => option.value);

            const nuevoEvento = {
                id: Date.now().toString(),
                title: title,
                start: new Date(start),
                end: end ? new Date(end) : null,
                description: description,
                className: `event-${tipo}`,
                tipo: tipo,
                grado: grados.length > 0 ? grados : ['1', '2', '3', '4', '5', '6']
            };

            eventos.push(nuevoEvento);
            calendar.addEvent(nuevoEvento);

            // Cerrar modal y resetear formulario
            bootstrap.Modal.getInstance(document.getElementById('nuevoEventoModal')).hide();
            document.getElementById('eventoForm').reset();
        });
    }

    // 9. Inicializar gráficos
    inicializarGraficos();
});

// Función para mostrar detalles del evento
function mostrarDetallesEvento(evento) {
    alert(`Evento: ${evento.title}\n\nDescripción: ${evento.extendedProps.description || 'Sin descripción'}`);
}

// Función para inicializar gráficos
function inicializarGraficos() {
    // Gráfico de rendimiento por grado
    const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['1° Grado', '2° Grado', '3° Grado', '4° Grado', '5° Grado', '6° Grado'],
                datasets: [{
                    label: 'Promedio de Notas',
                    data: [7.8, 8.2, 8.5, 8.1, 8.7, 9.0],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(230, 126, 34, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(241, 196, 15, 1)',
                        'rgba(230, 126, 34, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Promedio por Grado',
                        font: {
                            family: 'Fredoka One',
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            font: {
                                family: 'Comic Neue'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Fredoka One'
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de distribución por edad
    const ageCtx = document.getElementById('ageChart')?.getContext('2d');
    if (ageCtx) {
        new Chart(ageCtx, {
            type: 'doughnut',
            data: {
                labels: ['5-6 años', '7-8 años', '9-10 años', '11-12 años'],
                datasets: [{
                    data: [45, 80, 70, 50],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(241, 196, 15, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Comic Neue'
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución por Edad',
                        font: {
                            family: 'Fredoka One',
                            size: 16
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
}
       // Prof

     // Nots

     // Regist

     // Matri