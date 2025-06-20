const User = require('../models/User');

// Admin can reward a user with points
const rewardUserPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;

    if (!userId || typeof points !== 'number') {
      return res.status(400).json({ message: 'User ID and numeric points are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += points;
    await user.save();

    res.status(200).json({ message: `User rewarded with ${points} points`, updatedPoints: user.points });
  } catch (err) {
    res.status(500).json({ message: 'Server error rewarding user', error: err.message });
  }
};

module.exports = { rewardUserPoints };
