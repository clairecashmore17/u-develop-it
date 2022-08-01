const express = require('express');
const router = express.Router();

//adding the candidates routing
router.use(require('./candidateRoutes'));

//adding the parties routing
router.use(require('./partyRoutes'));
module.exports = router;