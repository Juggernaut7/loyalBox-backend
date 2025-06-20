const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  points: {
  type: Number, default: 0,},
  redeemedRewards: [
  {
    reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
    redeemedAt: { type: Date, default: Date.now }
  }
]


}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
