/**
 * Módulo de gestión de matrículas
 * Formulario completo de matrícula con información de estudiantes, tutores y documentación
 */

let matriculasData = [];
let currentMatriculasPage = 1;
const matriculasPerPage = 10;

// Función principal para cargar la sección de matrículas
function loadMatriculasSection() {
    const section = document.getElementById('matriculas-section');
    section.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <h1 class="h2">
                    <i class="fas fa-clipboard-check me-2"></i>
                    Formulario de Matrícula
                </h1>
                <div class="btn-toolbar">
                    <div class="btn-group me-2">
                        <button type="button" class="btn btn-primary" onclick="showAddMatriculaModal()">
                            <i class="fas fa-plus me-1"></i> Nueva Matrícula
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="exportMatriculas()">
                            <i class="fas fa-download me-1"></i> Exportar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="refreshMatriculas()">
                            <i class="fas fa-sync me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card card-success">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Matrículas Activas
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-matriculas-activas">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clipboard-check fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-warning">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Matrículas Este Mes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="matriculas-este-mes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-calendar-check fa-2x text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-info">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Pendientes
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="matriculas-pendientes">0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clock fa-2x text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-primary">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Ingresos
                                </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800" id="ingresos-matriculas">RD$ 0</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filtros-section">
            <div class="row">
                <div class="col-md-3">
                    <label for="searchMatriculas" class="form-label">Buscar:</label>
                    <input type="text" class="form-control" id="searchMatriculas" 
                           placeholder="Nombre o cédula..." 
                           oninput="filterMatriculas()">
                </div>
                <div class="col-md-2">
                    <label for="filterGradoMatricula" class="form-label">Grado:</label>
                    <select class="form-select" id="filterGradoMatricula" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="1">1ro</option>
                        <option value="2">2do</option>
                        <option value="3">3ro</option>
                        <option value="4">4to</option>
                        <option value="5">5to</option>
                        <option value="6">6to</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterEstadoMatricula" class="form-label">Estado:</label>
                    <select class="form-select" id="filterEstadoMatricula" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="Activa">Activa</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Retirada">Retirada</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterAnoLectivo" class="form-label">Año:</label>
                    <select class="form-select" id="filterAnoLectivo" onchange="filterMatriculas()">
                        <option value="">Todos</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label for="filterModalidad" class="form-label">Modalidad:</label>
                    <select class="form-select" id="filterModalidad" onchange="filterMatriculas()">
                        <option value="">Todas</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Semi-presencial">Semi-presencial</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-secondary d-block w-100" onclick="clearMatriculasFilters()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de matrículas -->
        <div class="card">
            <div class="card-header">
                <h6 class="m-0 font-weight-bold">Lista de Matrículas</h6>
            </div>
            <div class="card-body">
                <div id="matriculasTableContainer">
                    <!-- La tabla se cargará aquí -->
                </div>
                <div id="matriculasPagination" class="mt-3">
                    <!-- La paginación se cargará aquí -->
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar matrícula -->
        <div class="modal fade" id="matriculaModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="matriculaModalTitle">
                            <i class="fas fa-clipboard-list me-2"></i>
                            Nueva Matrícula
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="matriculaForm">
                            <input type="hidden" id="matriculaId">
                            
                            <!-- Pestañas del formulario -->
                            <ul class="nav nav-tabs" id="matriculaTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="estudiante-tab" data-bs-toggle="tab" data-bs-target="#estudiante-pane" type="button" role="tab">
                                        <i class="fas fa-user-graduate me-1"></i> Estudiante
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="tutores-tab" data-bs-toggle="tab" data-bs-target="#tutores-pane" type="button" role="tab">
                                        <i class="fas fa-users me-1"></i> Tutores
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="academico-tab" data-bs-toggle="tab" data-bs-target="#academico-pane" type="button" role="tab">
                                        <i class="fas fa-graduation-cap me-1"></i> Académico
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="documentos-tab" data-bs-toggle="tab" data-bs-target="#documentos-pane" type="button" role="tab">
                                        <i class="fas fa-file-alt me-1"></i> Documentos
                                    </button>
                                </li>
                            </ul>

                            <div class="tab-content mt-3" id="matriculaTabContent">
                                <!-- Pestaña Estudiante -->
                                <div class="tab-pane fade show active" id="estudiante-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="nombresEst" class="form-label">Nombres *</label>
                                                <input type="text" class="form-control" id="nombresEst" name="nombres" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="apellidosEst" class="form-label">Apellidos *</label>
                                                <input type="text" class="form-control" id="apellidosEst" name="apellidos" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="cedulaEst" class="form-label">Cédula</label>
                                                <input type="text" class="form-control" id="cedulaEst" name="cedula" 
                                                       placeholder="000-0000000-0" data-validate="cedula">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento *</label>
                                                <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="genero" class="form-label">Género *</label>
                                                <select class="form-select" id="genero" name="genero" required>
                                                    <option value="">Seleccionar género</option>
                                                    <option value="Masculino">Masculino</option>
                                                    <option value="Femenino">Femenino</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="telefono" class="form-label">Teléfono</label>
                                                <input type="tel" class="form-control" id="telefono" name="telefono" 
                                                       placeholder="809-000-0000">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="email" class="form-label">Email</label>
                                                <input type="email" class="form-control" id="email" name="email">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="departamento" class="form-label">Departamento *</label>
                                                <select class="form-select" id="departamento" name="departamento" onchange="loadMunicipios()" required>
                                                    <option value="">Seleccionar departamento</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="municipio" class="form-label">Municipio *</label>
                                                <select class="form-select" id="municipio" name="municipio" required>
                                                    <option value="">Seleccionar municipio</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="nacionalidad" class="form-label">Nacionalidad</label>
                                                <input type="text" class="form-control" id="nacionalidad" name="nacionalidad" 
                                                       value="Dominicana">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="direccion" class="form-label">Dirección *</label>
                                        <textarea class="form-control" id="direccion" name="direccion" rows="2" required></textarea>
                                    </div>
                                </div>

                                <!-- Pestaña Tutores -->
                                <div class="tab-pane fade" id="tutores-pane" role="tabpanel">
                                    <!-- Tutor Principal -->
                                    <div class="mb-4">
                                        <h6 class="text-primary border-bottom pb-2">Tutor Principal</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="nombresTutor1" class="form-label">Nombres *</label>
                                                    <input type="text" class="form-control" id="nombresTutor1" name="nombresTutor1" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="apellidosTutor1" class="form-label">Apellidos *</label>
                                                    <input type="text" class="form-control" id="apellidosTutor1" name="apellidosTutor1" required>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="cedulaTutor1" class="form-label">Cédula *</label>
                                                    <input type="text" class="form-control" id="cedulaTutor1" name="cedulaTutor1" 
                                                           placeholder="000-0000000-0" required>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="parentescoTutor1" class="form-label">Parentesco *</label>
                                                    <select class="form-select" id="parentescoTutor1" name="parentescoTutor1" required>
                                                        <option value="">Seleccionar</option>
                                                        <option value="Padre">Padre</option>
                                                        <option value="Madre">Madre</option>
                                                        <option value="Abuelo">Abuelo</option>
                                                        <option value="Abuela">Abuela</option>
                                                        <option value="Tío">Tío</option>
                                                        <option value="Tía">Tía</option>
                                                        <option value="Tutor Legal">Tutor Legal</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="ocupacionTutor1" class="form-label">Ocupación</label>
                                                    <select class="form-select" id="ocupacionTutor1" name="ocupacionTutor1">
                                                        <option value="">Seleccionar</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="telefonoTutor1" class="form-label">Teléfono *</label>
                                                    <input type="tel" class="form-control" id="telefonoTutor1" name="telefonoTutor1" 
                                                           placeholder="809-000-0000" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="emailTutor1" class="form-label">Email</label>
                                                    <input type="email" class="form-control" id="emailTutor1" name="emailTutor1">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Tutor Secundario -->
                                    <div class="mb-4">
                                        <h6 class="text-secondary border-bottom pb-2">Tutor Secundario (Opcional)</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="nombresTutor2" class="form-label">Nombres</label>
                                                    <input type="text" class="form-control" id="nombresTutor2" name="nombresTutor2">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="apellidosTutor2" class="form-label">Apellidos</label>
                                                    <input type="text" class="form-control" id="apellidosTutor2" name="apellidosTutor2">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="cedulaTutor2" class="form-label">Cédula</label>
                                                    <input type="text" class="form-control" id="cedulaTutor2" name="cedulaTutor2" 
                                                           placeholder="000-0000000-0">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="parentescoTutor2" class="form-label">Parentesco</label>
                                                    <select class="form-select" id="parentescoTutor2" name="parentescoTutor2">
                                                        <option value="">Seleccionar</option>
                                                        <option value="Padre">Padre</option>
                                                        <option value="Madre">Madre</option>
                                                        <option value="Abuelo">Abuelo</option>
                                                        <option value="Abuela">Abuela</option>
                                                        <option value="Tío">Tío</option>
                                                        <option value="Tía">Tía</option>
                                                        <option value="Tutor Legal">Tutor Legal</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="ocupacionTutor2" class="form-label">Ocupación</label>
                                                    <select class="form-select" id="ocupacionTutor2" name="ocupacionTutor2">
                                                        <option value="">Seleccionar</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="telefonoTutor2" class="form-label">Teléfono</label>
                                                    <input type="tel" class="form-control" id="telefonoTutor2" name="telefonoTutor2" 
                                                           placeholder="809-000-0000">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="emailTutor2" class="form-label">Email</label>
                                                    <input type="email" class="form-control" id="emailTutor2" name="emailTutor2">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pestaña Académico -->
                                <div class="tab-pane fade" id="academico-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="gradoMatricula" class="form-label">Grado *</label>
                                                <select class="form-select" id="gradoMatricula" name="grado" required>
                                                    <option value="">Seleccionar grado</option>
                                                    <option value="1">Primer Grado</option>
                                                    <option value="2">Segundo Grado</option>
                                                    <option value="3">Tercer Grado</option>
                                                    <option value="4">Cuarto Grado</option>
                                                    <option value="5">Quinto Grado</option>
                                                    <option value="6">Sexto Grado</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="anoLectivo" class="form-label">Año Lectivo *</label>
                                                <select class="form-select" id="anoLectivo" name="anoLectivo" required>
                                                    <option value="">Seleccionar año</option>
                                                    <option value="2024-2025">2024-2025</option>
                                                    <option value="2025-2026">2025-2026</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="modalidad" class="form-label">Modalidad *</label>
                                                <select class="form-select" id="modalidad" name="modalidad" required>
                                                    <option value="">Seleccionar modalidad</option>
                                                    <option value="Presencial">Presencial</option>
                                                    <option value="Semi-presencial">Semi-presencial</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="turno" class="form-label">Turno *</label>
                                                <select class="form-select" id="turno" name="turno" required>
                                                    <option value="">Seleccionar turno</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="tipoEstudiante" class="form-label">Tipo de Estudiante</label>
                                                <select class="form-select" id="tipoEstudiante" name="tipoEstudiante">
                                                    <option value="">Seleccionar</option>
                                                    <option value="Nuevo">Nuevo</option>
                                                    <option value="Reingreso">Reingreso</option>
                                                    <option value="Transferencia">Transferencia</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="jornada" class="form-label">Jornada</label>
                                                <select class="form-select" id="jornada" name="jornada">
                                                    <option value="">Seleccionar</option>
                                                    <option value="Completa">Completa</option>
                                                    <option value="Extendida">Extendida</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="montoMatricula" class="form-label">Monto de Matrícula</label>
                                                <input type="number" class="form-control" id="montoMatricula" name="montoMatricula" 
                                                       step="0.01" min="0" placeholder="0.00">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="metodoPago" class="form-label">Método de Pago</label>
                                                <select class="form-select" id="metodoPago" name="metodoPago">
                                                    <option value="">Seleccionar</option>
                                                    <option value="Efectivo">Efectivo</option>
                                                    <option value="Transferencia">Transferencia</option>
                                                    <option value="Cheque">Cheque</option>
                                                    <option value="Tarjeta">Tarjeta</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="fechaMatricula" class="form-label">Fecha de Matrícula *</label>
                                                <input type="date" class="form-control" id="fechaMatricula" name="fechaMatricula" required>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="estadoMatricula" class="form-label">Estado *</label>
                                                <select class="form-select" id="estadoMatricula" name="estado" required>
                                                    <option value="Activa">Activa</option>
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Cancelada">Cancelada</option>
                                                    <option value="Retirada">Retirada</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="observacionesMatricula" class="form-label">Observaciones</label>
                                                <textarea class="form-control" id="observacionesMatricula" name="observaciones" rows="3"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pestaña Documentos -->
                                <div class="tab-pane fade" id="documentos-pane" role="tabpanel">
                                    <h6 class="mb-3">Documentos Requeridos</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="acta_nacimiento" id="doc1" name="documentos">
                                                <label class="form-check-label" for="doc1">
                                                    Acta de Nacimiento
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="record_notas" id="doc2" name="documentos">
                                                <label class="form-check-label" for="doc2">
                                                    Record de Notas
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="fotos" id="doc3" name="documentos">
                                                <label class="form-check-label" for="doc3">
                                                    2 Fotos 2x2
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="certificado_medico" id="doc4" name="documentos">
                                                <label class="form-check-label" for="doc4">
                                                    Certificado Médico
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="cedula_tutor1" id="doc5" name="documentos">
                                                <label class="form-check-label" for="doc5">
                                                    Cédula del Tutor Principal
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="cedula_tutor2" id="doc6" name="documentos">
                                                <label class="form-check-label" for="doc6">
                                                    Cédula del Tutor Secundario
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="certificado_ingresos" id="doc7" name="documentos">
                                                <label class="form-check-label" for="doc7">
                                                    Certificado de Ingresos
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" value="certificado_trabajo" id="doc8" name="documentos">
                                                <label class="form-check-label" for="doc8">
                                                    Certificado de Trabajo
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info me-1" onclick="previewMatricula()">
                            <i class="fas fa-eye me-1"></i> Vista Previa
                        </button>
                        <button type="button" class="btn btn-primary" onclick="saveMatricula()">
                            <i class="fas fa-save me-1"></i> Guardar Matrícula
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para vista previa -->
        <div class="modal fade" id="previewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-eye me-2"></i>
                            Vista Previa de Matrícula
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="previewContent">
                        <!-- El contenido de la vista previa se cargará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-success" onclick="printMatricula()">
                            <i class="fas fa-print me-1"></i> Imprimir
                        </button>
                        <button type="button" class="btn btn-primary" onclick="exportMatriculaPDF()">
                            <i class="fas fa-file-pdf me-1"></i> Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadMatriculasData();
    updateMatriculasStats();
}

