const mongoose = require('mongoose');
const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  pointsRequired: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
