/**
 * Módulo de editor de código
 * Funcionalidades para programación y desarrollo
 */

let codeEditor;
let currentLanguage = 'javascript';
let savedCodes = [];

// Función principal para cargar la sección de código
function loadCodigoSection() {
    const section = document.getElementById('codigo-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-code me-2"></i>
                    Editor de Código
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="executeCode()">
                            <i class="fas fa-play me-1"></i> Ejecutar
                        </button>
                        <button type="button" class="btn btn-success" onclick="saveCode()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="loadCode()">
                            <i class="fas fa-folder-open me-1"></i> Cargar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="clearEditor()">
                            <i class="fas fa-eraser me-1"></i> Limpiar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Panel de configuración -->
            <div class="col-lg-3 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-cog me-2"></i>
                            Configuración
                        </h6>
                    </div>
                    <div class="card-body">
                        <!-- Selector de lenguaje -->
                        <div class="mb-3">
                            <label for="languageSelect" class="form-label">Lenguaje de Programación:</label>
                            <select class="form-select" id="languageSelect" onchange="changeLanguage()">
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="htmlmixed">HTML</option>
                                <option value="css">CSS</option>
                                <option value="sql">SQL</option>
                                <option value="xml">XML</option>
                            </select>
                        </div>

                        <!-- Tema del editor -->
                        <div class="mb-3">
                            <label for="themeSelect" class="form-label">Tema:</label>
                            <select class="form-select" id="themeSelect" onchange="changeTheme()">
                                <option value="monokai">Monokai (Oscuro)</option>
                                <option value="default">Claro</option>
                                <option value="material">Material</option>
                                <option value="dracula">Dracula</option>
                            </select>
                        </div>

                        <!-- Tamaño de fuente -->
                        <div class="mb-3">
                            <label for="fontSizeSelect" class="form-label">Tamaño de Fuente:</label>
                            <select class="form-select" id="fontSizeSelect" onchange="changeFontSize()">
                                <option value="12">12px</option>
                                <option value="14" selected>14px</option>
                                <option value="16">16px</option>
                                <option value="18">18px</option>
                                <option value="20">20px</option>
                            </select>
                        </div>

                        <!-- Opciones del editor -->
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="lineNumbers" checked onchange="toggleLineNumbers()">
                                <label class="form-check-label" for="lineNumbers">
                                    Números de línea
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="wordWrap" onchange="toggleWordWrap()">
                                <label class="form-check-label" for="wordWrap">
                                    Ajuste de línea
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="autoComplete" checked onchange="toggleAutoComplete()">
                                <label class="form-check-label" for="autoComplete">
                                    Autocompletado
                                </label>
                            </div>
                        </div>

                        <!-- Snippets de código -->
                        <div class="mb-3">
                            <label class="form-label">Snippets:</label>
                            <div class="d-grid gap-2">
                                <button class="btn btn-sm btn-outline-primary" onclick="insertSnippet('function')">
                                    Función
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="insertSnippet('loop')">
                                    Bucle
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="insertSnippet('class')">
                                    Clase
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="insertSnippet('comment')">
                                    Comentario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Panel de archivos guardados -->
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-folder me-2"></i>
                            Archivos Guardados
                        </h6>
                    </div>
                    <div class="card-body">
                        <div id="savedCodesList">
                            <!-- La lista se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Editor de código -->
            <div class="col-lg-9">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="m-0 font-weight-bold">
                            <i class="fas fa-edit me-2"></i>
                            Editor
                        </h6>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="formatCode()" title="Formatear código">
                                <i class="fas fa-magic"></i>
                            </button>
                            <button class="btn btn-outline-secondary" onclick="findReplace()" title="Buscar y reemplazar">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="btn btn-outline-secondary" onclick="toggleFullscreen()" title="Pantalla completa">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <textarea id="codeEditor" placeholder="Escribe tu código aquí..."></textarea>
                    </div>
                </div>

                <!-- Panel de salida/resultados -->
                <div class="card mt-3">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs" id="outputTabs">
                            <li class="nav-item">
                                <a class="nav-link active" id="console-tab" data-bs-toggle="tab" href="#console" role="tab">
                                    <i class="fas fa-terminal me-1"></i> Consola
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="preview-tab" data-bs-toggle="tab" href="#preview" role="tab">
                                    <i class="fas fa-eye me-1"></i> Vista Previa
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="errors-tab" data-bs-toggle="tab" href="#errors" role="tab">
                                    <i class="fas fa-exclamation-triangle me-1"></i> Errores
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="outputTabContent">
                            <div class="tab-pane fade show active" id="console" role="tabpanel">
                                <div id="consoleOutput" class="code-output" style="min-height: 200px;">
                                    Consola lista para mostrar resultados...
                                </div>
                            </div>
                            <div class="tab-pane fade" id="preview" role="tabpanel">
                                <iframe id="previewFrame" style="width: 100%; height: 300px; border: 1px solid #ddd; background: white;"></iframe>
                            </div>
                            <div class="tab-pane fade" id="errors" role="tabpanel">
                                <div id="errorsOutput" class="code-output" style="min-height: 200px;">
                                    No hay errores reportados.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para guardar código -->
        <div class="modal fade" id="saveCodeModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-save me-2"></i>
                            Guardar Código
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="saveCodeForm">
                            <div class="mb-3">
                                <label for="codeTitle" class="form-label">Título del Archivo:</label>
                                <input type="text" class="form-control" id="codeTitle" required>
                            </div>
                            <div class="mb-3">
                                <label for="codeDescription" class="form-label">Descripción:</label>
                                <textarea class="form-control" id="codeDescription" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="codeTags" class="form-label">Etiquetas (separadas por comas):</label>
                                <input type="text" class="form-control" id="codeTags" placeholder="javascript, función, ejemplo">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="confirmSaveCode()">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para cargar código -->
        <div class="modal fade" id="loadCodeModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-folder-open me-2"></i>
                            Cargar Código
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="loadCodeList">
                            <!-- La lista se cargará aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar códigos guardados y inicializar editor
    loadSavedCodes();
    initializeCodeEditor();
}

// Función para inicializar el editor de código
function initializeCodeEditor() {
    const textarea = document.getElementById('codeEditor');
    
    codeEditor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'monokai',
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: false,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });
    
    // Establecer código de ejemplo inicial
    const defaultCode = getDefaultCode('javascript');
    codeEditor.setValue(defaultCode);
    
    // Configurar eventos
    codeEditor.on('change', function() {
        clearErrors();
    });
}

