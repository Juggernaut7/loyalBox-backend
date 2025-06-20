// controllers/userController.js
const User = require('../models/User');

exports.promoteToAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: `${user.email} promoted to admin.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
