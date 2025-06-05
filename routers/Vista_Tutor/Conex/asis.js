// Resumen de asistencia para María
    const ctxAsistenciaMaria = document.getElementById('resumenAsistenciaMaria').getContext('2d');
    const chartAsistenciaMaria = new Chart(ctxAsistenciaMaria, {
        type: 'doughnut',
        data: {
            labels: ['Presente', 'Ausente', 'Tarde', 'Justificado'],
            datasets: [{
                data: [48, 2, 0, 0],
                backgroundColor: [
                    '#1cc88a',
                    '#e74a3b',
                    '#36b9cc',
                    '#f6c23e'
                ],
                hoverBackgroundColor: [
                    '#17a673',
                    '#be2617',
                    '#2c9faf',
                    '#dda20a'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'Centerdown'
                }
            },
            cutout: '50%',
        },
    });

    // Resumen de asistencia para Juan
    const ctxAsistenciaJuan = document.getElementById('resumenAsistenciaJuan').getContext('2d');
    const chartAsistenciaJuan = new Chart(ctxAsistenciaJuan, {
        type: 'doughnut',
        data: {
            labels: ['Presente', 'Ausente', 'Tarde', 'Justificado'],
            datasets: [{
                data: [35, 3, 1, 0],
                backgroundColor: [
                    '#1cc88a',
                    '#e74a3b',
                    '#36b9cc',
                    '#f6c23e'
                ],
                hoverBackgroundColor: [
                    '#17a673',
                    '#be2617',
                    '#2c9faf',
                    '#dda20a'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'Centerdown'
                }
            },
            cutout: '50%',
        },
    });