// Función para cargar datos de matrículas
function loadMatriculasData() {
    matriculasData = db.getAll('matriculas') || [];
    displayMatriculas();
}

// Función para mostrar matrículas
function displayMatriculas() {
    const container = document.getElementById('matriculasTableContainer');
    if (!container) return;

    if (matriculasData.length === 0) {
        showEmptyState(container, 'No hay matrículas registradas', 'fas fa-clipboard-list');
        document.getElementById('matriculasPagination').innerHTML = '';
        return;
    }

    // Aplicar filtros
    let filteredData = applyMatriculasFilters();
    
    // Paginar datos
    const paginatedData = paginateData(filteredData, currentMatriculasPage, matriculasPerPage);
    
    // Crear tabla
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Año Lectivo</th>
                        <th>Estado</th>
                        <th>Fecha Matrícula</th>
                        <th>Monto</th>
                        <th>Modalidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    paginatedData.data.forEach(matricula => {
        const nombreCompleto = `${matricula.nombres || ''} ${matricula.apellidos || ''}`;
        const estadoBadge = getEstadoBadge(matricula.estado);
        const montoFormateado = formatCurrency(matricula.montoMatricula || 0);
        
        tableHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                            <i class="fas fa-user-graduate text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${nombreCompleto}</div>
                            <small class="text-muted">${matricula.cedula || 'Sin cédula'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-primary">${getGradoText(matricula.grado)}</span>
                </td>
                <td>${matricula.anoLectivo}</td>
                <td>${estadoBadge}</td>
                <td>${formatDateShort(matricula.fechaMatricula)}</td>
                <td>${montoFormateado}</td>
                <td>
                    <small class="text-muted">${matricula.modalidad}</small><br>
                    <small class="text-muted">${matricula.jornada || ''}</small>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="editMatricula('${matricula.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="viewMatricula('${matricula.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteMatricula('${matricula.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Actualizar paginación
    document.getElementById('matriculasPagination').innerHTML = 
        createPagination(paginatedData.totalPages, currentMatriculasPage, 'goToMatriculasPage');
}

// Función para obtener badge del estado
function getEstadoBadge(estado) {
    const badges = {
        'Activa': '<span class="badge bg-success">Activa</span>',
        'Pendiente': '<span class="badge bg-warning">Pendiente</span>',
        'Cancelada': '<span class="badge bg-danger">Cancelada</span>',
        'Retirada': '<span class="badge bg-secondary">Retirada</span>'
    };
    return badges[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

// Aplicar filtros
function applyMatriculasFilters() {
    let filtered = [...matriculasData];
    
    const searchTerm = document.getElementById('searchMatriculas')?.value?.toLowerCase() || '';
    const gradoFilter = document.getElementById('filterGradoMatricula')?.value || '';
    const estadoFilter = document.getElementById('filterEstadoMatricula')?.value || '';
    const anoFilter = document.getElementById('filterAnoLectivo')?.value || '';
    const modalidadFilter = document.getElementById('filterModalidad')?.value || '';
    
    if (searchTerm) {
        filtered = filtered.filter(matricula => {
            const nombreCompleto = `${matricula.nombres} ${matricula.apellidos}`.toLowerCase();
            return nombreCompleto.includes(searchTerm) || 
                   (matricula.cedula && matricula.cedula.includes(searchTerm));
        });
    }
    
    if (gradoFilter) {
        filtered = filtered.filter(m => m.grado === gradoFilter);
    }
    
    if (estadoFilter) {
        filtered = filtered.filter(m => m.estado === estadoFilter);
    }
    
    if (anoFilter) {
        filtered = filtered.filter(m => m.anoLectivo === anoFilter);
    }
    
    if (modalidadFilter) {
        filtered = filtered.filter(m => m.modalidad === modalidadFilter);
    }
    
    return filtered;
}

// Limpiar filtros
function clearMatriculasFilters() {
    document.getElementById('searchMatriculas').value = '';
    document.getElementById('filterGradoMatricula').value = '';
    document.getElementById('filterEstadoMatricula').value = '';
    document.getElementById('filterAnoLectivo').value = '';
    document.getElementById('filterModalidad').value = '';
    filterMatriculas();
}

// Filtrar matrículas
function filterMatriculas() {
    currentMatriculasPage = 1;
    displayMatriculas();
}

// Cambiar página
function goToMatriculasPage(page) {
    currentMatriculasPage = page;
    displayMatriculas();
}

// Mostrar modal de nueva matrícula
function showAddMatriculaModal() {
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    document.getElementById('matriculaModalTitle').innerHTML = '<i class="fas fa-clipboard-list me-2"></i>Nueva Matrícula';
    document.getElementById('matriculaId').value = '';
    clearForm(document.getElementById('matriculaForm'));
    
    // Establecer fecha actual y valores por defecto
    document.getElementById('fechaMatricula').value = new Date().toISOString().split('T')[0];
    document.getElementById('anoLectivo').value = getCurrentAcademicYear();
    document.getElementById('estadoMatricula').value = 'Activa';
    document.getElementById('nacionalidad').value = 'Dominicana';
    
    // Cargar opciones dinámicas
    loadDepartamentos();
    loadOcupaciones();
    loadTurnos();
    
    modal.show();
}

// Cargar departamentos
function loadDepartamentos() {
    const departamentos = db.getAll('departamentos');
    const select = document.getElementById('departamento');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar departamento</option>';
        departamentos.forEach(dept => {
            select.innerHTML += `<option value="${dept.id}">${dept.nombre}</option>`;
        });
    }
}

// Cargar municipios basados en departamento
function loadMunicipios() {
    const departamentoId = document.getElementById('departamento').value;
    const select = document.getElementById('municipio');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar municipio</option>';
    
    if (departamentoId) {
        const municipios = db.getMunicipiosByDepartamento(departamentoId);
        municipios.forEach(municipio => {
            select.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
        });
    }
}

// Cargar ocupaciones
function loadOcupaciones() {
    const ocupaciones = db.getAll('ocupaciones');
    const selects = ['ocupacionTutor1', 'ocupacionTutor2'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Seleccionar</option>';
            ocupaciones.forEach(ocupacion => {
                select.innerHTML += `<option value="${ocupacion.id}">${ocupacion.nombre}</option>`;
            });
        }
    });
}

// Cargar turnos
function loadTurnos() {
    const turnos = db.getAll('turnos');
    const select = document.getElementById('turno');
    
    if (select) {
        select.innerHTML = '<option value="">Seleccionar turno</option>';
        turnos.forEach(turno => {
            select.innerHTML += `<option value="${turno.id}">${turno.nombre} (${turno.horario})</option>`;
        });
    }
}

// Guardar matrícula
function saveMatricula() {
    const form = document.getElementById('matriculaForm');
    
    if (!validateForm(form)) {
        showAlert.error('Error', 'Por favor complete todos los campos requeridos correctamente');
        return;
    }
    
    const formData = new FormData(form);
    const matriculaData = {};
    
    // Convertir FormData a objeto
    for (let [key, value] of formData.entries()) {
        matriculaData[key] = value;
    }
    
    // Obtener documentos seleccionados
    const documentos = [];
    document.querySelectorAll('input[name="documentos"]:checked').forEach(checkbox => {
        documentos.push(checkbox.value);
    });
    matriculaData.documentos = documentos;
    
    try {
        const matriculaId = document.getElementById('matriculaId').value;
        
        if (matriculaId) {
            // Actualizar matrícula existente
            const updatedMatricula = db.update('matriculas', matriculaId, matriculaData);
            const index = matriculasData.findIndex(m => m.id === parseInt(matriculaId));
            if (index !== -1) {
                matriculasData[index] = updatedMatricula;
            }
            showAlert.success('¡Éxito!', 'Matrícula actualizada correctamente');
        } else {
            // Crear nueva matrícula
            const newMatricula = db.insert('matriculas', matriculaData);
            matriculasData.push(newMatricula);
            showAlert.success('¡Éxito!', 'Matrícula registrada correctamente');
        }
        
        // Actualizar vista y cerrar modal
        displayMatriculas();
        updateMatriculasStats();
        bootstrap.Modal.getInstance(document.getElementById('matriculaModal')).hide();
        
    } catch (error) {
        console.error('Error al guardar matrícula:', error);
        showAlert.error('Error', 'No se pudo guardar la matrícula');
    }
}

// Editar matrícula
function editMatricula(id) {
    const matricula = matriculasData.find(m => m.id === parseInt(id));
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('matriculaModal'));
    document.getElementById('matriculaModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Matrícula';
    document.getElementById('matriculaId').value = matricula.id;
    
    // Cargar opciones dinámicas
    loadDepartamentos();
    loadOcupaciones();
    loadTurnos();
    
    // Llenar formulario con datos existentes
    setTimeout(() => fillMatriculaForm(matricula), 100);
    
    modal.show();
}

// Llenar formulario con datos existentes
function fillMatriculaForm(matricula) {
    // Información del estudiante
    document.getElementById('nombresEst').value = matricula.nombres || '';
    document.getElementById('apellidosEst').value = matricula.apellidos || '';
    document.getElementById('cedulaEst').value = matricula.cedula || '';
    document.getElementById('fechaNacimiento').value = matricula.fechaNacimiento || '';
    document.getElementById('genero').value = matricula.genero || '';
    document.getElementById('direccion').value = matricula.direccion || '';
    document.getElementById('telefono').value = matricula.telefono || '';
    document.getElementById('email').value = matricula.email || '';
    document.getElementById('nacionalidad').value = matricula.nacionalidad || 'Dominicana';
    
    // Información académica
    document.getElementById('gradoMatricula').value = matricula.grado || '';
    document.getElementById('anoLectivo').value = matricula.anoLectivo || '';
    document.getElementById('modalidad').value = matricula.modalidad || '';
    document.getElementById('tipoEstudiante').value = matricula.tipoEstudiante || '';
    document.getElementById('jornada').value = matricula.jornada || '';
    document.getElementById('estadoMatricula').value = matricula.estado || '';
    document.getElementById('montoMatricula').value = matricula.montoMatricula || '';
    document.getElementById('fechaMatricula').value = matricula.fechaMatricula || '';
    document.getElementById('metodoPago').value = matricula.metodoPago || '';
    
    // Información de tutores
    document.getElementById('nombresTutor1').value = matricula.nombresTutor1 || '';
    document.getElementById('apellidosTutor1').value = matricula.apellidosTutor1 || '';
    document.getElementById('cedulaTutor1').value = matricula.cedulaTutor1 || '';
    document.getElementById('parentescoTutor1').value = matricula.parentescoTutor1 || '';
    document.getElementById('telefonoTutor1').value = matricula.telefonoTutor1 || '';
    document.getElementById('emailTutor1').value = matricula.emailTutor1 || '';
    
    document.getElementById('nombresTutor2').value = matricula.nombresTutor2 || '';
    document.getElementById('apellidosTutor2').value = matricula.apellidosTutor2 || '';
    document.getElementById('cedulaTutor2').value = matricula.cedulaTutor2 || '';
    document.getElementById('parentescoTutor2').value = matricula.parentescoTutor2 || '';
    document.getElementById('telefonoTutor2').value = matricula.telefonoTutor2 || '';
    document.getElementById('emailTutor2').value = matricula.emailTutor2 || '';
    
    // Observaciones
    document.getElementById('observacionesMatricula').value = matricula.observaciones || '';
    
    // Documentos
    if (matricula.documentos && Array.isArray(matricula.documentos)) {
        matricula.documentos.forEach(doc => {
            const checkbox = document.querySelector(`input[value="${doc}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Cargar municipios después de establecer departamento
    setTimeout(() => {
        document.getElementById('departamento').value = matricula.departamento || '';
        loadMunicipios();
        setTimeout(() => {
            document.getElementById('municipio').value = matricula.municipio || '';
        }, 100);
    }, 100);
}

// Eliminar matrícula
function deleteMatricula(id) {
    showAlert.confirm(
        '¿Está seguro?',
        'Esta acción no se puede deshacer. ¿Desea eliminar esta matrícula?'
    ).then((result) => {
        if (result.isConfirmed) {
            try {
                db.delete('matriculas', id);
                matriculasData = matriculasData.filter(m => m.id !== parseInt(id));
                displayMatriculas();
                updateMatriculasStats();
                showAlert.success('¡Eliminado!', 'La matrícula ha sido eliminada');
            } catch (error) {
                console.error('Error al eliminar matrícula:', error);
                showAlert.error('Error', 'No se pudo eliminar la matrícula');
            }
        }
    });
}

// Ver detalles de matrícula
function viewMatricula(id) {
    const matricula = matriculasData.find(m => m.id === parseInt(id));
    if (!matricula) {
        showAlert.error('Error', 'Matrícula no encontrada');
        return;
    }
    
    generatePreviewContent(matricula);
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    previewModal.show();
}

// Generar vista previa
function previewMatricula() {
    const form = document.getElementById('matriculaForm');
    const formData = new FormData(form);
    const matriculaData = {};
    
    for (let [key, value] of formData.entries()) {
        matriculaData[key] = value;
    }
    
    // Obtener documentos seleccionados
    const documentos = [];
    document.querySelectorAll('input[name="documentos"]:checked').forEach(checkbox => {
        documentos.push(checkbox.value);
    });
    matriculaData.documentos = documentos;
    
    generatePreviewContent(matriculaData);
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    previewModal.show();
}

// Generar contenido de vista previa
function generatePreviewContent(matricula) {
    const departamentos = db.getAll('departamentos');
    const municipios = db.getAll('municipios');
    const ocupaciones = db.getAll('ocupaciones');
    const turnos = db.getAll('turnos');
    
    const departamento = departamentos.find(d => d.id == matricula.departamento);
    const municipio = municipios.find(m => m.id == matricula.municipio);
    const ocupacion1 = ocupaciones.find(o => o.id == matricula.ocupacionTutor1);
    const ocupacion2 = ocupaciones.find(o => o.id == matricula.ocupacionTutor2);
    const turno = turnos.find(t => t.id == matricula.turno);
    
    const content = `
        <div class="container-fluid">
            <!-- Encabezado del documento -->
            <div class="text-center mb-4">
                <h3 class="mb-1">ESCUELA JESÚS EL BUEN MAESTRO</h3>
                <p class="mb-1">FORMULARIO DE MATRÍCULA</p>
                <p class="text-muted mb-0">Año Lectivo ${matricula.anoLectivo || '2024-2025'}</p>
                <hr>
            </div>
            
            <!-- Información del Estudiante -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-primary text-white p-2 rounded">INFORMACIÓN DEL ESTUDIANTE</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Nombres:</strong> ${matricula.nombres || ''}</p>
                    <p><strong>Apellidos:</strong> ${matricula.apellidos || ''}</p>
                    <p><strong>Cédula:</strong> ${matricula.cedula || 'No especificada'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${formatDate(matricula.fechaNacimiento) || ''}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Género:</strong> ${matricula.genero || ''}</p>
                    <p><strong>Teléfono:</strong> ${matricula.telefono || 'No especificado'}</p>
                    <p><strong>Email:</strong> ${matricula.email || 'No especificado'}</p>
                    <p><strong>Edad:</strong> ${matricula.fechaNacimiento ? calculateAge(matricula.fechaNacimiento) + ' años' : 'No calculada'}</p>
                </div>
                <div class="col-12">
                    <p><strong>Dirección:</strong> ${matricula.direccion || ''}</p>
                    <p><strong>Departamento:</strong> ${departamento ? departamento.nombre : 'No especificado'}</p>
                    <p><strong>Municipio:</strong> ${municipio ? municipio.nombre : 'No especificado'}</p>
                    <p><strong>Nacionalidad:</strong> ${matricula.nacionalidad || 'No especificada'}</p>
                </div>
            </div>
            
            <!-- Información Académica -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-success text-white p-2 rounded">INFORMACIÓN ACADÉMICA</h5>
                </div>
                <div class="col-md-6">
                    <p><strong>Grado:</strong> ${getGradoText(matricula.grado) || ''}</p>
                    <p><strong>Año Lectivo:</strong> ${matricula.anoLectivo || ''}</p>
                    <p><strong>Turno:</strong> ${turno ? turno.nombre + ' (' + turno.horario + ')' : 'No especificado'}</p>
                    <p><strong>Modalidad:</strong> ${matricula.modalidad || ''}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Tipo de Estudiante:</strong> ${matricula.tipoEstudiante || ''}</p>
                    <p><strong>Jornada:</strong> ${matricula.jornada || ''}</p>
                    <p><strong>Estado:</strong> ${matricula.estado || 'Activa'}</p>
                    <p><strong>Fecha de Matrícula:</strong> ${formatDate(matricula.fechaMatricula) || ''}</p>
                </div>
                <div class="col-12">
                    <p><strong>Monto:</strong> ${formatCurrency(matricula.montoMatricula || 0)}</p>
                    <p><strong>Método de Pago:</strong> ${matricula.metodoPago || 'No especificado'}</p>
                </div>
            </div>
            
            <!-- Información de Tutores -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-info text-white p-2 rounded">INFORMACIÓN DE TUTORES</h5>
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary">Tutor Principal</h6>
                    <p><strong>Nombres:</strong> ${matricula.nombresTutor1 || ''}</p>
                    <p><strong>Apellidos:</strong> ${matricula.apellidosTutor1 || ''}</p>
                    <p><strong>Cédula:</strong> ${matricula.cedulaTutor1 || ''}</p>
                    <p><strong>Parentesco:</strong> ${matricula.parentescoTutor1 || ''}</p>
                    <p><strong>Ocupación:</strong> ${ocupacion1 ? ocupacion1.nombre : 'No especificada'}</p>
                    <p><strong>Teléfono:</strong> ${matricula.telefonoTutor1 || ''}</p>
                    <p><strong>Email:</strong> ${matricula.emailTutor1 || 'No especificado'}</p>
                </div>
                <div class="col-md-6">
                    <h6 class="text-secondary">Tutor Secundario</h6>
                    <p><strong>Nombres:</strong> ${matricula.nombresTutor2 || 'No especificado'}</p>
                    <p><strong>Apellidos:</strong> ${matricula.apellidosTutor2 || 'No especificado'}</p>
                    <p><strong>Cédula:</strong> ${matricula.cedulaTutor2 || 'No especificada'}</p>
                    <p><strong>Parentesco:</strong> ${matricula.parentescoTutor2 || 'No especificado'}</p>
                    <p><strong>Ocupación:</strong> ${ocupacion2 ? ocupacion2.nombre : 'No especificada'}</p>
                    <p><strong>Teléfono:</strong> ${matricula.telefonoTutor2 || 'No especificado'}</p>
                    <p><strong>Email:</strong> ${matricula.emailTutor2 || 'No especificado'}</p>
                </div>
            </div>
            
            <!-- Documentos entregados -->
            <div class="row mb-4">
                <div class="col-12">
                    <h5 class="bg-warning text-dark p-2 rounded">DOCUMENTOS ENTREGADOS</h5>
                </div>
                <div class="col-12">
                    ${matricula.documentos && matricula.documentos.length > 0 ? 
                        matricula.documentos.map(doc => {
                            const docNames = {
                                'acta_nacimiento': 'Acta de Nacimiento',
                                'record_notas': 'Record de Notas',
                                'fotos': '2 Fotos 2x2',
                                'certificado_medico': 'Certificado Médico',
                                'cedula_tutor1': 'Cédula Tutor 1',
                                'cedula_tutor2': 'Cédula Tutor 2',
                                'certificado_ingresos': 'Certificado de Ingresos',
                                'certificado_trabajo': 'Certificado de Trabajo'
                            };
                            return `<span class="badge bg-success me-1 mb-1">${docNames[doc] || doc}</span>`;
                        }).join('') 
                        : '<span class="text-muted">No se han registrado documentos entregados</span>'
                    }
                </div>
            </div>
            
            <!-- Observaciones -->
            ${matricula.observaciones ? `
                <div class="row mb-4">
                    <div class="col-12">
                        <h5 class="bg-secondary text-white p-2 rounded">OBSERVACIONES</h5>
                        <p>${matricula.observaciones}</p>
                    </div>
                </div>
            ` : ''}
            
            <!-- Firmas -->
            <div class="row mt-5">
                <div class="col-md-4 text-center">
                    <div style="border-top: 1px solid #000; margin-top: 60px; padding-top: 5px;">
                        <small>Firma del Tutor</small>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div style="border-top: 1px solid #000; margin-top: 60px; padding-top: 5px;">
                        <small>Firma del Director</small>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div style="border-top: 1px solid #000; margin-top: 60px; padding-top: 5px;">
                        <small>Sello de la Institución</small>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <small class="text-muted">
                    Documento generado el ${formatDate(new Date().toISOString(), true)}
                </small>
            </div>
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = content;
}

// Imprimir matrícula
function printMatricula() {
    window.print();
}

// Exportar matrícula a PDF
function exportMatriculaPDF() {
    const content = document.getElementById('previewContent');
    
    try {
        if (typeof window.jsPDF === 'undefined') {
            showAlert.error('Error', 'La librería jsPDF no está disponible');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar el documento
        doc.setFontSize(16);
        doc.text('FORMULARIO DE MATRÍCULA', 20, 20);
        doc.setFontSize(12);
        doc.text('Escuela Jesús El Buen Maestro', 20, 30);
        
        // Obtener datos del formulario actual
        const form = document.getElementById('matriculaForm');
        const formData = new FormData(form);
        
        let yPosition = 50;
        const lineHeight = 8;
        
        // Información del estudiante
        doc.setFontSize(14);
        doc.text('INFORMACIÓN DEL ESTUDIANTE', 20, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.text(`Nombres: ${formData.get('nombres') || ''}`, 20, yPosition);
        doc.text(`Apellidos: ${formData.get('apellidos') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Cédula: ${formData.get('cedula') || ''}`, 20, yPosition);
        doc.text(`Género: ${formData.get('genero') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Fecha Nacimiento: ${formData.get('fechaNacimiento') || ''}`, 20, yPosition);
        yPosition += lineHeight * 2;
        
        // Información académica
        doc.setFontSize(14);
        doc.text('INFORMACIÓN ACADÉMICA', 20, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.text(`Grado: ${getGradoText(formData.get('grado')) || ''}`, 20, yPosition);
        doc.text(`Año Lectivo: ${formData.get('anoLectivo') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Modalidad: ${formData.get('modalidad') || ''}`, 20, yPosition);
        doc.text(`Monto: ${formatCurrency(formData.get('montoMatricula') || 0)}`, 110, yPosition);
        yPosition += lineHeight * 2;
        
        // Información de tutores
        doc.setFontSize(14);
        doc.text('TUTOR PRINCIPAL', 20, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.text(`Nombres: ${formData.get('nombresTutor1') || ''}`, 20, yPosition);
        doc.text(`Apellidos: ${formData.get('apellidosTutor1') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Cédula: ${formData.get('cedulaTutor1') || ''}`, 20, yPosition);
        doc.text(`Parentesco: ${formData.get('parentescoTutor1') || ''}`, 110, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Teléfono: ${formData.get('telefonoTutor1') || ''}`, 20, yPosition);
        yPosition += lineHeight;
        
        const fileName = `matricula_${formData.get('nombres') || 'estudiante'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);
        
        showAlert.success('¡Exportado!', 'El archivo PDF se ha generado correctamente');
        
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showAlert.error('Error', 'No se pudo generar el archivo PDF');
    }
}

// Actualizar estadísticas
function updateMatriculasStats() {
    const stats = {
        activas: matriculasData.filter(m => m.estado === 'Activa').length,
        esteMes: matriculasData.filter(m => {
            const fecha = new Date(m.fechaMatricula);
            const hoy = new Date();
            return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
        }).length,
        pendientes: matriculasData.filter(m => m.estado === 'Pendiente').length,
        ingresos: matriculasData
            .filter(m => m.estado === 'Activa')
            .reduce((total, m) => total + (parseFloat(m.montoMatricula) || 0), 0)
    };
    
    document.getElementById('total-matriculas-activas').textContent = stats.activas;
    document.getElementById('matriculas-este-mes').textContent = stats.esteMes;
    document.getElementById('matriculas-pendientes').textContent = stats.pendientes;
    document.getElementById('ingresos-matriculas').textContent = formatCurrency(stats.ingresos);
}

// Exportar todas las matrículas
function exportMatriculas() {
    if (matriculasData.length === 0) {
        showAlert.warning('Sin datos', 'No hay matrículas para exportar');
        return;
    }
    
    const dataToExport = matriculasData.map(matricula => ({
        'Estudiante': `${matricula.nombres} ${matricula.apellidos}`,
        'Cédula': matricula.cedula || '',
        'Grado': getGradoText(matricula.grado),
        'Año Lectivo': matricula.anoLectivo,
        'Estado': matricula.estado,
        'Modalidad': matricula.modalidad,
        'Fecha Matrícula': formatDateShort(matricula.fechaMatricula),
        'Monto': matricula.montoMatricula,
        'Tutor Principal': `${matricula.nombresTutor1} ${matricula.apellidosTutor1}`,
        'Teléfono Tutor': matricula.telefonoTutor1,
        'Observaciones': matricula.observaciones || ''
    }));
    
    exportToExcel('Registro de Matrículas', dataToExport, 'matriculas_' + new Date().toISOString().split('T')[0]);
}

// Refrescar datos
function refreshMatriculas() {
    loadMatriculasData();
    updateMatriculasStats();
    showAlert.success('Actualizado', 'Los datos han sido actualizados');
}