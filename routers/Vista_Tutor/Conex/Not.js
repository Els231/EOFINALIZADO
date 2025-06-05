 // Evolución de notas para María
    const ctxMaria = document.getElementById('evolucionNotasMaria').getContext('2d');
    const chartMaria = new Chart(ctxMaria, {
        type: 'line',
        data: {
            labels: ['1° Trim', '2° Trim', '3° Trim'],
            datasets: [
                {
                    label: 'Matemáticas',
                    data: [8.2, 9.0, null],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Lengua',
                    data: [8.0, 8.5, null],
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Ciencias',
                    data: [8.5, 8.8, null],
                    borderColor: '#36b9cc',
                    backgroundColor: 'rgba(54, 185, 204, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Promedio',
                    data: [8.3, 8.7, null],
                    borderColor: '#f6c23e',
                    backgroundColor: 'rgba(246, 194, 62, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 6,
                    max: 10
                }
            }
        }
    });

    // Evolución de notas para Juan
    const ctxJuan = document.getElementById('evolucionNotasJuan').getContext('2d');
    const chartJuan = new Chart(ctxJuan, {
        type: 'line',
        data: {
            labels: ['1° Trim', '2° Trim', '3° Trim'],
            datasets: [
                {
                    label: 'Matemáticas',
                    data: [7.0, 7.5, null],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Lengua',
                    data: [7.5, 8.0, null],
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Ciencias',
                    data: [7.2, 7.8, null],
                    borderColor: '#36b9cc',
                    backgroundColor: 'rgba(54, 185, 204, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Promedio',
                    data: [7.3, 7.8, null],
                    borderColor: '#f6c23e',
                    backgroundColor: 'rgba(246, 194, 62, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 6,
                    max: 10
                }
            }
        }
    });