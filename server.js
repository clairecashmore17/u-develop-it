const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');
//mysql package
const mysql = require('mysql2');
const { resourceLimits } = require('worker_threads');

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

/* CANDIDATES SECTION */

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


 // DELETE a single candidate based on ID
 app.delete('/api/candidates/:id', (req,res) => {
    const sql =`DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
   
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

//UPDATE a candidate
app.put('/api/candidate/:id', (req, res) =>  {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `UPDATE candidates SET party_id = ? 
    WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
    } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate not found'
        });
    } else {
        res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
        });
        }
    });
});
/* PARTIES SECTION */

// Route to get out parties
app.get('/api/parties', (req,res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Route to find party by single ID
app.get('/apiparty/:id', (res,req) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            messgae: 'success',
            data: row
        });
    });
});

//DELETE a party based on ID
app.delete('/api/parties/:id', (req,res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql,params, (err,result)=> {
        if(err){
            res.status(400).json({ error: err.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
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








//handle user requests not supported by app(NOT FOUND) catchall route
app.use((req,res) => {
    res.status(404).end();
});

// function to start the server on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});