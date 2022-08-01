const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');
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



// Get all candidates
app.get('/api/candidates', (req,res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;

    // gets the table of candidates, displayed in text rows
    db.query(sql, (err, rows) => {
        if(err) {
            // 500 is a server eroor rather than 404 request error
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//displays the candidate with specific ID
app.get('/api/candidates/:id', (req,res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    // selects the id that is used in url after slash
    const params = [req.params.id];
    // GET a single candidate based on ID using params
    db.query(sql, params,(err, row) => {
        if(err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

app.delete('/api/candidates/:id', (req,res) => {
    const sql =`DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    // DELETE a single candidate based on ID
    /* Notice we have id set to ?, making it a prepared statement. This can execute SQL statements repeatedly using different values in place of the ? */
    db.query(sql,params,(err, result) => {
        if(err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// CREATE a candidate
app.post('/api/candidates',({ body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});
//handle user requests not supported by app(NOT FOUND) catchall route
app.use((req,res) => {
    res.status(404).end();
});

// function to start the server on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});