const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// addding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//GET test
app.get('/', (req,res) => {
    res.json({
        message: 'Hello world!'
    });
});

//handle user requests not supported by app(NOT FOUND)
app.use((req,res) => {
    res.status(404).end();
});

// function to start the server on the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});