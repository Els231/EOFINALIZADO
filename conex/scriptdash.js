document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de rendimiento por grado
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(performanceCtx, {
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

    // Gráfico de distribución por edad
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    const ageChart = new Chart(ageCtx, {
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

    // Efecto hover en las filas de la tabla
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

    // Notificación al cargar la página
    setTimeout(() => {
        alertBootstrap('Bienvenido al Sistema de Gestión Escolar', 'success');
    }, 1000);

    // Función para mostrar alertas
    function alertBootstrap(message, type) {
        const alertPlaceholder = document.createElement('div');
        alertPlaceholder.className = `alert alert-${type} alert-dismissible fade show fixed-top m-3`;
        alertPlaceholder.style.position = 'fixed';
        alertPlaceholder.style.top = '20px';
        alertPlaceholder.style.right = '20px';
        alertPlaceholder.style.zIndex = '9999';
        alertPlaceholder.style.maxWidth = '300px';
        alertPlaceholder.style.fontFamily = "'Comic Neue', cursive";
        alertPlaceholder.role = 'alert';

        alertPlaceholder.innerHTML = `
            <strong>${type === 'success' ? '¡Éxito!' : '¡Atención!'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(alertPlaceholder);

        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertPlaceholder);
            alert.close();
        }, 5000);
    }
});

        // Cal
  document.addEventListener('DOMContentLoaded', function() {
            // Inicializar calendario
            const calendarEl = document.getElementById('calendar');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                events: [
                    {
                        title: 'Inicio de Clases',
                        start: '2023-03-01',
                        color: '#2ecc71',
                        extendedProps: {
                            tipo: 'clase',
                            grado: 'Todos'
                        }
                    },
                    {
                        title: 'Reunión de Padres',
                        start: '2023-03-15T18:00:00',
                        end: '2023-03-15T20:00:00',
                        color: '#3498db',
                        extendedProps: {
                            tipo: 'reunion',
                            grado: '1° Grado'
                        }
                    },
                    {
                        title: 'Examen de Matemáticas',
                        start: '2023-03-20',
                        color: '#e74c3c',
                        extendedProps: {
                            tipo: 'examen',
                            grado: '4° Grado'
                        }
                    },
                    {
                        title: 'Día del Niño',
                        start: '2023-08-20',
                        color: '#9b59b6',
                        extendedProps: {
                            tipo: 'actividad',
                            grado: 'Todos'
                        }
                    },
                    {
                        title: 'Feriado Nacional',
                        start: '2023-05-25',
                        color: '#f39c12',
                        extendedProps: {
                            tipo: 'feriado',
                            grado: 'Todos'
                        }
                    }
                ],
                eventClick: function(info) {
                    alert('Evento: ' + info.event.title + '\n' +
                          'Fecha: ' + info.event.start.toLocaleString() + '\n' +
                          'Tipo: ' + info.event.extendedProps.tipo + '\n' +
                          'Grado: ' + info.event.extendedProps.grado);
                }
            });
            calendar.render();

            // Botón "Hoy"
            document.getElementById('btnToday').addEventListener('click', function() {
                calendar.today();
            });

            // Botón "Imprimir"
            document.getElementById('btnPrint').addEventListener('click', function() {
                window.print();
            });

            // Guardar nuevo evento
            document.getElementById('btnGuardarEvento').addEventListener('click', function() {
                const title = document.getElementById('eventoTitle').value;
                const start = document.getElementById('eventoStart').value;
                const end = document.getElementById('eventoEnd').value;
                const type = document.getElementById('eventoType').value;

                if (title && start && type) {
                    calendar.addEvent({
                        title: title,
                        start: start,
                        end: end || start,
                        color: getEventColor(type),
                        extendedProps: {
                            tipo: type,
                            grado: 'Varios' // Esto debería ser dinámico según selección
                        }
                    });

                    // Cerrar modal y limpiar formulario
                    const modal = bootstrap.Modal.getInstance(document.getElementById('nuevoEventoModal'));
                    modal.hide();
                    document.getElementById('eventoForm').reset();
                } else {
                    alert('Por favor complete los campos requeridos');
                }
            });

            // Función para obtener color según tipo de evento
            function getEventColor(type) {
                switch(type) {
                    case 'clase': return '#2ecc71';
                    case 'examen': return '#e74c3c';
                    case 'reunion': return '#3498db';
                    case 'actividad': return '#9b59b6';
                    case 'feriado': return '#f39c12';
                    default: return '#95a5a6';
                }
            }
        });

       // Prof

     // Nots

     // Regist

     // Matri