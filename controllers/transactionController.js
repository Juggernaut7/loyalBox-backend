const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Reward = require('../models/Reward');

// Earn Points Controller
const earnPoints = async (req, res) => {
  const userId = req.user.id;
  const { itemName, price } = req.body;

  if (!itemName || !price) {
    return res.status(400).json({ message: 'Item name and price are required' });
  }

  const pointsEarned = Math.floor(price / 10); // 1 point per ₦10

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += pointsEarned;
    await user.save();

    const transaction = new Transaction({
      user: userId,
      type: 'earn',
      points: pointsEarned,
      source: `Bought ${itemName}`
    });

    await transaction.save();

    res.status(201).json({
      message: `You earned ${pointsEarned} points for buying ${itemName}`,
      currentPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Redeem Reward Controller
const redeemReward = async (req, res) => {
  const userId = req.user.id;
  const { rewardId } = req.body;

  if (!rewardId) return res.status(400).json({ message: 'Reward ID is required' });

  try {
    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.points < reward.cost) {
      return res.status(400).json({ message: 'Not enough points to redeem this reward' });
    }

    user.points -= reward.cost;
    await user.save();

    const transaction = new Transaction({
      user: userId,
      type: 'redeem',
      points: -reward.cost,
      source: `Redeemed: ${reward.name}`
    });

    await transaction.save();

    res.status(200).json({
      message: `You redeemed "${reward.name}" for ${reward.cost} points`,
      currentPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Redemption failed', error: error.message });
  }
};

// View User Transactions Controller
const getUserTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

module.exports = {
  earnPoints,
  redeemReward,
  getUserTransactions
};
