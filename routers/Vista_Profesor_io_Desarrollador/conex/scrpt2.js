document.addEventListener('DOMContentLoaded', function() {
    // Control de submenús
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = this.closest('.menu-item');
            const submenu = menuItem.querySelector('.submenu');

            // Cerrar otros submenús abiertos
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.remove('active');
                    sm.closest('.menu-item').classList.remove('active');
                }
            });

            // Alternar el submenú actual
            submenu.classList.toggle('active');
            menuItem.classList.toggle('active');
        });
    });

    // Cerrar submenús al hacer clic fuera del menú
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.vertical-menu')) {
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.classList.remove('active');
                submenu.closest('.menu-item').classList.remove('active');
            });
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // Activar tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Cerrar navbar en móviles después de hacer clic
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if(navbarCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        });
    });

    // Mostrar año actual en el footer
    const yearSpan = document.getElementById('currentYear');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});