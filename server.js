const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//mysql package
const mysql = require('mysql2');

// addding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

//GET test
app.get('/', (req,res) => {
    res.json({
        message: 'Hello world!'
    });
});

// gets the table of candidates, displayed in text rows
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     // console.log(rows);
// })

// // GET a single candidate based on ID
// db.query(`SELECT * FROM candidates WHERE id =1`, (err, row) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(row);
// })

// DELETE a single candidate based on ID
/* Notice we have id set to ?, making it a prepared statement. This can execute SQL statements repeatedly using different values in place of the ? */
// db.query(`DELETE FROM candidates WHERE id = ?`,1,(err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// })

// CREATE a single candidate 
// const sql = `INSERT INTO candidates (id, first_name,last_name, industry_connected)
// VALUES( ?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//handle user requests not supported by app(NOT FOUND) catchall route
app.use((req,res) => {
    res.status(404).end();
});

// function to start the server on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});