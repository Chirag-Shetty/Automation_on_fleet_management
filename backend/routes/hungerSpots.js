const express = require('express');
const HungerSpot = require('../models/HungerSpot');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Report a hunger spot (any logged-in user)
router.post('/', protect, async (req, res) => {
  try {
    const { description, lat, lng, locationText } = req.body;
    const spot = await HungerSpot.create({
      reportedBy: req.user._id,
      description,
      locationText,
      location: { coordinates: [lng, lat] },
    });
    res.status(201).json(spot);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby hunger spots ?lat=&lng=&radius= (km)
router.get('/near', protect, async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: 'lat & lng required' });
  const meters = radius * 1000;
  const spots = await HungerSpot.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: meters,
      },
    },
  });
  res.json(spots);
});

module.exports = router;
