var knex = require('knex')({
    client : 'mysql',
    connection : {
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'intern' 
    }
});
var mysql = require('mysql');
var connnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'intern'
});
module.exports = {
    knex : knex,
    koneksi : connnection
}