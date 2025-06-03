// Base de datos de usuarios
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Elementos del DOM
const authContainer = document.getElementById('authContainer');

// Mostrar formulario de login por defecto
showLoginForm();

// Verificar si hay usuario logueado
if (currentUser) {
    showMessage(`Ya has iniciado sesión como ${currentUser.name}`, 'success');
    setTimeout(() => {
        alert(`Redirigiendo al panel de ${currentUser.name}`);
        // window.location.href = 'dashboard.html';
    }, 2000);
}

function showLoginForm() {
    authContainer.innerHTML = `
        <div id="messageContainer"></div>
        
        <h2 class="auth-title">Iniciar Sesión</h2>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="loginEmail">Correo electrónico</label>
                <input type="email" id="loginEmail" required>
                <div class="error" id="emailError">Por favor ingresa un correo válido</div>
            </div>
            
            <div class="form-group">
                <label for="loginPassword">Contraseña</label>
                <input type="password" id="loginPassword" required>
                <div class="error" id="passwordError">La contraseña debe tener al menos 6 caracteres</div>
            </div>
            
            <div class="form-group">
                <input type="checkbox" id="rememberMe">
                <label for="rememberMe" style="display: inline; font-weight: normal;">Recordar sesión</label>
            </div>
            
            <button type="submit" class="btn">Ingresar</button>
            
            <div class="auth-switch">
                ¿No tienes cuenta? <a href="#" id="showRegister">Regístrate aquí</a>
            </div>
        </form>
    `;

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('showRegister').addEventListener('click', showRegisterForm);
}

function showRegisterForm() {
    authContainer.innerHTML = `
        <div id="messageContainer"></div>
        
        <h2 class="auth-title">Crear Cuenta</h2>
        
        <form id="registerForm">
            <div class="form-group">
                <label for="regName">Nombre completo</label>
                <input type="text" id="regName" required>
                <div class="error" id="nameError">Por favor ingresa tu nombre</div>
            </div>
            
            <div class="form-group">
                <label for="regEmail">Correo electrónico</label>
                <input type="email" id="regEmail" required>
                <div class="error" id="regEmailError">Por favor ingresa un correo válido</div>
            </div>
            
            <div class="form-group">
                <label for="regPassword">Contraseña</label>
                <input type="password" id="regPassword" required oninput="checkPasswordStrength(this.value)">
                <div class="password-strength">
                    <div class="strength-bar" id="strengthBar"></div>
                </div>
                <div class="error" id="regPasswordError">La contraseña debe tener al menos 6 caracteres</div>
            </div>
            
            <div class="form-group">
                <label for="regConfirmPassword">Confirmar Contraseña</label>
                <input type="password" id="regConfirmPassword" required>
                <div class="error" id="confirmPasswordError">Las contraseñas no coinciden</div>
            </div>
            
            <button type="submit" class="btn">Registrarse</button>
            
            <div class="auth-switch">
                ¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia sesión aquí</a>
            </div>
        </form>
    `;

    // Event listeners
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    if (!strengthBar) return;

    let strength = 0;

    // Longitud
    if (password.length > 0) strength += 20;
    if (password.length >= 6) strength += 30;

    // Complejidad
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    strength = Math.min(strength, 100);
    strengthBar.style.width = `${strength}%`;

    // Cambiar color según fortaleza
    if (strength < 40) {
        strengthBar.style.backgroundColor = '#e74c3c';
    } else if (strength < 70) {
        strengthBar.style.backgroundColor = '#f39c12';
    } else {
        strengthBar.style.backgroundColor = '#2ecc71';
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Validación
    let isValid = true;

    // Validar email
    if (!email || !email.includes('@')) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    // Validar contraseña
    if (!password || password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('passwordError').style.display = 'none';
    }

    if (!isValid) return;

    // Buscar usuario
    const user = usersDB.find(u => u.email === email && u.password === password);

    if (user) {
        // Login exitoso
        currentUser = user;

        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        showMessage('¡Bienvenido! Has iniciado sesión correctamente.', 'success');

        // Redirigir después de 2 segundos
        setTimeout(() => {
            alert(`Redirigiendo al panel de ${user.name}`);
            // window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        showMessage('Credenciales incorrectas. Por favor verifica tus datos.', 'error-message');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validación
    let isValid = true;

    // Validar nombre
    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    // Validar email
    if (!email || !email.includes('@')) {
        document.getElementById('regEmailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('regEmailError').style.display = 'none';
    }

    // Validar contraseña
    if (!password || password.length < 6) {
        document.getElementById('regPasswordError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('regPasswordError').style.display = 'none';
    }

    // Validar confirmación
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
    }

    if (!isValid) return;

    // Verificar si el usuario ya existe
    if (usersDB.some(u => u.email === email)) {
        showMessage('Este correo electrónico ya está registrado.', 'error-message');
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    // Guardar en la base de datos
    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));

    // Mostrar mensaje de éxito
    showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');

    // Mostrar formulario de login después de 2 segundos
    setTimeout(showLoginForm, 2000);
}

function showMessage(text, type) {
    const messageContainer = document.getElementById('messageContainer') ||
                           document.createElement('div');

    messageContainer.id = 'messageContainer';
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = text;
    messageContainer.style.display = 'block';

    if (!document.getElementById('messageContainer')) {
        authContainer.insertBefore(messageContainer, authContainer.firstChild);
    }

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Hacer la función accesible globalmente para el evento oninput
window.checkPasswordStrength = checkPasswordStrength;