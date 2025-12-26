const mongoose = require('mongoose');

const hungerSpotSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    description: { type: String, required: true },
    locationText: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HungerSpot', hungerSpotSchema);
