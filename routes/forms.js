const router = require('express').Router();
const { Enquiry, Subscriber } = require('../models');
const auth = require('../middleware/auth');
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/enquiries', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !emailRx.test(email || '') || !message) return res.status(400).json({ message: 'Name, valid email and message are required' });
  await Enquiry.create({ name, email, phone, subject, message });
  res.status(201).json({ message: 'Thank you! We will get back to you shortly.' });
});
router.get('/enquiries', auth, async (req, res) => res.json(await Enquiry.find().sort('-createdAt')));
router.patch('/enquiries/:id/read', auth, async (req, res) => res.json(await Enquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true })));
router.delete('/enquiries/:id', auth, async (req, res) => { await Enquiry.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

router.post('/subscribers', async (req, res) => {
  const { email, website } = req.body;
  if (!emailRx.test(email || '')) return res.status(400).json({ message: 'Enter a valid email' });
  try { await Subscriber.create({ email, website }); }
  catch (e) { if (e.code === 11000) return res.json({ message: 'You are already subscribed.' }); throw e; }
  res.status(201).json({ message: 'Subscribed successfully!' });
});
router.get('/subscribers', auth, async (req, res) => res.json(await Subscriber.find().sort('-createdAt')));
router.delete('/subscribers/:id', auth, async (req, res) => { await Subscriber.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
