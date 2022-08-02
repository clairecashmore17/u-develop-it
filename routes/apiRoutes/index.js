const express = require('express');
const router = express.Router();

//adding the candidates routing
router.use(require('./candidateRoutes'));

//adding the parties routing
router.use(require('./partyRoutes'));

//adding the voters routing
router.use(require('./voterRoutes'));

//adding votes routing
router.use(require('./voteRoutes'));
module.exports = router;