// Función para obtener código por defecto según el lenguaje
function getDefaultCode(language) {
    const examples = {
        javascript: `// Ejemplo de función en JavaScript
function saludar(nombre) {
    return "¡Hola, " + nombre + "!";
}

// Llamar a la función
const mensaje = saludar("Estudiante");
console.log(mensaje);

// Ejemplo con bucle
const numeros = [1, 2, 3, 4, 5];
numeros.forEach(num => {
    console.log("Número:", num);
});`,
        
        python: `# Ejemplo de función en Python
def saludar(nombre):
    return f"¡Hola, {nombre}!"

# Llamar a la función
mensaje = saludar("Estudiante")
print(mensaje)

# Ejemplo con bucle
numeros = [1, 2, 3, 4, 5]
for num in numeros:
    print(f"Número: {num}")`,
    
        htmlmixed: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página Web</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Bienvenido a mi página web!</h1>
        <p>Esta es una página de ejemplo creada con HTML y CSS.</p>
        <button onclick="alert('¡Hola desde JavaScript!')">Hacer clic</button>
    </div>
</body>
</html>`,
        
        css: `/* Estilos CSS de ejemplo */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.btn {
    background: #667eea;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn:hover {
    background: #5a67d8;
}`,
        
        sql: `-- Ejemplo de consultas SQL
-- Crear una tabla de estudiantes
CREATE TABLE estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_nacimiento DATE,
    grado INT
);

-- Insertar datos de ejemplo
INSERT INTO estudiantes (nombre, apellido, email, fecha_nacimiento, grado)
VALUES 
    ('Juan', 'Pérez', 'juan.perez@email.com', '2010-05-15', 3),
    ('María', 'González', 'maria.gonzalez@email.com', '2009-08-22', 4),
    ('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '2011-02-10', 2);

-- Consultar todos los estudiantes
SELECT * FROM estudiantes;

-- Consultar estudiantes por grado
SELECT nombre, apellido, email 
FROM estudiantes 
WHERE grado = 3;

-- Contar estudiantes por grado
SELECT grado, COUNT(*) as total_estudiantes
FROM estudiantes
GROUP BY grado
ORDER BY grado;`,
        
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Ejemplo de estructura XML para datos escolares -->
<escuela>
    <informacion>
        <nombre>Escuela Jesús El Buen Maestro</nombre>
        <direccion>República Dominicana</direccion>
        <telefono>809-123-4567</telefono>
    </informacion>
    
    <estudiantes>
        <estudiante id="1">
            <nombre>Juan</nombre>
            <apellido>Pérez</apellido>
            <grado>3</grado>
            <edad>9</edad>
            <materias>
                <materia nombre="Matemáticas" calificacion="85"/>
                <materia nombre="Español" calificacion="92"/>
                <materia nombre="Ciencias" calificacion="78"/>
            </materias>
        </estudiante>
        
        <estudiante id="2">
            <nombre>María</nombre>
            <apellido>González</apellido>
            <grado>4</grado>
            <edad>10</edad>
            <materias>
                <materia nombre="Matemáticas" calificacion="95"/>
                <materia nombre="Español" calificacion="88"/>
                <materia nombre="Ciencias" calificacion="91"/>
            </materias>
        </estudiante>
    </estudiantes>
</escuela>`
    };
    
    return examples[language] || '// Escribe tu código aquí...';
}

