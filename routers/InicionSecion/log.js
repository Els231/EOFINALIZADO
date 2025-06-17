   // Sistema de autenticación mejorado con base de datos
        let users = JSON.parse(localStorage.getItem('schoolUsers')) || {
            'prof.martinez': { password: 'escuela123', role: 'profesor', name: 'Prof. Martínez', email: 'martinez@escuela.edu', firstName: 'Carlos', lastName: 'Martínez' },
            'prof.garcia': { password: 'escuela123', role: 'profesor', name: 'Prof. García', email: 'garcia@escuela.edu', firstName: 'María', lastName: 'García' },
            'tutor.lopez': { password: 'tutor123', role: 'tutor', name: 'Tutor López', email: 'lopez@escuela.edu', firstName: 'Ana', lastName: 'López' },
            'tutor.rivera': { password: 'tutor123', role: 'tutor', name: 'Tutor Rivera', email: 'rivera@escuela.edu', firstName: 'José', lastName: 'Rivera' },
            'dev.admin': { password: 'dev123', role: 'desarrollador', name: 'Administrador', email: 'admin@escuela.edu', firstName: 'Admin', lastName: 'Sistema' }
        };

        let selectedRole = '';

        // Guardar usuarios en localStorage
        function saveUsers() {
            localStorage.setItem('schoolUsers', JSON.stringify(users));
        }

        function selectRole(role) {
            selectedRole = role;
            
            // Remover selección anterior
            document.querySelectorAll('.role-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Agregar selección actual
            document.getElementById(role + 'Card').classList.add('selected');
        }

        function fillCredentials(username, password) {
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').value = password;
            
            // Auto-seleccionar el rol apropiado
            if (username.startsWith('prof')) {
                selectRole('profesor');
            } else if (username.startsWith('tutor')) {
                selectRole('tutor');
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

        function generateUsername(firstName, lastName, role) {
            const rolePrefix = {
                'profesor': 'prof',
                'tutor': 'tutor',
                'desarrollador': 'dev'
            };
            
            const base = `${rolePrefix[role]}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
            let username = base;
            let counter = 1;
            
            while (users[username]) {
                username = `${base}${counter}`;
                counter++;
            }
            
            return username;
        }

        function validatePassword(password) {
            if (password.length < 6) {
                return 'La contraseña debe tener al menos 6 caracteres';
            }
            return null;
        }

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return 'Formato de correo electrónico inválido';
            }
            
            // Verificar si el email ya existe
            for (let username in users) {
                if (users[username].email === email) {
                    return 'Este correo electrónico ya está registrado';
                }
            }
            
            return null;
        }

        function register(firstName, lastName, email, username, password, confirmPassword) {
            // Validaciones
            if (!selectedRole) {
                showAlert('Por favor selecciona tu rol', 'warning');
                return false;
            }

            if (!firstName.trim() || !lastName.trim()) {
                showAlert('Nombre y apellido son requeridos');
                return false;
            }

            const emailError = validateEmail(email);
            if (emailError) {
                showAlert(emailError);
                return false;
            }

            if (users[username]) {
                showAlert('El nombre de usuario ya existe');
                return false;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                showAlert(passwordError);
                return false;
            }

            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden');
                return false;
            }

            // Crear nuevo usuario
            users[username] = {
                password: password,
                role: selectedRole,
                name: `${firstName} ${lastName}`,
                email: email,
                firstName: firstName,
                lastName: lastName,
                createdAt: new Date().toISOString()
            };

            saveUsers();

            showAlert(`Cuenta creada exitosamente. Usuario: ${username}`, 'success');
            
            // Limpiar formulario de registro
            document.getElementById('registerForm').reset();
            
            // Cambiar a la pestaña de login y llenar credenciales
            const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
            loginTab.show();
            
            setTimeout(() => {
                fillCredentials(username, password);
            }, 500);

            return true;
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
                email: user.email,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('userSession', JSON.stringify(session));
            
            // Redirigir según el rol
            if (user.role === 'profesor') {
                window.location.href = '../Vista_Profesor_io_Desarrollador/Profesor/pro.html';
            } else if (user.role === 'tutor') {
                window.location.href = '../Vista_Tutor/DashbTutor.html';
            } else {
                window.location.href = '../Vista_Profesor_io_Desarrollador/PruebaDesarro/desa.html';
            }
            
            return true;
        }

        // Event listeners
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            login(username, password);
        });

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = document.getElementById('registerFirstName').value.trim();
            const lastName = document.getElementById('registerLastName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            register(firstName, lastName, email, username, password, confirmPassword);
        });

        // Auto-generar nombre de usuario cuando se completan nombre y apellido
        document.getElementById('registerLastName').addEventListener('blur', function() {
            const firstName = document.getElementById('registerFirstName').value.trim();
            const lastName = this.value.trim();
            const usernameField = document.getElementById('registerUsername');
            
            if (firstName && lastName && selectedRole && !usernameField.value) {
                const suggestedUsername = generateUsername(firstName, lastName, selectedRole);
                usernameField.value = suggestedUsername;
            }
        });

        // Auto-seleccionar rol al cambiar de pestaña
        document.getElementById('register-tab').addEventListener('shown.bs.tab', function() {
            if (!selectedRole) {
                selectRole('profesor'); // Rol por defecto
            }
        });

        // Verificar si hay sesión activa al cargar
        window.addEventListener('load', function() {
            const session = localStorage.getItem('userSession');
            if (session) {
                const userData = JSON.parse(session);
                // Si hay sesión activa, podrías mostrar un mensaje o redirigir
                console.log('Sesión activa encontrada:', userData.name);
            }
        });