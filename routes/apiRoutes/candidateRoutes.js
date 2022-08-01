const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

/* CANDIDATES SECTION */

// Get all candidates
router.get('/candidates', (req,res) => {
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
router.get('/candidates/:id', (req,res) => {
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
 router.delete('/candidates/:id', (req,res) => {
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
router.post('/candidates',({ body}, res) => {
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
router.put('/candidate/:id', (req, res) =>  {
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

module.exports = router;