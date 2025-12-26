const mongoose = require('mongoose');

// Stores every successful monetary donation
const fundSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, // store smallest currency unit (paise)
    currency: { type: String, default: 'INR' },
  donorName: String,
  message: String,
    razorpayPaymentId: String,
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fund', fundSchema);
