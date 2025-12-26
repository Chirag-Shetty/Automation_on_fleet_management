const router = require('express').Router();
const Fund = require('../models/Fund');
const Razorpay = require('razorpay');

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/funds/order  => create Razorpay order
router.post('/order', async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const order = await razor.orders.create({
      amount: amount * 100, // convert to paise
      currency: 'INR',
      payment_capture: 1,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Razorpay webhook
router.post('/webhook', (req, res) => {
  // Razorpay sends JSON; signature header 'x-razorpay-signature'
  const payload = JSON.stringify(req.body);
  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  const received = req.headers['x-razorpay-signature'];

  if (expected !== received) return res.status(400).json({ message: 'Signature mismatch' });

  if (req.body.event === 'payment.captured') {
    const p = req.body.payload.payment.entity;
    Fund.create({
      amount: p.amount, // paise
      currency: p.currency,
      razorpayPaymentId: p.id,
    }).catch(console.error);
  }
  res.json({ status: 'ok' });
});

// POST /api/funds/confirm  => called from frontend after payment success
router.post('/confirm', async (req, res) => {
  try {
    const { amount, paymentId, currency = 'INR', donorName, message } = req.body; // amount in rupees
    await Fund.create({
      amount: Math.round(amount * 100),
      currency,
      razorpayPaymentId: paymentId,
      donorName,
      message,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error recording donation' });
  }
});

// GET /api/funds  => list recent donations
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const funds = await Fund.find().sort({ createdAt: -1 }).limit(limit);
    res.json(funds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// GET /api/funds/total
router.get('/total', async (_req, res) => {
  const [{ total = 0 } = {}] = await Fund.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  res.json({ total: total / 100 }); // back to rupees
});

module.exports = router;
