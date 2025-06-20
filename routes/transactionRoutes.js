const express = require('express');
const router = express.Router();
const {
  earnPoints,
  redeemReward,
  getUserTransactions
} = require('../controllers/transactionController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/earn', verifyJWT, earnPoints);
router.post('/redeem', verifyJWT, redeemReward);
router.get('/my-transactions', verifyJWT, getUserTransactions);

module.exports = router;