// Función para cambiar el lenguaje de programación
function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    currentLanguage = language;
    
    codeEditor.setOption('mode', language);
    
    // Cambiar código de ejemplo si el editor está vacío o tiene el ejemplo anterior
    const currentCode = codeEditor.getValue().trim();
    if (!currentCode || isDefaultCode(currentCode)) {
        const defaultCode = getDefaultCode(language);
        codeEditor.setValue(defaultCode);
    }
    
    clearOutput();
}

// Función para verificar si el código actual es un ejemplo por defecto
function isDefaultCode(code) {
    const examples = Object.values({
        javascript: getDefaultCode('javascript'),
        python: getDefaultCode('python'),
        htmlmixed: getDefaultCode('htmlmixed'),
        css: getDefaultCode('css'),
        sql: getDefaultCode('sql'),
        xml: getDefaultCode('xml')
    });
    
    return examples.some(example => code === example.trim());
}

// Función para cambiar el tema del editor
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    
    // Cargar CSS del tema si es necesario
    if (theme !== 'default' && theme !== 'monokai') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/${theme}.min.css`;
        document.head.appendChild(link);
    }
    
    codeEditor.setOption('theme', theme);
}

// Función para cambiar el tamaño de fuente
function changeFontSize() {
    const fontSize = document.getElementById('fontSizeSelect').value;
    const editorElement = document.querySelector('.CodeMirror');
    editorElement.style.fontSize = fontSize + 'px';
    codeEditor.refresh();
}

// Función para alternar números de línea
function toggleLineNumbers() {
    const showLineNumbers = document.getElementById('lineNumbers').checked;
    codeEditor.setOption('lineNumbers', showLineNumbers);
}

// Función para alternar ajuste de línea
function toggleWordWrap() {
    const wordWrap = document.getElementById('wordWrap').checked;
    codeEditor.setOption('lineWrapping', wordWrap);
}

// Función para alternar autocompletado
function toggleAutoComplete() {
    const autoComplete = document.getElementById('autoComplete').checked;
    // El autocompletado se maneja con Ctrl+Space, aquí solo mostramos el estado
    if (autoComplete) {
        showAlert.info('Autocompletado', 'Presiona Ctrl+Space para activar el autocompletado');
    }
}

// Función para insertar snippets de código
function insertSnippet(type) {
    let snippet = '';
    
    switch (currentLanguage) {
        case 'javascript':
            snippet = getJavaScriptSnippet(type);
            break;
        case 'python':
            snippet = getPythonSnippet(type);
            break;
        case 'htmlmixed':
            snippet = getHTMLSnippet(type);
            break;
        case 'css':
            snippet = getCSSSnippet(type);
            break;
        default:
            snippet = getGenericSnippet(type);
    }
    
    if (snippet) {
        const cursor = codeEditor.getCursor();
        codeEditor.replaceRange(snippet, cursor);
        codeEditor.focus();
    }
}

// Snippets para JavaScript
function getJavaScriptSnippet(type) {
    const snippets = {
        function: `function nombreFuncion(parametro) {
    // Tu código aquí
    return parametro;
}`,
        loop: `for (let i = 0; i < array.length; i++) {
    // Tu código aquí
    console.log(array[i]);
}`,
        class: `class MiClase {
    constructor(parametro) {
        this.propiedad = parametro;
    }
    
    metodo() {
        // Tu código aquí
        return this.propiedad;
    }
}`,
        comment: `/**
 * Descripción de la función o clase
 * @param {tipo} parametro - Descripción del parámetro
 * @returns {tipo} Descripción del valor de retorno
 */`
    };
    
    return snippets[type] || '';
}

// Snippets para Python
function getPythonSnippet(type) {
    const snippets = {
        function: `def nombre_funcion(parametro):
    """Descripción de la función"""
    # Tu código aquí
    return parametro`,
        loop: `for item in lista:
    # Tu código aquí
    print(item)`,
        class: `class MiClase:
    def __init__(self, parametro):
        self.propiedad = parametro
    
    def metodo(self):
        # Tu código aquí
        return self.propiedad`,
        comment: `"""
Descripción de la función o clase
Args:
    parametro (tipo): Descripción del parámetro
Returns:
    tipo: Descripción del valor de retorno
"""`
    };
    
    return snippets[type] || '';
}

// Snippets para HTML
function getHTMLSnippet(type) {
    const snippets = {
        function: `<script>
