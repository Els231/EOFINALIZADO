const sql = require('mssql');
const dbConfig = require('../config/db.config');

// Crear conexión
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.log('Error de conexión: ', err));

module.exports = {
  sql, poolPromise
};