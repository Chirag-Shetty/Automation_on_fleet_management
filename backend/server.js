require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/funds', require('./routes/funds'));
// Razorpay webhook requires raw body
app.post('/api/funds/webhook', bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf; } }), require('./routes/funds').handlers?.webhook || ((req,res)=>res.end()));

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// basic route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

/*
 * API routes
 */
const authRoutes = require('./routes/auth');
app.use('/api/donations', require('./routes/donations'));
app.use('/api/admin', require('./routes/admin'));
const hungerRoutes = require('./routes/hungerSpots');
app.use('/api/auth', authRoutes);
app.use('/api/donations', hungerRoutes);
app.use('/api/hunger-spots', hungerRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