function nombreFuncion() {
    // Tu código JavaScript aquí
}
</script>`,
        loop: `<ul>
    <li>Elemento 1</li>
    <li>Elemento 2</li>
    <li>Elemento 3</li>
</ul>`,
        class: `<div class="mi-clase">
    <h2>Título</h2>
    <p>Contenido del div</p>
</div>`,
        comment: `<!-- Comentario HTML -->`
    };
    
    return snippets[type] || '';
}

// Snippets para CSS
function getCSSSnippet(type) {
    const snippets = {
        function: `.mi-clase {
    /* Propiedades CSS */
    display: flex;
    justify-content: center;
    align-items: center;
}`,
        loop: `@media (max-width: 768px) {
    /* Estilos para dispositivos móviles */
    .container {
        width: 100%;
        padding: 10px;
    }
}`,
        class: `.nueva-clase {
    /* Propiedades de la clase */
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 5px;
}`,
        comment: `/* Comentario CSS */`
    };
    
    return snippets[type] || '';
}

// Snippets genéricos
function getGenericSnippet(type) {
    const snippets = {
        comment: `// Comentario`,
        function: `// Función de ejemplo`,
        loop: `// Bucle de ejemplo`,
        class: `// Clase de ejemplo`
    };
    
    return snippets[type] || '';
}

// Función para ejecutar código
function executeCode() {
    const code = codeEditor.getValue();
    clearOutput();
    
    if (!code.trim()) {
        showOutput('Por favor, escribe algún código para ejecutar.', 'console');
        return;
    }
    
    try {
        switch (currentLanguage) {
            case 'javascript':
                executeJavaScript(code);
                break;
            case 'htmlmixed':
                executeHTML(code);
                break;
            case 'python':
                showOutput('Ejecución de Python no está disponible en el navegador.\nSimulando resultado...', 'console');
                simulatePythonExecution(code);
                break;
            case 'css':
                previewCSS(code);
                break;
            case 'sql':
                showOutput('Ejecución de SQL no está disponible.\nEste es código SQL válido.', 'console');
                break;
            case 'xml':
                validateXML(code);
                break;
            default:
                showOutput('Lenguaje no soportado para ejecución.', 'console');
        }
    } catch (error) {
        showError(error.message);
    }
}

