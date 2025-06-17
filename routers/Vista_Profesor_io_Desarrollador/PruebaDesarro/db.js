const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        throw error;
    }
}

module.exports = { getConnection, sql };

//Bd conection
// Función para actualizar estadísticas del dashboard
async function updateDashboardStats() {
    try {
        const pool = await getConnection();
        
        // Ejecutar consultas para obtener estadísticas
        const estudiantesQuery = await pool.request().query('SELECT COUNT(*) AS total FROM Estudiantes');
        const profesoresQuery = await pool.request().query('SELECT COUNT(*) AS total FROM Profesores');
        const tutoresQuery = await pool.request().query('SELECT COUNT(*) AS total FROM Tutores');
        const matriculasQuery = await pool.request().query('SELECT COUNT(*) AS total FROM Matriculas');
        
        // Actualizar contadores principales
        document.getElementById('dashboard-estudiantes').textContent = estudiantesQuery.recordset[0].total || 0;
        document.getElementById('dashboard-profesores').textContent = profesoresQuery.recordset[0].total || 0;
        document.getElementById('dashboard-tutores').textContent = tutoresQuery.recordset[0].total || 0;
        document.getElementById('dashboard-matriculas').textContent = matriculasQuery.recordset[0].total || 0;
        
    } catch (error) {
        console.error('Error al actualizar estadísticas del dashboard:', error);
        // Mostrar valores por defecto
        document.getElementById('dashboard-estudiantes').textContent = '0';
        document.getElementById('dashboard-profesores').textContent = '0';
        document.getElementById('dashboard-tutores').textContent = '0';
        document.getElementById('dashboard-matriculas').textContent = '0';
    } finally {
        sql.close(); // Cerrar conexión
    }
}

// Función para cargar feed de actividad
async function loadActivityFeed() {
    try {
        const activityContainer = document.getElementById('activity-feed');
        if (!activityContainer) return;

        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT TOP 10 * FROM SystemLogs 
                ORDER BY timestamp DESC
            `);

        const logs = result.recordset;

        if (logs.length === 0) {
            activityContainer.innerHTML = '<p class="text-muted">No hay actividad reciente</p>';
            return;
        }

        const activityHtml = logs.map(log => {
            const timeAgo = getTimeAgo(log.timestamp);
            const actionIcon = getActionIcon(log.action);
            const actionText = getActionText(log.action, log.collection);
            
            return `
                <div class="d-flex align-items-center mb-3">
                    <div class="icon-circle ${getActionColor(log.action)} me-3" style="width: 35px; height: 35px; font-size: 0.8rem;">
                        <i class="${actionIcon}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-medium">${actionText}</div>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
            `;
        }).join('');

        activityContainer.innerHTML = activityHtml;
        
    } catch (error) {
        console.error('Error al cargar feed de actividad:', error);
        const activityContainer = document.getElementById('activity-feed');
        if (activityContainer) {
            activityContainer.innerHTML = '<p class="text-danger">Error al cargar actividad</p>';
        }
    } finally {
        sql.close(); // Cerrar conexión
    }
}
// Función de inicialización
async function initializeApp() {
    console.log('Inicializando sistema escolar...');
    
    try {
        // Verificar conexión a la base de datos
        const pool = await getConnection();
        await pool.request().query('SELECT 1');
        console.log('Conexión a SQL Server establecida correctamente');
        
        // Cargar dashboard por defecto
        showSection('dashboard');
        
        // Actualizar estadísticas del dashboard
        await updateDashboardStats();
        
        // Configurar alertas globales
        setupGlobalAlerts();
        
        console.log('Sistema escolar inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showGlobalAlert('Error al conectar con la base de datos', 'error');
    } finally {
        sql.close(); // Cerrar conexión
    }
}async function loadEstudiantesSection() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Estudiantes');
        
        const tableBody = document.getElementById('estudiantes-table-body');
        tableBody.innerHTML = result.recordset.map(estudiante => `
            <tr>
                <td>${estudiante.id}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.edad}</td>
                <td>${estudiante.grado}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editEstudiante(${estudiante.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEstudiante(${estudiante.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        showGlobalAlert('Error al cargar estudiantes', 'error');
    } finally {
        sql.close();
    }
}

async function saveEstudiante(estudianteData) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.NVarChar, estudianteData.nombre)
            .input('apellido', sql.NVarChar, estudianteData.apellido)
            .input('edad', sql.Int, estudianteData.edad)
            .input('grado', sql.NVarChar, estudianteData.grado)
            .query(`
                INSERT INTO Estudiantes (nombre, apellido, edad, grado)
                VALUES (@nombre, @apellido, @edad, @grado)
            `);
            
        showGlobalAlert('Estudiante guardado correctamente', 'success');
        loadEstudiantesSection();
        
    } catch (error) {
        console.error('Error al guardar estudiante:', error);
        showGlobalAlert('Error al guardar estudiante', 'error');
    } finally {
        sql.close();
    }
}
// Simulación de gestor de sincronización
const syncManager = {
    async getSyncReport() {
        try {
            const pool = await getConnection();
            const pendingChanges = await pool.request()
                .query('SELECT COUNT(*) AS count FROM SyncQueue WHERE status = \'pending\'');
                
            return {
                pendingChanges: pendingChanges.recordset[0].count,
                lastSync: new Date().toISOString(),
                status: pendingChanges.recordset[0].count > 0 ? 'pending' : 'synced'
            };
        } catch (error) {
            console.error('Error al obtener reporte de sincronización:', error);
            return {
                pendingChanges: 0,
                lastSync: null,
                status: 'error'
            };
        } finally {
            sql.close();
        }
    },
    
    async forceSyncAll() {
        try {
            const pool = await getConnection();
            await pool.request().query('EXEC sp_ProcessSyncQueue');
            showGlobalAlert('Sincronización completada', 'success');
        } catch (error) {
            console.error('Error en sincronización:', error);
            showGlobalAlert('Error en sincronización', 'error');
        } finally {
            sql.close();
        }
    }
};

window.syncManager = syncManager;