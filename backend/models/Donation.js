const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    productName: { type: String, required: true },
    servings: { type: Number, required: true },
    location: { type: String, required: true },
    deliveryOption: { type: String, enum: ['self', 'volunteer'], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
