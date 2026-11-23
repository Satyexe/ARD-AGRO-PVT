const router = require('express').Router();
const { Setting, Page, Testimonial, TeamMember, Partner } = require('../models');
// One call returns everything the public site needs
router.get('/', async (req, res, next) => {
  try {
    const [settings, pages, testimonials, team, partners] = await Promise.all([
      Setting.findOne({ key: 'site' }).lean(),
      Page.find().select('slug title menuGroup parent showOnHome order summary image cardImage').sort('order').lean(),
      Testimonial.find().sort('order').lean(),
      TeamMember.find().sort('order').lean(),
      Partner.find().sort('order').lean()
    ]);
    res.json({ settings: settings?.data || {}, pages, testimonials, team, partners });
  } catch (e) { next(e); }
});
module.exports = router;
