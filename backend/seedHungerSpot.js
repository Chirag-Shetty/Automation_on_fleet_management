require('dotenv').config();
const mongoose = require('mongoose');
const HungerSpot = require('./models/HungerSpot');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if hunger spot already exists
    const existing = await HungerSpot.findOne({ locationText: 'Test Hunger Centre' });
    if (existing) {
      console.log('Test hunger spot already exists');
    } else {
      // Create a test hunger spot with coordinates (Mumbai, India)
      await HungerSpot.create({
        description: 'A test hunger centre for food donations',
        locationText: 'Test Hunger Centre',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760] // [longitude, latitude] for Mumbai
        }
      });
      console.log('Test hunger spot created with coordinates');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})(); 