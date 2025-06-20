
const User = require('../models/User');

const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction'); // ✅ Make sure this model is imported


// @desc    Get all rewards (public)
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rewards', error: err.message });
  }
};

// @desc    Create new reward (admin only)
exports.createReward = async (req, res) => {
  const { title, description, pointsRequired } = req.body;

  if (!title || !pointsRequired) {
    return res.status(400).json({ message: 'Title and pointsRequired are required' });
  }

  try {
    const reward = new Reward({
      title,
      description,
      pointsRequired,
      createdBy: req.user.id
    });

    await reward.save();
    res.status(201).json({ message: 'Reward created successfully', reward });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create reward', error: err.message });
  }
};

// @desc    Update reward (admin only)
exports.updateReward = async (req, res) => {
  const { title, description, pointsRequired } = req.body;

  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      { title, description, pointsRequired },
      { new: true, runValidators: true }
    );

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    res.status(200).json({ message: 'Reward updated successfully', reward });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reward', error: err.message });
  }
};

// @desc    Delete reward (admin only)
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete reward', error: err.message });
  }
};

exports.redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rewardId } = req.params;

    // 1. Get reward
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    // 2. Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Check if user has enough points
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ message: 'Insufficient points to redeem this reward' });
    }

    // 4. Deduct points & save reward redemption
    user.points -= reward.pointsRequired;
    user.redeemedRewards.push({
      reward: reward._id,
      redeemedAt: new Date()
    });

    await user.save();

    // 5. Log redemption as a transaction
    const transaction = new Transaction({
      user: userId,
      type: 'redeem',
      points: -reward.pointsRequired,
      source: `Redeemed: ${reward.title}`
    });

    await transaction.save();

    // 6. Return success response
    res.status(200).json({
      message: `You redeemed "${reward.title}" for ${reward.pointsRequired} points`,
      reward: {
        title: reward.title,
        description: reward.description,
        pointsRequired: reward.pointsRequired
      },
      currentPoints: user.points
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to redeem reward', error: err.message });
  }
};
