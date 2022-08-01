const mysql = require('mysql2');

//connect to our mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username
        user: 'root',
        //your password
        password: 'password',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;