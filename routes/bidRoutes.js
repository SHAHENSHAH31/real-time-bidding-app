const express = require('express');
const { getBids, placeBid } = require('../controllers/bidController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:itemId/bids', getBids);
router.post('/:itemId/bids', authMiddleware, placeBid);

module.exports = router;
