const express = require('express');
const router = express.Router();

const User = require('../models/User');
const HungerSpot = require('../models/HungerSpot');

// GET /api/admin/users - list all users (basic fields)
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// POST /api/admin/hunger-spots  - create hunger spot (admin)
router.post('/hunger-spots', async (req, res) => {
  try {
    const { description, locationText, lat, lng } = req.body;
    const spot = await HungerSpot.create({
      description,
      locationText,
      location: lat && lng ? { coordinates: [lng, lat] } : undefined,
      reportedBy: null, // admin created
    });
    res.status(201).json(spot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating hunger spot' });
  }
});

// GET /api/admin/metrics - overview counts
router.get('/metrics', async (_req, res) => {
  try {
    const [totalUsers, activeDonors, activeVolunteers, totalHungerSpots, pendingSpots, resolvedSpots, totalDonations] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'volunteer' }),
      HungerSpot.countDocuments(),
      HungerSpot.countDocuments({ status: 'pending' }),
      HungerSpot.countDocuments({ status: { $in: ['completed', 'accepted', 'resolved'] } }),
      require('../models/Donation').countDocuments(),
    ]);

    res.json({
      totalUsers,
      activeDonors,
      activeVolunteers,
      totalHungerSpots,
      pendingSpots,
      resolvedSpots,
      totalDonations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching metrics' });
  }
});

// GET /api/admin/hunger-spots - list all reported hunger spots
router.get('/hunger-spots', async (_req, res) => {
  try {
    const spots = await HungerSpot.find().populate('reportedBy', 'name');
    res.json(spots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching hunger spots' });
  }
});

module.exports = router;
