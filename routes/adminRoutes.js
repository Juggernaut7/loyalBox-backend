const express = require('express');
const router = express.Router();
const { promoteToAdmin } = require('../controllers/userController');
const { rewardUserPoints } = require('../controllers/adminController'); // <-- Add this line
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');

// Route to promote user to admin
router.put('/promote/:userId', verifyJWT, verifyRoles('admin'), promoteToAdmin);

// Route to reward a user with points
router.post('/reward', verifyJWT, verifyRoles('admin'), rewardUserPoints); // <-- Add this line

module.exports = router;
