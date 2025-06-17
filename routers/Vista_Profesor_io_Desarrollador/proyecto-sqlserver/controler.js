const { poolPromise, sql } = require('../models/tutorial.model');

// Crear y guardar un nuevo tutorial
exports.create = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', sql.NVarChar, req.body.title)
      .input('description', sql.NVarChar, req.body.description)
      .input('published', sql.Bit, req.body.published || false)
      .query('INSERT INTO Tutorials (title, description, published) VALUES (@title, @description, @published); SELECT SCOPE_IDENTITY() AS id');
    
    res.send({ id: result.recordset[0].id, ...req.body });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Obtener todos los tutoriales
exports.findAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Tutorials');
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Otros métodos CRUD (findOne, update, delete) pueden implementarse de manera similar