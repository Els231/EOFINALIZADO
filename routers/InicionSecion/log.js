  // Sistema de autenticación
        const users = {
            'prof.martinez': { password: 'escuela123', role: 'profesor', name: 'Profesor Martínez' },
            'prof.garcia': { password: 'escuela123', role: 'profesor', name: 'Profesor García' },
            'dev.admin': { password: 'dev123', role: 'desarrollador', name: 'Administrador' },
            'developer': { password: 'code123', role: 'desarrollador', name: 'Desarrollador' }
        };

        let selectedRole = '';

        function selectRole(role) {
            selectedRole = role;
            
            // Remover selección anterior
            document.querySelectorAll('.role-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Agregar selección actual
            if (role === 'profesor') {
                document.getElementById('profesorCard').classList.add('selected');
            } else {
                document.getElementById('desarrolladorCard').classList.add('selected');
            }
        }

        function fillCredentials(username, password) {
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            
            // Auto-seleccionar el rol apropiado
            if (username.startsWith('prof')) {
                selectRole('profesor');
            } else {
                selectRole('desarrollador');
            }
        }

        function showAlert(message, type = 'danger') {
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }

        function login(username, password) {
            const user = users[username];
            
            if (!user) {
                showAlert('Usuario no encontrado');
                return false;
            }
            
            if (user.password !== password) {
                showAlert('Contraseña incorrecta');
                return false;
            }
            
            if (!selectedRole) {
                showAlert('Por favor selecciona tu rol', 'warning');
                return false;
            }
            
            if (user.role !== selectedRole) {
                showAlert('El rol seleccionado no coincide con tu usuario', 'warning');
                return false;
            }
            
            // Guardar sesión
            const session = {
                username: username,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('userSession', JSON.stringify(session));
            
            // Redirigir según el rol
            if (user.role === 'profesor') {
                window.location.href = 'professor-new.html';
            } else {
                window.location.href = 'developer-new.html';
            }
            
            return true;
        }

        // Event listeners
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showAlert('Por favor completa todos los campos', 'warning');
                return;
            }
            
            login(username, password);
        });

        // Verificar si ya hay una sesión activa
        document.addEventListener('DOMContentLoaded', function() {
            const session = localStorage.getItem('userSession');
            if (session) {
                try {
                    const userData = JSON.parse(session);
                    const loginTime = new Date(userData.loginTime);
                    const now = new Date();
                    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                    
                    // Si la sesión es válida (menos de 8 horas)
                    if (hoursDiff < 8) {
                        if (userData.role === 'profesor') {
                            window.location.href = 'professor-new.html';
                        } else {
                            window.location.href = 'developer-new.html';
                        }
                        return;
                    } else {
                        // Sesión expirada
                        localStorage.removeItem('userSession');
                    }
                } catch (error) {
                    localStorage.removeItem('userSession');
                }
            }
        });

        // Auto-seleccionar profesor por defecto
        selectRole('profesor');