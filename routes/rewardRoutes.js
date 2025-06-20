const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');

// 🟢 Public — View all rewards
router.get('/', rewardController.getAllRewards);

// 🔐 Admin-only — Create/Update/Delete rewards
router.post('/', verifyJWT, verifyRoles('admin'), rewardController.createReward);
router.put('/:id', verifyJWT, verifyRoles('admin'), rewardController.updateReward);
router.delete('/:id', verifyJWT, verifyRoles('admin'), rewardController.deleteReward);

// 🧑‍💼 Authenticated User — Redeem a reward
router.post('/redeem/:rewardId', verifyJWT, rewardController.redeemReward);

module.exports = router;
