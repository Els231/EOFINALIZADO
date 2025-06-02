// Expresiones regulares para validación
const codigoRegex = /^\d{6}-[A-Za-z]{4}$/;
const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Elementos del DOM
const form = document.getElementById('matriculaForm');
const messageDiv = document.getElementById('message');

// Validación en tiempo real del código
document.getElementById('codeStudent').addEventListener('input', function() {
    const codigo = this.value;
    const errorElement = document.getElementById('error-code');

    if (codigoRegex.test(codigo)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Formato inválido. Use: 000000-AAAA (6 números, guión, 4 letras)';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real de la fecha
document.getElementById('fechaNacimiento').addEventListener('input', function() {
    const fecha = this.value;
    const errorElement = document.getElementById('error-fecha');

    if (fechaRegex.test(fecha)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Formato inválido. Use: DD/MM/AAAA (ej. 15/05/2000)';
        errorElement.className = 'error';
    }
});

// Validación en tiempo real de la edad
document.getElementById('edad').addEventListener('input', function() {
    const edad = this.value;
    const errorElement = document.getElementById('error-edad');

    if (edad >= 5 && edad <= 12) {
        errorElement.textContent = '✓ Edad válida';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'Edad debe ser entre 5 y 12 años';
        errorElement.className = 'error';
    }
});

// Validación para el teléfono
document.getElementById('telefono').addEventListener('input', function() {
    const telefono = this.value;
    const errorElement = document.getElementById('error-telefono');

    if (/^\d{8}$/.test(telefono)) {
        errorElement.textContent = '✓ Formato válido';
        errorElement.className = 'error correct';
    } else {
        errorElement.textContent = 'El teléfono debe tener 8 dígitos';
        errorElement.className = 'error';
    }
});

// Validación email
document.getElementById('emailEstudiante').addEventListener('input', function() {
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

// Manejar el envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const codeStudent = document.getElementById('codeStudent').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const edad = document.getElementById('edad').value;
    const direccion = document.getElementById('direccion').value;
    const codigoPais = document.getElementById('codigoPais').value;
    const numeroTelefono = document.getElementById('telefono').value;
    const telefonoCompleto = codigoPais + ' ' + numeroTelefono;
    const email = document.getElementById('emailEstudiante').value;

    // Validar campos
    let isValid = validarFormulario(
        codeStudent, nombre, apellido, sexo,
        fechaNacimiento, edad, direccion,
        numeroTelefono, email
    );

    if (isValid) {
        // Crear objeto con los datos del formulario
        const formData = {
            codeStudent,
            nombre,
            apellido,
            sexo,
            fechaNacimiento,
            edad,
            direccion,
            telefono: telefonoCompleto,
            email
        };

        // Enviar datos al servidor
        enviarDatosAlServidor(formData);
    }
});

// Función para validar todos los campos del formulario
function validarFormulario(
    codeStudent, nombre, apellido, sexo,
    fechaNacimiento, edad, direccion,
    numeroTelefono, email
) {
    let isValid = true;

    // Limpiar todos los errores primero
    document.getElementById('error-code').textContent = '';
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-apellido').textContent = '';
    document.getElementById('error-sexo').textContent = '';
    document.getElementById('error-fecha').textContent = '';
    document.getElementById('error-edad').textContent = '';
    document.getElementById('error-direccion').textContent = '';
    document.getElementById('error-telefono').textContent = '';
    document.getElementById('error-email').textContent = '';

    if (!codeStudent) {
        document.getElementById('error-code').textContent = 'El código estudiantil es requerido';
        document.getElementById('error-code').className = 'error';
        isValid = false;
    } else if (!codigoRegex.test(codeStudent)) {
        document.getElementById('error-code').textContent = 'Formato inválido. Use: 000000-AAAA';
        document.getElementById('error-code').className = 'error';
        isValid = false;
    }

    if (!nombre) {
        document.getElementById('error-nombre').textContent = 'El nombre es requerido';
        document.getElementById('error-nombre').className = 'error';
        isValid = false;
    }

    if (!apellido) {
        document.getElementById('error-apellido').textContent = 'El apellido es requerido';
        document.getElementById('error-apellido').className = 'error';
        isValid = false;
    }

    if (!sexo) {
        document.getElementById('error-sexo').textContent = 'Debe seleccionar el sexo';
        document.getElementById('error-sexo').className = 'error';
        isValid = false;
    }

    if (!fechaNacimiento) {
        document.getElementById('error-fecha').textContent = 'La fecha de nacimiento es requerida';
        document.getElementById('error-fecha').className = 'error';
        isValid = false;
    } else if (!fechaRegex.test(fechaNacimiento)) {
        document.getElementById('error-fecha').textContent = 'Formato inválido. Use: DD/MM/AAAA';
        document.getElementById('error-fecha').className = 'error';
        isValid = false;
    }

    if (!edad) {
        document.getElementById('error-edad').textContent = 'La edad es requerida';
        document.getElementById('error-edad').className = 'error';
        isValid = false;
    } else if (edad < 5 || edad > 12) {
        document.getElementById('error-edad').textContent = 'Edad debe ser entre 5 y 12 años';
        document.getElementById('error-edad').className = 'error';
        isValid = false;
    }

    if (!direccion) {
        document.getElementById('error-direccion').textContent = 'La dirección es requerida';
        document.getElementById('error-direccion').className = 'error';
        isValid = false;
    }

    if (!numeroTelefono) {
        document.getElementById('error-telefono').textContent = 'El teléfono es requerido';
        document.getElementById('error-telefono').className = 'error';
        isValid = false;
    } else if (!/^\d{8}$/.test(numeroTelefono)) {
        document.getElementById('error-telefono').textContent = 'Debe tener exactamente 8 dígitos';
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

    return isValid;
}

function enviarDatosAlServidor(data) {
    // Convertir fecha de DD/MM/AAAA a AAAA-MM-DD para SQL Server
    const [day, month, year] = data.fechaNacimiento.split('/');
    const fechaSQL = `${year}-${month}-${day}`;

    fetch('api/matriculas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'insert',
            codigoEstudiante: data.codeStudent,
            nombre: data.nombre,
            apellido: data.apellido,
            sexo: data.sexo,
            fechaNacimiento: fechaSQL,
            edad: data.edad,
            direccion: data.direccion,
            telefono: data.telefono,
            email: data.email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('Matrícula registrada exitosamente', 'success');
            limpiarFormulario();
        } else {
            mostrarMensaje(data.message || 'Error al registrar', 'error-message');
        }
    })
    .catch(error => {
        mostrarMensaje('Error de conexión: ' + error.message, 'error-message');
    });
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message ' + tipo;

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('matriculaForm').reset();

    // Limpiar mensajes de validación
    document.getElementById('error-code').textContent = '';
    document.getElementById('error-nombre').textContent = '';
    document.getElementById('error-apellido').textContent = '';
    document.getElementById('error-sexo').textContent = '';
    document.getElementById('error-edad').textContent = '';
    document.getElementById('error-fecha').textContent = '';
    document.getElementById('error-direccion').textContent = '';
    document.getElementById('error-telefono').textContent = '';
    document.getElementById('error-email').textContent = '';
}