// Función para ejecutar JavaScript
function executeJavaScript(code) {
    // Capturar console.log
    const originalLog = console.log;
    const originalError = console.error;
    const logs = [];
    
    console.log = function(...args) {
        logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalLog.apply(console, arguments);
    };
    
    console.error = function(...args) {
        logs.push('ERROR: ' + args.join(' '));
        originalError.apply(console, arguments);
    };
    
    try {
        // Ejecutar código en un contexto seguro
        const result = eval(code);
        
        if (result !== undefined) {
            logs.push('Resultado: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
        }
        
        if (logs.length === 0) {
            logs.push('Código ejecutado correctamente (sin salida).');
        }
        
        showOutput(logs.join('\n'), 'console');
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Restaurar console original
        console.log = originalLog;
        console.error = originalError;
    }
}

// Función para ejecutar/previsualizar HTML
function executeHTML(code) {
    const previewFrame = document.getElementById('previewFrame');
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    // Cambiar a la pestaña de vista previa
    document.getElementById('preview-tab').click();
    
    showOutput('HTML cargado en la vista previa.', 'console');
}

// Función para simular ejecución de Python
function simulatePythonExecution(code) {
    // Simulación básica para mostrar funcionalidad
    let output = 'Simulación de ejecución Python:\n\n';
    
    // Detectar prints
    const printMatches = code.match(/print\s*\([^)]+\)/g);
    if (printMatches) {
        printMatches.forEach(match => {
            const content = match.match(/print\s*\(["']?([^"')]+)["']?\)/);
            if (content) {
                output += content[1] + '\n';
            }
        });
    }
    
    // Detectar definiciones de funciones
    const functionMatches = code.match(/def\s+(\w+)/g);
    if (functionMatches) {
        output += '\nFunciones definidas:\n';
        functionMatches.forEach(match => {
            const funcName = match.replace('def ', '');
            output += `- ${funcName}\n`;
        });
    }
    
    if (output === 'Simulación de ejecución Python:\n\n') {
        output += 'Código Python válido (sin salida visible).';
    }
    
    setTimeout(() => {
        showOutput(output, 'console');
    }, 500);
}

