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

db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
})

//handle user requests not supported by app(NOT FOUND) catchall route
app.use((req,res) => {
    res.status(404).end();
});

// function to start the server on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});