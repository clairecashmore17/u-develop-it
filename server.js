const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//Importing mysql from our connection.js folder
const db = require('./db/connection');

//This was a function created by bootcamp
const inputCheck = require('./utils/inputCheck');

//API routes 
const apiRoutes = require('./routes/apiRoutes');

// adding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Set up the api from the apiRoutes
app.use('/api', apiRoutes);


//handle user requests not supported by app(NOT FOUND) catchall route
app.use((req,res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });