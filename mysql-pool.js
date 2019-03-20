var mysql = require('mysql')
var util = require('util')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'art123456789art',
    database: 'task'
});

pool.query = util.promisify(pool.query)

module.exports = pool