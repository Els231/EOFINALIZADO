// Expresiones regulares para validación
const idTutorRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
const telefonoRegex = /^[0-9]{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Elementos del DOM
const form = document.getElementById('tutorForm');
const messageDiv = document.createElement('div');
messageDiv.className = 'message';
document.querySelector('.card-body').appendChild(messageDiv);

// Validación en tiempo real del ID Tutor
document.getElementById('idtutor').addEventListener('input', function() {
    const idTutor = this.value;
    const errorElement = document.getElementById('error-idtutor');

    if (idTutorRegex.test(idTutor)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Formato inválido. Use: 000-000000-0000A';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real del nombre
document.getElementById('nombre').addEventListener('input', function() {
    const nombre = this.value;
    const errorElement = document.getElementById('error-nombre');

    if (nombreRegex.test(nombre)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Solo letras y espacios (mínimo 2 caracteres)';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real del centro de trabajo
document.getElementById('centro').addEventListener('input', function() {
    const centro = this.value;
    const errorElement = document.getElementById('error-centro');

    if (centro.trim().length > 0) {
        errorElement.textContent = '✓ Campo válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Este campo es requerido';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real del teléfono
document.getElementById('telefono').addEventListener('input', function() {
    const telefono = this.value;
    const errorElement = document.getElementById('error-telefono');

    if (telefonoRegex.test(telefono)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Debe tener 8 dígitos numéricos';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real del email
document.getElementById('emailtutor').addEventListener('input', function() {
    const email = this.value;
    const errorElement = document.getElementById('error-email');

    if (emailRegex.test(email)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Formato de email inválido';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real de la ocupación
document.getElementById('ocupacion').addEventListener('input', function() {
    const ocupacion = this.value;
    const errorElement = document.getElementById('error-ocupacion');

    if (ocupacion.trim().length > 0) {
        errorElement.textContent = '✓ Campo válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Este campo es requerido';
        errorElement.className = 'error';
    }
});

// Manejar el envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const idtutor = document.getElementById('idtutor').value;
    const nombre = document.getElementById('nombre').value;
    const centro = document.getElementById('centro').value;
    const codigoPais = document.getElementById('codigoPais').value;
    const telefono = document.getElementById('telefono').value;
    const telefonoCompleto = codigoPais + ' ' + telefono;
    const email = document.getElementById('emailtutor').value;
    const ocupacion = document.getElementById('ocupacion').value;

    // Validar campos
    let isValid = validarFormulario(
        idtutor, nombre, centro, 
        telefono, email, ocupacion
    );

    if (isValid) {
        // Crear objeto con los datos del formulario
        const formData = {
            idtutor,
            nombre,
            centro,
            telefono: telefonoCompleto,
            email,
            ocupacion
        };

        // Enviar datos al servidor
        enviarDatosAlServidor(formData);
    }
});

// Función para validar todos los campos del formulario
function validarFormulario(
    idtutor, nombre, centro, 
    telefono, email, ocupacion
) {
    let isValid = true;

    // Limpiar todos los errores primero
    document.getElementById('error-idtutor').textContent = '';
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-centro').textContent = '';
    document.getElementById('error-telefono').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-ocupacion').textContent = '';

    if (!idtutor) {
        document.getElementById('error-idtutor').textContent = 'El ID del tutor es requerido';
        document.getElementById('error-idtutor').className = 'error';
        isValid = false;
    } else if (!idTutorRegex.test(idtutor)) {
        document.getElementById('error-idtutor').textContent = 'Formato inválido. Use: 000-000000-0000A';
        document.getElementById('error-idtutor').className = 'error';
        isValid = false;
    }

    if (!nombre) {
        document.getElementById('error-nombre').textContent = 'El nombre es requerido';
        document.getElementById('error-nombre').className = 'error';
        isValid = false;
    } else if (!nombreRegex.test(nombre)) {
        document.getElementById('error-nombre').textContent = 'Solo letras y espacios (mínimo 2 caracteres)';
        document.getElementById('error-nombre').className = 'error';
        isValid = false;
    }

    if (!centro) {
        document.getElementById('error-centro').textContent = 'El centro de trabajo es requerido';
        document.getElementById('error-centro').className = 'error';
        isValid = false;
    }

    if (!telefono) {
        document.getElementById('error-telefono').textContent = 'El teléfono es requerido';
        document.getElementById('error-telefono').className = 'error';
        isValid = false;
    } else if (!telefonoRegex.test(telefono)) {
        document.getElementById('error-telefono').textContent = 'Debe tener 8 dígitos numéricos';
        document.getElementById('error-telefono').className = 'error';
        isValid = false;
    }

    if (!email) {
        document.getElementById('error-email').textContent = 'El email es requerido';
        document.getElementById('error-email').className = 'error';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('error-email').textContent = 'Formato de email inválido';
        document.getElementById('error-email').className = 'error';
        isValid = false;
    }

    if (!ocupacion) {
        document.getElementById('error-ocupacion').textContent = 'La ocupación es requerida';
        document.getElementById('error-ocupacion').className = 'error';
        isValid = false;
    }

    return isValid;
}

function enviarDatosAlServidor(data) {
    // Mostrar estado de carga
    messageDiv.textContent = 'Enviando datos...';
    messageDiv.className = 'message info';

    fetch('api/tutores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'insert',
            idtutor: data.idtutor,
            nombre: data.nombre,
            centro: data.centro,
            telefono: data.telefono,
            email: data.email,
            ocupacion: data.ocupacion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('Tutor registrado exitosamente', 'success');
            limpiarFormulario();
        } else {
            mostrarMensaje(data.message || 'Error al registrar', 'error');
        }
    })
    .catch(error => {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    });
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message ' + tipo;
    messageDiv.style.display = 'block';

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Función para limpiar el formulario
function limpiarFormulario() {
    form.reset();
    document.getElementById('codigoPais').value = '+503';

    // Limpiar mensajes de validación
    document.getElementById('error-idtutor').textContent = '';
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-centro').textContent = '';
    document.getElementById('error-telefono').textContent = '';
    document.getElementById('error-email').textContent = '';
    document.getElementById('error-ocupacion').textContent = '';

    // Enfocar el primer campo
    document.getElementById('idtutor').focus();
}