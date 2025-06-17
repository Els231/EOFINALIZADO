/**
 * Servidor backend para conectar el sistema escolar con MSSQL
 * Configuración con Express.js y mssql
 */

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configuración de la base de datos MSSQL
const dbConfig = {
    server: process.env.DB_SERVER || 'MARVINCHAVARRIA\SQL2022',
    database: process.env.DB_NAME || 'WebEo',
    user: process.env.DB_USER || 'MARVINCHAVARRIA\Marvin Acevedo',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Para Azure
        trustServerCertificate: true, // Para desarrollo local
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Pool de conexiones
let poolPromise;

// Inicializar conexión a la base de datos
async function initializeDatabase() {
    try {
        poolPromise = sql.connect(dbConfig);
        await poolPromise;
        console.log('✅ Conectado a SQL Server');
        
        // Crear tablas si no existen
        await createTables();
        
    } catch (error) {
        console.warn('⚠️ No se pudo conectar a MSSQL, funcionando en modo localStorage:', error.message);
        // No terminar el proceso, usar fallback
        global.useFallback = true;
    }
}

// Crear tablas del sistema escolar
async function createTables() {
    try {
        const pool = await poolPromise;
        
        // Tabla de estudiantes
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='estudiantes' AND xtype='U')
            CREATE TABLE estudiantes (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL,
                apellido NVARCHAR(100) NOT NULL,
                cedula NVARCHAR(20),
                fecha_nacimiento DATE,
                genero NVARCHAR(20),
                grado NVARCHAR(10),
                turno_id NVARCHAR(50),
                tutor_id NVARCHAR(50),
                telefono NVARCHAR(20),
                email NVARCHAR(100),
                direccion NTEXT,
                estado NVARCHAR(20) DEFAULT 'Activo',
                observaciones NTEXT,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tabla de profesores
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='profesores' AND xtype='U')
            CREATE TABLE profesores (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL,
                apellido NVARCHAR(100) NOT NULL,
                cedula NVARCHAR(20) NOT NULL,
                telefono NVARCHAR(20) NOT NULL,
                email NVARCHAR(100) NOT NULL,
                especialidad NVARCHAR(100),
                direccion NTEXT,
                estado NVARCHAR(20) DEFAULT 'Activo',
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tabla de tutores
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tutores' AND xtype='U')
            CREATE TABLE tutores (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL,
                apellido NVARCHAR(100) NOT NULL,
                cedula NVARCHAR(20) NOT NULL,
                parentesco NVARCHAR(50) NOT NULL,
                genero NVARCHAR(20),
                telefono NVARCHAR(20) NOT NULL,
                email NVARCHAR(100),
                ocupacion_id NVARCHAR(50),
                lugar_trabajo NVARCHAR(200),
                direccion NTEXT NOT NULL,
                estado NVARCHAR(20) DEFAULT 'Activo',
                observaciones NTEXT,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tabla de matrículas
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='matriculas' AND xtype='U')
            CREATE TABLE matriculas (
                id NVARCHAR(50) PRIMARY KEY,
                codigo NVARCHAR(50) NOT NULL UNIQUE,
                estudiante_id NVARCHAR(50) NOT NULL,
                grado NVARCHAR(10) NOT NULL,
                turno_id NVARCHAR(50),
                ano_escolar NVARCHAR(20) NOT NULL,
                fecha_matricula DATE NOT NULL,
                estado NVARCHAR(20) DEFAULT 'Pendiente',
                observaciones NTEXT,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tabla de inscripciones
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inscripciones' AND xtype='U')
            CREATE TABLE inscripciones (
                id NVARCHAR(50) PRIMARY KEY,
                codigo NVARCHAR(50) NOT NULL UNIQUE,
                solicitante_nombre NVARCHAR(200) NOT NULL,
                solicitante_telefono NVARCHAR(20) NOT NULL,
                estudiante_nombre NVARCHAR(100) NOT NULL,
                estudiante_apellido NVARCHAR(100) NOT NULL,
                estudiante_fecha_nacimiento DATE NOT NULL,
                estudiante_genero NVARCHAR(20) NOT NULL,
                grado_solicitado NVARCHAR(10) NOT NULL,
                fecha_solicitud DATE NOT NULL,
                estado NVARCHAR(20) DEFAULT 'En Proceso',
                documentos NTEXT,
                observaciones NTEXT,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tabla de notas
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notas' AND xtype='U')
            CREATE TABLE notas (
                id NVARCHAR(50) PRIMARY KEY,
                estudiante_id NVARCHAR(50) NOT NULL,
                profesor_id NVARCHAR(50) NOT NULL,
                materia_id NVARCHAR(50) NOT NULL,
                periodo NVARCHAR(50) NOT NULL,
                nota DECIMAL(5,2) NOT NULL,
                comentarios NTEXT,
                fecha_registro DATE DEFAULT GETDATE(),
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Tablas de catálogos
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='turnos' AND xtype='U')
            CREATE TABLE turnos (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(50) NOT NULL,
                hora_inicio TIME NOT NULL,
                hora_fin TIME NOT NULL,
                activo BIT DEFAULT 1
            )
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='materias' AND xtype='U')
            CREATE TABLE materias (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL,
                codigo NVARCHAR(10) NOT NULL,
                creditos INT DEFAULT 1,
                activa BIT DEFAULT 1
            )
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ocupaciones' AND xtype='U')
            CREATE TABLE ocupaciones (
                id NVARCHAR(50) PRIMARY KEY,
                nombre NVARCHAR(100) NOT NULL
            )
        `);

        // Tabla de logs del sistema
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='system_logs' AND xtype='U')
            CREATE TABLE system_logs (
                id NVARCHAR(50) PRIMARY KEY,
                action NVARCHAR(50) NOT NULL,
                collection_name NVARCHAR(50) NOT NULL,
                record_id NVARCHAR(50),
                details NTEXT,
                timestamp DATETIME2 DEFAULT GETDATE(),
                user_name NVARCHAR(100) DEFAULT 'sistema'
            )
        `);

        console.log('✅ Tablas creadas/verificadas correctamente');
        
        // Insertar datos iniciales si están vacías
        await insertInitialData();
        
    } catch (error) {
        console.error('❌ Error creando tablas:', error);
    }
}

// Insertar datos iniciales
async function insertInitialData() {
    try {
        const pool = await poolPromise;
        
        // Verificar si ya hay datos
        const turnosCount = await pool.request().query('SELECT COUNT(*) as count FROM turnos');
        
        if (turnosCount.recordset[0].count === 0) {
            // Insertar turnos
            await pool.request().query(`
                INSERT INTO turnos (id, nombre, hora_inicio, hora_fin, activo) VALUES
                ('1', 'Matutino', '07:00', '12:00', 1),
                ('2', 'Vespertino', '13:00', '18:00', 1)
            `);

            // Insertar materias
            await pool.request().query(`
                INSERT INTO materias (id, nombre, codigo, creditos, activa) VALUES
                ('1', 'Lengua Española', 'ESP', 4, 1),
                ('2', 'Matemáticas', 'MAT', 4, 1),
                ('3', 'Ciencias Naturales', 'CN', 3, 1),
                ('4', 'Ciencias Sociales', 'CS', 3, 1),
                ('5', 'Inglés', 'ING', 2, 1),
                ('6', 'Educación Física', 'EF', 2, 1)
            `);

            // Insertar ocupaciones
            await pool.request().query(`
                INSERT INTO ocupaciones (id, nombre) VALUES
                ('1', 'Empleado'),
                ('2', 'Comerciante'),
                ('3', 'Profesional'),
                ('4', 'Ama de Casa'),
                ('5', 'Otro')
            `);

            console.log('✅ Datos iniciales insertados');
        }
    } catch (error) {
        console.error('❌ Error insertando datos iniciales:', error);
    }
}

// Función helper para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// RUTAS DE LA API

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas genéricas para todas las colecciones
const collections = ['estudiantes', 'profesores', 'tutores', 'matriculas', 'inscripciones', 'notas', 'turnos', 'materias', 'ocupaciones'];

collections.forEach(collection => {
    // GET todos los registros
    app.get(`/api/${collection}`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`SELECT * FROM ${collection} ORDER BY created_at DESC`);
            res.json({ data: result.recordset });
        } catch (error) {
            console.error(`Error obteniendo ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // GET un registro por ID
    app.get(`/api/${collection}/:id`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.NVarChar, req.params.id)
                .query(`SELECT * FROM ${collection} WHERE id = @id`);
            
            if (result.recordset.length > 0) {
                res.json(result.recordset[0]);
            } else {
                res.status(404).json({ error: 'Registro no encontrado' });
            }
        } catch (error) {
            console.error(`Error obteniendo ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // POST crear nuevo registro
    app.post(`/api/${collection}`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const id = generateId();
            const data = { id, ...req.body };
            
            // Construir query dinámicamente
            const columns = Object.keys(data).join(', ');
            const values = Object.keys(data).map(key => `@${key}`).join(', ');
            
            const request = pool.request();
            Object.entries(data).forEach(([key, value]) => {
                request.input(key, value);
            });
            
            await request.query(`INSERT INTO ${collection} (${columns}) VALUES (${values})`);
            
            res.status(201).json(data);
        } catch (error) {
            console.error(`Error creando ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // PUT actualizar registro
    app.put(`/api/${collection}/:id`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const data = { ...req.body, updated_at: new Date() };
            
            // Construir SET clause
            const setClause = Object.keys(data).map(key => `${key} = @${key}`).join(', ');
            
            const request = pool.request();
            request.input('id', sql.NVarChar, req.params.id);
            Object.entries(data).forEach(([key, value]) => {
                request.input(key, value);
            });
            
            const result = await request.query(`
                UPDATE ${collection} 
                SET ${setClause} 
                WHERE id = @id
            `);
            
            if (result.rowsAffected[0] > 0) {
                res.json({ id: req.params.id, ...data });
            } else {
                res.status(404).json({ error: 'Registro no encontrado' });
            }
        } catch (error) {
            console.error(`Error actualizando ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE eliminar registro
    app.delete(`/api/${collection}/:id`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.NVarChar, req.params.id)
                .query(`DELETE FROM ${collection} WHERE id = @id`);
            
            if (result.rowsAffected[0] > 0) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Registro no encontrado' });
            }
        } catch (error) {
            console.error(`Error eliminando ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // GET estadísticas
    app.get(`/api/${collection}/stats`, async (req, res) => {
        try {
            const pool = await poolPromise;
            
            const totalResult = await pool.request()
                .query(`SELECT COUNT(*) as total FROM ${collection}`);
            
            const activeResult = await pool.request()
                .query(`SELECT COUNT(*) as active FROM ${collection} WHERE estado = 'Activo' OR activo = 1`);
            
            const todayResult = await pool.request()
                .query(`SELECT COUNT(*) as today FROM ${collection} WHERE CAST(created_at as DATE) = CAST(GETDATE() as DATE)`);
            
            const monthResult = await pool.request()
                .query(`SELECT COUNT(*) as month FROM ${collection} WHERE YEAR(created_at) = YEAR(GETDATE()) AND MONTH(created_at) = MONTH(GETDATE())`);
            
            res.json({
                total: totalResult.recordset[0].total,
                active: activeResult.recordset[0].active,
                inactive: totalResult.recordset[0].total - activeResult.recordset[0].active,
                created_today: todayResult.recordset[0].today,
                created_this_month: monthResult.recordset[0].month
            });
        } catch (error) {
            console.error(`Error obteniendo estadísticas de ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });

    // GET búsqueda
    app.get(`/api/${collection}/search`, async (req, res) => {
        try {
            const pool = await poolPromise;
            const { q, fields } = req.query;
            
            if (!q) {
                return res.json({ data: [] });
            }
            
            let searchQuery;
            if (fields) {
                const fieldList = fields.split(',');
                const searchConditions = fieldList.map(field => `${field} LIKE @query`).join(' OR ');
                searchQuery = `SELECT * FROM ${collection} WHERE ${searchConditions}`;
            } else {
                // Búsqueda en campos de texto comunes
                searchQuery = `SELECT * FROM ${collection} WHERE nombre LIKE @query OR apellido LIKE @query OR cedula LIKE @query OR codigo LIKE @query`;
            }
            
            const result = await pool.request()
                .input('query', sql.NVarChar, `%${q}%`)
                .query(searchQuery);
            
            res.json({ data: result.recordset });
        } catch (error) {
            console.error(`Error buscando en ${collection}:`, error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Logs del sistema
app.post('/api/system_logs', async (req, res) => {
    try {
        const pool = await poolPromise;
        const id = generateId();
        const data = { id, ...req.body };
        
        await pool.request()
            .input('id', sql.NVarChar, data.id)
            .input('action', sql.NVarChar, data.action)
            .input('collection_name', sql.NVarChar, data.collection)
            .input('record_id', sql.NVarChar, data.record_id)
            .input('details', sql.NText, data.details)
            .input('user_name', sql.NVarChar, data.user || 'sistema')
            .query(`
                INSERT INTO system_logs (id, action, collection_name, record_id, details, user_name)
                VALUES (@id, @action, @collection_name, @record_id, @details, @user_name)
            `);
        
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creando log:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/system_logs', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM system_logs ORDER BY timestamp DESC');
        res.json({ data: result.recordset });
    } catch (error) {
        console.error('Error obteniendo logs:', error);
        res.status(500).json({ error: error.message });
    }
});

// Servir archivos estáticos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sistema-escolar.html'));
});

// Inicializar servidor
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
        console.log(`📊 Dashboard disponible en: http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);