const express = require('express');
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a donation (donor)
router.post('/', async (req, res) => {
  try {
    const { productName, servings, location, deliveryOption } = req.body;
    const donation = await Donation.create({
      donor: req.user ? req.user._id : undefined,
      productName,
      servings,
      location,
      deliveryOption,
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending donations for volunteers
router.get('/pending', protect, authorize('volunteer'), async (req, res) => {
  const donations = await Donation.find({ deliveryOption: 'volunteer', status: 'pending' }).populate('donor', 'name email');
  res.json(donations);
});

// Volunteer accepts a donation
router.patch('/:id/accept', protect, authorize('volunteer'), async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  if (donation.status !== 'pending') return res.status(400).json({ message: 'Already accepted' });
  donation.status = 'accepted';
  donation.acceptedBy = req.user._id;
  await donation.save();
  res.json(donation);
});

// Get donations accepted by the logged-in volunteer
router.get('/accepted', protect, authorize('volunteer'), async (req, res) => {
  const donations = await Donation.find({ status: 'accepted', acceptedBy: req.user._id }).populate('donor', 'name email');
  res.json(donations);
});

module.exports = router;