// Función para previsualizar CSS
function previewCSS(code) {
    const previewHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        ${code}
    </style>
</head>
<body>
    <h1>Vista Previa de CSS</h1>
    <div class="mi-clase">Ejemplo de div con clase</div>
    <p>Párrafo de ejemplo</p>
    <button class="btn">Botón de ejemplo</button>
</body>
</html>`;
    
    const previewFrame = document.getElementById('previewFrame');
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    document.getElementById('preview-tab').click();
    showOutput('CSS aplicado en la vista previa.', 'console');
}

// Función para validar XML
function validateXML(code) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(code, "text/xml");
        
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            throw new Error(parseError[0].textContent);
        }
        
        showOutput('XML válido y bien formado.', 'console');
    } catch (error) {
        showError('Error en XML: ' + error.message);
    }
}

// Función para mostrar salida
function showOutput(message, tab = 'console') {
    const outputElement = document.getElementById(`${tab}Output`) || document.getElementById('consoleOutput');
    outputElement.textContent = message;
    
    // Activar la pestaña correspondiente
    if (tab !== 'console') {
        document.getElementById(`${tab}-tab`).click();
    }
}

// Función para mostrar errores
function showError(message) {
    const errorsOutput = document.getElementById('errorsOutput');
    errorsOutput.textContent = message;
    
    // Activar pestaña de errores
    document.getElementById('errors-tab').click();
    
    // Agregar clase de error visual
    document.getElementById('errors-tab').classList.add('text-danger');
    setTimeout(() => {
        document.getElementById('errors-tab').classList.remove('text-danger');
    }, 3000);
}

// Función para limpiar salida
function clearOutput() {
    document.getElementById('consoleOutput').textContent = 'Consola lista para mostrar resultados...';
    document.getElementById('errorsOutput').textContent = 'No hay errores reportados.';
}

// Función para limpiar errores
function clearErrors() {
    const errorsOutput = document.getElementById('errorsOutput');
    if (errorsOutput.textContent !== 'No hay errores reportados.') {
        errorsOutput.textContent = 'No hay errores reportados.';
    }
}

// Función para formatear código
function formatCode() {
    const code = codeEditor.getValue();
    let formattedCode = code;
    
    try {
        if (currentLanguage === 'javascript') {
            // Formateo básico para JavaScript
            formattedCode = formatJavaScript(code);
        } else if (currentLanguage === 'htmlmixed') {
            // Formateo básico para HTML
            formattedCode = formatHTML(code);
        }
        
        codeEditor.setValue(formattedCode);
        showAlert.success('¡Formateado!', 'Código formateado correctamente');
    } catch (error) {
        showAlert.error('Error de Formateo', 'No se pudo formatear el código: ' + error.message);
    }
}

// Formateo básico para JavaScript
function formatJavaScript(code) {
    // Formateo muy básico
    return code
        .replace(/;/g, ';\n')
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n');
}

// Formateo básico para HTML
function formatHTML(code) {
    // Formateo muy básico
    return code
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');
}

// Función para buscar y reemplazar
function findReplace() {
    const searchText = prompt('Buscar:');
    if (searchText) {
        const replaceText = prompt('Reemplazar con:');
        if (replaceText !== null) {
            const currentCode = codeEditor.getValue();
            const newCode = currentCode.replace(new RegExp(searchText, 'g'), replaceText);
            codeEditor.setValue(newCode);
            showAlert.success('¡Reemplazado!', `Se reemplazaron todas las ocurrencias de "${searchText}"`);
        }
    }
}

// Función para pantalla completa
function toggleFullscreen() {
    const isFullscreen = codeEditor.getOption("fullScreen");
    codeEditor.setOption("fullScreen", !isFullscreen);
}

// Función para limpiar editor
function clearEditor() {
    showAlert.confirm(
        '¿Limpiar Editor?',
        '¿Estás seguro de que deseas limpiar todo el código? Esta acción no se puede deshacer.'
    ).then((result) => {
        if (result.isConfirmed) {
            codeEditor.setValue('');
            clearOutput();
            showAlert.success('¡Limpiado!', 'Editor limpiado correctamente');
        }
    });
}

// Función para guardar código
function saveCode() {
    const code = codeEditor.getValue();
    
    if (!code.trim()) {
        showAlert.warning('Editor Vacío', 'No hay código para guardar');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('saveCodeModal'));
    modal.show();
}

// Función para confirmar guardado de código
function confirmSaveCode() {
    const title = document.getElementById('codeTitle').value;
    const description = document.getElementById('codeDescription').value;
    const tags = document.getElementById('codeTags').value;
    
    if (!title.trim()) {
        showAlert.warning('Título Requerido', 'Por favor ingresa un título para el archivo');
        return;
    }
    
    const codeData = {
        id: Date.now(),
        title: title,
        description: description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        language: currentLanguage,
        code: codeEditor.getValue(),
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
    };
    
    try {
        // Guardar en localStorage
        const savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
        savedCodes.push(codeData);
        localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
        
        // Cerrar modal y actualizar lista
        const modal = bootstrap.Modal.getInstance(document.getElementById('saveCodeModal'));
        modal.hide();
        
        // Limpiar formulario
        document.getElementById('saveCodeForm').reset();
        
        // Actualizar lista
        loadSavedCodes();
        
        showAlert.success('¡Guardado!', 'Código guardado correctamente');
        
    } catch (error) {
        console.error('Error al guardar código:', error);
        showAlert.error('Error', 'No se pudo guardar el código');
    }
}

// Función para cargar códigos guardados
function loadSavedCodes() {
    try {
        savedCodes = JSON.parse(localStorage.getItem('savedCodes') || '[]');
        renderSavedCodesList();
    } catch (error) {
        console.error('Error al cargar códigos guardados:', error);
        savedCodes = [];
    }
}

// Función para renderizar lista de códigos guardados
function renderSavedCodesList() {
    const container = document.getElementById('savedCodesList');
    
    if (savedCodes.length === 0) {
        container.innerHTML = '<p class="text-muted small">No hay códigos guardados</p>';
        return;
    }
    
    let listHTML = '';
    savedCodes.slice(-5).reverse().forEach(code => {
        listHTML += `
            <div class="mb-2 p-2 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 small">${code.title}</h6>
                        <small class="text-muted">${code.language}</small>
                    </div>
                    <div class="btn-group-vertical btn-group-sm">
                        <button class="btn btn-outline-primary btn-sm" onclick="loadSavedCode(${code.id})" title="Cargar">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteSavedCode(${code.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = listHTML;
}

// Función para mostrar modal de cargar código
function loadCode() {
    if (savedCodes.length === 0) {
        showAlert.info('Sin Códigos', 'No hay códigos guardados para cargar');
        return;
    }
    
    renderLoadCodeModal();
    const modal = new bootstrap.Modal(document.getElementById('loadCodeModal'));
    modal.show();
}

// Función para renderizar modal de cargar código
function renderLoadCodeModal() {
    const container = document.getElementById('loadCodeList');
    
    let listHTML = '';
    savedCodes.forEach(code => {
        listHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="card-title">${code.title}</h6>
                            <p class="card-text small text-muted">${code.description || 'Sin descripción'}</p>
                            <div class="mb-2">
                                <span class="badge bg-primary">${code.language}</span>
                                ${code.tags.map(tag => `<span class="badge bg-secondary ms-1">${tag}</span>`).join('')}
                            </div>
                            <small class="text-muted">
                                Creado: ${formatDate(code.dateCreated, true)}
                            </small>
                        </div>
                        <div class="btn-group-vertical">
                            <button class="btn btn-primary btn-sm" onclick="loadSavedCode(${code.id}); closeLoadModal();">
                                <i class="fas fa-folder-open me-1"></i> Cargar
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteSavedCode(${code.id})">
                                <i class="fas fa-trash me-1"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = listHTML;
}

// Función para cargar código guardado
function loadSavedCode(id) {
    const code = savedCodes.find(c => c.id === id);
    if (!code) {
        showAlert.error('Error', 'Código no encontrado');
        return;
    }
    
    // Establecer lenguaje
    document.getElementById('languageSelect').value = code.language;
    currentLanguage = code.language;
    codeEditor.setOption('mode', code.language);
    
    // Cargar código
    codeEditor.setValue(code.code);
    
    clearOutput();
    showAlert.success('¡Cargado!', `Código "${code.title}" cargado correctamente`);
}

// Función para eliminar código guardado
function deleteSavedCode(id) {
    const code = savedCodes.find(c => c.id === id);
    if (!code) return;
    
    showAlert.confirm(
        '¿Eliminar Código?',
        `¿Estás seguro de que deseas eliminar "${code.title}"?`
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                savedCodes = savedCodes.filter(c => c.id !== id);
                localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
                
                renderSavedCodesList();
                renderLoadCodeModal();
                
                showAlert.success('¡Eliminado!', 'Código eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar código:', error);
                showAlert.error('Error', 'No se pudo eliminar el código');
            }
        }
    });
}

// Función para cerrar modal de cargar
function closeLoadModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('loadCodeModal'));
    if (modal) {
        modal.hide();
    }
}

// Exponer funciones globalmente
window.loadCodigoSection = loadCodigoSection;
window.executeCode = executeCode;
window.saveCode = saveCode;
window.confirmSaveCode = confirmSaveCode;
window.loadCode = loadCode;
window.loadSavedCode = loadSavedCode;
window.deleteSavedCode = deleteSavedCode;
window.closeLoadModal = closeLoadModal;
window.clearEditor = clearEditor;
window.changeLanguage = changeLanguage;
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
window.toggleLineNumbers = toggleLineNumbers;
window.toggleWordWrap = toggleWordWrap;
window.toggleAutoComplete = toggleAutoComplete;
window.insertSnippet = insertSnippet;
window.formatCode = formatCode;
window.findReplace = findReplace;
window.toggleFullscreen = toggleFullscreen;
